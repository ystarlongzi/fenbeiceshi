export type IconName =
  | "audio-lines"
  | "book-open"
  | "sliders-horizontal"
  | "mic"
  | "timer"
  | "house"
  | "chevron-down"
  | "arrow-down"
  | "arrow-up"
  | "play"
  | "pause"
  | "square"
  | "shield-check"
  | "chart-line"
  | "save"
  | "rotate-ccw"
  | "arrow-left"
  | "circle-check"
  | "maximize-2"
  | "minimize-2"
  | "download"
  | "trash"
  | "arrow-right"
  | "circle-alert"
  | "x"
  | "external-link";

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}
