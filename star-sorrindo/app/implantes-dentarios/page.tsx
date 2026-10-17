import { AlertCircle } from "lucide-react";
import { faqFor } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ImplantIllustration } from "@/components/ui/ImplantIllustration";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { PageHero } from "@/components/sections/PageHero";
import { implantTopics } from "@/components/sections/Implants";
import { ClinicalCases } from "@/components/sections/ClinicalCases";
import { Steps } from "@/components/sections/Steps";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata = pageMetadata({
  title: "Implante dentário em Poços de Caldas",
  description:
    "Entenda o que são implantes dentários, quando podem ser indicados e como funciona o planejamento. Agende uma avaliação na Star Sorrindo, no Centro de Poços de Caldas.",
  path: "/implantes-dentarios/",
});

const crumbs = [
  { name: "Início", path: "/" },
  { name: "Implantes dentários", path: "/implantes-dentarios/" },
];

const parts = [
  { name: "Implante", text: "A peça instalada no osso, que funciona como uma raiz e dá suporte ao dente." },
  { name: "Pilar", text: "A conexão entre o implante e a parte visível. Fica na altura da gengiva." },
  { name: "Coroa ou prótese", text: "A parte que substitui o dente, planejada para a mastigação e a estética de cada caso." },
];

export default function ImplantsPage() {
  const faq = faqFor("implants");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faq)} />
      <PageHero
        eyebrow="Implantes dentários"
        crumbs={crumbs}
        title={
          <>
            Implantes dentários em <em className="text-gold-ink">Poços de Caldas.</em>
          </>
        }
        intro="A perda de um ou mais dentes pode afetar a mastigação, a fala e a confiança ao sorrir. Os implantes podem ser uma alternativa para determinados pacientes — e o primeiro passo é sempre uma avaliação individual."
        aside={
          <div className="mx-auto max-w-md rounded-[2rem] border border-line bg-[linear-gradient(160deg,#ffffff,#f2ece2)] p-8">
            <ImplantIllustration className="h-auto w-full" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={whatsappUrl("implants")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
            Quero saber mais sobre implantes
          </Button>
          <Button href="#entenda" variant="outline" arrow>
            Entenda o tratamento
          </Button>
        </div>
      </PageHero>

      <section id="entenda" aria-labelledby="entenda-title" className="border-t border-line bg-white/60 py-24 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Como funciona</p>
            <h2 id="entenda-title" className="serif mt-5 text-[2.4rem] sm:text-5xl">
              As três partes de um <em className="text-gold-ink">implante.</em>
            </h2>
          </Reveal>
          <ol className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {parts.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 90} className="rounded-2xl border border-line bg-white p-8">
                <span className="serif text-4xl text-gold-ink">0{i + 1}</span>
                <h3 className="serif mt-6 text-[1.7rem]">{p.name}</h3>
                <p className="mt-3 text-mineral">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="topicos-title" className="py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">O que você precisa saber</p>
            <h2 id="topicos-title" className="serif mt-5 text-[2.4rem] sm:text-5xl">
              Informação clara para uma <em className="text-gold-ink">decisão consciente.</em>
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {implantTopics.map((t, i) => (
              <Reveal as="li" key={t.title} delay={(i % 3) * 80} className="bg-ivory p-8 sm:p-10">
                <span className="serif text-xl text-gold-ink">0{i + 1}</span>
                <h3 className="serif mt-4 text-[1.7rem]">{t.title}</h3>
                <p className="mt-3 leading-relaxed text-mineral">{t.text}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-10 flex gap-4 rounded-2xl border border-gold/50 bg-sand p-6 sm:p-8">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
            <p className="text-[0.95rem] leading-relaxed text-mineral">
              <strong className="font-semibold text-navy">Importante:</strong> o conteúdo desta página é informativo. Nem todas as
              pessoas têm indicação para implantes, e etapas, prazos e valores só podem ser definidos após avaliação clínica com o
              profissional responsável.
            </p>
          </Reveal>
        </div>
      </section>

      <ClinicalCases id="casos-implantes" />
      <Steps />
      <section aria-label="Tratamento relacionado" className="pb-8">
        <div className="container-site">
          <a
            href="/proteses-dentarias/"
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-8 transition-colors hover:border-gold sm:flex-row sm:items-center"
          >
            <span>
              <span className="eyebrow">Tratamento relacionado</span>
              <span className="serif mt-3 block text-3xl">Próteses dentárias</span>
            </span>
            <span className="text-sm font-semibold text-gold-ink">
              <span className="link-line">Conhecer</span> →
            </span>
          </a>
        </div>
      </section>
      <Faq items={faq} id="duvidas-implantes" title={<>Dúvidas sobre <em className="text-gold-ink">implantes</em></>} />
      <FinalCta />
    </>
  );
}
