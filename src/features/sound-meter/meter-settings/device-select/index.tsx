"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icon";
import { deviceOptions, moveOption } from "./model";
import styles from "./index.module.css";

export function DeviceSelect({
  devices,
  value,
  onChange,
  disabled,
  label,
  defaultLabel,
}: {
  devices: MediaDeviceInfo[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  label: string;
  defaultLabel: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [active, setActive] = useState<number | null>(null);
  const options = deviceOptions(devices, defaultLabel, label);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const open = active !== null && !disabled;
  const highlighted = Math.min(active ?? selected, options.length - 1);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setActive(null);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useEffect(() => {
    if (open)
      document.getElementById(`${id}-option-${highlighted}`)?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted, id]);

  function choose(index: number) {
    const option = options[index];
    if (!option || disabled) return;
    onChange(option.value);
    setActive(null);
    button.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setActive(null);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setActive(null);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(highlighted);
      else setActive(selected);
      return;
    }
    const next = moveOption(event.key, highlighted, options.length);
    if (next !== null) {
      event.preventDefault();
      setActive(open || event.key === "Home" || event.key === "End" ? next : selected);
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const now = Date.now();
    const text = (now - search.current.time < 700 ? search.current.text : "") + event.key;
    search.current = { text, time: now };
    const found = options.findIndex((option) =>
      option.label.toLocaleLowerCase().startsWith(text.toLocaleLowerCase()),
    );
    if (found >= 0) setActive(found);
  }

  return (
    <div
      ref={root}
      className={styles.select}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
      }}
    >
      <button
        ref={button}
        type="button"
        className={styles.trigger}
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        disabled={disabled}
        onClick={() => setActive(open ? null : selected)}
        onKeyDown={onKeyDown}
      >
        <span>{options[selected].label}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open ? (
        <ul id={`${id}-list`} role="listbox" aria-label={label} className={styles.options}>
          {options.map((option, index) => (
            <li
              id={`${id}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={index === selected}
              data-active={index === highlighted}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {index === selected ? <Icon name="circle-check" size={15} /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
