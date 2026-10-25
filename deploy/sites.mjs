export const deploySites = {
  "fenbeiceshi.com": { id: "fenbeiceshi", output: "out" },
  "soundmetergo.com": { id: "soundmetergo", output: "out-soundmetergo" },
};

export function deploySite(domain) {
  if (!Object.hasOwn(deploySites, domain)) throw new Error("域名不属于此项目");
  return deploySites[domain];
}

export function requiredSiteFiles(domain) {
  deploySite(domain);
  const routes = ["", "guide/", "knowledge/decibel-chart/", "records/"];
  const prefixes = domain === "fenbeiceshi.com" ? ["", "zh-tw/"] : [""];
  return [
    ...prefixes.flatMap((prefix) => routes.map((route) => `${prefix}${route}index.html`)),
    "404.html",
    "audio/pcm-recorder.js",
    "vendor/lamejs/lamejs.js",
    "vendor/lamejs/COPYING.LESSER.txt",
    "robots.txt",
    "sitemap.xml",
    "_site.txt",
  ];
}
