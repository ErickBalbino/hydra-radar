"use client";

import { useActionState, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { schema, type LoginFormValues } from "../schema";

import Button from "@/components/ui/Button";

type State = { error?: string };
type Props = {
  action: (prevState: State, formData: FormData) => Promise<State>;
  next?: string;
};

const initialState: State = {};

export default function LoginForm({ action, next = "" }: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function handleValidateAndSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const ok = await trigger(undefined, { shouldFocus: true });
    if (!ok) return;
    const data = new FormData(form);
    startTransition(() => formAction(data));
  }

  return (
    <form
      action={formAction}
      className="space-y-4"
      noValidate
      onSubmit={handleValidateAndSubmit}
    >
      <input type="hidden" name="next" value={next} />

      {state?.error && (
        <div
          className="rounded-md border border-red-300 bg-red-300 p-3 text-sm text-red-900"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="voce@exemplo.com"
          {...register("email")}
          disabled={pending}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-700" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={6}
            aria-invalid={!!errors.password || undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="••••••"
            {...register("password")}
            disabled={pending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-700" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" loading={pending} fullWidth className="mt-6">
        Entrar
      </Button>

      <div className="text-center text-gray-700">
        Ainda não possui conta?{" "}
        <Link
          href="/cadastro"
          className="text-[#1b44a6] hover:underline hover:underline-offset-4"
        >
          Cadastrar
        </Link>
      </div>
    </form>
  );
}
