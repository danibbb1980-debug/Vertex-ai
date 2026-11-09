import type { ReactNode } from 'react'
import { CONFIG } from '../config'
import { enderecoLinha1, linkWhatsApp, temWhatsApp } from '../lib/dados'
import { IconeWhatsApp } from './Icones'

interface LinkWhatsProps {
  mensagem?: string
  children: ReactNode
  className?: string
  rotuloAcessivel?: string
}

/** Link para o WhatsApp. Não renderiza nada se CONFIG.whatsapp estiver vazio. */
export function LinkWhatsApp({ mensagem, children, className = 'btn btn-primario', rotuloAcessivel }: LinkWhatsProps) {
  if (!temWhatsApp) return null
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={rotuloAcessivel ? `${rotuloAcessivel} (abre o WhatsApp em nova aba)` : undefined}
    >
      <IconeWhatsApp className="shrink-0" />
      {children}
    </a>
  )
}

export function Rotulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rotulo flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  )
}

/** Endereço em duas linhas; o CEP nunca quebra no hífen. */
export function EnderecoTexto() {
  const e = CONFIG.endereco
  return (
    <>
      {enderecoLinha1()}
      <br />
      {e.bairro}, {e.cidade} - {e.uf}
      {e.cep && (
        <>
          , <span className="whitespace-nowrap">CEP {e.cep}</span>
        </>
      )}
    </>
  )
}
