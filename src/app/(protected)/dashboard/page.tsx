import { apiGet } from "@/lib/api";
import { getToken } from "@/lib/auth";
import DashboardClient from "./_components/DashboardClient";
import type {
  Sensor,
  Alert,
  Reading,
  AggregatePoint,
  SummaryResponse,
  LineDatum,
  BarDatum,
} from "@/types/api";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function buildQueryString(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v && v.trim()) sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

const SUMMARY_DEFAULT: SummaryResponse = {
  filters: undefined,
  byType: [],
  lastByType: [],
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const token = await getToken();
  const qp = await searchParams;

  const filters = {
    type: qp.type,
    startDate: qp.startDate,
    endDate: qp.endDate,
  };

  const [summaryRes, aggregateRes, sensors, alerts, readings] =
    await Promise.all([
      apiGet<SummaryResponse>(
        `/dashboard/summary${buildQueryString(filters)}`,
        token
      ).catch(() => SUMMARY_DEFAULT),
      apiGet<AggregatePoint[]>(
        `/readings/aggregate${buildQueryString({
          period: "hour",
          ...filters,
        })}`,
        token
      ).catch(() => [] as AggregatePoint[]),
      apiGet<Sensor[]>("/sensors", token).catch(() => [] as Sensor[]),
      apiGet<Alert[]>("/alerts", token).catch(() => [] as Alert[]),
      apiGet<Reading[]>(`/readings${buildQueryString(filters)}`, token).catch(
        () => [] as Reading[]
      ),
    ]);

  const totals = {
    sensors: sensors.length,
    alerts: alerts.length,
    readings: readings.length,
  };

  type AnyByType = {
    type?: string;
    readingType?: string;
    total?: number;
    count?: number;
    value?: number;
  };
  const byTypeSource: AnyByType[] = (summaryRes.byType?.length
    ? summaryRes.byType
    : []
  ).length
    ? (summaryRes.byType as AnyByType[])
    : Object.entries(
        readings.reduce<Record<string, number>>((acc, r) => {
          const key = (r.type ?? r.readingType as "—" | null | undefined).toString();
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([type, count]) => ({ type, total: count }));

  const lineData: LineDatum[] = aggregateRes.map((p) => ({
    ts: p.bucket,
    value: p.value,
  }));

  const barData: BarDatum[] = (byTypeSource ?? []).map((r) => ({
    label: (r.type ?? r.readingType ?? "—").toString(),
    value: Number(r.total ?? r.count ?? r.value ?? 0),
  }));

  return (
    <DashboardClient
      totals={totals}
      lineData={lineData}
      barData={barData}
      token={token}
    />
  );
}
