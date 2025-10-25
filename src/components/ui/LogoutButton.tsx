"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-actions";

type Props = { className?: string };

export default function LogoutButton({ className }: Props) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() => start(() => signOut())}
      aria-label="Sair"
      className={`inline-flex items-center gap-2 rounded-[--radius-md] border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60 ${
        className ?? ""
      }`}
      disabled={pending}
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">{pending ? "Saindo..." : "Sair"}</span>
    </button>
  );
}
