import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/utils'
import { CabecalhoSecao, IconeWhatsApp, Revelar, Seta } from './ui'

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative bg-nude-claro/45 py-24 md:py-32" data-no-linha>
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <CabecalhoSecao
            id="titulo-atendimentos"
            rotulo="Atendimentos"
            titulo={
              <>
                Três cuidados, uma mesma <em>atenção</em>.
              </>
            }
          />
          <Revelar atraso={0.1} className="max-w-sm text-choco/85 lg:pb-2">
            <p>Os atendimentos são individuais e começam com uma avaliação. {CONFIG.avisoIndicacao}</p>
          </Revelar>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {lista.map((a, i) => (
            <Revelar como="li" key={a.id} atraso={i * 0.08}>
              <article className="cartao group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-choco/10 bg-creme p-7 shadow-[0_1px_0_rgb(78_50_38/0.04)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-suave)] hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-30px_rgb(78_50_38/0.45)] md:p-8">
                {/* filete dourado que cresce no hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-8 top-0 h-16 w-px origin-top scale-y-[0.35] bg-ouro transition-[scale] duration-700 ease-[var(--ease-suave)] group-hover:scale-y-100"
                />
                <span aria-hidden="true" className="font-serif text-[0.95rem] italic text-ouro-esc">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-10 font-serif text-[1.9rem] leading-[1.1] text-choco">{a.nome}</h3>
                <p className="mt-4 font-medium text-choco">{a.resumo}</p>
                <p className="mt-3 text-[0.98rem] text-choco/85">{a.descricao}</p>
                <p className="mt-5 text-sm italic text-ouro-esc">{CONFIG.avisoIndicacao}</p>
                {CONFIG.whatsapp && (
                  <a
                    href={linkWhatsApp(CONFIG.mensagens.porAtendimento(a.nomeFrase))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secundario mt-8 self-start"
                    aria-label={`Pedir informações sobre ${a.nomeFrase} pelo WhatsApp (abre em nova aba)`}
                  >
                    <IconeWhatsApp className="size-[1.05rem]" /> Pedir informações <Seta />
                  </a>
                )}
              </article>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
