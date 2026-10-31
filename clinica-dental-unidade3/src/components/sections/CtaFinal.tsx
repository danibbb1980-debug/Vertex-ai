import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { Botao } from "../ui/Botao";
import { IconeInstagram, IconeWhatsApp } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { comEnfase } from "../ui/TituloSecao";

export function CtaFinal() {
  const { unidade } = useUnidade();
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative isolate overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
      <div className="filete absolute inset-x-0 top-0" aria-hidden="true" />
      <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full" viewBox="0 0 1440 160" preserveAspectRatio="none" fill="none">
        <path d="M0 110 C 240 60, 480 150, 720 110 S 1200 60, 1440 100 V160 H0Z" fill="var(--color-navy-800)" />
        <path d="M0 110 C 240 60, 480 150, 720 110 S 1200 60, 1440 100" stroke="var(--color-gold-400)" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-site relative text-center">
        <Revelar>
          <p className="rotulo text-gold-300">{CONFIG.marca} · {unidade.nomeCurto}</p>
          <h2 id="titulo-cta" className="mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.05] sm:text-6xl">
            {comEnfase("Sua avaliação é o primeiro *passo*.", "text-teal-300")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Fale com a equipe, tire suas dúvidas e combine o horário que funciona para você.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Botao href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)} externo variante="claro" icone={<IconeWhatsApp tamanho={19} className="text-teal-600" />} className="min-h-14 px-7">
              Agendar pelo WhatsApp
            </Botao>
            <Botao href={unidade.instagram.url} externo variante="contornoClaro" icone={<IconeInstagram tamanho={19} />} className="min-h-14 px-7">
              Ver no Instagram
            </Botao>
          </div>
          {CONFIG.secoes.agendamento && (
            <a href="#agendar" className="mt-6 inline-flex min-h-12 items-center text-sm text-white/75 underline decoration-gold-400 underline-offset-[6px] hover:text-white">
              Prefere preencher? Solicite um horário pelo formulário
            </a>
          )}
        </Revelar>
      </div>
    </section>
  );
}
