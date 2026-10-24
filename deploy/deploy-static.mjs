import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection, parseArgs, sha256, ssh, validateRelease } from "./lib.mjs";
import { loadDeployEnv } from "./env.mjs";

// 在本机或 Actions 执行；回滚只发送目标版本号，发布才上传构建包。
async function main() {
  const args = parseArgs(process.argv.slice(2), {
    artifact: "string",
    release: "string",
    rollback: "string",
    "dry-run": "boolean",
    help: "boolean",
    host: "string",
    user: "string",
    port: "string",
    key: "string",
    "known-hosts": "string",
    path: "string",
    domain: "string",
    "env-file": "string",
  });
  if (args.help) {
    console.log(
      "用法：npm run deploy:static -- --artifact <tar.gz> --release <版本号>\n回滚：npm run deploy:rollback -- <已保留版本号>\n默认读取 deploy/.env.local，其他配置可用 --env-file <路径> 指定。\n命令参数优先于环境变量，环境变量优先于配置文件。",
    );
    return;
  }
  if (args.rollback && (args.artifact || args.release))
    throw new Error("回滚与上传参数不能同时使用");
  if (!args.rollback && (!args.artifact || !args.release))
    throw new Error("发布需要 --artifact 和 --release");
  const release = validateRelease(args.rollback ?? args.release);
  const config = connection(args, await loadDeployEnv(args));
  const action = args.rollback ? "rollback" : "deploy";
  const script = await readFile(new URL("./remote-release.sh", import.meta.url), "utf8");
  let artifact;
  let digest = "-";
  if (action === "deploy") {
    // 发送前先核对包和校验文件；服务器接收后还会再次校验传输结果。
    artifact = path.resolve(args.artifact);
    digest = await sha256(artifact);
    const checksum = (await readFile(`${artifact}.sha256`, "utf8")).trim();
    if (checksum !== `${digest}  ${path.basename(artifact)}`)
      throw new Error("构建产物 SHA-256 校验失败");
  }
  if (args["dry-run"]) {
    console.log(
      JSON.stringify(
        {
          action,
          release,
          artifact,
          digest,
          host: config.host,
          user: config.user,
          port: config.port,
          deployPath: config.deployPath,
          domain: config.domain,
        },
        null,
        2,
      ),
    );
    return;
  }
  await ssh(
    config,
    script,
    [config.deployPath, release, digest, config.domain, action],
    artifact ? createReadStream(artifact) : undefined,
  );
  console.log(`${action === "rollback" ? "回滚" : "发布"}完成：${release}`);
}

main().catch((error) => {
  console.error(`部署失败：${error.message}`);
  process.exitCode = 1;
});
