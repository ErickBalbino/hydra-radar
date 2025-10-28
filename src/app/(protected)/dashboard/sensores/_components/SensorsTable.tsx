"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Sensor = {
  id: string;
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  isPublic?: boolean;
  createdAt?: string;
};

export default function SensorsTable({
  sensors,
  canManage,
  loading,
  onEdit,
  onDelete,
}: {
  sensors: Sensor[];
  canManage: boolean;
  loading: boolean;
  onEdit: (sensor: Sensor) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (!sensors.length) {
    return (
      <div className="flex h-40 w-full items-center justify-center text-sm text-slate-600">
        Nenhum sensor cadastrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[880px] w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2 pr-3">Nome</th>
            <th className="py-2 pr-3">Código</th>
            <th className="py-2 pr-3">Coordenadas</th>
            <th className="py-2 pr-3">Público</th>
            <th className="py-2 pr-3">Criado em</th>
            {canManage && <th className="py-2">Ações</th>}
          </tr>
        </thead>

        <tbody>
          {sensors.map((s, idx) => {
            const coords =
              s.latitude != null && s.longitude != null
                ? `${s.latitude}, ${s.longitude}`
                : "—";
            return (
              <tr
                key={s.id}
                className={idx % 2 ? "bg-gray-50/60 border-t" : "border-t"}
              >
                <td className="py-2 pr-3">{s.name}</td>
                <td className="py-2 pr-3">{s.code}</td>
                <td className="py-2 pr-3">{coords}</td>
                <td className="py-2 pr-3">{s.isPublic ? "Sim" : "Não"}</td>
                <td className="py-2 pr-3">
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                </td>
                {canManage && (
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canManage}
                        onClick={() => onEdit(s)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canManage || deletingId === s.id}
                        loading={deletingId === s.id}
                        onClick={() => setConfirmId(s.id)}
                        className="border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-discrete"
                      >
                        Deletar
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h4 className="text-base font-semibold text-slate-800">
              Confirmar exclusão
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              Deseja realmente excluir este sensor?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  setDeletingId(confirmId);
                  onDelete(confirmId);
                  setDeletingId(null);
                  setConfirmId(null);
                }}
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
