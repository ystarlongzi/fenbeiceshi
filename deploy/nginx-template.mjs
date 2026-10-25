import { canonicalHref, sitePages } from "../src/lib/routing/pages.ts";
import { deploySite } from "./sites.mjs";

export function renderNginxTemplate(template, domain) {
  const site = deploySite(domain);
  let map = "";
  let rule = "";
  if (domain === "fenbeiceshi.com") {
    const entries = sitePages.flatMap((page) => {
      const old = `/en${page.slug ? `/${page.slug}` : ""}`;
      if (!/^\/en(?:\/[a-z0-9/-]+)?$/.test(old)) throw new Error("旧英文路径不符合 Nginx 映射约束");
      const target = canonicalHref(page.id, "en");
      return [`    ${old} ${target};`, `    ${old}/ ${target};`];
    });
    map = `map $uri $fenbeiceshi_english_target {\n    default "";\n${entries.join("\n")}\n}`;
    // 只对已发布英文主题跳转，未知路径保持 404；HTTP 与 www 也直接进入最终英文地址。
    rule =
      'if ($fenbeiceshi_english_target != "") { return 301 $fenbeiceshi_english_target$is_args$args; }';
  }
  return template
    .replaceAll("__SITE_KEY__", site.id)
    .replaceAll("__REDIRECT_MAP__", map)
    .replaceAll("__REDIRECT_RULE__", rule);
}
