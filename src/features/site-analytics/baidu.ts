import { analyticsLocation } from "./model.ts";

export const BAIDU_SITE_ID = "dd4dc5db781946002c436e7f06507c56";
type BaiduCommand = [string, ...unknown[]];
type BaiduWindow = Window & { _hmt?: { push: (command: BaiduCommand) => unknown } };

export function createBaiduAnalyticsRuntime(scope: Window, doc: Document) {
  const browser = scope as BaiduWindow;
  let configured = false;
  let loaded = false;
  let active = false;
  let lastLocation = "";

  function settings(enabled: boolean): BaiduCommand[] {
    return [
      ["_setAutoPageview", false],
      ["_setAutoEventTracking", false],
      ["_setAutoTracking", enabled],
    ];
  }

  function disable() {
    if (!configured || !active) return;
    active = false;
    lastLocation = "";
    // 下载期间撤回时丢弃待发页面事件，避免脚本到达后补发。
    if (!loaded) browser._hmt = settings(false);
    else browser._hmt?.push(["_setAutoTracking", false]);
    for (const prefix of ["Hm_lvt", "Hm_lpvt", "Hm_cv", "Hm_ck"]) {
      for (const domain of ["", "; Domain=fenbeiceshi.com"])
        doc.cookie = `${prefix}_${BAIDU_SITE_ID}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain}`;
    }
  }

  function pageView() {
    const location = analyticsLocation(scope.location.href);
    if (!location || scope.location.hostname !== "fenbeiceshi.com") return;
    if (!configured) {
      const queue = (browser._hmt ??= [] as BaiduCommand[]);
      for (const command of settings(true)) queue.push(command);
      const script = doc.createElement("script");
      script.id = "site-baidu-analytics";
      script.async = true;
      script.src = `https://hm.baidu.com/hm.js?${BAIDU_SITE_ID}`;
      script.onerror = () => {
        doc.documentElement.dataset.baiduAnalyticsLoad = "unavailable";
        console.warn("百度统计脚本未能加载，测量和本机记录仍可正常使用。");
      };
      script.onload = () => {
        loaded = true;
        doc.documentElement.dataset.baiduAnalyticsLoad = "ready";
      };
      doc.head.appendChild(script);
      configured = true;
      active = true;
    }
    if (!active) {
      browser._hmt!.push(["_setAutoTracking", true]);
      active = true;
    }
    if (location === lastLocation) return;
    browser._hmt!.push(["_trackPageview", new URL(location).pathname]);
    lastLocation = location;
  }

  return { pageView, disable };
}
