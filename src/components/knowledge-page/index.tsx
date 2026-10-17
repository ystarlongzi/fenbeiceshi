import Link from "next/link";
import { articles } from "@/lib/content/articles";
import { text } from "@/lib/content/types";
import { href } from "@/lib/routing/pages";
import { breadcrumbData } from "@/lib/seo/metadata";
import type { Locale } from "@/features/sound-meter/types";
import { Icon } from "../icon";
import { StructuredData } from "../structured-data";
import styles from "./index.module.css";

export function KnowledgePage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className={styles.page}>
      <StructuredData data={breadcrumbData("knowledge", locale)} />
      <p className={styles.eyebrow}>{en ? "SOUND, EXPLAINED" : "声音知识"}</p>
      <h1>{en ? "Make sense of the sound" : "让每个读数，都有清楚的解释"}</h1>
      <p className={styles.intro}>
        {en
          ? "Start with your question: understand the input, check a reference, or get the microphone working."
          : "从你遇到的问题出发：理解输入、核对参考，或让麦克风恢复工作。"}
      </p>
      <div className={styles.links}>
        {articles.map((article, i) => (
          <Link key={article.id} href={href(article.id, locale)}>
            <span>0{i + 1}</span>
            <div>
              <p>
                {i === 3
                  ? en
                    ? "TROUBLESHOOTING"
                    : "权限与故障"
                  : en
                    ? "UNDERSTAND THE LEVEL"
                    : "理解读数"}
              </p>
              <h2>{text(article.title, locale)}</h2>
              <p>{text(article.description, locale)}</p>
            </div>
            <Icon name="arrow-right" size={20} />
          </Link>
        ))}
      </div>
      <div className={styles.help}>
        <Icon name="mic" size={22} />
        <div>
          <h2>{en ? "Ready to try?" : "准备好观察一次了？"}</h2>
          <p>
            {en
              ? "Start with a generic noise estimate. Reference calibration is optional, and you can try a demo first."
              : "工具默认提供通用噪音估算，校准可选。也可以先体验演示，再决定是否打开麦克风。"}
          </p>
        </div>
        <Link href={href("meter", locale)}>
          {en ? "Open the meter" : "打开工具"}
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </div>
  );
}
