import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot } from "../lib.mjs";

const workflowPath = path.join(projectRoot, ".github/workflows/deploy.yml");

test("生产检查、打包与发布使用同一 runner，不依赖 GitHub Artifacts", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const jobs = workflow.slice(workflow.indexOf("\njobs:\n"));
  assert.deepEqual(
    [...jobs.matchAll(/^ {2}([a-z][\w-]*):$/gm)].map((item) => item[1]),
    ["deploy"],
  );
  assert.match(jobs, /if: github.ref == 'refs\/heads\/main'/);
  assert.match(jobs, /environment:\s+name: production\s+url: https:\/\/fenbeiceshi\.com/);
  assert.match(
    workflow,
    /concurrency:\s+group: fenbeiceshi-production\s+cancel-in-progress: false/,
  );
  assert.match(workflow, /permissions:\s+contents: read/);
  assert.doesNotMatch(
    workflow,
    /actions\/(?:upload|download)-artifact|actions: write|prune-artifacts/,
  );
  assert.equal([...jobs.matchAll(/uses: actions\/checkout@/g)].length, 1);
  const check = jobs.indexOf("run: npm run check");
  const pack = jobs.indexOf('run: npm run deploy:pack -- --release "$RELEASE_ID"');
  const publish = jobs.indexOf(
    'run: npm run deploy:static -- --artifact "artifacts/fenbeiceshi-$RELEASE_ID.tar.gz" --release "$RELEASE_ID"',
  );
  assert.ok(check >= 0 && check < pack && pack < publish);
  assert.doesNotMatch(jobs.slice(check, publish), /continue-on-error|always\(\)/);
  assert.match(jobs, /name: 移除临时 SSH 文件\s+if: always\(\)/);
});

test("Linux 演练恢复域名解析，保留测试退出码，恢复失败阻止发布", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const block = workflow.match(
    / {6}- name: 验证 Linux 发布与回滚[\s\S]*? {8}run: \|\n([\s\S]*?)(?= {6}- )/,
  );
  assert.ok(block);
  assert.match(block[0], /if: steps.deploy_changes.outputs.required == 'true'/);
  const script = block[1].replace(/^ {10}/gm, "");
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-runner-hosts-"));
  const hosts = path.join(directory, "hosts");
  const tested = path.join(directory, "tested");
  const original = "127.0.0.1 localhost\n::1 localhost\n";
  try {
    // 拦截 sudo，将 /etc/hosts 映射到临时文件，避免修改本机解析或连接生产。
    await writeFile(
      path.join(directory, "sudo"),
      `#!${process.execPath}
const assert = require("node:assert/strict"), fs = require("node:fs");
const args = process.argv.slice(2), hosts = ${JSON.stringify(hosts)};
switch (args[0]) {
  case "cp": {
    const from = args.at(-2), to = args.at(-1);
    if (to === "/etc/hosts" && process.env.MOCK_RESTORE_FAIL === "1") process.exit(12);
    fs.copyFileSync(from === "/etc/hosts" ? hosts : from, to === "/etc/hosts" ? hosts : to);
    break;
  }
  case "tee":
    assert.deepEqual(args, ["tee", "-a", "/etc/hosts"]);
    fs.appendFileSync(hosts, fs.readFileSync(0));
    break;
  case "systemctl":
    assert.deepEqual(args, ["systemctl", "stop", "nginx"]);
    if (process.env.MOCK_SETUP_FAIL === "1") process.exit(11);
    break;
  case "env":
    assert.match(args[1], /^PATH=/);
    assert.deepEqual(args.slice(2), ["timeout", "--kill-after=5s", "180s", "npm", "run", "test:deploy:integration"]);
    assert.match(fs.readFileSync(hosts, "utf8"), /127\\.0\\.0\\.1 fenbeiceshi\\.com www\\.fenbeiceshi\\.com/);
    fs.writeFileSync(${JSON.stringify(tested)}, "ran");
    process.exit(Number(process.env.MOCK_TEST_STATUS));
    break;
  default: throw new Error("意外调用 sudo：" + args[0]);
}
`,
      { mode: 0o700 },
    );
    for (const tool of ["nginx", "curl", "openssl", "flock", "stat", "find", "tar", "gzip"])
      await writeFile(path.join(directory, tool), "#!/bin/sh\nexit 0\n", { mode: 0o700 });
    for (const item of [
      { status: 0, exit: 0 },
      { status: 19, exit: 19 },
      { status: 0, setupFail: true, exit: 11 },
      { status: 0, restoreFail: true, exit: 1 },
    ]) {
      await writeFile(hosts, original);
      await rm(tested, { force: true });
      const result = spawnSync("bash", ["-c", script], {
        env: {
          ...process.env,
          PATH: `${directory}${path.delimiter}${process.env.PATH}`,
          RUNNER_TEMP: directory,
          MOCK_TEST_STATUS: String(item.status),
          MOCK_SETUP_FAIL: item.setupFail ? "1" : "0",
          MOCK_RESTORE_FAIL: item.restoreFail ? "1" : "0",
        },
        encoding: "utf8",
        timeout: 5000,
      });
      assert.equal(result.status, item.exit, result.stdout + result.stderr);
      if (item.setupFail) await assert.rejects(readFile(tested), { code: "ENOENT" });
      else assert.equal(await readFile(tested, "utf8"), "ran");
      if (item.restoreFail) assert.match(result.stdout, /恢复 runner 域名解析失败/);
      else {
        assert.equal(await readFile(hosts, "utf8"), original);
        assert.deepEqual(
          (await readdir(directory)).filter((name) => name.startsWith("fenbeiceshi-hosts-")),
          [],
        );
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
