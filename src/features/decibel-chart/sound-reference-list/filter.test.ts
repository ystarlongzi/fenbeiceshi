import assert from "node:assert/strict";
import test from "node:test";
import { soundBands } from "../../../lib/content/sound-bands.ts";
import { soundReferences } from "../../../lib/content/sound-references.ts";
import { filterSounds, groupSounds, referenceLevel, type LookupSound } from "./filter.ts";

const sounds: LookupSound[] = [
  {
    id: "fridge",
    min: 40,
    max: 40,
    unit: "dB",
    name: "冰箱运转",
    context: "固定运行状态",
    searchText: "冰箱运转 Refrigerator humming",
    sourceId: "sound-source-cdc",
    sourceLabel: "CDC",
  },
  {
    id: "dishwasher",
    min: 45,
    max: 65,
    unit: "dB",
    name: "洗碗机",
    context: "不同程序",
    searchText: "洗碗机 Dishwasher",
    sourceId: "sound-source-cdc",
    sourceLabel: "CDC",
  },
  {
    id: "conversation",
    min: 60,
    max: 70,
    unit: "dBA",
    name: "正常交谈",
    context: "保留距离",
    searchText: "正常交谈 Normal conversation",
    sourceId: "sound-source-nidcd",
    sourceLabel: "NIDCD",
  },
];
const ids = (query: string) => filterSounds(sounds, query).map((sound) => sound.id);
const bands = soundBands.map((band) => ({
  ...band,
  title: band.title.zh,
  description: band.description.zh,
}));

test("声音查询支持中文、英文大小写与多个词组合", () => {
  assert.deepEqual(ids("冰箱"), ["fridge"]);
  assert.deepEqual(ids("  REFRIGERATOR   humming  "), ["fridge"]);
  assert.deepEqual(ids("Normal conversation"), ["conversation"]);
});

test("分贝查询匹配数值范围并包含上下界", () => {
  assert.deepEqual(ids("40"), ["fridge"]);
  assert.deepEqual(ids("60"), ["dishwasher", "conversation"]);
  assert.deepEqual(ids("65"), ["dishwasher", "conversation"]);
  assert.deepEqual(ids("65.5"), ["conversation"]);
  assert.deepEqual(ids("70"), ["conversation"]);
  assert.deepEqual(ids("71"), []);
});

test("全角输入与单位筛选不混同 dB 和 dBA", () => {
  assert.deepEqual(ids("６０ 分贝"), ["dishwasher", "conversation"]);
  assert.deepEqual(ids("60 dB"), ["dishwasher"]);
  assert.deepEqual(ids("60 dBA"), ["conversation"]);
  assert.deepEqual(ids("60 dB(A)"), ["conversation"]);
});

test("默认和空白查询保留全部声音", () => {
  assert.deepEqual(ids(""), ["fridge", "dishwasher", "conversation"]);
  assert.deepEqual(ids("  "), ["fridge", "dishwasher", "conversation"]);
});

test("无结果和特殊字符作为普通文本处理", () => {
  assert.deepEqual(ids("不存在的声音"), []);
  assert.deepEqual(ids(".*"), []);
  assert.deepEqual(ids("<script>"), []);
  assert.deepEqual(ids("-40"), []);
});

test("按参考起点分组，跨档条目只出现一次并保留完整范围", () => {
  const groups = groupSounds(sounds, bands);
  assert.deepEqual(
    groups.map((group) => group.band.tone),
    ["quiet", "everyday"],
  );
  assert.deepEqual(
    groups[0].sounds.map((sound) => sound.id),
    ["fridge", "dishwasher"],
  );
  assert.equal(referenceLevel(groups[0].sounds[1]), "45–65 dB");
  assert.deepEqual(
    groups.flatMap((group) => group.sounds),
    sounds,
  );
});

test("共享七档将交界起点归入后一档，保留小数起点与 160 上界", () => {
  const points = [0, 29.9, 30, 50, 70, 85, 100, 120, 160].map((level) => ({
    ...sounds[0],
    id: String(level),
    min: level,
    max: level,
  }));
  assert.deepEqual(
    groupSounds(points, bands).map((group) => group.sounds.map((sound) => sound.id)),
    [["0", "29.9"], ["30"], ["50"], ["70"], ["85"], ["100"], ["120", "160"]],
  );
});

test("搜索只保留匹配条目及其分组，无结果时没有空分组", () => {
  assert.deepEqual(
    groupSounds(filterSounds(sounds, "冰箱"), bands).map((group) => group.band.tone),
    ["quiet"],
  );
  assert.deepEqual(
    groupSounds(filterSounds(sounds, "65"), bands).map((group) => group.band.tone),
    ["quiet", "everyday"],
  );
  assert.deepEqual(
    groupSounds(filterSounds(sounds, "60 dBA"), bands).flatMap((group) =>
      group.sounds.map((sound) => sound.id),
    ),
    ["conversation"],
  );
  assert.deepEqual(groupSounds(filterSounds(sounds, "不存在"), bands), []);
});

test("完整来源数据在七档中无遗漏、无重复，保留单位和原始范围", () => {
  const all = soundReferences.map((sound) => ({
    ...sound,
    name: sound.name.zh,
    context: sound.context.zh,
    searchText: sound.name.zh,
    sourceId: sound.source,
    sourceLabel: sound.source,
  }));
  const groups = groupSounds(all, bands);
  const grouped = groups.flatMap((group) => group.sounds);
  assert.equal(groups.length, 7);
  assert.equal(grouped.length, all.length);
  assert.equal(new Set(grouped.map((sound) => sound.id)).size, all.length);
  for (const sound of all)
    assert.equal(
      grouped.find((item) => item.id === sound.id),
      sound,
    );
});
