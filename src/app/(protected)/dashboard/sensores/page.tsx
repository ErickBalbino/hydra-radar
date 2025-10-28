import type { Metadata } from "next";
import { getMe, getToken, API } from "@/lib/auth";
import SensorsClient from "./_components/SensorsClient";

export const metadata: Metadata = {
  title: "Sensores",
  robots: { index: false, follow: false },
};

type Sensor = {
  id: string;
  name: string;
  code: string;
  latitude: number | null;
  longitude: number | null;
  isPublic: boolean;
  createdAt?: string;
};

export default async function SensoresPage() {
  const me = await getMe();
  const canManage = me?.role === "admin" || me?.role === "analyst";

  let initialSensors: Sensor[] = [];
  const token = await getToken();

  if (token) {
    try {
      const res = await fetch(`${API}/sensors`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status >= 200 && res.status < 300) {
        initialSensors = (await res.json()) as Sensor[];
      }
    } catch {
      initialSensors = [];
    }
  }

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6">
          <SensorsClient
            initialSensors={initialSensors}
            canManage={!!canManage}
            isAdmin={!!canManage}
          />
        </div>
      </div>
    </section>
  );
}
