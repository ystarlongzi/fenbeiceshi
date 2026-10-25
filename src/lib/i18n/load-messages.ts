import type { Locale } from "./locales.ts";
import { isAdditionalLocale, type AdditionalLocale } from "./additional-locales.ts";
import { registerMessages, type Messages } from "./messages.ts";

const loaders = {
  es: () => import("./messages/es/index.ts"),
  de: () => import("./messages/de/index.ts"),
  fr: () => import("./messages/fr/index.ts"),
  "pt-BR": () => import("./messages/pt-BR/index.ts"),
  ru: () => import("./messages/ru/index.ts"),
  it: () => import("./messages/it/index.ts"),
  ko: () => import("./messages/ko/index.ts"),
  ja: () => import("./messages/ja/index.ts"),
  no: () => import("./messages/no/index.ts"),
  sv: () => import("./messages/sv/index.ts"),
  da: () => import("./messages/da/index.ts"),
  nl: () => import("./messages/nl/index.ts"),
  fi: () => import("./messages/fi/index.ts"),
  el: () => import("./messages/el/index.ts"),
  pl: () => import("./messages/pl/index.ts"),
  tr: () => import("./messages/tr/index.ts"),
  id: () => import("./messages/id/index.ts"),
  vi: () => import("./messages/vi/index.ts"),
  cs: () => import("./messages/cs/index.ts"),
  hu: () => import("./messages/hu/index.ts"),
  sk: () => import("./messages/sk/index.ts"),
  th: () => import("./messages/th/index.ts"),
  ro: () => import("./messages/ro/index.ts"),
  ar: () => import("./messages/ar/index.ts"),
};
const pending = new Map<AdditionalLocale, Promise<Messages>>();

// 文章词典只从服务端入口加载；客户端边界只接收当前语言的界面文案。
export function prepareLocale(locale: Locale): Promise<Messages | null> {
  if (!isAdditionalLocale(locale)) return Promise.resolve(null);
  const cached = pending.get(locale);
  if (cached) return cached;
  const ready = loaders[locale]().then(({ ui, content }) => {
    registerMessages(locale, { ...content, ...ui });
    return Object.freeze(ui);
  });
  pending.set(locale, ready);
  return ready;
}
