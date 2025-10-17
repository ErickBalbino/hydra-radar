import type { Metadata } from "next";
import Image from "next/image";
import RegisterForm from "./_components/RegisterForm";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta para acessar o dashboard.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <section className="min-h-dvh grid md:[grid-template-columns:40%_60%] bg-[--color-bg]">
      <div
        className="
          relative h-48 xs:h-56 sm:h-64 md:h-auto md:order-2 overflow-hidden
          rounded-b-[2rem] md:rounded-none
        "
        aria-hidden="true"
      >
        <Image
          src="/login-hero.jpg" /* use a mesma hero ou troque por /register-hero.jpg */
          alt=""
          fill
          priority
          className="object-cover"
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
              Crie uma conta
            </h1>
          </div>

          <div className="mt-6 rounded-[--radius-xl] bg-[--color-card]/90 backdrop-blur border border-[--color-border] p-5 sm:p-6 shadow-card">
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
