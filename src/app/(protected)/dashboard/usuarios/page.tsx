import type { Metadata } from "next";
import { getMe } from "@/lib/auth";
import UsuariosClient from "./_components/UsuariosClient";

export const metadata: Metadata = {
  title: "Usuários",
  robots: { index: false, follow: false },
};

type User = {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
};

export default async function UsuariosPage() {
  const me = await getMe();

  let users: User[] = [];
  if (me?.role === "admin") {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/users`,
        {
          cache: "no-store",
        }
      );
      if (res.status >= 200 && res.status < 300) {
        users = await res.json();
      }
    } catch {
      users = [];
    }
  }

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6 overflow-x-auto">
          <UsuariosClient users={users} canEdit={me?.role === "admin"} />
        </div>
      </div>
    </section>
  );
}
