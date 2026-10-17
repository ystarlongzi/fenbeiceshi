import Link from "next/link";
import { SoundMeter } from "@/features/sound-meter";
import { RecordsPanel } from "@/features/records";
import type { Locale } from "@/features/sound-meter/types";
import { articles } from "@/lib/content/articles";
import { text } from "@/lib/content/types";
import { href, SITE_URL } from "@/lib/routing/pages";
import { Icon, type IconName } from "../icon";
import { StructuredData } from "../structured-data";
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
          title: "Find your room baseline",
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
          title: "找到房间的声音基线",
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
          body: "Allow access when asked. Or try a labelled demo first.",
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
        { title: "打开麦克风", body: "点击开始并允许访问，也可以先体验带标记的演示。" },
        { title: "观察一段变化", body: "先确认读数口径，保持设备、位置和输入设置稳定。" },
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
            ? "Relative RMS dBFS observation with optional reference-calibrated estimates. No raw audio uploads."
            : "默认相对 RMS dBFS 的浏览器声音观察，支持参考校准估算，原始音频不上传。",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            <span />
            {en ? "NO INSTALLATION · AUDIO STAYS LOCAL" : "免安装 · 音频本机处理"}
          </p>
          <h1>
            {en ? "Online decibel meter" : "在线分贝测试"}
            <span>{en ? "Sound, in context." : "看见声音的变化"}</span>
          </h1>
          <p className={styles.intro}>
            {en
              ? "Observe live input, follow a trend, and keep a summary with its conditions."
              : "用麦克风观察实时电平与变化趋势，把本次条件和摘要一起留下。"}
          </p>
        </div>
        <Link className={styles.heroHelp} href={href("phone-accuracy", locale)}>
          <Icon name="circle-alert" size={15} />
          {en ? "How accurate is it?" : "手机测分贝，准吗？"}
          <Icon name="arrow-right" size={14} />
        </Link>
      </section>
      <SoundMeter locale={locale} />
      <div className={styles.recordSection}>
        <RecordsPanel locale={locale} compact />
      </div>
      <section className={styles.stepsSection}>
        <div>
          <p className={styles.eyebrow}>{en ? "START HERE" : "从一次观察开始"}</p>
          <h2>{en ? "Three steps to a useful observation" : "测一次，也为下次比较留好条件"}</h2>
          <Link href={href("guide", locale)}>
            {en ? "Read the guide" : "完整使用指南"}
            <Icon name="arrow-right" size={14} />
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
            <p className={styles.eyebrow}>{en ? "EVERYDAY QUESTIONS" : "从你在意的声音出发"}</p>
            <h2>{en ? "A method for the question you have" : "让每次观察，都有明确的问题"}</h2>
          </div>
          <p>
            {en
              ? "The same input. A clear condition. A repeatable comparison."
              : "同一套输入，清楚的条件，才有可比较的变化。"}
          </p>
        </div>
        <div className={styles.scenes}>
          {scenes.map((scene, i) => (
            <article key={scene.title} className={styles.scene}>
              <Icon name={scene.icon} size={24} />
              <span className={styles.sceneNumber} aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{scene.title}</h3>
              <p>{scene.description}</p>
              <div>
                <span>{scene.note}</span>
                <Link
                  href={href(scene.target, locale)}
                  aria-label={`${en ? "Read about " : "了解"}${scene.title}`}
                >
                  <Icon name="arrow-right" size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.knowledge}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>
              {en ? "UNDERSTAND THE READING" : "读数之外，也读懂声音"}
            </p>
            <h2>{en ? "A little context goes a long way" : "先理解数字，再作判断"}</h2>
          </div>
          <Link href={href("knowledge", locale)}>
            {en ? "All guides" : "全部声音知识"}
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>
        <div className={styles.articles}>
          {articles.map((article, i) => (
            <Link key={article.id} href={href(article.id, locale)}>
              <span className={styles.articleIndex}>0{i + 1}</span>
              <div>
                <h3>{text(article.title, locale)}</h3>
                <p>{text(article.description, locale)}</p>
              </div>
              <Icon name="arrow-right" size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.faq}>
        <h2>{en ? "Before you begin" : "开始前，你可能还想知道"}</h2>
        {(en
          ? [
              {
                q: "Does it record or upload my audio?",
                a: "No. Audio is processed in browser memory. Local summaries contain statistics and recent level trends, without audio.",
              },
              {
                q: "Why does the default reading use dBFS?",
                a: "A digital microphone signal is not automatically a calibrated sound pressure measurement. Relative dBFS makes that difference explicit. A reference enables a device-specific estimate.",
              },
              {
                q: "Can I leave it running with the screen locked?",
                a: "This version stops capture when the page leaves the foreground. It does not promise background or overnight monitoring.",
              },
            ]
          : [
              {
                q: "会录音或上传我的声音吗？",
                a: "不会。音频只在浏览器内存中计算。本机摘要包含统计和最近一段电平趋势，不包含原始声音。",
              },
              {
                q: "为什么默认显示的是 dBFS？",
                a: "数字麦克风输入不自动等于经过校准的环境声压级。dBFS 明确表示相对输入；具备参考条件后，可以建立设备专属的估算关系。",
              },
              {
                q: "能在锁屏或后台一直测量吗？",
                a: "首版在页面离开前台时停止采集并保留有效摘要，不承诺后台或整夜监测。",
              },
            ]
        ).map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <Icon name="chevron-down" size={17} />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
