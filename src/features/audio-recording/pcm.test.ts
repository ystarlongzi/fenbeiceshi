import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { createClip, recordingFilename, recordingFrameLimit } from "./pcm.ts";

interface Worklet {
  process: (inputs: Float32Array[][]) => boolean;
  port: { onmessage: (event: { data: string }) => void };
}

export function workletFixture(maxFrames = 48000) {
  const messages: { type: string; buffer?: ArrayBuffer; limited?: boolean }[] = [];
  let Processor: { new (options: unknown): Worklet } | null = null;
  vm.runInNewContext(readFileSync("public/audio/pcm-recorder.js", "utf8"), {
    ArrayBuffer,
    DataView,
    AudioWorkletProcessor: class {
      port = {
        onmessage: null,
        postMessage: (message: (typeof messages)[number]) => messages.push(message),
      };
    },
    registerProcessor: (_name: string, value: NonNullable<typeof Processor>) => {
      Processor = value;
    },
  });
  assert.ok(Processor);
  const processor = new (Processor as { new (options: unknown): Worklet })({
    processorOptions: { maxFrames },
  });
  return { processor, messages };
}

test("真实 Worklet 按实际块长写入 16 位小端采样，flush 保留最后不足一块的尾部", () => {
  const { processor, messages } = workletFixture();
  processor.process([[new Float32Array([-2, -1, -0.5, 0, 0.5, 1, 2, NaN])]]);
  processor.port.onmessage({ data: "stop" });
  assert.deepEqual(
    messages.map((item) => item.type),
    ["chunk", "done"],
  );
  const view = new DataView(messages[0].buffer!);
  assert.deepEqual(
    Array.from({ length: 8 }, (_, i) => view.getInt16(i * 2, true)),
    [-32768, -32768, -16384, 0, 16384, 32767, 32767, 0],
  );
  assert.equal(processor.process([[new Float32Array([1])]]), false);
  processor.port.onmessage({ data: "stop" });
  assert.equal(messages.length, 2);
});

test("分块边界与停止尾部连续，达到限额只输出限定的采样数", () => {
  const { processor, messages } = workletFixture(4100);
  assert.equal(processor.process([[new Float32Array(4098).fill(0.25)]]), true);
  assert.equal(processor.process([[new Float32Array(128).fill(0.5)]]), false);
  assert.deepEqual(
    messages.map((item) => item.type),
    ["chunk", "chunk", "done"],
  );
  assert.equal(messages[0].buffer?.byteLength, 8192);
  assert.equal(messages[1].buffer?.byteLength, 8);
  assert.equal(messages[2].limited, true);
  const tail = new DataView(messages[1].buffer!);
  assert.equal(tail.getInt16(0, true), 8192);
  assert.equal(tail.getInt16(4, true), 16384);
});

test("PCM 下载无文件头，播放 WAV 的参数、数据长度与原始采样相符", async () => {
  const pcm = new Uint8Array([0, 128, 255, 127]).buffer;
  const clip = createClip([pcm], 48000, "2026-10-20T00:00:00.000Z");
  assert.equal(clip.pcm.size, 4);
  assert.deepEqual(new Uint8Array(await clip.pcm.arrayBuffer()), new Uint8Array(pcm));
  const wav = await clip.wav.arrayBuffer();
  const view = new DataView(wav);
  assert.equal(new TextDecoder().decode(wav.slice(0, 4)), "RIFF");
  assert.equal(view.getUint32(4, true), wav.byteLength - 8);
  assert.equal(view.getUint16(20, true), 1);
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 48000);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(view.getUint32(40, true), pcm.byteLength);
  assert.deepEqual(new Uint8Array(wav.slice(44)), new Uint8Array(pcm));
  assert.match(recordingFilename(clip, "pcm"), /-48000hz-mono-s16le\.pcm$/);
  assert.match(recordingFilename(clip, "mp3"), /\.mp3$/);
});

test("采样率、字节长度、日期与内存边界拒绝无效录音", () => {
  assert.equal(recordingFrameLimit(48000), 48000 * 600);
  assert.equal(recordingFrameLimit(192000), (64 * 1024 * 1024) / 2);
  for (const rate of [NaN, 0, 7999, 192001, 44100.5])
    assert.throws(() => recordingFrameLimit(rate), RangeError);
  const time = "2026-10-20T00:00:00.000Z";
  assert.throws(() => createClip([], 48000, time), RangeError);
  assert.throws(() => createClip([new ArrayBuffer(1)], 48000, time), RangeError);
  assert.throws(() => createClip([new ArrayBuffer(2)], 48000, "invalid"), RangeError);
});
