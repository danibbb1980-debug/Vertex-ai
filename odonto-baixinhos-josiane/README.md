# Odonto Baixinhos + Dra. Josiane Silva — site (rascunho)

Site de página única para o endereço **Av. Afonso Pena, 997 · Centro · Alfenas - MG**, com duas
profissionais: **Dra. Aline Maciel** (Odonto Baixinhos, bebês e crianças) e **Dra. Josiane Silva**
(cirurgiã-dentista, adultos). Conceito: "duas portas, um endereço".

Vite + React 19 + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (abre rápido e é lido pelo Google sem JavaScript).

```bash
cd odonto-baixinhos-josiane
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (typecheck + build + pré-renderização)
npm run preview    # serve o dist/ em http://localhost:4173
```

## Onde mudar cada coisa

**Todos os dados estão em `src/config.ts`.** Não há dado espalhado pelos componentes.

| O quê | Onde (`src/config.ts`) |
|---|---|
| Faixa de rascunho + noindex | `rascunho: true/false` |
| URL final (canonical, og:url, JSON-LD) | `siteUrl` |
| Ligar/desligar uma profissional | `mostrarAline`, `mostrarJosiane` |
| Ligar/desligar seções | `secoes` |
| WhatsApp, Instagram, CRO, mensagens | `profissionais.aline` / `profissionais.josiane` |
| Atendimentos da Dra. Josiane | `profissionais.josiane.atendimentos` (`confirmado: true` para entrar no site sem marcação e no formulário) |
| Horários (geram o quadro e os horários do formulário) | `horarios` |
| Estrutura e formas de pagamento | `estrutura` |
| Sedação consciente (desligada) | `sedacaoAline.mostrar` |
| Especialidade, anos de formada, perfil pessoal, nota do Google | `mostrarEspecialidades`, `mostrarAnosDeFormada`, `mostrarPerfilPessoal`, `mostrarNotaGoogle` |
| Formulário de agendamento | `agendamento` |

### Uma profissional só

Com `mostrarAline: false` **ou** `mostrarJosiane: false`, o site vira o site individual da outra:
sem o split, sem a parceira no texto, no menu, no formulário, no JSON-LD e na foto da fachada
(usa o recorte só do castelo ou só da porta escura). Para conferir sem editar o arquivo:

```bash
VITE_CENARIO=aline npm run build     # só Dra. Aline
VITE_CENARIO=josiane npm run build   # só Dra. Josiane
```

Num site individual em produção, troque também `siteUrl` pelo domínio próprio.

### Desligar o rascunho (publicação final)

1. `rascunho: false` em `src/config.ts` (tira a faixa e muda as metas para `index, follow`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. Remova a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
4. Em `public/privacidade.html` e `public/404.html`, remova a faixa e o `noindex`.

## Fotos e logos

- Originais em `referencias/` (fachada, retratos, recortes dos logos).
- `npm run imagens` gera AVIF + WebP em `public/img/` (`scripts/otimizar-imagens.mjs`).
- Para trocar uma foto: substitua o arquivo em `referencias/fotos/` com o mesmo nome e rode `npm run imagens`.
- Os logos foram **recortados de posts do Instagram** (não havia arquivo original) e tiveram só o fundo
  removido (`scripts/limpar-logos.py`), sem redesenho. A resolução é baixa: **peça os logos em PNG
  transparente ou SVG** e substitua `public/img/logo-*.webp`.
- A selfie da Dra. Josiane estava espelhada pela câmera (letreiro invertido); o script desfaz o espelho.
- Não há fotos de pacientes, crianças, bocas ou procedimentos, por regra do CFO.

## Deploy

**Vercel:** importe o repositório com **Root Directory = `odonto-baixinhos-josiane`** (o `vercel.json`
já define Vite, `dist/` e o cabeçalho `X-Robots-Tag`). Depois do primeiro deploy, atualize `siteUrl`.

**Netlify Drop (plano B):** `npm run build`, depois arraste o zip de `dist/` (com `index.html` e
`_headers` na raiz):

```bash
cd dist && zip -r ../site-odonto-baixinhos-josiane.zip . -x "*.DS_Store"
```

## O que as clínicas precisam confirmar

- [ ] Se as duas querem o site **em conjunto** ou **separado** (o código já faz os dois).
- [ ] **CRO-MG** da Dra. Aline e da Dra. Josiane (hoje: placeholder visível).
- [ ] **Horários por profissional** (hoje: ficha única do Google, seg–sex 9h–11h30 e 13h30–18h).
- [ ] **Atendimentos da Dra. Josiane** (hoje: 4 exemplos marcados "a confirmar").
- [ ] **Faixa etária e público** da Dra. Aline (o texto cita até 12 anos; bebês, crianças, PNE, gestantes).
- [ ] **Sedação consciente**: habilitação comprovada antes de ligar `sedacaoAline.mostrar`.
- [ ] **Especialidade** registrada no CRO (Odontopediatria) antes de ligar `mostrarEspecialidades`.
- [ ] "Cirurgiã-dentista desde 2013" (Dra. Josiane): se e como divulgar.
- [ ] Se o fixo **(35) 3292-5761** recebe WhatsApp.
- [ ] Como os pais acompanham a consulta infantil (placeholder em "Para os pais").
- [ ] **Autorização de uso de imagem** das fotos (retratos e fachada com a Dra. Aline à porta).
- [ ] Fotos novas, se quiserem (retratos em boa luz, fachada sem pessoas, ambientes sem pacientes).
- [ ] **Logos em alta qualidade** (PNG transparente ou SVG).
- [ ] **Formas de pagamento** e **acessibilidade** (ficha do Google: entrada, assento, banheiro e
      estacionamento acessíveis; crédito, débito e aproximação).
- [ ] Endereço e CEP.
