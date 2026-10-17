export type Locale = "zh-CN" | "en";
export type MeterView = "gauge" | "digital" | "bars";
export type MeterStatus = "idle" | "requesting" | "running" | "demo" | "finished" | "error";
export type StopReason = "user" | "hidden" | "device-ended" | "cancelled";

export interface LevelPoint {
  time: number;
  value: number;
}

export interface LevelStats {
  count: number;
  energy: number;
  min: number;
  max: number;
}

export interface Calibration {
  offset: number;
  reference: number;
  source: string;
  signature: string;
  createdAt: string;
}

export interface MeterFrame {
  value: number;
  elapsed: number;
  stats: LevelStats;
  points: LevelPoint[];
  clipped: boolean;
}

export interface InputInfo {
  label: string;
  signature: string;
  processing: boolean;
}

export interface Measurement {
  id: string;
  startedAt: string;
  duration: number;
  stats: LevelStats;
  points: LevelPoint[];
  input: InputInfo;
  calibration: Calibration | null;
  estimate?: EstimateModel;
  note: string;
  reason: StopReason;
}

export interface EstimateModel {
  id: "generic-rms-v1";
  offset: 100;
}
