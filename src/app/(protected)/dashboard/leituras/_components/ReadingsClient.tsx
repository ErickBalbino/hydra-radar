"use client";

import { useMemo, useState } from "react";
import type { Reading, Sensor } from "@/lib/types";
import Button from "@/components/ui/Button";
import { X, Search, Plus, ChevronLeft } from "lucide-react";

type Props = {
  initialReadings: Reading[];
  sensors: Sensor[];
  canManage: boolean;
};

type CreateReadingPayload = {
  value: number;
  type: string;
  sensorId: string;
};

export default function ReadingsClient({
  initialReadings,
  sensors,
  canManage,
}: Props) {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [rows, setRows] = useState<Reading[]>(initialReadings ?? []);
  const [busyId, setBusyId] = useState<string | null>(null);

  function onCreated(r: Reading) {
    setRows((prev) => [r, ...prev]);
    setMode("list");
  }

  async function handleDelete(id: string) {
    if (!canManage) return;
    const c = window.confirm("Deseja realmente excluir esta leitura?");
    if (!c) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
      if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  if (mode === "create") {
    return (
      <div className="space-y-4">
        <div className="flex w-full justify-between items-center gap-3">
          <h3 className="text-lg font-semibold text-brand-800">Nova leitura</h3>
          <Button
            variant="outline"
            onClick={() => setMode("list")}
            className="gap-2"
          >
            <ChevronLeft size={16} />
            Voltar
          </Button>
        </div>
        <CreateReadingForm
          sensors={sensors}
          onCreated={onCreated}
          canManage={canManage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-brand-800">Leituras</h2>
        <div className="ml-auto">
          {canManage && (
            <Button onClick={() => setMode("create")} size="sm">
              <Plus size={16} className="mr-2" />
              Nova leitura
            </Button>
          )}
        </div>
      </div>

      {!rows.length ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-600">
          Nenhuma leitura encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-3">Valor</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Sensor</th>
                <th className="py-2 pr-3">Criada em</th>
                {canManage && <th className="py-2">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={i % 2 ? "bg-gray-50/70 border-t" : "border-t"}
                >
                  <td className="py-2 pr-3">{r.value}</td>
                  <td className="py-2 pr-3 uppercase">{r.type}</td>
                  <td className="py-2 pr-3">
                    {r.sensor?.name ?? r.sensorId ?? "—"}
                  </td>
                  <td className="py-2 pr-3">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  {canManage && (
                    <td className="py-2">
                      <button
                        className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-discrete"
                        onClick={() => handleDelete(r.id)}
                        disabled={busyId === r.id}
                      >
                        Deletar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CreateReadingForm({
  sensors,
  onCreated,
  canManage,
}: {
  sensors: Sensor[];
  onCreated: (r: Reading) => void;
  canManage: boolean;
}) {
  const [value, setValue] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [sensorQuery, setSensorQuery] = useState("");
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [openList, setOpenList] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = sensorQuery.trim().toLowerCase();
    if (!q) return sensors.slice(0, 20);
    return sensors
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [sensorQuery, sensors]);

  const canSubmit =
    canManage &&
    !!selectedSensor &&
    type.trim() !== "" &&
    value.trim() !== "" &&
    !isNaN(+value);

  async function onSubmit() {
    if (!canSubmit || !selectedSensor) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: Number(value),
          type,
          sensorId: selectedSensor.id,
        } satisfies CreateReadingPayload),
      });
      if (res.ok) {
        const created = (await res.json()) as Reading;
        onCreated(created);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Valor</label>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Ex.: 23.7"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Tipo</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Ex.: temperature"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm text-slate-700">Sensor</label>
        <div className="relative mt-1">
          <div
            className="flex items-center rounded-md border px-2"
            onClick={() => setOpenList(true)}
          >
            <Search size={16} className="text-slate-500" />
            <input
              className="w-full px-2 py-2 text-sm outline-none ring-0"
              value={sensorQuery}
              onChange={(e) => {
                setSensorQuery(e.target.value);
                setOpenList(true);
              }}
              placeholder={
                selectedSensor
                  ? `${selectedSensor.name} • ${selectedSensor.code}`
                  : "Buscar por nome ou código..."
              }
            />
            {!!sensorQuery && (
              <button
                className="p-1 text-slate-500 hover:text-slate-700"
                onClick={() => setSensorQuery("")}
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {openList && (
            <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-600">
                  Nenhum sensor encontrado.
                </div>
              ) : (
                filtered.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSensor(s);
                      setSensorQuery(`${s.name} • ${s.code}`);
                      setOpenList(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-600">{s.code}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sm:col-span-2">
        <Button onClick={onSubmit} disabled={!canSubmit} loading={submitting}>
          Salvar leitura
        </Button>
      </div>
    </div>
  );
}
