import { ANALYTICS_CONSENT_KEY, parseConsent, type AnalyticsConsent } from "./model.ts";

const CHANGE_EVENT = "fenbeiceshi:analytics-consent";
interface ConsentSnapshot {
  choice: AnalyticsConsent;
  error: boolean;
  ready: boolean;
}
const serverSnapshot: Readonly<ConsentSnapshot> = Object.freeze({
  choice: null as AnalyticsConsent,
  error: false,
  ready: false,
});
let snapshot = serverSnapshot;

function readPreference() {
  try {
    snapshot = {
      choice: parseConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)),
      error: false,
      ready: true,
    };
  } catch {
    snapshot = { choice: null, error: true, ready: true };
  }
}

export function getConsentSnapshot() {
  if (!snapshot.ready) readPreference();
  return snapshot;
}

export function getServerConsentSnapshot() {
  return serverSnapshot;
}

export function setAnalyticsConsent(choice: Exclude<AnalyticsConsent, null>) {
  if (choice !== "granted" && choice !== "denied") throw new RangeError("无效的统计偏好。");
  let error: Error | null = null;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
  } catch (cause) {
    error = new Error("本次统计选择已生效，但浏览器未能保存此偏好。", { cause });
  }
  snapshot = { choice, error: error !== null, ready: true };
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return error;
}

export function subscribeAnalyticsConsent(listener: () => void) {
  function stored(event: StorageEvent) {
    if (event.key !== ANALYTICS_CONSENT_KEY && event.key !== null) return;
    readPreference();
    listener();
  }
  window.addEventListener("storage", stored);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", stored);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}
