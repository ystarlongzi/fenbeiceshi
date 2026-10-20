import { recordingFrameLimit } from "./pcm.ts";

export interface Mp3Encoder {
  encodeBuffer: (samples: Int16Array) => Uint8Array;
  flush: () => Uint8Array;
}

export function encodeMp3(pcm: ArrayBuffer, sampleRate: number, encoder: Mp3Encoder) {
  const maxFrames = recordingFrameLimit(sampleRate);
  if (!pcm.byteLength || pcm.byteLength % 2 || pcm.byteLength / 2 > maxFrames)
    throw new RangeError("MP3 输入采样无效。");
  const samples = new DataView(pcm);
  const block = new Int16Array(1152);
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  for (let start = 0; start < pcm.byteLength / 2; start += block.length) {
    const count = Math.min(block.length, pcm.byteLength / 2 - start);
    for (let i = 0; i < count; i++) block[i] = samples.getInt16((start + i) * 2, true);
    const encoded = encoder.encodeBuffer(block.subarray(0, count));
    if (encoded.length) chunks.push(Uint8Array.from(encoded));
  }
  const tail = encoder.flush();
  if (tail.length) chunks.push(Uint8Array.from(tail));
  if (!chunks.length) throw new Error("MP3 编码未生成内容。");
  return new Blob(chunks, { type: "audio/mpeg" });
}
