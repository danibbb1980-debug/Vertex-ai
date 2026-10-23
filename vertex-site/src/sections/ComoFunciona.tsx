import { useEffect, useRef, useState } from "react";
import { scroll } from "motion";
import { CONFIG, waLink } from "../config";
import { Em, SectionHead } from "../components/SectionHead";
import { IconArrow } from "../components/Icons";

const etapas = [
  {
    t: "Conversa pelo WhatsApp",
    d: "Você conta sobre o seu negócio: o que faz, para quem e o que precisa aparecer no site.",
  },
  {
    t: "Rascunho do seu site, sem custo",
    d: `Montamos uma primeira versão com design pensado para o seu segmento. Fica pronta ${CONFIG.prazoRascunho}.`,
  },
  {
    t: "Ajustes e aprovação",
    d: "Você revisa e pede mudanças de texto, fotos ou ordem das seções. Seguimos só quando estiver do seu jeito.",
  },
  {
    t: "Publicação no seu endereço",
    d: "O site vai ao ar no domínio da sua empresa, registrado no seu nome. Daí em diante, cuidamos da hospedagem e da manutenção.",
  },
];

export function ComoFunciona() {
  const listRef = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    return scroll((v: number) => setP(v), { target: el, offset: ["start 75%", "end 55%"] });
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="como-title" className="relative z-10 bg-ink-1 py-24 sm:py-32">
      <div className="container-v grid gap-14 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <SectionHead
            id="como-title"
            num="02"
            label="Como funciona"
            title={
              <>
                Do primeiro oi ao site <Em>no ar.</Em>
              </>
            }
            intro="Quatro etapas, sem burocracia. Você acompanha tudo pelo WhatsApp e decide em cada passo."
          />
          <a data-reveal href={waLink()} target="_blank" rel="noopener" className="link-u mt-8 inline-flex items-center gap-2 font-display text-champ">
            Começar pela etapa 1 <IconArrow />
          </a>
        </div>

        <ol ref={listRef} className="relative lg:col-span-6 lg:col-start-7">
          {/* Trilho e progresso */}
          <span className="absolute top-2 bottom-2 left-[19px] w-px bg-pearl/10" aria-hidden="true" />
          <span
            className="absolute top-2 left-[19px] w-px origin-top bg-gradient-to-b from-gold-hi to-gold-lo"
            style={{ height: "calc(100% - 1rem)", transform: `scaleY(${p})` }}
            aria-hidden="true"
          />
          {etapas.map((e, i) => {
            const on = p >= (i / etapas.length) * 0.92;
            return (
              <li key={e.t} className="relative grid grid-cols-[40px_1fr] gap-6 pb-14 last:pb-0">
                <span
                  className={`relative z-10 flex size-10 items-center justify-center rounded-full border font-display text-sm transition-all duration-700 ${
                    on ? "border-gold-hi bg-ink-0 text-gold-hi shadow-[0_0_0_6px_rgba(201,162,75,0.08)]" : "border-pearl/15 bg-ink-1 text-dim"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className={`text-[1.45rem] transition-colors duration-700 sm:text-[1.65rem] ${on ? "text-pearl" : "text-mist"}`}>{e.t}</h3>
                  <p className={`mt-3 max-w-md transition-colors duration-700 ${on ? "text-mist" : "text-dim"}`}>{e.d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
