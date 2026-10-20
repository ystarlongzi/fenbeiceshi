import { createClip, recordingFrameLimit, type AudioClip } from "./pcm.ts";

interface RecorderCallbacks {
  started: () => void;
  finishing: () => void;
  complete: (clip: AudioClip) => void;
  error: () => void;
}

export class LocalAudioRecorder {
  private node: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: ArrayBuffer[] = [];
  private bytes = 0;
  private sampleRate = 0;
  private startedAt = "";
  private disposed = false;
  private finished = false;
  private stopping: Promise<void> | null = null;
  private resolveStop: (() => void) | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private callbacks: RecorderCallbacks;

  constructor(callbacks: RecorderCallbacks) {
    this.callbacks = callbacks;
  }

  async start(context: AudioContext, source: MediaStreamAudioSourceNode, signal: AbortSignal) {
    try {
      if (!context.audioWorklet || typeof AudioWorkletNode === "undefined")
        throw new Error("浏览器不支持 AudioWorklet 录音。");
      this.sampleRate = context.sampleRate;
      const maxFrames = recordingFrameLimit(this.sampleRate);
      await context.audioWorklet.addModule("/audio/pcm-recorder.js");
      if (this.disposed || signal.aborted) return;
      const node = new AudioWorkletNode(context, "fenbeiceshi-pcm", {
        channelCount: 1,
        channelCountMode: "explicit",
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: { maxFrames },
      });
      this.node = node;
      this.source = source;
      node.port.onmessage = (event: MessageEvent<unknown>) => {
        if (this.disposed || this.finished) return;
        const data = event.data as { type?: string; buffer?: unknown; limited?: boolean };
        if (data?.type === "chunk" && data.buffer instanceof ArrayBuffer) {
          if (data.buffer.byteLength % 2 || this.bytes + data.buffer.byteLength > maxFrames * 2) {
            this.finish(false, true);
            return;
          }
          this.chunks.push(data.buffer);
          this.bytes += data.buffer.byteLength;
        } else if (data?.type === "done") this.finish(Boolean(data.limited));
      };
      node.onprocessorerror = (error) => {
        console.error("本机录音处理器中断。", error);
        this.finish(false, true);
      };
      this.startedAt = new Date().toISOString();
      source.connect(node);
      node.connect(context.destination);
      this.callbacks.started();
    } catch (error) {
      if (this.disposed || signal.aborted) return;
      console.error("本机录音启动失败。", error);
      this.disconnect();
      this.finished = true;
      this.callbacks.error();
    }
  }

  stop(): Promise<void> {
    if (this.stopping) return this.stopping;
    if (!this.node || this.finished || this.disposed) return Promise.resolve();
    this.callbacks.finishing();
    this.stopping = new Promise<void>((resolve) => {
      this.resolveStop = resolve;
      // 后台或设备中断时处理器可能不再回应，保留已收到的采样并释放上下文。
      this.timer = setTimeout(() => this.finish(false, true), 1500);
      this.node?.port.postMessage("stop");
    });
    return this.stopping;
  }

  dispose() {
    this.disposed = true;
    this.disconnect();
    this.chunks = [];
  }

  private finish(limited: boolean, interrupted = false) {
    if (this.finished || this.disposed) return;
    this.finished = true;
    this.disconnect();
    try {
      this.callbacks.complete(
        createClip(this.chunks, this.sampleRate, this.startedAt, limited, interrupted),
      );
    } catch (error) {
      console.error("本机录音整理失败。", error);
      this.callbacks.error();
    } finally {
      this.chunks = [];
    }
  }

  private disconnect() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.resolveStop?.();
    this.resolveStop = null;
    if (this.node) {
      this.source?.disconnect(this.node);
      this.node.disconnect();
      this.node.port.onmessage = null;
      this.node.port.close();
      this.node.onprocessorerror = null;
    }
    this.node = null;
    this.source = null;
  }
}
