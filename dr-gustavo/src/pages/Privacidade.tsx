import { CONFIG } from '../config'
import { mailLink } from '../lib/links'
import { Simples } from './Simples'

export function Privacidade() {
  return (
    <Simples>
      <p className="eyebrow">Privacidade</p>
      <h1 className="mt-5 text-[clamp(2.4rem,1.8rem+2.6vw,3.6rem)]">
        Como este site trata as suas <em className="font-[330] text-accent">informações</em>.
      </h1>
      <div className="mt-10 space-y-6 text-[1.05rem] leading-relaxed text-ink-2 [&_h2]:mt-10 [&_h2]:text-[1.6rem]">
        <p>
          Este site é informativo. Ele não usa formulários, cookies de rastreamento, ferramentas de análise de audiência
          nem pixels de publicidade.
        </p>
        <h2>Contato pelo WhatsApp e telefone</h2>
        <p>
          Ao tocar em um botão de WhatsApp, você é levado ao aplicativo com uma mensagem pronta. Nada é enviado
          automaticamente: você decide se quer mandar a mensagem. A conversa passa a seguir as regras de privacidade do
          próprio WhatsApp. As informações que você compartilhar com o consultório são usadas apenas para o seu
          atendimento.
        </p>
        <h2>Mapa</h2>
        <p>
          O mapa do Google só é carregado se você tocar em “Carregar mapa do Google”. A partir daí, o Google pode aplicar
          as próprias políticas de privacidade e cookies.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir acesso, correção ou exclusão dos
          seus dados pessoais tratados pelo consultório. Para isso, escreva para{' '}
          <a href={mailLink} className="text-accent underline underline-offset-4">
            {CONFIG.email}
          </a>
          .
        </p>
      </div>
    </Simples>
  )
}
