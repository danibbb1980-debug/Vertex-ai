import { CONFIG, waLink } from "../config";
import { Label } from "../components/SectionHead";
import { IconArrow } from "../components/Icons";

const etapas = [
  ["Conversa pelo WhatsApp", "Você conta sobre o seu negócio: o que faz, para quem e o que precisa aparecer no site."],
  ["Rascunho do seu site, sem custo", `Montamos uma primeira versão pensada para o seu segmento. Fica pronta ${CONFIG.prazoRascunho}.`],
  ["Ajustes e aprovação", "Você revisa e pede mudanças de texto, fotos ou ordem das seções. Seguimos só quando estiver do seu jeito."],
  ["Publicação no seu endereço", "O site vai ao ar no domínio da sua empresa, registrado no seu nome. Daí em diante, cuidamos da hospedagem e da manutenção."],
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="como-title" className="on-light relative z-10 bg-ivory py-24 text-cocoa sm:py-32">
      <div className="container-v">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>Como funciona</Label>
            <h2 id="como-title" className="mt-7 text-[clamp(2.4rem,6vw,4.2rem)]">
              Do primeiro oi ao site no ar.
            </h2>
          </div>
          <p className="max-w-sm text-cocoa-2 lg:col-span-4 lg:col-start-9 lg:pb-2">
            Quatro etapas, sem burocracia. Tudo acontece pelo WhatsApp e você decide em cada passo.
          </p>
        </div>

        <ol className="mt-16 grid gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {etapas.map(([t, d], i) => (
            <li key={t} className="border-t border-cocoa/20 pt-6 pb-10">
              <span className="font-serif text-[3.6rem] leading-none text-bronze">{i + 1}</span>
              <h3 className="mt-5 text-[1.25rem] text-cocoa">{t}</h3>
              <p className="mt-2 text-[0.98rem] text-cocoa-2">{d}</p>
            </li>
          ))}
        </ol>

        <a href={waLink()} target="_blank" rel="noopener" className="group mt-4 inline-flex min-h-11 items-center gap-2 font-display text-[0.98rem] text-cocoa">
          <span className="link-line">Começar pela conversa</span>
          <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
