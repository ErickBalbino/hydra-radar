"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Role = "admin" | "analyst" | "viewer";
type User = { id: string; name?: string; email: string; role: Role };

export default function UsersTable({
  users,
  canEdit,
}: {
  users: User[];
  canEdit: boolean;
}) {
  const [rows, setRows] = useState<User[]>(users ?? []);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function changeRole(id: string, role: Exclude<Role, "admin">) {
    const user = rows.find((u) => u.id === id);
    if (!user || user.role === role) return;

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

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2 pr-3">Nome</th>
            <th className="py-2 pr-3">E-mail</th>
            <th className="py-2 pr-3">Perfil</th>
            <th className="py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const isBusy = busyId === u.id;
            const disableViewer =
              isBusy || u.role === "viewer" || !canEdit || u.role === "admin";
            const disableAnalyst =
              isBusy || u.role === "analyst" || !canEdit || u.role === "admin";

            return (
              <tr key={u.id} className="border-t">
                <td className="py-2 pr-3">{u.name ?? "—"}</td>
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3 uppercase">{u.role}</td>
                <td className="py-2">
                  <div className="flex gap-2" aria-busy={isBusy}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disableViewer}
                      loading={isBusy && !disableViewer}
                      onClick={() => changeRole(u.id, "viewer")}
                    >
                      Tornar viewer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disableAnalyst}
                      loading={isBusy && !disableAnalyst}
                      onClick={() => changeRole(u.id, "analyst")}
                    >
                      Tornar analyst
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
