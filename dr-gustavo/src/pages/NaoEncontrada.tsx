import { waLink } from '../lib/links'
import { IconWhatsApp } from '../components/Icons'
import { Simples } from './Simples'

export function NaoEncontrada() {
  return (
    <Simples>
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-5 text-[clamp(2.4rem,1.8rem+2.6vw,3.6rem)]">
        Esta página não <em className="font-[330] text-accent">existe</em>.
      </h1>
      <p className="lead mt-6">O endereço pode ter mudado. Volte para a página inicial ou fale com o consultório.</p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a href="/" className="btn btn-ink">
          Ir para a página inicial
        </a>
        <a href={waLink()} target="_blank" rel="noopener" className="btn btn-ghost">
          <IconWhatsApp size={18} />
          Falar pelo WhatsApp
        </a>
      </div>
    </Simples>
  )
}
