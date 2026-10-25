import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  connection,
  listFiles,
  parseArgs,
  projectRoot,
  requiredFiles,
  shellQuote,
  validateDeployPath,
  validateRelease,
  verifyExport,
} from "../lib.mjs";

test("部署参数拒绝注入、危险目录和缺失私钥，主机公钥文件可选", () => {
  const env = {
    SSH_HOST: "server.example.com",
    SSH_USER: "deploy",
    SSH_PRIVATE_KEY_FILE: "/tmp/key",
    SSH_KNOWN_HOSTS_FILE: "/tmp/known_hosts",
  };
  assert.equal(connection({}, env).deployPath, "/www/wwwroot/fenbeiceshi");
  for (const value of [
    "/",
    "/var/www",
    "/var/www/../fenbeiceshi",
    "/var/www/fenbeiceshi;id",
    "relative/fenbeiceshi",
  ])
    assert.throws(() => validateDeployPath(value));
  for (const value of ["../release", "-option", "a\ncommand", "$(id)"])
    assert.throws(() => validateRelease(value));
  assert.throws(() => connection({}, { ...env, SSH_HOST: "-oProxyCommand=id" }));
  assert.throws(() => connection({}, { ...env, SSH_PORT: "65536" }));
  assert.equal(connection({}, { ...env, SSH_KNOWN_HOSTS_FILE: "" }).knownHosts, undefined);
  const optional = { ...env };
  delete optional.SSH_KNOWN_HOSTS_FILE;
  assert.equal(connection({}, optional).knownHosts, undefined);
  assert.equal(connection({}, optional).port, "22");
  assert.throws(() => connection({}, { ...env, SSH_PRIVATE_KEY_FILE: "" }));
  assert.throws(() => parseArgs(["--artifact"], { artifact: "string" }));
  assert.throws(() => parseArgs(["--unknown"], {}));
  assert.throws(
    () => parseArgs(["--release", "a", "--release", "b"], { release: "string" }),
    /重复/,
  );
  const quoted = shellQuote("a'b; $(printf unsafe)");
  const result = spawnSync("sh", ["-c", `printf '%s' ${quoted}`], { encoding: "utf8" });
  assert.equal(result.stdout, "a'b; $(printf unsafe)");
});

test("静态导出检查覆盖缺失资源、隐藏文件和软链接", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-unit-"));
  try {
    for (const name of requiredFiles) {
      await mkdir(path.dirname(path.join(directory, name)), { recursive: true });
      await writeFile(path.join(directory, name), "content");
    }
    await writeFile(path.join(directory, "_site.txt"), "fenbeiceshi.com\n");
    await mkdir(path.join(directory, "_next/static"), { recursive: true });
    await writeFile(
      path.join(directory, "index.html"),
      '<link href="/_next/static/app.css"><script src="/_next/static/app.js"></script>',
    );
    await writeFile(path.join(directory, "_next/static/app.js"), "js");
    await assert.rejects(verifyExport(directory), /资源不存在/);
    await writeFile(path.join(directory, "_next/static/app.css"), "css");
    assert.equal((await verifyExport(directory)).length, 2);
    for (const file of ["guide/index.html", "zh-tw/index.html", "audio/pcm-recorder.js"]) {
      await rm(path.join(directory, file));
      await assert.rejects(verifyExport(directory), /静态导出缺少有效文件/);
      await writeFile(path.join(directory, file), "content");
    }
    await writeFile(path.join(directory, ".env"), "test-only");
    await assert.rejects(listFiles(directory), /不安全/);
    await rm(path.join(directory, ".env"));
    await symlink("/tmp", path.join(directory, "link"));
    await assert.rejects(listFiles(directory), /非普通文件/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("损坏产物在 SSH 连接前失败，发布和回滚参数不能混用", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-artifact-"));
  try {
    const artifact = path.join(directory, "artifact.tar.gz");
    await writeFile(artifact, "corrupt");
    await writeFile(`${artifact}.sha256`, `${"0".repeat(64)}  artifact.tar.gz\n`);
    const env = {
      ...process.env,
      SSH_HOST: "server.example.com",
      SSH_USER: "deploy",
      SSH_PRIVATE_KEY_FILE: "/tmp/key",
      SSH_KNOWN_HOSTS_FILE: "/tmp/known_hosts",
    };
    const result = spawnSync(
      process.execPath,
      ["deploy/deploy-static.mjs", "--artifact", artifact, "--release", "test", "--dry-run"],
      { cwd: projectRoot, env, encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /SHA-256 校验失败/);
    const conflict = spawnSync(
      process.execPath,
      ["deploy/deploy-static.mjs", "--rollback", "old", "--release", "new"],
      { cwd: projectRoot, env, encoding: "utf8" },
    );
    assert.equal(conflict.status, 1);
    assert.match(conflict.stderr, /不能同时使用/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Linux 集成入口拒绝非测试平台、权限不足与生产域名解析", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-integration-guard-"));
  const preload = path.join(directory, "environment.mjs");
  const cases = [
    { platform: "darwin", uid: 0, addresses: ["127.0.0.1"], message: /临时 Linux/ },
    { platform: "linux", uid: 1000, addresses: ["127.0.0.1"], message: /root 权限/ },
    { platform: "linux", uid: 0, addresses: [], message: /必须仅解析到/ },
    { platform: "linux", uid: 0, addresses: ["203.0.113.10"], message: /不能访问生产站点/ },
    {
      platform: "linux",
      uid: 0,
      addresses: ["127.0.0.1", "203.0.113.10"],
      message: /必须仅解析到/,
    },
    {
      platform: "linux",
      uid: 0,
      addresses: ["127.0.0.1"],
      publicWww: true,
      message: /www\.fenbeiceshi\.com/,
    },
  ];
  try {
    for (const item of cases) {
      // 只在子进程模拟前置条件；所有样本必须在启动 Nginx 或绑定端口前被拒绝。
      await writeFile(
        preload,
        `import dns from "node:dns/promises";
import { syncBuiltinESMExports } from "node:module";
Object.defineProperty(process, "platform", { value: ${JSON.stringify(item.platform)} });
process.getuid = () => ${item.uid};
dns.lookup = async (domain) => (domain === "www.fenbeiceshi.com" && ${Boolean(item.publicWww)}
  ? ["203.0.113.10"] : ${JSON.stringify(item.addresses)}).map(address => ({ address, family: 4 }));
syncBuiltinESMExports();
`,
      );
      const result = spawnSync(
        process.execPath,
        ["--import", preload, "deploy/tests/run-integration.mjs"],
        { cwd: projectRoot, encoding: "utf8", timeout: 5000 },
      );
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, item.message);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
