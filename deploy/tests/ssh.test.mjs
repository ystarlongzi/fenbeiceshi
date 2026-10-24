import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot } from "../lib.mjs";

test("SSH 省略主机公钥时接受新主机，提供文件时严格核验", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-ssh-"));
  const key = path.join(directory, "key");
  const knownHosts = path.join(directory, "known_hosts");
  const captured = path.join(directory, "args.json");
  try {
    await writeFile(key, "test-only private key");
    await writeFile(knownHosts, "test-only host key");
    // 替换子进程的 SSH 可执行文件，仅记录参数，避免测试访问任何服务器。
    await writeFile(
      path.join(directory, "ssh"),
      `#!${process.execPath}
import { writeFileSync } from "node:fs";
writeFileSync(${JSON.stringify(captured)}, JSON.stringify(process.argv.slice(2)));
process.stdin.resume();
`,
      { mode: 0o700 },
    );
    const env = {
      ...process.env,
      PATH: `${directory}${path.delimiter}${process.env.PATH}`,
      GITHUB_ACTIONS: "true",
      SSH_KNOWN_HOSTS_FILE: "",
    };
    const args = [
      "deploy/deploy-static.mjs",
      "--rollback",
      "test",
      "--host",
      "server.example.com",
      "--user",
      "root",
      "--port",
      "22",
      "--key",
      key,
    ];
    for (const strict of [false, true]) {
      const result = spawnSync(
        process.execPath,
        strict ? [...args, "--known-hosts", knownHosts] : args,
        { cwd: projectRoot, env, encoding: "utf8", timeout: 5000 },
      );
      assert.equal(result.status, 0, result.stderr);
      const command = JSON.parse(await readFile(captured, "utf8"));
      assert.ok(command.includes(`StrictHostKeyChecking=${strict ? "yes" : "accept-new"}`));
      assert.equal(command.includes(`UserKnownHostsFile=${knownHosts}`), strict);
      assert.equal(command[1], "22");
    }
    await rm(captured);
    const missing = spawnSync(
      process.execPath,
      [...args, "--known-hosts", path.join(directory, "missing")],
      { cwd: projectRoot, env, encoding: "utf8", timeout: 5000 },
    );
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /ENOENT/);
    await assert.rejects(readFile(captured), { code: "ENOENT" });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("发布与回滚保留私钥换行，主机公钥可选，登录凭据仍必填", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-actions-ssh-"));
  try {
    const githubEnv = path.join(directory, "github-env");
    const privateKey =
      "-----BEGIN OPENSSH PRIVATE KEY-----\ntest-only\n-----END OPENSSH PRIVATE KEY-----";
    const env = {
      ...process.env,
      SSH_HOST: "server.example.com",
      SSH_USER: "root",
      SSH_PRIVATE_KEY: privateKey,
      SSH_KNOWN_HOSTS: "",
      RUNNER_TEMP: directory,
      GITHUB_ENV: githubEnv,
    };
    for (const file of ["deploy.yml", "rollback.yml"]) {
      const workflow = await readFile(path.join(projectRoot, ".github/workflows", file), "utf8");
      const block = workflow.match(
        / {6}- name: 准备 SSH 凭据与主机公钥[\s\S]*? {8}run: \|\n([\s\S]*?)(?= {6}- name:)/,
      );
      assert.ok(block, `${file} 未找到凭据准备步骤`);
      const script = block[1].replace(/^ {10}/gm, "");
      for (const hostKey of ["", "[server.example.com]:22 ssh-ed25519 test-only"]) {
        await writeFile(githubEnv, "");
        const result = spawnSync("bash", ["-c", script], {
          env: { ...env, SSH_KNOWN_HOSTS: hostKey },
          encoding: "utf8",
          timeout: 5000,
        });
        assert.equal(result.status, 0, `${file}: ${result.stderr}`);
        const values = Object.fromEntries(
          (await readFile(githubEnv, "utf8"))
            .trim()
            .split("\n")
            .map((line) => {
              const separator = line.indexOf("=");
              return [line.slice(0, separator), line.slice(separator + 1)];
            }),
        );
        assert.equal(await readFile(values.SSH_PRIVATE_KEY_FILE, "utf8"), `${privateKey}\n`);
        if (hostKey) {
          assert.equal(await readFile(values.SSH_KNOWN_HOSTS_FILE, "utf8"), `${hostKey}\n`);
        } else {
          assert.equal(values.SSH_KNOWN_HOSTS_FILE, undefined);
        }
      }
      for (const required of ["SSH_HOST", "SSH_USER", "SSH_PRIVATE_KEY"]) {
        await writeFile(githubEnv, "");
        const result = spawnSync("bash", ["-c", script], {
          env: { ...env, [required]: "" },
          encoding: "utf8",
          timeout: 5000,
        });
        assert.equal(result.status, 1, file);
        assert.ok(result.stdout.includes(`缺少部署 Secret：${required}`), file);
        assert.equal(await readFile(githubEnv, "utf8"), "");
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
