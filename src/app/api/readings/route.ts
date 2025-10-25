import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export async function GET(req: Request) {
  const token = getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized", statusCode: 401 }, { status: 401 });

  const url = new URL(req.url);
  const fmt = (url.searchParams.get("format") || "csv").toLowerCase();
  const endpoint = fmt === "json" ? "/export/readings.json" : "/export/readings.csv";

  const r = await fetch(`${API}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const buf = Buffer.from(await r.arrayBuffer());
  const name = `hydra-readings-${Date.now()}.${fmt}`;
  return new NextResponse(buf, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("content-type") ?? (fmt === "json" ? "application/json" : "text/csv"),
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
