"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import SensorsTable from "../_components/SensorsTable";
import SensorForm from "../_components/SensorForm";
import { ChevronLeft, Plus } from "lucide-react";

type Sensor = {
  id: string;
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  isPublic?: boolean;
  createdAt?: string;
};

export default function SensorsClient({
  initialSensors,
  canManage,
  isAdmin,
}: {
  initialSensors: Sensor[];
  canManage: boolean;
  isAdmin: boolean;
}) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [rows, setRows] = useState<Sensor[]>([]);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState(true);

  function filterByVisibility(list: Sensor[]) {
    if (isAdmin) return list;
    return (list ?? []).filter((s) => s.isPublic);
  }

  useEffect(() => {
    setRows(filterByVisibility(initialSensors ?? []));
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSensors, isAdmin]);

  const header = useMemo(() => {
    if (mode === "create") return "Novo sensor";
    if (mode === "edit") return "Editar sensor";
    return "Sensores";
  }, [mode]);

  function backToList() {
    setMode("list");
    setEditing(null);
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/sensors", { cache: "no-store" });
      const list =
        res.status >= 200 && res.status < 300 ? await res.json() : [];
      setRows(filterByVisibility(Array.isArray(list) ? list : []));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(input: Partial<Sensor>) {
    const res = await fetch("/api/sensors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.status >= 200 && res.status < 300) {
      await refresh();
      backToList();
    }
  }

  async function onUpdate(id: string, input: Partial<Sensor>) {
    const res = await fetch(`/api/sensors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.status >= 200 && res.status < 300) {
      await refresh();
      backToList();
    }
  }

  async function onDelete(id: string) {
    const res = await fetch(`/api/sensors/${id}`, { method: "DELETE" });
    if (res.status >= 200 && res.status < 300) {
      setRows((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-800">{header}</h3>
        <div className="ml-auto flex items-center gap-2">
          {mode !== "list" && (
            <Button variant="outline" onClick={backToList} className="gap-2">
              <ChevronLeft size={16} />
              Voltar
            </Button>
          )}
          {mode === "list" && canManage && (
            <Button onClick={() => setMode("create")} size="sm">
              <Plus size={16} className="mr-2" />
              Novo sensor
            </Button>
          )}
        </div>
      </div>

      {mode === "list" && (
        <SensorsTable
          sensors={rows}
          canManage={canManage}
          loading={loading}
          onEdit={(s) => {
            setEditing(s);
            setMode("edit");
          }}
          onDelete={onDelete}
          onRefresh={refresh}
        />
      )}

      {mode === "create" && (
        <SensorForm submitLabel="Criar sensor" onSubmit={onCreate} />
      )}

      {mode === "edit" && editing && (
        <SensorForm
          sensor={editing}
          submitLabel="Salvar alterações"
          onSubmit={(input) => onUpdate(editing.id, input)}
        />
      )}
    </div>
  );
}
