import { CONFIG } from '../config'
import { whatsappLink } from '../lib/links'
import { Botao, CabecalhoSecao, IconWhatsApp, Pendente } from './ui'

const itens = [
  { titulo: 'Escaneamento', texto: 'Recebimento de arquivos de escaneamento, conforme combinado com o laboratório.' },
  { titulo: 'Planejamento digital', texto: 'Desenho da peça em ambiente digital, a partir do arquivo e da prescrição.' },
  { titulo: 'Impressão', texto: 'Provisórios impressos em casos selecionados.' },
]

/** Composição gráfica original: curvas de nível de uma coroa, como numa varredura. */
function Varredura() {
  const curvas = Array.from({ length: 11 }, (_, i) => i)
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="pontos" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".9" fill="currentColor" opacity=".18" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#pontos)" />
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        {curvas.map((i) => {
          const k = 1 - i * 0.075
          const cx = 200
          const cy = 196 + i * 3
          const w = 128 * k
          const h = 150 * k
          return (
            <path
              key={i}
              strokeWidth={i === 0 ? 1.4 : 0.7}
              opacity={i === 0 ? 0.95 : 0.55 - i * 0.035}
              d={`M${cx - w} ${cy - h * 0.35}
                 C${cx - w} ${cy - h * 0.95} ${cx - w * 0.3} ${cy - h * 1.05} ${cx - w * 0.12} ${cy - h * 0.78}
                 C${cx - w * 0.05} ${cy - h * 0.7} ${cx + w * 0.05} ${cy - h * 0.7} ${cx + w * 0.12} ${cy - h * 0.78}
                 C${cx + w * 0.3} ${cy - h * 1.05} ${cx + w} ${cy - h * 0.95} ${cx + w} ${cy - h * 0.35}
                 C${cx + w} ${cy + h * 0.2} ${cx + w * 0.72} ${cy + h * 0.45} ${cx + w * 0.62} ${cy + h * 0.8}
                 C${cx + w * 0.55} ${cy + h * 1.05} ${cx + w * 0.3} ${cy + h * 1.05} ${cx + w * 0.2} ${cy + h * 0.72}
                 C${cx + w * 0.1} ${cy + h * 0.5} ${cx - w * 0.1} ${cy + h * 0.5} ${cx - w * 0.2} ${cy + h * 0.72}
                 C${cx - w * 0.3} ${cy + h * 1.05} ${cx - w * 0.55} ${cy + h * 1.05} ${cx - w * 0.62} ${cy + h * 0.8}
                 C${cx - w * 0.72} ${cy + h * 0.45} ${cx - w} ${cy + h * 0.2} ${cx - w} ${cy - h * 0.35}Z`}
            />
          )
        })}
      </g>
      <g stroke="currentColor" strokeWidth=".7" opacity=".6">
        <path d="M40 200h40M320 200h40M200 24v30M200 352v24" />
        <circle cx="200" cy="200" r="182" fill="none" strokeDasharray="1 5" />
      </g>
      <g fill="currentColor" className="font-sans" fontSize="9" letterSpacing="2" opacity=".7">
        <text x="40" y="190">X</text>
        <text x="206" y="36">Y</text>
      </g>
    </svg>
  )
}

export function FluxoDigital() {
  if (!CONFIG.mostrarFluxoDigital) return null
  return (
    <section id="fluxo-digital" aria-labelledby="titulo-fluxo" className="escuro relative overflow-hidden bg-petroleo-900 py-24 text-perola sm:py-28 lg:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <CabecalhoSecao
            id="titulo-fluxo"
            numero="03"
            rotulo="Fluxo digital"
            claro
            titulo={
              <>
                Do arquivo à peça, <em className="font-normal text-pessego">quando o caso pede</em>.
              </>
            }
            texto="Além do fluxo convencional, o laboratório trabalha com etapas digitais em casos selecionados. Como cada caso é diferente, o formato de envio é combinado antes."
          />
          <ul className="mt-10 grid gap-px overflow-hidden border border-perola/12 bg-perola/12 sm:grid-cols-3">
            {itens.map((it, i) => (
              <li key={it.titulo} className="bg-petroleo-900 p-5">
                <span className="rotulo text-pessego/80">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-[1.25rem] leading-snug font-light">{it.titulo}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-petroleo-200">{it.texto}</p>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col items-start gap-5">
            <Botao href={whatsappLink(CONFIG.mensagens.fluxoDigital)} externoLink variante="claro" icone={<IconWhatsApp size={18} />}>
              Perguntar sobre fluxo digital
            </Botao>
            {/* CONFIRMAR COM O LABORATÓRIO: arquivos aceitos e casos atendidos */}
            <span className="text-[0.8125rem]">
              <Pendente claro>Formatos de arquivo aceitos</Pendente>
            </span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[440px] text-petroleo-200 lg:col-span-5 lg:col-start-8">
          <Varredura />
        </div>
      </div>
    </section>
  )
}
