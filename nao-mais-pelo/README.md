# Não+Pelo — redesign premium

Reconstrução de [naomaispelo.com.br](https://naomaispelo.com.br) como app Next.js independente dentro do
repositório da Vertex (mesmo padrão de `vip-shape/`).

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4. Sem bibliotecas de animação ou carrossel:
motion em CSS + um único IntersectionObserver, tudo respeitando `prefers-reduced-motion`.

## Rodando

```bash
cd nao-mais-pelo
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build && npm start
```

### Deploy na Vercel

Root Directory = `nao-mais-pelo`. Variáveis (ver `.env.example`):

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Domínio oficial. Ativa canonical e usa o domínio em OG, sitemap e JSON-LD. |
| `CF7_FORWARD=true` | **Liga o envio real dos formulários** para o Contact Form 7 do WordPress. Sem ela, os leads são validados e só registrados no log (modo de teste, para previews não gerarem contatos falsos). |
| `CF7_BASE_URL` | Onde está o WordPress (padrão `https://naomaispelo.com.br`). Se o site novo assumir o domínio, aponte para o endereço em que o WordPress continuar respondendo. |

## Direção criativa — "Luz sobre a pele"

- **Paleta:** preto profundo `#12110F`, off-white quente `#F4EFE7`, areia `#E7DFD2` e o verde da marca `#95D400`
  em CTAs e destaques (texto verde sobre claro usa `#467300` para manter contraste). Logo empilhado em selo verde.
- **Tipografia:** Plus Jakarta Sans em títulos e textos (sans moderna, alinhada ao desenho arredondado do logo).
- **Assinaturas:** rótulos de revista ("N° 02 — Tecnologia"), linhas finas, o "+" da marca como ornamento,
  botões retos com preenchimento de baixo para cima, títulos revelados por máscara.
- Cada seção tem composição própria (hero de campanha, manifesto assimétrico, tecnologia escura com parallax,
  mapa do corpo interativo, lista numerada com imagem fixa, faixa de vídeos, localizador, formulário em split).

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Hero, Manifesto, Tecnologia (vídeo), Áreas (mapa do corpo), Diferenciais, Depoimentos em vídeo, Localizador, Primeira sessão gratuita, Franquias |
| `/depilacao-feminina`, `/depilacao-masculina` | Mesma estrutura das páginas originais, com o mapa travado no público |
| `/unidades` | Localizador completo: busca livre + filtro por estado, 131 unidades |
| `/franquias` | Conteúdo integral de "Seja um franqueado", com formulário, FAQ e aviso legal |

Redirecionamentos permanentes: `/onde-estamos → /unidades`, `/seja-um-franqueado → /franquias`,
`/quem-somos → /#manifesto`, `/contato → /#agendar`. Blog e política de privacidade continuam no WordPress.

## Funcionalidades preservadas

- **Cadastro "primeira sessão gratuita"** (CF7 form 5): mesmos campos (nome, WhatsApp com máscara, e-mail,
  estado → cidade → unidade, consentimento LGPD). Depois do envio abre o WhatsApp da unidade escolhida com a
  mesma mensagem do site original. Os nomes de unidade são os da API `clinicaon/v1` (os que o CRM espera).
- **Newsletter** (CF7 form 21) e **franquias** (CF7 form 24), via `app/api/lead/route.ts`, com honeypot.
- **WhatsApp central** `(11) 91837-2669` com a mensagem original — agora em `wa.me` (o `web.whatsapp.com`
  do site antigo não abre o app no celular).
- **Depoimentos e vídeo da tecnologia**: os mesmos vídeos do YouTube, carregados só no clique (`youtube-nocookie`).
- **Unidades**: endereço, telefone e WhatsApp de cada loja, botão "Agendar" e "Como chegar" (Google Maps).

## Dados e onde mudar

| O quê | Onde |
|---|---|
| Contatos, redes, WhatsApp central, áreas do corpo, diferenciais, depoimentos | `lib/site.ts` |
| Unidades do localizador (de `/onde-estamos`) | `lib/data/unidades.json` |
| Unidades do formulário (da API `/wp-json/clinicaon/v1`) | `lib/data/cadastro-unidades.json` |
| Conteúdo de franquias, FAQ, aviso legal | `lib/franchise.ts` |
| Cores, tipografia, motion | `app/globals.css` |

Os dois JSON de unidades são instantâneos de novembro de 2026. Para atualizar, gere-os de novo a partir de
`/onde-estamos` e da API `clinicaon/v1` (estados → cidades → unidades-lista).

## Decisões sobre conteúdo

- **Nada inventado.** Todos os textos, números, nomes e contatos vêm do site original. Afirmações fortes do
  site antigo ("total eficácia", "resultados desde a 1ª sessão", "sem sofrimento") foram deixadas de fora.
- **Números da rede** (1.000 unidades no mundo, 170 no Brasil, 16 países, 18 anos) aparecem com a nota de que
  vêm da página de franquias. O site antigo também diz "mais de 100 unidades" e, no rodapé, "+ de 18 países";
  esta última não foi usada por conflitar com "16 países".
- **Números financeiros** da franquia sempre acompanham o aviso legal da própria marca.
- **Imagens:** somente fotos publicadas pela marca. As de `public/img/pirassununga/` são fotos oficiais da unidade de
  Pirassununga, recortadas de capturas de tela (sem textos e logos sobrepostos); os originais em alta resolução
  deixariam o resultado ainda melhor. Fotos de lojas aparecem apenas na área de franquias e
  identificadas como "Unidade da rede Não+Pelo". Os selos "prêmios" do rodapé antigo (álcool etílico,
  antibacteriano etc.) não são prêmios e foram removidos.
- 4 unidades não publicaram WhatsApp (Santa Inês 2, Poços de Caldas, Santa Luzia, Dois Irmãos): o botão leva
  à central.

## Pendências para a marca

- **Política de privacidade:** a página atual do WordPress é o texto-modelo padrão ("Texto sugerido… nopelo.local").
  É preciso publicar uma política real (LGPD) — os formulários apontam para ela.
- Fotografia em alta resolução: várias imagens originais têm 1920 px ou menos e foram ampliadas no site antigo.
  Um ensaio próprio elevaria ainda mais o resultado.
