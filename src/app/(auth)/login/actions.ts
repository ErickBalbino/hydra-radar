"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
  email: z.email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type LoginState = {
  ok: boolean;
  errors?: {
    email?: string;
    password?: string;
    _form?: string;
  };
};

export async function signIn(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = LoginSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: NonNullable<LoginState["errors"]> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "email" || key === "password") {
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }

    if (!fieldErrors.email && !fieldErrors.password) {
      fieldErrors._form = "Não foi possível validar os dados.";
    }

    return { ok: false, errors: fieldErrors };
  }

  // TODO: integração real com API/autenticação
  await new Promise((r) => setTimeout(r, 600));

  redirect("/protected");
}
