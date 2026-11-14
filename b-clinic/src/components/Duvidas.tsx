import { useId, useState } from 'react'
import { CONFIG } from '../config'
import { agendarCanal, minusculaInicial } from '../lib/links'
import { formAtivo } from './Header'

function horariosTexto() {
  const abertos = CONFIG.horarios.filter((h) => h.abre && h.fecha)
  const fechados = CONFIG.horarios.filter((h) => !(h.abre && h.fecha))
  const grupos: string[] = []
  const iguais = abertos.every((h) => h.abre === abertos[0]?.abre && h.fecha === abertos[0]?.fecha)
  if (abertos.length && iguais) {
    const rotulos = abertos.map((h) => h.rotulo.toLowerCase())
    const dias = rotulos.length > 1 ? `De ${rotulos[0]} a ${rotulos[rotulos.length - 1]}` : rotulos[0]
    grupos.push(`${dias}, das ${abertos[0].abre.replace(':', 'h')} às ${abertos[0].fecha.replace(':', 'h')}.`)
  } else {
    abertos.forEach((h) => grupos.push(`${h.rotulo}: ${h.abre.replace(':', 'h')} às ${h.fecha.replace(':', 'h')}.`))
  }
  if (fechados.length) grupos.push(`${fechados.map((h) => h.rotulo).join(', ')}: fechado.`)
  grupos.push(CONFIG.avisoHorarios)
  return grupos.join(' ')
}

export function perguntas() {
  const e = CONFIG.endereco
  const nomes = CONFIG.tratamentos.flatMap((c) => c.itens.map((t) => minusculaInicial(t.nome)))
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0]
  const canal = agendarCanal()
  const q: { p: string; r: string }[] = [
    {
      p: 'Como agendar uma avaliação?',
      r: formAtivo()
        ? `Pelo botão “Agendar avaliação”, que abre uma conversa no WhatsApp, ou pelo formulário “Solicitar agendamento”, em que você indica um dia e um horário de preferência. A equipe confirma a disponibilidade pela conversa.`
        : `Pelo botão “Agendar avaliação”, que abre uma conversa pelo ${canal}. A equipe confirma a disponibilidade pela conversa.`,
    },
    {
      p: 'Como é a primeira avaliação?',
      r: 'É uma conversa sobre o que você procura, seguida de uma análise individual. Se houver indicação, as possibilidades são explicadas com calma, e nenhum procedimento é definido sem essa etapa.',
    },
    {
      p: 'Preciso saber qual tratamento quero antes de agendar?',
      r: 'Não. Você pode agendar uma avaliação inicial e conversar sobre o que procura. A indicação vem da avaliação.',
    },
    {
      p: 'O que levar no dia?',
      r: 'Um documento com foto. Se já tiver feito procedimentos estéticos ou usar algum medicamento, vale levar essas informações para conversar durante a avaliação.',
    },
    {
      p: 'Quais tratamentos a clínica oferece?',
      r: `Entre os tratamentos informados pela clínica estão ${lista}. A lista completa e a indicação para o seu caso são conversadas na avaliação.`,
    },
    {
      p: 'Todo tratamento serve para todas as pessoas?',
      r: 'Não. Cada pessoa tem características próprias, e a indicação de qualquer procedimento depende de avaliação individual por profissional habilitado.',
    },
    {
      p: 'Quais são os horários de atendimento?',
      r: horariosTexto(),
    },
    {
      p: 'Onde fica a clínica?',
      r: `${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}. Na seção de contato há o mapa e o botão “Como chegar”.`,
    },
    {
      p: 'Posso tirar dúvidas antes de agendar?',
      r: `Sim. A conversa pelo ${canal} também serve para dúvidas gerais. Questões sobre a sua saúde são tratadas na avaliação, com calma.`,
    },
  ]
  if (formAtivo())
    q.push({
      p: 'O site guarda os dados que eu digito?',
      r: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp da clínica. Nada é enviado a servidores nem salvo no navegador.',
    })
  return q
}

/** Acordeão acessível: botões com aria-expanded, regiões rotuladas, abertura por grid-rows. */
export function Duvidas() {
  const [aberta, setAberta] = useState<number>(-1)
  const id = useId()
  const itens = perguntas()

  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-osso-2 py-24 md:py-36">
      <div className="container-b grid gap-14 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
            <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
            Dúvidas frequentes
          </p>
          <h2 id="duvidas-titulo" className="titulo mt-6 text-[clamp(2.4rem,5.4vw,4.25rem)]">
            Antes de <span className="enfase">marcar</span>.
          </h2>
        </header>
        <div className="lg:col-span-8">
          {itens.map((it, i) => {
            const aberto = aberta === i
            return (
              <div key={it.p} className="border-t border-preto/25 last:border-b">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q-${i}`}
                    aria-expanded={aberto}
                    aria-controls={`${id}-r-${i}`}
                    onClick={() => setAberta(aberto ? -1 : i)}
                    className="group flex min-h-16 w-full cursor-pointer items-start gap-5 py-6 text-left"
                  >
                    <span aria-hidden="true" className="num w-7 shrink-0 pt-1 text-sm tracking-[0.1em] text-champanhe-escuro">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[1.1875rem] font-normal leading-snug transition-transform duration-300 group-hover:translate-x-1 md:text-[1.375rem]">
                      {it.p}
                    </span>
                    <span aria-hidden="true" className="relative mt-2.5 h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-preto" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-px bg-preto transition-transform duration-300 ${
                          aberto ? 'scale-y-0' : ''
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-r-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  inert={!aberto}
                  className={`grid transition-[grid-template-rows] duration-400 ease-[var(--ease-corte)] motion-reduce:transition-none ${
                    aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-12 text-pedra">{it.r}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
