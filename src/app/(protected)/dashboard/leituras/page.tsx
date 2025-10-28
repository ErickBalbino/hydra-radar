import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { getMe, getToken } from "@/lib/auth";
import type { Reading, Sensor } from "@/lib/types";
import ReadingsClient from "./_components/ReadingsClient";

export const metadata: Metadata = {
  title: "Leituras",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<{
    type?: string;
    sensorId?: string;
    startDate?: string;
    endDate?: string;
    limit?: string;
  }>;
};

function qs(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim() !== "") sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function LeiturasPage({ searchParams }: PageProps) {
  const me = await getMe();
  const canManage = me?.role === "admin" || me?.role === "analyst";

  const token = await getToken();
  const q = (await searchParams) ?? {};
  const limit = q.limit ?? "200";

  const [sensors, readings] = await Promise.all([
    apiGet<Sensor[]>("/sensors", token).catch(() => []),
    apiGet<Reading[]>(
      `/readings${qs({
        type: q.type,
        sensorId: q.sensorId,
        startDate: q.startDate,
        endDate: q.endDate,
        limit,
      })}`,
      token
    ).catch(() => []),
  ]);

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6">
          <ReadingsClient
            initialReadings={readings}
            sensors={sensors}
            canManage={!!canManage}
          />
        </div>
      </div>
    </section>
  );
}
