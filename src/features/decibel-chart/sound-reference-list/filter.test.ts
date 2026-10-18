import assert from "node:assert/strict";
import test from "node:test";
import { filterSounds, type LookupSound } from "./filter.ts";

const sounds: LookupSound[] = [
  {
    id: "fridge",
    category: "appliances",
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
    category: "appliances",
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
    category: "everyday",
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
const ids = (query: string, category = "all") =>
  filterSounds(sounds, query, category).map((sound) => sound.id);

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

test("类别与搜索组合生效，清空查询仍保留类别", () => {
  assert.deepEqual(ids("60", "appliances"), ["dishwasher"]);
  assert.deepEqual(ids("", "appliances"), ["fridge", "dishwasher"]);
  assert.deepEqual(ids("  "), ["fridge", "dishwasher", "conversation"]);
  assert.deepEqual(ids("40", "everyday"), []);
});

test("无结果和特殊字符作为普通文本处理", () => {
  assert.deepEqual(ids("不存在的声音"), []);
  assert.deepEqual(ids(".*"), []);
  assert.deepEqual(ids("<script>"), []);
  assert.deepEqual(ids("-40"), []);
});

test("分段按范围交集筛选，保留跨档条目并将交界单值归入后一档", () => {
  const before60 = { min: 40, max: 60, includeMax: false };
  assert.deepEqual(
    filterSounds(sounds, "", "all", before60).map((sound) => sound.id),
    ["fridge", "dishwasher"],
  );
  const after60 = { min: 60, max: 70, includeMax: false };
  assert.deepEqual(
    filterSounds(sounds, "", "all", after60).map((sound) => sound.id),
    ["dishwasher", "conversation"],
  );
  assert.deepEqual(
    filterSounds(sounds, "", "appliances", after60).map((sound) => sound.id),
    ["dishwasher"],
  );
});

test("单值探索与名称、来源单位和类别组合，清除分贝筛选后恢复原查询", () => {
  const at60 = { min: 60, max: 60, includeMax: true };
  assert.deepEqual(
    filterSounds(sounds, "60 dB", "all", at60).map((sound) => sound.id),
    ["dishwasher"],
  );
  assert.deepEqual(
    filterSounds(sounds, "conversation", "all", at60).map((sound) => sound.id),
    ["conversation"],
  );
  assert.deepEqual(filterSounds(sounds, "冰箱", "all", at60), []);
  assert.deepEqual(
    filterSounds(sounds, "冰箱", "all", null).map((sound) => sound.id),
    ["fridge"],
  );
  const endpoint = [{ ...sounds[0], id: "endpoint", min: 160, max: 160 }];
  assert.equal(
    filterSounds(endpoint, "", "all", { min: 120, max: 160, includeMax: true }).length,
    1,
  );
});
