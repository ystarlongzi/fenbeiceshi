import assert from "node:assert/strict";
import test from "node:test";
import { setImmediate } from "node:timers/promises";
import { startMp3Export } from "./mp3-export.ts";
import { createClip, type AudioClip } from "./pcm.ts";

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: (() => void) | null = null;
  stopped = 0;
  message: unknown;
  transfer: Transferable[] = [];
  postMessage(message: unknown, transfer: Transferable[]) {
    this.message = message;
    this.transfer = transfer;
  }
  terminate() {
    this.stopped += 1;
  }
  reply(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

async function fixture(
  run: (f: {
    clip: AudioClip;
    workers: FakeWorker[];
    clips: Blob[];
    errors: unknown[];
    start: (clip?: AudioClip) => () => void;
    timeout: () => void;
    cleared: number[];
  }) => Promise<void>,
  setupError?: Error,
) {
  const keys = ["Worker", "setTimeout", "clearTimeout"];
  const originals = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const workers: FakeWorker[] = [];
  const clips: Blob[] = [];
  const errors: unknown[] = [];
  const jobs: (() => void)[] = [];
  const cleared: number[] = [];
  let timeout = () => {};
  const clip = createClip(
    [new Uint8Array([1, 0, 255, 127]).buffer],
    48000,
    new Date().toISOString(),
  );
  class Worker extends FakeWorker {
    constructor() {
      super();
      if (setupError) throw setupError;
      workers.push(this);
    }
  }
  const values = [
    Worker,
    (callback: () => void, delay: number) => {
      assert.equal(delay, 120000);
      timeout = callback;
      return 1;
    },
    (id: number) => cleared.push(id),
  ];
  keys.forEach((key, i) =>
    Object.defineProperty(globalThis, key, { configurable: true, value: values[i] }),
  );
  try {
    await run({
      clip,
      workers,
      clips,
      errors,
      start: (source = clip) => {
        const cancel = startMp3Export(source, {
          complete: (blob) => clips.push(blob),
          error: (cause) => errors.push(cause),
        });
        jobs.push(cancel);
        return cancel;
      },
      timeout: () => timeout(),
      cleared,
    });
  } finally {
    jobs.forEach((cancel) => cancel());
    keys.forEach((key, i) => {
      if (originals[i]) Object.defineProperty(globalThis, key, originals[i]!);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

test("MP3 传递原始 PCM 和采样率，完成后释放任务并忽略迟到回调", () =>
  fixture(async ({ start, workers, clips, errors, cleared }) => {
    const cancel = start();
    await setImmediate();
    const worker = workers[0];
    const message = worker.message as { pcm: ArrayBuffer; sampleRate: number };
    assert.equal(message.sampleRate, 48000);
    assert.deepEqual(new Uint8Array(message.pcm), new Uint8Array([1, 0, 255, 127]));
    assert.deepEqual(worker.transfer, [message.pcm]);
    const mp3 = new Blob([new Uint8Array([255, 251])], { type: "audio/mpeg" });
    worker.reply({ blob: mp3 });
    worker.reply({ error: true });
    worker.onerror?.({ message: "late failure" } as ErrorEvent);
    cancel();
    assert.deepEqual(clips, [mp3]);
    assert.deepEqual(errors, []);
    assert.equal(worker.stopped, 1);
    assert.deepEqual(cleared, [1]);
  }));

test("MP3 空文件、错误回复和无效消息均失败，不暴露虚假下载", async () => {
  for (const reply of [undefined, {}, { blob: new Blob() }, { error: true }]) {
    await fixture(async ({ start, workers, clips, errors }) => {
      start();
      await setImmediate();
      workers[0].reply(reply);
      assert.equal(clips.length, 0);
      assert.equal(errors.length, 1);
      assert.equal(workers[0].stopped, 1);
    });
  }
});

test("MP3 编码器故障、消息失败和超时均清理 Worker，保留失败上下文", async () => {
  for (const kind of ["error", "message", "timeout"]) {
    await fixture(async ({ start, workers, errors, timeout, cleared }) => {
      start();
      await setImmediate();
      const worker = workers[0];
      if (kind === "error") worker.onerror?.({ message: "QA worker error" } as ErrorEvent);
      else if (kind === "message") worker.onmessageerror?.();
      else timeout();
      worker.reply({ blob: new Blob(["late"]) });
      assert.equal(errors.length, 1);
      assert.ok(errors[0] instanceof Error);
      if (kind === "error") assert.match(errors[0].message, /QA worker error/);
      assert.equal(worker.stopped, 1);
      assert.deepEqual(cleared, [1]);
    });
  }
});

test("MP3 读取和创建 Worker 失败时回报原始错误", async () => {
  const cause = new Error("QA setup failure");
  await fixture(async ({ start, errors }) => {
    start();
    await setImmediate();
    assert.deepEqual(errors, [cause]);
  }, cause);
  await fixture(async ({ clip, start, workers, errors }) => {
    clip.pcm.arrayBuffer = async () => {
      throw cause;
    };
    start(clip);
    await setImmediate();
    assert.equal(workers.length, 0);
    assert.deepEqual(errors, [cause]);
  });
});

test("MP3 读取 PCM 期间清除录音，不启动后续编码", () =>
  fixture(async ({ clip, start, workers, clips, errors }) => {
    let resolve!: (pcm: ArrayBuffer) => void;
    clip.pcm.arrayBuffer = () => new Promise((done) => (resolve = done));
    const cancel = start(clip);
    await setImmediate();
    cancel();
    resolve(new ArrayBuffer(4));
    await setImmediate();
    assert.equal(workers.length, 0);
    assert.deepEqual(clips, []);
    assert.deepEqual(errors, []);
  }));

test("MP3 编码期间清除录音，取消幂等且不接收结果", () =>
  fixture(async ({ start, workers, clips, errors, cleared }) => {
    const cancel = start();
    await setImmediate();
    cancel();
    cancel();
    workers[0].reply({ blob: new Blob(["late"]) });
    workers[0].onmessageerror?.();
    assert.equal(workers[0].stopped, 1);
    assert.deepEqual(clips, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(cleared, [1]);
  }));
