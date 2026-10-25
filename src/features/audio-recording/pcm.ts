export const MAX_RECORDING_SECONDS = 600;
const MAX_PCM_BYTES = 64 * 1024 * 1024;

export interface AudioClip {
  pcm: Blob;
  wav: Blob;
  sampleRate: number;
  frames: number;
  startedAt: string;
  limited: boolean;
  interrupted: boolean;
}

export interface RecordingInfo {
  version: 1;
  sampleRate: number;
  frames: number;
}

export interface RecordedClip extends AudioClip {
  measurementId: string;
}

export function validRecordingInfo(value: unknown): value is RecordingInfo {
  if (!value || typeof value !== "object") return false;
  const info = value as RecordingInfo;
  return (
    info.version === 1 &&
    Number.isInteger(info.sampleRate) &&
    info.sampleRate >= 8000 &&
    info.sampleRate <= 192000 &&
    Number.isSafeInteger(info.frames) &&
    info.frames > 0 &&
    info.frames <= recordingFrameLimit(info.sampleRate)
  );
}

export function recordingFrameLimit(sampleRate: number) {
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000)
    throw new RangeError("录音采样率无效。");
  return Math.min(sampleRate * MAX_RECORDING_SECONDS, MAX_PCM_BYTES / 2);
}

export function createClip(
  chunks: ArrayBuffer[],
  sampleRate: number,
  startedAt: string,
  limited = false,
  interrupted = false,
): AudioClip {
  const frames = chunks.reduce((total, chunk) => total + chunk.byteLength, 0) / 2;
  // 先检查采样上限，再创建 Blob，避免无效输入额外分配整段音频内存。
  if (!validRecordingInfo({ version: 1, sampleRate, frames }))
    throw new RangeError("录音采样内容无效。");
  return restoreClip({
    pcm: new Blob(chunks, { type: "application/octet-stream" }),
    sampleRate,
    startedAt,
    limited,
    interrupted,
    frames,
  });
}

// 从 IndexedDB 恢复时复用 Blob，避免为播放再次读取和复制整段 PCM。
export function restoreClip(value: Omit<AudioClip, "wav">): AudioClip {
  const { pcm, sampleRate, frames, startedAt, limited, interrupted } = value;
  if (
    !validRecordingInfo({ version: 1, sampleRate, frames }) ||
    !(pcm instanceof Blob) ||
    pcm.size !== frames * 2 ||
    typeof startedAt !== "string" ||
    startedAt.length > 40 ||
    !Number.isFinite(Date.parse(startedAt)) ||
    typeof limited !== "boolean" ||
    typeof interrupted !== "boolean"
  )
    throw new RangeError("录音采样内容无效。");
  const size = pcm.size;
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  function text(offset: number, value: string) {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  }
  text(0, "RIFF");
  view.setUint32(4, size + 36, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, size, true);
  return {
    pcm,
    wav: new Blob([header, pcm], { type: "audio/wav" }),
    sampleRate,
    frames,
    startedAt,
    limited,
    interrupted,
  };
}

export function recordingFilename(clip: AudioClip, format: "mp3" | "pcm") {
  const date = clip.startedAt.replace(/[:.]/g, "-");
  const parameters = format === "pcm" ? `-${clip.sampleRate}hz-mono-s16le` : "";
  return `${activeSite.domain.replace(".com", "")}-${date}${parameters}.${format}`;
}
import { activeSite } from "../../lib/routing/sites.ts";
