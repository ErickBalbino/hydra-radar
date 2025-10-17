"use client";

import { useActionState } from "react";
import { useState } from "react";
import { signIn, type LoginState } from "../actions";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const initialState: LoginState = { ok: false };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
          className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="voce@exemplo.com"
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-700" role="alert">
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
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={6}
            aria-invalid={!!state?.errors?.password || undefined}
            aria-describedby={
              state?.errors?.password ? "password-error" : undefined
            }
            className="w-full rounded-sm border border-neutral-400 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Sua senha"
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
        {state?.errors?.password && (
          <p id="password-error" className="text-sm text-red-700" role="alert">
            {state.errors.password}
          </p>
        )}
      </div>
    
      <button
        type="submit"
        aria-disabled={pending}
        disabled={pending}
        className={
          "mt-6 w-full rounded-md bg-brand-800 text-white px-4 py-2 font-medium transition-colors hover:bg-brand-900 disabled:opacity-60 hover:cursor-pointer"
        }
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>

      <div className="text-center text-gray-700">
        Ainda não possui conta?{" "}
        <Link
          href={"/cadastro"}
          className="text-[#1b44a6] hover:underline hover:underline-offset-4"
        >
          Cadastrar
        </Link>
      </div>
    </form>
  );
}
