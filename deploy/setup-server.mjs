import { Readable } from "node:stream";
import { lstat, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { connection, parseArgs, ssh } from "./lib.mjs";
import { loadDeployEnv, resolveLocalPath } from "./env.mjs";

// 凭据仅通过 SSH 标准输入发送，不拼入命令参数或日志。
async function main() {
  const args = parseArgs(process.argv.slice(2), {
    host: "string",
    user: "string",
    port: "string",
    key: "string",
    "known-hosts": "string",
    path: "string",
    domain: "string",
    "nginx-path": "string",
    "cert-root": "string",
    "dns-env": "string",
    "acme-home": "string",
    email: "string",
    bootstrap: "boolean",
    help: "boolean",
    "dry-run": "boolean",
    "env-file": "string",
  });
  if (args.help) {
    console.log(
      "用法：npm run deploy:setup -- [--bootstrap] [--env-file <配置文件>]\n默认读取 deploy/.env.local；命令参数优先于环境变量，环境变量优先于配置文件。\n--bootstrap 检查已有 Linux/systemd 环境、在 Ubuntu/Debian 补齐缺失工具并发送 DNS 凭据；省略时复用服务器凭据与工具。初始化需要 root。",
    );
    return;
  }
  const env = await loadDeployEnv(args);
  const config = connection(args, env);
  if (config.user !== "root") throw new Error("初始化需要 SSH_USER=root");
  const options = {
    nginxConfPath: args["nginx-path"] ?? env.NGINX_CONF_PATH ?? "/etc/nginx/conf.d",
    certRoot: args["cert-root"] ?? env.CERT_ROOT ?? "/etc/nginx/ssl",
    dnsEnv: args["dns-env"] ?? env.DNS_ENV_FILE ?? "/etc/fenbeiceshi/cloudflare.env",
    acmeHome: args["acme-home"] ?? env.ACME_HOME ?? "/root/.acme.sh-fenbeiceshi",
    email: args.email ?? env.SSL_EMAIL ?? "",
  };
  for (const key of ["nginxConfPath", "certRoot", "dnsEnv", "acmeHome"]) {
    if (
      !/^\/(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+$/.test(options[key]) ||
      options[key].split("/").some((part) => part === "." || part === "..")
    )
      throw new Error(`${key} 必须是安全的绝对路径`);
  }
  if (options.email && !/^[A-Za-z0-9_.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(options.email))
    throw new Error("联系邮箱格式无效");
  let credentials = "";
  if (args.bootstrap) {
    if (!options.email) throw new Error("初始化或检查部署环境需要填写 SSL_EMAIL");
    let values = { CF_Token: env.CF_TOKEN, CF_Zone_ID: env.CF_ZONE_ID };
    if (env.DNS_CREDENTIALS_FILE && env.GITHUB_ACTIONS !== "true") {
      const file = resolveLocalPath(env.DNS_CREDENTIALS_FILE);
      let info;
      try {
        info = await lstat(file);
      } catch (error) {
        throw new Error(`无法读取本机 DNS 凭据（${error.code ?? "读取失败"}）`, { cause: error });
      }
      if (!info.isFile() || ![0o600, 0o400].includes(info.mode & 0o777))
        throw new Error("本机 DNS 凭据必须是普通文件，权限为 600 或 400");
      try {
        values = parseEnv(await readFile(file, "utf8"));
      } catch (error) {
        throw new Error(`无法读取本机 DNS 凭据（${error.code ?? "读取失败"}）`, { cause: error });
      }
      if (Object.keys(values).some((key) => !["CF_Token", "CF_Zone_ID"].includes(key)))
        throw new Error("本机 DNS 凭据包含不支持的字段");
    }
    if (!/^[A-Za-z0-9_-]{20,255}$/.test(values.CF_Token ?? ""))
      throw new Error("CF_TOKEN 缺失或格式无效");
    if (!/^[a-f0-9]{32}$/.test(values.CF_Zone_ID ?? ""))
      throw new Error("CF_ZONE_ID 缺失或格式无效");
    credentials = `CF_Token=${values.CF_Token}\nCF_Zone_ID=${values.CF_Zone_ID}\n`;
  }
  if (args["dry-run"]) {
    console.log(
      JSON.stringify(
        {
          host: config.host,
          user: config.user,
          deployPath: config.deployPath,
          domain: config.domain,
          ...options,
          bootstrap: Boolean(args.bootstrap),
        },
        null,
        2,
      ),
    );
    return;
  }
  let script = await readFile(new URL("./setup-server.sh", import.meta.url), "utf8");
  if (args.bootstrap)
    script = `${await readFile(new URL("./bootstrap-server.sh", import.meta.url), "utf8")}\n${script}`;
  const template = await readFile(
    new URL("./nginx/fenbeiceshi.conf.template", import.meta.url),
    "utf8",
  );
  await ssh(
    config,
    script,
    [
      config.deployPath,
      config.domain,
      options.nginxConfPath,
      options.certRoot,
      options.dnsEnv,
      options.email,
      options.acmeHome,
      args.bootstrap ? "bootstrap" : "server",
    ],
    Readable.from([credentials, template]),
  );
  console.log("服务器初始化完成；可以运行静态发布。");
}

main().catch((error) => {
  console.error(`初始化失败：${error.message}`);
  process.exitCode = 1;
});
