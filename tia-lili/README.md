# Tia Lili Odontopediatra — site oficial

Landing page da Tia Lili Odontopediatra (Dra. Liliane Ormeneze), focada em
gerar contatos pelo WhatsApp. App Next.js independente dentro do repositório da
Vertex, com `package.json` e build próprios (mesma base do `vip-shape/`).

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react.
Sem bibliotecas de animação: só uma entrada suave no hero, em CSS, que respeita
`prefers-reduced-motion`.

## Rodando

```bash
cd tia-lili
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build && npm start
```

### Deploy na Vercel

Importe o repositório e defina **Root Directory = `tia-lili`**. O `vercel.json`
fixa o framework em Next.js. Ao conectar o domínio oficial, configure
`NEXT_PUBLIC_SITE_URL` (ver `.env.example`) para emitir a tag canonical.

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| WhatsApp, mensagem padrão, Instagram, Google Maps, fotos e textos alternativos | `lib/site-data.ts` (fonte única) |
| Perguntas do FAQ | `lib/faq.ts` |
| Cores e tipografia | `app/globals.css` (`@theme`) e `app/layout.tsx` |
| Marca do header/rodapé | `components/ui/Logo.tsx` |

## Decisões sobre conteúdo

- **Nada inventado.** Sem endereço em texto, horários, CRO, formação, preços,
  avaliações ou depoimentos. Agendamento e dúvidas vão para o WhatsApp; a
  localização vai para o Google Maps.
- **Fotos.** Vêm do perfil da clínica no Google Maps e são pequenas (até ~600 px).
  Para trocar por versões em alta resolução, substitua os arquivos em
  `public/images` mantendo os nomes (ajuste largura/altura em `lib/site-data.ts`).
- **Logotipo.** `public/brand/logo-tia-lili.jpg` (baixa resolução) é usado só na
  imagem de compartilhamento. O header usa a marca em texto; com o logotipo em
  vetor, dá para trocar em `components/ui/Logo.tsx` e `app/icon.svg`.
