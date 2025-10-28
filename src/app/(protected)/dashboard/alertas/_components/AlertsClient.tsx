"use client";

import { useMemo, useState } from "react";
import type {
  Alert,
  AlertRule,
  AlertRuleType,
  CreateAlertRuleInput,
  UpdateAlertRuleInput,
  Sensor,
} from "@/types/api";
import Button from "@/components/ui/Button";
import {
  Check,
  Plus,
  Search,
  X,
  ChevronLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import normalizeAlertRuleType from "@/utils/normalizeAlertRuleType";
import IntervalField from "@/components/form/IntervalField";

export default function AlertsClient({
  initialAlerts,
  initialRules,
  sensors,
  canManage,
}: {
  initialAlerts: Alert[];
  initialRules: AlertRule[];
  sensors: Sensor[];
  canManage: boolean;
}) {
  const [tab, setTab] = useState<"alerts" | "rules">("alerts");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-brand-800">Alertas</h2>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setTab("alerts")}
            className={`rounded-md px-3 py-1.5 text-sm border ${
              tab === "alerts"
                ? "bg-brand-50 border-brand-300 text-brand-800"
                : "border-slate-200"
            }`}
          >
            Lista de alertas
          </button>
          <button
            onClick={() => setTab("rules")}
            className={`rounded-md px-3 py-1.5 text-sm border ${
              tab === "rules"
                ? "bg-brand-50 border-brand-300 text-brand-800"
                : "border-slate-200"
            }`}
          >
            Regras de alerta
          </button>
        </div>
      </div>
      {tab === "alerts" ? (
        <AlertsList initialAlerts={initialAlerts} canManage={canManage} />
      ) : (
        <RulesCrud
          initialRules={initialRules}
          sensors={sensors}
          canManage={canManage}
        />
      )}
    </div>
  );
}

function AlertsList({
  initialAlerts,
  canManage,
}: {
  initialAlerts: Alert[];
  canManage: boolean;
}) {
  const [rows, setRows] = useState<Alert[]>(initialAlerts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sensorQuery, setSensorQuery] = useState("");
  const [readingType, setReadingType] = useState("");
  const [resolved, setResolved] = useState<"" | "true" | "false">("");
  const filteredRows = useMemo(() => {
    const q = sensorQuery.trim().toLowerCase();
    return rows.filter((a) => {
      const bySensor =
        !q ||
        a.sensor?.name?.toLowerCase().includes(q) ||
        a.sensor?.code?.toLowerCase().includes(q);
      const byType = !readingType || a.readingType === readingType;
      const byResolved = !resolved || String(a.resolved) === resolved;
      return bySensor && byType && byResolved;
    });
  }, [rows, sensorQuery, readingType, resolved]);
  const types = useMemo(
    () => Array.from(new Set(rows.map((r) => r.readingType))).sort(),
    [rows]
  );
  async function resolveAlert(id: string) {
    if (!canManage) return;
    setBusyId(id);
    try {
      const r = await fetch(`/api/alerts/${id}/resolve`, { method: "PUT" });
      if (r.ok)
        setRows((prev) =>
          prev.map((x) => (x.id === id ? { ...x, resolved: true } : x))
        );
    } finally {
      setBusyId(null);
    }
  }
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <div className="flex items-center rounded-md border px-2">
            <Search size={16} className="text-slate-500" />
            <input
              className="w-full px-2 py-2 text-sm outline-none"
              value={sensorQuery}
              onChange={(e) => setSensorQuery(e.target.value)}
              placeholder="Buscar sensor (nome ou código)"
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
        </div>
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={readingType}
          onChange={(e) => setReadingType(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={resolved}
          onChange={(e) => setResolved(e.target.value as "" | "true" | "false")}
        >
          <option value="">Todos (abertos e resolvidos)</option>
          <option value="false">Somente abertos</option>
          <option value="true">Somente resolvidos</option>
        </select>
      </div>
      {!filteredRows.length ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-600">
          Nenhum alerta para os filtros.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-3">Leitura</th>
                <th className="py-2 pr-3">Limite</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Sensor</th>
                <th className="py-2 pr-3">Disparado em</th>
                <th className="py-2 pr-3">Status</th>
                {canManage && <th className="py-2">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((a, i) => (
                <tr
                  key={a.id}
                  className={i % 2 ? "bg-gray-50/70 border-t" : "border-t"}
                >
                  <td className="py-2 pr-3">{a.value}</td>
                  <td className="py-2 pr-3">{a.threshold}</td>
                  <td className="py-2 pr-3 uppercase">{a.readingType}</td>
                  <td className="py-2 pr-3">{a.sensor?.name ?? a.sensorId}</td>
                  <td className="py-2 pr-3">
                    {new Date(a.triggeredAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3">
                    {a.resolved ? (
                      <span className="text-green-700">Resolvido</span>
                    ) : (
                      <span className="text-red-700">Aberto</span>
                    )}
                  </td>
                  {canManage && (
                    <td className="py-2">
                      {!a.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => resolveAlert(a.id)}
                          loading={busyId === a.id}
                        >
                          <Check size={16} /> Resolver
                        </Button>
                      )}
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

function RulesCrud({
  initialRules,
  sensors,
  canManage,
}: {
  initialRules: AlertRule[];
  sensors: Sensor[];
  canManage: boolean;
}) {
  const [rows, setRows] = useState<AlertRule[]>(initialRules);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<AlertRule | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  if (mode !== "list") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand-800">
            {mode === "create"
              ? "Nova regra de alerta"
              : "Editar regra de alerta"}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              setMode("list");
              setEditing(null);
            }}
            className="gap-2"
          >
            <ChevronLeft size={16} /> Voltar
          </Button>
        </div>
        <RuleForm
          sensors={sensors}
          defaultValues={editing ?? undefined}
          readOnly={!canManage}
          onSubmit={async (payload) => {
            if (!canManage) return;
            if (mode === "create") {
              const r = await fetch("/api/alert-rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              if (r.ok) {
                const created = (await r.json()) as AlertRule;
                setRows((prev) => [created, ...prev]);
                setMode("list");
              }
            } else if (editing) {
              const r = await fetch(`/api/alert-rules/${editing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...(payload as CreateAlertRuleInput),
                  id: editing.id,
                } as UpdateAlertRuleInput),
              });
              if (r.ok) {
                const updated = (await r.json()) as AlertRule;
                setRows((prev) =>
                  prev.map((x) => (x.id === updated.id ? updated : x))
                );
                setMode("list");
                setEditing(null);
              }
            }
          }}
        />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="ml-auto">
          {canManage && (
            <Button size="sm" onClick={() => setMode("create")}>
              <Plus size={16} className="mr-2" />
              Nova regra
            </Button>
          )}
        </div>
      </div>
      {!rows.length ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-600">
          Nenhuma regra cadastrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-3">Sensor</th>
                <th className="py-2 pr-3">Leitura</th>
                <th className="py-2 pr-3">Regra</th>
                <th className="py-2 pr-3">Limite</th>
                <th className="py-2 pr-3">Janela</th>
                <th className="py-2 pr-3">Ativa</th>
                {canManage && <th className="py-2">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={i % 2 ? "bg-gray-50/70 border-t" : "border-t"}
                >
                  <td className="py-2 pr-3">{r.sensor?.name ?? r.sensorId}</td>
                  <td className="py-2 pr-3 uppercase">{r.readingType}</td>
                  <td className="py-2 pr-3">
                    {r.ruleType === "greater_than" ? ">" : "<"} (
                    {normalizeAlertRuleType(r.ruleType)})
                  </td>
                  <td className="py-2 pr-3">{r.threshold}</td>
                  <td className="py-2 pr-3">{r.timeWindow}</td>
                  <td className="py-2 pr-3">{r.active ? "Sim" : "Não"}</td>
                  {canManage && (
                    <td className="py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setEditing(r);
                            setMode("edit");
                          }}
                        >
                          <Pencil size={16} /> Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
                          loading={busyId === r.id}
                          onClick={async () => {
                            const c = window.confirm(
                              "Deseja realmente excluir esta regra?"
                            );
                            if (!c) return;
                            setBusyId(r.id);
                            try {
                              const del = await fetch(
                                `/api/alert-rules/${r.id}`,
                                { method: "DELETE" }
                              );
                              if (del.ok)
                                setRows((prev) =>
                                  prev.filter((x) => x.id !== r.id)
                                );
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          <Trash2 size={16} /> Deletar
                        </Button>
                      </div>
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

function RuleForm({
  sensors,
  defaultValues,
  readOnly,
  onSubmit,
}: {
  sensors: Sensor[];
  defaultValues?: Partial<AlertRule>;
  readOnly?: boolean;
  onSubmit: (payload: CreateAlertRuleInput) => void;
}) {
  const [sensorQuery, setSensorQuery] = useState("");
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(
    defaultValues?.sensor ??
      (defaultValues?.sensorId
        ? sensors.find((s) => s.id === defaultValues.sensorId) ?? null
        : null)
  );
  const [readingType, setReadingType] = useState(
    defaultValues?.readingType ?? ""
  );
  const [ruleType, setRuleType] = useState<AlertRuleType>(
    defaultValues?.ruleType ?? "greater_than"
  );
  const [threshold, setThreshold] = useState(
    String(defaultValues?.threshold ?? "")
  );
  const [timeWindowIso, setTimeWindowIso] = useState<string>(
    defaultValues?.timeWindow || "PT15M"
  );
  const [active, setActive] = useState(!!defaultValues?.active);
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
  const canSend =
    !!selectedSensor &&
    readingType.trim() !== "" &&
    threshold.trim() !== "" &&
    !isNaN(+threshold) &&
    !!timeWindowIso;
  async function submit() {
    if (!canSend || readOnly || !selectedSensor) return;
    setSubmitting(true);
    try {
      onSubmit({
        sensorId: selectedSensor.id,
        ruleType,
        readingType,
        threshold: Number(threshold),
        timeWindow: timeWindowIso,
        active,
      });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-sm text-slate-700">Sensor</label>
        <div className="relative mt-1">
          <div className="flex items-center rounded-md border px-2">
            <Search size={16} className="text-slate-500" />
            <input
              className="w-full px-2 py-2 text-sm outline-none"
              value={sensorQuery}
              placeholder={
                selectedSensor
                  ? `${selectedSensor.name} • ${selectedSensor.code}`
                  : "Buscar por nome ou código..."
              }
              onChange={(e) => {
                setSensorQuery(e.target.value);
                setOpenList(true);
              }}
              onFocus={() => setOpenList(true)}
              disabled={readOnly}
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
          {openList && !readOnly && (
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
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Tipo de leitura</label>
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={readingType}
          onChange={(e) => setReadingType(e.target.value)}
          placeholder="Ex.: temperature"
          disabled={readOnly}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Regra</label>
        <select
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value as AlertRuleType)}
          disabled={readOnly}
        >
          <option value="greater_than">Maior que (&gt;)</option>
          <option value="less_than">Menor que (&lt;)</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">Limite</label>
        <input
          type="number"
          step="any"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Ex.: 70"
          disabled={readOnly}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-700">
          Intervalo para detecção
        </label>
        <IntervalField
          value={timeWindowIso}
          onChange={setTimeWindowIso}
          disabled={readOnly}
        />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          id="active"
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          disabled={readOnly}
        />
        <label htmlFor="active" className="text-sm">
          Ativa
        </label>
      </div>
      <div className="sm:col-span-2">
        <Button
          onClick={submit}
          disabled={!canSend || readOnly}
          loading={submitting}
        >
          Salvar regra
        </Button>
      </div>
    </div>
  );
}
