import { z } from "zod";

export const schema = z.object({
  email: z.email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha"),
});

export type LoginFormValues = z.infer<typeof schema>;
