"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { isAdditionalLocale } from "@/lib/i18n/additional-locales";
import { registerMessages, type Messages } from "@/lib/i18n/messages";

export function LocalizationBoundary({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages | null;
  children: ReactNode;
}) {
  // 在子组件首次渲染前准备固定界面词典，避免水合时先显示英文再替换文字。
  if (isAdditionalLocale(locale) && messages) registerMessages(locale, messages);
  return children;
}
