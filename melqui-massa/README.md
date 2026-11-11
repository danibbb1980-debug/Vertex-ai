# Site Dr. Melqui Massa (rascunho)

Página única em Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Onde editar

Tudo o que muda está em **`src/config.ts`**. Regra do projeto: campo vazio (`""`, `null` ou `[]`) faz o bloco sumir do site. Não existe placeholder.

| O que | Onde |
| --- | --- |
| Ligar/desligar seções | `secoes` (`true`/`false` em cada uma) |
| Preencher o CRM | `crm: "12345"` (e `crmUF`). Passa a aparecer no header, no selo do hero, no bloco do médico, no rodapé e no JSON-LD |
| Divulgar a especialidade | Preencha `especialidades: [{ nome: "...", rqe: "..." }]` **e** `mostrarEspecialidade: true`. Só faça isso com o RQE (Resolução CFM nº 2.336/2023) |
| Trocar o WhatsApp | `whatsapp` (só dígitos, com 55 + DDD) e `whatsappExibicao` |
| Telefone fixo | `telefone`. Hoje vazio: não há botão "Ligar" |
| Foto do médico | Coloque o arquivo em `public/fotos/` e preencha `foto: { src: "/fotos/arquivo.jpg", alt: "..." }` |
| Fotos do consultório | `fotosConsultorio` (lista; vazia = bloco some) |
| Horários | `horarios` (os horários do formulário são gerados daqui, em blocos de 1 h que terminam até o fechamento; `pausa` opcional exclui o almoço) |
| Atendimentos | `atendimentos` (lista editorial e opções do formulário) |
| Desligar o rascunho | `rascunho: false` **e** remover o noindex de `public/robots.txt`, `public/_headers` e `vercel.json` |
| URL pública | `siteUrl` (canonical, og:url, og:image e JSON-LD) |

## Identidade

- O cérebro do logo foi vetorizado a partir de `referencias/logo-original.jpg` (`src/brain.ts`): contorno exato + linha central usada na animação de desenho. A legenda "Psiquiatria clínica & psicoterapia" foi deixada de fora de propósito.
- Fontes: Jost (títulos, nome, rótulos) e Newsreader (leitura), auto-hospedadas via `@fontsource`.

## Antes de publicar de forma definitiva

1. **CRM** visível (exigência do CFM). Sem ele o site não deve ir ao ar como definitivo.
2. **RQE**, se a especialidade for divulgada (inclusive o "psiquiatra" que aparece no logo e no @ do Instagram).
3. Logo em alta resolução (PNG transparente ou SVG). O arquivo recebido é um JPG de 640 px.
4. Fotos do consultório em alta resolução (as atuais têm 203 × 152 px) e, se o médico quiser, uma foto dele.
5. Formação e currículo, se o médico quiser exibir.
6. Confirmar horários, o número de WhatsApp do consultório e se "psicoterapia" pode constar.
7. `rascunho: false` e retirar o noindex das três camadas.
