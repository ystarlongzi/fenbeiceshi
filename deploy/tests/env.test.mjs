import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { loadDeployEnv, resolveLocalPath } from "../env.mjs";
import { connection, projectRoot, sha256 } from "../lib.mjs";

test("部署配置只按数据读取，环境变量与 CLI 可覆盖文件", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-env-"));
  const file = path.join(directory, ".env.local");
  const marker = path.join(directory, "executed");
  try {
    await writeFile(
      file,
      `SSH_HOST=server.example.com\nSSH_USER=deploy\nSSH_PORT=22\nSSH_PRIVATE_KEY_FILE="~/.ssh/key with spaces"\nSSH_KNOWN_HOSTS_FILE=~/.ssh/hosts\nSSL_EMAIL="$(touch ${marker})"\n`,
    );
    const env = { SSH_HOST: "override.example.com" };
    const loaded = await loadDeployEnv({ "env-file": file }, env);
    assert.deepEqual(env, { SSH_HOST: "override.example.com" });
    assert.equal(loaded.SSH_HOST, "override.example.com");
    assert.equal(loaded.SSL_EMAIL, `$(touch ${marker})`);
    await assert.rejects(readFile(marker), { code: "ENOENT" });
    const config = connection({ user: "root", port: "2222" }, loaded);
    assert.equal(config.user, "root");
    assert.equal(config.port, "2222");
    assert.equal(config.key, path.join(homedir(), ".ssh/key with spaces"));
    assert.equal(resolveLocalPath("~/config.local"), path.join(homedir(), "config.local"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("显式配置缺失、读取失败或变量写错时拒绝继续，错误不泄露值", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-env-invalid-"));
  const file = path.join(directory, "config.local");
  try {
    await assert.rejects(loadDeployEnv({ "env-file": file }, {}), /无法读取部署配置.*ENOENT/);
    await assert.rejects(loadDeployEnv({ "env-file": directory }, {}), /无法读取部署配置/);
    await writeFile(file, "CF_Token=private-test-value\n");
    await assert.rejects(loadDeployEnv({ "env-file": file }, {}), (error) => {
      assert.match(error.message, /不支持的变量：CF_Token/);
      assert.doesNotMatch(error.message, /private-test-value/);
      return true;
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("自动读取本机副本，缺省时兼容环境变量，Actions 不加载本机配置", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-env-default-"));
  try {
    // 在临时目录加载同一实现，避免创建或覆盖开发者真实的 .env.local。
    const modulePath = path.join(directory, "env.mjs");
    await cp(path.join(projectRoot, "deploy/env.mjs"), modulePath);
    const { loadDeployEnv: load } = await import(pathToFileURL(modulePath).href);
    assert.deepEqual(await load({}, { SSH_HOST: "env.example.com" }), {
      SSH_HOST: "env.example.com",
    });
    const file = path.join(directory, ".env.local");
    await writeFile(file, "SSH_HOST=file.example.com\nSSH_USER=deploy\n");
    assert.equal((await load({}, {})).SSH_HOST, "file.example.com");
    const actions = { GITHUB_ACTIONS: "true", SSH_HOST: "actions.example.com" };
    assert.deepEqual(await load({}, actions), actions);
    assert.equal((await load({ "env-file": file }, actions)).SSH_USER, "deploy");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("配置模板可直接解析，初始化、发布和回滚 CLI 复用文件", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-env-cli-"));
  try {
    for (const name of [
      "env.mjs",
      "lib.mjs",
      "setup-server.mjs",
      "deploy-static.mjs",
      "remote-release.sh",
    ])
      await cp(path.join(projectRoot, "deploy", name), path.join(directory, name));
    const file = path.join(directory, ".env.local");
    await cp(path.join(projectRoot, "deploy/.env.example"), file);
    const config = await loadDeployEnv({ "env-file": file }, {});
    assert.equal(connection({}, config).user, "root");
    assert.equal(connection({}, config).host, "server.example.com");
    assert.equal(connection({}, config).port, "22");
    assert.equal(connection({}, config).knownHosts, resolveLocalPath("~/.ssh/known_hosts"));
    assert.equal(config.NGINX_CONF_PATH, "/etc/nginx/conf.d");
    const env = { ...process.env, GITHUB_ACTIONS: "false" };
    for (const key of Object.keys(config)) delete env[key];
    delete env.DOMAIN;
    const invoke = (script, args, values = {}) => {
      const result = spawnSync(process.execPath, [path.join(directory, script), ...args], {
        cwd: projectRoot,
        env: { ...env, ...values },
        encoding: "utf8",
        timeout: 5000,
      });
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout);
    };
    const setup = invoke("setup-server.mjs", [
      "--user",
      "root",
      "--key",
      "~/.ssh/root",
      "--dry-run",
    ]);
    assert.equal(setup.user, "root");
    assert.equal(setup.nginxConfPath, "/etc/nginx/conf.d");
    assert.equal(setup.email, config.SSL_EMAIL);
    const setupArgs = ["--user", "root", "--key", "~/.ssh/root", "--dry-run"];
    await writeFile(
      file,
      (await readFile(file, "utf8")).replace(
        /^NGINX_CONF_PATH=.*$/m,
        "NGINX_CONF_PATH=/srv/nginx/file-conf",
      ),
    );
    assert.equal(invoke("setup-server.mjs", setupArgs).nginxConfPath, "/srv/nginx/file-conf");
    const overrides = { NGINX_CONF_PATH: "/srv/nginx/env-conf" };
    assert.equal(
      invoke("setup-server.mjs", setupArgs, overrides).nginxConfPath,
      "/srv/nginx/env-conf",
    );
    assert.equal(
      invoke("setup-server.mjs", [...setupArgs, "--nginx-path", "/srv/nginx/cli-conf"], overrides)
        .nginxConfPath,
      "/srv/nginx/cli-conf",
    );
    await writeFile(file, (await readFile(file, "utf8")).replace(/^NGINX_CONF_PATH=.*\n/m, ""));
    assert.equal(invoke("setup-server.mjs", setupArgs).nginxConfPath, "/etc/nginx/conf.d");
    const rollback = invoke("deploy-static.mjs", ["--rollback", "v1", "--dry-run"]);
    assert.equal(rollback.user, "root");
    assert.equal(rollback.action, "rollback");
    const artifact = path.join(directory, "build.tar.gz");
    await writeFile(artifact, "dry-run-checksum-fixture");
    await writeFile(`${artifact}.sha256`, `${await sha256(artifact)}  build.tar.gz\n`);
    const deploy = invoke("deploy-static.mjs", [
      "--artifact",
      artifact,
      "--release",
      "v2",
      "--dry-run",
    ]);
    assert.equal(deploy.action, "deploy");
    assert.equal(deploy.host, config.SSH_HOST);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
