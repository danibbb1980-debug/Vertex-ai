import { CONFIG } from '../config'
import { NAV } from '../content'
import { enderecoLinha, mailLink, telLink, waLink } from '../lib/links'
import { Confirmar } from './Confirmar'
import { Logo } from './Logo'

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const p = CONFIG.profissional
  const ano = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-sand/60 pb-28 pt-16 text-[0.95rem] md:pb-24">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="w-32" />
          <p className="mt-6 font-display text-[1.3rem] text-ink">{p.nome}</p>
          <p className="text-ink-2">
            {p.titulo} · <Confirmar>{p.cro}</Confirmar>
          </p>
          <p className="mt-3 text-sm text-mute">
            Responsável técnico: {p.nome}, <Confirmar tag={false}>{p.cro}</Confirmar>
            <br />
            {CONFIG.consultorio} · <Confirmar>{CONFIG.registroEstabelecimento}</Confirmar>
          </p>
        </div>
        {!minimal && (
          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="num text-mute">Navegação</h2>
            <ul className="mt-4 space-y-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-line inline-flex min-h-11 items-center text-ink-2 hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className={minimal ? 'md:col-span-7' : 'md:col-span-4'}>
          <h2 className="num text-mute">Contato</h2>
          <ul className="mt-4 space-y-1 text-ink-2">
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="link-line inline-flex min-h-11 items-center">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
            <li>
              <a href={telLink} className="link-line inline-flex min-h-11 items-center">
                Telefone {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={mailLink} className="link-line inline-flex min-h-11 items-center break-all">
                {CONFIG.email}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="link-line inline-flex min-h-11 items-center">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
            <li className="pt-2 text-sm text-mute">{enderecoLinha()}</li>
          </ul>
        </div>
      </div>
      <div className="shell mt-14">
        <div className="flex flex-col gap-4 border-t border-line pt-6 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <a href="/privacidade.html" className="link-line inline-flex min-h-11 items-center text-ink-2">
            Privacidade
          </a>
          <span className="inline-flex min-h-11 items-center" suppressHydrationWarning>© {ano} {p.nome}</span>
        </p>
        </div>
      </div>
    </footer>
  )
}
