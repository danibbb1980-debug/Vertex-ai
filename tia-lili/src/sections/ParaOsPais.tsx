import { Secao, Cabecalho } from "../components/Secao";
import { AConfirmar } from "../components/Botoes";
import { Brilho, Copo, Lua, Estrela } from "../components/Icones";

const BLOCOS = [
  {
    titulo: "Na primeira visita",
    Icone: Estrela,
    texto: (
      <>
        É um momento de conhecer. A criança vê o espaço, conversa com a doutora e é avaliada no ritmo dela. Você conta a
        história do seu filho e tira as suas dúvidas.
      </>
    ),
  },
  {
    titulo: "Como preparar a criança",
    Icone: Lua,
    texto: (
      <>
        Fale da consulta com naturalidade, alguns dias antes. Use frases simples e verdadeiras, sem prometer o que ninguém
        pode garantir, e evite usar o dentista como ameaça ou castigo.
      </>
    ),
  },
  {
    titulo: "Durante o atendimento",
    Icone: Copo,
    texto: (
      <>
        Os pais acompanham o atendimento conforme a rotina da clínica <AConfirmar>[A CONFIRMAR]</AConfirmar>. Ao final, a
        doutora explica o que observou e quais são os próximos passos.
      </>
    ),
  },
];

const AJUDAM = [
  "“Vamos conhecer a Tia Lili, que cuida do sorriso das crianças.”",
  "“Ela vai contar e olhar os seus dentes.”",
  "“Se quiser, você pode fazer perguntas para ela.”",
];
const EVITAR = [
  { frase: "“Não vai doer nada.”", motivo: "cria uma expectativa que ninguém pode garantir" },
  { frase: "“Se não se comportar, o dentista vai brigar.”", motivo: "transforma a consulta em castigo" },
  { frase: "“É rapidinho, fica quietinho.”", motivo: "a criança se sente apressada" },
];

export function ParaOsPais() {
  return (
    <Secao id="para-os-pais">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-xl3 bg-menta-claro px-4 py-12 sm:px-6 md:px-14 md:py-20">
          <Brilho tamanho={40} className="absolute right-8 top-8 text-white/90 md:right-14 md:top-14" />
          <Cabecalho
            className="px-2 sm:px-0"
            id="para-os-pais"
            eyebrow="Para os pais"
            titulo="O que *esperar* da primeira visita."
            texto={<p>Um pouco de informação ajuda a família a chegar mais tranquila. Aqui vai o essencial.</p>}
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {BLOCOS.map((b, i) => (
              <li key={b.titulo} className="revelar rounded-xl2 bg-creme/90 p-6 md:p-7" style={{ ["--atraso" as string]: `${i * 0.1}s` }}>
                <b.Icone tamanho={28} className="text-menta-profundo" />
                <h3 className="mt-4 text-[1.4rem] font-medium">{b.titulo}</h3>
                <p className="mt-2.5 leading-relaxed text-cacau-2">{b.texto}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="revelar rounded-xl2 bg-white p-6 md:p-8">
              <h3 className="text-[1.4rem] font-medium">
                Frases que <em className="enfase">ajudam</em>
              </h3>
              <ul className="mt-5 space-y-3.5">
                {AJUDAM.map((f) => (
                  <li key={f} className="flex gap-3 font-display text-[1.1rem] leading-snug">
                    <Estrela tamanho={18} className="mt-1 shrink-0 text-menta-escuro" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="revelar rounded-xl2 bg-white p-6 md:p-8" style={{ ["--atraso" as string]: ".1s" }}>
              <h3 className="text-[1.4rem] font-medium">
                Frases que é melhor <em className="enfase">evitar</em>
              </h3>
              <ul className="mt-5 space-y-3.5">
                {EVITAR.map((f) => (
                  <li key={f.frase} className="flex gap-3">
                    <span className="mt-[0.6rem] h-0.5 w-3.5 shrink-0 rounded-full bg-malva" aria-hidden />
                    <span>
                      <span className="font-display text-[1.1rem] leading-snug">{f.frase}</span>{" "}
                      <span className="text-[0.95rem] text-taupe-texto">({f.motivo})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Secao>
  );
}
