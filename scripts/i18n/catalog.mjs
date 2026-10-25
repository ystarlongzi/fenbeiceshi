import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(
    entries.map((entry) => {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return filesIn(path);
      return /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [path] : [];
    }),
  );
  return children.flat();
}

export async function sourceCatalog() {
  const entries = new Map();
  function add(source, file, ui) {
    if (!source.trim()) return;
    const entry = entries.get(source) ?? { source, ui: false, files: [] };
    entry.ui ||= ui;
    if (!entry.files.includes(file)) entry.files.push(file);
    entries.set(source, entry);
  }
  function localizedValues(value, file, ui) {
    if (!value || typeof value !== "object") return;
    if (typeof value.zh === "string" && typeof value.en === "string") {
      add(value.en, file, ui);
      return;
    }
    for (const child of Object.values(value)) localizedValues(child, file, ui);
  }
  function literalValues(value, file) {
    if (typeof value === "string") add(value, file, true);
    else if (value && typeof value === "object")
      for (const child of Object.values(value)) literalValues(child, file);
  }
  for (const file of await filesIn("src")) {
    const source = ts.createSourceFile(
      file,
      await readFile(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const ui = !file.startsWith("src/lib/content/") || /sound-(?:bands|references)\.ts$/.test(file);
    function staticStrings(node, visit) {
      if (ts.isStringLiteralLike(node)) visit(node.text);
      else if (ts.isConditionalExpression(node)) {
        staticStrings(node.whenTrue, visit);
        staticStrings(node.whenFalse, visit);
      }
    }
    function walk(node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const name = node.expression.text;
        const index = ["localize", "formatLocalized"].includes(name)
          ? 2
          : ["translations", "t"].includes(name)
            ? 1
            : -1;
        if (index >= 0 && node.arguments[index])
          staticStrings(node.arguments[index], (value) => add(value, file, ui));
      }
      // 首页场景保留图标标识，只提取英文分支的可见文案。
      if (
        file === "src/components/home-page/copy.ts" &&
        ts.isConditionalExpression(node) &&
        node.condition.getText(source) === "en"
      ) {
        function homeStrings(child) {
          if (ts.isPropertyAssignment(child) && child.name.getText(source) === "icon") return;
          if (ts.isStringLiteralLike(child)) add(child.text, file, true);
          else ts.forEachChild(child, homeStrings);
        }
        homeStrings(node.whenTrue);
      }
      ts.forEachChild(node, walk);
    }
    walk(source);
    if (file.startsWith("src/lib/content/"))
      localizedValues(await import(pathToFileURL(resolve(file)).href), file, ui);
  }
  for (const [file, name] of [
    ["src/features/sound-meter/copy.ts", "meterCopy"],
    ["src/features/sound-meter/measurement-report/copy.ts", "reportCopy"],
    ["src/features/audio-recording/copy.ts", "recordingCopy"],
  ]) {
    const copyModule = await import(pathToFileURL(resolve(file)).href);
    literalValues(copyModule[name].en, file);
  }
  return [...entries.values()].sort((a, b) => a.source.localeCompare(b.source, "en"));
}
