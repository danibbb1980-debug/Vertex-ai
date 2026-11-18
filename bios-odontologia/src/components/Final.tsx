import { useEffect, useState } from "react";
import { CONFIG, enderecoLinha, temResponsavel, waLink } from "../config";
import { Logotipo } from "./Logo";
import { AroLente, Regua } from "./Regua";
import { CONTEINER } from "./Secoes1";
import { LINKS } from "./Cabecalho";

/* ============================== CTA FINAL ============================== */
export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro grao relative overflow-hidden bg-grafite text-pedra">
      <AroLente
        className="pointer-events-none absolute -right-24 top-1/2 size-[26rem] -translate-y-1/2 text-bronze/70 sm:-right-16 sm:size-[34rem] lg:right-[4%] lg:size-[38rem]"
        espessura={1}
      />
      <div className={`${CONTEINER} relative z-[1] py-24 sm:py-32`}>
        <h2 id="titulo-cta" className="t-display m-0 max-w-[14ch]">
          A avaliação é o primeiro <em>passo</em>.
        </h2>
        <p className="mt-6 max-w-[40ch] text-cinza-claro">
          {CONFIG.endereco.rua}, {CONFIG.endereco.numero}, {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}.
          Atendimento com horário marcado.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {CONFIG.usarWhatsapp && (
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
              Agendar avaliação
            </a>
          )}
          <a href={CONFIG.telefoneLink} className="botao botao-linha">
            Ligar {CONFIG.telefone}
          </a>
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================== RODAPÉ ============================== */
export function Rodape() {
  const rt = temResponsavel();
  return (
    <footer className="escuro bg-grafite pb-28 text-pedra lg:pb-10">
      <div className={CONTEINER}>
        <Regua cor="#A8894F" />
        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logotipo tom="escuro" className="h-auto w-[15rem] sm:w-[18rem]" />
            <p className="mb-0 mt-8 font-display text-xl">{CONFIG.nome}</p>
            {rt && (
              <p className="mb-0 mt-3 text-[0.9375rem] text-cinza-claro">
                Responsável técnico: {CONFIG.responsavelTecnico.nome} · {CONFIG.responsavelTecnico.cro}
                {CONFIG.registroCRO && (
                  <>
                    <br />
                    Inscrição da entidade no CRO: {CONFIG.registroCRO}
                  </>
                )}
              </p>
            )}
          </div>

          <div className="md:col-span-4">
            <h2 className="rotulo m-0 font-sans text-bronze-claro">Contato</h2>
            <address className="mt-4 not-italic leading-relaxed text-cinza-claro">
              {enderecoLinha()}
              <br />
              CEP {CONFIG.endereco.cep}
            </address>
            <ul className="mt-4 list-none p-0 leading-relaxed">
              {CONFIG.usarWhatsapp && (
                <li>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-nav num inline-block py-1.5">
                    WhatsApp {CONFIG.whatsappExibicao}
                  </a>
                </li>
              )}
              <li>
                <a href={CONFIG.telefoneLink} className="link-nav num inline-block py-1.5">
                  Telefone {CONFIG.telefone}
                </a>
              </li>
              {CONFIG.telefone2 && (
                <li>
                  <a href={CONFIG.telefone2Link} className="link-nav num inline-block py-1.5">
                    Telefone {CONFIG.telefone2}
                  </a>
                </li>
              )}
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-nav inline-block py-1.5">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="rotulo m-0 font-sans text-bronze-claro">Navegação</h2>
            <ul className="mt-4 list-none p-0 leading-relaxed">
              {LINKS.filter((l) => CONFIG.secoes[l.secao]).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-nav inline-block py-1.5">
                    {l.rotulo}
                  </a>
                </li>
              ))}
              <li>
                <a href="/privacidade.html" className="link-nav inline-block py-1.5">
                  Privacidade
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-6 text-[0.8125rem] leading-relaxed text-cinza-claro md:flex-row md:justify-between md:gap-10">
          <p className="m-0 max-w-[70ch]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitado.
          </p>
          <p className="m-0 shrink-0">
            © {new Date().getFullYear()} {CONFIG.nomeCurto}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================== CONVERSÃO FIXA ============================== */
/** celular: barra fixa WhatsApp + Ligar. Desktop: botão flutuante discreto depois do hero. */
export function AcoesFixas() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    // aparece depois do hero; some sobre o formulário e o rodapé para não cobrir conteúdo
    const cobertos = new Set<Element>();
    let passouHero = false;
    const atualizar = () => setVisivel(passouHero && cobertos.size === 0);
    const on = () => {
      passouHero = window.scrollY > window.innerHeight * 0.6;
      atualizar();
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? cobertos.add(e.target) : cobertos.delete(e.target)));
      atualizar();
    });
    document.querySelectorAll("#agendar, footer").forEach((el) => io.observe(el));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      io.disconnect();
    };
  }, []);
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-grafite bg-pedra pb-[env(safe-area-inset-bottom)] lg:hidden">
        {CONFIG.usarWhatsapp && (
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-center bg-grafite font-semibold text-pedra"
          >
            WhatsApp
          </a>
        )}
        <a
          href={CONFIG.telefoneLink}
          className={`flex min-h-14 items-center justify-center font-semibold text-grafite ${CONFIG.usarWhatsapp ? "" : "col-span-2"}`}
        >
          Ligar
        </a>
      </div>
      {CONFIG.usarWhatsapp && (
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar avaliação pelo WhatsApp"
          tabIndex={visivel ? 0 : -1}
          aria-hidden={!visivel}
          className={`botao botao-cheio fixed bottom-6 right-6 z-40 hidden !min-h-12 transition-[opacity,transform] duration-300 lg:inline-flex ${
            visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" strokeLinejoin="round" />
          </svg>
          WhatsApp
        </a>
      )}
    </>
  );
}
