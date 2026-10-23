import { CONFIG, type Trabalho } from '../config'
import { whatsappLink } from '../lib/links'
import { CabecalhoSecao, Foto, IconWhatsApp, LinkSeta } from './ui'

const trabalhos: Trabalho[] = CONFIG.trabalhos
// Cartões só para trabalhos marcados como destaque e com foto real.
const destaques = trabalhos.filter((t) => t.destaque && t.foto && t.fotoTamanho)
const outros = trabalhos.filter((t) => !destaques.includes(t))

const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

/** Foto do cartão. Fotos pequenas (< 700 px) ficam montadas sobre passe-partout, sem ampliar demais. */
function FotoCartao({ t }: { t: Trabalho }) {
  const [w, h] = t.fotoTamanho!
  const alt = t.fotoAlt ?? t.nome
  if (w >= 700)
    return (
      <Foto
        nome={t.foto!}
        alt={alt}
        tamanho={[w, h]}
        sizes="(min-width: 1024px) 45vw, 92vw"
        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-atelie)] group-hover:scale-[1.03]"
      />
    )
  return (
    <div className="flex h-full items-center justify-center p-6 sm:p-8">
      <div className="registro h-full bg-white p-2 shadow-[0_1px_0_rgb(0_0_0/0.04),0_12px_30px_-18px_rgb(15_51_53/0.35)]">
        <Foto nome={t.foto!} alt={alt} tamanho={[w, h]} className="block h-full w-auto max-w-none" />
      </div>
    </div>
  )
}

export function Trabalhos() {
  return (
    <section id="trabalhos" aria-labelledby="titulo-trabalhos" className="py-24 sm:py-28 lg:py-36">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <CabecalhoSecao
            id="titulo-trabalhos"
            numero="01"
            rotulo="Trabalhos"
            titulo={
              <>
                Da prótese fixa à removível, <em className="font-normal text-petroleo-700">com o mesmo cuidado</em>.
              </>
            }
          />
          <p className="max-w-sm text-[1rem] leading-relaxed text-cinza lg:pb-2">
            A indicação clínica é sempre do cirurgião-dentista responsável pelo caso. O laboratório executa a partir do modelo,
            dos registros e da prescrição.
          </p>
        </div>

        {/* Cartões com foto real */}
        <ul className="mt-14 grid gap-x-10 gap-y-16 lg:mt-20 lg:grid-cols-2 lg:gap-y-20">
          {destaques.map((t, i) => (
            <li key={t.id}>
              <article aria-labelledby={`trabalho-${t.id}`} className="group">
                <div className="registro aspect-[4/3] overflow-hidden bg-marfim">
                  <FotoCartao t={t} />
                </div>
                <div className="mt-7 flex items-baseline gap-4">
                  <span className="font-serif text-[0.95rem] text-terracota tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="rotulo text-petroleo-600">{t.categoria}</p>
                </div>
                <h3
                  id={`trabalho-${t.id}`}
                  className="mt-3 text-[1.75rem] leading-tight font-light text-petroleo-900 sm:text-[2.125rem]"
                >
                  {t.nome}
                </h3>
                <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-cinza">{t.descricao}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-linha pt-5">
                  <ul className="flex flex-wrap gap-2" aria-label="Características">
                    {t.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-linha px-3 py-1 text-[0.75rem] font-medium text-tinta/75">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink(CONFIG.mensagens.trabalho(minuscula(t.nome)))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-[0.875rem] font-semibold text-petroleo-700 underline decoration-petroleo-700/25 underline-offset-[6px] transition-colors hover:decoration-petroleo-700"
                  >
                    <IconWhatsApp size={17} />
                    Conversar sobre este trabalho
                    <span className="sr-only">: {t.nome} (abre o WhatsApp em nova aba)</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* Faixa compacta, sem imagem */}
        {outros.length > 0 && (
          <div className="mt-20 border border-linha bg-marfim p-6 sm:p-8 lg:mt-24 lg:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="rotulo text-petroleo-600">Outros trabalhos</h3>
                <p className="mt-3 text-[1rem] text-cinza">Também realizados pelo laboratório.</p>
              </div>
              <LinkSeta href={whatsappLink()} externoLink className="text-petroleo-700">
                Perguntar sobre um deles
              </LinkSeta>
            </div>
            <ul className="mt-6 border-t border-linha">
              {outros.map((t) => (
                <li
                  key={t.id}
                  className="grid gap-1 border-b border-linha py-4 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-8"
                >
                  <span className="font-serif text-[1.25rem] leading-snug font-light text-petroleo-900">{t.nome}</span>
                  <span className="text-[1rem] leading-relaxed text-cinza sm:pt-0.5">{t.resumo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
