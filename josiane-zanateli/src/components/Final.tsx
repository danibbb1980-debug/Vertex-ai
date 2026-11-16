import { useEffect, useState } from 'react'
import { CONFIG, temTexto } from '../config'
import { ContornoSvg } from './CamadaContorno'
import { Assinatura, BotaoInstagram, BotaoWhats, Enfase } from './ui'

export function CtaFinal() {
  return (
    <section data-sem-fixo aria-labelledby="titulo-final" className="on-musgo grao relative overflow-hidden bg-musgo text-areia">
      <div className="pointer-events-none absolute -left-[40vw] top-[-20%] aspect-[2/3] w-[110vw] -scale-x-100 sm:-left-[20vw] sm:w-[70vw] lg:-left-[8vw] lg:w-[46vw]" aria-hidden="true">
        <ContornoSvg classe="stroke-areia/25 [stroke-width:1px]" desenhar={false} />
      </div>
      <div className="relative z-[2] mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 px-5 py-28 sm:px-8 lg:py-40">
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <h2 id="titulo-final" className="text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.98] tracking-[-0.035em]">
            <Enfase texto="Seu horário começa por uma *mensagem*." />
          </h2>
          <div className="mt-12 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <BotaoWhats variante="claro" rotuloAcessivel="Agendar horário" />
            <BotaoInstagram variante="contorno-claro" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Rodape() {
  const e = CONFIG.endereco
  return (
    <footer data-sem-fixo className="on-musgo bg-grafite text-areia">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-12 px-5 py-16 sm:px-8 lg:py-20">
        <div className="col-span-12 lg:col-span-5">
          <Assinatura claro />
          <p className="mt-8 max-w-[44ch] text-[0.9rem] leading-relaxed text-areia-suave">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação
            individual.
          </p>
          {temTexto(CONFIG.responsavelTecnico) && (
            <p className="mt-4 text-[0.9rem] text-areia-suave">Responsável técnico: {CONFIG.responsavelTecnico}</p>
          )}
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-7">
          <h2 className="rotulo !font-sans text-areia-suave">Endereço</h2>
          <address className="mt-4 not-italic leading-relaxed">
            {e.logradouro}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            <span className="num">CEP {e.cep}</span>
          </address>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <h2 className="rotulo !font-sans text-areia-suave">Contato</h2>
          <ul className="mt-2">
            {CONFIG.usarWhatsapp && CONFIG.whatsapp && (
              <li>
                <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-sub inline-flex min-h-12 items-center">
                  <span className="num">WhatsApp {CONFIG.whatsappExibicao}</span>
                </a>
              </li>
            )}
            {temTexto(CONFIG.email) && (
              <li>
                <a href={`mailto:${CONFIG.email}`} className="link-sub inline-flex min-h-12 items-center break-all">
                  {CONFIG.email}
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-sub inline-flex min-h-12 items-center">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="link-sub inline-flex min-h-12 items-center">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
        <p className="col-span-12 border-t border-areia/15 pt-6 text-[0.8rem] text-areia-suave">
          <span className="num">{new Date().getFullYear()}</span> · {CONFIG.nome} | {CONFIG.descritor} · {CONFIG.cidade} - {CONFIG.uf}
        </p>
      </div>
    </footer>
  )
}

/** Barra fixa no celular e botão flutuante discreto no desktop (aparecem depois do hero). */
export function AgendarFixo() {
  const [passouHero, setPassouHero] = useState(false)
  const [sobreposto, setSobreposto] = useState(false)
  useEffect(() => {
    const on = () => setPassouHero(window.scrollY > window.innerHeight * 0.7)
    on()
    window.addEventListener('scroll', on, { passive: true })
    // Some quando o formulário, o CTA final ou o rodapé estão na tela, para não cobrir conteúdo.
    const vistos = new Set<Element>()
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target)))
      setSobreposto(vistos.size > 0)
    })
    document.querySelectorAll('[data-sem-fixo]').forEach((el) => io.observe(el))
    return () => {
      window.removeEventListener('scroll', on)
      io.disconnect()
    }
  }, [])
  const visivel = passouHero && !sobreposto
  if (!CONFIG.usarWhatsapp) return null
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-fio bg-areia p-3 transition-transform duration-300 motion-reduce:transition-none lg:inset-x-auto lg:bottom-6 lg:right-6 lg:border-0 lg:bg-transparent lg:p-0 ${
        visivel ? 'translate-y-0' : 'translate-y-[120%] lg:translate-y-[calc(100%+2rem)]'
      }`}
      inert={!visivel}
    >
      <BotaoWhats className="w-full lg:w-auto" rotuloAcessivel="Agendar horário">
        Agendar horário
      </BotaoWhats>
    </div>
  )
}
