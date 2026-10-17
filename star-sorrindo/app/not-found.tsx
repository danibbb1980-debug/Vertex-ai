import type { Metadata } from "next";
import { whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Sparkle";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="paper relative flex min-h-[80vh] items-center pt-32 pb-24">
      <div className="container-site relative text-center">
        <Sparkle className="mx-auto h-6 w-6 text-gold" />
        <p className="eyebrow mt-8 justify-center">Erro 404</p>
        <h1 className="serif mt-5 text-5xl sm:text-7xl">
          Esta página <em className="text-gold-ink">não foi encontrada.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-mineral">
          O endereço pode ter mudado ou ter sido digitado com algum erro. Que tal voltar ao início?
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" arrow>
            Voltar ao início
          </Button>
          <Button href={whatsappUrl("default")} external variant="outline">
            Falar com a equipe
          </Button>
        </div>
      </div>
    </section>
  );
}
