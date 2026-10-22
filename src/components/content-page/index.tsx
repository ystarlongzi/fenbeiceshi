import { localize } from "@/lib/i18n/text";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../icon";
import { LinkArrow } from "../link-arrow";
import { StructuredData } from "../structured-data";
import { contents, href, pageById, SITE_URL } from "@/lib/routing/pages";
import { text } from "@/lib/content/types";
import { breadcrumbData } from "@/lib/seo/metadata";
import type { Locale } from "@/features/sound-meter/types";
import { TableOfContents } from "./table-of-contents";
import styles from "./index.module.css";

export function ContentPage({
  id,
  locale,
  sectionContent = {},
  children,
  className = "",
  cta,
  heading,
  overview,
  sectionClasses = {},
}: {
  id: string;
  locale: Locale;
  sectionContent?: Record<string, ReactNode>;
  children?: ReactNode;
  className?: string;
  cta?: { title: string; description: string; href: string; label: string };
  heading?: ReactNode;
  overview?: ReactNode;
  sectionClasses?: Record<string, string>;
}) {
  const content = contents.find((item) => item.id === id);
  if (!content) throw new Error(`缺少正文：${id}`);
  const action = cta ?? {
    title: localize(locale, "开始一次测量", "Try a measurement", "開始一次測量"),
    description: localize(
      locale,
      "先看估算噪音分贝，需要时可手动加减读数。",
      "Start with a noise estimate. Adjust the reading manually when needed.",
      "先看估算噪音分貝，需要時可手動加減讀數。",
    ),
    href: `${href("meter", locale)}#measure`,
    label: localize(locale, "打开测量工具", "Open the meter", "開啟測量工具"),
  };
  return (
    <article className={`${styles.article} ${className}`}>
      <StructuredData data={breadcrumbData(id, locale)} />
      {content.kind === "article" ? (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: text(content.title, locale),
            description: text(content.description, locale),
            inLanguage: locale,
            dateModified: content.updated,
            mainEntityOfPage: SITE_URL + href(id, locale),
            author: {
              "@type": "Organization",
              name: "fenbeiceshi.com project",
              url: SITE_URL,
            },
          }}
        />
      ) : null}
      <nav
        className={styles.breadcrumb}
        aria-label={localize(locale, "面包屑", "Breadcrumb", "麵包屑")}
      >
        <Link href={href("meter", locale)}>{localize(locale, "首页", "Home", "首頁")}</Link>
        <span>/</span>
        {content.kind === "article" ? (
          <>
            <Link href={href("knowledge", locale)}>
              {localize(locale, "声音知识", "Guides", "聲音知識")}
            </Link>
            <span>/</span>
          </>
        ) : null}
        {content.parentId ? (
          <>
            <Link href={href(content.parentId, locale)}>
              {text(pageById(content.parentId).title, locale)}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span>{text(content.title, locale)}</span>
      </nav>
      <header className={styles.header}>
        <p>
          {content.kind === "article"
            ? localize(locale, "声音知识", "SOUND, EXPLAINED", "聲音知識")
            : localize(locale, "使用帮助", "HELP & METHODS", "使用幫助")}
        </p>
        <h1>{heading ?? text(content.title, locale)}</h1>
        <div className={styles.meta}>
          <span>
            {localize(locale, "更新于", "Updated", "更新於")} {content.updated}
          </span>
          <span>
            {localize(locale, "分贝测试项目维护", "fenbeiceshi.com project", "分貝測試專案維護")}
          </span>
        </div>
      </header>
      {overview}
      <div className={styles.layout}>
        <div className={styles.body}>
          {overview ? null : (
            <div className={styles.takeaway}>
              <Icon name="book-open" size={19} />
              <p>{text(content.takeaway, locale)}</p>
            </div>
          )}
          {children ??
            content.sections.map((section) => (
              <section key={section.id} id={section.id} className={sectionClasses[section.id]}>
                <h2>{text(section.title, locale)}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{text(paragraph, locale)}</p>
                ))}
                {sectionContent[section.id]}
                {section.items ? (
                  <ul>
                    {section.items.map((item, i) => (
                      <li key={i}>{text(item, locale)}</li>
                    ))}
                  </ul>
                ) : null}
                {section.table ? (
                  <div className={styles.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          {section.table.headers.map((header, i) => (
                            <th key={i} scope="col">
                              {text(header, locale)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j}>{text(cell, locale)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ))}
          <section className={styles.sources}>
            <h2>{localize(locale, "来源与参考", "Sources and references", "來源與參考")}</h2>
            <ul>
              {content.sources.map((source) => (
                <li key={source.url} id={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {typeof source.title === "string" ? source.title : text(source.title, locale)}
                    <Icon name="external-link" size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <div className={styles.cta}>
            <div>
              <strong>{action.title}</strong>
              <p>{action.description}</p>
            </div>
            <Link href={action.href}>
              {action.label}
              <LinkArrow size={16} />
            </Link>
          </div>
          <section className={styles.related}>
            <h2>{localize(locale, "继续了解", "Related reading", "繼續瞭解")}</h2>
            {content.related.map((related) => (
              <Link key={related} href={href(related, locale)}>
                {text(pageById(related).title, locale)}
                <LinkArrow size={15} />
              </Link>
            ))}
          </section>
        </div>
        <aside className={styles.toc}>
          <p>{localize(locale, "本页内容", "ON THIS PAGE", "本頁內容")}</p>
          <TableOfContents
            key={id}
            label={localize(locale, "本文目录", "On this page", "本文目錄")}
            items={content.sections.map((section) => ({
              id: section.id,
              label: text(section.tocTitle ?? section.title, locale),
            }))}
          />
          <Link className={styles.tocBack} href={`${href("meter", locale)}#measure`}>
            <Icon name="mic" size={15} />
            {localize(locale, "回到测量工具", "Back to the tool", "回到測量工具")}
          </Link>
        </aside>
      </div>
    </article>
  );
}
