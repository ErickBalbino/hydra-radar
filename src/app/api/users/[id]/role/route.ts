import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const upstream = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  try {
    const json = text ? JSON.parse(text) : {};
    return NextResponse.json(json, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 502 });
  }
}
