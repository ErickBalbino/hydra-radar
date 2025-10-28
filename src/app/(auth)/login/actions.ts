"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const API = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
const TOKEN_COOKIE = "auth_token";

type State = { error?: string };

const LoginSuccess = z.object({ access_token: z.string() });
type LoginSuccess = z.infer<typeof LoginSuccess>;

const ApiError = z.object({
  message: z.string(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
});
type ApiError = z.infer<typeof ApiError>;

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function authenticate(
  _prev: State | undefined,
  formData: FormData
): Promise<State> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  if (!email || !password) return { error: "Informe e-mail e senha." };

  let res: Response;
  try {
    res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { error: "Falha de conexão com o servidor de autenticação." };
  }

  const raw = await res.text();
  const data = parseJson(raw);

  if (res.status === 401) {
    const parsedErr = ApiError.safeParse(data);
    const msg =
      parsedErr.success && parsedErr.data.message === "Invalid credentials"
        ? "Email e/ou senha são inválidos."
        : (parsedErr.success ? parsedErr.data.message : "Não foi possível entrar. Tente novamente.");
    return { error: msg };
  }

  if (res.status < 200 || res.status >= 300) {
    const parsedErr = ApiError.safeParse(data);
    return {
      error: parsedErr.success
        ? parsedErr.data.message
        : `Falha ao entrar (HTTP ${res.status}).`,
    };
  }

  const parsedOk = LoginSuccess.safeParse(data);
  if (!parsedOk.success) {
    return { error: "Resposta inválida do servidor de autenticação." };
  }

  const jar = await cookies();
  jar.set(TOKEN_COOKIE, parsedOk.data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/", "layout");
  const dest = next && next.startsWith("/") ? next : "/dashboard";
  redirect(dest);
}
