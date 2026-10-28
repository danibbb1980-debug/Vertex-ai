import type { PointerEvent, ComponentType, SVGProps } from "react";
import { CONFIG, linkWhatsApp } from "../config";
import { Secao, Cabecalho } from "../components/Secao";
import { Lua, Estrela, Brilho, WhatsApp, Blob } from "../components/Icones";

type Fase = {
  titulo: string;
  subtitulo: string;
  texto: string;
  mensagem: string;
  Icone: ComponentType<SVGProps<SVGSVGElement> & { tamanho?: number }>;
  luz: string;
  fundo: string;
};

const FASES: Fase[] = [
  {
    titulo: "Bebês",
    subtitulo: "Os primeiros dentes",
    texto:
      "Os primeiros dentinhos chegam com muitas dúvidas. A consulta é um momento para a família conversar sobre higiene, alimentação e hábitos, com orientações adequadas à idade.",
    mensagem: CONFIG.mensagens.bebe,
    Icone: Lua,
    luz: "var(--color-menta)",
    fundo: "text-menta-claro",
  },
  {
    titulo: "Crianças",
    subtitulo: "Uma fase de descobertas",
    texto:
      "O atendimento respeita o ritmo da criança, com explicações simples e acolhedoras, e acompanha o crescimento e os cuidados do dia a dia.",
    mensagem: CONFIG.mensagens.crianca,
    Icone: Estrela,
    luz: "var(--color-rosa)",
    fundo: "text-rosa-claro",
  },
  {
    titulo: "Adolescentes",
    subtitulo: "Mais autonomia",
    texto:
      "A conversa é direta e respeitosa. O adolescente participa das decisões sobre o próprio cuidado, junto com a família.",
    mensagem: CONFIG.mensagens.adolescente,
    Icone: Brilho,
    luz: "var(--color-manteiga)",
    fundo: "text-manteiga-claro",
  },
];

/** Luz suave que acompanha o cursor (adaptado do Spotlight do 21st.dev): atualiza só variáveis CSS. */
function moverLuz(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Atendimento() {
  return (
    <Secao id="atendimento">
      <div className="container-site">
        <Cabecalho
          id="atendimento"
          eyebrow="Atendimento por fase"
          titulo="Um cuidado para cada *fase*."
          texto={<p>{`Do primeiro dentinho à adolescência: ${CONFIG.descricaoAtendimento}, com orientação para a família em cada etapa.`}</p>}
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
          {FASES.map((f, i) => (
            <li
              key={f.titulo}
              onPointerMove={moverLuz}
              className="cartao-luz revelar group flex flex-col overflow-hidden rounded-xl3 bg-white/85 p-7 ring-1 ring-areia transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-8 [@media(hover:hover)]:hover:-translate-y-1"
              style={{ ["--luz" as string]: f.luz, ["--atraso" as string]: `${i * 0.12}s` }}
            >
              <div className="relative h-16 w-16">
                <Blob variante={((i % 3) + 1) as 1 | 2 | 3} className={`absolute inset-0 h-full w-full ${f.fundo}`} />
                <f.Icone tamanho={30} className="absolute inset-0 m-auto text-cacau" />
              </div>
              <p className="mt-7 text-sm font-bold uppercase tracking-[0.12em] text-taupe-texto">{f.subtitulo}</p>
              <h3 className="mt-1.5 text-[2rem] font-medium">{f.titulo}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-cacau-2">{f.texto}</p>
              <p className="mt-5 text-sm italic text-taupe-texto">Cada caso depende de avaliação individual.</p>
              <a
                href={linkWhatsApp(f.mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 items-center gap-2.5 self-start rounded-full bg-creme px-5 py-3 font-bold text-menta-profundo ring-1 ring-inset ring-menta/70 transition-colors hover:bg-menta-claro"
              >
                <WhatsApp tamanho={18} />
                Conversar sobre esta fase
                <span className="sr-only">: {f.titulo.toLowerCase()} (abre o WhatsApp)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}
