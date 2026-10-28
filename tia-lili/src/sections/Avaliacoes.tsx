import { CONFIG } from "../config";
import { Secao } from "../components/Secao";
import { Botao } from "../components/Botoes";
import { Estrela } from "../components/Icones";

/** Só aparece com CONFIG.mostrarNotaGoogle = true e nota real informada. Sem texto de depoimentos. */
export function Avaliacoes() {
  return (
    <Secao id="avaliacoes" className="!py-10">
      <div className="container-site">
        <div className="revelar flex flex-col items-center gap-4 rounded-xl3 bg-white/85 p-8 text-center ring-1 ring-areia md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-4">
            <Estrela tamanho={34} className="text-manteiga" fill="currentColor" />
            <p>
              <span id="avaliacoes-titulo" className="font-display text-3xl font-medium">
                Nota {CONFIG.notaGoogle.nota} no Google
              </span>
              <span className="block text-taupe-texto">{CONFIG.notaGoogle.totalAvaliacoes} avaliações na ficha do consultório</span>
            </p>
          </div>
          <Botao href={CONFIG.maps.link} externo variante="secundario">
            Ver no Google Maps
          </Botao>
        </div>
      </div>
    </Secao>
  );
}
