import { CONFIG } from "../config";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { IconeSetaDiagonal } from "../components/Icones";

/**
 * Só nota e link para o Google Maps (sem texto de depoimentos).
 * Desligada por padrão: ligar CONFIG.secoes.avaliacoesGoogle e CONFIG.mostrarNotaGoogle
 * e preencher CONFIG.notaGoogle com os números reais da ficha, após decisão da clínica.
 */
export function AvaliacoesGoogle() {
  if (!CONFIG.mostrarNotaGoogle || !CONFIG.notaGoogle.nota) return null;
  return (
    <section id="avaliacoes" aria-labelledby="titulo-avaliacoes" className="relative z-10 py-20 md:py-28">
      <div className="contem flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <CabecalhoSecao
          numero={numeroDaSecao("avaliacoesGoogle")}
          rotulo="Avaliações no Google"
          id="titulo-avaliacoes"
          titulo={
            <>
              A opinião de quem já <em>conhece</em>.
            </>
          }
        />
        <a
          href={CONFIG.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-end gap-5 rounded-[24px] border border-linha bg-branco/80 p-7"
        >
          <span className="font-display text-[4rem] leading-none tabular-nums">{CONFIG.notaGoogle.nota}</span>
          <span className="pb-2 text-[0.9rem] text-suave">
            {CONFIG.notaGoogle.totalAvaliacoes} avaliações no Google
            <span className="mt-1 flex items-center gap-1 text-tinta">
              Ver no Google Maps <IconeSetaDiagonal tamanho={14} />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
