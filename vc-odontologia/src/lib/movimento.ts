/**
 * Movimento ligado à rolagem, com a lib motion (carregada sob demanda).
 * Só transform e opacity; usa ScrollTimeline nativo quando o navegador tem.
 */
import { animate, scroll } from 'motion'

export function iniciar() {
  const paradas: (() => void)[] = []
  const celular = window.matchMedia('(max-width: 1023px)').matches

  // 1. Assinatura V & C no hero
  const hero = document.getElementById('inicio')
  const assin = document.querySelector<HTMLElement>('[data-assinatura]')
  if (hero && assin) {
    // No celular a assinatura fica mais abaixo; o encontro acontece um pouco depois
    const [ini, fim] = celular ? [0.1, 0.5] : [0, 0.42]
    const t = [0, ini, fim, 1]
    const col = (sel: string, lado: number) => {
      const el = assin.querySelector<HTMLElement>(sel)
      if (!el) return
      const de = `translate(${lado * 26}px, ${lado * 36}px)`
      paradas.push(
        scroll(animate(el, { transform: [de, de, 'translate(0px, 0px)', 'translate(0px, 0px)'] }, { times: t, ease: 'linear' }), {
          target: hero,
          offset: ['start start', 'end start'],
        }),
      )
    }
    col('[data-assin="esq"]', -1)
    col('[data-assin="dir"]', 1)

    const linha = assin.querySelector<HTMLElement>('[data-assin="linha"]')
    if (linha)
      paradas.push(
        scroll(animate(linha, { transform: ['scaleY(0.18)', 'scaleY(0.18)', 'scaleY(1)', 'scaleY(1)'] }, { times: t, ease: 'linear' }), {
          target: hero,
          offset: ['start start', 'end start'],
        }),
      )

    const e = assin.querySelector<HTMLElement>('[data-assin="e"]')
    if (e) {
      const meio = ini + (fim - ini) * 0.45
      paradas.push(
        scroll(
          animate(
            e,
            { opacity: [0, 0, 1, 1], transform: ['scale(0.6)', 'scale(0.6)', 'scale(1)', 'scale(1)'] },
            { times: [0, meio, fim, 1], ease: 'linear' },
          ),
          { target: hero, offset: ['start start', 'end start'] },
        ),
      )
    }
    assin.classList.add('movimento-ativo')
  }

  // 2. Linha do tempo "Como funciona": progresso dourado ao rolar
  const lista = document.querySelector<HTMLElement>('[data-linha-tempo]')
  const progresso = lista?.querySelector<HTMLElement>('[data-linha-progresso]')
  if (lista && progresso) {
    paradas.push(
      scroll(animate(progresso, { transform: ['scaleY(0)', 'scaleY(1)'] }, { ease: 'linear' }), {
        target: lista,
        offset: ['start 0.75', 'end 0.6'],
      }),
    )
  }

  return () => paradas.forEach((p) => p())
}
