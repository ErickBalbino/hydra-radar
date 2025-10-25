import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized", statusCode: 401 }, { status: 401 });

  const resp = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const text = await resp.text();
  
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json({ message: "Invalid payload", statusCode: 500 }, { status: 500 });
  }
}
