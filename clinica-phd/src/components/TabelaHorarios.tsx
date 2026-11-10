import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { aberto, horaCurta } from "../lib/horarios";

/** Tabela semanal. O dia atual é destacado com JavaScript (no navegador). */
export function TabelaHorarios({ tom = "claro" }: { tom?: "claro" | "escuro" }) {
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => setHoje(new Date().getDay()), []);
  const escuro = tom === "escuro";
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Horários de atendimento por dia da semana</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Dia</th>
          <th scope="col">Horário</th>
        </tr>
      </thead>
      <tbody>
        {CONFIG.horarios.map((h) => {
          const eHoje = hoje === h.dia;
          return (
            <tr
              key={h.dia}
              aria-current={eHoje ? "date" : undefined}
              className={`border-b ${escuro ? "border-creme/15" : "border-bronze/30"} ${
                eHoje ? (escuro ? "bg-creme/[0.07]" : "bg-areia/70") : ""
              }`}
            >
              <th scope="row" className="py-3.5 pl-3 pr-4 font-medium">
                <span className="flex items-center gap-3">
                  {h.nome}
                  {eHoje ? (
                    <span className={`rounded-[2px_99px_99px_2px] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${escuro ? "bg-bronze-claro text-grafite" : "bg-grafite text-creme"}`}>
                      Hoje
                    </span>
                  ) : null}
                </span>
              </th>
              <td className={`py-3.5 pr-3 text-right tabular-nums ${aberto(h) ? "" : escuro ? "text-creme/75" : "text-cinza-texto"}`}>
                {aberto(h) ? `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}` : "Fechado"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
