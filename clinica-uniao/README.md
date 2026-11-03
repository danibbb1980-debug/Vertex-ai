# Clínica União | Pouso Alegre - MG (rascunho)

Site de página única da Clínica União. Vite + React + TypeScript + Tailwind, estático, sem backend,
sem cookies e sem analytics. O HTML é pré-renderizado no build (o texto aparece antes do JavaScript).

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Dados da clínica (endereço, telefone, WhatsApp, horários, atendimentos, pagamentos, dentistas, CRO, fotos) | `src/config.ts` |
| Textos (A clínica, Quando procurar, Como funciona, Dúvidas, CTA) | `src/content.ts` |
| Cores e fontes | `tailwind.config.js` e `src/index.css` |

Regra do site: **campo vazio, lista vazia ou `null` não aparece**. A seção ou o bloco somem e o layout se reorganiza.

- **Ligar/desligar seções:** `CONFIG.secoes` (`true`/`false`).
- **Adicionar dentistas:** preencha `CONFIG.dentistas` com `nome` e `cro` (obrigatórios). Especialidade só com
  `registroEspecialidade` (registro no CFO); sem ele, a especialidade não aparece. A seção "Quem atende" surge sozinha.
- **Responsável técnico:** `CONFIG.responsavelTecnico = { nome, cro }`. Aparece no rodapé e no JSON-LD.
- **Fotos:** coloque os arquivos em `referencias/fotos/` (jpg, png, webp) e rode o build. A galeria aparece sozinha.
  Para um texto alternativo melhor, cadastre em `CONFIG.fotos` (`src` em `/public`, `alt` descritivo).
  Use apenas fotos autorizadas do espaço; nada de pacientes, bocas ou "antes e depois".
- **Horários:** `CONFIG.horarios` (0 = domingo; `null` = fechado). Se houver almoço, use `almoco: { inicio, fim }`:
  o formulário passa a excluir esse intervalo automaticamente.
- **Urgência:** `CONFIG.agendamento.urgencia = true` só se a clínica fizer pronto atendimento.

## Desligar o modo rascunho (publicação definitiva)

1. `CONFIG.rascunho = false` (remove a faixa e troca as metas para `index, follow`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: remova o `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: remova a faixa e a meta `noindex`.
5. `CONFIG.siteUrl` com o domínio final.

## Pendências antes de publicar de forma definitiva

- [ ] **Responsável técnico e CRO** (exigência do CFO para publicidade odontológica).
- [ ] **WhatsApp:** o número informado, (35) 3425-9465, tem formato de telefone fixo. Confirmar se ele recebe
      WhatsApp (WhatsApp Business em fixo). Se não receber, troque `CONFIG.whatsapp` pelo celular da clínica
      (formato `55359XXXXXXXX`); todos os botões e o formulário usam esse campo.
- [ ] **Fotos** do espaço, autorizadas.
- [ ] **Logo em alta qualidade** (SVG ou PNG transparente). O site usa uma versão com fundo removido gerada a
      partir do JPG recebido (`referencias/logo-uniao-transparente.png`).
- [ ] **Acessibilidade da entrada/assento:** o Google informa só o banheiro acessível. Se a entrada também for,
      marque `CONFIG.estrutura.entradaAcessivel` e ajuste o texto da seção Estrutura.
- [ ] Revisão dos textos pela clínica (atendimentos e dúvidas frequentes).

## Formulário "Solicitar agendamento"

Não envia nada a servidor e não guarda dados. Monta a mensagem e abre `wa.me/{CONFIG.whatsapp}` em nova aba.
Datas passadas e dias fechados são bloqueados; horários em blocos de 1 hora, sem o horário de fechamento e sem almoço.
