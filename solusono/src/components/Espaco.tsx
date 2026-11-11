import { CONFIG } from "../config";

/** Fotos reais do espaço. Sem fotos no config, a seção não existe. */
export function Espaco() {
  const fotos = CONFIG.fotos;
  if (!fotos.length) return null;
  const [principal, ...resto] = fotos;
  return (
    <section aria-labelledby="espaco-titulo" className="bg-white pb-24 md:pb-36">
      <div className="container-site">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-8">
          <figure className="md:col-span-5 md:row-span-2">
            <img
              src={principal.src}
              alt={principal.alt}
              width={principal.largura}
              height={principal.altura}
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] h-auto w-full rounded-[2rem] object-cover"
            />
            {principal.legenda && <figcaption className="mt-3 text-sm text-muted">{principal.legenda}</figcaption>}
          </figure>

          <div className="order-first md:order-none md:col-span-6 md:col-start-7 md:self-end">
            <p className="rotulo">O espaço</p>
            <h2 id="espaco-titulo" className="titulo mt-5 text-[clamp(2.2rem,4.6vw,3.8rem)]">
              Um lugar <em>tranquilo</em> para conversar sobre o sono.
            </h2>
            <p className="mt-5 max-w-[44ch] text-muted">
              {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}, em {CONFIG.endereco.cidade}.
            </p>
          </div>

          {resto.length > 0 && (
            <div className={`grid gap-4 md:col-span-7 md:col-start-6 md:gap-6 ${resto.length > 1 ? "grid-cols-2" : ""}`}>
              {resto.slice(0, 4).map((f, i) => (
                <figure key={f.src} className={i % 2 === 1 ? "md:mt-16" : ""}>
                  <img
                    src={f.src}
                    alt={f.alt}
                    width={f.largura}
                    height={f.altura}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] h-auto w-full rounded-[1.5rem] object-cover"
                  />
                  {f.legenda && <figcaption className="mt-2 text-sm text-muted">{f.legenda}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
