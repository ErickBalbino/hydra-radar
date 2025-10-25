import type { Metadata } from "next";
import Image from "next/image";
import { authenticate } from "./actions";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Hydra | Entrar",
  description: "Faça login para continuar.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params?.next ?? "";

  return (
    <section className="min-h-dvh grid md:[grid-template-columns:40%_60%] bg-[--color-bg]">
      <div
        className="
          relative h-48 xs:h-56 max-sm:h-60 md:h-auto md:order-2 overflow-hidden
          rounded-b-[2rem] md:rounded-none
        "
        aria-hidden="true"
      >
        <Image
          src="/login-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
      </div>

      <div className="md:order-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/logoBlueGradient.svg"
              alt="Logo"
              width={110}
              height={110}
              priority
            />
            <h1 className="text-2xl sm:text-3xl font-semibold text-accent-600">
              Olá, faça login para continuar
            </h1>
          </div>

          <div className="mt-6 rounded-md bg-[--color-card]/90 backdrop-blur shadow-lg border border-gray-200 p-5 sm:p-6">
            <LoginForm action={authenticate} next={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
