# Instituto Harmoniza — site (rascunho para avaliação)

Página única do Instituto Harmoniza (odontologia e harmonização orofacial), feita
para gerar agendamentos de avaliação pelo WhatsApp. App independente dentro do
repositório da Vertex, com build próprio.

Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · motion · Lenis. Estático, sem
backend, sem formulário, sem cookies e sem analytics.

## Rodando

```bash
cd instituto-harmoniza
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ já pré-renderizado (HTML completo, bom para SEO)
npm run preview   # serve o dist/
```

## Onde mudar cada coisa

Quase tudo fica em **`src/config.ts`** (fonte única de dados):

| O quê | Campo |
|---|---|
| WhatsApp, telefone, Instagram, link do Maps | `whatsapp`, `telefoneExibicao`, `instagram`, `googleMaps` |
| Endereço, cidade, mapa embutido | `endereco`, `enderecoPartes`, `cidade`, `mapaEmbedUrl` |
| Horários | `horarios` |
| Atendimentos (texto, mensagem de WhatsApp, liga/desliga) | `atendimentos` |
| Profissionais (CRO, Instagram, foto) | `profissionais` |
| Responsável técnico | `responsavelTecnico` |
| Ligar/desligar seções | `secoes` |
| Efeitos de movimento | `movimento` |
| Nota do Google (só nota e link, sem depoimentos) | `mostrarNotaGoogle`, `notaGoogle`, `secoes.avaliacoesGoogle` |

**Selo "a confirmar":** todo dado com `confirmado: false` aparece no site com um
selo discreto. Quando a clínica confirmar, troque para `true` e o selo some.

**Seções:** em `secoes`, troque `true` por `false` para esconder uma seção. A
numeração (01, 02…) e o menu se ajustam sozinhos. Para uma versão mais curta,
desligue por exemplo `paraQuem`, `estrutura` e `faixaAreas`.

As perguntas frequentes ficam em `src/secoes/Duvidas.tsx`; os compromissos do
instituto, em `src/secoes/Instituto.tsx`.

## Fotos e logo

1. Coloque as fotos originais em `referencias/fotos/` (ou o logo em `referencias/logo/`).
2. Ajuste a lista no topo de `scripts/otimizar-fotos.mjs`, se for um arquivo novo.
3. Rode `npm run fotos`: gera AVIF/WebP em `public/`, o favicon e a imagem de compartilhamento.
4. Aponte o caminho (sem extensão) em `src/config.ts`: `fotos.hero`, `fotos.estrutura`
   ou `profissionais[].foto`. Sem foto, o site mostra um bloco reservado com a
   legenda "Foto do instituto (substituir)".

Hoje:
- **Logo:** recortado da arte oficial do instituto (sem redesenho), com fundo
  transparente. O ícone da aba usa o símbolo em fundo café. Vale pedir o
  arquivo vetorial (SVG/PDF) para trocar.
- **Retratos:** fotos de perfil do Instagram (150 px). Pedir fotos em alta.
- **Fotos do espaço:** recepção (hero), sala de espera ("Estrutura e conforto") e
  fachada ("Localização e contato"), recortadas de capturas da ficha do Google
  Maps, sem a interface do celular. A fachada foi recortada para não mostrar a
  placa "Odontologia Especializada" (o termo só pode ser usado com especialidade
  registrada no CFO). A recepção e a sala de espera foram publicadas por
  visitantes no Google: **confirmar com a clínica** o uso ou trocar por fotos
  próprias em alta resolução.
- **Imagens não usadas de propósito:** as referências tinham posts de "antes e
  depois" e fotos de pacientes. Elas ficaram de fora do site e do repositório
  (regras de publicidade do CFO e necessidade de autorização do paciente).

## Rascunho e indexação

Enquanto `CONFIG.rascunho = true`, o site mostra a faixa "Rascunho para
avaliação" e fica fora do Google em três camadas: meta `robots`/`googlebot`,
`public/robots.txt` (`Disallow: /`) e cabeçalho `X-Robots-Tag` (em
`public/_headers` e `vercel.json`).

**Para publicar a versão final:**
1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio definitivo.
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: remova a linha do `X-Robots-Tag`.
4. `npm run build` (o build avisa se algum desses passos faltar).

## Deploy

- **Vercel:** importe o repositório com **Root Directory = `instituto-harmoniza`**
  (o `vercel.json` já define Vite, build e cabeçalhos). Ou, dentro da pasta:
  `vercel deploy --prod --yes`.
- **Netlify Drop (plano B):** `npm run build`, depois
  `cd dist && zip -r ../site-instituto-harmoniza.zip . -x "*.DS_Store"` e arraste o zip.

## O que a clínica precisa confirmar

- [ ] CRO da Dra. Poly Anderson (CRO-MG 48027?) e do Dr. João Ricardo
- [ ] Responsável técnico e CRO do instituto (obrigatório no rodapé)
- [ ] Horários (seg a sex 08h–19h, sáb 08h–12h, domingo fechado), conforme a ficha do Google
- [ ] Atendimentos oferecidos: odontologia estética, atendimento pediátrico, sedação
- [ ] Harmonização orofacial: se é oferecida pelo instituto e por quem
- [ ] Sedação: como é feita e por quem, para revisar o texto
- [ ] Idade mínima para o atendimento infantil
- [ ] Compromissos da seção "O instituto" (avaliação individual, planejamento explicado, atendimento para toda a família)
- [ ] Formação dos profissionais (só entra com comprovação; sem "especialista" sem registro no CFO)
- [ ] Anos de experiência do Dr. João Ricardo (`mostrarAnosDeExperiencia`)
- [ ] Uso das fotos do espaço tiradas da ficha do Google (ou fotos próprias em alta); retratos em alta; logo em vetor
- [ ] Se pode mostrar a nota do Google (só nota e link)

## Desempenho e acessibilidade

- HTML pré-renderizado no build (`scripts/prerender.mjs`) e hidratado por seção.
- JS inicial só com React; motion, Lenis e a curva de assinatura carregam
  depois, quando o navegador fica ocioso.
- Todas as animações usam transform/opacity e respeitam `prefers-reduced-motion`
  (versão estática). Fontes reserva calibradas para evitar salto de layout.
