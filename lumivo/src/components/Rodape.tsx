import { config } from '../config'
import { MarcaLumivo } from './Logo'
import { rolarPara } from '../motion/useLenis'
import { Reveal } from '../motion/Reveal'

export function Rodape() {
  const { contato, marca } = config
  const insta = contato.instagram.replace('@', '')
  return (
    <footer className="rodape">
      <div className="container">
        <Reveal className="rodape__marca">
          <MarcaLumivo className="rodape__simbolo" />
          <div>
            <p className="rodape__nome">Lumivo</p>
            <p className="rotulo">Web</p>
          </div>
        </Reveal>
        <p className="rodape__tagline">{marca.tagline}</p>
        <Reveal className="rodape__grade" atraso={0.06}>
          <div>
            <h2 className="rotulo">Contato</h2>
            <ul>
              <li><a href={`https://wa.me/${contato.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {contato.whatsappExibicao}</a></li>
              <li><a href={`https://instagram.com/${insta}`} target="_blank" rel="noopener noreferrer">Instagram {contato.instagram}</a></li>
              <li><a href={`mailto:${contato.email}`}>{contato.email}</a></li>
            </ul>
          </div>
          <div>
            <h2 className="rotulo">Onde</h2>
            <ul>
              <li>{contato.cidade} e região</li>
              <li>Atendimento por mensagem</li>
            </ul>
          </div>
        </Reveal>
        <div className="rodape__base">
          <p>
            {marca.nome} · CNPJ {contato.cnpj}
          </p>
          <p>
            <a href="/privacidade/">Política de privacidade</a>
          </p>
          <button className="link-secundario" onClick={() => rolarPara(0)}>
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  )
}
