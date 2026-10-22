import { localize } from "@/lib/i18n/text";
import Link from "next/link";
import { SoundMeter } from "@/features/sound-meter";
import { RecordsPanel } from "@/features/records";
import type { Locale } from "@/features/sound-meter/types";
import { articles } from "@/lib/content/articles";
import { homeFaqItems } from "@/lib/content/faq";
import { text } from "@/lib/content/types";
import { href, SITE_URL } from "@/lib/routing/pages";
import { Icon } from "../icon";
import { homeInstructions } from "./copy";
import { LinkArrow } from "../link-arrow";
import { StructuredData } from "../structured-data";
import { FaqList } from "../faq-list";
import styles from "./index.module.css";

export function HomePage({ locale }: { locale: Locale }) {
  const { scenes, steps } = homeInstructions(locale);
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: localize(locale, "分贝测试", "FenbeiCeshi Sound Observation Tool", "分貝測試"),
          url: SITE_URL + href("meter", locale),
          inLanguage: locale,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          description: localize(
            locale,
            "默认提供通用估算噪音分贝，可选手动加减读数，原始音频不上传。",
            "Generic noise estimates with optional manual adjustment. No raw audio uploads.",
            "預設提供通用估算噪音分貝，可選手動加減讀數，原始音訊不上傳。",
          ),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className={styles.measurement} aria-labelledby="home-title">
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              <span />
              {localize(
                locale,
                "免安装 · 音频本机处理",
                "NO INSTALLATION · AUDIO STAYS LOCAL",
                "免安裝 · 音訊本機處理",
              )}
            </p>
            <h1 id="home-title">
              {localize(locale, "在线分贝测试", "Online decibel meter", "線上分貝測試")}
              <span>
                {localize(locale, "看见声音的变化", "Sound, in context.", "看見聲音的變化")}
              </span>
            </h1>
            <p className={styles.intro}>
              {localize(
                locale,
                "用麦克风查看估算噪音分贝与变化趋势，把本次条件和摘要一起留下。",
                "See estimated noise levels and trends, then keep a summary with its conditions.",
                "用麥克風檢視估算噪音分貝與變化趨勢，把本次條件和摘要一起留下。",
              )}
            </p>
          </div>
          <Link className={styles.heroHelp} href={href("phone-accuracy", locale)}>
            <Icon name="circle-alert" size={15} />
            {localize(locale, "手机测分贝，准吗？", "How accurate is it?", "手機測分貝，準嗎？")}
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
          <p className={styles.eyebrow}>{localize(locale, "使用方法", "HOW TO USE", "使用方法")}</p>
          <h2>
            {localize(locale, "三步开始测分贝", "Start measuring in three steps", "三步開始測分貝")}
          </h2>
          <Link href={href("guide", locale)}>
            {localize(locale, "完整使用指南", "Read the guide", "完整使用指南")}
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
      <section
        className={styles.scenesSection}
        id="home-scenarios"
        aria-labelledby="home-scenarios-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>
              {localize(locale, "日常场景", "EVERYDAY SCENARIOS", "日常場景")}
            </p>
            <h2 id="home-scenarios-title">
              {localize(
                locale,
                "可以观察哪些声音变化？",
                "Everyday changes you can observe",
                "可以觀察哪些聲音變化？",
              )}
            </h2>
          </div>
          <p>
            {localize(
              locale,
              "选一个场景，按下面的方法测量并记录。",
              "Choose a scenario, follow the steps and save your results.",
              "選一個場景，按下面的方法測量並記錄。",
            )}
          </p>
        </div>
        <ul className={styles.scenes}>
          {scenes.map((scene) => (
            <li key={scene.title} className={styles.scene}>
              <Icon name={scene.icon} size={24} />
              <h3>{scene.title}</h3>
              <ol className={styles.sceneSteps}>
                {scene.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.knowledge}>
        <div className={styles.knowledgeLead}>
          <p className={styles.eyebrow}>
            {localize(locale, "声音知识", "SOUND KNOWLEDGE", "聲音知識")}
          </p>
          <h2>
            {localize(
              locale,
              "读数准不准，\n分贝怎么看？",
              "How accurate is it?\nWhat do the numbers mean?",
              "讀數準不準，\n分貝怎麼看？",
            )}
          </h2>
          <p className={styles.sectionIntro}>
            {localize(
              locale,
              "读数有多准？不同单位意味着什么？从这些基础问题开始。",
              "How accurate is the reading? What do the units mean? Start with the questions that help you use the tool.",
              "讀數有多準？不同單位意味著什麼？從這些基礎問題開始。",
            )}
          </p>
          <Link href={href("knowledge", locale)}>
            {localize(locale, "知识与帮助", "Knowledge & help", "知識與幫助")}
            <LinkArrow size={15} />
          </Link>
          <div className={styles.readingGuide}>
            <strong>
              {localize(
                locale,
                "网页是怎么测分贝的？",
                "How the meter works",
                "網頁是怎麼測分貝的？",
              )}
            </strong>
            <p>
              {localize(
                locale,
                "麦克风接收声音，网页计算声音能量，再显示估算分贝和变化趋势。",
                "Your microphone picks up sound. The page calculates its energy, then displays an estimate and a trend.",
                "麥克風接收聲音，網頁計算聲音能量，再顯示估算分貝和變化趨勢。",
              )}
            </p>
            <Link href={href("how-it-works", locale)}>
              {localize(locale, "四步看懂工作原理", "Follow the four steps", "四步看懂工作原理")}
              <LinkArrow size={15} />
            </Link>
          </div>
          <div className={styles.readingGuide}>
            <strong>{localize(locale, "噪音与健康", "Noise & health", "噪音與健康")}</strong>
            <p>
              {localize(
                locale,
                "了解听力、睡眠与长期影响，结合来源和行动建议改善环境。",
                "Understand hearing, sleep and longer-term effects, with sources and practical actions.",
                "瞭解聽力、睡眠與長期影響，結合來源和行動建議改善環境。",
              )}
            </p>
            <Link href={href("noise-health", locale)}>
              {localize(
                locale,
                "了解噪音对健康的影响",
                "Read about health effects",
                "瞭解噪音對健康的影響",
              )}
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
          <p className={styles.eyebrow}>
            {localize(locale, "常见问题", "COMMON QUESTIONS", "常見問題")}
          </p>
          <h2 id="faq-title">
            {localize(
              locale,
              "使用时，你可能想问",
              "Questions about using the meter",
              "使用時，你可能想問",
            )}
          </h2>
          <p className={styles.sectionIntro}>
            {localize(
              locale,
              "设备能不能用、读数准不准、麦克风打不开、结果怎么保存，都从这里找答案。",
              "Start here for devices, accuracy, microphone access and saving results.",
              "裝置能不能用、讀數準不準、麥克風打不開、結果怎麼儲存，都從這裡找答案。",
            )}
          </p>
          <Link className={styles.faqLink} href={href("faq", locale)}>
            {localize(locale, "查看全部常见问题", "View all questions", "檢視全部常見問題")}
            <LinkArrow size={15} />
          </Link>
        </div>
        <FaqList items={homeFaqItems} locale={locale} className={styles.questions} />
      </section>
    </>
  );
}
