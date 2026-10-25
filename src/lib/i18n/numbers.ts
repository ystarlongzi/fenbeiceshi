import { isAdditionalLocale } from "./additional-locales.ts";
import { localeSettings, type Locale } from "./locales.ts";

const decimalMarks = new Map<Locale, string>();
const digitStarts = [0x0660, 0x06f0, 0x0e50, 0xff10];

export function normalizeNumberInput(value: string, locale: Locale): string {
  if (!isAdditionalLocale(locale)) return value;
  let decimal = decimalMarks.get(locale);
  if (!decimal) {
    decimal =
      new Intl.NumberFormat(localeSettings[locale].date)
        .formatToParts(1.1)
        .find((part) => part.type === "decimal")?.value ?? ".";
    decimalMarks.set(locale, decimal);
  }
  // 只转换数字和本语言小数点；不删除分组符号，也不把其他字符猜成数字。
  return value
    .replace(/[٠-٩۰-۹๐-๙０-９]/g, (digit) => {
      const code = digit.charCodeAt(0);
      const start = digitStarts.find((offset) => code >= offset && code <= offset + 9)!;
      return String(code - start);
    })
    .replaceAll("−", "-")
    .replaceAll("＋", "+")
    .replaceAll("．", ".")
    .replaceAll("٫", ".")
    .replaceAll("，", ",")
    .replaceAll(decimal, ".");
}
