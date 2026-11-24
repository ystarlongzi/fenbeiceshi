import { setTimeout } from "node:timers/promises";
import { validateManifest, validateUrl, manifestName } from "./manifest.mjs";
import { deploySite } from "../sites.mjs";

export async function publishedManifest(domain, fetcher = fetch) {
  const raw = await readPublic(domain, "/" + manifestName, "正文清单", fetcher);
  let value;
  try {
    value = JSON.parse(raw);
  } catch (cause) {
    throw new Error(domain + " 的生产正文清单不是有效 JSON", { cause });
  }
  return validateManifest(value, domain);
}

export async function verifyPublished(domain, release, manifest, key, fetcher = fetch) {
  deploySite(domain);
  validateKey(key);
  const [version, site, published, ownership] = await Promise.all([
    readPublic(domain, "/_release.txt", "版本", fetcher),
    readPublic(domain, "/_site.txt", "站点归属", fetcher),
    readPublic(domain, "/" + manifestName, "正文清单", fetcher),
    readPublic(domain, "/" + key + ".txt", "所有权验证", fetcher),
  ]);
  if (version.trim() !== release || site.trim() !== domain || ownership.trim() !== key)
    throw new Error(domain + " 的生产版本、站点归属或所有权验证不匹配");
  let value;
  try {
    value = JSON.parse(published);
  } catch (cause) {
    throw new Error(domain + " 的生产正文清单不是有效 JSON", { cause });
  }
  const actual = validateManifest(value, domain);
  if (JSON.stringify(actual) !== JSON.stringify(validateManifest(manifest, domain)))
    throw new Error(domain + " 的生产正文清单与本次构建不一致");
}

export async function submitUrls(domain, urls, key, { fetcher = fetch, pause = setTimeout } = {}) {
  deploySite(domain);
  validateKey(key);
  for (const url of urls) validateUrl(url, domain);
  if (new Set(urls).size !== urls.length) throw new Error("IndexNow 提交包含重复 URL");
  const receipts = [];
  for (let offset = 0; offset < urls.length; offset += 10000) {
    const batch = urls.slice(offset, offset + 10000);
    const body = JSON.stringify({
      host: domain,
      key,
      keyLocation: "https://" + domain + "/" + key + ".txt",
      urlList: batch,
    });
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      let response;
      try {
        response = await fetcher("https://api.indexnow.org/indexnow", {
          method: "POST",
          redirect: "manual",
          headers: { "content-type": "application/json; charset=utf-8" },
          body,
          signal: AbortSignal.timeout(15000),
        });
      } catch (cause) {
        lastError = new Error(domain + " 的 IndexNow 通知连接失败（第 " + attempt + " 次）", {
          cause,
        });
        if (attempt === 3) throw lastError;
        await pause(attempt * 1000);
        continue;
      }
      await response.body?.cancel();
      if (response.status === 200 || response.status === 202) {
        receipts.push({
          status: response.status,
          state: response.status === 200 ? "received" : "key-validation-pending",
          count: batch.length,
          attempts: attempt,
        });
        break;
      }
      lastError = new Error(domain + " 的 IndexNow 通知返回 HTTP " + response.status);
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === 3) throw lastError;
      const retryAfter = Number(response.headers.get("retry-after"));
      await pause(
        Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter, 10) * 1000
          : attempt * 1000,
      );
    }
  }
  return receipts;
}

export function validateKey(value) {
  if (typeof value !== "string" || !/^[a-f0-9]{32}$/.test(value))
    throw new Error("IndexNow 通知密钥格式无效");
  return value;
}

async function readPublic(domain, pathname, label, fetcher) {
  deploySite(domain);
  let response;
  try {
    response = await fetcher("https://" + domain + pathname, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (response.status !== 200) {
      await response.body?.cancel();
      throw new Error("HTTP " + response.status);
    }
    const value = await response.text();
    if (value.length > 1024 * 1024) throw new Error("响应超过允许大小");
    return value;
  } catch (cause) {
    throw new Error(domain + " 的" + label + "检查失败", { cause });
  }
}
