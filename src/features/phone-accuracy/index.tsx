import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { LinkArrow } from "@/components/link-arrow";
import { href } from "@/lib/routing/pages";
import type { Locale } from "@/features/sound-meter/types";
import { accuracyAction, accuracyLinks } from "./copy";
import styles from "./index.module.css";

export function PhoneAccuracyPage({ locale }: { locale: Locale }) {
  const chinese = locale === "zh-CN" ? "zh" : locale === "zh-TW" ? "zhTW" : null;
  if (!chinese) return <ContentPage id="phone-accuracy" locale={locale} />;

  return (
    <ContentPage
      id="phone-accuracy"
      locale={locale}
      sectionContent={Object.fromEntries(
        accuracyLinks.map((link) => [
          link.section,
          <p key={link.section} data-accuracy-context={link.section}>
            <Link className={styles.contextLink} href={`${href(link.pageId, locale)}#${link.hash}`}>
              {link.label[chinese]}
              <LinkArrow size={15} />
            </Link>
          </p>,
        ]),
      )}
      cta={{
        title: accuracyAction.title[chinese],
        description: accuracyAction.description[chinese],
        href: `${href("meter", locale)}#measure`,
        label: accuracyAction.label[chinese],
      }}
    />
  );
}
