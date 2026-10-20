/* global AudioWorkletProcessor, registerProcessor */
class PcmRecorder extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.buffer = new ArrayBuffer(8192);
    this.view = new DataView(this.buffer);
    this.offset = 0;
    this.frames = 0;
    this.maxFrames = options.processorOptions.maxFrames;
    this.finished = false;
    this.port.onmessage = (event) => {
      if (event.data === "stop") this.finish(false);
    };
  }

  flush() {
    if (!this.offset) return;
    const buffer = this.buffer.slice(0, this.offset * 2);
    this.port.postMessage({ type: "chunk", buffer }, [buffer]);
    this.offset = 0;
  }

  finish(limited) {
    if (this.finished) return;
    this.finished = true;
    this.flush();
    this.port.postMessage({ type: "done", limited });
  }

  process(inputs) {
    if (this.finished) return false;
    const samples = inputs[0]?.[0];
    if (!samples) return true;
    for (let i = 0; i < samples.length; i++) {
      const value = Number.isFinite(samples[i]) ? Math.max(-1, Math.min(1, samples[i])) : 0;
      this.view.setInt16(this.offset * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true);
      this.offset += 1;
      this.frames += 1;
      if (this.offset === this.buffer.byteLength / 2) this.flush();
      if (this.frames >= this.maxFrames) {
        this.finish(true);
        return false;
      }
    }
    // 输出保持默认的全零，避免把麦克风声音回放到扬声器。
    return true;
  }
}

registerProcessor("fenbeiceshi-pcm", PcmRecorder);
