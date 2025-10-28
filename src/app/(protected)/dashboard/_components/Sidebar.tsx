"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Me } from "@/lib/auth";
import Image from "next/image";

const items = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/sensores", label: "Sensores" },
  { href: "/dashboard/leituras", label: "Leituras" },
  { href: "/dashboard/alertas", label: "Alertas" },
  { href: "/dashboard/exportar", label: "Exportar" },
];

export default function Sidebar({ me }: { me: Me | null }) {
  const pathname = usePathname();
  const active = (href: string) =>
    pathname === href
      ? "bg-brand-50 text-brand-800"
      : "text-white hover:bg-brand-600";

  return (
    <nav className="p-4">
      <div className="px-2 py-4">
        <Link
          href="/dashboard"
          className="items-center gap-2 text-brand-800 font-semibold flex justify-center"
        >
          <Image
            src="/logoBlueGradient.svg"
            alt="Logo"
            width={80}
            height={80}
            priority
          />{" "}
        </Link>
      </div>

      <ul className="space-y-1 mt-5">
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
