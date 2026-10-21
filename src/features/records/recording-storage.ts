import {
  restoreClip,
  validRecordingInfo,
  type RecordedClip,
  type RecordingInfo,
} from "../audio-recording/pcm.ts";

export const RECORDING_DB = "fenbeiceshi:recordings:v1";
export const RECORDING_STORE = "clips";
export const MAX_STORED_AUDIO_BYTES = 200 * 1024 * 1024;
const STORAGE_TIMEOUT = 15000;

export class RecordingStorageError extends Error {
  readonly code: "audioUnavailable" | "audioFull" | "audioQuota" | "audioCorrupt";
  readonly stage: "open" | "transaction";
  constructor(
    code: RecordingStorageError["code"],
    options?: ErrorOptions,
    stage: RecordingStorageError["stage"] = "transaction",
  ) {
    super(`本机录音存储失败：${code}`, options);
    this.code = code;
    this.stage = stage;
  }
}

interface StoredRecording extends Omit<RecordedClip, "wav"> {
  version: 1;
}

export interface RecordingChange {
  recordIds: string[];
  clip?: RecordedClip;
  // localStorage 与 IndexedDB 没有共享事务，提交报告后保留有条件回退的入口。
  commit: () => () => void;
}

function storageError(cause: unknown) {
  if (cause instanceof RecordingStorageError) return cause;
  const quota = cause instanceof DOMException && cause.name === "QuotaExceededError";
  return new RecordingStorageError(quota ? "audioQuota" : "audioUnavailable", { cause });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let expired = false;
    const fail = (cause: unknown) => {
      expired = true;
      clearTimeout(timer);
      reject(new RecordingStorageError("audioUnavailable", { cause }, "open"));
    };
    const timer = setTimeout(() => fail(new Error("打开录音数据库超时。")), STORAGE_TIMEOUT);
    try {
      const request = indexedDB.open(RECORDING_DB, 1);
      request.onupgradeneeded = () => {
        if (expired) {
          request.transaction?.abort();
          return;
        }
        request.result.createObjectStore(RECORDING_STORE, { keyPath: "measurementId" });
      };
      request.onblocked = () => fail(new Error("录音数据库升级被其他页面阻塞。"));
      request.onerror = () => fail(request.error);
      request.onsuccess = () => {
        clearTimeout(timer);
        const db = request.result;
        if (expired) db.close();
        else {
          db.onversionchange = () => db.close();
          resolve(db);
        }
      };
    } catch (cause) {
      fail(cause);
    }
  });
}

function restoreStored(value: unknown, id: string): RecordedClip {
  try {
    const stored = value as StoredRecording;
    if (!stored || stored.version !== 1 || stored.measurementId !== id)
      throw new RangeError("录音版本或报告关联无效。");
    return { ...restoreClip(stored), measurementId: id };
  } catch (cause) {
    throw new RecordingStorageError("audioCorrupt", { cause });
  }
}

export async function readRecording(
  id: string,
  expected: RecordingInfo,
): Promise<RecordedClip | null> {
  if (!id || id.length > 100 || !validRecordingInfo(expected))
    throw new RecordingStorageError("audioCorrupt");
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(RECORDING_STORE, "readonly");
      const request = tx.objectStore(RECORDING_STORE).get(id);
      const timer = setTimeout(() => tx.abort(), STORAGE_TIMEOUT);
      tx.onabort = () => {
        clearTimeout(timer);
        reject(storageError(tx.error));
      };
      tx.oncomplete = () => {
        clearTimeout(timer);
        try {
          if (request.result === undefined) return resolve(null);
          const clip = restoreStored(request.result, id);
          if (clip.frames !== expected.frames || clip.sampleRate !== expected.sampleRate)
            throw new RecordingStorageError("audioCorrupt");
          resolve(clip);
        } catch (cause) {
          reject(storageError(cause));
        }
      };
    });
  } finally {
    db.close();
  }
}

export async function changeRecordings(createChange: () => RecordingChange): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(RECORDING_STORE, "readwrite");
      const store = tx.objectStore(RECORDING_STORE);
      let failure: unknown;
      let rollback: (() => void) | undefined;
      const timer = setTimeout(() => {
        failure = new Error("保存或清理录音超时。");
        tx.abort();
      }, STORAGE_TIMEOUT);
      tx.onabort = () => {
        clearTimeout(timer);
        try {
          rollback?.();
        } catch (cause) {
          console.error("录音事务失败后，报告回退失败；保留当前数据供后续核对。", cause);
        }
        reject(failure ?? storageError(tx.error));
      };
      tx.oncomplete = () => {
        clearTimeout(timer);
        resolve();
      };

      // 同一个读写事务串行处理容量、写入和清理，避免多标签页同时保存超出上限。
      const request = store.getAll();
      request.onsuccess = () => {
        try {
          const change = createChange();
          const retained = new Set(change.recordIds);
          const clip = change.clip;
          let bytes = clip?.pcm.size ?? 0;
          for (const value of request.result as StoredRecording[]) {
            if (!retained.has(value.measurementId)) store.delete(value.measurementId);
            else if (value.measurementId !== clip?.measurementId)
              bytes += restoreStored(value, value.measurementId).pcm.size;
          }
          if (bytes > MAX_STORED_AUDIO_BYTES) throw new RecordingStorageError("audioFull");
          if (clip) {
            const { pcm, sampleRate, frames, startedAt, limited, interrupted, measurementId } =
              clip;
            restoreClip(clip);
            store.put({
              version: 1,
              measurementId,
              pcm,
              sampleRate,
              frames,
              startedAt,
              limited,
              interrupted,
            } satisfies StoredRecording);
          }
          // 等所有 Blob 写入与删除请求成功后再写摘要；任何失败均中止音频事务。
          store.count().onsuccess = () => {
            try {
              rollback = change.commit();
            } catch (cause) {
              failure = cause;
              tx.abort();
            }
          };
        } catch (cause) {
          failure = cause instanceof DOMException ? storageError(cause) : cause;
          tx.abort();
        }
      };
    });
  } finally {
    db.close();
  }
}
