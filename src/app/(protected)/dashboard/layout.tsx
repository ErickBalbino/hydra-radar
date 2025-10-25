import { getMe } from "@/lib/auth";
import Sidebar from "./_components/Sidebar";
import HeaderBar from "./_components/HeaderBar";

export const metadata = { title: "Dashboard — Hydra" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-[1fr] bg-[--color-bg]">
      <aside className="hidden md:block border-r border-gray-200 bg-white">
        <Sidebar me={me} />
      </aside>
      <div className="flex flex-col">
        <HeaderBar me={me} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
