// src/components/form/IntervalField.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  buildIsoDuration,
  DURATION_PRESETS,
  DurationFields,
  parseIsoDuration,
  sanitizeDurationFields,
} from "@/utils/intervals";

type Props = {
  value?: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
};

export default function IntervalField({ value, onChange, disabled }: Props) {
  const [fields, setFields] = useState<DurationFields>(() =>
    parseIsoDuration(value || "PT15M")
  );
  useEffect(() => {
    setFields(parseIsoDuration(value || "PT15M"));
  }, [value]);
  const iso = useMemo(() => {
    try {
      return buildIsoDuration(fields);
    } catch {
      return "";
    }
  }, [fields]);
  useEffect(() => {
    if (iso) onChange(iso);
  }, [iso, onChange]);
  const set = (k: keyof DurationFields, v: string) => {
    const n = Number(v);
    setFields((prev) =>
      sanitizeDurationFields({ ...prev, [k]: Number.isFinite(n) ? n : 0 })
    );
  };
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={fields.days}
            onChange={(e) => set("days", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={disabled}
          />
          <span className="text-xs text-slate-600">dias</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={fields.hours}
            onChange={(e) => set("hours", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={disabled}
          />
          <span className="text-xs text-slate-600">horas</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={fields.minutes}
            onChange={(e) => set("minutes", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={disabled}
          />
          <span className="text-xs text-slate-600">min</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={fields.seconds}
            onChange={(e) => set("seconds", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={disabled}
          />
          <span className="text-xs text-slate-600">seg</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {DURATION_PRESETS.map((p) => (
          <button
            key={p.iso}
            type="button"
            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            onClick={() => {
              setFields(p.value);
              onChange(p.iso);
            }}
            disabled={disabled}
          >
            {p.label}
          </button>
        ))}
      </div>
      <input
        readOnly
        value={iso}
        className="w-full rounded-md border px-3 py-2 text-xs text-slate-700 bg-slate-50"
      />
    </div>
  );
}
