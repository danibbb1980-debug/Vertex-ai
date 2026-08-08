import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 glow-brand"
        aria-hidden="true"
      />

      <Logo className="size-10" />
      <p className="mt-8 font-display text-5xl font-semibold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
        Essa página não existe.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
        O link pode estar errado ou a página pode ter sido movida. Volte para o
        início ou fale com a gente agora mesmo.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/" size="lg" trackAs="404">
          Voltar para o início
        </LinkButton>
        <LinkButton
          href={whatsappUrl("pagina-404")}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="lg"
          trackAs="404-whatsapp"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Falar no WhatsApp
        </LinkButton>
      </div>
    </main>
  );
}
