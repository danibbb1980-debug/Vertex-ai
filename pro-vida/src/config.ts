/**
 * Todos os dados do site ficam aqui.
 * Itens marcados com "CONFIRMAR COM A CLÍNICA" ainda não foram validados.
 * Fontes: ficha do Google Maps e perfil do WhatsApp Business da clínica.
 */

export type Area = {
  nome: string
  linha: string
}

export type Profissional = {
  nome: string
  area: string
  /** Ex.: "CRM-SP 000000". CONFIRMAR COM A CLÍNICA */
  registro: string
  /** Caminho em /public/fotos/ (WebP). Vazio = iniciais em círculo. */
  foto?: string
}

export const CONFIG = {
  /** true = faixa de rascunho visível. Ao publicar, troque para false
   *  e ajuste public/_headers, public/robots.txt (ver README). */
  rascunho: true,

  /** URL absoluta onde o site ficará publicado. CONFIRMAR COM A CLÍNICA */
  siteUrl: 'https://pro-vida-rascunho.netlify.app',

  nome: 'Instituto Médico Pró Vida',
  nomeCurto: 'Pró Vida',
  cidade: 'São João da Boa Vista',
  uf: 'SP',

  /** Logo original da clínica, usada como está (sem redesenho). */
  logo: '/logo-pro-vida.webp',

  // Endereço do perfil do WhatsApp Business. CONFIRMAR COM A CLÍNICA
  endereco: {
    rua: 'R. Cel. José Procópio, 623',
    bairro: 'Perpétuo Socorro',
    cep: '13870-735',
  },

  // Horários do perfil do WhatsApp Business. CONFIRMAR COM A CLÍNICA
  // (segunda-feira aparece como 09h–17h; confirmar)
  horarios: [
    { dias: 'Segunda a quinta', horas: '09h–17h' },
    { dias: 'Sexta', horas: '09h–18h' },
    { dias: 'Sábado e domingo', horas: 'Fechado' },
  ],
  horarioCurto: 'Seg a qui 9h–17h · Sex 9h–18h',

  // Confirmar que este número recebe WhatsApp. CONFIRMAR COM A CLÍNICA
  whatsapp: '551936311819',
  telefoneExibicao: '(19) 3631-1819',
  mensagemPadrao:
    'Olá! Vi o site do Instituto Médico Pró Vida e gostaria de agendar uma consulta.',

  instagram: 'https://www.instagram.com/institutomedicoprovida',
  instagramArroba: '@institutomedicoprovida',
  maps: 'https://maps.app.goo.gl/3eRoD5A6tEssWshf9',

  // Aba "Serviços" da ficha do Google. CONFIRMAR COM A CLÍNICA
  areas: [
    { nome: 'Cirurgia vascular', linha: 'Avaliação de veias e artérias.' },
    { nome: 'Cardiologia', linha: 'Avaliação do coração e da pressão arterial.' },
    { nome: 'Urologia', linha: 'Trato urinário e saúde masculina.' },
    { nome: 'Neurocirurgia', linha: 'Avaliação de cérebro, coluna e nervos.' },
    { nome: 'Endocrinologia', linha: 'Hormônios, metabolismo e diabetes.' },
    { nome: 'Odontologia', linha: 'Saúde bucal: dentes e gengivas.' },
  ] as Area[],

  // Profissionais listados na ficha do Google ("Neste lugar").
  // Nomes, áreas e registros: CONFIRMAR COM A CLÍNICA
  profissionais: [
    { nome: 'Dr. Gutemberg Adrian Oliveira', area: 'Urologia', registro: 'CRM [A CONFIRMAR]' },
    { nome: 'Dr. Márcio Antônio Pennacchi', area: 'Cirurgia vascular', registro: 'CRM [A CONFIRMAR]' },
    { nome: 'Dra. Cátia Barbutti', area: 'Odontologia', registro: 'CRO [A CONFIRMAR]' },
  ] as Profissional[],

  // Responsáveis técnicos (obrigatórios no rodapé). CONFIRMAR COM A CLÍNICA
  diretorTecnico: '[A CONFIRMAR] CRM-SP',
  responsavelOdonto: '[A CONFIRMAR] CRO-SP',

  /** Nota do Google (4,5 · 23 avaliações). Desligada por padrão:
   *  publicidade médica tem restrições a depoimentos. Decidir com a clínica. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: '4,5', total: 23 },
}

export function waLink(mensagem: string = CONFIG.mensagemPadrao): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function waArea(area: string): string {
  return waLink(
    `Olá! Vi o site do Instituto Médico Pró Vida e gostaria de agendar uma consulta de ${area.toLowerCase()}.`,
  )
}
