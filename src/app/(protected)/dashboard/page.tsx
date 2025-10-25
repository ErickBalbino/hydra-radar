import { apiGet } from "@/lib/api";
import { getToken } from "@/lib/auth";
import DashboardClient from "./_components/DashboardClient";

type SummaryResponse = {
  filters?: { type?: string; startDate?: string; endDate?: string };
  totals?: { sensors?: number; alerts?: number; readings?: number };
  byType?: Array<{ type: string; total: number }>;
  lastByType?: Array<{ type: string; timestamp: string; value: number }>;
};

type AggregateResponse = Array<{ bucket: string; value: number }>;

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function buildQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && value.trim() !== "") searchParams.set(key, value);
  }
  const result = searchParams.toString();
  return result ? `?${result}` : "";
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const token = await getToken(); 
  const query = await searchParams;

  const filters = {
    type: query.type,
    startDate: query.startDate,
    endDate: query.endDate,
  };

  const [summaryResponse, aggregateResponse] = await Promise.all([
    apiGet<SummaryResponse>(
      `/dashboard/summary${buildQueryString(filters)}`,
      token
    ).catch(() => ({} as SummaryResponse)),
    apiGet<AggregateResponse>(
      `/readings/aggregate${buildQueryString({ period: "hour", ...filters })}`,
      token
    ).catch(() => [] as AggregateResponse),
  ]);

  const safeAggregate = Array.isArray(aggregateResponse)
    ? aggregateResponse
    : [];
  const lineData = safeAggregate.map((item) => ({
    ts: item.bucket,
    value: item.value,
  }));

  const totals = {
    sensors: summaryResponse.totals?.sensors ?? 0,
    alerts: summaryResponse.totals?.alerts ?? 0,
    readings: summaryResponse.totals?.readings ?? 0,
  };

  const safeByType = Array.isArray(summaryResponse.byType)
    ? summaryResponse.byType
    : [];
  const barData = safeByType.map((row) => ({
    label: row.type,
    value: row.total,
  }));

  return (
    <DashboardClient totals={totals} lineData={lineData} barData={barData} />
  );
}
