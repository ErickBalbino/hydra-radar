import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = (searchParams.get("format") || "csv").toLowerCase();
  const allowed = new Set(["csv", "json"]);
  const fmt = allowed.has(format) ? format : "csv";

  const upstream = await fetch(`${API}/export/readings?format=${fmt}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (upstream.status < 200 || upstream.status >= 300) {
    const text = await upstream.text().catch(() => "");
    try {
      const json = text ? JSON.parse(text) : {};
      return NextResponse.json(json, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { message: "Failed to export readings" },
        { status: upstream.status }
      );
    }
  }

  const headers = new Headers();
  const ct = upstream.headers.get("content-type") || (fmt === "csv" ? "text/csv" : "application/json");
  const cd = upstream.headers.get("content-disposition") || `attachment; filename="readings.${fmt}"`;
  headers.set("Content-Type", ct);
  headers.set("Content-Disposition", cd);
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, { status: 200, headers });
}
