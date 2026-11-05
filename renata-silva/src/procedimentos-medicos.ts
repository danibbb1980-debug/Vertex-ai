import type { Atendimento } from "./config.ts";

const AVALIACAO = "A indicação depende de avaliação individual.";

/**
 * Grupo B. Só é exibido com MOSTRAR_PROCEDIMENTOS_MEDICOS = true em config.ts,
 * e só deve ser ligado com profissional habilitada e registro visível no site.
 * Ao ligar, revise cada descrição com a profissional responsável.
 */
export const PROCEDIMENTOS_MEDICOS: Atendimento[] = [
  { id: "toxina-botulinica", nome: "Toxina botulínica", frente: "facial", descricao: AVALIACAO, medico: true },
  { id: "preenchedores", nome: "Preenchedores", frente: "facial", descricao: AVALIACAO, medico: true },
  { id: "laser-lavieen", nome: "Laser Lavieen", frente: "facial", descricao: AVALIACAO, medico: true },
  { id: "laser-etherea", nome: "Laser Etherea", frente: "facial", descricao: AVALIACAO, medico: true },
  { id: "teste-epigenetico", nome: "Teste epigenético", frente: "corporal", descricao: AVALIACAO, medico: true },
  { id: "hidrolipo", nome: "Hidrolipo", frente: "corporal", descricao: AVALIACAO, medico: true },
  { id: "emagrecimento", nome: "Emagrecimento", frente: "corporal", descricao: AVALIACAO, medico: true },
];
