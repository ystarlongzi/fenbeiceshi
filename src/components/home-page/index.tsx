import Link from "next/link";
import { SoundMeter } from "@/features/sound-meter";
import { RecordsPanel } from "@/features/records";
import type { Locale } from "@/features/sound-meter/types";
import { articles } from "@/lib/content/articles";
import { homeFaqItems } from "@/lib/content/faq";
import { text } from "@/lib/content/types";
import { href, SITE_URL } from "@/lib/routing/pages";
import { Icon, type IconName } from "../icon";
import { LinkArrow } from "../link-arrow";
import { StructuredData } from "../structured-data";
import { FaqList } from "../faq-list";
import styles from "./index.module.css";

export function HomePage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const scenes: {
    title: string;
    description: string;
    note: string;
    icon: IconName;
    target: string;
  }[] = en
    ? [
        {
          title: "Check your room's noise",
          description:
            "Observe the same spot at different times. Keep a note of windows and background activity.",
          note: "Same position · repeat observations",
          icon: "house",
          target: "guide",
        },
        {
          title: "Compare an appliance",
          description: "Compare on and off states with the same device, distance and settings.",
          note: "Same distance · record the state",
          icon: "audio-lines",
          target: "phone-accuracy",
        },
        {
          title: "Check a change",
          description:
            "Observe before and after closing a window. Keep input and outside conditions in context.",
          note: "Same input · check the conditions",
          icon: "sliders-horizontal",
          target: "calibration",
        },
      ]
    : [
        {
          title: "看看房间有多吵",
          description: "在相同位置，观察不同时段的声音。记下门窗状态和背景活动。",
          note: "固定位置 · 重复观察",
          icon: "house",
          target: "guide",
        },
        {
          title: "比较一件家电的变化",
          description: "在同一距离，观察关闭和开启状态。保持设备、档位与输入设置一致。",
          note: "固定距离 · 记录状态",
          icon: "audio-lines",
          target: "phone-accuracy",
        },
        {
          title: "看看关窗前后的不同",
          description: "在同一观察位置，比较开窗和关窗。把外部声音的变化也记录下来。",
          note: "同一输入 · 核对条件",
          icon: "sliders-horizontal",
          target: "calibration",
        },
      ];
  const steps = en
    ? [
        {
          title: "Start with your microphone",
          body: "Start measuring and allow access to your microphone.",
        },
        {
          title: "Observe the change",
          body: "Check the mode and keep your device and position steady.",
        },
        {
          title: "Keep the context",
          body: "Finish, save a local summary, and repeat under matching conditions.",
        },
      ]
    : [
        { title: "打开麦克风", body: "点击开始，并允许访问当前麦克风。" },
        { title: "观察声音变化", body: "查看估算读数，保持设备、位置和输入设置稳定。" },
        { title: "把条件一起记下", body: "结束后保存本机摘要，在相同条件下再次观察。" },
      ];
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: en ? "FenbeiCeshi Sound Observation Tool" : "分贝测试",
          url: SITE_URL + href("meter", locale),
          inLanguage: locale,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          description: en
            ? "Generic noise estimates with optional reference calibration. No raw audio uploads."
            : "默认提供通用估算噪音分贝，参考校准可选，原始音频不上传。",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className={styles.measurement} aria-labelledby="home-title">
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              <span />
              {en ? "NO INSTALLATION · AUDIO STAYS LOCAL" : "免安装 · 音频本机处理"}
            </p>
            <h1 id="home-title">
              {en ? "Online decibel meter" : "在线分贝测试"}
              <span>{en ? "Sound, in context." : "看见声音的变化"}</span>
            </h1>
            <p className={styles.intro}>
              {en
                ? "See estimated noise levels and trends, then keep a summary with its conditions."
                : "用麦克风查看估算噪音分贝与变化趋势，把本次条件和摘要一起留下。"}
            </p>
          </div>
          <Link className={styles.heroHelp} href={href("phone-accuracy", locale)}>
            <Icon name="circle-alert" size={15} />
            {en ? "How accurate is it?" : "手机测分贝，准吗？"}
            <LinkArrow size={14} />
          </Link>
        </header>
        <SoundMeter locale={locale} />
        <div className={styles.recordSection}>
          <RecordsPanel locale={locale} compact />
        </div>
      </section>
      <section className={styles.stepsSection}>
        <div>
          <p className={styles.eyebrow}>{en ? "HOW TO USE" : "使用方法"}</p>
          <h2>{en ? "Start measuring in three steps" : "三步开始测分贝"}</h2>
          <Link href={href("guide", locale)}>
            {en ? "Read the guide" : "完整使用指南"}
            <LinkArrow size={14} />
          </Link>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li key={step.title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.scenesSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>{en ? "EVERYDAY SCENARIOS" : "日常场景"}</p>
            <h2>{en ? "Start with the sound you care about" : "从你在意的声音开始"}</h2>
          </div>
          <p>
            {en
              ? "The same input. A clear condition. A repeatable comparison."
              : "同一套输入，清楚的条件，才有可比较的变化。"}
          </p>
        </div>
        <div className={styles.scenes}>
          {scenes.map((scene, i) => (
            <Link
              key={scene.title}
              className={styles.scene}
              href={href(scene.target, locale)}
              aria-label={`${en ? "Read about " : "了解"}${scene.title}`}
            >
              <Icon name={scene.icon} size={24} />
              <span className={styles.sceneNumber} aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{scene.title}</h3>
              <p>{scene.description}</p>
              <div className={styles.sceneFooter}>
                <span className={styles.sceneNote}>{scene.note}</span>
                <span className={styles.sceneAction} aria-hidden="true">
                  <LinkArrow size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.knowledge}>
        <div className={styles.knowledgeLead}>
          <p className={styles.eyebrow}>{en ? "SOUND KNOWLEDGE" : "声音知识"}</p>
          <h2>
            {en ? "How accurate is it?\nWhat do the numbers mean?" : "读数准不准，\n分贝怎么看？"}
          </h2>
          <p className={styles.sectionIntro}>
            {en
              ? "How accurate is the reading? What do the units mean? Start with the questions that help you use the tool."
              : "读数有多准？不同单位意味着什么？从这些基础问题开始。"}
          </p>
          <Link href={href("knowledge", locale)}>
            {en ? "All guides" : "全部声音知识"}
            <LinkArrow size={15} />
          </Link>
          <div className={styles.readingGuide}>
            <strong>{en ? "How the meter works" : "网页是怎么测分贝的？"}</strong>
            <p>
              {en
                ? "Your microphone picks up sound. The page calculates its energy, then displays an estimate and a trend."
                : "麦克风接收声音，网页计算声音能量，再显示估算分贝和变化趋势。"}
            </p>
            <Link href={href("how-it-works", locale)}>
              {en ? "Follow the four steps" : "四步看懂工作原理"}
              <LinkArrow size={15} />
            </Link>
          </div>
          <div className={styles.readingGuide}>
            <strong>{en ? "Noise & health" : "噪音与健康"}</strong>
            <p>
              {en
                ? "Understand hearing, sleep and longer-term effects, with sources and practical actions."
                : "了解听力、睡眠与长期影响，结合来源和行动建议改善环境。"}
            </p>
            <Link href={href("noise-health", locale)}>
              {en ? "Read about health effects" : "了解噪音对健康的影响"}
              <LinkArrow size={15} />
            </Link>
          </div>
        </div>
        <div className={styles.articles}>
          {articles
            .filter((article) => article.id !== "noise-health")
            .map((article, i) => (
              <Link key={article.id} href={href(article.id, locale)}>
                <span className={styles.articleIndex}>0{i + 1}</span>
                <div>
                  <h3>{text(article.title, locale)}</h3>
                  <p>{text(article.description, locale)}</p>
                </div>
                <LinkArrow size={18} className={styles.articleArrow} />
              </Link>
            ))}
        </div>
      </section>
      <section className={styles.faq} id="faq" aria-labelledby="faq-title">
        <div className={styles.faqLead}>
          <p className={styles.eyebrow}>{en ? "COMMON QUESTIONS" : "常见问题"}</p>
          <h2 id="faq-title">{en ? "Questions about using the meter" : "使用时，你可能想问"}</h2>
          <p className={styles.sectionIntro}>
            {en
              ? "Start here for devices, accuracy, microphone access and saving results."
              : "设备能不能用、读数准不准、麦克风打不开、结果怎么保存，都从这里找答案。"}
          </p>
          <Link className={styles.faqLink} href={href("faq", locale)}>
            {en ? "View all questions" : "查看全部常见问题"}
            <LinkArrow size={15} />
          </Link>
        </div>
        <FaqList items={homeFaqItems} locale={locale} className={styles.questions} />
      </section>
    </>
  );
}
