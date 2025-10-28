import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized", statusCode: 401 },
      { status: 401 }
    );
  }

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Invalid payload", statusCode: 500 },
      { status: 500 }
    );
  }
}
