interface SectionPosition {
  id: string;
  top: number;
}

export function activeSectionId(
  sections: readonly SectionPosition[],
  offset: number,
  atBottom: boolean,
): string | null {
  if (!sections.length) return null;
  if (atBottom) return sections[sections.length - 1].id;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    // 锚点定位可能保留不足一个 CSS 像素的偏差，避免落点仍选中上一节。
    if (sections[index].top <= offset + 1) return sections[index].id;
  }
  return sections[0].id;
}
