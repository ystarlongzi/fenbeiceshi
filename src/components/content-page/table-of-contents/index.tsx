"use client";

import { useEffect, useState } from "react";
import { activeSectionId } from "./active-section";
import styles from "./index.module.css";

interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = items.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    if (!sections.length) return;

    let frame = 0;
    function update() {
      frame = 0;
      // 原生锚点同时应用滚动容器的 padding 和目标的 margin，高亮沿用同一阅读位置。
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0;
      const atBottom =
        window.scrollY > 0 &&
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
      setActiveId(
        activeSectionId(
          sections.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top })),
          padding + margin,
          atBottom,
        ),
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(schedule);
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("pageshow", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, [items]);

  return (
    <nav className={styles.nav} aria-label={label}>
      {items.map((item) => (
        <a
          key={item.id}
          className={styles.link}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
