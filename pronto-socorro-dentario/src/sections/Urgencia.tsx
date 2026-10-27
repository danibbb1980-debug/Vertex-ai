import type { PointerEvent } from 'react'
import { waLink } from '../config'
import { Alert, Arrow, Calm, Drop, FaceSwelling, Jar, Pill, ToothCrack, ToothImpact, ToothLoose, ToothPain } from '../components/icons'
import { SectionHead } from '../components/ui'

const SITUACOES = [
  { Icon: ToothPain, t: 'Dor de dente forte', d: 'Dor que não passa, ou que piora ao mastigar, ao deitar ou com frio e calor, merece avaliação.' },
  { Icon: ToothCrack, t: 'Dente quebrado ou fraturado', d: 'Mesmo sem dor, uma fratura pode deixar partes sensíveis do dente expostas.' },
  { Icon: ToothImpact, t: 'Trauma ou pancada', d: 'Quedas e batidas no rosto podem afetar dentes, gengiva e a posição dos dentes.' },
  { Icon: FaceSwelling, t: 'Inchaço na gengiva ou na face', d: 'Inchaço pode ter causas diferentes e precisa ser avaliado por um profissional.' },
  { Icon: ToothLoose, t: 'Restauração ou prótese que soltou', d: 'Guarde a peça, se possível, e leve com você para a avaliação.' },
  { Icon: Drop, t: 'Sangramento', d: 'Sangramento na boca que não diminui, ou que começou depois de um procedimento, pede orientação.' },
]

/** Luz que segue o ponteiro: atualiza variáveis CSS do cartão sob o cursor. */
export function trackSpot(e: PointerEvent<HTMLElement>) {
  const card = (e.target as HTMLElement).closest<HTMLElement>('.spot')
  if (!card) return
  const r = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - r.left}px`)
  card.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function QuandoProcurar() {
  return (
    <section aria-labelledby="urgencia-title" id="urgencia" className="py-20 lg:py-28">
      <div className="wrap">
        <SectionHead
          id="urgencia-title"
          eyebrow="Quando procurar"
          title="Situações em que vale chamar a gente"
          intro="Se você se reconhece em alguma delas, fale com a clínica. Explicar o que está sentindo já ajuda a orientar o próximo passo."
        />

        <ul onPointerMove={trackSpot} className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SITUACOES.map(({ Icon, t, d }, i) => (
            <li key={t} className="spot reveal group grid grid-cols-[auto_1fr] gap-x-4 bg-ivory p-5 sm:flex sm:flex-col sm:p-8" style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}>
              <span className="corner -left-px -top-px" aria-hidden="true" />
              <span className="row-span-3 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-brand-ink transition-colors duration-300 group-hover:border-brand/40">
                <Icon size={26} />
              </span>
              <h3 className="mt-2.5 text-[1.3rem] font-semibold sm:mt-6 sm:text-[1.45rem]">{t}</h3>
              <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-muted sm:mt-2.5">{d}</p>
              <a
                href={waLink(`Olá! Vi o site do Pronto Socorro Dentário e preciso de atendimento de urgência: ${t.toLowerCase()}.`)}
                target="_blank"
                rel="noopener"
                className="link-arrow mt-2 self-start sm:mt-5"
              >
                Falar sobre isso
                <span className="sr-only">: {t} (abre o WhatsApp)</span>
                <Arrow size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const CUIDADOS = [
  { Icon: Calm, t: 'Mantenha a calma', d: 'Respire e fale com a clínica. Contar o que aconteceu ajuda a orientar o que fazer até a avaliação.' },
  { Icon: Pill, t: 'Não coloque medicamento sobre o dente ou a gengiva', d: 'Comprimidos, pomadas ou outros produtos aplicados direto no local podem irritar a gengiva.' },
  { Icon: Alert, t: 'Não se automedique', d: 'Qualquer medicamento deve ser indicado por um profissional, depois de entender o seu caso.' },
  { Icon: Jar, t: 'Guarde o fragmento do dente, se houver', d: 'Coloque em um recipiente limpo e leve com você para a avaliação.' },
]

export function PrimeirosCuidados() {
  return (
    <section aria-labelledby="cuidados-title" id="primeiros-cuidados" className="border-y border-line bg-paper py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHead
              id="cuidados-title"
              eyebrow="Enquanto você chega"
              title="Primeiros cuidados"
              intro="Orientações gerais e simples. Elas não substituem a avaliação, mas ajudam a não piorar a situação."
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          {/* CONFIRMAR COM A CLÍNICA: revisar estas orientações com o responsável técnico */}
          <ol className="divide-y divide-line border-y border-line">
            {CUIDADOS.map(({ Icon, t, d }, i) => (
              <li key={t} className="reveal flex gap-5 py-7 sm:gap-7">
                <span className="w-9 flex-none pt-1 font-display text-sm font-bold tracking-[0.1em] text-brand-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="flex items-start gap-3 text-[1.35rem] font-semibold sm:text-2xl">
                    {t}
                  </h3>
                  <p className="mt-2 text-muted">{d}</p>
                </div>
                <Icon size={28} className="hidden flex-none text-brand sm:block" />
              </li>
            ))}
          </ol>

          {/* CONFIRMAR COM A CLÍNICA: texto do aviso com o responsável técnico */}
          <aside
            aria-label="Quando procurar atendimento hospitalar"
            className="reveal mt-8 flex gap-4 rounded-2xl border border-forest/15 bg-forest p-6 text-white/85 sm:p-7 on-dark"
          >
            <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-amber text-on-amber">
              <Alert size={20} />
            </span>
            <p className="text-[0.98rem] leading-relaxed">
              <strong className="font-semibold text-paper">Atenção:</strong> em caso de dificuldade para respirar ou engolir, inchaço que avança
              rapidamente no rosto ou pescoço, desmaio ou trauma grave, procure o{' '}
              <a href="tel:192" className="font-bold text-amber underline underline-offset-4">
                SAMU (192)
              </a>{' '}
              ou o pronto atendimento hospitalar.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
