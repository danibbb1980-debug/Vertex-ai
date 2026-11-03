# Odonto Fit — site (rascunho)

Site de página única da Odonto Fit, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (HTML pré-renderizado, pronto para qualquer hospedagem estática)
npm run preview  # serve o dist/
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Regra do site: campo vazio (`''`) ou lista vazia
(`[]`) não aparece. Nenhum placeholder é exibido; a página se reorganiza sozinha.

| Quero... | Faça em `src/config.ts` |
|---|---|
| Trocar telefone, WhatsApp, endereço, Instagram | `telefone`, `whatsapp` (só dígitos, com 55 + DDD), `endereco`, `instagram` |
| Mudar horários | `horarios` (0 = domingo … 6 = sábado; `null` = fechado; `almoco` opcional). O formulário de agendamento usa esses mesmos dados. |
| Ligar/desligar uma seção | `secoes.nomeDaSecao = false` |
| Adicionar dentistas | `dentistas: [{ nome, cro, formacao?, foto? }]`. A seção "Equipe" aparece sozinha. Use `especialidadeRegistrada` só com título registrado no CFO. |
| Mostrar responsável técnico | `responsavelTecnico: { nome, cro }`. Aparece no rodapé e no JSON-LD. |
| Adicionar fotos | Coloque os arquivos em `referencias/fotos/` (jpg, png, webp). A galeria aparece sozinha. O nome do arquivo vira o texto alternativo, então use nomes descritivos (ex.: `recepcao.jpg`). |
| Tirar a faixa de rascunho e liberar o Google | `rascunho: false` **e** remova o `X-Robots-Tag` de `vercel.json` e `public/_headers` e troque `public/robots.txt` por `Allow: /`. |
| Trocar a URL oficial | `siteUrl` (usada em canonical, og:url e JSON-LD). |

## O que falta para publicar de forma definitiva

1. **Responsável técnico e CRO** (exigência do CFO para publicidade odontológica). Preencher `responsavelTecnico`.
2. **Confirmar o WhatsApp.** O número informado, (35) 4102-0088, tem formato de telefone fixo.
   Confirmar se ele recebe mensagens de WhatsApp; se não, trocar `whatsapp` pelo celular que a clínica indicar.
3. **Logo em alta qualidade** (PNG com fundo transparente ou SVG). O arquivo atual tem 150×150 px;
   o site usa uma versão recortada, com o fundo branco removido, sem redesenho (`public/logo-odonto-fit.png`).
4. **Fotos reais** da clínica (opcional), em `referencias/fotos/`.
5. **Imagem de compartilhamento** (1200×630) para `og:image`, hoje omitida por não haver imagem adequada.
6. **Entrada acessível**: só mencionar se a clínica confirmar. Hoje o site cita apenas assento e banheiro acessíveis.
7. Desligar o modo rascunho (ver tabela acima).

## Notas técnicas

- `npm run build` gera o HTML já pré-renderizado (`scripts/prerender.mjs`) e embute o CSS, para a primeira pintura ser rápida.
- O formulário "Solicitar agendamento" só monta a mensagem e abre `wa.me`. Não grava nada e não faz requisição a servidor.
- O mapa do Google só carrega quando a pessoa toca em "Mostrar mapa interativo".
- Animações respeitam `prefers-reduced-motion` (tudo aparece no estado final, sem movimento).
- noindex em três camadas enquanto for rascunho: meta `robots`/`googlebot`, `public/robots.txt`, e `X-Robots-Tag` em `public/_headers` e `vercel.json`.
