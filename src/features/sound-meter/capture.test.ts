import assert from "node:assert/strict";
import test from "node:test";
import { CaptureSession } from "./capture.ts";
import type { InputInfo, MeterFrame, StopReason } from "./types.ts";
import { currentBasis, displayFrame } from "./readings.ts";

async function withInput(
  run: (fixture: {
    track: FakeTrack;
    contexts: FakeContext[];
    frames: MeterFrame[];
    ready: InputInfo[];
    ended: StopReason[];
    session: CaptureSession;
    step: () => void;
    setResume: (resume: () => Promise<void>) => void;
    constraints: () => MediaStreamConstraints | null;
  }) => Promise<void>,
) {
  const keys = [
    "window",
    "navigator",
    "AudioContext",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ];
  const originals = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const track = new FakeTrack();
  const contexts: FakeContext[] = [];
  let onResume = () => Promise.resolve();
  let callback: FrameRequestCallback | null = null;
  let frameTime = performance.now();
  let constraints: MediaStreamConstraints | null = null;
  class Context extends FakeContext {
    constructor() {
      super();
      contexts.push(this);
    }
    resume() {
      return onResume();
    }
  }
  const values = [
    { isSecureContext: true },
    {
      mediaDevices: {
        getUserMedia: async (next: MediaStreamConstraints) => {
          constraints = next;
          return { getTracks: () => [track], getAudioTracks: () => [track] };
        },
      },
    },
    Context,
    (next: FrameRequestCallback) => {
      callback = next;
      return 1;
    },
    () => {
      callback = null;
    },
  ];
  for (const [i, key] of keys.entries())
    Object.defineProperty(globalThis, key, { configurable: true, value: values[i] });
  const frames: MeterFrame[] = [];
  const ready: InputInfo[] = [];
  const ended: StopReason[] = [];
  const session = new CaptureSession({
    frame: (frame) => frames.push(frame),
    ready: (info) => ready.push(info),
    end: (reason) => ended.push(reason),
  });
  try {
    await run({
      track,
      contexts,
      frames,
      ready,
      ended,
      session,
      step: () => {
        frameTime = Math.max(frameTime, performance.now()) + 1000;
        callback?.(frameTime);
      },
      setResume: (fn) => {
        onResume = fn;
      },
      constraints: () => constraints,
    });
  } finally {
    session.stop("cancelled");
    keys.forEach((key, i) => {
      const original = originals[i];
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

class FakeTrack extends EventTarget {
  id = "track-for-test";
  label = "Test microphone";
  stops = 0;
  stop() {
    this.stops += 1;
  }
  getSettings() {
    return {
      deviceId: "test-device",
      channelCount: 1,
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    };
  }
}

class FakeContext extends EventTarget {
  state = "running";
  sampleRate = 48000;
  closes = 0;
  amplitude = 0.1;
  createAnalyser() {
    return {
      fftSize: 2048,
      getFloatTimeDomainData: (samples: Float32Array) => samples.fill(this.amplitude),
    };
  }
  createMediaStreamSource() {
    return { connect: () => undefined };
  }
  close() {
    this.closes += 1;
    this.state = "closed";
    return Promise.resolve();
  }
}

test("实际采集路径计算相对电平，结束只关闭一次音轨与上下文", () =>
  withInput(async ({ session, frames, contexts, track, ready, ended, step, constraints }) => {
    await session.start("selected-input");
    assert.equal(ready.length, 1);
    assert.equal(ready[0].processing, false);
    const settings = constraints()?.audio as MediaTrackConstraints;
    assert.deepEqual(settings.deviceId, { exact: "selected-input" });
    assert.equal(settings.autoGainControl, false);
    step();
    assert.equal(frames.length, 1);
    assert.ok(Math.abs(frames[0].value + 20) < 0.0001);
    assert.ok(Math.abs(displayFrame(frames[0], currentBasis()).value - 80) < 0.0001);
    assert.equal(frames[0].stats.count, 1);
    session.stop();
    session.stop();
    assert.equal(track.stops, 1);
    assert.equal(contexts[0].closes, 1);
    assert.deepEqual(ended, ["user"]);
    step();
    assert.equal(frames.length, 1);
  }));

test("启动全零窗口只反馈输入下限，首次非零采样才进入统计与趋势", () =>
  withInput(async ({ session, frames, contexts, step }) => {
    await session.start("");
    contexts[0].amplitude = 0;
    step();
    step();
    for (const frame of frames) {
      const displayed = displayFrame(frame, currentBasis());
      assert.equal(displayed.belowFloor, true);
      assert.equal(displayed.minimum, null);
      assert.equal(displayed.average, null);
      assert.equal(frame.stats.count, 0);
      assert.deepEqual(frame.points, []);
    }
    assert.equal(frames.length, 2);
    contexts[0].amplitude = 0.01;
    step();
    contexts[0].amplitude = 0.1;
    step();
    const last = frames[3];
    const displayed = displayFrame(last, currentBasis());
    assert.equal(last.stats.count, 2);
    assert.equal(last.points.length, 2);
    assert.ok(Math.abs((displayed.minimum ?? 0) - 60) < 0.0001);
    assert.ok(Math.abs((displayed.maximum ?? 0) - 80) < 0.0001);
    assert.ok(Math.abs((displayed.average ?? 0) - 77.032914) < 0.0001);
    assert.equal(displayed.minimumAtFloor, false);
  }));

test("正常采集后的全零窗口仍计入最低值并保留下限标记", () =>
  withInput(async ({ session, frames, contexts, step }) => {
    await session.start("");
    step();
    contexts[0].amplitude = 0;
    step();
    const last = frames[1];
    const displayed = displayFrame(last, currentBasis());
    assert.equal(last.stats.count, 2);
    assert.equal(last.points.length, 2);
    assert.equal(displayed.minimum, 0);
    assert.equal(displayed.minimumAtFloor, true);
    assert.equal(displayed.belowFloor, true);
  }));

test("非零但低于计算下限的采样不会被启动保护排除", () =>
  withInput(async ({ session, frames, contexts, step }) => {
    await session.start("");
    contexts[0].amplitude = 0.000001;
    step();
    assert.equal(frames[0].stats.count, 1);
    assert.equal(frames[0].points.length, 1);
    assert.equal(displayFrame(frames[0], currentBasis()).minimumAtFloor, true);
  }));

test("音频上下文恢复期间取消，也不会进入运行状态或遗留输入", () =>
  withInput(async ({ session, contexts, track, ready, setResume }) => {
    let resume: () => void = () => {
      throw new Error("尚未等待恢复。");
    };
    let entering: () => void = () => {
      throw new Error("尚未建立等待。");
    };
    const entered = new Promise<void>((resolve) => {
      entering = resolve;
    });
    setResume(() => {
      entering();
      return new Promise<void>((resolve) => {
        resume = resolve;
      });
    });
    const pending = session.start("");
    await entered;
    session.stop("cancelled");
    resume();
    await pending;
    assert.equal(ready.length, 0);
    assert.equal(track.stops, 1);
    assert.equal(contexts[0].closes, 1);
  }));

test("设备结束事件中断采集并释放资源", () =>
  withInput(async ({ session, contexts, track, ended, step, frames }) => {
    await session.start("");
    step();
    track.dispatchEvent(new Event("ended"));
    step();
    assert.deepEqual(ended, ["device-ended"]);
    assert.equal(track.stops, 1);
    assert.equal(contexts[0].closes, 1);
    assert.equal(frames.length, 1);
  }));
