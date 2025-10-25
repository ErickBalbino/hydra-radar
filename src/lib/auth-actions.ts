"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/lib/auth";

export async function signOut() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  redirect("/login");
}
