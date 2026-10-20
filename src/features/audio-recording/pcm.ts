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
  const maxFrames = recordingFrameLimit(sampleRate);
  const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  if (!size || size % 2 || size / 2 > maxFrames || !Number.isFinite(Date.parse(startedAt)))
    throw new RangeError("录音采样内容无效。");
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
  const pcm = new Blob(chunks, { type: "application/octet-stream" });
  return {
    pcm,
    wav: new Blob([header, pcm], { type: "audio/wav" }),
    sampleRate,
    frames: size / 2,
    startedAt,
    limited,
    interrupted,
  };
}

export function recordingFilename(clip: AudioClip, format: "mp3" | "pcm") {
  const date = clip.startedAt.replace(/[:.]/g, "-");
  const parameters = format === "pcm" ? `-${clip.sampleRate}hz-mono-s16le` : "";
  return `fenbeiceshi-${date}${parameters}.${format}`;
}
