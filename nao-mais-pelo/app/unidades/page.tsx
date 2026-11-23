import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Arrow } from "@/components/ui/primitives";
import { UnitLocator } from "@/components/ui/UnitLocator";
import { centralWhatsappHref } from "@/lib/site";
import { unitsJsonLd } from "@/lib/structured-data";
import { states, units } from "@/lib/units";

export const metadata: Metadata = {
  title: "Unidades",
  description: `Encontre a unidade Não+Pelo mais próxima de você: ${units.length} endereços em ${states.length} estados, com agendamento pelo WhatsApp.`,
  alternates: { canonical: "/unidades" },
  openGraph: { url: "/unidades", title: "Unidades — Não+Pelo" },
};

export default function UnidadesPage() {
  const cities = new Set(units.map((u) => `${u.cidade}-${u.uf}`)).size;
  return (
    <>
      <Header over="none" />
      <main id="conteudo" className="bg-bone">
        <section aria-labelledby="unidades-titulo" className="container-x pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="hero-fade eyebrow flex items-center gap-3 text-stone" style={{ "--d": "100ms" } as CSSProperties}>
                <span className="plus-mark text-gold-deep" aria-hidden="true" />
                Onde estamos
              </p>
              <h1 id="unidades-titulo" className="mt-8 text-display tracking-[-0.035em]">
                <span className="hero-line line-mask">
                  <span style={{ "--i": 0 } as CSSProperties}>Perto</span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 1 } as CSSProperties}>
                    <em>de você.</em>
                  </span>
                </span>
              </h1>
            </div>
            <div className="hero-fade lg:col-span-4" style={{ "--d": "700ms" } as CSSProperties}>
              <p className="text-[1.0625rem] leading-relaxed text-stone">
                Encontre a liberdade para sua pele na unidade mais próxima de você. De norte a sul, com excelência no atendimento.
              </p>
              <dl className="mt-8 grid grid-cols-3 border-t border-ink/15 pt-6">
                {[
                  [units.length, "unidades"],
                  [cities, "cidades"],
                  [states.length, "estados"],
                ].map(([v, l]) => (
                  <div key={String(l)}>
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block font-display text-4xl leading-none">{v}</span>
                      <span className="eyebrow mt-2 block text-stone">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section aria-labelledby="busca-titulo" className="container-x pb-24 md:pb-36">
          <h2 id="busca-titulo" className="sr-only">
            Buscar unidade
          </h2>
          <UnitLocator />
          <div className="mt-16 flex flex-col gap-6 border-t border-ink/12 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-lg font-display text-2xl leading-snug">Não encontrou a sua cidade? Fale com a nossa central de agendamento.</p>
            <a href={centralWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid-dark">
              <span>Falar com a central</span>
              <Arrow />
            </a>
          </div>
          <p className="mt-6 text-xs text-stone">Endereços e telefones conforme publicados pela rede Não+Pelo. Confirme horários diretamente com a unidade.</p>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(unitsJsonLd()) }} />
    </>
  );
}
