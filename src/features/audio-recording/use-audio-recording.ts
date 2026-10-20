"use client";

import { useEffect, useRef, useState } from "react";
import { LocalAudioRecorder } from "./recorder.ts";
import type { AudioClip } from "./pcm.ts";

export interface PlaybackClip extends AudioClip {
  playbackUrl: string;
  pcmUrl: string;
}

export function useAudioRecording() {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<"idle" | "recording" | "finishing" | "ready" | "error">(
    "idle",
  );
  const [clip, setClip] = useState<PlaybackClip | null>(null);
  const active = useRef<LocalAudioRecorder | null>(null);
  const urls = useRef<string[]>([]);

  useEffect(
    () => () => {
      active.current?.dispose();
      urls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function releaseClip() {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
    setClip(null);
  }

  function createCapture() {
    if (!enabled) return undefined;
    active.current?.dispose();
    const current = new LocalAudioRecorder({
      started: () => {
        if (active.current !== current) return;
        releaseClip();
        setPhase("recording");
      },
      finishing: () => {
        if (active.current === current) setPhase("finishing");
      },
      complete: (next) => {
        if (active.current !== current) return;
        releaseClip();
        const playbackUrl = URL.createObjectURL(next.wav);
        urls.current.push(playbackUrl);
        const pcmUrl = URL.createObjectURL(next.pcm);
        urls.current.push(pcmUrl);
        setClip({ ...next, playbackUrl, pcmUrl });
        setPhase("ready");
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
    setPhase("idle");
  }

  return { enabled, setEnabled, phase, clip, createCapture, clear };
}
