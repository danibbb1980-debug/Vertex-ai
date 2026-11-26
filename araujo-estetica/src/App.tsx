import { CONFIG, servicosAtivos } from "./config";
import {
  Draft, Header, Hero, Servicos, Cuidado, Silencio, ComoFunciona, Trabalhos, Horarios,
  Duvidas, Contato, CtaFinal, Footer, FixedCta, temTrabalhos,
} from "./sections";
import { Agendar } from "./Agendar";
import { useReveal } from "./motion";

/** Numeração das seções segue a ordem do que de fato aparece. */
function numerar() {
  const s = CONFIG.secoes;
  const ordem = [
    ["servicos", s.servicos && servicosAtivos.length > 0],
    ["cuidado", s.cuidado],
    ["comoFunciona", s.comoFunciona],
    ["trabalhos", s.trabalhos && temTrabalhos],
    ["horarios", s.horarios],
    ["duvidas", s.duvidas],
    ["contato", s.contato],
    ["agendar", s.agendar && CONFIG.usarWhatsapp],
  ] as const;
  const map: Record<string, string> = {};
  let i = 1;
  for (const [k, on] of ordem) if (on) map[k] = String(i++).padStart(2, "0");
  return map;
}

export function App() {
  useReveal();
  const n = numerar();
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Draft />
      <Header />
      <main id="conteudo">
        <Hero />
        <Servicos n={n.servicos} />
        <Cuidado n={n.cuidado} />
        <Silencio />
        <ComoFunciona n={n.comoFunciona} />
        <Trabalhos n={n.trabalhos} />
        <Horarios n={n.horarios} />
        <Duvidas n={n.duvidas} />
        <Contato n={n.contato} />
        <Agendar n={n.agendar} />
        <CtaFinal />
      </main>
      <Footer />
      <FixedCta />
    </>
  );
}

export function Privacidade() {
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Draft />
      <Header home={false} />
      <main id="conteudo" className="page">
        <div className="wrap">
          <div className="prose">
          <h1 className="h2">Privacidade</h1>
          <p style={{ marginTop: "var(--s-4)" }}>
            Este site da {CONFIG.nome} é uma página informativa. Ele não tem cadastro, não usa cookies, não usa
            ferramentas de análise de visitas e não guarda nenhum dado que você digita.
          </p>
          <h2>O formulário “Pedir horário”</h2>
          <ul>
            <li>O formulário só monta uma mensagem de texto no seu próprio navegador.</li>
            <li>Ao enviar, o site abre o WhatsApp com essa mensagem pronta. Nada é enviado a outro servidor.</li>
            <li>A mensagem só chega à Araujo se você apertar “enviar” no WhatsApp.</li>
            <li>A partir daí, a conversa segue as regras de privacidade do próprio WhatsApp.</li>
          </ul>
          <h2>O mapa</h2>
          <p>
            A seção de localização carrega um mapa do Google quando você chega até ela. O Google pode registrar
            essa visualização conforme a política de privacidade dele.
          </p>
          <h2>Dúvidas</h2>
          <p>
            Fale com a Araujo pelo WhatsApp {CONFIG.whatsappExibicao}.
          </p>
          <p style={{ marginTop: "var(--s-5)" }}>
            <a className="btn btn-ghost" href="/">Voltar ao site</a>
          </p>
          </div>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}

export function NaoEncontrada() {
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Draft />
      <Header home={false} />
      <main id="conteudo" className="page">
        <div className="wrap">
          <p className="hero-eyebrow">Erro 404</p>
          <h1 className="cta-name" style={{ marginTop: "var(--s-2)" }}>404</h1>
          <p className="lead" style={{ margin: "var(--s-4) 0 var(--s-5)" }}>
            Esta página não existe. O endereço pode ter mudado ou ter sido digitado com erro.
          </p>
          <div className="btns">
            <a className="btn btn-primary" href="/">Ir para o início</a>
            {CONFIG.usarWhatsapp && (
              <a className="btn btn-ghost" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

