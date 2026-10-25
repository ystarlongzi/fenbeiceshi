import { spawnSync } from "node:child_process";

for (const target of ["fenbeiceshi", "soundmetergo"]) {
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "scripts/check-export.ts"],
    {
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_SITE_TARGET: target },
    },
  );
  if (result.error) throw new Error(`产物检查无法启动：${target}`, { cause: result.error });
  if (result.status !== 0) throw new Error(`产物检查失败：${target}，退出码 ${result.status}`);
}
