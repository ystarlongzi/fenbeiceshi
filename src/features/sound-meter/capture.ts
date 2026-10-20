import { addWindow, analyzeSamples, emptyStats } from "./level.ts";
import type { InputInfo, LevelPoint, MeterFrame, StopReason } from "./types.ts";

export interface CaptureTap {
  start: (
    context: AudioContext,
    source: MediaStreamAudioSourceNode,
    signal: AbortSignal,
  ) => Promise<void>;
  stop: () => Promise<void>;
}

export async function acquireInput(
  request: () => Promise<MediaStream>,
  signal: AbortSignal,
): Promise<MediaStream | null> {
  if (signal.aborted) return null;
  try {
    const stream = await request();
    if (signal.aborted) {
      for (const track of stream.getTracks()) track.stop();
      return null;
    }
    return stream;
  } catch (error) {
    if (signal.aborted) return null;
    throw error;
  }
}

export class CaptureSession {
  private controller = new AbortController();
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private animation = 0;
  private stopped = false;
  private tap: CaptureTap | undefined;
  private callbacks: {
    frame: (frame: MeterFrame) => void;
    ready: (input: InputInfo) => void;
    end: (reason: StopReason) => void;
  };

  constructor(callbacks: CaptureSession["callbacks"], tap?: CaptureTap) {
    this.callbacks = callbacks;
    this.tap = tap;
  }

  async start(deviceId: string) {
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      throw new DOMException("需要安全上下文和麦克风支持。", "NotSupportedError");
    }
    const stream = await acquireInput(
      () =>
        navigator.mediaDevices.getUserMedia({
          audio: {
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        }),
      this.controller.signal,
    );
    if (!stream) return;
    this.stream = stream;
    try {
      const context = new AudioContext();
      this.context = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      await context.resume();
      if (!this.controller.signal.aborted)
        await this.tap?.start(context, source, this.controller.signal);
      if (this.controller.signal.aborted) {
        this.release();
        return;
      }
      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings();
      const signature = JSON.stringify([
        settings.deviceId || track.id,
        context.sampleRate,
        settings.channelCount,
        settings.echoCancellation,
        settings.noiseSuppression,
        settings.autoGainControl,
      ]);
      track.addEventListener("ended", () => this.stop("device-ended"), { once: true });
      context.addEventListener("statechange", () => {
        if (context.state === "suspended" && !this.stopped) this.stop("device-ended");
      });
      this.callbacks.ready({
        label: track.label || "Microphone",
        signature,
        processing: Boolean(
          settings.echoCancellation || settings.noiseSuppression || settings.autoGainControl,
        ),
      });
      const samples = new Float32Array(analyser.fftSize);
      const started = performance.now();
      let stats = emptyStats();
      let points: LevelPoint[] = [];
      let lastFrame = -Infinity;
      let lastPoint = -Infinity;
      const tick = (time: number) => {
        if (this.controller.signal.aborted) return;
        try {
          if (time - lastFrame >= 125) {
            analyser.getFloatTimeDomainData(samples);
            const level = analyzeSamples(samples);
            const elapsed = time - started;
            // 首次非零输入前，全零窗口可能来自启动缓冲；保留信号反馈，避免锁死最低值。
            if (stats.count || level.energy > 0) stats = addWindow(stats, level.energy);
            if (stats.count && elapsed - lastPoint >= 500) {
              points = [
                ...points.filter((point) => point.time > elapsed - 60000),
                { time: elapsed, value: level.value },
              ];
              lastPoint = elapsed;
            }
            this.callbacks.frame({
              value: level.value,
              elapsed,
              stats,
              points,
              clipped: level.clipped,
            });
            lastFrame = time;
          }
          this.animation = requestAnimationFrame(tick);
        } catch (error) {
          console.error("音频窗口读取失败，结束当前观察。", error);
          this.stop("device-ended");
        }
      };
      this.animation = requestAnimationFrame(tick);
    } catch (error) {
      this.release();
      throw error;
    }
  }

  stop(reason: StopReason = "user") {
    if (this.stopped) return;
    this.stopped = true;
    this.controller.abort();
    this.release();
    this.callbacks.end(reason);
  }

  private release() {
    cancelAnimationFrame(this.animation);
    for (const track of this.stream?.getTracks() || []) track.stop();
    this.stream = null;
    const context = this.context;
    this.context = null;
    const close = () => {
      if (context && context.state !== "closed")
        void context
          .close()
          .catch((error: unknown) => console.error("音频上下文关闭失败。", error));
    };
    const tap = this.tap;
    this.tap = undefined;
    // 先停止麦克风，等录音尾部采样回传后再关闭其共用的音频上下文。
    if (tap)
      void tap.stop().then(close, (error: unknown) => {
        console.error("录音停止失败，释放音频上下文。", error);
        close();
      });
    else close();
  }
}
