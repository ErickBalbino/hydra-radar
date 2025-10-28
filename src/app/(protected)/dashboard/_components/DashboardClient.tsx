"use client";

import dynamic from "next/dynamic";

const LineSeries = dynamic(() => import("./charts/LineSeries"), { ssr: false });
const BarBySensor = dynamic(() => import("./charts/BarBySensor"), {
  ssr: false,
});
const ActionsExport = dynamic(() => import("./ActionsExport"), { ssr: false });

type Totals = { sensors: number; alerts: number; readings: number };
type Props = {
  totals: Totals;
  lineData: { ts: string; value: number }[];
  barData: { label: string; value: number }[]; 
  token: string
};

export default function DashboardClient({ totals, lineData, barData, token }: Props) {
  return (
    <section className="space-y-6 outline-0">
      <header className="grid gap-3 sm:grid-cols-3">
        <CardStat label="Sensores" value={totals.sensors} />
        <CardStat label="Alertas" value={totals.alerts} />
        <CardStat label="Leituras" value={totals.readings} />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-md bg-white border border-gray-200 p-4 shadow-card">
          <h2 className="text-lg font-semibold text-brand-800">
            Leituras por hora
          </h2>
          <LineSeries data={lineData} />
          {lineData.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">
              Sem dados no período selecionado.
            </p>
          )}
        </div>

        <div className="rounded-md bg-white border border-gray-200 p-4 shadow-card">
          <h2 className="text-lg font-semibold text-brand-800">
            Leituras por tipo
          </h2>
          <BarBySensor data={barData} />
          {barData.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">
              Nenhum tipo encontrado para os filtros.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md bg-white border border-gray-200 p-4 shadow-card">
        <ActionsExport token={token} />
      </div>
    </section>
  );
}

function CardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white border border-gray-200 p-4 shadow-card">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-brand-800">{value}</p>
    </div>
  );
}
