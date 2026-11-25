import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { config } from '../../config'
import { MarcaLumivo } from '../Logo'
import { Seta } from '../Seta'
import { useFocoPreso } from '../useFocoPreso'
import { travarRolagem } from '../../motion/useLenis'
import { useReducedMotion } from '../../motion/useReducedMotion'
import { dur, ease, stagger } from '../../motion/tokens'
import { enviarLead, formatarWhatsapp, linkWhatsapp, respostasVazias, whatsappValido, type Respostas } from './mensagem'

const TOTAL = 5
const RESUMO = 5
const SUCESSO = 6

type Erros = Partial<Record<keyof Respostas, string>>

const sacode = { x: [0, -6, 6, -6, 6, -3, 0], transition: { duration: 0.3 } }
const TREMOR = { t0: sacode, t1: sacode, parado: { x: 0 } }

function Campo({ id, rotulo, erro, tremer, children }: { id: string; rotulo: string; erro?: string; tremer: number; children: ReactNode }) {
  return (
    <m.div
      className={`campo ${erro ? 'campo--erro' : ''}`}
      // alterna entre duas variantes iguais para repetir o tremor sem remontar o campo
      variants={TREMOR}
      animate={erro ? `t${tremer % 2}` : 'parado'}
    >
      <label className="rotulo" htmlFor={id}>{rotulo}</label>
      {children}
      {erro && <p className="campo__erro" id={`${id}-erro`} role="alert">{erro}</p>}
    </m.div>
  )
}

function Opcoes({ nome, opcoes, valor, onEscolher }: { nome: string; opcoes: string[]; valor: string; onEscolher: (v: string) => void }) {
  const [escolhida, setEscolhida] = useState<string | null>(null)
  return (
    <div className="opcoes" role="radiogroup" aria-label={nome}>
      {opcoes.map((o, i) => {
        const marcada = (escolhida ?? valor) === o
        return (
          <m.button
            type="button"
            key={o}
            role="radio"
            aria-checked={marcada}
            className={`opcao ${marcada ? 'opcao--marcada' : ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, scale: escolhida === o ? 1.01 : 1 }}
            transition={{ delay: escolhida ? 0 : i * stagger.opcoes, duration: escolhida === o ? 0.3 : dur.curta }}
            onAnimationComplete={() => {
              if (escolhida === o) onEscolher(o)
            }}
            onClick={() => setEscolhida(o)}
          >
            <span className="opcao__marca" aria-hidden="true" />
            {o}
          </m.button>
        )
      })}
    </div>
  )
}

export default function Quiz({ onFechar }: { onFechar: () => void }) {
  const [passo, setPasso] = useState(0)
  const [direcao, setDirecao] = useState(1)
  const [r, setR] = useState<Respostas>(respostasVazias)
  const [erros, setErros] = useState<Erros>({})
  const [tremer, setTremer] = useState(0)
  const reduzido = useReducedMotion()
  const [flash, setFlash] = useState(true)
  const painelRef = useRef<HTMLDivElement>(null)
  const corpoRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  useEffect(() => {
    travarRolagem(true)
    return () => travarRolagem(false)
  }, [])

  useFocoPreso(painelRef, true, onFechar)

  // Foco no primeiro campo de cada etapa.
  useEffect(() => {
    if (flash && !reduzido) return
    const el = corpoRef.current?.querySelector<HTMLElement>('input, .opcao, .resumo__enviar, .sucesso a')
    el?.focus({ preventScroll: true })
  }, [passo, flash, reduzido])

  const set = (k: keyof Respostas, v: string) => {
    setR((a) => ({ ...a, [k]: v }))
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }))
  }

  const ir = useCallback((novo: number) => {
    setDirecao(novo > passo ? 1 : -1)
    setPasso(novo)
  }, [passo])

  const validar = (): Erros => {
    const e: Erros = {}
    if (passo === 0 && !r.nome.trim()) e.nome = 'Escreva como você quer ser chamado.'
    if (passo === 1) {
      if (!r.negocio.trim()) e.negocio = 'Escreva o nome do seu negócio.'
      if (!r.cidade.trim()) e.cidade = 'Escreva a cidade.'
    }
    if (passo === 2 && !whatsappValido(r.whatsapp)) e.whatsapp = 'Use DDD + número, por exemplo (35) 99999-9999.'
    return e
  }

  const avancar = (ev?: FormEvent) => {
    ev?.preventDefault()
    const e = validar()
    if (Object.keys(e).length) {
      setErros(e)
      setTremer((t) => t + 1)
      const primeiro = Object.keys(e)[0]
      document.getElementById(`${uid}-${primeiro}`)?.focus()
      return
    }
    ir(passo + 1)
  }

  const focoVisivel = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.scrollIntoView({ block: 'center', behavior: reduzido ? 'auto' : 'smooth' })
  }

  const input = (k: keyof Respostas, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      id={`${uid}-${k}`}
      className="campo__input"
      value={r[k]}
      onChange={(e) => set(k, k === 'whatsapp' ? formatarWhatsapp(e.target.value) : e.target.value)}
      onFocus={focoVisivel}
      aria-invalid={!!erros[k]}
      aria-describedby={erros[k] ? `${uid}-${k}-erro` : undefined}
      {...props}
    />
  )

  const titulos = [
    'Como posso te chamar?',
    'Qual o nome do seu negócio e a cidade?',
    'Seu WhatsApp e Instagram',
    'Qual a sua área?',
    'Você já tem site?',
  ]

  const resumo: [string, string][] = [
    ['Nome', r.nome],
    ['Negócio', r.negocio],
    ['Cidade', r.cidade],
    ['WhatsApp', r.whatsapp],
    ['Instagram', r.instagram],
    ['Área', r.area],
    ['Site atual', r.temSite],
  ].filter(([, v]) => v.trim()) as [string, string][]

  const variantes = {
    entra: (d: number) => ({ opacity: 0, x: reduzido ? 0 : 24 * d }),
    centro: { opacity: 1, x: 0, transition: { duration: reduzido ? 0.15 : 0.35, ease: ease.outExpo } },
    sai: (d: number) => ({ opacity: 0, x: reduzido ? 0 : -24 * d, transition: { duration: reduzido ? 0.15 : 0.2 } }),
  }

  let conteudo: ReactNode
  if (passo < TOTAL) {
    conteudo = (
      <form onSubmit={avancar} noValidate className="quiz__form">
        <fieldset>
          <legend className="quiz__pergunta">{titulos[passo]}</legend>
          {passo === 0 && (
            <Campo id={`${uid}-nome`} rotulo="Seu nome" erro={erros.nome} tremer={tremer}>
              {input('nome', { autoComplete: 'given-name', enterKeyHint: 'next' })}
            </Campo>
          )}
          {passo === 1 && (
            <>
              <Campo id={`${uid}-negocio`} rotulo="Nome do negócio" erro={erros.negocio} tremer={tremer}>
                {input('negocio', { autoComplete: 'organization' })}
              </Campo>
              <Campo id={`${uid}-cidade`} rotulo="Cidade" erro={erros.cidade} tremer={tremer}>
                {input('cidade', { autoComplete: 'address-level2', enterKeyHint: 'next' })}
              </Campo>
            </>
          )}
          {passo === 2 && (
            <>
              <Campo id={`${uid}-whatsapp`} rotulo="WhatsApp com DDD" erro={erros.whatsapp} tremer={tremer}>
                {input('whatsapp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel-national', placeholder: '(35) 99999-9999' })}
              </Campo>
              <Campo id={`${uid}-instagram`} rotulo="Instagram (opcional)" tremer={tremer}>
                {input('instagram', { autoCapitalize: 'none', autoCorrect: 'off', placeholder: '@seunegocio', enterKeyHint: 'next' })}
              </Campo>
            </>
          )}
          {passo === 3 && (
            <Opcoes nome={titulos[3]} opcoes={config.quiz.areas} valor={r.area} onEscolher={(v) => { set('area', v); ir(4) }} />
          )}
          {passo === 4 && (
            <Opcoes nome={titulos[4]} opcoes={config.quiz.temSite} valor={r.temSite} onEscolher={(v) => { set('temSite', v); ir(RESUMO) }} />
          )}
        </fieldset>
        <div className="quiz__acoes">
          {passo > 0 && (
            <button type="button" className="botao botao--contorno" onClick={() => ir(passo - 1)}>
              Voltar
            </button>
          )}
          {passo < 3 && (
            <button type="submit" className="botao botao--primario quiz__continuar">
              Continuar
              <Seta className="botao__seta" />
            </button>
          )}
          {passo >= 3 && (passo === 3 ? r.area : r.temSite) && (
            <button type="button" className="botao botao--primario quiz__continuar" onClick={() => ir(passo === 3 ? 4 : RESUMO)}>
              Continuar
              <Seta className="botao__seta" />
            </button>
          )}
        </div>
      </form>
    )
  } else if (passo === RESUMO) {
    conteudo = (
      <div className="resumo">
        <h2 className="quiz__pergunta">Confira e envie</h2>
        <dl className="resumo__tabela">
          {resumo.map(([k, v], i) => (
            <m.div key={k} className="resumo__linha" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </m.div>
          ))}
        </dl>
        <button
          type="button"
          className="botao botao--primario botao--largo resumo__enviar"
          onClick={() => {
            enviarLead(r)
            ir(SUCESSO)
          }}
        >
          Enviar pelo WhatsApp
          <Seta className="botao__seta" />
        </button>
        <p className="quiz__nota">Suas respostas vão só para o WhatsApp da Lumivo. Nada fica salvo neste site.</p>
        <div className="quiz__acoes">
          <button type="button" className="botao botao--contorno" onClick={() => ir(RESUMO - 1)}>
            Voltar
          </button>
          <button type="button" className="link-secundario" onClick={() => ir(0)}>
            Refazer
          </button>
        </div>
      </div>
    )
  } else {
    conteudo = (
      <div className="sucesso">
        <div className="tracejado" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <m.i key={i} initial={{ opacity: 0.15 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} />
          ))}
        </div>
        <m.h2 className="quiz__pergunta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: dur.media, ease: ease.outExpo }}>
          Obrigado, {r.nome.trim().split(' ')[0]}!
        </m.h2>
        <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: dur.media, ease: ease.outExpo }}>
          <p className="quiz__texto">
            Já recebi suas respostas. Vou te chamar no WhatsApp para pedir logo, Instagram e Google Maps e montar seu rascunho.
          </p>
          <p className="quiz__nota">Se o WhatsApp não abriu, toque no botão abaixo e envie a mensagem que já vem escrita.</p>
          <a className="botao botao--primario botao--largo" href={linkWhatsapp(r)} target="_blank" rel="noopener noreferrer">
            Abrir no WhatsApp
            <Seta className="botao__seta" />
          </a>
          <button type="button" className="link-secundario sucesso__fechar" onClick={onFechar}>
            Voltar ao site
          </button>
        </m.div>
      </div>
    )
  }

  const etapaAnunciada = passo < TOTAL ? `Pergunta ${passo + 1} de ${TOTAL}` : passo === RESUMO ? 'Resumo' : 'Enviado'

  return (
    <div className="quiz" role="dialog" aria-modal="true" aria-labelledby={`${uid}-titulo`} ref={painelRef}>
      <m.div
        className="quiz__painel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduzido ? 0 : 0.45, duration: dur.curta }}
      >
        <div className="quiz__topo">
          <p id={`${uid}-titulo`} className="rotulo" aria-live="polite">{etapaAnunciada}</p>
          <button type="button" className="quiz__fechar" onClick={onFechar} aria-label="Fechar formulário">
            <span />
            <span />
          </button>
        </div>
        <div className="quiz__progresso" aria-hidden="true">
          {Array.from({ length: TOTAL + 1 }, (_, i) => (
            <span key={i} className="quiz__seg">
              <m.span
                className="quiz__seg-fill"
                initial={false}
                animate={{ scaleX: passo > i || passo === SUCESSO ? 1 : passo === i ? 0.35 : 0 }}
                transition={{ duration: 0.4, ease: ease.outExpo }}
              />
            </span>
          ))}
        </div>
        <div className="quiz__corpo" ref={corpoRef}>
          <AnimatePresence mode="wait" custom={direcao} initial={false}>
            <m.div key={passo} custom={direcao} variants={variantes} initial="entra" animate="centro" exit="sai">
              {conteudo}
            </m.div>
          </AnimatePresence>
        </div>
      </m.div>
      {flash && !reduzido && (
        <m.div
          className="quiz__flash"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.75, times: [0, 0.2, 0.6, 1], ease: 'linear' }}
          onAnimationComplete={() => setFlash(false)}
        >
          <MarcaLumivo className="quiz__flash-marca" />
        </m.div>
      )}
    </div>
  )
}
