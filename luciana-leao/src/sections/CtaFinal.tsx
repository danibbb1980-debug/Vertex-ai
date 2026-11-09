import { useRef } from 'react'
import { CONFIG } from '../config'
import { TODAS } from '../brand/orquideaLinhas'
import { LinkWhatsApp } from '../components/Comum'
import { IconeInstagram } from '../components/Icones'
import { temWhatsApp } from '../lib/dados'
import { desenharTraco, faixa, useProgressoRolagem } from '../lib/rolagem'

export function CtaFinal() {
  const ref = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const temAgendar = CONFIG.secoes.agendar && temWhatsApp

  // A haste chega primeiro; depois cada pétala se completa, uma após a outra.
  useProgressoRolagem(
    ref,
    (p) => {
      const paths = svg.current?.querySelectorAll('path')
      if (!paths) return
      desenharTraco(paths[0], faixa(p, 0, 0.3))
      for (let i = 1; i < paths.length; i++) {
        const ini = 0.25 + ((i - 1) / TODAS.length) * 0.55
        desenharTraco(paths[i], faixa(p, ini, ini + 0.2))
      }
    },
    { alvo: [0, 0.5], tela: [1, 0.6], suavizar: 0.1 },
  )

  return (
    <section ref={ref} id="cta-final" className="relative overflow-hidden bg-grafite pb-24 text-pedra em-escuro lg:pb-32" aria-labelledby="titulo-cta">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilas to-transparent" />
      <div aria-hidden="true" className="absolute left-1/2 top-[30%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(183_155_194/0.16),transparent_65%)]" />

      <div className="container-site relative flex flex-col items-center text-center">
        <svg ref={svg} aria-hidden="true" viewBox="0 0 200 250" className="traco-rolagem w-44 text-lilas sm:w-52" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <path d="M100 0 C100 45 97 75 100 106" pathLength={1} />
          <g transform="translate(0 100)" className="text-pedra">
            {TODAS.map((d, i) => (
              <path key={i} d={d} pathLength={1} />
            ))}
          </g>
        </svg>

        <h2 id="titulo-cta" className="mt-10 max-w-3xl text-[2.6rem] leading-[1.05] !text-pedra sm:text-6xl lg:text-7xl">
          O primeiro passo é uma <em className="text-lilas">mensagem</em>.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-pedra/80">Conte o que você procura e a equipe responde com os horários disponíveis.</p>

        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <LinkWhatsApp className="btn btn-claro" rotuloAcessivel="Agendar pelo WhatsApp">
            Agendar pelo WhatsApp
          </LinkWhatsApp>
          {CONFIG.instagram.url && (
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro" aria-label="Ver no Instagram (abre em nova aba)">
              <IconeInstagram />
              Ver no Instagram
            </a>
          )}
        </div>
        {temAgendar && (
          <a href="#agendar" className="link-sublinhado mt-7 inline-flex min-h-12 items-center text-pedra/85 hover:text-pedra">
            Prefere escolher dia e horário? Use o formulário de solicitação.
          </a>
        )}
      </div>
    </section>
  )
}
