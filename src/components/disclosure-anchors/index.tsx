"use client";

import { useEffect } from "react";

export function DisclosureAnchors({ ids }: { ids: string[] }) {
  useEffect(() => {
    let frame = 0;
    function reveal() {
      const id = window.location.hash.slice(1);
      if (!ids.includes(id)) return;
      const target = document.getElementById(id);
      const details = target?.closest("details");
      if (!target || !details) return;
      details.open = true;
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reveal);
    }
    // 片段定位可能早于水合和滚动恢复，挂载后再次展开目标，保留旧链接的阅读入口。
    schedule();
    window.addEventListener("hashchange", schedule);
    window.addEventListener("pageshow", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, [ids]);
  return null;
}
