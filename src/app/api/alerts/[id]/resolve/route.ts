import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import { apiPut } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const token = await getToken();
  const data = await apiPut(`/alerts/${id}/resolve`, token, {});
  return NextResponse.json(data);
}
