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
    steps: [string, string];
    icon: IconName;
  }[] = en
    ? [
        {
          title: "Check your room's noise",
          steps: [
            "Keep the device in one place. Measure for a while, then save the result.",
            "Repeat there at another time. Note windows and background sounds before comparing.",
          ],
          icon: "house",
        },
        {
          title: "Compare an appliance",
          steps: [
            "Keep the device, distance and settings fixed. Measure with the appliance off.",
            "Switch it on and measure for a similar duration. Note its setting and compare the results.",
          ],
          icon: "audio-lines",
        },
        {
          title: "Compare open and closed windows",
          steps: [
            "Keep the device and position fixed. Measure with the window open and save the result.",
            "Close it and measure for a similar duration. Compare the results and note changes in outside sounds.",
          ],
          icon: "sliders-horizontal",
        },
      ]
    : [
        {
          title: "看看房间有多吵",
          steps: [
            "固定设备和位置，测一段时间并保存结果。",
            "在原处换个时段复测，备注门窗状态与背景声音后比较。",
          ],
          icon: "house",
        },
        {
          title: "比较一件家电的变化",
          steps: [
            "保持设备、距离和设置不变，先测家电关闭时的声音。",
            "开启家电后测量相近时长，记录档位，再比较两次结果。",
          ],
          icon: "audio-lines",
        },
        {
          title: "看看关窗前后的不同",
          steps: [
            "保持设备与位置不变，先测开窗时的声音并保存。",
            "关窗后测量相近时长，再比较；同时记下车流等外部声音的变化。",
          ],
          icon: "sliders-horizontal",
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
      <section
        className={styles.scenesSection}
        id="home-scenarios"
        aria-labelledby="home-scenarios-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>{en ? "EVERYDAY SCENARIOS" : "日常场景"}</p>
            <h2 id="home-scenarios-title">
              {en ? "Everyday changes you can observe" : "可以观察哪些声音变化？"}
            </h2>
          </div>
          <p>
            {en
              ? "Choose a scenario, follow the steps and save your results."
              : "选一个场景，按下面的方法测量并记录。"}
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
