import { CONFIG } from '../config'
import { enderecoCompleto, linkWhatsApp } from '../lib/utils'
import { TabelaHorarios } from './Horarios'
import { CabecalhoSecao, Foto, IconeInstagram, IconeMapa, IconeWhatsApp, Revelar } from './ui'

export function Estrutura() {
  const fotos = CONFIG.fotos.espaco.filter((f) => f.src)
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="bg-nude-claro/45 py-24 md:py-32">
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-estrutura"
          rotulo="Estrutura"
          titulo={
            <>
              Um espaço <em>reservado</em> para o seu horário.
            </>
          }
        >
          <p>Atendimento individual, em sala própria, no Jardim São Paulo.</p>
        </CabecalhoSecao>

        <div className={`mt-14 grid gap-6 ${fotos.length ? 'lg:grid-cols-12' : ''}`}>
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:gap-5">
              {fotos.map((f, i) => (
                <Revelar
                  key={f.src}
                  atraso={i * 0.08}
                  className={i === 0 ? 'col-span-2' : ''}
                >
                  <Foto
                    src={f.src}
                    alt={f.alt}
                    sizes={i === 0 ? '(min-width: 1024px) 40vw, 92vw' : '(min-width: 1024px) 20vw, 46vw'}
                    className="block overflow-hidden rounded-[1.5rem]"
                    imgClassName={`w-full object-cover ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
                  />
                </Revelar>
              ))}
            </div>
          )}

          <Revelar atraso={0.1} className={fotos.length ? 'lg:col-span-5' : ''}>
            <div className="h-full rounded-[1.75rem] border border-choco/10 bg-creme p-7 md:p-9">
              <h3 className="rotulo">Horário por dia</h3>
              <div className="mt-4">
                <TabelaHorarios legenda="Horário de atendimento por dia da semana" />
              </div>
              <p className="mt-3 text-sm text-choco/80">{CONFIG.avisoHorarios}</p>

              <h3 className="rotulo mt-9">Endereço</h3>
              <p className="mt-3 flex gap-3">
                <IconeMapa className="mt-1 size-5 shrink-0 text-ouro" />
                <span>{enderecoCompleto()}</span>
              </p>

              <h3 className="rotulo mt-9">Contato</h3>
              <ul className="mt-3 space-y-1">
                {CONFIG.whatsapp && (
                  <li>
                    <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 hover:text-ouro-esc">
                      <IconeWhatsApp className="size-5 text-ouro" />
                      <span>
                        WhatsApp <span className="font-medium">{CONFIG.whatsappExibicao}</span>
                      </span>
                    </a>
                  </li>
                )}
                {CONFIG.instagram && (
                  <li>
                    <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 hover:text-ouro-esc">
                      <IconeInstagram className="size-5 text-ouro" />
                      <span>
                        Instagram <span className="font-medium">{CONFIG.instagramUsuario}</span>
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
