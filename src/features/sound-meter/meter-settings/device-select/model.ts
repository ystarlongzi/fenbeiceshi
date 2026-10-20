export type DeviceOption = { value: string; label: string };

export function deviceOptions(
  devices: ReadonlyArray<Pick<MediaDeviceInfo, "deviceId" | "label">>,
  defaultLabel: string,
  fallbackLabel: string,
): DeviceOption[] {
  const options = [{ value: "", label: defaultLabel }];
  const seen = new Set(["", "default"]);
  for (const device of devices) {
    if (seen.has(device.deviceId)) continue;
    seen.add(device.deviceId);
    options.push({
      value: device.deviceId,
      label: device.label.trim() || `${fallbackLabel} ${options.length}`,
    });
  }
  return options;
}

export function moveOption(key: string, index: number, count: number): number | null {
  if (count < 1) return null;
  switch (key) {
    case "ArrowDown":
      return (index + 1) % count;
    case "ArrowUp":
      return (index + count - 1) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}
