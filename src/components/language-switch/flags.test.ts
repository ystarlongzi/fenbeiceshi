import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { locales } from "../../lib/i18n/locales.ts";
import { languageFlags, languageFlagPath, languageFlagVersion } from "./flags.ts";

const root = new URL("../../../public/vendor/flag-icons/", import.meta.url);

test("每种已发布语言都有本机国旗，并保持原发布包的文件完整性", async () => {
  const source = JSON.parse(await readFile(new URL("source.json", root), "utf8"));
  assert.deepEqual(Object.keys(languageFlags), locales);
  assert.equal(source.name, "flag-icons");
  assert.equal(languageFlagVersion, source.version);
  assert.equal(source.license, "MIT");
  assert.match(await readFile(new URL("LICENSE", root), "utf8"), /Panayiotis Lipiridis/);
  assert.deepEqual(
    (await readdir(new URL("4x3/", root))).sort(),
    [...new Set(Object.values(languageFlags))].map((code) => `${code}.svg`).sort(),
  );
  for (const locale of locales) {
    const code = languageFlags[locale];
    const url = new URL(languageFlagPath(locale), "https://soundmetergo.com");
    assert.equal(url.pathname, `/vendor/flag-icons/4x3/${code}.svg`);
    assert.equal(url.searchParams.get("v"), source.version);
    const svg = await readFile(new URL(`4x3/${code}.svg`, root));
    assert.equal(
      createHash("sha256").update(svg).digest("hex"),
      source.files[`4x3/${code}.svg`].sha256,
    );
    assert.match(svg.toString(), /<svg\b[^>]*viewBox="0 0 640 480"/);
    assert.doesNotMatch(svg.toString(), /<script\b|<foreignObject\b|\son\w+=/i);
    assert.doesNotMatch(svg.toString(), /(?:href|xlink:href)\s*=\s*["'](?!#)/i);
  }
});
