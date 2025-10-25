import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized", statusCode: 401 }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const r = await fetch(`${API}/users/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  return NextResponse.json(j, { status: r.status });
}
