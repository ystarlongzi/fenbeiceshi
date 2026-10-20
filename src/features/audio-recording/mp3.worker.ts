import { encodeMp3 } from "./mp3.ts";
import { recordingFrameLimit } from "./pcm.ts";

self.onmessage = async (event: MessageEvent<{ pcm: ArrayBuffer; sampleRate: number }>) => {
  try {
    const { pcm, sampleRate } = event.data;
    const maxFrames = recordingFrameLimit(sampleRate);
    if (!(pcm instanceof ArrayBuffer) || !pcm.byteLength || pcm.byteLength > maxFrames * 2)
      throw new RangeError("MP3 编码请求无效。");
    // LGPL 编码器以可独立替换的同源模块提供，仅下载 MP3 时加载。
    const url = "/vendor/lamejs/lamejs.js";
    const { Mp3Encoder } = (await import(
      /* webpackIgnore: true */ url
    )) as typeof import("@breezystack/lamejs");
    const blob = encodeMp3(pcm, sampleRate, new Mp3Encoder(1, sampleRate, 128));
    self.postMessage({ blob });
  } catch (error) {
    console.error("本机 MP3 编码失败。", error);
    self.postMessage({ error: true });
  }
};
