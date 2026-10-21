import Link from "next/link";
import { articles } from "@/lib/content/articles";
import { dual, text } from "@/lib/content/types";
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
    title: dual("使用指南", "How to use"),
    description: dual(
      "从打开麦克风到保存结果，跟着步骤完成一次噪音观察。",
      "Follow the steps to allow your microphone, watch sound changes and save a result.",
    ),
    action: dual("查看使用步骤", "Read the guide"),
  },
  {
    id: "how-it-works",
    icon: "audio-lines",
    title: dual("工作原理", "How it works"),
    description: dual(
      "看看网页怎样从麦克风输入估算分贝，以及读数有哪些限制。",
      "See how the browser estimates decibels from microphone input and where its limits are.",
    ),
    action: dual("了解测量过程", "Explore the process"),
  },
  {
    id: "faq",
    icon: "circle-question-mark",
    title: dual("常见问题", "Common questions"),
    description: dual(
      "读数准不准、麦克风打不开、录音怎么保存？按问题快速找答案。",
      "Find answers about accuracy, microphone access, audio recording and saved results.",
    ),
    action: dual("查找常见答案", "Find an answer"),
  },
] as const;

const articleGroups = [
  {
    id: "understand",
    title: dual("理解读数", "Understand readings"),
    description: dual(
      "先弄清数字代表什么，再判断怎样比较。",
      "Know what the numbers mean before comparing them.",
    ),
    articles: ["phone-accuracy", "dbfs-spl"],
  },
  {
    id: "reference",
    title: dual("查询声音参考", "Find a sound reference"),
    description: dual(
      "把抽象的分贝，放回熟悉的生活场景。",
      "Put decibel levels in the context of familiar sounds.",
    ),
    articles: ["decibel-chart"],
  },
  {
    id: "health",
    title: dual("了解噪音与健康", "Understand noise and health"),
    description: dual(
      "分清影响与暴露条件，再选择减少干扰的下一步。",
      "Understand effects and exposure before choosing how to reduce disturbance.",
    ),
    articles: ["noise-health"],
  },
  {
    id: "troubleshoot",
    title: dual("解决使用问题", "Fix an input problem"),
    description: dual(
      "从权限和设备入手，恢复声音观察。",
      "Check permissions and devices to get the meter working.",
    ),
    articles: ["microphone-help"],
  },
];

export function KnowledgePage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className={styles.page}>
      <StructuredData data={breadcrumbData("knowledge", locale)} />
      <header className={styles.header}>
        <p className={styles.eyebrow}>{en ? "SOUND, EXPLAINED" : "声音知识"}</p>
        <h1>{en ? "Decibel readings, explained" : "分贝怎么看，噪音怎么测？"}</h1>
        <p className={styles.intro}>
          {en
            ? "Understand readings, compare sounds, explore health effects or fix microphone access."
            : "从你遇到的问题出发：理解读数、查询声音、了解健康，或排查麦克风。"}
        </p>
        <nav className={styles.helpLinks} aria-label={en ? "Using the meter" : "工具使用帮助"}>
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
          <h2 id="try-meter-title">{en ? "Ready to try?" : "准备好观察一次了？"}</h2>
          <p>
            {en
              ? "Start with a generic noise estimate. Reference calibration is optional, and you can try a demo first."
              : "工具默认提供通用噪音估算，校准可选。也可以先体验演示，再决定是否打开麦克风。"}
          </p>
        </div>
        <Link href={href("meter", locale)}>
          {en ? "Open the meter" : "打开工具"}
          <LinkArrow size={16} />
        </Link>
      </section>
    </div>
  );
}
