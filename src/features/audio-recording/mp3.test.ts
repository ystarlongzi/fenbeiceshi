import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Mp3Encoder } from "@breezystack/lamejs";
import { encodeMp3 } from "./mp3.ts";

test("实际编码器生成可解析的 MPEG 帧，支持常见采样率及高采样率输入", async () => {
  for (const rate of [16000, 44100, 48000, 96000]) {
    const pcm = new ArrayBuffer(rate * 2);
    const view = new DataView(pcm);
    for (let i = 0; i < rate; i++)
      view.setInt16(i * 2, Math.round(Math.sin((i * 2 * Math.PI * 440) / rate) * 16000), true);
    const blob = encodeMp3(pcm, rate, new Mp3Encoder(1, rate, 128));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    assert.equal(blob.type, "audio/mpeg");
    assert.ok(blob.size > 8000);
    assert.equal(bytes[0], 0xff);
    assert.equal(bytes[1] & 0xe0, 0xe0);
    assert.equal((bytes[1] >> 1) & 3, 1);
    assert.equal(bytes[3] >> 6, 3);
  }
});

test("编码器 flush 的尾帧不丢失，空输入和奇数字节被拒绝", async () => {
  const calls: number[] = [];
  const encoder = {
    encodeBuffer: (samples: Int16Array) => {
      calls.push(samples.length);
      return new Uint8Array([1]);
    },
    flush: () => new Uint8Array([2, 3]),
  };
  const blob = encodeMp3(new ArrayBuffer(1153 * 2), 48000, encoder);
  assert.deepEqual(calls, [1152, 1]);
  assert.deepEqual(new Uint8Array(await blob.arrayBuffer()), new Uint8Array([1, 1, 2, 3]));
  assert.throws(() => encodeMp3(new ArrayBuffer(0), 48000, encoder), RangeError);
  assert.throws(() => encodeMp3(new ArrayBuffer(3), 48000, encoder), RangeError);
});

test("独立分发的编码器与固定依赖原文件一致，并附带源码及许可证", () => {
  assert.deepEqual(
    readFileSync("public/vendor/lamejs/lamejs.js"),
    readFileSync("node_modules/@breezystack/lamejs/dist/lamejs.js"),
  );
  for (const file of ["COPYING.LESSER.txt", "COPYING.txt", "source-1.2.7.tar.gz", "NOTICE.txt"])
    assert.ok(readFileSync(`public/vendor/lamejs/${file}`).byteLength > 100);
});
