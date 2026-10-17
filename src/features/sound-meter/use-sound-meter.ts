"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { activeCalibration, makeCalibration } from "../calibration/calibration.ts";
import { CaptureSession } from "./capture.ts";
import { addWindow, emptyStats } from "./level.ts";
import type {
  Calibration,
  InputInfo,
  Measurement,
  MeterFrame,
  MeterStatus,
  StopReason,
} from "./types.ts";
import type { MeterCopy } from "./copy.ts";

export function useSoundMeter() {
  const [status, setStatus] = useState<MeterStatus>("idle");
  const [frame, setFrame] = useState<MeterFrame | null>(null);
  const [input, setInput] = useState<InputInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [result, setResult] = useState<Measurement | null>(null);
  const [message, setMessage] = useState<keyof MeterCopy | null>(null);
  const [note, setNoteState] = useState("");
  const engine = useRef<CaptureSession | null>(null);
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const latest = useRef<MeterFrame | null>(null);
  const inputRef = useRef<InputInfo | null>(null);
  const reference = useRef<Calibration | null>(null);
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
    if (engine.current || demoTimer.current) return;
    setFrame(null);
    setInput(null);
    setResult(null);
    setMessage(null);
    setStatus("requesting");
    latest.current = null;
    const current = new CaptureSession({
      ready: (info) => {
        if (engine.current !== current) return;
        inputRef.current = info;
        setInput(info);
        startedAt.current = new Date().toISOString();
        const matching = activeCalibration(reference.current, info.signature);
        if (reference.current && !matching) setMessage("inputChanged");
        reference.current = matching;
        setCalibration(matching);
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
          id: crypto.randomUUID(),
          startedAt: startedAt.current,
          duration: last.elapsed,
          stats: last.stats,
          points: last.points,
          input: inputRef.current,
          calibration: activeCalibration(reference.current, inputRef.current.signature),
          note: noteRef.current,
          reason,
        });
        setStatus("finished");
        if (reason === "hidden") setMessage("hidden");
        if (reason === "device-ended") setMessage("deviceEnded");
      },
    });
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
    if (engine.current || demoTimer.current) return;
    setResult(null);
    setMessage(null);
    setInput(null);
    setStatus("demo");
    reference.current = null;
    setCalibration(null);
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

  function calibrate(value: number, source: string) {
    if (!engine.current || !latest.current || latest.current.clipped || !inputRef.current)
      return false;
    try {
      const saved = makeCalibration(
        latest.current.value,
        value,
        source,
        inputRef.current.signature,
      );
      reference.current = saved;
      setCalibration(saved);
      setMessage(null);
      return true;
    } catch {
      setMessage("referenceError");
      return false;
    }
  }

  function clearCalibration() {
    reference.current = null;
    setCalibration(null);
  }
  function changeDevice(next: string) {
    setDeviceId(next);
    clearCalibration();
  }
  function setNote(next: string) {
    noteRef.current = next;
    setNoteState(next);
  }

  return {
    status,
    frame,
    input,
    devices,
    deviceId,
    calibration,
    result,
    message,
    note,
    start,
    stop,
    preview,
    calibrate,
    clearCalibration,
    changeDevice,
    setNote,
    setMessage,
  };
}
