import assert from "node:assert/strict";
import test from "node:test";
import { analyticsLocation, analyticsReferrer, measurementId, parseConsent } from "./model.ts";

test("未配置时关闭统计，非衡量 ID 和可注入字符串阻止构建", () => {
  assert.equal(measurementId(undefined), null);
  assert.equal(measurementId(""), null);
  assert.equal(measurementId("G-MPXCSZLCVY"), "G-MPXCSZLCVY");
  for (const value of ["16203787160", "GT-5NXW2R6F", " G-MPXCSZLCVY", "G-ABC<script>"])
    assert.throws(() => measurementId(value), /衡量 ID/);
});

test("只有明确同意才启用，损坏或旧值不视作同意", () => {
  assert.equal(parseConsent("granted"), "granted");
  assert.equal(parseConsent("denied"), "denied");
  for (const value of [null, "true", "1", "GRANTED", '{"allow":true}'])
    assert.equal(parseConsent(value), null);
});

test("统计只接受两个正式 HTTPS 域名，并过滤查询与锚点", () => {
  assert.equal(
    analyticsLocation("https://soundmetergo.com/fr/privacy/?note=secret#private"),
    "https://soundmetergo.com/fr/privacy/",
  );
  assert.equal(
    analyticsLocation("https://fenbeiceshi.com/zh-tw/"),
    "https://fenbeiceshi.com/zh-tw/",
  );
  for (const value of [
    "http://fenbeiceshi.com/",
    "http://127.0.0.1:31031/",
    "https://localhost/",
    "https://preview.soundmetergo.com/",
    "https://fenbeiceshi.com.evil.test/",
    "https://soundmetergo.com:31032/",
    "not a URL",
  ])
    assert.equal(analyticsLocation(value), null);
});

test("外站来源只保留来源域名，本站来源也去掉查询与锚点", () => {
  assert.equal(
    analyticsReferrer("https://search.example/private?q=secret#email"),
    "https://search.example",
  );
  assert.equal(
    analyticsReferrer("https://fenbeiceshi.com/privacy/?note=secret#private"),
    "https://fenbeiceshi.com/privacy/",
  );
  for (const value of ["", "data:text/plain,secret", "not a URL"])
    assert.equal(analyticsReferrer(value), "");
});
