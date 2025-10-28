"use client";

import { normalizeRole } from "@/utils/normalizeRole";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Role = "admin" | "analyst" | "viewer";
type User = { id: string; name?: string; email: string; role: Role };

export default function UsersTable({
  users,
  canEdit,
}: {
  users: User[];
  canEdit: boolean;
}) {
  const [rows, setRows] = useState<User[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setRows(users ?? []);
    setInitialLoading(false);
  }, [users]);

  async function changeRole(id: string, role: Exclude<Role, "admin">) {
    const current = rows.find((u) => u.id === id);
    if (!current || current.role === role) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.status >= 200 && res.status < 300) {
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      }
    } finally {
      setBusyId(null);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex h-40 w-full items-center justify-center text-sm text-slate-600">
        Nenhum usuário cadastrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[820px] w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2 pr-3">Nome</th>
            <th className="py-2 pr-3">E-mail</th>
            <th className="py-2 pr-3">Perfil</th>
            <th className="py-2 pr-3">Editar função</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u, idx) => {
            const isBusy = busyId === u.id;
            const rowClass = idx % 2 ? "bg-gray-50/60 border-t" : "border-t";

            const isAdmin = u.role === "admin";
            const canEditThis = canEdit && !isAdmin;

            return (
              <tr key={u.id} className={rowClass}>
                <td className="py-2 pr-3">{u.name ?? "—"}</td>
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3 uppercase">{normalizeRole(u.role)}</td>
                <td className="py-2 pr-3">
                  {!isAdmin ? (
                    <div className="relative inline-block">
                      <select
                        className="w-44 appearance-none rounded-sm border border-neutral-400 bg-white px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-60"
                        value={u.role === "analyst" ? "analyst" : "viewer"}
                        onChange={(e) =>
                          changeRole(
                            u.id,
                            e.target.value === "analyst" ? "analyst" : "viewer"
                          )
                        }
                        disabled={!canEditThis || isBusy}
                        aria-busy={isBusy}
                      >
                        <option value="analyst">Analista</option>
                        <option value="viewer">Visualizador</option>
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <select
                        className="w-44 appearance-none rounded-sm border border-neutral-400 bg-white px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-60"
                        disabled={!canEditThis || isBusy}
                        aria-busy={isBusy}
                      >
                        <option value="admin">Administrador</option>
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
