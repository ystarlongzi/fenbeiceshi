import assert from "node:assert/strict";
import test from "node:test";
import { pdfFromImages, wrapReportText } from "./pdf.ts";

test("报告换行保留英文单词和中文，长单词按字符回退", () => {
  const measure = (text: string) => Array.from(text).length;
  assert.deepEqual(wrapReportText("Hello world sample", measure, 11), ["Hello world", "sample"]);
  const chinese = "测试备注".repeat(30);
  const lines = wrapReportText(chinese, measure, 12);
  assert.ok(lines.every((line) => measure(line) <= 12));
  assert.equal(lines.join(""), chinese);
  assert.deepEqual(wrapReportText("longwordwithoutspaces", measure, 8), [
    "longword",
    "withouts",
    "paces",
  ]);
});

test("PDF 为实际 A4 文件，支持多页并嵌入报告图像", async () => {
  const image =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==";
  const blob = await pdfFromImages([image, image]);
  assert.equal(blob.type, "application/pdf");
  const source = Buffer.from(await blob.arrayBuffer()).toString("latin1");
  assert.ok(source.startsWith("%PDF-"));
  assert.ok(source.includes("/Count 2"));
  assert.ok(source.includes("/Subtype /Image"));
  const box = source.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
  assert.ok(box);
  assert.ok(Math.abs(Number(box[1]) - 595.28) < 0.01);
  assert.ok(Math.abs(Number(box[2]) - 841.89) < 0.01);
  assert.ok(source.includes("%%EOF"));
});
