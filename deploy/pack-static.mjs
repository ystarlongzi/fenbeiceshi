import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs, projectRoot, run, sha256, validateRelease, verifyExport } from "./lib.mjs";
import { deploySite } from "./sites.mjs";

// 只打包已经生成的 out；调用方先执行 check 或 build，服务器不参与构建。
async function main() {
  const args = parseArgs(process.argv.slice(2), {
    release: "string",
    revision: "string",
    domain: "string",
    help: "boolean",
  });
  if (args.help) {
    console.log("用法：npm run deploy:pack -- [--release <版本号>] [--revision <提交 SHA>]");
    return;
  }
  const revision =
    args.revision ??
    process.env.GITHUB_SHA ??
    run("git", ["rev-parse", "HEAD"], { cwd: projectRoot, stdio: "pipe", encoding: "utf8" });
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("提交 SHA 必须为 40 位十六进制字符");
  const stamp = new Date().toISOString().replaceAll(/[-:.TZ]/g, "");
  const release = validateRelease(args.release ?? process.env.RELEASE_ID ?? `${revision}-${stamp}`);
  const domain = args.domain ?? "fenbeiceshi.com";
  const site = deploySite(domain);
  const source = path.join(projectRoot, site.output);
  const assets = await verifyExport(source, domain);
  const artifactDir = path.join(projectRoot, "artifacts");
  const artifact = path.join(artifactDir, `${site.id}-${release}.tar.gz`);
  await mkdir(artifactDir, { recursive: true });
  // 独立暂存目录保留原始 out，重复打包不会把上次的版本标记混入新构建。
  const stage = await mkdtemp(path.join(tmpdir(), "fenbeiceshi-pack-"));
  try {
    await cp(source, stage, { recursive: true });
    await writeFile(path.join(stage, "_release.txt"), `${release}\n`);
    await writeFile(path.join(stage, "_release-assets.txt"), `${assets.join("\n")}\n`);
    await writeFile(
      path.join(stage, "release.json"),
      `${JSON.stringify({ release, revision, domain, builtAt: new Date().toISOString() }, null, 2)}\n`,
    );
    await writeFile(artifact, "", { flag: "wx" });
    run("tar", ["-czf", artifact, "-C", stage, "."], {
      env: { ...process.env, COPYFILE_DISABLE: "1" },
    });
    await writeFile(
      `${artifact}.sha256`,
      `${await sha256(artifact)}  ${path.basename(artifact)}\n`,
    );
    console.log(`构建产物：${artifact}`);
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`打包失败：${error.message}`);
  process.exitCode = 1;
});
