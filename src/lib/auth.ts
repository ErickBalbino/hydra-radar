import { cookies } from "next/headers";
import { z } from "zod";

export const TOKEN_COOKIE = "auth_token";

export const API = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

const MeSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.email(),
  role: z.enum(["admin", "analyst", "viewer"]),
});

export type Role = "admin" | "analyst" | "viewer";
export type Me = z.infer<typeof MeSchema>;

export async function getToken(): Promise<string> {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? "";
}

export async function getMe(): Promise<Me | null> {
  const token = await getToken();
  if (!token) return null;

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status !== 200) return null;

  const data = await res.json();
  const parsed = MeSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
