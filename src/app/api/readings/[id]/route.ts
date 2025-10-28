import { NextResponse } from "next/server";
import { API as API_BASE, getToken } from "@/lib/auth";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = await getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const r = await fetch(`${API_BASE}/readings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (r.status === 204) return NextResponse.json({}, { status: 200 });
  const j = await r.json().catch(() => ({}));
  return NextResponse.json(j, { status: r.status });
}
