# Site Dr. Palti Massa (rascunho)

Página única em Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Regra: campo vazio (`""`, `[]` ou `null`) faz o bloco sumir do site, sem deixar espaço vazio.

| O que | Campo |
| --- | --- |
| Ligar/desligar seções | `secoes.medico`, `secoes.atendimentos`, `secoes.agendar` etc. |
| Trocar o WhatsApp | `whatsapp` (só números, com 55 + DDD) e `whatsappExibicao` |
| Telefone fixo (cria o botão "Ligar") | `telefone` e `telefoneExibicao` (hoje vazios) |
| Foto do médico (hero) | `foto` (`null` = usa o símbolo do logo no lugar) |
| Fotos do consultório | `fotosConsultorio` (lista vazia = galeria some) |
| Horários | `horarios` (um item por dia; `almoco` opcional). O formulário gera os horários e bloqueia os dias fechados a partir daqui |
| Textos dos atendimentos | `atendimentos` e `primeiraConsulta` |
| Mensagens do WhatsApp | `mensagens` e `agendamento.mensagemInicial` |
| Formação, convênios | `formacao`, `convenios` (vazios hoje) |

### Adicionar ou trocar fotos
1. Coloque o arquivo original em `referencias/fotos/`.
2. Gere uma versão `.webp` (largura ~740 px e outra ~480 px) em `public/fotos/`.
3. Aponte `foto` ou `fotosConsultorio` para os arquivos, com `width`, `height` e um `alt` descritivo.

### Especialidades (exige RQE)
Pela regra do CFM, título de especialista só pode aparecer com o RQE registrado e visível. Enquanto `mostrarEspecialidades = false`, o site não cita "nutrologia" nem "medicina esportiva" em nenhum lugar (textos, SEO e JSON-LD).
Para ligar: preencha `especialidades[].rqe` e mude `mostrarEspecialidades` para `true`. Uma especialidade sem número de RQE continua escondida.

### CRM-SP
O Instagram mostra CRM-SP 198120. Está em `crmSP`, com `mostrarCrmSP = false`. Mude para `true` se o médico quiser exibir.

### Outras unidades
O Instagram lista "Clínica Lavie Ribeirão Preto" e "Clínica Lumibe Andradas" (WhatsApp 5535997351815). Ficam em `outrasUnidades`, desligadas por `mostrarOutrasUnidades = false` até confirmar se e como o médico atende lá.

### Desligar o rascunho
Na publicação definitiva:
1. `rascunho: false` em `src/config.ts` (remove a faixa e as metas `noindex`).
2. Apague `public/robots.txt` (ou troque `Disallow: /` por `Allow: /`).
3. Remova a linha `X-Robots-Tag` de `public/_headers` e o cabeçalho `X-Robots-Tag` de `vercel.json`.
4. Atualize `siteUrl` com o domínio final.

## O que falta para publicar de forma definitiva
- Números de RQE de nutrologia e medicina esportiva (se o médico quiser exibir as especialidades).
- Logo em alta resolução (SVG ou PNG grande). O logo atual foi vetorizado a partir de um JPG de 640 px.
- Fotos originais em alta resolução: as atuais foram recortadas de capturas de tela (~740 px de largura).
- Formação e currículo, se o médico quiser divulgar.
- Confirmar os horários (segunda a sexta, 09h00 às 18h00) e se há pausa de almoço.
- Confirmar se as outras unidades devem aparecer.
- Domínio definitivo.

## Notas técnicas
- Logo: `src/assets/logoPaths.ts` (vetores traçados do arquivo em `referencias/`), desenhado uma vez como sprite SVG.
- Formulário de agendamento: só monta a mensagem e abre `wa.me`. Nada é enviado a servidor nem salvo no navegador.
- noindex em três camadas: metas `robots`/`googlebot`, `public/robots.txt`, `public/_headers` e `vercel.json`.
- Animações respeitam `prefers-reduced-motion` e usam só transform/opacity (e o traço do arco).
