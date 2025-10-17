"use client";

import { useActionState, useState } from "react";
import { signUp, type RegisterState } from "../actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const initialState: RegisterState = { ok: false };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.errors?._form && (
        <div
          className="rounded-md border border-error-200 bg-error-50 p-3 text-sm text-error-700"
          role="alert"
          aria-live="polite"
        >
          {state.errors._form}
        </div>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={!!state?.errors?.name || undefined}
          aria-describedby={state?.errors?.name ? "name-error" : undefined}
          className="w-full rounded-[--radius-md] border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Seu nome"
        />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-error-700" role="alert">
            {state.errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-invalid={!!state?.errors?.email || undefined}
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
          className="w-full rounded-[--radius-md] border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="voce@exemplo.com"
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-error-700" role="alert">
            {state.errors.email}
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
            name="password"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            aria-invalid={!!state?.errors?.password || undefined}
            aria-describedby={
              state?.errors?.password ? "password-error" : undefined
            }
            className="w-full rounded-[--radius-md] border border-neutral-200 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Crie uma senha"
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
        {state?.errors?.password && (
          <p
            id="password-error"
            className="text-sm text-error-700"
            role="alert"
          >
            {state.errors.password}
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
            name="confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            aria-invalid={!!state?.errors?.confirm || undefined}
            aria-describedby={
              state?.errors?.confirm ? "confirm-error" : undefined
            }
            className="w-full rounded-[--radius-md] border border-neutral-200 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Repita sua senha"
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
        {state?.errors?.confirm && (
          <p id="confirm-error" className="text-sm text-error-700" role="alert">
            {state.errors.confirm}
          </p>
        )}
      </div>

      <button
        type="submit"
        aria-disabled={pending}
        disabled={pending}
        className="mt-6 w-full rounded-[--radius-md] bg-brand-800 text-white px-4 py-2 font-medium transition-colors hover:bg-brand-900 disabled:opacity-60 hover:cursor-pointer"
      >
        {pending ? "Criando..." : "Criar conta"}
      </button>

      <p className="text-center text-neutral-700">
        Já possui conta?{" "}
        <Link
          href="/auth/login"
          className="text-brand-800 hover:underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
