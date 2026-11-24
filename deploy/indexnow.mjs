import { appendFile, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadDeployEnv } from "./env.mjs";
import { connection, parseArgs, validateRelease } from "./lib.mjs";
import { deploySites, deploySite } from "./sites.mjs";
import { changedUrls, validateManifest, validateUrl } from "./indexnow/manifest.mjs";
import { submitUrls, verifyPublished } from "./indexnow/http.mjs";
import { prepare, readPrepared, saveCheckpoint, writeReceipt } from "./indexnow/state.mjs";

export function notificationPlan(prepared, selected) {
  const { manifest, previous } = prepared;
  if (selected) {
    if (!previous) throw new Error("手动通知前需要先完成首次基线建立");
    const urls = [...new Set(selected)].sort();
    if (!urls.length) throw new Error("手动通知 URL 列表为空");
    for (const url of urls) {
      validateUrl(url, manifest.domain);
      if (!Object.hasOwn(manifest.pages, url)) throw new Error("手动通知必须是当前可索引页面");
    }
    // 手动补交通知只推进这些 URL，保留其余尚未发送的差异。
    const pages = { ...previous.manifest.pages };
    for (const url of urls) pages[url] = manifest.pages[url];
    return {
      urls,
      next: validateManifest({ ...manifest, pages }, manifest.domain),
      bootstrap: false,
    };
  }
  return { urls: changedUrls(previous?.manifest, manifest), next: manifest, bootstrap: !previous };
}

export async function notify(
  config,
  prepared,
  selected,
  { dryRun = false, verify = verifyPublished, submit = submitUrls, save = saveCheckpoint } = {},
) {
  const plan = notificationPlan(prepared, selected);
  const receipt = {
    domain: config.domain,
    release: prepared.release,
    bootstrap: plan.bootstrap,
    dryRun,
    count: plan.urls.length,
    urls: plan.urls,
    batches: [],
  };
  if (dryRun) return receipt;
  await verify(config.domain, prepared.release, prepared.manifest, prepared.key);
  receipt.batches = await submit(config.domain, plan.urls, prepared.key);
  await save(config, prepared, plan.next, receipt);
  return receipt;
}

async function main() {
  const [action, ...argv] = process.argv.slice(2);
  if (!["prepare", "notify"].includes(action))
    throw new Error(
      "用法：node deploy/indexnow.mjs <prepare|notify> --release <版本> [--domain <本站域名>] [--dry-run] [--url-file <JSON>]",
    );
  const args = parseArgs(argv, {
    release: "string",
    domain: "string",
    path: "string",
    "env-file": "string",
    "dry-run": "boolean",
    "url-file": "string",
    published: "boolean",
  });
  if (args.published && action !== "prepare")
    throw new Error("--published 只用于准备已发布版本的通知");
  if (args.path && !args.domain) throw new Error("--path 必须与 --domain 同时使用");
  if (args["url-file"] && (action !== "notify" || !args.domain))
    throw new Error("--url-file 只用于指定站点的 notify 操作");
  const release = validateRelease(args.release ?? process.env.RELEASE_ID);
  const env = await loadDeployEnv(args);
  const domains = args.domain ? [args.domain] : Object.keys(deploySites);
  for (const domain of domains) deploySite(domain);
  let selected;
  if (args["url-file"]) {
    selected = JSON.parse(await readFile(args["url-file"], "utf8"));
    if (!Array.isArray(selected) || selected.length > 10000)
      throw new Error("手动通知文件必须是最多 10000 项的 URL 数组");
  }
  const errors = [];
  for (const domain of domains) {
    const config = connection(
      {
        domain,
        path:
          args.path ??
          (domain === "soundmetergo.com"
            ? (env.SOUNDMETERGO_DEPLOY_PATH ?? "/www/wwwroot/soundmetergo")
            : (env.DEPLOY_PATH ?? "/www/wwwroot/fenbeiceshi")),
      },
      env,
    );
    try {
      if (action === "prepare") {
        if (!args["dry-run"])
          await prepare(config, release, { published: Boolean(args.published) });
        console.log(
          domain +
            "：IndexNow " +
            (args["dry-run"] ? "准备预演，不连接服务器" : "所有权文件与通知基线已准备"),
        );
      } else {
        const prepared = await readPrepared(domain, release);
        const receipt = await notify(config, prepared, selected, {
          dryRun: Boolean(args["dry-run"]),
        });
        if (!args["dry-run"]) await writeReceipt(domain, release, receipt);
        const statuses = receipt.batches.map((item) => String(item.status)).join(", ");
        const summary =
          domain +
          "：IndexNow " +
          (receipt.dryRun ? "预演 " : "") +
          (receipt.bootstrap ? "首次建立基线，不重提历史页面" : receipt.count + " 个变化 URL") +
          (statuses ? "；HTTP " + statuses : "") +
          (receipt.batches.some((item) => item.status === 202) ? "（已接收，密钥验证待完成）" : "");
        console.log(summary);
        if (process.env.GITHUB_STEP_SUMMARY)
          await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n\n");
      }
    } catch (error) {
      const message = redact(error.message);
      errors.push(domain + "：" + message);
      console.error(domain + "：IndexNow " + action + " 失败：" + message);
      if (action === "notify") {
        try {
          await writeReceipt(domain, release, {
            domain,
            release,
            failedAt: new Date().toISOString(),
            error: message,
          });
          if (process.env.GITHUB_STEP_SUMMARY)
            await appendFile(
              process.env.GITHUB_STEP_SUMMARY,
              domain + "：IndexNow 操作失败；站点已发布，请核对接收结果和通知状态后重试。\n\n",
            );
        } catch (reportError) {
          const detail = domain + "：通知结果记录失败：" + redact(reportError.message);
          errors.push(detail);
          console.error(detail);
        }
      }
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

function redact(value) {
  return String(value).replace(/\b[a-f0-9]{32}\b/gi, "[redacted]");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error("IndexNow 操作失败：" + redact(error.message));
    process.exitCode = 1;
  });
