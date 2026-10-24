import { lookup } from "node:dns/promises";
import { projectRoot, run } from "../lib.mjs";

// 测试会占用 80/443 并启动 Nginx，只允许在可丢弃的 Linux 测试环境运行。
async function main() {
  if (process.platform !== "linux" || process.getuid?.() !== 0)
    throw new Error("集成测试需要临时 Linux 环境中的 root 权限；请使用 GitHub Actions 检查");
  for (const domain of ["fenbeiceshi.com", "www.fenbeiceshi.com"]) {
    const addresses = await lookup(domain, { all: true });
    if (!addresses.length || addresses.some(({ address }) => address !== "127.0.0.1"))
      throw new Error(`测试域名 ${domain} 必须仅解析到 127.0.0.1，不能访问生产站点`);
  }
  run(process.execPath, ["--test", "--test-concurrency=1", "deploy/tests/integration.test.mjs"], {
    cwd: projectRoot,
    env: { ...process.env, FENBEI_INTEGRATION: "1" },
  });
}

main().catch((error) => {
  console.error(`集成测试失败：${error.message}`);
  process.exitCode = 1;
});
