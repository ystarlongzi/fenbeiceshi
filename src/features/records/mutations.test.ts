import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { IDBFactory, IDBDatabase, IDBObjectStore } from "fake-indexeddb";
import { createClip, restoreClip, type RecordedClip } from "../audio-recording/pcm.ts";
import type { Measurement } from "../sound-meter/types.ts";
import { deleteRecord, saveRecord } from "./mutations.ts";
import { getRecords, RECORD_KEY, validMeasurement } from "./storage.ts";
import {
  MAX_STORED_AUDIO_BYTES,
  readRecording,
  RECORDING_DB,
  RECORDING_STORE,
} from "./recording-storage.ts";

const time = "2026-10-21T00:00:00.000Z";
const sample: Measurement = {
  id: "report",
  startedAt: time,
  duration: 10000,
  stats: { count: 2, energy: 0.0002, min: -40, max: -40 },
  points: [{ time: 1000, value: -40 }],
  input: { label: "Test input", signature: "test-input", processing: false },
  calibration: null,
  note: "",
  reason: "user",
};

function fixture(t: TestContext) {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  const overrides = {
    window: new EventTarget(),
    indexedDB: new IDBFactory(),
    localStorage: storage,
  };
  for (const [key, value] of Object.entries(overrides)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  t.mock.method(console, "error", () => {});
  return storage;
}

function recording(id: string, bytes = 8): RecordedClip {
  return {
    ...createClip([new Uint8Array(bytes).fill(12).buffer], 32000, time, true, true),
    measurementId: id,
  };
}

async function savedAudio(id: string) {
  const info = getRecords().records.find((record) => record.id === id)?.recording;
  assert.ok(info);
  return readRecording(id, info);
}

async function audioKeys(): Promise<IDBValidKey[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(RECORDING_DB, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(RECORDING_STORE);
      const keys = tx.objectStore(RECORDING_STORE).getAllKeys();
      tx.oncomplete = () => {
        db.close();
        resolve(keys.result);
      };
      tx.onabort = () => {
        db.close();
        reject(tx.error);
      };
    };
  });
}

test("旧摘要保持原口径，录音按报告 ID 保留 PCM、实际采样率和中断标记", async (t) => {
  const storage = fixture(t);
  storage.setItem(RECORD_KEY, JSON.stringify({ version: 1, records: [{ ...sample, id: "old" }] }));
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  assert.equal(getRecords().records.length, 2);
  assert.equal(getRecords().records[1].recording, undefined);
  assert.equal(getRecords().records[1].estimate, undefined);
  const clip = await savedAudio(sample.id);
  assert.ok(clip);
  assert.equal(clip.sampleRate, 32000);
  assert.equal(clip.frames, 4);
  assert.equal(clip.limited, true);
  assert.equal(clip.interrupted, true);
  assert.deepEqual(new Uint8Array(await clip.pcm.arrayBuffer()), new Uint8Array(8).fill(12));
  assert.equal(new DataView(await clip.wav.arrayBuffer()).getUint32(24, true), 32000);
  assert.equal(await saveRecord({ ...sample, note: "更新备注" }), null);
  assert.equal((await savedAudio(sample.id))?.pcm.size, 8);
  assert.equal(await saveRecord(sample, recording(sample.id, 16)), null);
  assert.equal((await audioKeys()).length, 1);
  assert.equal((await savedAudio(sample.id))?.pcm.size, 16);
});

test("删除与超过 30 条的淘汰会同时清理对应音频，重复删除保持幂等", async (t) => {
  fixture(t);
  for (let index = 0; index < 31; index++) {
    const id = `record-${index}`;
    assert.equal(await saveRecord({ ...sample, id }, recording(id)), null);
  }
  assert.equal(getRecords().records.length, 30);
  assert.equal((await audioKeys()).length, 30);
  assert.equal((await audioKeys()).includes("record-0"), false);
  assert.equal(await deleteRecord("record-1"), null);
  assert.equal(await deleteRecord("record-1"), null);
  assert.equal((await audioKeys()).length, 29);
  assert.equal(
    getRecords().records.some((record) => record.id === "record-1"),
    false,
  );
});

test("总量恰好 200 MiB 可保存，超额不改报告；淘汰音频释放预算，仍可只存数据", async (t) => {
  const storage = fixture(t);
  const mib = new Blob([new Uint8Array(1024 * 1024)]);
  const pcm = new Blob(Array(50).fill(mib));
  const clip = restoreClip({
    pcm,
    sampleRate: 192000,
    frames: pcm.size / 2,
    startedAt: time,
    limited: false,
    interrupted: false,
  });
  for (let index = 0; index < 4; index++) {
    const id = `large-${index}`;
    assert.equal(await saveRecord({ ...sample, id }, { ...clip, measurementId: id }), null);
  }
  assert.equal(pcm.size * 4, MAX_STORED_AUDIO_BYTES);
  const before = storage.getItem(RECORD_KEY);
  assert.equal(await saveRecord(sample, recording(sample.id)), "audioFull");
  assert.equal(storage.getItem(RECORD_KEY), before);
  assert.equal((await audioKeys()).length, 4);
  for (let index = 0; index < 26; index++)
    assert.equal(await saveRecord({ ...sample, id: `data-${index}` }), null);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  assert.equal((await audioKeys()).includes("large-0"), false);
  assert.equal((await audioKeys()).length, 4);
});

test("摘要配额失败会回退新增、替换和删除音频，保留原报告", async (t) => {
  const storage = fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  const before = storage.getItem(RECORD_KEY);
  const mock = t.mock.method(storage, "setItem", () => {
    throw new DOMException("模拟摘要空间不足", "QuotaExceededError");
  });
  assert.equal(await saveRecord(sample, recording(sample.id, 16)), "saveError");
  assert.equal(await saveRecord({ ...sample, id: "new" }, recording("new")), "saveError");
  assert.equal(await deleteRecord(sample.id), "saveError");
  mock.mock.restore();
  assert.equal(storage.getItem(RECORD_KEY), before);
  assert.equal((await savedAudio(sample.id))?.pcm.size, 8);
  assert.deepEqual(await audioKeys(), [sample.id]);
});

test("IndexedDB 配额失败不会提前写入摘要，原始录音保留以供下载", async (t) => {
  const storage = fixture(t);
  const clip = recording(sample.id);
  const mock = t.mock.method(IDBObjectStore.prototype, "put", () => {
    throw new DOMException("模拟录音空间不足", "QuotaExceededError");
  });
  assert.equal(await saveRecord(sample, clip), "audioQuota");
  assert.equal(storage.getItem(RECORD_KEY), null);
  assert.equal(clip.pcm.size, 8);
  mock.mock.restore();
  assert.deepEqual(await audioKeys(), []);
});

test("摘要写入后的事务中止也会回退摘要", async (t) => {
  const storage = fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  const before = storage.getItem(RECORD_KEY);
  let active: ReturnType<IDBDatabase["transaction"]> | undefined;
  const originalTx = IDBDatabase.prototype.transaction;
  t.mock.method(
    IDBDatabase.prototype,
    "transaction",
    function (this: IDBDatabase, ...args: Parameters<typeof originalTx>) {
      const tx = originalTx.apply(this, args);
      if (args[1] === "readwrite") active = tx;
      return tx;
    },
  );
  const originalWrite = storage.setItem;
  let abort = true;
  const mock = t.mock.method(storage, "setItem", (key: string, value: string) => {
    originalWrite(key, value);
    if (abort) {
      abort = false;
      active?.abort();
    }
  });
  assert.equal(
    await saveRecord({ ...sample, id: "aborted" }, recording("aborted")),
    "audioUnavailable",
  );
  assert.equal(storage.getItem(RECORD_KEY), before);
  assert.deepEqual(await audioKeys(), [sample.id]);
  mock.mock.restore();
});

test("回退不会覆盖另一页面已经写入的新摘要", async (t) => {
  const storage = fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  const external = JSON.stringify({
    version: 2,
    records: [{ ...sample, id: "external" }, ...getRecords().records],
  });
  let active: ReturnType<IDBDatabase["transaction"]> | undefined;
  const originalTx = IDBDatabase.prototype.transaction;
  t.mock.method(
    IDBDatabase.prototype,
    "transaction",
    function (this: IDBDatabase, ...args: Parameters<typeof originalTx>) {
      const tx = originalTx.apply(this, args);
      if (args[1] === "readwrite") active = tx;
      return tx;
    },
  );
  const originalWrite = storage.setItem;
  t.mock.method(storage, "setItem", (key: string) => {
    originalWrite(key, external);
    active?.abort();
  });
  assert.equal(
    await saveRecord({ ...sample, id: "aborted" }, recording("aborted")),
    "audioUnavailable",
  );
  assert.equal(storage.getItem(RECORD_KEY), external);
  assert.deepEqual(await audioKeys(), [sample.id]);
});

test("IndexedDB 不可用时可保存纯数据，但不假装完成录音保存或音频清理", async (t) => {
  fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  const factory = indexedDB;
  const mock = t.mock.method(factory, "open", () => {
    throw new DOMException("模拟关闭 IndexedDB", "SecurityError");
  });
  assert.equal(await saveRecord({ ...sample, id: "data-only" }), null);
  assert.equal(await saveRecord({ ...sample, note: "仅修改备注" }), null);
  assert.equal(
    await saveRecord({ ...sample, id: "new-audio" }, recording("new-audio")),
    "audioUnavailable",
  );
  assert.equal(await deleteRecord(sample.id), "audioUnavailable");
  assert.equal(await deleteRecord("data-only"), null);
  mock.mock.restore();
  assert.deepEqual(await audioKeys(), [sample.id]);
});

test("并发写入在读写事务内串行合并，不丢记录，音频与保留的 30 条完全对应", async (t) => {
  fixture(t);
  const errors = await Promise.all(
    Array.from({ length: 35 }, (_, index) => {
      const id = `parallel-${index}`;
      return saveRecord({ ...sample, id }, recording(id));
    }),
  );
  assert.ok(errors.every((error) => error === null));
  const ids = getRecords()
    .records.map((record) => record.id)
    .sort();
  assert.equal(ids.length, 30);
  assert.deepEqual(await audioKeys(), ids);
});

test("损坏摘要、伪造音频标记和错配录音不能覆盖已有数据", async (t) => {
  const storage = fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  const before = storage.getItem(RECORD_KEY);
  storage.setItem(RECORD_KEY, "broken");
  assert.equal(await deleteRecord(sample.id), "corrupt");
  assert.equal(storage.getItem(RECORD_KEY), "broken");
  storage.setItem(RECORD_KEY, before!);
  assert.equal(await saveRecord(sample, recording("wrong-id")), "saveError");
  assert.equal(
    validMeasurement({ ...sample, recording: { version: 1, sampleRate: 0, frames: 4 } }),
    false,
  );
  assert.equal(
    await saveRecord({
      ...sample,
      id: "forged",
      recording: { version: 1, sampleRate: 32000, frames: 4 },
    }),
    null,
  );
  assert.equal(getRecords().records[0].recording, undefined);
  assert.deepEqual(await audioKeys(), [sample.id]);
});

test("音频被清理时返回缺失，损坏或参数错配明确失败；报告数据仍然保留", async (t) => {
  fixture(t);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  await assert.rejects(readRecording(sample.id, { version: 1, sampleRate: 48000, frames: 4 }), {
    code: "audioCorrupt",
  });
  async function changeAudio(change: (store: IDBObjectStore) => void) {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(RECORDING_DB, 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(RECORDING_STORE, "readwrite");
        change(tx.objectStore(RECORDING_STORE));
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onabort = () => {
          db.close();
          reject(tx.error);
        };
      };
      request.onerror = () => reject(request.error);
    });
  }
  await changeAudio((store) => {
    store.delete(sample.id);
  });
  assert.equal(await savedAudio(sample.id), null);
  assert.equal(await saveRecord(sample, recording(sample.id)), null);
  await changeAudio((store) => {
    store.put({ ...recording(sample.id), version: 1, pcm: new Blob([new Uint8Array(2)]) });
  });
  await assert.rejects(savedAudio(sample.id), { code: "audioCorrupt" });
  assert.equal(getRecords().records.length, 1);
});
