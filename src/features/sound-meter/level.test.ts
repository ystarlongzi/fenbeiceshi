import assert from "node:assert/strict";
import test from "node:test";
import { addWindow, analyzeSamples, averageLevel, emptyStats, scalePosition } from "./level.ts";
import { makeCalibration, activeCalibration } from "../calibration/calibration.ts";
import { acquireInput } from "./capture.ts";

test("零输入有显示下限，不生成环境分贝", () => {
  assert.equal(analyzeSamples(new Float32Array(16)).value, -100);
  assert.equal(averageLevel(emptyStats()), null);
});

test("满幅正弦的 RMS 电平约 -3.0103 dBFS", () => {
  const samples = Float32Array.from({ length: 1024 }, (_, i) => Math.sin((2 * Math.PI * i) / 64));
  assert.ok(Math.abs(analyzeSamples(samples).value + 3.0103) < 0.001);
});

test("能量平均不等于直接平均 dB", () => {
  const stats = addWindow(addWindow(emptyStats(), 0.01), 0.0001);
  assert.ok(Math.abs((averageLevel(stats) ?? 0) + 22.967086) < 0.0001);
  assert.equal(stats.min, -40);
  assert.equal(stats.max, -20);
});

test("非法音频与空窗口被拒绝，坐标按数值比例分配", () => {
  assert.throws(() => analyzeSamples(new Float32Array()));
  assert.throws(() => analyzeSamples(new Float32Array([NaN])));
  assert.equal(scalePosition(40, 0, 120), 1 / 3);
  assert.equal(scalePosition(-50, -100, 0), 0.5);
});

test("参考关系仅适用于相同输入，低信号和非法参考被拒绝", () => {
  const saved = makeCalibration(-40, 60, "参考声级计", "input-a");
  assert.equal(saved.offset, 100);
  assert.equal(activeCalibration(saved, "input-b"), null);
  assert.equal(activeCalibration(saved, "input-a"), saved);
  assert.throws(() => makeCalibration(-100, 60, "reference", "a"));
  assert.throws(() => makeCalibration(-40, NaN, "reference", "a"));
  assert.throws(() => makeCalibration(-40, 60, "", "a"));
});

test("取消授权等待后，迟到的音轨立即释放", async () => {
  let resolve: (stream: MediaStream) => void = () => {
    throw new Error("请求尚未开始。");
  };
  let released = 0;
  const controller = new AbortController();
  const pending = acquireInput(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
    controller.signal,
  );
  controller.abort();
  resolve({
    getTracks: () => [
      {
        stop: () => {
          released += 1;
        },
      },
    ],
  } as unknown as MediaStream);
  assert.equal(await pending, null);
  assert.equal(released, 1);
});

test("拒绝权限保留原错误，已取消的拒绝不污染新会话", async () => {
  const denied = new DOMException("denied", "NotAllowedError");
  await assert.rejects(
    acquireInput(() => Promise.reject(denied), new AbortController().signal),
    denied,
  );
  const controller = new AbortController();
  controller.abort();
  assert.equal(await acquireInput(() => Promise.reject(denied), controller.signal), null);
});

test("已经取消的会话不会再次请求麦克风", async () => {
  const controller = new AbortController();
  controller.abort();
  let requested = false;
  assert.equal(
    await acquireInput(() => {
      requested = true;
      return Promise.reject(new Error("不应请求"));
    }, controller.signal),
    null,
  );
  assert.equal(requested, false);
});
