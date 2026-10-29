import type { CSSProperties } from 'react'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { enderecoLinha, linkGeral, mapaEmbed } from '../lib/whatsapp'
import { resumoHorarios } from '../lib/horarios'
import { useApareceu } from '../lib/hooks'
import { Cabecalho } from '../components/Titulo'
import { IconeInstagram, IconeWhatsapp } from '../components/Marcas'
import { Logo } from '../components/Logo'
import { Ondas } from '../components/Ondas'

const atraso = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

function Mapa() {
  const { unidade } = useUnidade()
  const [ref, carregar] = useApareceu<HTMLDivElement>('400px')
  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] bg-aqua-100 shadow-[0_0_0_1px_rgb(27_77_82/0.08)] lg:aspect-auto lg:h-full lg:min-h-[28rem]"
    >
      {/* fundo enquanto o mapa carrega: ondas suaves, sem texto */}
      <Ondas
        altura={200}
        className="absolute inset-x-0 bottom-0 h-1/2"
        camadas={[
          { cor: '#c6e7e8', base: 80, amp: 16, comp: 720, dur: 40 },
          { cor: '#a3d8db', base: 120, amp: 12, comp: 480, fase: 100, dur: 30, reverso: true, opacidade: 0.7 },
        ]}
      />
      {carregar && (
        <iframe
          key={unidade.id}
          title={`Mapa: ${CONFIG.nome}, ${enderecoLinha(unidade)}`}
          src={mapaEmbed(unidade)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  )
}

export function Contato() {
  const { unidade } = useUnidade()
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-ice py-20 sm:py-28">
      <div className="container-site">
        <Cabecalho id="titulo-contato" rotulo="Localização e contato" titulo="Venha nos *visitar*." />
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="reveal flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-7 shadow-[0_0_0_1px_rgb(27_77_82/0.08)] sm:p-9">
            <div className="flex items-start gap-4">
              <span className="icone-circulo">
                <MapPin aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-xl">Endereço</h3>
                <address className="mt-1 not-italic text-ink-soft">
                  {unidade.endereco.logradouro}
                  <br />
                  {unidade.endereco.bairro}, {unidade.endereco.cidade} - {unidade.endereco.uf}
                  <br />
                  CEP {unidade.endereco.cep}
                </address>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="icone-circulo">
                <Clock aria-hidden="true" size={22} strokeWidth={1.7} />
              </span>
              <div className="flex-1">
                <h3 className="text-xl">Horários</h3>
                <dl className="mt-1 text-ink-soft">
                  {resumoHorarios(unidade.horarios).map((h) => (
                    <div key={h.dias} className="flex flex-wrap gap-x-2">
                      <dt>{h.dias}:</dt>
                      <dd className={h.aberto ? 'font-semibold text-ink' : ''}>{h.horario.toLowerCase()}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-sm text-ink-soft">{unidade.observacaoHorarios}</p>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3 border-t border-teal-800/10 pt-6 sm:flex-row sm:flex-wrap">
              <a href={unidade.mapsUrl} target="_blank" rel="noopener" className="btn btn-primario">
                Como chegar
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="btn btn-secundario">
                <IconeWhatsapp size={18} />
                {unidade.telefoneExibicao}
              </a>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="btn btn-secundario">
                <IconeInstagram size={18} />
                Instagram
              </a>
            </div>
          </div>
          <div className="reveal" style={atraso(120)}>
            <Mapa />
          </div>
        </div>
      </div>
    </section>
  )
}

export function CtaFinal() {
  const { unidade } = useUnidade()
  return (
    <section aria-labelledby="titulo-cta" className="on-dark relative isolate overflow-hidden bg-teal-900 pb-24 pt-28 text-white sm:pb-32 sm:pt-36">
      {/* as ondas chegam ao fim da jornada */}
      <Ondas
        altura={160}
        className="absolute inset-x-0 top-0 -z-10 h-28 rotate-180 sm:h-36"
        camadas={[
          { cor: '#78c4ca', base: 70, amp: 16, comp: 1440, dur: 50, opacidade: 0.18 },
          { cor: '#2a8792', base: 96, amp: 12, comp: 720, fase: 160, dur: 38, reverso: true, opacidade: 0.4 },
          { cor: '#f4efe7', base: 120, amp: 10, comp: 1440, fase: 420, dur: 44 },
        ]}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{ background: 'radial-gradient(60% 70% at 50% 110%, rgb(42 135 146 / 0.55), transparent 70%)' }}
      />
      <div className="container-site text-center">
        <Cabecalho
          id="titulo-cta"
          centro
          escuro
          titulo="Seu próximo passo começa com uma *avaliação*."
          intro={<p>Converse com a equipe da {unidade.rotulo} e combine um horário que funcione para você e sua família.</p>}
        />
        <div className="reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row" style={atraso(240)}>
          <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="btn btn-claro">
            <IconeWhatsapp size={20} />
            Agendar pelo WhatsApp
          </a>
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="btn btn-contorno-claro">
            <IconeInstagram size={20} />
            Ver no Instagram
          </a>
        </div>
        {CONFIG.secoes.agendar && (
          <p className="reveal mt-6 text-aqua-100/90" style={atraso(300)}>
            Prefere preencher?{' '}
            <a href="#agendar" className="font-semibold text-white underline decoration-aqua-400 decoration-2 underline-offset-4 hover:decoration-white">
              Solicite seu horário pelo formulário
            </a>
          </p>
        )}
      </div>
    </section>
  )
}

export function Rodape() {
  const { unidade } = useUnidade()
  const ano = new Date().getFullYear()
  return (
    <footer className="on-dark bg-teal-950 pb-28 pt-16 text-aqua-100 md:pb-12">
      <div className="container-site grid gap-10 md:grid-cols-[auto_1fr_1fr] md:gap-16">
        <div>
          <Logo tamanho={96} />
        </div>
        <div className="space-y-2 text-[0.95rem]">
          <p className="rotulo text-aqua-300">{unidade.rotulo}</p>
          <address className="not-italic">
            {unidade.endereco.logradouro}
            <br />
            {unidade.endereco.bairro}, {unidade.endereco.cidade} - {unidade.endereco.uf}, {unidade.endereco.cep}
          </address>
          {CONFIG.responsavelTecnico && CONFIG.cro && (
            <p className="pt-2">
              Responsável técnico: {CONFIG.responsavelTecnico}, {CONFIG.cro}
            </p>
          )}
        </div>
        <ul className="space-y-1 text-[0.95rem]">
          <li>
            <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 hover:text-white">
              <IconeWhatsapp size={18} /> WhatsApp {unidade.telefoneExibicao}
            </a>
          </li>
          <li>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 hover:text-white">
              <IconeInstagram size={18} /> {CONFIG.instagram.usuario}
            </a>
          </li>
          <li>
            <a href={unidade.mapsUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 hover:text-white">
              <MapPin aria-hidden="true" size={18} /> Ver no Google Maps
            </a>
          </li>
        </ul>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-aqua-100/80 md:flex-row md:items-center md:justify-between">
        <p>Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
        <p className="flex gap-4">
          <a href="/privacidade.html" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">
            Privacidade
          </a>
          <span className="inline-flex min-h-11 items-center">
            © {ano} {CONFIG.nome}
          </span>
        </p>
      </div>
    </footer>
  )
}
