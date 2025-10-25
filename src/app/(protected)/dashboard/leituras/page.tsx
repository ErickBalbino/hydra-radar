import type { Metadata } from "next";
import LeiturasClient from "./_components/LeiturasClient";

export const metadata: Metadata = {
  title: "Leituras",
  robots: { index: false, follow: false },
};

type Reading = {
  id: string;
  sensorId: string;
  type: string;
  value: number;
  timestamp: string;
};

export default async function LeiturasPage() {
  let items: Reading[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/readings`,
      {
        cache: "no-store",
      }
    );
    if (res.status >= 200 && res.status < 300) items = await res.json();
  } catch {
    items = [];
  }

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6 overflow-x-auto">
          <LeiturasClient readings={items} />
        </div>
      </div>
    </section>
  );
}
