import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import { apiPut, apiDelete } from "@/lib/api";
import type { UpdateAlertRuleInput } from "@/types/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const token = await getToken();
  const body = (await req.json()) as UpdateAlertRuleInput;
  const data = await apiPut(`/alert-rules/${id}`, token, body);
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const token = await getToken();
  await apiDelete(`/alert-rules/${id}`, token);
  return NextResponse.json({ ok: true });
}