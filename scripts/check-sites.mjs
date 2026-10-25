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
const multilingual = spawnSync(
  process.execPath,
  ["--experimental-strip-types", "scripts/i18n/check-export.ts"],
  { stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_SITE_TARGET: "soundmetergo" } },
);
if (multilingual.error) throw new Error("多语言产物检查无法启动。", { cause: multilingual.error });
if (multilingual.status !== 0) throw new Error(`多语言产物检查失败：退出码 ${multilingual.status}`);
