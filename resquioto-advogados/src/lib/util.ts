import { CONFIG } from "../config";

export const MSG_GERAL =
  "Olá! Vi o site do escritório Resquioto Advogados e gostaria de agendar um atendimento.";

export function waLink(texto: string = MSG_GERAL) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export function waArea(area: string) {
  return waLink(
    `Olá! Vi o site do escritório Resquioto Advogados e gostaria de agendar um atendimento sobre ${area}.`,
  );
}

export const comoChegar = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${CONFIG.coordenadas.lat},${CONFIG.coordenadas.lng}`;

export const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const temHorarios = () => CONFIG.horarios.length > 0;
export const temAreas = () => CONFIG.areas.length > 0;
export const advogadosValidos = () =>
  CONFIG.advogados.filter((a) => a.nome.trim() && a.oab.trim() && a.uf.trim());

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta". */
export function horariosAgrupados() {
  const linhas: { dias: string; horas: string }[] = [];
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  let i = 0;
  while (i < ordem.length) {
    const h = CONFIG.horarios.find((x) => x.dia === ordem[i]);
    const fmt = (x?: typeof h) =>
      x ? `${x.abre} às ${x.fecha}${x.pausa ? ` (pausa ${x.pausa[0]} às ${x.pausa[1]})` : ""}` : "Fechado";
    const horas = fmt(h);
    let j = i;
    while (j + 1 < ordem.length && fmt(CONFIG.horarios.find((x) => x.dia === ordem[j + 1])) === horas) j++;
    const dias =
      i === j
        ? DIAS[ordem[i]]
        : `${DIAS[ordem[i]]} ${j === i + 1 ? "e" : "a"} ${DIAS[ordem[j]].toLowerCase()}`;
    linhas.push({ dias, horas });
    i = j + 1;
  }
  return linhas;
}
