import { CONFIG } from "../config";

/** Só aparece com nota real verificada (CONFIG.mostrarNotaGoogle). Sem texto de depoimentos. */
export function Avaliacoes() {
  if (!CONFIG.mostrarNotaGoogle || CONFIG.notaGoogle.total <= 0) return null;
  const { nota, total } = CONFIG.notaGoogle;
  return (
    <section className="py-14" aria-label="Avaliações do Google">
      <div className="container-site flex flex-col items-center gap-3 text-center">
        <p className="font-display text-5xl">{nota.toFixed(1).replace(".", ",")}</p>
        <p className="text-tinta-2">no Google, com {total} avaliações</p>
        <a href={CONFIG.endereco.mapsUrl} target="_blank" rel="noopener" className="btn btn-contorno mt-2">
          Ver no Google Maps
        </a>
      </div>
    </section>
  );
}
