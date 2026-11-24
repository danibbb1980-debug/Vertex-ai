import { CONFIG } from '../config'
import { waUrl } from '../lib/whatsapp'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="faixa" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

/** Barra fixa no celular + botão flutuante discreto no desktop. */
export function AgendarFixo() {
  if (!CONFIG.usarWhatsapp) return null
  return (
    <div className="fixo" data-fixo="">
      <a className="btn btn--tinta fixo-btn" href={waUrl()} target="_blank" rel="noopener noreferrer">
        <span className="btn-txt">Agendar avaliação</span>
        <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
      </a>
    </div>
  )
}
