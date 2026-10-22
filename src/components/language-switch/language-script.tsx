import type { Locale } from "@/lib/i18n/locales";
import { languageBootstrap } from "@/lib/i18n/preference";

export function LanguageScript({ locale, available }: { locale: Locale; available: string[] }) {
  return (
    <script
      id="language-init"
      dangerouslySetInnerHTML={{ __html: languageBootstrap(locale, available) }}
    />
  );
}
