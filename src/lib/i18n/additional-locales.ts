// 国际站实际提供的新增语种；词典覆盖与静态内容由发布检查共同验证。
export const additionalLocaleSettings = {
  es: { prefix: "/es", label: "Español", openGraph: "es_ES", date: "es-ES", direction: "ltr" },
  de: { prefix: "/de", label: "Deutsch", openGraph: "de_DE", date: "de-DE", direction: "ltr" },
  fr: { prefix: "/fr", label: "Français", openGraph: "fr_FR", date: "fr-FR", direction: "ltr" },
  "pt-BR": {
    prefix: "/pt-br",
    label: "Português (Brasil)",
    openGraph: "pt_BR",
    date: "pt-BR",
    direction: "ltr",
  },
  ru: { prefix: "/ru", label: "Русский", openGraph: "ru_RU", date: "ru-RU", direction: "ltr" },
  it: { prefix: "/it", label: "Italiano", openGraph: "it_IT", date: "it-IT", direction: "ltr" },
  ko: { prefix: "/ko", label: "한국어", openGraph: "ko_KR", date: "ko-KR", direction: "ltr" },
  ja: { prefix: "/ja", label: "日本語", openGraph: "ja_JP", date: "ja-JP", direction: "ltr" },
  no: { prefix: "/no", label: "Norsk bokmål", openGraph: "nb_NO", date: "nb-NO", direction: "ltr" },
  sv: { prefix: "/sv", label: "Svenska", openGraph: "sv_SE", date: "sv-SE", direction: "ltr" },
  da: { prefix: "/da", label: "Dansk", openGraph: "da_DK", date: "da-DK", direction: "ltr" },
  nl: { prefix: "/nl", label: "Nederlands", openGraph: "nl_NL", date: "nl-NL", direction: "ltr" },
  fi: { prefix: "/fi", label: "Suomi", openGraph: "fi_FI", date: "fi-FI", direction: "ltr" },
  el: { prefix: "/el", label: "Ελληνικά", openGraph: "el_GR", date: "el-GR", direction: "ltr" },
  pl: { prefix: "/pl", label: "Polski", openGraph: "pl_PL", date: "pl-PL", direction: "ltr" },
  tr: { prefix: "/tr", label: "Türkçe", openGraph: "tr_TR", date: "tr-TR", direction: "ltr" },
  id: {
    prefix: "/id",
    label: "Bahasa Indonesia",
    openGraph: "id_ID",
    date: "id-ID",
    direction: "ltr",
  },
  vi: { prefix: "/vi", label: "Tiếng Việt", openGraph: "vi_VN", date: "vi-VN", direction: "ltr" },
  cs: { prefix: "/cs", label: "Čeština", openGraph: "cs_CZ", date: "cs-CZ", direction: "ltr" },
  hu: { prefix: "/hu", label: "Magyar", openGraph: "hu_HU", date: "hu-HU", direction: "ltr" },
  sk: { prefix: "/sk", label: "Slovenčina", openGraph: "sk_SK", date: "sk-SK", direction: "ltr" },
  th: { prefix: "/th", label: "ไทย", openGraph: "th_TH", date: "th-TH", direction: "ltr" },
  ro: { prefix: "/ro", label: "Română", openGraph: "ro_RO", date: "ro-RO", direction: "ltr" },
  ar: { prefix: "/ar", label: "العربية", openGraph: "ar_AR", date: "ar", direction: "rtl" },
} as const;

export type AdditionalLocale = keyof typeof additionalLocaleSettings;
export const additionalLocales = Object.keys(additionalLocaleSettings) as AdditionalLocale[];

export function isAdditionalLocale(value: string): value is AdditionalLocale {
  return Object.hasOwn(additionalLocaleSettings, value);
}
