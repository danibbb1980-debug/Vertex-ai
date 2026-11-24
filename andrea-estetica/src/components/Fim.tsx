import { CONFIG, enderecoLinha } from "../config";
import { BotaoWhats, Externo, IconeWhats, Marca } from "./ui";

export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="no-escuro grao relative overflow-hidden bg-ardosia text-linho">
      {/* Arco do relógio, grande e quase apagado */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 210"
        className="pointer-events-none absolute -bottom-2 left-1/2 w-[860px] max-w-none -translate-x-1/2 sm:w-[1100px]"
      >
        <path d="M24 206 A176 176 0 0 1 376 206" fill="none" stroke="var(--color-nevoa)" strokeOpacity=".35" strokeWidth=".6" />
        {Array.from({ length: 14 }, (_, i) => {
          const a = Math.PI + (i / 13) * Math.PI;
          const x1 = 200 + 176 * Math.cos(a);
          const y1 = 206 + 176 * Math.sin(a);
          const x2 = 200 + 168 * Math.cos(a);
          const y2 = 206 + 168 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-nevoa)" strokeOpacity=".45" strokeWidth=".6" />;
        })}
        <line x1="200" y1="206" x2="112" y2="160" stroke="var(--color-ocre-claro)" strokeOpacity=".7" strokeWidth="1" />
      </svg>
      <div className="relative mx-auto max-w-[1240px] px-5 pb-40 pt-28 sm:px-8 sm:pb-56 sm:pt-36">
        <h2 id="t-cta" className="titulo max-w-[14ch] text-[clamp(3rem,8vw,6.4rem)]">
          Escolha o <span className="enfase">seu</span> horário.
        </h2>
        <p className="mt-6 max-w-[30rem] text-nevoa">
          Segunda a sexta até 21h, sábado até 18h30. Chame no WhatsApp e combine com a Andrea.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <BotaoWhats texto="Agendar horário" variante="btn-claro" />
          <Externo href={CONFIG.instagram.url} className="btn btn-linha-claro">
            Ver no Instagram
          </Externo>
        </div>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="bg-linho pb-28 lg:pb-0">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Marca tamanho="rodape" />
          {CONFIG.nomeCompleto.trim() && <p className="mt-6 text-[0.95rem]">{CONFIG.nomeCompleto}</p>}
          <p className={`${CONFIG.nomeCompleto.trim() ? "mt-1" : "mt-6"} text-sm text-cinza`}>
            {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
          </p>
        </div>
        <div className="text-[0.95rem] lg:col-span-4">
          <p className="max-w-[18rem]">{enderecoLinha()}</p>
          <ul className="mt-4 space-y-1">
            {CONFIG.usarWhatsapp && CONFIG.whatsapp && (
              <li>
                <Externo href={`https://wa.me/${CONFIG.whatsapp}`} className="link inline-flex min-h-12 items-center">
                  WhatsApp {CONFIG.whatsappExibicao}
                </Externo>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <Externo href={CONFIG.instagram.url} className="link inline-flex min-h-12 items-center">
                  Instagram
                </Externo>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="link inline-flex min-h-12 items-center">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
        <p className="text-xs leading-relaxed text-cinza lg:col-span-3">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada
          atendimento depende de avaliação individual.
        </p>
      </div>
    </footer>
  );
}

/** Barra fixa no celular e botão flutuante discreto no desktop. */
export function AtalhoAgendar() {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-grafite/20 bg-linho/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <BotaoWhats texto="Agendar horário" className="w-full" />
      </div>
      <a
        href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
          "Olá! Vi o site da Andrea e gostaria de agendar um horário.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 hidden size-14 items-center justify-center border border-linho/40 bg-ardosia text-linho transition-colors hover:bg-grafite lg:flex"
        aria-label="Agendar horário pelo WhatsApp (abre em nova aba)"
      >
        <IconeWhats className="size-6" />
      </a>
    </>
  );
}
