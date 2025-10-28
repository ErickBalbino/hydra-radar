import "server-only";
import { cookies } from "next/headers";

export const TOKEN_COOKIE = "auth_token";
export const USER_COOKIE = "auth_user";

export async function getToken() {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;

  if (!token) return null;

  try {
    return { token };
  } catch {
    return null;
  }
}
