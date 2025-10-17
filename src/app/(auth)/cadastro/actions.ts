"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const RegisterSchema = z
  .object({
    name: z.string(),
    email: z.email("E-mail inválido."),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirm: z
      .string()
      .min(6, "Confirmação inválida."),
  })
  .refine((v) => v.password === v.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });

export type RegisterState = {
  ok: boolean;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
    _form?: string;
  };
};

export async function signUp(
  _prev: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: NonNullable<RegisterState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "password" || key === "confirm") {
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
    }
    if (
      !fieldErrors.name &&
      !fieldErrors.email &&
      !fieldErrors.password &&
      !fieldErrors.confirm
    ) {
      fieldErrors._form = "Não foi possível validar os dados.";
    }
    return { ok: false, errors: fieldErrors };
  }

  // TODO: chamada real para API de criação de conta
  await new Promise((r) => setTimeout(r, 700));

  redirect("/auth/login");
}
