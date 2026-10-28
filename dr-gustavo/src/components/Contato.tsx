import { useState } from 'react'
import { CONFIG } from '../config'
import { enderecoLinha, mailLink, telLink, turnosTexto, waLink } from '../lib/links'
import { Confirmar } from './Confirmar'
import { IconArrow, IconInstagram, IconMail, IconPhone, IconPin, IconWhatsApp } from './Icons'
import { SectionHead } from './SectionHead'

/** Mapa do Google só carrega quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [ativo, setAtivo] = useState(false)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-soft)] border border-line bg-sand md:aspect-auto md:h-full md:min-h-[28rem]">
      {ativo ? (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={CONFIG.mapsEmbedUrl}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-ink/12" fill="none">
            <path d="M-10 210 C 90 180, 160 240, 410 150" stroke="currentColor" strokeWidth="14" />
            <path d="M120 -10 C 140 90, 110 200, 170 310" stroke="currentColor" strokeWidth="8" />
            <path d="M260 -10 L 300 310" stroke="currentColor" strokeWidth="6" />
            <path d="M-10 70 L 410 110" stroke="currentColor" strokeWidth="5" />
            <path d="M-10 270 L 410 250" stroke="currentColor" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_0_10px_rgba(31,76,87,0.12)]">
              <IconPin size={24} />
            </span>
            <p className="max-w-[24ch] font-display text-[1.35rem] text-ink">
              {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => setAtivo(true)} className="btn btn-light border border-line">
                Carregar mapa do Google
              </button>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="btn btn-ink">
                Como chegar
                <IconArrow size={16} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Contato() {
  const e = CONFIG.endereco
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-24 md:py-36">
      <div className="shell">
        <SectionHead id="contato-titulo" eyebrow="Localização e contato" title="Venha conhecer o *consultório*." />
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-5">
            <div data-reveal>
              <h3 className="num text-mute">Endereço</h3>
              <address className="mt-3 font-display text-[1.3rem] not-italic sm:text-[1.45rem] leading-snug text-ink">
                <Confirmar>
                  {e.rua}
                  <br />
                  {e.bairro}, {e.cidade} - {e.uf}
                  <br />
                  CEP {e.cep}
                </Confirmar>
              </address>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost mt-5">
                <IconPin size={18} />
                Como chegar
              </a>
            </div>

            <div data-reveal>
              <h3 className="num text-mute">
                Horários {CONFIG.marcarPendencias ? <span className="confirmar-tag">a confirmar</span> : null}
              </h3>
              <table className="mt-3 w-full text-[0.97rem]">
                <caption className="sr-only">Horários de atendimento, com intervalo de almoço</caption>
                <tbody>
                  {CONFIG.horarios.map((h) => (
                    <tr key={h.dia} className="border-b border-line/70">
                      <th scope="row" className="py-2.5 pr-4 text-left font-medium text-ink">
                        {h.dia}
                      </th>
                      <td className={`py-2.5 text-right tabular-nums ${h.turnos.length ? 'text-ink-2' : 'text-mute'}`}>
                        {turnosTexto(h.turnos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-mute">{CONFIG.observacaoHorario}</p>
            </div>

            <div data-reveal>
              <h3 className="num text-mute">Fale com o consultório</h3>
              <ul className="mt-4 space-y-1">
                {[
                  { href: waLink(), icon: IconWhatsApp, label: 'WhatsApp', value: CONFIG.whatsappExibicao, ext: true },
                  { href: telLink, icon: IconPhone, label: 'Telefone', value: CONFIG.telefoneExibicao },
                  { href: mailLink, icon: IconMail, label: 'E-mail', value: CONFIG.email },
                  { href: CONFIG.instagram.url, icon: IconInstagram, label: 'Instagram', value: CONFIG.instagram.usuario, ext: true },
                ].map(({ href, icon: Icon, label, value, ext }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
                      className="group flex min-h-12 items-center gap-4 py-1.5"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-mute">{label}</span>
                        <span className="link-line block truncate text-ink">{value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <Mapa />
          </div>
        </div>
      </div>
    </section>
  )
}
