import { mkdir, readFile, rmdir, unlink, writeFile } from "node:fs/promises";

const directory = new URL("../src/app/(zh)/workbench-qa/", import.meta.url);
const file = new URL("page.tsx", directory);
const source = `import { notFound } from "next/navigation";
import WorkbenchFixture from "../../../../scripts/fixtures/workbench";

export default function WorkbenchQa() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <WorkbenchFixture />;
}
`;
const action = process.argv[2];

if (action === "open") {
  if (process.env.NODE_ENV === "production") throw new Error("合成输入夹具仅用于本地开发。");
  await mkdir(directory, { recursive: true });
  await writeFile(file, source, { flag: "wx" });
  console.log("已添加临时 /workbench-qa/ 路由，请用 npm run dev 查看；构建前执行 close。");
} else if (action === "close") {
  // 只清理本脚本创建的入口，不覆盖同路径的其他实现。
  if ((await readFile(file, "utf8")) !== source)
    throw new Error("入口内容已改变，保留文件供人工核对。");
  await unlink(file);
  await rmdir(directory);
  console.log("已移除临时 QA 路由；夹具源文件不进入生产页面。");
} else throw new Error("用法：node scripts/workbench-fixture.mjs open 或 close");
