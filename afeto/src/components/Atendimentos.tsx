import { CONFIG } from '../config'
import { linkWhatsAppAtendimento, porExtenso } from '../lib/dados'
import { TituloEnfase } from './Enfase'
import { IconeWhatsApp } from './Icones'

/*
 * Cada área é uma peça do mosaico do logo: quarto de círculo, meia-lua, gota.
 * Os padrões se repetem, então a lista pode crescer ou diminuir.
 */
type Tom = 'terracota' | 'salvia' | 'ambar' | 'creme'
const TONS: Record<Tom, { fundo: string; texto: string; suave: string; link: string }> = {
  terracota: { fundo: 'bg-terracota', texto: 'text-papel', suave: 'text-papel', link: 'text-papel' },
  salvia: { fundo: 'bg-salvia', texto: 'text-tinta', suave: 'text-tinta', link: 'text-tinta' },
  ambar: { fundo: 'bg-ambar', texto: 'text-tinta', suave: 'text-tinta', link: 'text-tinta' },
  creme: { fundo: 'bg-papel ring-1 ring-inset ring-fio', texto: 'text-tinta', suave: 'text-tinta-suave', link: 'text-terracota-texto' },
}
/* forma: raio grande num canto (quarto de círculo), em cima (meia-lua) ou em três cantos (gota) */
const PECAS: { tom: Tom; forma: string; espaco: string; span: string }[] = [
  { tom: 'terracota', forma: 'rounded-[1.75rem] rounded-tl-[11rem] lg:rounded-tl-[16rem]', espaco: 'pt-24 lg:pt-36 lg:pl-40', span: 'lg:col-span-7' },
  { tom: 'salvia', forma: 'rounded-[1.75rem] rounded-t-[10rem] lg:rounded-t-[12rem]', espaco: 'pt-24 lg:pt-32', span: 'lg:col-span-5' },
  { tom: 'creme', forma: 'rounded-[1.75rem] rounded-br-[9rem]', espaco: 'pb-20', span: 'lg:col-span-4' },
  { tom: 'ambar', forma: 'rounded-[9rem] rounded-tl-[1.75rem]', espaco: 'pb-16 pr-14 lg:pr-20', span: 'lg:col-span-4' },
  { tom: 'salvia', forma: 'rounded-[1.75rem] rounded-tr-[9rem]', espaco: 'pt-20 pr-16', span: 'lg:col-span-4' },
  { tom: 'ambar', forma: 'rounded-[1.75rem] rounded-b-[10rem]', espaco: 'pb-24', span: 'lg:col-span-5' },
  { tom: 'terracota', forma: 'rounded-[1.75rem] rounded-tl-[7rem] lg:rounded-[8rem] lg:rounded-br-[1.75rem]', espaco: 'pt-20 lg:pt-16 lg:pl-16', span: 'lg:col-span-3' },
  { tom: 'creme', forma: 'rounded-[1.75rem] rounded-bl-[9rem]', espaco: 'pb-20 lg:pl-24', span: 'lg:col-span-4' },
]

export function Atendimentos() {
  const lista = CONFIG.especialidades.filter((e) => e.nome)
  if (!lista.length) return null
  const qtd = lista.length
  const titulo =
    qtd > 1 ? `${porExtenso(qtd)} áreas da saúde, um só *endereço*.` : 'Uma área da saúde, com *hora* marcada.'
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="bg-creme-claro py-20 lg:py-32">
      <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="rotulo mb-5 text-terracota-texto">Atendimentos</p>
            <h2 id="titulo-atendimentos" className="text-[clamp(2.4rem,5.6vw,4.6rem)] text-tinta">
              <TituloEnfase texto={titulo} />
            </h2>
          </div>
          <p className="self-end text-tinta-suave lg:col-span-4 lg:col-start-9">
            Cada área olha para um aspecto da vida. Qual atendimento buscar depende de avaliação individual, e a equipe
            orienta você nesse primeiro passo.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {lista.map((e, i) => {
            const p = PECAS[i % PECAS.length]
            const t = TONS[p.tom]
            const ultimoSozinho = i === qtd - 1 && qtd % 2 === 1
            return (
              <li
                key={e.nome}
                className={`group relative flex flex-col justify-between overflow-hidden p-7 sm:p-9 ${t.fundo} ${p.forma} ${p.espaco} ${p.span} ${
                  ultimoSozinho ? 'md:col-span-2' : ''
                } min-h-[19rem] transition-[border-radius] duration-500`}
              >
                <div>
                  <span className={`num block text-[1.1rem] ${t.suave}`} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`mt-3 text-[clamp(2rem,3vw,2.6rem)] leading-[1] ${t.texto}`}>{e.nome}</h3>
                  <p className={`mt-4 max-w-[28rem] text-[1rem] leading-relaxed ${t.suave}`}>{e.descricao}</p>
                </div>
                <div className="mt-7">
                  <p className={`text-[0.85rem] ${t.suave}`}>Depende de avaliação individual.</p>
                  <a
                    href={linkWhatsAppAtendimento(e.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`link-fio mt-2 inline-flex min-h-12 items-center gap-2 font-semibold ${t.link} ${
                      p.tom === 'terracota' ? 'no-escuro' : ''
                    }`}
                  >
                    <IconeWhatsApp className="size-[1.1rem]" />
                    <span>Conversar sobre {e.nome}</span>
                  </a>
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-10 size-28 rounded-full bg-current opacity-[0.06] transition-transform duration-700 ease-out group-hover:scale-[2.2]"
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
