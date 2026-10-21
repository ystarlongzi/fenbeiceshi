"use client";

import { useEffect, useState } from "react";
import { useAudioClip } from "../audio-recording/use-audio-clip";
import type { RecordingInfo } from "../audio-recording/pcm";
import { readRecording } from "./recording-storage";

export function useStoredRecording(id: string, info?: RecordingInfo) {
  const audio = useAudioClip();
  const { replaceClip } = audio;
  const [loaded, setLoaded] = useState<{
    key: string;
    status: "ready" | "missing" | "error";
  } | null>(null);
  const rate = info?.sampleRate;
  const frames = info?.frames;
  const key = info ? JSON.stringify([id, rate, frames]) : "";
  const status = !key ? "idle" : loaded?.key === key ? loaded.status : "loading";

  useEffect(() => {
    if (rate === undefined || frames === undefined) return;
    let cancelled = false;
    readRecording(id, { version: 1, sampleRate: rate, frames })
      .then((clip) => {
        if (cancelled) return;
        replaceClip(clip);
        setLoaded({ key, status: clip ? "ready" : "missing" });
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        console.error("读取报告录音失败。", cause);
        setLoaded({ key, status: "error" });
      });
    return () => {
      cancelled = true;
      replaceClip(null);
    };
  }, [id, rate, frames, key, replaceClip]);

  return { ...audio, clip: status === "ready" ? audio.clip : null, status };
}
