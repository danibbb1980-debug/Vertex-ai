import { CONFIG, temRegistro } from "../config";
import { Botao } from "../components/Botao";
import { IconeInstagram, IconeWhatsApp } from "../components/Icones";
import { Marca } from "../components/Marca";
import { Revelar } from "../components/Revelar";
import { waLink } from "../lib/whatsapp";
import { pausaAlmoco, resumoSemanal } from "../lib/horarios";

export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal || !CONFIG.whatsapp) return null;
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-cacau py-28 text-center text-marfim sm:py-36">
      <div aria-hidden="true" className="filete absolute inset-x-0 top-0" />
      <div className="container-site relative z-[1]">
        <Revelar>
          <p className="rotulo text-ouro-claro">O próximo passo</p>
          <h2 id="titulo-cta" className="mx-auto mt-5 max-w-3xl text-[2.6rem] text-marfim sm:text-6xl lg:text-7xl">
            Sua avaliação é o <em className="enfase">primeiro</em> passo.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-marfim/80">Conte o que você procura. A equipe responde pelo WhatsApp e confirma a disponibilidade.</p>
        </Revelar>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          <span data-fio="fim" className="inline-flex">
            <Botao href={waLink()} externo variante="claro" icone={<IconeWhatsApp className="h-5 w-5" />}>Agendar pelo WhatsApp</Botao>
          </span>
          {CONFIG.instagram.url && (
            <Botao href={CONFIG.instagram.url} externo variante="contorno-claro" icone={<IconeInstagram className="h-5 w-5" />}>Ver no Instagram</Botao>
          )}
        </div>
        {CONFIG.secoes.agendamento && (
          <p className="mt-10 text-[0.95rem] text-marfim/75">
            Prefere preencher? <a href="#agendar" className="text-ouro-claro underline underline-offset-4">Solicite pelo formulário</a>.
          </p>
        )}
      </div>
    </section>
  );
}

export function Rodape() {
  const e = CONFIG.endereco;
  const pausa = pausaAlmoco();
  return (
    <footer className="escuro bg-cacau-2 pb-28 pt-16 text-marfim/80 lg:pb-12">
      <div className="container-site grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Marca escuro />
          {temRegistro() && <p className="mt-5 text-sm">{CONFIG.profissional.titulo} · {CONFIG.profissional.registro}</p>}
          <p className="mt-5 max-w-sm text-sm">Conteúdo informativo. A indicação de cada atendimento depende de avaliação individual.</p>
        </div>
        <div className="text-sm">
          <p className="rotulo text-ouro-claro">Endereço</p>
          <address className="mt-3 not-italic">{e.rua}<br />{e.bairro}<br />{e.cidade} - {e.uf}, {e.cep}</address>
          <ul className="mt-4 space-y-0.5">
            {resumoSemanal().map((g) => <li key={g.dias}>{g.dias}: {g.texto}</li>)}
            {pausa && <li>Pausa para almoço: {pausa}</li>}
          </ul>
        </div>
        <div className="text-sm">
          <p className="rotulo text-ouro-claro">Contato</p>
          <ul className="mt-3 space-y-1">
            {CONFIG.whatsapp && <li><a className="inline-flex min-h-12 items-center underline-offset-4 hover:underline" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {CONFIG.whatsappExibicao}</a></li>}
            {CONFIG.instagram.url && <li><a className="inline-flex min-h-12 items-center underline-offset-4 hover:underline" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
            <li><a className="inline-flex min-h-12 items-center underline-offset-4 hover:underline" href="/privacidade.html">Privacidade</a></li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 border-t border-marfim/10 pt-6 text-xs text-marfim/60">
        © {new Date().getFullYear()} {CONFIG.marca.nome} · {CONFIG.cidade} - {CONFIG.uf}
      </div>
    </footer>
  );
}

/** Barra fixa no celular + botão flutuante discreto no desktop. */
export function BarraWhatsApp() {
  if (!CONFIG.whatsapp) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ouro/30 bg-marfim/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-mauve font-medium text-marfim">
          <IconeWhatsApp className="h-5 w-5" /> Agendar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full border border-ouro/50 bg-marfim text-mauve shadow-[0_12px_30px_-12px_rgba(46,33,36,0.45)] transition-transform duration-500 hover:-translate-y-0.5 lg:grid"
      >
        <IconeWhatsApp className="h-6 w-6" />
      </a>
    </>
  );
}
