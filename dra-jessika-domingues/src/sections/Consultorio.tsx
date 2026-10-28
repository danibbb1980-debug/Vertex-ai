import { CONFIG } from "../config";
import { Sparkle } from "../components/Decor";
import { IconChat, IconHeart, IconSprout } from "../components/Icons";
import { CabecalhoSecao, Confirmar, Pendente } from "../components/ui";

const PILARES = [
  {
    Icone: IconHeart,
    titulo: "Acolhimento",
    texto: "Receber a criança e a família com calma, apresentando o espaço e as pessoas antes de qualquer etapa.",
  },
  {
    Icone: IconChat,
    titulo: "Explicação clara aos pais",
    texto: "Contar o que foi observado e quais são as orientações, em linguagem simples e com tempo para perguntas.",
  },
  {
    Icone: IconSprout,
    titulo: "Cuidado em cada fase",
    texto: "Do bebê ao adolescente, as orientações acompanham o momento de cada criança e mudam conforme ela cresce.",
  },
];

export function Consultorio() {
  return (
    <section id="consultorio" aria-labelledby="titulo-consultorio" className="relative py-20 md:py-28">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <CabecalhoSecao
            id="titulo-consultorio"
            eyebrow="O consultório"
            titulo="Cada criança tem o seu *tempo*."
          />
          {CONFIG.rascunho && !CONFIG.nomeConsultorio ? (
            <p className="reveal mt-5 text-sm text-muted">
              Nome do consultório: <Pendente />
            </p>
          ) : null}
        </div>
        <div className="reveal space-y-5 text-lg lg:col-span-6 lg:pt-10" style={{ ["--d" as string]: "120ms" }}>
          <p>
            Aqui, a consulta começa antes da cadeira: com uma conversa, um olhar pelo espaço e lugar para as perguntas
            da família.
          </p>
          <p>
            A Dra. Jessika explica cada passo para a criança, com palavras do mundo dela, e para os pais, com clareza.
            Sem pressa, respeitando o ritmo de cada um.
          </p>
        </div>
      </div>

      <div className="container-site mt-16">
        <div className="reveal mb-6 flex items-center gap-3">
          <Sparkle filled className="h-4 w-4 text-coral" />
          <h3 className="font-sans text-sm font-extrabold tracking-[0.14em] text-ink uppercase">
            Nossos compromissos
          </h3>
          <Confirmar texto="validar com a doutora" />
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {PILARES.map(({ Icone, titulo, texto }, i) => (
            <li
              key={titulo}
              className="reveal card relative p-7 md:p-8"
              style={{ ["--d" as string]: `${i * 110}ms` }}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-sage-deep">
                <Icone size={24} />
              </span>
              <h4 className="mt-5 font-display text-[1.45rem] leading-tight text-ink">{titulo}</h4>
              <p className="mt-3 text-body">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
