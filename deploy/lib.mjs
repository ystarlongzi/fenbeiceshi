import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveLocalPath } from "./env.mjs";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export const requiredFiles = [
  "index.html",
  "en/index.html",
  "zh-tw/index.html",
  "404.html",
  "guide/index.html",
  "en/guide/index.html",
  "zh-tw/guide/index.html",
  "knowledge/decibel-chart/index.html",
  "en/knowledge/decibel-chart/index.html",
  "zh-tw/knowledge/decibel-chart/index.html",
  "records/index.html",
  "en/records/index.html",
  "zh-tw/records/index.html",
  "audio/pcm-recorder.js",
  "vendor/lamejs/lamejs.js",
  "vendor/lamejs/COPYING.LESSER.txt",
  "robots.txt",
  "sitemap.xml",
];

export function parseArgs(args, spec) {
  const values = {};
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    const key = flag.slice(2);
    if (!flag.startsWith("--") || !Object.hasOwn(spec, key)) throw new Error(`未知参数：${flag}`);
    if (Object.hasOwn(values, key)) throw new Error(`参数重复：${flag}`);
    if (spec[key] === "boolean") values[key] = true;
    else {
      const value = args[++index];
      if (!value || value.startsWith("--")) throw new Error(`${flag} 缺少值`);
      values[key] = value;
    }
  }
  return values;
}

export function validateRelease(value) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(value ?? ""))
    throw new Error("版本号只能包含字母、数字、下划线和连字符，最长 120 字符");
  return value;
}

export function validateDomain(value) {
  if (value !== "fenbeiceshi.com") throw new Error("此部署配置仅用于 fenbeiceshi.com");
  return value;
}

export function validateDeployPath(value) {
  if (!/^\/(?:[A-Za-z0-9_-]+\/){2,}fenbeiceshi$/.test(value ?? ""))
    throw new Error("部署目录必须是至少三级的绝对路径，且以 /fenbeiceshi 结尾");
  return value;
}

export function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

export function connection(args, env = process.env) {
  // CLI 可覆盖环境变量，初始化、日常发布和回滚共用同一套连接校验。
  const config = {
    host: args.host ?? env.SSH_HOST,
    user: args.user ?? env.SSH_USER,
    port: args.port ?? env.SSH_PORT ?? "22",
    key: args.key ?? env.SSH_PRIVATE_KEY_FILE,
    knownHosts: args["known-hosts"] ?? env.SSH_KNOWN_HOSTS_FILE,
    deployPath: args.path ?? env.DEPLOY_PATH ?? "/www/wwwroot/fenbeiceshi",
    domain: args.domain ?? env.DOMAIN ?? "fenbeiceshi.com",
  };
  if (!/^[A-Za-z0-9][A-Za-z0-9.-]{0,252}$/.test(config.host ?? ""))
    throw new Error("SSH_HOST 必须为 IPv4 地址或主机名");
  if (!/^[a-z_][a-z0-9_-]{0,31}$/.test(config.user ?? "")) throw new Error("SSH_USER 格式无效");
  if (!/^\d+$/.test(config.port) || Number(config.port) < 1 || Number(config.port) > 65535)
    throw new Error("SSH_PORT 必须介于 1 和 65535");
  if (!config.key) throw new Error("必须设置 SSH_PRIVATE_KEY_FILE");
  config.key = resolveLocalPath(config.key);
  config.knownHosts = config.knownHosts ? resolveLocalPath(config.knownHosts) : undefined;
  validateDeployPath(config.deployPath);
  validateDomain(config.domain);
  return config;
}

export async function ssh(config, script, args, input) {
  for (const file of [config.key, config.knownHosts].filter(Boolean)) {
    if (!(await lstat(file)).isFile()) throw new Error(`SSH 配置不是普通文件：${file}`);
  }
  const remote = ["bash", "-c", shellQuote(script), "--", ...args.map(shellQuote)].join(" ");
  const command = [
    "-p",
    config.port,
    "-i",
    config.key,
    "-o",
    "BatchMode=yes",
    "-o",
    "IdentitiesOnly=yes",
    // 提供公钥文件时严格核验；省略时接受新主机，但仍拒绝已记录主机的密钥变化。
    "-o",
    `StrictHostKeyChecking=${config.knownHosts ? "yes" : "accept-new"}`,
    ...(config.knownHosts ? ["-o", `UserKnownHostsFile=${config.knownHosts}`] : []),
    "-o",
    "ConnectTimeout=15",
    "-o",
    "ServerAliveInterval=15",
    "-o",
    "ServerAliveCountMax=3",
    `${config.user}@${config.host}`,
    remote,
  ];
  await new Promise((resolve, reject) => {
    const child = spawn("ssh", command, { stdio: ["pipe", "inherit", "inherit"] });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`远程操作失败，SSH 退出码 ${code}`)),
    );
    child.stdin.on("error", (error) => {
      if (error.code !== "EPIPE") reject(error);
    });
    if (input) {
      input.on("error", (error) => {
        child.kill();
        reject(error);
      });
      input.pipe(child.stdin);
    } else child.stdin.end();
  });
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error) throw new Error(`${command} 无法启动：${result.error.message}`);
  if (result.status !== 0) throw new Error(`${command} 执行失败，退出码 ${result.status}`);
  return result.stdout?.trim();
}

export async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

export async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    // 导出目录进入公网，拒绝隐藏文件、软链接和控制字符，避免误带配置或越过目录边界。
    if (entry.name.startsWith(".") || /[\x00-\x1f\\]/.test(name))
      throw new Error(`导出文件名不安全：${name}`);
    if (entry.isDirectory())
      files.push(...(await listFiles(path.join(directory, entry.name), name)));
    else if (entry.isFile()) files.push(name);
    else throw new Error(`导出目录包含非普通文件：${name}`);
  }
  return files.sort();
}

export async function verifyExport(directory) {
  const files = await listFiles(directory);
  for (const name of requiredFiles) {
    if (!files.includes(name) || (await lstat(path.join(directory, name))).size === 0)
      throw new Error(`静态导出缺少有效文件：${name}`);
  }
  const html = await readFile(path.join(directory, "index.html"), "utf8");
  const assets = [
    ...new Set(
      [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?#]+)"/g)].map((match) => match[1]),
    ),
  ];
  if (!assets.some((name) => name.endsWith(".js")) || !assets.some((name) => name.endsWith(".css")))
    throw new Error("首页未找到 JavaScript 或 CSS 静态资源");
  for (const asset of assets) {
    if (!files.includes(decodeURIComponent(asset.slice(1))))
      throw new Error(`首页引用的资源不存在：${asset}`);
  }
  return assets;
}
