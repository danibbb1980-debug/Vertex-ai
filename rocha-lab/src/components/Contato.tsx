import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { enderecoLinha1, enderecoLinha2, externo, whatsappLink } from '../lib/links'
import {
  Botao,
  CabecalhoSecao,
  IconInstagram,
  IconPin,
  IconRelogio,
  IconSetaDiagonal,
  IconWhatsApp,
  Logo,
} from './ui'

export function Localizacao() {
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="border-t border-linha bg-marfim py-24 sm:py-28 lg:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <CabecalhoSecao
            id="titulo-contato"
            numero="07"
            rotulo="Localização e contato"
            titulo={
              <>
                Venha conhecer <em className="font-normal text-petroleo-700">o laboratório</em>.
              </>
            }
          />

          <div className="mt-10">
            <div className="space-y-8">
              <div className="flex gap-4">
                <IconPin size={20} className="mt-0.5 shrink-0 text-petroleo-600" />
                <address className="text-[1rem] leading-relaxed text-tinta not-italic">
                  {CONFIG.endereco.rua}
                  <br />
                  {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf} · CEP {CONFIG.endereco.cep}
                </address>
              </div>

              <div className="flex gap-4">
                <IconRelogio size={20} className="mt-0.5 shrink-0 text-petroleo-600" />
                <div className="w-full">
                  {/* CONFIRMAR COM O LABORATÓRIO: horários da ficha do Google */}
                  <table className="w-full max-w-sm text-[0.9375rem]">
                    <caption className="rotulo mb-2 text-left text-petroleo-600">Horário de atendimento</caption>
                    <tbody>
                      {CONFIG.horarios.map((h) => (
                        <tr key={h.dias} className="border-b border-linha last:border-0">
                          <th scope="row" className="py-2 pr-4 text-left align-top font-medium text-tinta">
                            {h.dias}
                          </th>
                          <td className="py-2 text-right text-cinza tabular-nums">
                            {h.faixas.length ? (
                              h.faixas.map((f, i) => (
                                <span key={f} className="block">
                                  {f}
                                  {i === 0 && h.faixas.length > 1 && <span className="sr-only">, intervalo de almoço, depois</span>}
                                </span>
                              ))
                            ) : (
                              'Fechado'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-[0.8125rem] text-cinza">Intervalo de almoço das 12h00 às 13h30.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Botao href={CONFIG.googleMaps} externoLink icone={<IconPin size={18} />}>
              Como chegar
            </Botao>
            <Botao
              href={whatsappLink(CONFIG.mensagens.visita)}
              externoLink
              variante="secundario"
              icone={<IconWhatsApp size={18} />}
            >
              {CONFIG.telefoneExibicao}
            </Botao>
          </div>
          <a
            href={CONFIG.instagram}
            {...externo}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-petroleo-700 hover:underline"
          >
            <IconInstagram size={18} />
            {CONFIG.instagramUsuario}
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="registro aspect-square overflow-hidden border border-linha bg-papel sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <iframe
              title={`Mapa: ${CONFIG.nomeMaps}, ${enderecoLinha1}, ${enderecoLinha2}`}
              src={CONFIG.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[35%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro relative overflow-hidden bg-petroleo-900 py-24 text-perola sm:py-32">
      <svg
        className="pointer-events-none absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 text-perola/[0.06]"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="49.5" fill="none" stroke="currentColor" strokeWidth=".15" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth=".12" />
      </svg>
      <div className="container-site relative text-center">
        <p className="rotulo text-pessego">Para cirurgiões-dentistas e clínicas</p>
        <h2 id="titulo-cta" className="mx-auto mt-6 max-w-4xl text-[2.5rem] leading-[1.05] font-light sm:text-[3.5rem] lg:text-[4.5rem]">
          Seu próximo caso começa com <em className="font-normal text-pessego">uma conversa</em>.
        </h2>
        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Botao href={whatsappLink()} externoLink variante="claro" icone={<IconWhatsApp size={18} />}>
            Falar pelo WhatsApp
          </Botao>
          <Botao href={CONFIG.instagram} externoLink variante="contorno-claro" icone={<IconInstagram size={18} />}>
            Ver no Instagram
          </Botao>
        </div>
      </div>
    </section>
  )
}

export function Rodape() {
  const ano = new Date().getFullYear()
  return (
    <footer className="escuro bg-petroleo-950 pt-16 pb-28 text-petroleo-200 sm:pb-12">
      <div className="container-site">
        <div className="grid gap-12 border-b border-perola/10 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo claro />
            <p className="mt-6 max-w-xs text-[0.875rem] leading-relaxed">
              Laboratório de prótese dentária para cirurgiões-dentistas e clínicas em {CONFIG.cidade} - {CONFIG.uf}.
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="rotulo text-pessego/80">Endereço</p>
            <address className="mt-4 text-[0.875rem] leading-relaxed not-italic">
              {CONFIG.endereco.rua}
              <br />
              {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
            </address>
          </div>
          <div className="lg:col-span-2">
            <p className="rotulo text-pessego/80">Contato</p>
            <ul className="mt-3 text-[0.875rem]">
              <li>
                <a href={whatsappLink()} {...externo} className="inline-flex min-h-11 items-center gap-2 hover:text-perola">
                  <IconWhatsApp size={16} /> {CONFIG.telefoneExibicao}
                  <span className="sr-only">(WhatsApp, abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram} {...externo} className="inline-flex min-h-11 items-center gap-2 hover:text-perola">
                  <IconInstagram size={16} /> Instagram
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={CONFIG.googleMaps} {...externo} className="inline-flex min-h-11 items-center gap-2 hover:text-perola">
                  <IconSetaDiagonal size={16} /> Google Maps
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Rodapé" className="lg:col-span-3">
            <p className="rotulo text-pessego/80">Navegação</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 text-[0.875rem]">
              {[
                ['#trabalhos', 'Trabalhos'],
                ['#como-enviar', 'Como enviar'],
                ['#sobre', 'Sobre'],
                ['#duvidas', 'Dúvidas'],
                ['#contato', 'Contato'],
                ['/privacidade.html', 'Privacidade'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-11 min-w-11 items-center hover:text-perola">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-[0.75rem] leading-relaxed md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">
            {/* CONFIRMAR COM O LABORATÓRIO: registros no CRO-SP */}
            {CONFIG.croLaboratorio && CONFIG.croResponsavel ? (
              <>
                CRO-SP do laboratório: {CONFIG.croLaboratorio} · Responsável técnico: {CONFIG.responsavel}, CRO-SP{' '}
                {CONFIG.croResponsavel}
              </>
            ) : (
              <span className="inline-block rounded-[3px] border border-dashed border-pessego/50 px-2 py-1 text-pessego-claro">
                Registro no CRO do laboratório e do responsável técnico: a confirmar com o laboratório
              </span>
            )}
          </p>
          <p className="shrink-0">
            © {ano} {CONFIG.nome}
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Botão flutuante (desktop) e barra fixa (celular) do WhatsApp. */
export function WhatsAppFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a
        href={whatsappLink()}
        {...externo}
        aria-label="Falar com o laboratório pelo WhatsApp (abre em nova aba)"
        tabIndex={visivel ? 0 : -1}
        className={`fixed right-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-petroleo-700 text-perola ring-1 ring-perola/25 shadow-[0_18px_40px_-16px_rgb(15_51_53/0.7)] transition-[opacity,transform,background-color] duration-300 hover:bg-petroleo-800 sm:flex ${
          visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconWhatsApp size={24} />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-perola/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <a
          href={whatsappLink()}
          {...externo}
          className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-petroleo-700 text-[0.9375rem] font-semibold text-perola transition-[scale] duration-200 active:scale-[0.98]"
        >
          <IconWhatsApp size={18} />
          Falar com o laboratório
          <span className="sr-only">(WhatsApp, abre em nova aba)</span>
        </a>
      </div>
    </>
  )
}
