# Site da Dra. Talita Lima (rascunho)

Site de página única da Dra. Talita Lima, cirurgiã vascular em Poços de Caldas - MG.
Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML pré-renderizado + assets)
npm run preview  # serve o dist/ em http://localhost:4173
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Campo vazio (`''`, `[]` ou `null`) faz o bloco sumir do site, e o layout se reorganiza sozinho.

| O que | Onde no `config.ts` |
| --- | --- |
| Nome, título, CRM, RQE | `nome`, `titulo`, `crm`, `rqe` |
| Endereço, Maps, Instagram | `endereco`, `mapsUrl`, `mapsEmbed`, `instagram` |
| Horários | `horarios` (dias fora da lista = fechado) |
| Textos dos atendimentos, dúvidas, etapas | `atendimentos`, `duvidas`, `comoFunciona`, `quandoProcurar` |
| Ligar/desligar seções | `secoes` (`true` / `false`) |
| Formulário de agendamento | `agendamento` |

### Trocar o número de WhatsApp
O número informado, (35) 3114-5756, parece fixo. Se ele não receber WhatsApp, troque `whatsapp` pelo celular da clínica (só dígitos, com 55 e DDD, ex.: `5535999999999`). O botão "Ligar" continua usando `telefone` e `telefoneLink`.

### Fotos
`foto` (retrato da médica, no hero) e `fotoLocal` (fachada, na seção de contato). Para trocar, coloque o arquivo em `public/img/` e atualize `src`, `largura`, `altura` e `alt`. Para esconder, use `null`: o hero passa a mostrar o monograma com a aquarela.
As fotos atuais foram **recortadas das artes do Instagram** (sem os textos). Os arquivos originais, em alta resolução, melhorariam o resultado.

### Vínculos institucionais
Prontos em `vinculos`, desligados (`mostrarVinculos: false`). Vieram de fontes públicas de terceiros: ligue só depois que a médica confirmar.

### Angiologia e Cirurgia Endovascular
Pela regra do CFM, título de especialista só aparece com o RQE correspondente. Preencha `rqe` em `especialidadesAdicionais` e mude `mostrarEspecialidadesAdicionais` para `true`. Especialidade sem RQE preenchido continua oculta.

### Desligar o modo rascunho (publicação definitiva)
1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
2. `public/robots.txt`: trocar `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: remover o `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: remover a faixa de rascunho, a meta `noindex` e ajustar o `canonical`.

## O que falta confirmar antes de publicar
- Se o **RQE 55188** corresponde à Cirurgia Vascular.
- Se o **(35) 3114-5756 recebe WhatsApp** (se não, trocar `whatsapp`).
- **Fotos** originais (retrato e consultório) e **logo** em alta resolução (PNG/SVG). O logo atual vem de um JPEG de 640 px.
- **Vínculos** institucionais (Santa Casa, Hospital Universitário Alzira Velano, PUC Minas).
- RQE de **Angiologia** e **Cirurgia Endovascular**, se for o caso.
- Informações de **acessibilidade** e **estacionamento** do Edifício Unique, se existirem (hoje não aparecem).

## Detalhes técnicos
- `vite.config.ts` gera title, metas, Open Graph, canonical e JSON-LD (`Physician`) a partir do config.
- `scripts/prerender.mjs` pré-renderiza o HTML, embute o CSS e carrega o JS depois do `load` (a página é legível antes do JS).
- Formulário "Solicitar agendamento": monta a mensagem e abre `wa.me`. Não envia nada a servidor e não usa `localStorage`.
- Movimento: respeita `prefers-reduced-motion`; a linha vinho de assinatura (`LinhaFluxo.tsx`) só anima `stroke-dashoffset` e pausa fora da tela.
- Referências originais em `referencias/`.
