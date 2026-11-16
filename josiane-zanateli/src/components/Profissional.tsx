import { CONFIG, temTexto } from '../config'
import { CONTORNOS, VIEWBOX } from '../contornos'
import { Enfase } from './ui'

export function Profissional() {
  const p = CONFIG.profissional
  const foto = p.foto
  const [nome, ...resto] = p.nome.split(' ')
  return (
    <section id="profissional" aria-labelledby="titulo-profissional" className="relative overflow-hidden bg-areia">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 items-center gap-x-6 gap-y-14 px-5 py-24 sm:px-8 lg:py-36">
        {foto && (
          <figure className="relative col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1">
            {/* Curvas atrás do retrato, escapando pela borda: sobreposição controlada */}
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="pointer-events-none absolute -bottom-[18%] -right-[30%] w-[95%] stroke-terracota"
              aria-hidden="true"
              focusable="false"
            >
              {CONTORNOS.slice(9).map((d, i) => (
                <path key={i} d={d} className="curva" strokeWidth="1" />
              ))}
            </svg>
            <div className="relative bg-areia-2" style={{ aspectRatio: `${foto.largura} / ${foto.altura}` }}>
              <picture>
                <source
                  type="image/avif"
                  srcSet={`/fotos/${foto.arquivo}-480.avif 480w, /fotos/${foto.arquivo}-800.avif 800w, /fotos/${foto.arquivo}-1100.avif 1100w`}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 66vw, 92vw"
                />
                <img
                  src={`/fotos/${foto.arquivo}-800.webp`}
                  srcSet={`/fotos/${foto.arquivo}-480.webp 480w, /fotos/${foto.arquivo}-800.webp 800w, /fotos/${foto.arquivo}-1100.webp 1100w`}
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 66vw, 92vw"
                  width={foto.largura}
                  height={foto.altura}
                  alt={foto.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                />
              </picture>
            </div>
            <figcaption className="rotulo relative mt-4 flex w-fit items-center gap-3 bg-areia py-1 pr-3 text-grafite-2">
              <span className="h-px w-8 bg-terracota" aria-hidden="true" />
              {p.nome}, {CONFIG.cidade} - {CONFIG.uf}
            </figcaption>
          </figure>
        )}
        <div className={`relative col-span-12 ${foto ? 'lg:col-span-6 lg:col-start-7' : 'lg:col-span-8 lg:col-start-3'}`}>
          <p className="rotulo text-terracota-escuro">O nome por trás do endereço</p>
          <h2 id="titulo-profissional" className="mt-6 text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] tracking-[-0.035em]">
            <Enfase texto={`${nome} *${resto.join(' ')}*`} />
          </h2>
          {(temTexto(p.profissao) || temTexto(p.registro)) && (
            <p className="mt-4 text-grafite-2">
              {[p.profissao, p.registro].filter(temTexto).join(' · ')}
            </p>
          )}
          <div className="mt-10 max-w-[44ch] space-y-5 text-[1.0625rem] leading-[1.7]">
            <p>
              Este endereço leva o nome de quem o conduz. Sobrancelhas, estética facial, estética corporal e nail designer,
              no Centro de {CONFIG.cidade}, com hora marcada.
            </p>
            <p className="text-grafite-2">
              Antes de cada atendimento, uma conversa: o que você procura, a sua rotina e o que faz sentido para você.
            </p>
          </div>
          {CONFIG.instagram.url && (
            <a
              href={CONFIG.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-12 items-center gap-3 border-b border-grafite pb-1 text-[1rem] hover:border-terracota-escuro hover:text-terracota-escuro"
            >
              {CONFIG.instagram.usuario}
              <span className="sr-only"> no Instagram (abre em nova aba)</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
