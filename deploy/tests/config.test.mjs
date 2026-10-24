import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { projectRoot } from "../lib.mjs";

test("部署 Shell 文件语法有效", async () => {
  const files = [
    ...(await readdir(path.join(projectRoot, "deploy")))
      .filter((file) => file.endsWith(".sh"))
      .map((file) => `deploy/${file}`),
    "scripts/check-deploy-changes.sh",
  ];
  for (const file of files) {
    const result = spawnSync("bash", ["-n", file], { cwd: projectRoot, encoding: "utf8" });
    assert.equal(result.status, 0, `${file}: ${result.stderr}`);
  }
});

test("手动回滚复用生产锁、凭据验证与服务器健康检查，输入不拼成 Shell", async () => {
  const workflow = await readFile(path.join(projectRoot, ".github/workflows/rollback.yml"), "utf8");
  assert.match(
    workflow,
    /concurrency:\s+group: fenbeiceshi-production\s+cancel-in-progress: false/,
  );
  assert.match(workflow, /environment:\s+name: production\s+url: https:\/\/fenbeiceshi\.com/);
  assert.match(workflow, /if: github.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /ROLLBACK_RELEASE: \$\{\{ inputs\.release \}\}/);
  assert.match(workflow, /run: npm run deploy:rollback -- "\$ROLLBACK_RELEASE"/);
  assert.doesNotMatch(workflow, /--rollback [^\n]*\$\{\{/);
  assert.match(workflow, /for name in SSH_HOST SSH_USER SSH_PRIVATE_KEY SSH_KNOWN_HOSTS;/);
  assert.match(workflow, /name: 移除临时 SSH 文件\s+if: always\(\)/);
  assert.doesNotMatch(workflow, /upload-artifact|download-artifact|continue-on-error/);
});

test("资源路径允许 Next.js catch-all，拒绝直接或编码后的路径穿越与控制字符", async () => {
  const script = await readFile(path.join(projectRoot, "deploy/remote-release.sh"), "utf8");
  const check = script.match(/valid_asset\(\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(check);
  for (const [value, allowed] of [
    ["/_next/static/app.js", true],
    ["/_next/static/chunks/app/(zh)/%5B...slug%5D/page.js", true],
    ["/_next/static/chunks/app/[...slug]/page.js", true],
    ["/_next/static/chunks/app/%5b%2e%2e%2eslug%5d/page.js", true],
    ["/other/app.js", false],
    ["/_next/static/../secret", false],
    ["/_next/static/./app.js", false],
    ["/_next/static/%2E%2E/secret", false],
    ["/_next/static/a%2F..%2F..%2Fsecret", false],
    ["/_next/static/app%5csecret.js", false],
    ["/_next/static/app.js?query=1", false],
    ["/_next/static/app.js%23fragment", false],
    ["/_next/static/app%00.js", false],
    ["/_next/static/app%0a.js", false],
    ["/_next/static/%invalid.js", false],
  ]) {
    const result = spawnSync("bash", ["-c", `${check}\nvalid_asset "$1"`, "--", value], {
      encoding: "utf8",
    });
    assert.equal(result.status, allowed ? 0 : 1, `${value}: ${result.stderr}`);
  }
});
