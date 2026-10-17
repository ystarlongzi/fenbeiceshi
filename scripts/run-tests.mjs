import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collect(path) : entry.name.endsWith(".test.ts") ? [path] : [];
    }),
  );
  return groups.flat();
}

const files = await collect("src");
if (!files.length) throw new Error("未找到测试文件，不能将空检查报告为通过。");
const result = spawnSync(process.execPath, ["--experimental-strip-types", "--test", ...files], {
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
