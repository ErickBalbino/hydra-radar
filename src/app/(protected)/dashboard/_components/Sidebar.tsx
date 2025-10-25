"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Me } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/sensores", label: "Sensores" },
  { href: "/dashboard/leituras", label: "Leituras" },
  { href: "/dashboard/exportar", label: "Exportar" },
];

export default function Sidebar({ me }: { me: Me | null }) {
  const pathname = usePathname();
  const active = (href: string) =>
    pathname === href
      ? "bg-brand-50 text-brand-800"
      : "text-slate-700 hover:bg-slate-50";

  return (
    <nav className="p-4">
      <div className="px-2 py-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-brand-800 font-semibold"
        >
          <span className="text-xl">Hydra</span>
        </Link>
      </div>

      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              className={`block rounded-md px-3 py-2 ${active(it.href)}`}
              href={it.href}
            >
              {it.label}
            </Link>
          </li>
        ))}
        {me?.role === "admin" && (
          <li className="mt-2">
            <Link
              href="/dashboard/usuarios"
              className={`block rounded-md px-3 py-2 ${active(
                "/dashboard/usuarios"
              )}`}
            >
              Usuários
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
