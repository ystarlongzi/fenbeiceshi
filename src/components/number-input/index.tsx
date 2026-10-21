"use client";
import { localize } from "@/lib/i18n/text";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/icon";
import type { Locale } from "@/features/sound-meter/types";
import { numberIssue, readNumber, stepNumber } from "./model";
import styles from "./index.module.css";

type NumberInputProps = Pick<
  ComponentPropsWithoutRef<"input">,
  | "id"
  | "name"
  | "placeholder"
  | "required"
  | "disabled"
  | "readOnly"
  | "aria-describedby"
  | "aria-invalid"
> & {
  label: string;
  locale: Locale;
  value: string;
  onValueChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  className?: string;
};

export function NumberInput({
  id,
  name,
  label,
  locale,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  suffix,
  placeholder,
  required,
  disabled,
  readOnly,
  className,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
}: NumberInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const bounds = { min, max, step, required };
  const issue = numberIssue(value, bounds);
  const number = readNumber(value);
  const locked = disabled || readOnly;
  const isInvalid = issue !== null || invalid === true || invalid === "true";
  const messages = {
    required: localize(locale, "请输入数值。", "Enter a value.", "請輸入數值。"),
    number: localize(locale, "请输入有效数字。", "Enter a valid number.", "請輸入有效數字。"),
    min: localize(
      locale,
      `请输入不小于 ${min} 的数值。`,
      `Enter ${min} or more.`,
      `請輸入不小於 ${min} 的數值。`,
    ),
    max: localize(
      locale,
      `请输入不大于 ${max} 的数值。`,
      `Enter ${max} or less.`,
      `請輸入不大於 ${max} 的數值。`,
    ),
    step: localize(
      locale,
      `请从 ${min} 起按 ${step} 的步长输入。`,
      `Use steps of ${step}, starting at ${min}.`,
      `請從 ${min} 起按 ${step} 的步長輸入。`,
    ),
  };
  const message = issue ? messages[issue] : isInvalid ? messages.number : "";

  useEffect(() => {
    input.current?.setCustomValidity(locked ? "" : message);
  }, [locked, message]);

  function move(direction: -1 | 1) {
    if (locked) return;
    const next = stepNumber(value, direction, bounds);
    if (next !== value) onValueChange(next);
  }

  return (
    <div
      className={`${styles.control}${className ? ` ${className}` : ""}`}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      <div className={styles.editor}>
        <input
          ref={input}
          id={id}
          name={name}
          type="text"
          role="spinbutton"
          inputMode="decimal"
          value={value}
          maxLength={32}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="off"
          spellCheck={false}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={number ?? undefined}
          aria-valuetext={number === null ? undefined : `${value}${suffix ? ` ${suffix}` : ""}`}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          className={styles.input}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey)
              return;
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              move(event.key === "ArrowUp" ? 1 : -1);
            }
          }}
        />
        {suffix ? (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      <div className={styles.steps}>
        <div className={styles.stepsContent}>
          {([1, -1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={localize(
                locale,
                `${direction > 0 ? "增加" : "减少"}${label}，步长 ${step}`,
                `${direction > 0 ? "Increase" : "Decrease"} ${label} by ${step}`,
                `${direction > 0 ? "增加" : "減少"}${label}，步長 ${step}`,
              )}
              disabled={locked || (issue === null && number === (direction > 0 ? max : min))}
              onPointerDown={(event) => {
                if (event.button === 0) event.preventDefault();
              }}
              onClick={() => move(direction)}
            >
              <Icon
                name="chevron-down"
                size={16}
                className={direction > 0 ? styles.increase : undefined}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
