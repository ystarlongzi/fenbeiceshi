import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const keys = new Set([
  "SSH_HOST",
  "SSH_USER",
  "SSH_PORT",
  "SSH_PRIVATE_KEY_FILE",
  "SSH_KNOWN_HOSTS_FILE",
  "DEPLOY_PATH",
  "DOMAIN",
  "NGINX_CONF_PATH",
  "CERT_ROOT",
  "DNS_ENV_FILE",
  "ACME_HOME",
  "SSL_EMAIL",
  "DNS_CREDENTIALS_FILE",
]);

export async function loadDeployEnv(args, env = process.env) {
  const explicit = args["env-file"] !== undefined;
  // Actions 只使用工作流提供的凭据，避免本机配置意外影响自动发布。
  if (!explicit && env.GITHUB_ACTIONS === "true") return { ...env };
  const file = explicit
    ? resolveLocalPath(args["env-file"])
    : fileURLToPath(new URL("./.env.local", import.meta.url));
  let source;
  try {
    source = await readFile(file, "utf8");
  } catch (error) {
    if (!explicit && error.code === "ENOENT") return { ...env };
    throw new Error(`无法读取部署配置：${file}（${error.code ?? "读取失败"}）`, { cause: error });
  }
  // 只解析数据，不执行配置中的命令，也不修改进程的全局环境。
  const values = parseEnv(source);
  for (const key of Object.keys(values)) {
    if (!keys.has(key)) throw new Error(`部署配置包含不支持的变量：${key}`);
  }
  return { ...values, ...env };
}

export function resolveLocalPath(value) {
  const expanded = value.startsWith("~/") ? path.join(homedir(), value.slice(2)) : value;
  return path.resolve(expanded);
}
