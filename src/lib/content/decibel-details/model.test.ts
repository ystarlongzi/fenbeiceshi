import assert from "node:assert/strict";
import test, { before } from "node:test";
import { soundReferences, soundSources } from "../sound-references.ts";
import { referenceRange } from "../sound-reference-format.ts";
import { text } from "../types.ts";
import { locales } from "../../i18n/locales.ts";
import { href, canonicalHref, findPage } from "../../routing/pages.ts";
import { breadcrumbData, pageMetadata } from "../../seo/metadata.ts";
import { detailForLevel, detailForSound, soundDetails } from "./index.ts";
import { levelComparisons } from "./comparison.ts";
import { prepareLocale } from "../../i18n/load-messages.ts";

before(async () => {
  await Promise.all(locales.map(prepareLocale));
});

test("全部声音按真实单值或完整范围关联详情，没有缺漏和重复", () => {
  assert.equal(soundDetails.length, 28);
  const assigned = soundDetails.flatMap((detail) => detail.sounds.map((sound) => sound.id));
  assert.equal(assigned.length, soundReferences.length);
  assert.equal(new Set(assigned).size, soundReferences.length);
  assert.equal(new Set(soundDetails.map((detail) => detail.content.slug)).size, 28);
  for (const sound of soundReferences) {
    const detail = detailForSound(sound.id);
    assert.ok(detail.sounds.includes(sound));
    assert.equal(detail.key, referenceRange(sound).replace("–", "-"));
    assert.equal(detail.content.parentId, "decibel-chart");
    assert.ok(detail.content.related.includes("decibel-chart"));
    assert.ok(detail.content.sources.some((source) => source.id === soundSources[sound.source].id));
  }
});

test("相同值共页且保留不同单位与场景，范围不取整成代表数字", () => {
  assert.equal(detailForSound("library"), detailForSound("fridge"));
  assert.equal(detailForSound("sports"), detailForSound("headphones"));
  const hundred = detailForSound("hair-dryer");
  assert.equal(hundred, detailForSound("thunder"));
  assert.deepEqual(
    hundred.sounds.map((sound) => sound.unit),
    ["dB", "dBA"],
  );
  assert.equal(detailForSound("washing-machine").key, "47-72");
  assert.equal(detailForSound("drill").key, "98");
  assert.equal(detailForSound("chainsaw").key, "108");
  assert.equal(findPage("knowledge/decibel-chart/50-db"), undefined);
});

test("详情的三语正文、场景问题和比较条件独立完整", () => {
  for (const locale of locales) {
    assert.equal(
      new Set(soundDetails.map((detail) => text(detail.content.title, locale))).size,
      28,
    );
    assert.equal(
      new Set(soundDetails.map((detail) => text(detail.content.takeaway, locale))).size,
      28,
    );
    for (const { content, questions } of soundDetails) {
      const question = content.sections.find((section) => section.id === "question");
      assert.ok(question && text(question.title, locale));
      assert.equal(questions.length, 3);
      assert.ok(
        questions.every((item) => text(item.question, locale) && text(item.answer, locale)),
      );
      assert.ok(content.description && text(content.description, locale));
    }
  }
});

test("相对对比以本页为参照，同时移动范围两端，不修改原始数据", () => {
  const forty = levelComparisons(detailForSound("library").sounds[0]);
  assert.deepEqual(
    forty.map((row) => row.min),
    [30, 37, 40, 43, 50],
  );
  for (const { sounds } of soundDetails) {
    const sound = sounds[0];
    const before = { ...sound };
    const rows = levelComparisons(sound);
    assert.equal(rows.length, 5);
    assert.equal(rows.filter((row) => row.offset === 0).length, 1);
    assert.equal(referenceRange(rows[2]), referenceRange(sound));
    for (const row of rows) {
      assert.equal(row.min - sound.min, row.offset);
      assert.equal(row.max - sound.max, row.offset);
      assert.equal(row.max - row.min, sound.max - sound.min);
      assert.ok(Math.abs(row.energy - 10 ** (row.offset / 10)) < 0.01);
      assert.ok(Math.abs(row.loudness - 2 ** (row.offset / 10)) < 0.035);
    }
    assert.deepEqual(sound, before);
  }
  assert.equal(
    referenceRange(levelComparisons(detailForSound("washing-machine").sounds[0])[0]),
    "37–62",
  );
});

test("声级入口只匹配已存在的准确单值或完整范围，不把落在范围内的数字当独立页面", () => {
  for (const detail of soundDetails) assert.equal(detailForLevel(detail.sounds[0]), detail);
  assert.equal(detailForLevel({ min: 30, max: 30 }), detailForSound("whisper"));
  assert.equal(detailForLevel({ min: 47, max: 72 }), detailForSound("washing-machine"));
  assert.equal(detailForLevel({ min: 50, max: 50 }), undefined);
  assert.equal(detailForLevel({ min: 95, max: 95 }), undefined);
  assert.equal(detailForLevel({ min: 47, max: 70 }), undefined);
});

test("每个主题有两条生活化问答，听力标题直接提问并区分低声级与强声", () => {
  for (const locale of locales) {
    const topicQuestions = soundDetails.flatMap((detail) => detail.questions.slice(0, 2));
    assert.equal(new Set(topicQuestions.map((item) => text(item.question, locale))).size, 56);
    for (const { content, sounds, questions } of soundDetails) {
      const hearing = content.sections.find((section) => section.id === "hearing");
      assert.ok(hearing);
      assert.ok(text(hearing.title, locale).includes(referenceRange(sounds[0])));
      assert.ok(text(hearing.title, locale).includes("dB"));
      assert.equal(hearing.paragraphs.length, 2);
      assert.ok(
        questions.every(
          (item) => !/计权|統計口徑|统计口径|声功率级/.test(text(item.answer, locale)),
        ),
      );
      for (const source of [soundSources.nidcdLoudness, soundSources.ccohs])
        assert.ok(content.sources.some((item) => item.url === source.url));
    }
  }
  const low = detailForSound("library").content.sections.find(
    (section) => section.id === "hearing",
  );
  const impulse = detailForSound("fireworks").content.sections.find(
    (section) => section.id === "hearing",
  );
  assert.match(low!.paragraphs[0].zh, /一般不容易/);
  assert.match(impulse!.paragraphs[0].zh, /即使只响很短时间/);
});

test("详情按阅读顺序组织，保留旧锚点并明确听力内容来源", () => {
  for (const { content, questions } of soundDetails) {
    assert.deepEqual(
      content.sections.map((section) => section.id),
      ["examples", "context", "hearing", "question"],
    );
    assert.ok(questions.some((question) => question.id === "browser"));
    assert.equal(new Set(questions.map((question) => question.id)).size, 3);
    for (const id of [soundSources.nidcd.id, soundSources.niosh.id])
      assert.ok(content.sources.some((source) => source.id === id));
  }
});

test("详情三语路径、自 canonical 和面包屑对应真实父页", () => {
  for (const { content } of soundDetails)
    for (const locale of locales) {
      const path = href(content.id, locale);
      assert.ok(path.endsWith(`/decibel-chart/${content.slug.split("/").at(-1)}/`));
      assert.equal(
        pageMetadata(content.id, locale).alternates?.canonical,
        canonicalHref(content.id, locale),
      );
      const crumbs = breadcrumbData(content.id, locale).itemListElement;
      assert.equal(crumbs.at(-2)?.item, canonicalHref("decibel-chart", locale));
      assert.equal(crumbs.at(-1)?.item, canonicalHref(content.id, locale));
    }
});

test("不存在的声音不会生成猜测路径或回退链接", () => {
  assert.throws(() => detailForSound("missing-sound"), /缺少对应的分贝详情页/);
});
