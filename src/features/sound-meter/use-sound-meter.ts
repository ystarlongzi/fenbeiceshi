"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  appliedAdjustment,
  editAdjustment,
  EMPTY_ADJUSTMENT,
  type AdjustmentState,
} from "../calibration/adjustment.ts";
import { useAudioRecording } from "../audio-recording/use-audio-recording.ts";
import { CaptureSession } from "./capture.ts";
import { addWindow, emptyStats } from "./level.ts";
import { DEFAULT_ESTIMATE } from "./readings.ts";
import type { InputInfo, Measurement, MeterFrame, MeterStatus, StopReason } from "./types.ts";
import type { MeterCopy } from "./copy.ts";

export function useSoundMeter() {
  const recording = useAudioRecording();
  const [status, setStatus] = useState<MeterStatus>("idle");
  const [frame, setFrame] = useState<MeterFrame | null>(null);
  const [input, setInput] = useState<InputInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [adjustment, setAdjustment] = useState(EMPTY_ADJUSTMENT);
  const [result, setResult] = useState<Measurement | null>(null);
  const [message, setMessage] = useState<keyof MeterCopy | null>(null);
  const [note, setNoteState] = useState("");
  const engine = useRef<CaptureSession | null>(null);
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const latest = useRef<MeterFrame | null>(null);
  const inputRef = useRef<InputInfo | null>(null);
  const adjustmentRef = useRef(EMPTY_ADJUSTMENT);
  const noteRef = useRef("");
  const startedAt = useRef("");

  const stop = useCallback((reason: StopReason = "user") => {
    if (demoTimer.current) {
      clearInterval(demoTimer.current);
      demoTimer.current = null;
      latest.current = null;
      setFrame(null);
      setStatus("idle");
      return;
    }
    engine.current?.stop(reason);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) stop("hidden");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      const current = engine.current;
      engine.current = null;
      current?.stop("cancelled");
      if (demoTimer.current) clearInterval(demoTimer.current);
    };
  }, [stop]);

  async function start() {
    if (engine.current || demoTimer.current || recording.phase === "finishing") return;
    // 不安全环境交给采集流程提示，避免提前调用受安全上下文限制的 randomUUID。
    const measurementId = window.isSecureContext ? crypto.randomUUID() : "";
    setFrame(null);
    setInput(null);
    setResult(null);
    noteRef.current = "";
    setNoteState("");
    setMessage(null);
    setStatus("requesting");
    latest.current = null;
    const current = new CaptureSession(
      {
        ready: (info) => {
          if (engine.current !== current) return;
          if (inputRef.current && inputRef.current.signature !== info.signature) {
            if (adjustmentRef.current.enabled) setMessage("inputChanged");
            updateAdjustment(EMPTY_ADJUSTMENT);
          }
          inputRef.current = info;
          setInput(info);
          startedAt.current = new Date().toISOString();
          setStatus("running");
          void navigator.mediaDevices
            .enumerateDevices()
            .then((items) => {
              if (engine.current === current)
                setDevices(items.filter((item) => item.kind === "audioinput"));
            })
            .catch(() => {
              if (engine.current === current) setMessage("deviceListFailed");
            });
        },
        frame: (next) => {
          if (engine.current !== current) return;
          latest.current = next;
          setFrame(next);
        },
        end: (reason) => {
          if (engine.current !== current) return;
          engine.current = null;
          const last = latest.current;
          if (!last?.stats.count || !inputRef.current) {
            setStatus("idle");
            if (reason !== "cancelled") setMessage("noInput");
            return;
          }
          setResult({
            id: measurementId,
            startedAt: startedAt.current,
            duration: last.elapsed,
            stats: last.stats,
            points: last.points,
            input: inputRef.current,
            calibration: null,
            estimate: DEFAULT_ESTIMATE,
            adjustment: appliedAdjustment(adjustmentRef.current),
            note: noteRef.current,
            reason,
          });
          setStatus("finished");
          if (reason === "hidden") setMessage("hidden");
          if (reason === "device-ended") setMessage("deviceEnded");
        },
      },
      recording.createCapture(measurementId),
    );
    engine.current = current;
    try {
      await current.start(deviceId);
    } catch (error) {
      if (engine.current !== current) return;
      engine.current = null;
      current.stop("cancelled");
      const name = error instanceof Error ? error.name : "";
      const codes: Record<string, keyof MeterCopy> = {
        NotAllowedError: "denied",
        NotFoundError: "noDevice",
        OverconstrainedError: "noDevice",
        NotReadableError: "busy",
        NotSupportedError: "unsupported",
        SecurityError: "unsupported",
      };
      setMessage(codes[name] || "unknownError");
      setStatus("error");
    }
  }

  function preview() {
    if (engine.current || demoTimer.current || recording.phase === "finishing") return;
    setResult(null);
    setMessage(null);
    setInput(null);
    setStatus("demo");
    updateAdjustment(EMPTY_ADJUSTMENT);
    let stats = emptyStats();
    const began = performance.now();
    const update = () => {
      const elapsed = performance.now() - began;
      const value = -45 + Math.sin(elapsed / 2100) * 7 + Math.sin(elapsed / 430) * 2;
      stats = addWindow(stats, 10 ** (value / 10));
      const previous = latest.current?.points || [];
      const points = [
        ...previous.filter((point) => point.time > elapsed - 60000),
        { time: elapsed, value },
      ].slice(-480);
      const next = { value, elapsed, stats, points, clipped: false };
      latest.current = next;
      setFrame(next);
    };
    latest.current = null;
    update();
    demoTimer.current = setInterval(update, 125);
  }

  function updateAdjustment(next: AdjustmentState) {
    adjustmentRef.current = next;
    setAdjustment(next);
  }
  function enableAdjustment(enabled: boolean) {
    updateAdjustment({ ...EMPTY_ADJUSTMENT, enabled });
  }
  function setAdjustmentDraft(draft: string) {
    updateAdjustment(editAdjustment(adjustmentRef.current, draft));
  }
  function changeDevice(next: string) {
    setDeviceId(next);
    updateAdjustment(EMPTY_ADJUSTMENT);
  }
  function setNote(next: string) {
    const bounded = next.slice(0, 120);
    noteRef.current = bounded;
    setNoteState(bounded);
  }

  return {
    recording,
    status,
    frame,
    input,
    devices,
    deviceId,
    adjustment,
    result,
    message,
    note,
    start,
    stop,
    preview,
    enableAdjustment,
    setAdjustmentDraft,
    changeDevice,
    setNote,
    setMessage,
  };
}
