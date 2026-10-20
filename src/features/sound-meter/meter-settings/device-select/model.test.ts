import assert from "node:assert/strict";
import test from "node:test";
import { deviceOptions, moveOption } from "./model.ts";

test("未授权或设备列表为空时仍可使用默认麦克风", () => {
  assert.deepEqual(deviceOptions([], "默认麦克风", "麦克风"), [{ value: "", label: "默认麦克风" }]);
  assert.deepEqual(
    deviceOptions([{ deviceId: "", label: "" }], "Default microphone", "Microphone"),
    [{ value: "", label: "Default microphone" }],
  );
});

test("设备选项忽略重复默认项并为无名称输入提供可区分的名称", () => {
  assert.deepEqual(
    deviceOptions(
      [
        { deviceId: "default", label: "系统默认" },
        { deviceId: "usb", label: "USB 麦克风" },
        { deviceId: "usb", label: "重复输入" },
        { deviceId: "internal", label: " " },
        { deviceId: "other", label: "" },
      ],
      "默认麦克风",
      "麦克风",
    ),
    [
      { value: "", label: "默认麦克风" },
      { value: "usb", label: "USB 麦克风" },
      { value: "internal", label: "麦克风 2" },
      { value: "other", label: "麦克风 3" },
    ],
  );
});

test("方向键循环选择，Home 和 End 定位首尾，其他按键不改变选项", () => {
  assert.equal(moveOption("ArrowDown", 2, 3), 0);
  assert.equal(moveOption("ArrowUp", 0, 3), 2);
  assert.equal(moveOption("Home", 2, 3), 0);
  assert.equal(moveOption("End", 0, 3), 2);
  assert.equal(moveOption("ArrowDown", 0, 1), 0);
  assert.equal(moveOption("ArrowDown", 0, 0), null);
  assert.equal(moveOption("Tab", 1, 3), null);
});
