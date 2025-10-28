import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import type { CreateAlertRuleInput } from "@/types/api";

export async function POST(req: Request) {
  const token = await getToken();
  const body = (await req.json()) as CreateAlertRuleInput;
  const data = await apiPost(`/alert-rules`, token, body);
  return NextResponse.json(data);
}
