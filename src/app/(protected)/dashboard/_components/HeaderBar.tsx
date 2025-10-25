"use client";

import type { Me } from "@/lib/auth";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-actions";

function getInitial(name?: string, email?: string) {
  const base = (name ?? email ?? "").trim();
  return base ? base[0]!.toUpperCase() : "U";
}

export default function HeaderBar({ me }: { me: Me | null }) {
  const [pending, start] = useTransition();
  const initial = getInitial(me?.name, me?.email);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        {me ? (
          <div className="flex items-center gap-2">
            <div
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-800 text-white"
            >
              <span className="text-sm font-semibold">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 max-xs:hidden">
                {me.email}
              </p>
              <p className="truncate text-xs text-slate-600 max-sm:hidden">
                {(me.role ?? "viewer").toUpperCase()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600">Não autenticado</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => start(() => signOut())}
            aria-label="Sair"
            className="inline-flex items-center gap-2 rounded-[--radius-md] border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            disabled={pending}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {pending ? "Saindo..." : "Sair"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
