import { CONFIG, exibirEspecialista } from '../config'
import { waLink } from '../lib/whatsapp'
import { resumoHorarios } from '../lib/horarios'
import { NAV } from '../components/Header'
import { SquaresDivider } from '../components/SquaresDivider'

export function Footer() {
  const e = CONFIG.endereco
  const cro = CONFIG.cro.trim()
  return (
    <footer className="bg-ivory pb-28 pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src="/img/logo-dr-vitor.png" alt={`Logo ${CONFIG.nome}`} width={203} height={99} loading="lazy" className="h-[72px] w-auto" />
            <p className="mt-6 font-medium text-ink">{CONFIG.nome}</p>
            <p className="text-sm text-ink-soft">
              {CONFIG.profissao}
              {cro && ` · ${cro}`}
            </p>
            {exibirEspecialista() && <p className="text-sm text-ink-soft">Especialista em {CONFIG.especialidade}</p>}
          </div>
          <div className="text-[0.95rem] md:col-span-3">
            <p className="eyebrow text-ink-soft">Endereço</p>
            <address className="mt-3 not-italic text-ink">
              {e.rua}, {e.complemento}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
              <br />
              CEP {e.cep}
            </address>
            <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-12 items-center text-sm font-semibold text-teal-deep md:min-h-0 md:py-1">
              Ver no Google Maps
            </a>
          </div>
          <div className="text-[0.95rem] md:col-span-3">
            <p className="eyebrow text-ink-soft">Contato</p>
            <ul className="mt-2 space-y-1 text-ink md:mt-3">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-teal-deep md:min-h-0 md:py-1">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              {CONFIG.instagram.trim() && (
                <li>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-teal-deep md:min-h-0 md:py-1">
                    Instagram
                  </a>
                </li>
              )}
              {resumoHorarios().map((h) => (
                <li key={h.dias} className="text-sm text-ink-soft">
                  {h.dias}: {h.horas}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Rodapé" className="text-[0.95rem] md:col-span-2">
            <p className="eyebrow text-ink-soft">Navegação</p>
            <ul className="mt-2 md:mt-3 md:space-y-0.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-12 items-center text-ink hover:text-teal-deep md:min-h-0 md:py-1">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/privacidade.html" className="inline-flex min-h-12 items-center text-ink hover:text-teal-deep md:min-h-0 md:py-1">
                  Privacidade
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <SquaresDivider className="mt-16" />
        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-ink-soft sm:flex-row">
          <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
          <p>
            © {new Date().getFullYear()} {CONFIG.consultorio}
          </p>
        </div>
      </div>
    </footer>
  )
}
