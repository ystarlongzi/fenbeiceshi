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
}: {
  id: string;
  locale: Locale;
  sectionContent?: Record<string, ReactNode>;
  children?: ReactNode;
  className?: string;
  cta?: { title: string; description: string; href: string; label: string };
}) {
  const content = contents.find((item) => item.id === id);
  if (!content) throw new Error(`缺少正文：${id}`);
  const en = locale === "en";
  const action = cta ?? {
    title: en ? "Try a measurement" : "开始一次测量",
    description: en
      ? "Start with a noise estimate. Add reference calibration when available."
      : "先看估算噪音分贝，有条件时再选用参考校准。",
    href: `${href("meter", locale)}#measure`,
    label: en ? "Open the meter" : "打开测量工具",
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
      <nav className={styles.breadcrumb} aria-label={en ? "Breadcrumb" : "面包屑"}>
        <Link href={href("meter", locale)}>{en ? "Home" : "首页"}</Link>
        <span>/</span>
        {content.kind === "article" ? (
          <>
            <Link href={href("knowledge", locale)}>{en ? "Guides" : "声音知识"}</Link>
            <span>/</span>
          </>
        ) : null}
        <span>{text(content.title, locale)}</span>
      </nav>
      <header className={styles.header}>
        <p>
          {content.kind === "article"
            ? en
              ? "SOUND, EXPLAINED"
              : "声音知识"
            : en
              ? "HELP & METHODS"
              : "使用帮助"}
        </p>
        <h1>{text(content.title, locale)}</h1>
        <div className={styles.meta}>
          <span>
            {en ? "Updated" : "更新于"} {content.updated}
          </span>
          <span>{en ? "fenbeiceshi.com project" : "分贝测试项目维护"}</span>
        </div>
      </header>
      <div className={styles.layout}>
        <div className={styles.body}>
          <div className={styles.takeaway}>
            <Icon name="book-open" size={19} />
            <p>{text(content.takeaway, locale)}</p>
          </div>
          {children ??
            content.sections.map((section) => (
              <section key={section.id} id={section.id}>
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
            <h2>{en ? "Sources and references" : "来源与参考"}</h2>
            <ul>
              {content.sources.map((source) => (
                <li key={source.url} id={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
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
            <h2>{en ? "Related reading" : "继续了解"}</h2>
            {content.related.map((related) => (
              <Link key={related} href={href(related, locale)}>
                {text(pageById(related).title, locale)}
                <LinkArrow size={15} />
              </Link>
            ))}
          </section>
        </div>
        <aside className={styles.toc}>
          <p>{en ? "ON THIS PAGE" : "本页内容"}</p>
          <TableOfContents
            key={id}
            label={en ? "On this page" : "本文目录"}
            items={content.sections.map((section) => ({
              id: section.id,
              label: text(section.tocTitle ?? section.title, locale),
            }))}
          />
          <Link className={styles.tocBack} href={`${href("meter", locale)}#measure`}>
            <Icon name="mic" size={15} />
            {en ? "Back to the tool" : "回到测量工具"}
          </Link>
        </aside>
      </div>
    </article>
  );
}
