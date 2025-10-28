import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await upstream.text();
  try {
    const json = text ? JSON.parse(text) : [];
    return NextResponse.json(json, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 502 });
  }
}
