# Site da Dra. Beatryz Furlaneto (rascunho)

Site de página única para a Dra. Beatryz Furlaneto, cirurgiã-dentista (clínica geral e odontopediatria). É estático, feito com Vite, React, TypeScript, Tailwind e motion. O contato é só pelo WhatsApp.

## Comandos

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
cd dist && zip -r ../site-dra-beatryz.zip . -x "*.DS_Store"   # zip para o Netlify Drop
```

## Como editar

- **Todos os dados** (nome, CRO, WhatsApp, Instagram, unidades, horários, URL do site) ficam em `src/config.ts`. As metas de SEO, o JSON-LD, a página de privacidade e a 404 são geradas a partir dele.
- **Desligar o rascunho:** em `src/config.ts`, `rascunho: false`. Isso tira a faixa do topo e as metas `noindex`. Depois apague também `public/robots.txt` (ou troque por `Allow: /`) e a linha `X-Robots-Tag` em `public/_headers`.
- **Especialidade:** só ligue `especialistaConfirmado: true` depois de confirmar o registro de especialista em Odontopediatria no CRO.
- **URL final:** troque `siteUrl` (usada no canonical, og:url e og:image).
- **Fotos:** os originais estão em `referencias/fotos/`. Para trocar, gere versões `.webp` com 480, 800 e 1100 px de largura em `public/fotos/` com o mesmo nome base (ou mude `fotos` no config). A imagem de compartilhamento é `public/og-image.jpg` (1200×630). Não use fotos de crianças ou pacientes sem autorização por escrito dos responsáveis.
- **Logo:** hoje é uma assinatura tipográfica (componente `Assinatura` em `src/components/Base.tsx`) e `public/favicon.svg`. Troque quando houver logo oficial.

## O que a doutora precisa confirmar

1. Dias e horários de cada unidade (os de São João da Boa Vista vêm da ficha do Google).
2. Unidade de Casa Branca: nome da clínica (Athena Odontologia Avançada?) e endereço.
3. Nome da clínica/consultório em São João da Boa Vista.
4. Registro de especialidade em Odontopediatria no CRO.
5. Responsável técnico (rodapé).
6. Serviços oferecidos e faixas etárias atendidas.
7. Fotos (as atuais são selfies do Instagram) e logo.
8. Avaliações do Google (a seção não foi criada por falta de dados).
9. Domínio definitivo do site.

## Componentes do 21st.dev

- **Text Reveal (Mask)**, de @soralabs: títulos e frase do "Sobre" revelados por linha (`src/components/ui/MaskedTextReveal.tsx`).
- **Reveal**, de @asanshay: entrada suave dos blocos ao rolar (`src/components/ui/Reveal.tsx`).
- FAQ e faixa de texto em movimento foram escritos à mão, inspirados em "FAQ Accordion Reveal" e no Marquee da Magic UI (a cota grátis de código do 21st.dev acabou).
