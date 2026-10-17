/* ==========================================================================
   CONFIG — todos os dados da clínica ficam aqui. Edite e salve.
   O HTML já traz os mesmos valores como texto inicial (bom para SEO e para
   quem navega sem JavaScript); este bloco sobrescreve ao carregar a página.
   ========================================================================== */
const CONFIG = {
  // true = mostra a faixa "Rascunho". Na publicação, use false
  // e siga o passo a passo do README (noindex, robots.txt, _headers).
  rascunho: true,

  // URL pública do site, sem barra no final. Nunca use localhost.
  // CONFIRMAR: trocar pelo domínio definitivo.
  siteUrl: 'https://starsorrindo-pocos.netlify.app',

  nome: 'Star Sorrindo Poços de Caldas',

  // CONFIRMAR COM A CLÍNICA: a ficha do Google informa (35) 99888-3596 e a
  // conversa respondida mostra +55 35 9888-3596. Valor provisório abaixo.
  whatsapp: '5535998883596',
  telefoneExibicao: '(35) 99888-3596',

  endereco: 'Av. Francisco Salles, 615 — Centro',
  cidade: 'Poços de Caldas — MG',
  cep: '37701-702',

  instagram: 'https://www.instagram.com/starsorrindopc/',
  maps: 'https://maps.app.goo.gl/VYsd6mSkLCC5zcCg7',
  mapsEmbed: 'https://www.google.com/maps?q=Av.+Francisco+Salles,+615,+Centro,+Po%C3%A7os+de+Caldas,+MG,+37701-702&output=embed',

  // Nota do Google (atualize quando mudar)
  avaliacao: { nota: '4,9', total: 12 },

  // Horários (a confirmar com a clínica)
  horarios: [
    { dias: 'Segunda a sexta', horas: '09h – 19h', texto: 'Segunda a sexta, das 9h às 19h.' },
    { dias: 'Sábado', horas: '08h – 15h', texto: 'Sábado, das 8h às 15h.' },
    { dias: 'Domingo', horas: 'Fechado', texto: 'Domingo, fechado.' },
  ],

  // Ex.: 'Responsável técnico: Dr(a). Nome Sobrenome — CRO-MG 00000'
  responsavelTecnico: 'Responsável técnico e CRO: a confirmar com a clínica',

  // Logo oficial: coloque o arquivo em assets/logo/ e informe o caminho,
  // ex.: 'assets/logo/logo.svg'. Vazio = logo tipográfico temporário.
  logo: '',

  mensagens: {
    geral: 'Olá! Conheci a Star Sorrindo pelo site e gostaria de informações sobre uma avaliação odontológica.',
    implantes: 'Olá! Gostaria de saber mais sobre avaliação para implantes dentários na Star Sorrindo.',
    proteses: 'Olá! Gostaria de receber informações sobre próteses dentárias e agendar uma avaliação.',
  },
};

/* ========================================================================== */

(function () {
  'use strict';

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function waLink(tipo) {
    const msg = CONFIG.mensagens[tipo] || CONFIG.mensagens.geral;
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  // Rascunho
  document.documentElement.classList.toggle('is-draft', !!CONFIG.rascunho);

  // Links de WhatsApp
  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

  // Textos
  const textos = {
    nota: CONFIG.avaliacao.nota,
    totalAvaliacoes: String(CONFIG.avaliacao.total),
    endereco: CONFIG.endereco,
    cidade: CONFIG.cidade,
    cep: CONFIG.cep,
    enderecoCompleto: CONFIG.endereco + ', ' + CONFIG.cidade + ', CEP ' + CONFIG.cep,
    telefone: CONFIG.telefoneExibicao,
    horariosTexto: CONFIG.horarios.map((h) => h.texto).join(' '),
    responsavelTecnico: CONFIG.responsavelTecnico,
  };
  $$('[data-config]').forEach((el) => {
    const v = textos[el.dataset.config];
    if (v !== undefined) el.textContent = v;
  });

  // Links e mapa
  $$('[data-config-href]').forEach((a) => {
    const v = CONFIG[a.dataset.configHref];
    if (v) a.href = v;
  });
  $$('[data-config-src]').forEach((el) => {
    const v = CONFIG[el.dataset.configSrc];
    if (v && el.getAttribute('src') !== v) el.src = v;
  });

  // Horários em lista
  $$('[data-horarios]').forEach((dl) => {
    dl.innerHTML = '';
    CONFIG.horarios.forEach((h) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = h.dias;
      dd.textContent = h.horas;
      row.append(dt, dd);
      dl.append(row);
    });
  });

  // Logo oficial (opcional)
  if (CONFIG.logo) {
    $$('[data-brand]').forEach((a) => {
      const img = new Image();
      img.src = CONFIG.logo;
      img.alt = CONFIG.nome;
      img.className = 'brand-logo';
      img.height = 44;
      a.replaceChildren(img);
    });
  }

  // Ano no rodapé
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // Header sólido ao rolar
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu do celular
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const label = document.querySelector('[data-menu-label]');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-open', open);
      if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
    };
    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }
})();
