"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RecordedClip } from "./pcm.ts";
import { startMp3Export } from "./mp3-export.ts";

export interface PlaybackClip extends RecordedClip {
  playbackUrl: string;
  pcmUrl: string;
}

export function useAudioClip() {
  const [clip, setClip] = useState<PlaybackClip | null>(null);
  const [mp3, setMp3] = useState<{
    phase: "idle" | "encoding" | "ready" | "error";
    url: string;
  }>({ phase: "idle", url: "" });
  const urls = useRef<string[]>([]);
  const mp3Export = useRef<(() => void) | null>(null);

  const release = useCallback(() => {
    mp3Export.current?.();
    mp3Export.current = null;
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
  }, []);

  useEffect(() => release, [release]);

  const replaceClip = useCallback(
    (next: RecordedClip | null) => {
      release();
      setClip(null);
      setMp3({ phase: "idle", url: "" });
      if (!next) return;
      try {
        const playbackUrl = URL.createObjectURL(next.wav);
        urls.current.push(playbackUrl);
        const pcmUrl = URL.createObjectURL(next.pcm);
        urls.current.push(pcmUrl);
        setClip({ ...next, playbackUrl, pcmUrl });
      } catch (cause) {
        release();
        throw cause;
      }
    },
    [release],
  );

  function createMp3() {
    if (!clip || mp3Export.current) return;
    setMp3({ phase: "encoding", url: "" });
    function fail(cause: unknown) {
      console.error("本机 MP3 导出失败。", cause);
      mp3Export.current = null;
      setMp3({ phase: "error", url: "" });
    }
    mp3Export.current = startMp3Export(clip, {
      complete: (blob) => {
        try {
          const url = URL.createObjectURL(blob);
          urls.current.push(url);
          setMp3({ phase: "ready", url });
        } catch (cause) {
          fail(cause);
        }
      },
      error: fail,
    });
  }

  return { clip, mp3, createMp3, replaceClip };
}
