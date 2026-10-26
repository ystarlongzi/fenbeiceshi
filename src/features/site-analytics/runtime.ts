import { analyticsLocation, analyticsReferrer } from "./model.ts";

type GoogleTag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GoogleTag;
} & Record<`ga-disable-${string}`, boolean>;

export function createAnalyticsRuntime(scope: Window, doc: Document, id: string) {
  const browser = scope as AnalyticsWindow;
  let configured = false;
  let active = false;
  let lastLocation = "";
  let previousLocation = analyticsReferrer(doc.referrer);

  function disable() {
    browser[`ga-disable-${id}`] = true;
    if (!active) return;
    active = false;
    lastLocation = "";
    // 只清理本站此数据流的 Cookie，不触碰报告、录音或其他偏好。
    for (const name of ["_ga", `_ga_${id.slice(2)}`]) {
      for (const domain of ["", `; Domain=${scope.location.hostname}`])
        doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain}`;
    }
  }

  function pageView(locale: string) {
    const location = analyticsLocation(scope.location.href);
    if (!location) return;
    browser[`ga-disable-${id}`] = false;
    if (!configured) {
      browser.dataLayer ??= [];
      browser.gtag ??= function () {
        // eslint-disable-next-line prefer-rest-params -- 保持 gtag.js 官方命令队列协议。
        browser.dataLayer!.push(arguments);
      };
      const tag = browser.gtag;
      tag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      tag("consent", "update", { analytics_storage: "granted" });
      tag("js", new Date());
      tag("config", id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: location,
        page_referrer: previousLocation,
        language: locale,
        cookie_flags: "SameSite=Lax;Secure",
      });
      // 初始化、同意状态和去重规则就绪后才异步加载外部脚本。
      const script = doc.createElement("script");
      script.id = "site-google-analytics";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      script.onerror = () => {
        doc.documentElement.dataset.analyticsLoad = "unavailable";
        console.warn("访问统计脚本未能加载，测量和本机记录仍可正常使用。");
      };
      script.onload = () => {
        doc.documentElement.dataset.analyticsLoad = "ready";
      };
      doc.head.appendChild(script);
      configured = true;
    }
    active = true;
    if (location === lastLocation) return;
    const parameters = {
      page_location: location,
      page_referrer: previousLocation,
      page_title: doc.title,
      language: locale,
    };
    browser.gtag!("set", parameters);
    browser.gtag!("event", "page_view", { ...parameters, send_to: id });
    previousLocation = location;
    lastLocation = location;
  }

  return { pageView, disable };
}
