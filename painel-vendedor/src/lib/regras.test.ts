import { describe, expect, it } from 'vitest'
import {
  calcularComissao, calcularFunil, checklistPacote, comissaoPorMes, contarTentativas,
  listaHoje, mapaTentativas, motivosDePerda, pacoteCompleto, pendenciasPacote,
  proximoRetorno, statusTentativas, textoPacote,
} from './regras'
import { fmtMoeda, lerMoeda, telefoneE164 } from './formato'
import { fmtData, hojeSP, localSPparaISO, proximoDiaUtil } from './datas'
import type { Lead, Ligacao, Reuniao, Venda } from './types'

// Todos os dados abaixo são FALSOS e existem só neste arquivo de teste.
const leadBase: Lead = {
  id: 'L1', vendedor_id: 'V1', nome: 'TESTE Clínica Fictícia', segmento: 'odontologia',
  segmento_outro: null, cidade: 'Cidade Teste', uf: 'MG', telefone: '(00) 0000-0000',
  whatsapp: 'sim', instagram: '@teste', maps_link: 'https://maps.example/x',
  registro_tipo: 'CRO', registro_numero: '00000', areas: 'Implante', estilo: null,
  nao_ligar: false, ja_tem_site: false, retornar_em: '2026-11-20', observacoes: null,
  arquivado_em: null, deleted_at: null, created_at: '2026-11-01T12:00:00Z', updated_at: '2026-11-01T12:00:00Z',
}
const lead = (p: Partial<Lead>): Lead => ({ ...leadBase, ...p })
const lig = (p: Partial<Ligacao>): Ligacao => ({
  id: Math.random().toString(), lead_id: 'L1', vendedor_id: 'V1', data_hora: '2026-11-20T13:00:00Z',
  resultado: 'nao_atendeu', observacao: null, deleted_at: null, created_at: '2026-11-20T13:00:00Z', ...p,
})
const reu = (p: Partial<Reuniao>): Reuniao => ({
  id: 'R1', lead_id: 'L1', vendedor_id: 'V1', data_hora: '2026-11-27T17:00:00Z', formato: 'video',
  rascunho_status: 'aguardando_pacote', rascunho_link: null, resultado: null, motivo_perda: null,
  deleted_at: null, created_at: '2026-11-20T13:00:00Z', updated_at: '2026-11-20T13:00:00Z', ...p,
})
const ven = (p: Partial<Venda>): Venda => ({
  id: 'S1', lead_id: 'L1', vendedor_id: 'V1', valor_combinado: 797, valor_fechado: null,
  forma_pagamento: 'pix', parcelas: 1, status: 'aguardando_aprovacao', data_pagamento: null,
  observacao: null, deleted_at: null, created_at: '2026-11-20T13:00:00Z', updated_at: '2026-11-20T13:00:00Z', ...p,
})

describe('contador de tentativas', () => {
  it('conta só as ligações do lead, ignorando as excluídas', () => {
    const ls = [lig({}), lig({}), lig({ lead_id: 'L2' }), lig({ deleted_at: '2026-11-20T00:00:00Z' })]
    expect(contarTentativas(ls, 'L1')).toBe(2)
    expect(mapaTentativas(ls).get('L2')).toBe(1)
  })
  it('não avisa na primeira nem na segunda tentativa', () => {
    expect(statusTentativas(0).aviso).toBeNull()
    expect(statusTentativas(1).aviso).toBeNull()
    expect(statusTentativas(1).proxima).toBe(2)
  })
  it('avisa na terceira tentativa citando a regra das duas tentativas', () => {
    const s = statusTentativas(2)
    expect(s.proxima).toBe(3)
    expect(s.aviso).toMatch(/3ª tentativa/)
    expect(s.aviso).toMatch(/duas tentativas/)
  })
  it('sugere retorno no próximo dia útil até a segunda tentativa e depois tira da lista', () => {
    // 20/11/2026 é sexta-feira → próximo dia útil 23/11
    expect(proximoRetorno('nao_atendeu', '2026-11-20', 1)).toBe('2026-11-23')
    expect(proximoRetorno('nao_atendeu', '2026-11-20', 2)).toBeNull()
    expect(proximoRetorno('retornar_depois', '2026-11-20', 1, '2026-12-01')).toBe('2026-12-01')
    expect(proximoRetorno('retornar_depois', '2026-11-20', 1)).toBe('2026-11-24')
    expect(proximoRetorno('reuniao_marcada', '2026-11-20', 1)).toBeNull()
    expect(proximoRetorno('nao_ligar_mais', '2026-11-20', 1)).toBeNull()
  })
})

describe('pacote completo', () => {
  it('fica completo com todos os campos e a data da reunião', () => {
    expect(pacoteCompleto(leadBase, reu({}))).toBe(true)
  })
  it('lista o que falta em destaque', () => {
    const faltando = checklistPacote(lead({ instagram: ' ', maps_link: null }), reu({ data_hora: null }))
      .filter((i) => !i.ok).map((i) => i.rotulo)
    expect(faltando).toEqual(['Google Maps', 'Instagram', 'Data e hora da reunião'])
  })
  it('exige CRO para odontologia e OAB para advocacia, mas não para estética', () => {
    expect(pacoteCompleto(lead({ registro_numero: null }), reu({}))).toBe(false)
    const adv = checklistPacote(lead({ segmento: 'advocacia', registro_numero: null }), reu({}))
    expect(adv.find((i) => i.campo === 'registro_numero')?.rotulo).toBe('OAB')
    expect(pacoteCompleto(lead({ segmento: 'estetica', registro_numero: null }), reu({}))).toBe(true)
  })
  it('segmento "outro" exige o texto', () => {
    expect(pacoteCompleto(lead({ segmento: 'outro', segmento_outro: null, registro_numero: null }), reu({}))).toBe(false)
    expect(pacoteCompleto(lead({ segmento: 'outro', segmento_outro: 'Pet shop' }), reu({}))).toBe(true)
  })
  it('gera o texto para o WhatsApp marcando o que falta', () => {
    const t = textoPacote(lead({ instagram: null }), reu({}), {
      segmento: 'Odontologia', dataHora: '27/11/2026 14:00', formato: 'Vídeo', whatsapp: 'Sim',
    })
    expect(t).toContain('*Instagram:* (falta)')
    expect(t).toContain('*CRO:* 00000')
    expect(t).toContain('27/11/2026 14:00 (Vídeo)')
  })
})

describe('comissão', () => {
  it('25% sobre a base líquida informada pelo admin', () => {
    expect(calcularComissao(797, 25, 'paga')).toBe(199.25)
    // base líquida menor que o preço (ex.: taxa do cartão)
    expect(calcularComissao(760.43, 25, 'paga')).toBe(190.11)
  })
  it('venda cancelada ou reembolsada zera', () => {
    expect(calcularComissao(797, 25, 'cancelada')).toBe(0)
  })
  it('venda ainda não paga não gera comissão', () => {
    expect(calcularComissao(797, 25, 'aguardando_aprovacao')).toBeNull()
    expect(calcularComissao(797, 25, 'aguardando_pagamento')).toBeNull()
  })
  it('soma por mês, separando a receber e paga, sem contar canceladas', () => {
    const r = comissaoPorMes([
      { valor: 199.25, status: 'paga', data_pagamento: '2026-11-05', created_at: '2026-10-30T12:00:00Z', cancelada: false },
      { valor: 199.25, status: 'a_pagar', data_pagamento: null, created_at: '2026-11-10T12:00:00Z', cancelada: false },
      { valor: 0, status: 'a_pagar', data_pagamento: null, created_at: '2026-11-11T12:00:00Z', cancelada: true },
      { valor: 150, status: 'paga', data_pagamento: '2026-10-02', created_at: '2026-10-01T12:00:00Z', cancelada: false },
    ])
    expect(r).toEqual([
      { mes: '2026-11', aReceber: 199.25, recebida: 199.25 },
      { mes: '2026-10', aReceber: 0, recebida: 150 },
    ])
  })
})

describe('lista Hoje', () => {
  const hoje = '2026-11-20'
  it('inclui vencidos e de hoje, vencidos primeiro', () => {
    const ls = [
      lead({ id: 'a', nome: 'B hoje', retornar_em: hoje }),
      lead({ id: 'b', nome: 'A vencido', retornar_em: '2026-11-18' }),
      lead({ id: 'c', nome: 'Amanhã', retornar_em: '2026-11-21' }),
      lead({ id: 'd', nome: 'Sem data', retornar_em: null }),
    ]
    expect(listaHoje(ls, hoje).map((l) => l.id)).toEqual(['b', 'a'])
  })
  it('exclui "não ligar mais", arquivados, excluídos e "já tem site"', () => {
    const ls = [
      lead({ id: 'a', nao_ligar: true }),
      lead({ id: 'b', arquivado_em: '2026-11-19T00:00:00Z' }),
      lead({ id: 'c', deleted_at: '2026-11-19T00:00:00Z' }),
      lead({ id: 'd', ja_tem_site: true }),
      lead({ id: 'e' }),
    ]
    expect(listaHoje(ls, hoje).map((l) => l.id)).toEqual(['e'])
  })
  it('aponta pendência de pacote para reunião futura', () => {
    const p = pendenciasPacote(
      [reu({ id: 'R1' }), reu({ id: 'R2', lead_id: 'L2' }), reu({ id: 'R3', data_hora: '2026-11-01T12:00:00Z', lead_id: 'L2' })],
      new Map([['L1', leadBase], ['L2', lead({ id: 'L2', instagram: null })]]),
      hoje,
    )
    expect(p).toHaveLength(1)
    expect(p[0]).toMatchObject({ reuniaoId: 'R2', dia: '2026-11-27', faltando: ['Instagram'] })
  })
})

describe('funil e taxas', () => {
  const p = { inicio: '2026-11-07', fim: '2026-11-20' }
  it('conta cada etapa no período e calcula a taxa sobre a etapa anterior', () => {
    const ligacoes = [
      lig({ resultado: 'nao_atendeu' }), lig({ resultado: 'nao_atendeu' }),
      lig({ resultado: 'recepcao' }), lig({ resultado: 'reuniao_marcada' }),
      lig({ resultado: 'sem_interesse', data_hora: '2026-10-01T12:00:00Z' }), // fora do período
    ]
    const reunioes = [
      reu({ id: 'a', resultado: 'fechou', data_hora: '2026-11-12T15:00:00Z', created_at: '2026-11-10T12:00:00Z' }),
      reu({ id: 'b', resultado: 'faltou', data_hora: '2026-11-13T15:00:00Z', created_at: '2026-11-10T12:00:00Z' }),
    ]
    const vendas = [ven({ status: 'paga', data_pagamento: '2026-11-18' }), ven({ status: 'aguardando_pagamento' })]
    const f = calcularFunil(ligacoes, reunioes, vendas, p)
    expect(f.map((e) => e.total)).toEqual([4, 2, 2, 1, 1])
    expect(f.map((e) => e.taxa)).toEqual([null, 0.5, 1, 0.5, 1])
  })
  it('taxa fica nula quando a etapa anterior é zero (sem metas inventadas)', () => {
    const f = calcularFunil([], [], [], p)
    expect(f.every((e) => e.total === 0 && e.taxa === null)).toBe(true)
  })
  it('agrupa motivos de perda com as palavras do lead', () => {
    const d = '2026-11-12T15:00:00Z'
    const m = motivosDePerda([
      reu({ data_hora: d, motivo_perda: 'Achou caro' }), reu({ data_hora: d, motivo_perda: 'achou caro.' }),
      reu({ data_hora: d, motivo_perda: 'Já tem sobrinho que faz' }), reu({ data_hora: d, motivo_perda: '  ' }),
      reu({ motivo_perda: 'Fora do período' }),
    ], p)
    expect(m).toEqual([{ motivo: 'Achou caro', vezes: 2 }, { motivo: 'Já tem sobrinho que faz', vezes: 1 }])
  })
})

describe('formatos pt-BR e fuso de São Paulo', () => {
  it('moeda em reais', () => {
    expect(fmtMoeda(1234.56)).toBe('R$ 1.234,56')
    expect(lerMoeda('1.234,56')).toBe(1234.56)
    expect(lerMoeda('797')).toBe(797)
  })
  it('data dd/mm/aaaa', () => {
    expect(fmtData('2026-11-27')).toBe('27/11/2026')
  })
  it('hoje respeita America/Sao_Paulo (23h30 em SP ainda é o mesmo dia)', () => {
    expect(hojeSP(new Date('2026-11-21T02:30:00Z'))).toBe('2026-11-20')
  })
  it('horário digitado é interpretado como de São Paulo', () => {
    expect(localSPparaISO('2026-11-27T14:00')).toBe('2026-11-27T17:00:00.000Z')
  })
  it('próximo dia útil pula o fim de semana', () => {
    expect(proximoDiaUtil('2026-11-21')).toBe('2026-11-23')
  })
  it('telefone para tel:', () => {
    expect(telefoneE164('(35) 99999-0000')).toBe('+5535999990000')
  })
})
