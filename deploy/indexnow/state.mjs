import { createHash, randomBytes } from "node:crypto";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { projectRoot, ssh, validateRelease } from "../lib.mjs";
import { deploySite } from "../sites.mjs";
import { manifestName, validateManifest } from "./manifest.mjs";
import { publishedManifest, validateKey, verifyPublished } from "./http.mjs";

const directory = path.join(projectRoot, "artifacts/indexnow");
const remote = new URL("./remote-state.sh", import.meta.url);

export async function prepare(config, release, { published = false } = {}) {
  const site = deploySite(config.domain);
  const manifest = published
    ? await publishedManifest(config.domain)
    : validateManifest(
        JSON.parse(await readFile(path.join(projectRoot, site.output, manifestName), "utf8")),
        config.domain,
      );
  const raw = await ssh(
    config,
    await readFile(remote, "utf8"),
    [config.deployPath, config.domain, "prepare", release],
    Readable.from(randomBytes(16).toString("hex") + "\n"),
    { capture: true },
  );
  const lines = raw.split("\n");
  const key = validateKey(lines.shift());
  const stateHash = lines.shift();
  const previousRelease = lines.shift();
  if (!/^(-|[a-f0-9]{64})$/.test(stateHash)) throw new Error("远程通知状态校验值无效");
  if (previousRelease !== "-") validateRelease(previousRelease);
  const checkpointText = lines.join("\n");
  if (stateHash !== "-" && createHash("sha256").update(checkpointText).digest("hex") !== stateHash)
    throw new Error("远程通知状态传输校验失败");
  const previous = validateCheckpoint(JSON.parse(checkpointText), config.domain);
  if ((stateHash === "-") !== (previous === null)) throw new Error("远程通知状态与校验值不一致");
  const value = { domain: config.domain, release, key, stateHash, previous, manifest };
  if (published) await verifyPublished(config.domain, release, manifest, key);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(preparedPath(config.domain, release), JSON.stringify(value) + "\n", {
    mode: 0o600,
  });
  const keyPath = path.join(projectRoot, site.output, key + ".txt");
  if (published) return value;
  try {
    const info = await lstat(keyPath);
    if (!info.isFile() || (await readFile(keyPath, "utf8")).trim() !== key)
      throw new Error("导出中的所有权验证文件冲突");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeFile(keyPath, key + "\n", { flag: "wx", mode: 0o644 });
  }
  return value;
}

export async function readPrepared(domain, release) {
  const value = JSON.parse(await readFile(preparedPath(domain, release), "utf8"));
  if (
    value.domain !== domain ||
    value.release !== release ||
    !/^(-|[a-f0-9]{64})$/.test(value.stateHash)
  )
    throw new Error("本地通知状态与当前发布不匹配");
  validateKey(value.key);
  value.previous = validateCheckpoint(value.previous, domain);
  value.manifest = validateManifest(value.manifest, domain);
  return value;
}

export async function saveCheckpoint(config, prepared, manifest, receipt) {
  const checkpoint = {
    version: 1,
    release: prepared.release,
    manifest,
    notifiedAt: new Date().toISOString(),
    receipt,
  };
  validateCheckpoint(checkpoint, config.domain);
  const payload = JSON.stringify(checkpoint) + "\n";
  if (Buffer.byteLength(payload) > 1024 * 1024) throw new Error("通知状态超过允许大小");
  await ssh(
    config,
    await readFile(remote, "utf8"),
    [config.deployPath, config.domain, "save", prepared.release, prepared.stateHash],
    Readable.from(prepared.key + "\n" + payload),
  );
}

export function validateCheckpoint(value, domain) {
  if (value === null) return null;
  if (
    value?.version !== 1 ||
    !value.release ||
    typeof value.notifiedAt !== "string" ||
    !Number.isFinite(Date.parse(value.notifiedAt)) ||
    value.receipt?.domain !== domain ||
    value.receipt.release !== value.release
  )
    throw new Error("已接收通知的状态结构无效");
  validateRelease(value.release);
  return { ...value, manifest: validateManifest(value.manifest, domain) };
}

export async function writeReceipt(domain, release, receipt) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(
    path.join(directory, deploySite(domain).id + "-" + validateRelease(release) + "-receipt.json"),
    JSON.stringify(receipt, null, 2) + "\n",
    { mode: 0o600 },
  );
}

function preparedPath(domain, release) {
  return path.join(
    directory,
    deploySite(domain).id + "-" + validateRelease(release) + "-prepared.json",
  );
}
