import { spawnSync } from "node:child_process";
import { rename, rm, writeFile } from "node:fs/promises";

// 英文先构建到独立目录，最后保留中文构建的 .next，沿用默认开发与预览入口。
for (const target of ["soundmetergo", "fenbeiceshi"]) {
  const result = spawnSync(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build", "--webpack"],
    {
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_SITE_TARGET: target },
    },
  );
  if (result.error) throw new Error(`站点构建无法启动：${target}`, { cause: result.error });
  if (result.status !== 0) throw new Error(`站点构建失败：${target}，退出码 ${result.status}`);
  // 此目录仅为 Next.js 生成的非本站语言产物，不进入英文站发布包。
  if (target === "soundmetergo") await rm("out/zh-tw", { recursive: true, force: true });
  await writeFile("out/_site.txt", `${target}.com\n`);
  if (target === "soundmetergo") {
    await rm("out-soundmetergo", { recursive: true, force: true });
    await rename("out", "out-soundmetergo");
  }
}
