import type { ReactNode } from 'react'
import { TextoRevelado } from './TextoRevelado'
import { Revelar } from './Revelar'

export function CabecalhoSecao({
  rotulo,
  titulo,
  id,
  children,
  claro = true,
  centro = false,
}: {
  rotulo: string
  titulo: string
  id: string
  children?: ReactNode
  claro?: boolean
  centro?: boolean
}) {
  return (
    <div className={`max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
      <p className={`rotulo mb-5 flex items-center gap-3 ${centro ? 'justify-center' : ''} ${claro ? 'text-menta-texto' : 'text-menta'}`}>
        <span aria-hidden="true" className={`inline-block h-px w-8 ${claro ? 'bg-menta-texto/60' : 'bg-menta/60'}`} />
        {rotulo}
      </p>
      <h2 id={id} className={`text-[2.15rem] sm:text-5xl lg:text-[3.4rem] ${claro ? 'text-tinta' : 'text-white'}`}>
        <TextoRevelado texto={titulo} />
      </h2>
      {children && (
        <Revelar atraso={0.15}>
          <div className={`mt-6 text-lg leading-relaxed ${claro ? 'text-tinta-suave' : 'text-grafite-200'}`}>{children}</div>
        </Revelar>
      )}
    </div>
  )
}
