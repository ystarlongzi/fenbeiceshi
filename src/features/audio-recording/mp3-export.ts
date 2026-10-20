import type { AudioClip } from "./pcm.ts";

export function startMp3Export(
  clip: AudioClip,
  callbacks: { complete: (blob: Blob) => void; error: (cause: unknown) => void },
) {
  let active = true;
  let worker: Worker | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function cancel() {
    if (!active) return;
    active = false;
    worker?.terminate();
    worker = null;
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function fail(cause: unknown) {
    if (!active) return;
    cancel();
    callbacks.error(cause);
  }

  // 先返回取消入口，再读取采样，确保读取期间清除录音也能取消后续编码。
  void Promise.resolve()
    .then(async () => {
      const pcm = await clip.pcm.arrayBuffer();
      if (!active) return;
      worker = new Worker(new URL("./mp3.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (event: MessageEvent<{ blob?: Blob; error?: boolean }>) => {
        if (!active) return;
        const blob = event.data?.blob;
        if (!(blob instanceof Blob) || !blob.size || event.data?.error) {
          fail(new Error("编码器没有返回有效 MP3。"));
          return;
        }
        cancel();
        callbacks.complete(blob);
      };
      worker.onerror = (event) => fail(new Error(event.message));
      worker.onmessageerror = () => fail(new Error("无法读取 MP3 编码结果。"));
      timer = setTimeout(() => fail(new Error("MP3 编码超时。")), 120000);
      worker.postMessage({ pcm, sampleRate: clip.sampleRate }, [pcm]);
    })
    .catch(fail);

  return cancel;
}
