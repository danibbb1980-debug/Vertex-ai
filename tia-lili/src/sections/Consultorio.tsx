import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { Secao, Cabecalho } from "../components/Secao";
import { Foto } from "../components/Foto";
import { Brilho, Estrela, Lua } from "../components/Icones";

// Pilares propostos como compromissos do atendimento. CONFIRMAR COM A CLÍNICA (validar o texto com a doutora).
const PILARES = [
  {
    titulo: "Acolhimento",
    texto: "Receber a criança e a família com calma, apresentar o espaço e respeitar o tempo de cada um.",
  },
  {
    titulo: "Explicação clara aos pais",
    texto: "Contar o que foi observado e quais são os próximos passos com palavras simples, sempre com espaço para perguntas.",
  },
  {
    titulo: "Cuidado em cada fase",
    texto: "Orientações pensadas para cada idade, do bebê ao adolescente, acompanhando o crescimento.",
  },
];

export function Consultorio() {
  return (
    <Secao id="consultorio">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Cabecalho
            id="consultorio"
            eyebrow="O consultório"
            titulo="No *tempo* de cada criança."
            texto={
              <>
                <p>
                  Cada criança chega de um jeito: curiosa, tímida, cheia de perguntas ou um pouco desconfiada. Por isso, o
                  atendimento começa por conhecer quem ela é.
                </p>
                <p className="mt-4">
                  Com paciência, cada passo é apresentado com palavras que ela entende. E a família acompanha tudo de perto,
                  sabendo o que está sendo feito e por quê.
                </p>
              </>
            }
          />
        </div>
        <figure className="revelar relative lg:col-span-5 lg:mt-10" style={{ ["--atraso" as string]: ".15s" }}>
          <div className="overflow-hidden rounded-xl3 rounded-tr-[7rem] bg-creme-2">
            <Foto
              nome={CONFIG.fotos.recepcao.arquivo}
              alt={CONFIG.fotos.recepcao.alt}
              sizes="(min-width: 1024px) 34vw, 92vw"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm font-semibold text-taupe-texto">Recepção do consultório, no Centro de Poços de Caldas.</figcaption>
          <Brilho tamanho={28} className="absolute -left-4 top-10 text-manteiga" />
        </figure>
      </div>
        <ol className="container-site relative mt-14 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-5">
          {PILARES.map((p, i) => (
            <li
              key={p.titulo}
              className="revelar rounded-xl2 bg-white/80 p-7 ring-1 ring-areia"
              style={{ ["--atraso" as string]: `${i * 0.1}s` }}
            >
              <span className="font-display text-sm italic text-malva" aria-hidden>
                0{i + 1}
              </span>
              <h3 className="mt-2 text-xl font-medium">{p.titulo}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-taupe-texto">{p.texto}</p>
            </li>
          ))}
        </ol>
    </Secao>
  );
}

const ITENS_FAIXA = ["Bebês", "Crianças", "Adolescentes", "Atendimento com agendamento", "Centro de Poços de Caldas", "Tia Lili"];

/** Marquee discreto e decorativo (inspirado no Marquee do 21st.dev): pausa no hover, fora da tela e com movimento reduzido. */
export function Faixa() {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const icones = [Estrela, Lua, Brilho];
  const sequencia = (chave: string) =>
    ITENS_FAIXA.map((t, i) => {
      const Icone = icones[i % icones.length];
      return (
        <span key={`${chave}-${t}`} className="flex shrink-0 items-center gap-8 pr-8">
          <span className="font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] italic font-[350] text-cacau-2">{t}</span>
          <Icone tamanho={22} className={["text-malva", "text-menta-escuro", "text-manteiga"][i % 3]} />
        </span>
      );
    });
  return (
    <div ref={ref} className={`marquee relative z-[1] border-y border-areia/80 bg-creme py-6 ${visivel ? "" : "pausado"}`} aria-hidden>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-trilha flex w-max">
          {sequencia("a")}
          {sequencia("b")}
        </div>
      </div>
    </div>
  );
}
