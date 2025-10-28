import type { Metadata } from "next";
import { getToken, getMe } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import type { Alert, AlertRule, Sensor } from "@/types/api";
import AlertsClient from "./_components/AlertsClient";

export const metadata: Metadata = {
  title: "Alertas",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<{
    sensorId?: string;
    readingType?: string;
    resolved?: string;
  }>;
};

function qs(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(
    ([k, v]) => v && v.trim() !== "" && sp.set(k, v)
  );
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function Page({ searchParams }: PageProps) {
  const token = await getToken();
  const me = await getMe();
  const canManage = me?.role === "admin" || me?.role === "analyst";

  const q = (await searchParams) ?? {};
  const query = qs({
    sensorId: q.sensorId,
    readingType: q.readingType,
    resolved: q.resolved,
  });

  const [alerts, rules, sensors] = await Promise.all([
    apiGet<Alert[]>(`/alerts${query}`, token).catch(() => []),
    apiGet<AlertRule[]>(`/alert-rules`, token).catch(() => []),
    apiGet<Sensor[]>(`/sensors`, token).catch(() => []),
  ]);

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6">
          <AlertsClient
            initialAlerts={alerts}
            initialRules={rules}
            sensors={sensors}
            canManage={!!canManage}
          />
        </div>
      </div>
    </section>
  );
}
