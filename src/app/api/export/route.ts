import { NextResponse } from "next/server";
import { getToken, API } from "@/lib/auth";

export async function GET(req: Request) {
  const token = getToken();
  if (!token) return NextResponse.json({ message: "Unauthorized", statusCode: 401 }, { status: 401 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "csv";
  const range  = url.searchParams.get("range")  || "24h";
  const sensor = url.searchParams.get("sensor") || "";

  const r = await fetch(`${API}/export?format=${format}&range=${range}&sensor=${sensor}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const blob = await r.arrayBuffer();
  const file = Buffer.from(blob);
  const name = `hydra_export_${Date.now()}.${format}`;
  return new NextResponse(file, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
