"use client";

import { useEffect, useRef, useState } from "react";
import { LocalAudioRecorder } from "./recorder.ts";
import type { AudioClip } from "./pcm.ts";
import { startMp3Export } from "./mp3-export.ts";

export interface PlaybackClip extends AudioClip {
  measurementId: string;
  playbackUrl: string;
  pcmUrl: string;
}

export function useAudioRecording() {
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<"idle" | "recording" | "finishing" | "ready" | "error">(
    "idle",
  );
  const [clip, setClip] = useState<PlaybackClip | null>(null);
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const [mp3, setMp3] = useState<{
    phase: "idle" | "encoding" | "ready" | "error";
    url: string;
  }>({ phase: "idle", url: "" });
  const active = useRef<LocalAudioRecorder | null>(null);
  const urls = useRef<string[]>([]);
  const mp3Export = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      active.current?.dispose();
      mp3Export.current?.();
      urls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function releaseClip() {
    mp3Export.current?.();
    mp3Export.current = null;
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
    setClip(null);
    setMp3({ phase: "idle", url: "" });
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
        releaseClip();
        const playbackUrl = URL.createObjectURL(next.wav);
        urls.current.push(playbackUrl);
        const pcmUrl = URL.createObjectURL(next.pcm);
        urls.current.push(pcmUrl);
        setClip({ ...next, measurementId: id, playbackUrl, pcmUrl });
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
    setMeasurementId(null);
    setPhase("idle");
  }

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

  return { enabled, setEnabled, phase, clip, measurementId, mp3, createMp3, createCapture, clear };
}
