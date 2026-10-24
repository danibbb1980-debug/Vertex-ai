import { useState } from "react";
import { CONFIG, waLink } from "../config";
import { Label } from "../components/SectionHead";
import { IconPlus } from "../components/Icons";

const faqs = [
  ["É realmente sem custo para começar?", "Sim. O rascunho é feito sem custo e sem compromisso. Você só paga se aprovar o site e decidir seguir."],
  ["Quanto tempo leva o rascunho?", `Fica pronto ${CONFIG.prazoRascunho}. O tempo depende do tamanho do site e de quando recebemos as informações do seu negócio.`],
  ["Preciso ter Instagram ou fotos?", "Não é obrigatório. Se você tiver fotos e textos, usamos. Se não tiver, montamos o rascunho com imagens provisórias e indicamos o que vale fotografar depois. A produção de fotos e vídeos não está inclusa."],
  ["O que acontece se eu cancelar?", "Não há fidelidade nem multa. O site continua no ar até o fim do período já pago e depois sai do ar. O domínio continua sendo seu."],
  ["Quem cuida das atualizações?", "A Vertex. Pequenos ajustes de texto e foto estão inclusos: é só pedir pelo WhatsApp. Páginas novas e reformulações grandes são orçadas à parte."],
  ["A Vertex faz anúncios ou gerencia redes sociais?", "Não. Nosso trabalho é o site. Anúncios e gestão de redes sociais não fazem parte dos planos."],
  ["O domínio é meu?", "Sim. O domínio, que é o endereço do site (como suaempresa.com.br), fica registrado no seu nome e é pago por você."],
  ["Como funciona o pagamento?", "Por boleto ou cartão, todo mês, e só depois que você aprovar o site. Nada é cobrado na fase do rascunho."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" aria-labelledby="faq-title" className="relative z-10 bg-ink-1 py-24 sm:py-32">
      <div className="container-v grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label>Dúvidas</Label>
          <h2 id="faq-title" className="mt-7 text-[clamp(2.3rem,5vw,3.6rem)] text-pearl">
            Perguntas frequentes.
          </h2>
          <p className="mt-6 max-w-xs text-mist">
            Não achou a sua?{" "}
            <a href={waLink()} target="_blank" rel="noopener" className="link-line text-champ">
              Pergunte no WhatsApp
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-pearl/10">
            {faqs.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <li key={q} className="border-b border-pearl/10">
                  <h3 className="text-[1.1rem] sm:text-[1.2rem]">
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-pearl"
                    >
                      <span className="transition-colors group-hover:text-champ">{q}</span>
                      <span className={`shrink-0 transition-transform duration-500 ${isOpen ? "rotate-45 text-gold-hi" : "text-mist"}`}>
                        <IconPlus className="size-5" />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="acc-panel" data-open={isOpen}>
                    <div>
                      <p className="max-w-2xl pb-7 pr-12 text-mist">
                        {a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
