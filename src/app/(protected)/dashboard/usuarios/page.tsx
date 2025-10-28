import type { Metadata } from "next";
import { getMe, getToken, API } from "@/lib/auth";
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
      const token = await getToken();
      if (token) {
        const res = await fetch(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.status >= 200 && res.status < 300) {
          users = (await res.json()) as User[];
        }
      }
    } catch {
      users = [];
    }
  }

  return (
    <section className="min-h-dvh bg-[--color-bg] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-semibold mb-5">Usuários do sistema</h1>

        <div className="rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6 overflow-x-auto">
          <UsuariosClient users={users} canEdit={me?.role === "admin"} />
        </div>
      </div>
    </section>
  );
}
