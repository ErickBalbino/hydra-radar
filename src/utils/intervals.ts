export type DurationFields = { days: number; hours: number; minutes: number; seconds: number };

export function sanitizeDurationFields(input: Partial<DurationFields>): DurationFields {
  const toInt = (v: unknown) => (Number.isFinite(v) ? Math.max(0, Math.trunc(Number(v))) : 0);
  return {
    days: toInt(input.days),
    hours: toInt(input.hours),
    minutes: toInt(input.minutes),
    seconds: toInt(input.seconds),
  };
}

export function buildIsoDuration(fields: Partial<DurationFields>): string {
  const f = sanitizeDurationFields(fields);
  if (f.days === 0 && f.hours === 0 && f.minutes === 0 && f.seconds === 0) throw new Error("Intervalo inválido");
  const datePart = f.days ? `P${f.days}D` : "P";
  const time = [
    f.hours ? `${f.hours}H` : "",
    f.minutes ? `${f.minutes}M` : "",
    f.seconds ? `${f.seconds}S` : "",
  ].join("");
  return time ? `${datePart}T${time}` : datePart;
}

export function parseIsoDuration(iso: string): DurationFields {
  if (!iso) return { days: 0, hours: 0, minutes: 15, seconds: 0 };
  const s = iso.toUpperCase();
  const m = s.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return { days: 0, hours: 0, minutes: 15, seconds: 0 };
  const [, d, h, mi, se] = m;
  return {
    days: d ? parseInt(d, 10) : 0,
    hours: h ? parseInt(h, 10) : 0,
    minutes: mi ? parseInt(mi, 10) : 0,
    seconds: se ? parseInt(se, 10) : 0,
  };
}

export const DURATION_PRESETS: Array<{ label: string; value: DurationFields; iso: string }> = [
  { label: "15 min", value: { days: 0, hours: 0, minutes: 15, seconds: 0 }, iso: "PT15M" },
  { label: "30 min", value: { days: 0, hours: 0, minutes: 30, seconds: 0 }, iso: "PT30M" },
  { label: "1 h", value: { days: 0, hours: 1, minutes: 0, seconds: 0 }, iso: "PT1H" },
  { label: "2 h", value: { days: 0, hours: 2, minutes: 0, seconds: 0 }, iso: "PT2H" },
  { label: "6 h", value: { days: 0, hours: 6, minutes: 0, seconds: 0 }, iso: "PT6H" },
  { label: "1 dia", value: { days: 1, hours: 0, minutes: 0, seconds: 0 }, iso: "P1D" },
];
