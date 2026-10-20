import assert from "node:assert/strict";
import test from "node:test";
import { LocalAudioRecorder } from "./recorder.ts";
import type { AudioClip } from "./pcm.ts";

async function fixture(
  run: (f: {
    recorder: LocalAudioRecorder;
    start: () => Promise<void>;
    controller: AbortController;
    events: string[];
    clips: AudioClip[];
    nodes: FakeNode[];
    pendingModule: (loader: () => Promise<void>) => void;
    timeout: () => void;
  }) => Promise<void>,
) {
  const keys = ["AudioWorkletNode", "setTimeout", "clearTimeout"];
  const originals = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const events: string[] = [];
  const clips: AudioClip[] = [];
  const nodes: FakeNode[] = [];
  let load = () => Promise.resolve();
  let timeout = () => {};
  class Node extends FakeNode {
    constructor() {
      super();
      nodes.push(this);
    }
  }
  const values = [
    Node,
    (callback: () => void) => {
      timeout = callback;
      return 1;
    },
    () => {},
  ];
  keys.forEach((key, i) =>
    Object.defineProperty(globalThis, key, { configurable: true, value: values[i] }),
  );
  const recorder = new LocalAudioRecorder({
    started: () => events.push("started"),
    finishing: () => events.push("finishing"),
    complete: (clip) => {
      events.push("complete");
      clips.push(clip);
    },
    error: () => events.push("error"),
  });
  const controller = new AbortController();
  const context = { sampleRate: 48000, audioWorklet: { addModule: () => load() }, destination: {} };
  const source = { connect: () => {}, disconnect: () => {} };
  try {
    await run({
      recorder,
      controller,
      events,
      clips,
      nodes,
      start: () =>
        recorder.start(
          context as unknown as AudioContext,
          source as unknown as MediaStreamAudioSourceNode,
          controller.signal,
        ),
      pendingModule: (loader) => {
        load = loader;
      },
      timeout: () => timeout(),
    });
  } finally {
    recorder.dispose();
    keys.forEach((key, i) => {
      if (originals[i]) Object.defineProperty(globalThis, key, originals[i]!);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

class FakeNode {
  stops = 0;
  disconnects = 0;
  closes = 0;
  onprocessorerror: (() => void) | null = null;
  port = {
    onmessage: null as ((event: MessageEvent<unknown>) => void) | null,
    postMessage: (data: string) => {
      if (data === "stop") this.stops += 1;
    },
    close: () => {
      this.closes += 1;
    },
  };
  connect() {}
  disconnect() {
    this.disconnects += 1;
  }
  message(data: unknown) {
    this.port.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

test("结束等待尾部回传后完成，重复停止幂等且关闭端口", () =>
  fixture(async ({ recorder, start, nodes, clips, events }) => {
    await start();
    nodes[0].message({ type: "chunk", buffer: new Uint8Array([1, 0]).buffer });
    const finishing = recorder.stop();
    assert.equal(recorder.stop(), finishing);
    assert.equal(nodes[0].stops, 1);
    assert.deepEqual(events, ["started", "finishing"]);
    nodes[0].message({ type: "chunk", buffer: new Uint8Array([2, 0]).buffer });
    nodes[0].message({ type: "done", limited: false });
    await finishing;
    assert.deepEqual(events, ["started", "finishing", "complete"]);
    assert.equal(clips[0].interrupted, false);
    assert.deepEqual(
      new Uint8Array(await clips[0].pcm.arrayBuffer()),
      new Uint8Array([1, 0, 2, 0]),
    );
    assert.equal(nodes[0].closes, 1);
    assert.equal(nodes[0].disconnects, 1);
  }));

test("加载录音模块期间取消，不创建处理器或迟到启动录音", () =>
  fixture(async ({ recorder, start, nodes, events, controller, pendingModule }) => {
    let resolve!: () => void;
    pendingModule(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    const pending = start();
    controller.abort();
    await recorder.stop();
    resolve();
    await pending;
    assert.equal(nodes.length, 0);
    assert.deepEqual(events, []);
  }));

test("后台停止超时保留片段，并标记录音不完整", () =>
  fixture(async ({ recorder, start, nodes, clips, timeout }) => {
    await start();
    nodes[0].message({ type: "chunk", buffer: new ArrayBuffer(4) });
    const pending = recorder.stop();
    timeout();
    await pending;
    assert.equal(clips[0].interrupted, true);
    assert.equal(clips[0].pcm.size, 4);
  }));

test("录音启动失败有明确回调，处理器故障保留片段", async () => {
  const original = console.error;
  const errors: unknown[][] = [];
  console.error = (...items) => {
    errors.push(items);
  };
  try {
    await fixture(async ({ start, events, pendingModule }) => {
      pendingModule(async () => {
        throw new Error("fixture module error");
      });
      await start();
      assert.deepEqual(events, ["error"]);
    });
    await fixture(async ({ start, nodes, clips }) => {
      await start();
      nodes[0].message({ type: "chunk", buffer: new ArrayBuffer(4) });
      nodes[0].onprocessorerror?.();
      assert.equal(clips[0].interrupted, true);
      assert.equal(nodes[0].closes, 1);
    });
    assert.equal(errors.length, 2);
  } finally {
    console.error = original;
  }
});

test("录音达到限额会保留结果，清理后不再接收回调", () =>
  fixture(async ({ recorder, start, nodes, clips, events }) => {
    await start();
    nodes[0].message({ type: "chunk", buffer: new ArrayBuffer(4) });
    nodes[0].message({ type: "done", limited: true });
    assert.equal(clips[0].limited, true);
    recorder.dispose();
    nodes[0].message({ type: "chunk", buffer: new ArrayBuffer(4) });
    assert.deepEqual(events, ["started", "complete"]);
  }));
