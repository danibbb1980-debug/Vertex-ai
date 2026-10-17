import { AlertCircle, Check } from "lucide-react";
import { faqFor } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { PageHero } from "@/components/sections/PageHero";
import { prosthesisPoints } from "@/components/sections/Prosthesis";
import { Steps } from "@/components/sections/Steps";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata = pageMetadata({
  title: "Prótese dentária em Poços de Caldas",
  description:
    "Próteses dentárias para restaurar dentes ausentes ou comprometidos, com indicação após avaliação individual. Agende sua avaliação na Star Sorrindo, em Poços de Caldas.",
  path: "/proteses-dentarias/",
});

const crumbs = [
  { name: "Início", path: "/" },
  { name: "Próteses dentárias", path: "/proteses-dentarias/" },
];

export default function ProsthesisPage() {
  const faq = faqFor("prosthesis");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faq)} />
      <PageHero
        eyebrow="Próteses dentárias"
        crumbs={crumbs}
        title={
          <>
            Próteses dentárias para recuperar <em className="text-gold-ink">função e conforto.</em>
          </>
        }
        intro="As próteses dentárias podem ajudar a restaurar dentes ausentes ou comprometidos. A indicação depende das condições de saúde bucal, das necessidades de cada paciente e da avaliação do profissional responsável."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={whatsappUrl("prosthesis")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
            Conversar sobre próteses dentárias
          </Button>
          <Button href="/implantes-dentarios/" variant="outline" arrow>
            Ver implantes dentários
          </Button>
        </div>
      </PageHero>

      <section aria-labelledby="pilares-title" className="border-t border-line bg-white/60 py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Como cuidamos</p>
            <h2 id="pilares-title" className="serif mt-5 text-[2.4rem] sm:text-5xl">
              Cada prótese começa por <em className="text-gold-ink">entender você.</em>
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {prosthesisPoints.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80} className="rounded-2xl border border-line bg-white p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-gold-ink">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="serif mt-6 text-[1.6rem]">{p.title}</h3>
                <p className="mt-3 text-mineral">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="relacao-title" className="py-24 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Implante ou prótese?</p>
            <h2 id="relacao-title" className="serif mt-5 text-[2.4rem] sm:text-5xl">
              Muitas vezes, <em className="text-gold-ink">os dois juntos.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-5 text-lg leading-relaxed text-mineral lg:col-span-7">
            <p>
              A prótese é a parte que substitui o dente ou os dentes. Ela pode se apoiar sobre implantes, sobre dentes naturais ou
              sobre a gengiva, conforme a situação de cada pessoa.
            </p>
            <p>
              Qual combinação faz sentido para você é algo que só a avaliação clínica responde. Nela, o profissional explica as
              alternativas possíveis, as etapas e os cuidados de cada uma.
            </p>
            <div className="flex gap-4 rounded-2xl border border-gold/50 bg-sand p-6 text-[0.95rem]">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
              <p>
                Os tipos de prótese disponíveis e suas indicações são apresentados na consulta, de acordo com cada caso. Os
                resultados variam de pessoa para pessoa.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Steps />
      <Faq items={faq} id="duvidas-proteses" title={<>Dúvidas sobre <em className="text-gold-ink">próteses</em></>} />
      <FinalCta />
    </>
  );
}
