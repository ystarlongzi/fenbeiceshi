import { localize } from "@/lib/i18n/text";
import Link from "next/link";
import { articles } from "@/lib/content/articles";
import { translations, text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import { breadcrumbData } from "@/lib/seo/metadata";
import type { Locale } from "@/features/sound-meter/types";
import { Icon } from "../icon";
import { LinkArrow } from "../link-arrow";
import { StructuredData } from "../structured-data";
import styles from "./index.module.css";

const helpLinks = [
  {
    id: "guide",
    icon: "book-open",
    title: translations("使用指南", "How to use", "使用指南"),
    description: translations(
      "从打开麦克风到保存结果，跟着步骤完成一次噪音观察。",
      "Follow the steps to allow your microphone, watch sound changes and save a result.",
      "從開啟麥克風到儲存結果，跟著步驟完成一次噪音觀察。",
    ),
    action: translations("查看使用步骤", "Read the guide", "檢視使用步驟"),
  },
  {
    id: "how-it-works",
    icon: "audio-lines",
    title: translations("工作原理", "How it works", "工作原理"),
    description: translations(
      "看看网页怎样从麦克风输入估算分贝，以及读数有哪些限制。",
      "See how the browser estimates decibels from microphone input and where its limits are.",
      "看看網頁怎樣從麥克風輸入估算分貝，以及讀數有哪些限制。",
    ),
    action: translations("了解测量过程", "Explore the process", "瞭解測量過程"),
  },
  {
    id: "faq",
    icon: "circle-question-mark",
    title: translations("常见问题", "Common questions", "常見問題"),
    description: translations(
      "读数准不准、麦克风打不开、录音怎么保存？按问题快速找答案。",
      "Find answers about accuracy, microphone access, audio recording and saved results.",
      "讀數準不準、麥克風打不開、錄音怎麼儲存？按問題快速找答案。",
    ),
    action: translations("查找常见答案", "Find an answer", "查詢常見答案"),
  },
] as const;

const articleGroups = [
  {
    id: "understand",
    title: translations("理解读数", "Understand readings", "理解讀數"),
    description: translations(
      "先弄清数字代表什么，再判断怎样比较。",
      "Know what the numbers mean before comparing them.",
      "先弄清數字代表什麼，再判斷怎樣比較。",
    ),
    articles: ["phone-accuracy", "dbfs-spl"],
  },
  {
    id: "reference",
    title: translations("查询声音参考", "Find a sound reference", "查詢聲音參考"),
    description: translations(
      "把抽象的分贝，放回熟悉的生活场景。",
      "Put decibel levels in the context of familiar sounds.",
      "把抽象的分貝，放回熟悉的生活場景。",
    ),
    articles: ["decibel-chart"],
  },
  {
    id: "health",
    title: translations("了解噪音与健康", "Understand noise and health", "瞭解噪音與健康"),
    description: translations(
      "分清影响与暴露条件，再选择减少干扰的下一步。",
      "Understand effects and exposure before choosing how to reduce disturbance.",
      "分清影響與暴露條件，再選擇減少干擾的下一步。",
    ),
    articles: ["noise-health"],
  },
  {
    id: "troubleshoot",
    title: translations("解决使用问题", "Fix an input problem", "解決使用問題"),
    description: translations(
      "从权限和设备入手，恢复声音观察。",
      "Check permissions and devices to get the meter working.",
      "從權限和裝置入手，恢復聲音觀察。",
    ),
    articles: ["microphone-help"],
  },
];

export function KnowledgePage({ locale }: { locale: Locale }) {
  return (
    <div className={styles.page}>
      <StructuredData data={breadcrumbData("knowledge", locale)} />
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {localize(locale, "声音知识", "SOUND, EXPLAINED", "聲音知識")}
        </p>
        <h1>
          {localize(
            locale,
            "分贝怎么看，噪音怎么测？",
            "Decibel readings, explained",
            "分貝怎麼看，噪音怎麼測？",
          )}
        </h1>
        <p className={styles.intro}>
          {localize(
            locale,
            "从你遇到的问题出发：理解读数、查询声音、了解健康，或排查麦克风。",
            "Understand readings, compare sounds, explore health effects or fix microphone access.",
            "從你遇到的問題出發：理解讀數、查詢聲音、瞭解健康，或排查麥克風。",
          )}
        </p>
        <nav
          className={styles.helpLinks}
          aria-label={localize(locale, "工具使用帮助", "Using the meter", "工具使用幫助")}
        >
          {helpLinks.map((item) => (
            <Link
              key={item.id}
              className={styles.helpCard}
              href={href(item.id, locale)}
              data-help-id={item.id}
              aria-labelledby={`help-${item.id}-title`}
              aria-describedby={`help-${item.id}-description`}
            >
              <div className={styles.helpCardHeading}>
                <Icon name={item.icon} size={24} />
                <h2 id={`help-${item.id}-title`}>{text(item.title, locale)}</h2>
              </div>
              <p id={`help-${item.id}-description`}>{text(item.description, locale)}</p>
              <span className={styles.helpCardAction}>
                <span className={styles.helpCardActionLabel}>{text(item.action, locale)}</span>
                <LinkArrow size={16} />
              </span>
            </Link>
          ))}
        </nav>
      </header>
      <div className={styles.directory}>
        {articleGroups.map((group) => (
          <section key={group.id} className={styles.group} aria-labelledby={`${group.id}-title`}>
            <div className={styles.groupIntro}>
              <h2 id={`${group.id}-title`}>{text(group.title, locale)}</h2>
              <p>{text(group.description, locale)}</p>
            </div>
            <div className={styles.links}>
              {articles
                .filter((article) => group.articles.includes(article.id))
                .map((article) => (
                  <Link key={article.id} href={href(article.id, locale)}>
                    <div>
                      <h3>{text(article.title, locale)}</h3>
                      <p>{text(article.description, locale)}</p>
                    </div>
                    <LinkArrow size={20} className={styles.articleArrow} />
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
      <section className={styles.help} aria-labelledby="try-meter-title">
        <Icon name="mic" size={22} />
        <div>
          <h2 id="try-meter-title">
            {localize(locale, "准备好观察一次了？", "Ready to try?", "準備好觀察一次了？")}
          </h2>
          <p>
            {localize(
              locale,
              "工具默认提供通用噪音估算，可按需手动加减读数。也可以先体验演示，再决定是否打开麦克风。",
              "Start with a generic noise estimate. Manual adjustment is optional, and you can try a demo first.",
              "工具預設提供通用噪音估算，可依需要手動加減讀數。也可以先體驗演示，再決定是否開啟麥克風。",
            )}
          </p>
        </div>
        <Link href={href("meter", locale)}>
          {localize(locale, "打开工具", "Open the meter", "開啟工具")}
          <LinkArrow size={16} />
        </Link>
      </section>
    </div>
  );
}
