import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { connection, validateDeployPath } from "../lib.mjs";
import { requiredSiteFiles } from "../sites.mjs";
import { renderNginxTemplate } from "../nginx-template.mjs";

test("双域名分别限制部署目录，拒绝任意域名与错配目录", () => {
  const env = {
    SSH_HOST: "server.example.com",
    SSH_USER: "deploy",
    SSH_PRIVATE_KEY_FILE: "/tmp/key",
  };
  const config = connection({ domain: "soundmetergo.com", path: "/www/wwwroot/soundmetergo" }, env);
  assert.equal(config.domain, "soundmetergo.com");
  assert.equal(config.deployPath, "/www/wwwroot/soundmetergo");
  assert.throws(() => connection({ domain: "evil.example" }, env));
  assert.throws(() =>
    connection({ domain: "soundmetergo.com", path: "/www/wwwroot/fenbeiceshi" }, env),
  );
  assert.throws(() => validateDeployPath("/www/wwwroot/soundmetergo"));
  assert.throws(() => validateDeployPath("/www/wwwroot/fenbeiceshi", "soundmetergo.com"));
  assert.ok(
    !requiredSiteFiles("soundmetergo.com").some(
      (f) => f.startsWith("zh-tw/") || f.startsWith("en/"),
    ),
  );
  assert.ok(requiredSiteFiles("fenbeiceshi.com").includes("zh-tw/index.html"));
});

test("中文 Nginx 为全部旧英文路径生成 94 条精确映射，英文站不建立反向循环", async () => {
  const source = await readFile(
    new URL("../nginx/fenbeiceshi.conf.template", import.meta.url),
    "utf8",
  );
  const chinese = renderNginxTemplate(source, "fenbeiceshi.com");
  assert.equal(
    [...chinese.matchAll(/^    \/en(?:\/[^ ]*)? https:\/\/soundmetergo\.com\//gm)].length,
    94,
  );
  assert.ok(
    chinese.includes(
      "/en/knowledge/decibel-chart/47-72-db/ https://soundmetergo.com/knowledge/decibel-chart/47-72-db/;",
    ),
  );
  assert.ok(chinese.includes("/en/records/ https://soundmetergo.com/records/;"));
  assert.ok(!chinese.includes("/en/missing/"));
  assert.equal(chinese.split("return 301 $fenbeiceshi_english_target$is_args$args;").length - 1, 3);
  const english = renderNginxTemplate(source, "soundmetergo.com");
  assert.ok(!english.includes("fenbeiceshi_english_target"));
  assert.ok(english.includes("soundmetergo.access.log"));
  assert.ok(english.includes("shared:soundmetergo_ssl"));
});
