import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { acaoContato, hora, temTexto } from '../lib'
import { IcInstagram, IcPin, IcRelogio, IcSetaExterna, IcTelefone, IcWhatsapp, Tulipa } from './icones'
import { Botao, CabecalhoSecao, Logo, Revela } from './ui'

/* =========================== LOCALIZAÇÃO E CONTATO =========================== */

export function Contato() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(new Date().getDay()), [])
  const e = CONFIG.endereco
  const wa = CONFIG.usarWhatsapp ? acaoContato({ labelWa: 'WhatsApp' }) : null

  return (
    <section id="contato" aria-labelledby="titulo-contato" data-fio="contato" className="relative bg-marfim-2 py-24 lg:py-32">
      <div className="container-site">
        <CabecalhoSecao id="titulo-contato" rotulo="Localização e contato" titulo="Venha nos *visitar*." />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <Revela className="flex flex-col gap-6">
            {/* Endereço */}
            <div className="rounded-[2rem] bg-marfim p-7 ring-1 ring-ameixa/8 sm:p-9">
              <h3 className="flex items-center gap-3 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-salvia-tinta">
                <IcPin size={20} /> Endereço
              </h3>
              <address className="mt-4 font-serif text-[1.45rem] not-italic leading-snug text-ameixa">
                {e.rua}, {e.complemento}
                <br />
                {e.bairro}, {e.cidade} - {e.uf}
                <br />
                <span className="font-sans text-base text-tinta-2">CEP {e.cep}</span>
              </address>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Botao href={CONFIG.telefoneLink} icone={<IcTelefone size={18} />} ariaLabel={`Ligar para ${CONFIG.telefone}`}>
                  Ligar {CONFIG.telefone}
                </Botao>
                {wa && (
                  <Botao href={wa.href} externo variante="secundario" icone={<IcWhatsapp size={18} />}>
                    WhatsApp
                  </Botao>
                )}
                <Botao href={CONFIG.instagram.url} externo variante="secundario" icone={<IcInstagram size={18} />}>
                  {CONFIG.instagram.usuario}
                </Botao>
              </div>
            </div>

            {/* Horários */}
            <div className="rounded-[2rem] bg-marfim p-7 ring-1 ring-ameixa/8 sm:p-9">
              <h3 className="flex items-center gap-3 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-salvia-tinta">
                <IcRelogio size={20} /> Horários
              </h3>
              <table className="mt-4 w-full text-left">
                <caption className="sr-only">Horários de atendimento por dia da semana</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Dia</th>
                    <th scope="col">Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {CONFIG.horarios.map((d) => {
                    const eHoje = hoje === d.semana
                    return (
                      <tr key={d.nome} className={`border-b border-ameixa/8 last:border-0 ${eHoje ? 'text-ameixa' : ''}`}>
                        <th scope="row" className="py-3 pr-4 align-top font-semibold text-ameixa">
                          {d.nome}
                          {eHoje && (
                            <span className="ml-2 rounded-full bg-salvia-suave px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wider text-salvia-tinta">
                              hoje
                            </span>
                          )}
                        </th>
                        <td className="py-3 text-right tabular-nums text-tinta-2">
                          {d.periodos.length === 0 ? (
                            'Fechado'
                          ) : (
                            <span className="flex flex-col items-end sm:block">
                              {d.periodos.map((p, i) => (
                                <span key={i}>
                                  {i > 0 && <span className="hidden sm:inline"> e </span>}
                                  {hora(p.inicio)} às {hora(p.fim)}
                                </span>
                              ))}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-[0.92rem] text-tinta-2">{CONFIG.avisoHorarios}</p>
            </div>
          </Revela>

          <Revela atraso={0.1}>
            <Mapa />
          </Revela>
        </div>
      </div>
    </section>
  )
}

/** Mapa só carrega quando a pessoa pede: nada de cookies do Google antes do clique. */
function Mapa() {
  const [carregar, setCarregar] = useState(false)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-marfim ring-1 ring-ameixa/8">
      <div className="relative min-h-[22rem] flex-1 bg-lilas-suave/60">
        {carregar ? (
          <iframe
            title="Mapa com a localização da Clínica Biomasto"
            src={CONFIG.maps.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
            {/* "mapa" ilustrado: ruas em traço e a tulipa como marcador */}
            <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <g fill="none" stroke="var(--color-lilas)" strokeWidth="1.2" opacity="0.7">
                <path d="M-10 80C80 60 140 110 230 90s150-50 190-30" />
                <path d="M-10 200c90-30 170 10 250-10s120-50 170-40" />
                <path d="M120-10c-10 90 20 170 0 320" />
                <path d="M300-10c20 100-20 200 10 320" />
              </g>
              <path d="M40 260c60 30 120 30 180-10s120-50 190-20" fill="none" stroke="var(--color-salvia)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="relative flex size-16 items-center justify-center rounded-full bg-marfim shadow-[0_10px_30px_-12px_rgb(75_48_69/0.4)]">
              <Tulipa className="h-8 w-8 text-lilas-tinta" sw={2} />
            </div>
            <p className="relative max-w-xs text-[0.95rem] text-tinta">
              O mapa é carregado do Google somente se você pedir.
            </p>
            <button
              type="button"
              onClick={() => setCarregar(true)}
              className="relative inline-flex min-h-12 items-center gap-2 rounded-full bg-ameixa px-6 font-semibold text-marfim transition-colors hover:bg-ameixa-2"
            >
              <IcPin size={18} /> Mostrar mapa aqui
            </button>
          </div>
        )}
      </div>
      <a
        href={CONFIG.maps.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-16 items-center justify-between gap-4 border-t border-ameixa/8 px-7 py-4 font-semibold text-ameixa transition-colors hover:bg-lilas-suave/50"
      >
        Ver no Google Maps
        <span className="sr-only"> (abre em nova aba)</span>
        <IcSetaExterna size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  )
}

/* =========================== CTA FINAL =========================== */

export function CtaFinal() {
  const principal = acaoContato({ labelTel: 'Ligar para agendar', labelWa: 'Agendar pelo WhatsApp' })
  return (
    <section aria-labelledby="titulo-cta" data-fio="cta" className="escuro relative overflow-hidden bg-ameixa py-24 text-marfim lg:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-salvia/70" />
      <Tulipa className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 text-marfim/[0.06]" sw={1.2} />
      <div className="container-site relative text-center">
        <Revela>
          <p className="rotulo">Clínica Biomasto · {CONFIG.cidade}</p>
          <h2 id="titulo-cta" className="mx-auto mt-5 max-w-3xl text-[2.4rem] !text-marfim sm:text-[3.2rem] lg:text-[3.8rem]">
            Sua consulta é o primeiro <em className="enfase">passo</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-marfim/80">
            Atendimento com hora marcada, de segunda a sexta. A equipe da clínica informa os horários disponíveis.
          </p>
        </Revela>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-3">
          <div className="relative">
            <Botao
              href={principal.href}
              externo={principal.externo}
              variante="claro"
              icone={principal.tipo === 'tel' ? <IcTelefone size={18} /> : <IcWhatsapp size={18} />}
              ariaLabel={principal.tipo === 'tel' ? `Ligar para agendar: ${CONFIG.telefone}` : undefined}
              data-fio-fim
            >
              {principal.label}
            </Botao>
            {/* No celular, a curva que abraça o botão aparece aqui (no desktop ela vem do fio contínuo). */}
            <svg aria-hidden="true" viewBox="0 0 300 60" className="pointer-events-none absolute -bottom-7 left-1/2 w-[118%] -translate-x-1/2 lg:hidden">
              <path d="M6 8c8 34 70 46 144 46s132-14 144-46" fill="none" stroke="var(--color-salvia)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <Botao href={CONFIG.instagram.url} externo variante="contorno-claro" icone={<IcInstagram size={18} />}>
            Ver no Instagram
          </Botao>
          {CONFIG.usarWhatsapp && CONFIG.secoes.agendar && (
            <Botao href="#agendar" variante="contorno-claro">
              Solicitar agendamento
            </Botao>
          )}
        </div>
        {!CONFIG.usarWhatsapp && (
          <p className="mt-14 text-marfim/75">
            Telefone{' '}
            <a href={CONFIG.telefoneLink} className="font-semibold text-marfim underline decoration-salvia underline-offset-4">
              {CONFIG.telefone}
            </a>
          </p>
        )}
      </div>
    </section>
  )
}

/* =========================== RODAPÉ =========================== */

export function Rodape() {
  const e = CONFIG.endereco
  const dt = CONFIG.diretorTecnico
  return (
    <footer className="bg-marfim pb-28 pt-16 lg:pb-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo className="h-16 w-auto" />
            <p className="mt-4 font-serif text-lg text-ameixa">{CONFIG.nome}</p>
            <p className="mt-1 text-[0.95rem] text-tinta-2">Atendimento em mastologia, ginecologia e obstetrícia.</p>
          </div>
          <div className="text-[0.95rem]">
            <h2 className="rotulo">Endereço</h2>
            <address className="mt-3 not-italic leading-relaxed text-tinta-2">
              {e.rua}, {e.complemento}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
              <br />
              CEP {e.cep}
            </address>
          </div>
          <div className="text-[0.95rem]">
            <h2 className="rotulo">Contato</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={CONFIG.telefoneLink} className="inline-flex min-h-12 items-center gap-2 text-ameixa hover:underline">
                  <IcTelefone size={17} /> {CONFIG.telefone}
                </a>
              </li>
              {CONFIG.usarWhatsapp && (
                <li>
                  <a href={acaoContato().href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-ameixa hover:underline">
                    <IcWhatsapp size={17} /> WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              )}
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-ameixa hover:underline">
                  <IcInstagram size={17} /> {CONFIG.instagram.usuario}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-ameixa hover:underline">
                  <IcPin size={17} /> Ver no Google Maps
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="filete mt-12" />
        <div className="mt-8 flex flex-col gap-4 text-[0.88rem] leading-relaxed text-tinta-2 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2">
            {temTexto(dt.nome) && temTexto(dt.crm) && (
              <p className="text-tinta">
                Responsável técnico: {dt.nome} · CRM-MG {dt.crm}
              </p>
            )}
            <p>
              Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação
              médica individual.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <a href="/privacidade" className="inline-flex min-h-12 items-center font-semibold text-ameixa underline-offset-4 hover:underline">
              Privacidade
            </a>
            <span>© {new Date().getFullYear()} {CONFIG.nome}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* =========================== BOTÃO FLUTUANTE / BARRA NO CELULAR =========================== */

export function ContatoFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const acao = acaoContato({ labelTel: 'Ligar', labelWa: 'WhatsApp' })
  const Icone = acao.tipo === 'tel' ? IcTelefone : IcWhatsapp
  const alvo = acao.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <>
      {/* Celular: barra fixa. O rodapé tem espaço extra embaixo para ela não cobrir conteúdo. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-ameixa/10 bg-marfim/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 lg:hidden ${
          visivel ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!visivel}
      >
        <a
          href={acao.href}
          {...alvo}
          tabIndex={visivel ? 0 : -1}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ameixa font-semibold text-marfim"
        >
          <Icone size={18} />
          {acao.tipo === 'tel' ? `Ligar ${CONFIG.telefone}` : 'Agendar pelo WhatsApp'}
          {acao.externo && <span className="sr-only"> (abre em nova aba)</span>}
        </a>
      </div>

      {/* Desktop: botão flutuante discreto. */}
      <a
        href={acao.href}
        {...alvo}
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        aria-label={acao.tipo === 'tel' ? `Ligar para ${CONFIG.telefone}` : undefined}
        className={`fixed bottom-6 right-6 z-30 hidden min-h-12 items-center gap-2 rounded-full bg-ameixa px-5 font-semibold text-marfim shadow-[0_14px_36px_-12px_rgb(75_48_69/0.6)] ring-1 ring-salvia/40 transition-[opacity,transform] duration-500 hover:bg-ameixa-2 lg:inline-flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <Icone size={18} />
        {acao.label}
        {acao.externo && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    </>
  )
}
