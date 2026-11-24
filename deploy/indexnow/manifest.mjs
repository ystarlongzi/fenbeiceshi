import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { deploySite } from "../sites.mjs";

export const manifestName = "_indexnow-manifest.json";

export async function createManifest(directory, domain) {
  deploySite(domain);
  const sitemap = await readFile(path.join(directory, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) => item[1]);
  if (!urls.length || urls.length > 10000 || new Set(urls).size !== urls.length)
    throw new Error("IndexNow sitemap 数量无效或包含重复 URL");
  const pages = {};
  // 分批读取避免多语言导出同时打开过多文件；同批页面之间没有依赖。
  for (let offset = 0; offset < urls.length; offset += 32) {
    const batch = await Promise.all(
      urls.slice(offset, offset + 32).map(async (url) => {
        const parsed = validateUrl(url, domain);
        const html = await readFile(path.join(directory, parsed.pathname, "index.html"), "utf8");
        return [url, fingerprint(html, url)];
      }),
    );
    for (const [url, hash] of batch) pages[url] = hash;
  }
  return validateManifest({ version: 1, domain, pages }, domain);
}

export async function writeManifest(directory, domain) {
  const manifest = await createManifest(directory, domain);
  await writeFile(path.join(directory, manifestName), JSON.stringify(manifest) + "\n");
}

export function validateUrl(value, domain) {
  deploySite(domain);
  const url = new URL(value);
  if (
    url.origin !== "https://" + domain ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/(?:[a-z0-9-]+\/)*$/.test(url.pathname) ||
    url.href !== value
  )
    throw new Error("IndexNow URL 必须是本站无参数的 HTTPS 规范地址");
  return url;
}

export function validateManifest(value, domain) {
  deploySite(domain);
  if (
    value?.version !== 1 ||
    value.domain !== domain ||
    !value.pages ||
    typeof value.pages !== "object" ||
    Array.isArray(value.pages)
  )
    throw new Error("IndexNow 清单版本、域名或结构无效");
  const entries = Object.entries(value.pages);
  if (!entries.length || entries.length > 10000) throw new Error("IndexNow 清单数量无效");
  for (const [url, hash] of entries) {
    validateUrl(url, domain);
    if (typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error("IndexNow 正文指纹无效");
  }
  return {
    version: 1,
    domain,
    pages: Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b))),
  };
}

export function changedUrls(previous, current) {
  validateManifest(current, current.domain);
  // 首次接入只建立基线，避免把所有历史页面当作刚刚发生变化。
  if (!previous) return [];
  validateManifest(previous, current.domain);
  return [...new Set([...Object.keys(previous.pages), ...Object.keys(current.pages)])]
    .filter((url) => previous.pages[url] !== current.pages[url])
    .sort();
}

export function fingerprint(html, url) {
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  const robots = html.match(/<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/)?.[1];
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/)?.[1];
  if (canonical !== url || !robots || /noindex/i.test(robots) || !main || !title || !description)
    throw new Error("IndexNow 清单中的页面缺少可索引正文或自 canonical：" + url);
  // RSC、构建资源哈希和公共页头变化不代表正文变化，不用它们触发整站重提。
  const visible = main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const text = visible
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const links = [...visible.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((item) => item[1]);
  const languages = [
    ...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*hrefLang="([^"]*)"[^>]*href="([^"]*)"/g),
  ]
    .map((item) => [item[1], item[2]])
    .sort(([a], [b]) => a.localeCompare(b));
  return createHash("sha256")
    .update(JSON.stringify({ canonical, robots, title, description, text, links, languages }))
    .digest("hex");
}
