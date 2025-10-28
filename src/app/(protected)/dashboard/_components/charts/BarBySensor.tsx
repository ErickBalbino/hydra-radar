"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type {
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type P = { data: { label: string; value: number }[] };

export default function BarBySensor({ data }: P) {
  const safe = (data ?? []).map((d) => ({
    label: d?.label ?? "—",
    value: Number.isFinite(d?.value) ? Number(d.value) : 0,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safe}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            allowDecimals={false}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip
            formatter={(value: ValueType) => [
              value as number,
              "Leituras",
            ]}
          />
          <Bar dataKey="value" fill="#FE9912" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
