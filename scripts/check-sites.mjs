import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createManifest, manifestName } from "../deploy/indexnow/manifest.mjs";

const verificationFile = "google024d40e8849b7703.html";
assert.deepEqual(
  await readFile(`out/${verificationFile}`),
  await readFile(`public/${verificationFile}`),
);
await assert.rejects(readFile(`out-soundmetergo/${verificationFile}`), { code: "ENOENT" });

for (const target of ["fenbeiceshi", "soundmetergo"]) {
  const directory = target === "fenbeiceshi" ? "out" : "out-soundmetergo";
  assert.deepEqual(
    JSON.parse(await readFile(`${directory}/${manifestName}`, "utf8")),
    await createManifest(directory, `${target}.com`),
    "IndexNow 清单必须与已检查的导出正文一致",
  );
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
