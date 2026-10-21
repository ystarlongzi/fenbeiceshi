"use client";

import { useEffect, useRef, useState } from "react";
import { LocalAudioRecorder } from "./recorder.ts";
import { useAudioClip } from "./use-audio-clip.ts";

export function useAudioRecording() {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<"idle" | "recording" | "finishing" | "ready" | "error">(
    "idle",
  );
  const audio = useAudioClip();
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const active = useRef<LocalAudioRecorder | null>(null);

  useEffect(
    () => () => {
      active.current?.dispose();
    },
    [],
  );

  function releaseClip() {
    audio.replaceClip(null);
  }

  function createCapture(id: string) {
    if (!enabled) return undefined;
    active.current?.dispose();
    const current = new LocalAudioRecorder({
      started: () => {
        if (active.current !== current) return;
        releaseClip();
        setMeasurementId(id);
        setPhase("recording");
      },
      finishing: () => {
        if (active.current === current) setPhase("finishing");
      },
      complete: (next) => {
        if (active.current !== current) return;
        try {
          audio.replaceClip({ ...next, measurementId: id });
          setPhase("ready");
        } catch (cause) {
          console.error("录音播放资源创建失败。", cause);
          setPhase("error");
        }
      },
      error: () => {
        if (active.current === current) setPhase("error");
      },
    });
    active.current = current;
    return current;
  }

  function clear() {
    active.current?.dispose();
    active.current = null;
    releaseClip();
    setMeasurementId(null);
    setPhase("idle");
  }

  return { ...audio, enabled, setEnabled, phase, measurementId, createCapture, clear };
}
