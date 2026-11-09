import { useRef, useState } from 'react'
import { useProgressoRolagem } from '../lib/rolagem'

const ETAPAS = [
  { titulo: 'Contato e agendamento', texto: 'Você envia uma mensagem pelo WhatsApp ou pelo formulário do site, e a equipe responde com os horários disponíveis.' },
  { titulo: 'Consulta e avaliação', texto: 'A Dra. Luciana conversa com você, ouve suas dúvidas e faz a avaliação médica.' },
  { titulo: 'Indicação', texto: 'Quando existe uma indicação, ela é explicada com clareza: o que é, como funciona e quais cuidados envolve.' },
  { titulo: 'Acompanhamento', texto: 'Os retornos são combinados conforme a avaliação de cada caso.' },
]

/**
 * Linha do tempo com progresso ao rolar. Inspirada no "Animated Progress Stepper" (21st.dev,
 * @shadcnspace): linha de progresso suave e etapa ativa destacada. Adaptada para vertical,
 * ligada à rolagem, sem biblioteca e animando só transform.
 */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const linha = useRef<HTMLDivElement>(null)
  const [ativa, setAtiva] = useState(0)
  const ativaRef = useRef(0)
  useProgressoRolagem(
    ref,
    (p) => {
      if (linha.current) linha.current.style.transform = `scaleY(${p})`
      const n = Math.min(ETAPAS.length, Math.floor(p * ETAPAS.length + 0.35))
      if (n !== ativaRef.current) {
        ativaRef.current = n
        setAtiva(n)
      }
    },
    { alvo: [0, 1], tela: [0.75, 0.55] },
  )

  return (
    <section id="como-funciona" className="secao relative overflow-hidden bg-grafite text-pedra em-escuro" aria-labelledby="titulo-como">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilas/70 to-transparent" />
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-revelar>
          <div className="lg:sticky lg:top-36">
            <p className="rotulo mb-6 flex items-center gap-3 !text-lilas">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              Como funciona
            </p>
            <h2 id="titulo-como" className="titulo-secao !text-pedra">
              Do primeiro contato ao <em className="text-lilas">acompanhamento</em>.
            </h2>
            <p className="mt-6 max-w-md text-lg text-pedra/75">Quatro etapas simples. Em cada uma, você sabe o que acontece e por quê.</p>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-7">
          <div aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-pedra/15">
            <div ref={linha} className="h-full w-full origin-top bg-lilas" style={{ transform: 'scaleY(0)' }} />
          </div>
          {ETAPAS.map((e, i) => {
            const feita = i < ativa
            return (
              <li key={e.titulo} className="relative grid grid-cols-[2.8rem_1fr] gap-6 pb-12 last:pb-0">
                <span
                  className={`relative z-10 flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full border font-serif text-lg transition-[background-color,border-color,color] duration-500 ${
                    feita ? 'border-lilas bg-lilas text-grafite' : 'border-pedra/25 bg-grafite text-pedra/70'
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className={`pt-1.5 transition-opacity duration-500 ${feita ? 'opacity-100' : 'opacity-[0.78]'}`}>
                  <h3 className="font-serif text-[1.75rem] !text-pedra">
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {e.titulo}
                  </h3>
                  <p className="mt-3 max-w-lg text-pedra/85">{e.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
