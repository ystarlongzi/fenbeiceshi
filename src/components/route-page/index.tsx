import { localize } from "@/lib/i18n/text";
import type { Locale } from "@/features/sound-meter/types";
import { href, type SitePage } from "@/lib/routing/pages";
import { ContentPage } from "../content-page";
import { KnowledgePage } from "../knowledge-page";
import { FaqPage } from "../faq-page";
import { RecordsPanel } from "@/features/records";
import { DecibelChart } from "@/features/decibel-chart";
import { SoundDetailPage } from "@/features/decibel-details";
import { soundDetails } from "@/lib/content/decibel-details";
import { NoiseHealthArticle } from "@/features/noise-health";
import styles from "./index.module.css";
import { Notice } from "../notice";

export function RoutePage({ page, locale }: { page: SitePage; locale: Locale }) {
  if (page.kind === "knowledge") return <KnowledgePage locale={locale} />;
  if (page.id === "decibel-chart") return <DecibelChart locale={locale} />;
  const soundDetail = soundDetails.find((detail) => detail.content.id === page.id);
  if (soundDetail) return <SoundDetailPage detail={soundDetail} locale={locale} />;
  if (page.id === "noise-health") return <NoiseHealthArticle locale={locale} />;
  if (page.id === "china-noise-standards" || page.id === "workplace-noise-standards") {
    const isRegulations = page.id === "china-noise-standards";
    return (
      <ContentPage
        id={page.id}
        locale={locale}
        cta={{
          title: localize(
            locale,
            "继续了解标准与防护",
            "Explore standards and protection",
            "繼續瞭解標準與防護",
          ),
          description: localize(
            locale,
            "按适用场景继续阅读，理解职业暴露与实际防护的条件。",
            "Read on for the conditions behind occupational exposure and effective protection.",
            "按適用情境繼續閱讀，理解職業暴露與實際防護的條件。",
          ),
          href: href(isRegulations ? "workplace-noise-standards" : "hearing-protection", locale),
          label: isRegulations
            ? localize(
                locale,
                "对比中美欧职业标准",
                "Compare workplace standards",
                "對比中美歐職業標準",
              )
            : localize(
                locale,
                "了解听力保护方法",
                "Explore hearing protection",
                "瞭解聽力保護方法",
              ),
        }}
      />
    );
  }
  if (page.id === "when-professional-meter")
    return (
      <ContentPage
        id={page.id}
        locale={locale}
        cta={{
          title: localize(
            locale,
            "准备好再联系",
            "Prepare before you get in touch",
            "準備好再聯絡",
          ),
          description: localize(
            locale,
            "整理声音出现的时间、位置和影响，方便物业、维护或检测人员了解情况。",
            "Note when and where the sound occurs and what it affects, so the people helping you can understand the problem.",
            "整理聲音出現的時間、位置和影響，方便物業、維護或檢測人員瞭解情況。",
          ),
          href: `${href(page.id, locale)}#prepare`,
          label: localize(locale, "查看联系前清单", "See what to prepare", "檢視聯絡前清單"),
        }}
      />
    );
  if (page.id === "hearing-protection")
    return (
      <ContentPage
        id={page.id}
        locale={locale}
        cta={{
          title: localize(
            locale,
            "了解声级与暴露时长",
            "Understand level and exposure time",
            "瞭解聲級與暴露時長",
          ),
          description: localize(
            locale,
            "继续查看健康影响与职业暴露参考，理解不同建议的适用条件。",
            "Explore health effects and the occupational reference, with their different contexts.",
            "繼續檢視健康影響與職業暴露參考，理解不同建議的適用條件。",
          ),
          href: `${href("noise-health", locale)}#exposure`,
          label: localize(
            locale,
            "查看暴露时长参考",
            "View the exposure reference",
            "檢視暴露時長參考",
          ),
        }}
      />
    );
  if (page.id === "faq") return <FaqPage locale={locale} />;
  if (page.kind === "records")
    return (
      <div className={styles.records}>
        <header className={styles.recordsHeader}>
          <p className={styles.eyebrow}>
            {localize(
              locale,
              "每一次观察，都留下条件",
              "YOUR OBSERVATIONS",
              "每一次觀察，都留下條件",
            )}
          </p>
          <h1>{localize(locale, "我的测量记录", "My measurement records", "我的測量記錄")}</h1>
          <p className={styles.intro}>
            {localize(
              locale,
              "回看已保存的摘要，或选择两次同条件观察，比较声音的变化。",
              "Revisit saved summaries, or compare two observations made under the same conditions.",
              "回看已儲存的摘要，或選擇兩次同條件觀察，比較聲音的變化。",
            )}
          </p>
        </header>
        {locale === "en" ? (
          <Notice className={styles.migration}>
            Earlier reports and recordings remain in this browser’s storage for fenbeiceshi.com.{" "}
            <a href="https://fenbeiceshi.com/records/?language=zh-CN">
              Open earlier records to download them.
            </a>{" "}
            Data is not transferred between domains automatically.
          </Notice>
        ) : null}
        <RecordsPanel locale={locale} />
      </div>
    );
  return <ContentPage id={page.id} locale={locale} />;
}
