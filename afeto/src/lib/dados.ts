import { CONFIG, type Horario, type Profissional } from '../config'

export const temTexto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

export function linkWhatsApp(mensagem: string = CONFIG.mensagens.geral) {
  if (!temTexto(CONFIG.whatsapp)) return ''
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const linkWhatsAppAtendimento = (atendimento: string) =>
  linkWhatsApp(CONFIG.mensagens.porAtendimento(atendimento))

export const enderecoLinha1 = () => `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}`
export const enderecoLinha2 = () =>
  `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`

const NOMES_DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const NOMES_DIAS_CURTOS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.']

/** "09:00" -> "9h", "17:30" -> "17h30" */
export const horaCurta = (h: string) => {
  const [hh, mm] = h.split(':')
  return `${Number(hh)}h${mm === '00' ? '' : mm}`
}

export const horarioDoDia = (dia: number): Horario | undefined =>
  CONFIG.horarios.find((h) => h.dia === dia)

/** Agrupa dias seguidos com o mesmo horário: [{ dias: 'Segunda a sexta', texto: '9h às 17h' }, ...] */
export function resumoHorarios() {
  const linhas: { dias: string; texto: string }[] = []
  const ordem = [1, 2, 3, 4, 5, 6, 0]
  const desc = (h?: Horario) =>
    h
      ? `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}` +
        (h.intervalo ? ` (pausa das ${horaCurta(h.intervalo.inicio)} às ${horaCurta(h.intervalo.fim)})` : '')
      : 'Fechado'
  let i = 0
  while (i < ordem.length) {
    const t = desc(horarioDoDia(ordem[i]))
    let j = i
    while (j + 1 < ordem.length && desc(horarioDoDia(ordem[j + 1])) === t) j++
    const a = NOMES_DIAS[ordem[i]]
    const b = NOMES_DIAS[ordem[j]]
    const dias = i === j ? a : j === i + 1 ? `${a} e ${b}` : `${a} a ${b}`
    linhas.push({ dias: dias.charAt(0).toUpperCase() + dias.slice(1), texto: t })
    i = j + 1
  }
  return linhas
}

/** "seg. a sex. · 9h às 17h" para rótulos curtos. */
export function horarioCurto() {
  const abertos = [1, 2, 3, 4, 5, 6, 0].filter((d) => horarioDoDia(d))
  if (!abertos.length) return ''
  const h = horarioDoDia(abertos[0])!
  const mesmo = abertos.every((d) => {
    const x = horarioDoDia(d)!
    return x.abre === h.abre && x.fecha === h.fecha
  })
  const dias =
    abertos.length > 1
      ? `${NOMES_DIAS_CURTOS[abertos[0]]} a ${NOMES_DIAS_CURTOS[abertos[abertos.length - 1]]}`
      : NOMES_DIAS_CURTOS[abertos[0]]
  return mesmo ? `${dias} · ${horaCurta(h.abre)} às ${horaCurta(h.fecha)}` : dias
}

const minutos = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Blocos de horário que terminam até o fechamento, sem cruzar a pausa. */
export function blocosDoDia(dia: number, bloco = CONFIG.agendamento.blocoMinutos): string[] {
  const h = horarioDoDia(dia)
  if (!h) return []
  const fim = minutos(h.fecha)
  const pausa = h.intervalo ? [minutos(h.intervalo.inicio), minutos(h.intervalo.fim)] : null
  const out: string[] = []
  for (let m = minutos(h.abre); m + bloco <= fim; m += bloco) {
    if (pausa && m < pausa[1] && m + bloco > pausa[0]) continue
    out.push(hhmm(m))
  }
  return out
}

/** Todos os blocos possíveis em qualquer dia aberto (antes de a pessoa escolher a data). */
export function blocosGerais() {
  const set = new Set<string>()
  CONFIG.horarios.forEach((h) => blocosDoDia(h.dia).forEach((b) => set.add(b)))
  return [...set].sort()
}

export function profissionaisPublicaveis(): Profissional[] {
  if (!CONFIG.mostrarEquipe) return []
  return CONFIG.equipe.filter((p) => {
    if (!p.autorizado || !temTexto(p.nome) || !temTexto(p.profissao)) return false
    const semConselho = CONFIG.profissoesSemConselho.some(
      (s) => s.toLowerCase() === p.profissao.trim().toLowerCase(),
    )
    return semConselho || temTexto(p.registro)
  })
}

const EXTENSO = ['', 'Uma', 'Duas', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez', 'Onze', 'Doze']
export const porExtenso = (n: number) => EXTENSO[n] ?? String(n)

export function listaNatural(itens: string[]) {
  if (itens.length <= 1) return itens.join('')
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

export function duvidas() {
  const q: { pergunta: string; resposta: string }[] = []
  const zap = temTexto(CONFIG.whatsappExibicao) ? ` ${CONFIG.whatsappExibicao}` : ''
  q.push({
    pergunta: 'Preciso agendar antes de ir?',
    resposta: `Sim. Os atendimentos acontecem com hora marcada, e o agendamento é feito pelo WhatsApp${zap}.`,
  })
  q.push({
    pergunta: 'Como é a primeira avaliação?',
    resposta:
      'É um encontro individual com o profissional da área escolhida, para conhecer a sua necessidade e explicar os próximos passos. O formato pode variar de uma área para outra.',
  })
  if (CONFIG.especialidades.length) {
    q.push({
      pergunta: 'Quais áreas são atendidas?',
      resposta: `${listaNatural(CONFIG.especialidades.map((e) => e.nome))}.`,
    })
  }
  q.push({
    pergunta: 'Não sei qual área é a certa para mim. O que faço?',
    resposta:
      'Conte, em poucas palavras, o que você busca pelo WhatsApp. A equipe orienta sobre o primeiro passo. A indicação de cada atendimento depende de avaliação individual.',
  })
  q.push({
    pergunta: 'Posso marcar para outra pessoa da família?',
    resposta: 'Sim. Basta dizer na conversa para quem é o atendimento.',
  })
  const hs = resumoHorarios()
  if (CONFIG.horarios.length) {
    q.push({
      pergunta: 'Quais são os horários?',
      resposta: `${hs.map((h) => `${h.dias}: ${h.texto.toLowerCase()}`).join('. ')}. ${CONFIG.avisoHorarios}`,
    })
  }
  q.push({
    pergunta: 'Onde fica o espaço?',
    resposta: `${enderecoLinha1()}, ${enderecoLinha2()}.`,
  })
  q.push({
    pergunta: 'O que levar no primeiro atendimento?',
    resposta:
      'Um documento de identificação e, se houver, exames, relatórios ou encaminhamentos relacionados ao motivo do atendimento.',
  })
  q.push({
    pergunta: 'O formulário do site já marca o horário?',
    resposta:
      'Não. Ele apenas monta uma mensagem e abre o WhatsApp. A equipe confirma a disponibilidade na conversa.',
  })
  return q
}
