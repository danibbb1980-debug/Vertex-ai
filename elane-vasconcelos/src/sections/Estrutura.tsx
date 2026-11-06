import { CONFIG } from "../config";
import { Foto } from "../components/Foto";
import { IconeAcessivel, IconeInstagram, IconeRelogio, IconeWhatsApp } from "../components/Icones";
import { Revelar, TituloSecao } from "../components/Revelar";
import { pausaAlmoco, resumoSemanal } from "../lib/horarios";

export function Estrutura() {
  if (!CONFIG.secoes.estrutura) return null;
  const pausa = pausaAlmoco();
  const fotos = CONFIG.fotos.espaco;
  return (
    <section aria-labelledby="titulo-estrutura" className="py-24 sm:py-32">
      <div className="container-site relative z-[1]">
        <TituloSecao id="titulo-estrutura" rotulo="Estrutura" antes="Um espaço pensado para" enfase="acolher." />

        {fotos.length > 0 && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-2">
            {fotos.slice(0, 3).map((f, i) => (
              <Revelar key={f.base} atraso={i * 0.1} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <figure className="h-full overflow-hidden rounded-[1.6rem]">
                  <Foto foto={f} sizes={i === 0 ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 40vw, 50vw"} className="h-full" imgClassName={i === 0 ? "aspect-[4/3] lg:aspect-auto" : "aspect-[4/3]"} />
                  <figcaption className="sr-only">{f.alt}</figcaption>
                </figure>
              </Revelar>
            ))}
          </div>
        )}

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.6rem] border border-ouro/30 bg-ouro/30 sm:grid-cols-2 lg:grid-cols-4">
          <li className="bg-marfim p-7">
            <IconeRelogio className="h-6 w-6 text-mauve" />
            <h3 className="mt-4 text-2xl">Horário</h3>
            <ul className="mt-2 space-y-1 text-[0.95rem] text-texto">
              {resumoSemanal().map((g) => (
                <li key={g.dias}><span className="text-cacau">{g.dias}:</span> {g.texto}</li>
              ))}
            </ul>
          </li>
          {pausa && (
            <li className="bg-marfim p-7">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-mauve" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 10h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6v-3Z" /><path d="M17 11h1.5a2 2 0 0 1 0 4H17" /></svg>
              <h3 className="mt-4 text-2xl">Pausa de almoço</h3>
              <p className="mt-2 text-[0.95rem] text-texto">De segunda a sexta, das {pausa}. {CONFIG.avisoHorarios}</p>
            </li>
          )}
          {CONFIG.acessibilidade && (
            <li className="bg-marfim p-7">
              <IconeAcessivel className="h-6 w-6 text-mauve" />
              <h3 className="mt-4 text-2xl">Acessibilidade</h3>
              <p className="mt-2 text-[0.95rem] text-texto">{CONFIG.acessibilidade}.</p>
            </li>
          )}
          <li className="bg-marfim p-7">
            <IconeWhatsApp className="h-6 w-6 text-mauve" />
            <h3 className="mt-4 text-2xl">Formas de contato</h3>
            <ul className="mt-2 space-y-1 text-[0.95rem] text-texto">
              {CONFIG.whatsapp && <li>WhatsApp {CONFIG.whatsappExibicao}</li>}
              {CONFIG.instagram.url && <li className="flex items-center gap-1.5"><IconeInstagram className="h-4 w-4" />Instagram</li>}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}
