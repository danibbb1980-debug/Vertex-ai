import type { ReactNode } from 'react'
import { DraftBanner } from '../components/DraftBanner'
import { Footer } from '../components/Footer'
import { IconArrow } from '../components/Icons'
import { Logo } from '../components/Logo'

/** Layout das páginas secundárias (HTML estático, sem JS). */
export function Simples({ children }: { children: ReactNode }) {
  return (
    <>
      <DraftBanner />
      <header className="fixed inset-x-0 top-[var(--banner-h)] z-50 border-b border-line/70 bg-ivory/95">
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <a href="/" className="flex min-h-12 items-center" aria-label="Voltar para a página inicial">
            <Logo className="w-[6.25rem] md:w-[7.25rem]" />
          </a>
          <a href="/" className="btn btn-ghost !min-h-11">
            Voltar ao site
            <IconArrow size={16} />
          </a>
        </div>
      </header>
      <main id="conteudo" className="pt-[calc(var(--banner-h)+var(--header-h)+3rem)] pb-24 md:pt-[calc(var(--banner-h)+var(--header-h)+5rem)]">
        <div className="shell max-w-[48rem]">{children}</div>
      </main>
      <Footer minimal />
    </>
  )
}
