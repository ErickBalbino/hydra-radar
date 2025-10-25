import type { Metadata } from "next";
import ExportarClient from "./_components/ExportarClient";

export const metadata: Metadata = {
  title: "Exportar dados",
  robots: { index: false, follow: false },
};

export default async function ExportarPage() {
  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6">
          <ExportarClient />
        </div>
      </div>
    </section>
  );
}
