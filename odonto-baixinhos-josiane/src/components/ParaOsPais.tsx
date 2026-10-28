import { Cabecalho } from "./Texto";
import { IconeCheck } from "./Icones";
import { Brilho } from "./Ornamentos";

const BLOCOS = [
  {
    n: "01",
    titulo: "O que esperar da primeira visita",
    texto:
      "A primeira consulta é, antes de tudo, um encontro. A criança conhece a doutora, o consultório e os instrumentos, e os pais contam a história e a rotina dela. O que acontece depois depende de como ela se sente e da avaliação.",
  },
  {
    n: "02",
    titulo: "Como preparar a criança",
    texto:
      "Fale da visita com naturalidade. Evite usar o dentista como ameaça e não prometa o que não depende de você, como “não vai sentir nada”. Prefira dizer que a doutora vai conversar, mostrar e contar os dentinhos.",
  },
  {
    n: "03",
    titulo: "Os pais por perto",
    texto:
      "Como os pais acompanham a consulta é combinado com a doutora, conforme a idade e a necessidade de cada criança.",
    confirmar: true,
  },
];

const DICAS = [
  "Se puder, escolha um horário em que a criança costuma estar descansada.",
  "Conte à doutora sobre medos, experiências anteriores e necessidades específicas.",
  "Anote as suas dúvidas para conversar com calma na consulta.",
];

export function ParaOsPais() {
  return (
    <section id="para-os-pais" className="tema-baixinhos relative overflow-hidden bg-marfim py-20 md:py-28" aria-labelledby="titulo-pais">
      <div className="container-site">
        <Cabecalho
          id="titulo-pais"
          eyebrow="Para os pais"
          titulo="Uma primeira visita *sem mistério*."
          texto="Algumas orientações para chegar à consulta com mais informação e menos ansiedade, para vocês e para a criança."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {BLOCOS.map((b, i) => (
            <li
              key={b.n}
              className="revela relative rounded-[var(--radius-cartao)] border border-linha bg-marfim-2/60 p-7"
              style={{ "--atraso": `${i * 100}ms` } as React.CSSProperties}
            >
              <span className="font-display text-4xl italic text-rosa-ink/80">{b.n}</span>
              <h3 className="mt-4 text-[1.5rem] leading-tight">{b.titulo}</h3>
              <p className="mt-3 leading-relaxed text-tinta-2">{b.texto}</p>
              {b.confirmar ? (
                // CONFIRMAR COM A CLÍNICA: rotina de acompanhamento dos pais
                <p className="mt-4">
                  <span className="confirmar">rotina a confirmar com a clínica</span>
                </p>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="revela mt-6 grid gap-6 rounded-[var(--radius-cartao)] bg-ceu/70 p-7 md:grid-cols-[0.8fr_2fr] md:items-center md:p-9">
          <p className="flex items-center gap-3 font-display text-2xl">
            <Brilho className="h-5 w-5 text-ouro" /> Dicas rápidas
          </p>
          <ul className="grid gap-3 md:grid-cols-3">
            {DICAS.map((d) => (
              <li key={d} className="flex gap-3 text-[0.97rem] leading-relaxed">
                <IconeCheck className="mt-1 shrink-0 text-ceu-ink" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
