import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { projectRoot } from "../lib.mjs";

test("部署变更检查覆盖整段推送，比较错误阻止继续，手动与首次推送保守执行", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-changes-"));
  const output = path.join(directory, "result");
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: directory, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const check = async (base, head, event = "push", expected = true) => {
    await writeFile(output, "");
    const result = spawnSync("bash", [path.join(projectRoot, "scripts/check-deploy-changes.sh")], {
      cwd: directory,
      env: {
        ...process.env,
        GITHUB_EVENT_NAME: event,
        GITHUB_OUTPUT: output,
        DEPLOY_BASE_SHA: base,
        DEPLOY_HEAD_SHA: head,
      },
      encoding: "utf8",
    });
    if (expected) assert.equal(result.status, 0, result.stderr);
    else assert.notEqual(result.status, 0, result.stderr);
    return readFile(output, "utf8");
  };
  try {
    git("init", "--quiet");
    git("config", "user.name", "部署测试");
    git("config", "user.email", "test@example.invalid");
    git("commit", "--quiet", "--allow-empty", "-m", "初始化测试");
    const initial = git("rev-parse", "HEAD");
    await mkdir(path.join(directory, "src"));
    await writeFile(path.join(directory, "src/page.tsx"), "content");
    git("add", "src");
    git("commit", "--quiet", "-m", "应用变更");
    const content = git("rev-parse", "HEAD");
    assert.equal(await check(initial, content), "required=false\n");
    await writeFile(path.join(directory, "next.config.ts"), "export default {};");
    git("add", "next.config.ts");
    git("commit", "--quiet", "-m", "构建配置变更");
    assert.equal(await check(initial, git("rev-parse", "HEAD")), "required=true\n");
    assert.equal(await check("0".repeat(40), content), "required=true\n");
    assert.equal(await check("", "", "workflow_dispatch"), "required=true\n");
    assert.equal(await check("invalid", content, "push", false), "");
    assert.equal(await check("a".repeat(40), content, "push", false), "");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
