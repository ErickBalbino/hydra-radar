import { z } from "zod";

export const schema = z.object({
  name: z
    .string({ error: "Informe seu nome." }).min(2, { error: "Nome muito curto." })
    .transform((v) => v.trim()),
  email: z
    .email({ error: "E-mail inválido." })
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string({ error: "Informe uma senha." })
    .min(6, { error: "A senha deve ter pelo menos 6 caracteres." }),
  confirm: z
    .string({ error: "Repita a senha." })
    .min(6, { error: "Confirmação inválida." }),
}).refine((v) => v.password === v.confirm, {
  path: ["confirm"],
  error: "As senhas não coincidem.",
});

export type RegisterFormValues = z.infer<typeof schema>;
