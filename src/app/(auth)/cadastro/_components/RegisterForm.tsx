"use client";

import { useActionState, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { schema, type RegisterFormValues } from "../schema";
import { registerAndLogin } from "../actions";

type State = { error?: string };

const initialState: State = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(
    registerAndLogin,
    initialState
  );

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
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
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Seu nome"
          {...register("name")}
          disabled={pending}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-error-700" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

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
          <p id="email-error" className="text-sm text-error-700" role="alert">
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
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
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
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500 hover:text-neutral-700"
          >
            {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="text-sm text-error-700"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="confirm" className="text-sm font-medium">
          Repita a senha
        </label>
        <div className="relative">
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            aria-invalid={!!errors.confirm || undefined}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="••••••"
            {...register("confirm")}
            disabled={pending}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            aria-label={
              showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"
            }
            className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500 hover:text-neutral-700"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirm && (
          <p id="confirm-error" className="text-sm text-red-700" role="alert">
            {errors.confirm.message}
          </p>
        )}
      </div>

      <Button type="submit" loading={pending} fullWidth className="mt-6">
        Criar conta
      </Button>

      <p className="text-center text-neutral-700">
        Já possui conta?{" "}
        <Link
          href="/login"
          className="text-brand-800 hover:underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
