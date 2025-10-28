import { getMe } from "@/lib/auth";
import Sidebar from "./_components/Sidebar";
import HeaderBar from "./_components/HeaderBar";

import "leaflet/dist/leaflet.css";

export const metadata = { title: "Dashboard — Hydra" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  return (
    <div className="h-[100vh] grid grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-[1fr] overflow-hidden">
      <aside className="hidden md:block border-r border-gray-200 bg-brand-700 h-[100vh]">
        <Sidebar me={me} />
      </aside>
      <div className="flex flex-col h-[100vh]">
        <HeaderBar me={me} />
        <main className="p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
