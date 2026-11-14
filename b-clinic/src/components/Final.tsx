import { CONFIG, filled } from '../config'
import { agendarUrl, enderecoLinha } from '../lib/links'
import { Botao } from './Botao'
import { formAtivo } from './Header'
import { Monograma } from './Monograma'

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="sobre-preto grao relative overflow-hidden bg-preto text-osso">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-[38vw] top-1/2 h-[120vw] w-[120vw] -translate-y-1/2 md:-right-[12vw] md:h-[62vw] md:w-[62vw]"
      >
        <circle cx="100" cy="100" r="99.5" fill="none" stroke="var(--color-champanhe)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-b relative py-28 md:py-44">
        <p className="rotulo flex items-center gap-4 text-champanhe">
          <span aria-hidden="true" className="h-px w-10 bg-champanhe" />
          Avaliação
        </p>
        <h2 id="cta-titulo" className="titulo mt-6 max-w-4xl text-[clamp(2.6rem,7.4vw,6.5rem)]">
          Sua avaliação é o primeiro <span className="enfase text-champanhe">passo</span>.
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Botao href={agendarUrl()} externo variante="cheio-claro">
            Agendar avaliação
          </Botao>
          {formAtivo() && (
            <Botao href="#agendar" variante="linha-clara">
              Solicitar horário
            </Botao>
          )}
          <Botao href={CONFIG.instagram.url} externo variante="linha-clara">
            Ver no Instagram
          </Botao>
        </div>
      </div>
    </section>
  )
}

export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="sobre-preto bg-preto-2 pb-28 pt-16 text-osso/80 md:pb-16">
      <div className="container-b">
        <div className="grid gap-10 border-t border-osso/15 pt-12 md:grid-cols-12">
          <div className="flex items-center gap-4 md:col-span-4">
            {CONFIG.logo ? (
              <img src={CONFIG.logo} alt="" width={48} height={48} className="h-12 w-12" />
            ) : (
              <Monograma className="h-12 w-12" anel={8} traco={14} />
            )}
            <span className="text-base tracking-[0.2em] uppercase text-osso">B Clinic</span>
          </div>
          <div className="text-[0.9375rem] md:col-span-5">
            <p>{enderecoLinha()}</p>
            <p className="mt-3 flex flex-wrap gap-x-6">
              {filled(CONFIG.telefone) && (
                <a href={CONFIG.telefoneLink} className="num inline-flex min-h-12 items-center hover:text-champanhe">
                  {CONFIG.telefone}
                </a>
              )}
              {filled(CONFIG.email) && (
                <a href={`mailto:${CONFIG.email}`} className="inline-flex min-h-12 items-center hover:text-champanhe">
                  {CONFIG.email}
                </a>
              )}
              <a
                href={CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center hover:text-champanhe"
              >
                @{CONFIG.instagram.usuario}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            </p>
          </div>
          <div className="text-[0.9375rem] md:col-span-3 md:text-right">
            <a href="/privacidade.html" className="inline-flex min-h-12 items-center underline underline-offset-4 hover:text-champanhe">
              Privacidade
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-osso/15 pt-6 text-[0.8125rem] leading-relaxed text-pedra-claro">
          {filled(rt.nome) && filled(rt.registro) && (
            <p className="mb-2">
              Responsável técnico: {rt.nome} · {rt.registro}
            </p>
          )}
          <p className="max-w-3xl">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitado.
          </p>
        </div>
      </div>
    </footer>
  )
}
