import { CONFIG } from "../config";

// Ordem das seções numeradas. A numeração se ajusta quando uma seção é desligada.
const NUMERADAS = ["instituto", "atendimentos", "paraQuem", "comoFunciona", "profissionais", "estrutura", "avaliacoesGoogle", "duvidas", "contato"] as const;

export type SecaoNumerada = (typeof NUMERADAS)[number];

export function numeroDaSecao(chave: SecaoNumerada): string {
  const ligadas = NUMERADAS.filter((s) =>
    s === "avaliacoesGoogle" ? CONFIG.secoes.avaliacoesGoogle && CONFIG.mostrarNotaGoogle : CONFIG.secoes[s],
  );
  return String(ligadas.indexOf(chave) + 1).padStart(2, "0");
}
