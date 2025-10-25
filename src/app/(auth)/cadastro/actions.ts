"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const API = process.env.API_BASE_URL ?? "http://localhost:3001";
const TOKEN_COOKIE = "auth_token";

type State = { error?: string };

const ApiError = z.object({
  message: z.string(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
});
type ApiError = z.infer<typeof ApiError>;

const LoginSuccess = z.object({ access_token: z.string() });
type LoginSuccess = z.infer<typeof LoginSuccess>;

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function registerAndLogin(
  _prev: State | undefined,
  formData: FormData
): Promise<State> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!name || !email || !password) return { error: "Preencha todos os campos." };
  if (password !== confirm) return { error: "As senhas não coincidem." };

  let register: Response;
  try {
    register = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ name, email, password, role: "viewer" }),
    });
  } catch {
    return { error: "Falha de conexão com o servidor." };
  }

  const registerText = await register.text();
  const registerData = parseJson(registerText);

  if (register.status < 200 || register.status >= 300) {
    const err = ApiError.safeParse(registerData);
    if (register.status === 409 || (err.success && err.data.message === "Email already in use")) {
      return { error: "Este e-mail já está em uso." };
    }
    return {
      error: err.success ? err.data.message : `Não foi possível criar sua conta (HTTP ${register.status}).`,
    };
  }

  let login: Response;
  try {
    login = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { error: "Conta criada, mas houve falha ao iniciar sessão." };
  }

  const loginText = await login.text();
  const loginData = parseJson(loginText);

  if (login.status < 200 || login.status >= 300) {
    const err = ApiError.safeParse(loginData);
    const msg =
      err.success && err.data.message === "Invalid credentials"
        ? "Conta criada, mas não foi possível entrar. Tente fazer login."
        : (err.success ? err.data.message : `Conta criada, porém login falhou (HTTP ${login.status}).`);
    return { error: msg };
  }

  const parsedLogin = LoginSuccess.safeParse(loginData);
  console.log(parsedLogin);
  if (!parsedLogin.success) {
    return { error: "Conta criada, porém a resposta de login é inválida." };
  }

  const jar = await cookies();
  jar.set(TOKEN_COOKIE, parsedLogin.data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
