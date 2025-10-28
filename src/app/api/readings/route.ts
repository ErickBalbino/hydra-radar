import { NextResponse } from "next/server";
import { API as API_BASE, getToken } from "@/lib/auth";

export async function POST(req: Request) {
  const token = await getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const r = await fetch(`${API_BASE}/readings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const j = await r.json().catch(() => ({}));
  return NextResponse.json(j, { status: r.status });
}
