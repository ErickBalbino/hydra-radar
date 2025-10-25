import type { Metadata } from "next";
import SensoresClient from "./_components/SensoresClient";

export const metadata: Metadata = {
  title: "Sensores",
  robots: { index: false, follow: false },
};

type Sensor = {
  id: string;
  name: string;
  type: string;
  isPublic?: boolean;
};

export default async function SensoresPage() {
  let items: Sensor[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/sensors`,
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
          <SensoresClient sensors={items} />
        </div>
      </div>
    </section>
  );
}
