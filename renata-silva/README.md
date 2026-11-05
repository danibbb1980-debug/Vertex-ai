# Renata Silva Estética Avançada (rascunho)

Site de página única da clínica em Poços de Caldas - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve o dist/
npm run assets   # regenera logo, favicons, imagem de compartilhamento e fotos a partir de ./referencias
```

## Onde editar

Todos os dados ficam em `src/config.ts`. Regra: campo vazio não aparece. A seção some e o layout se reorganiza.

| O quê | Onde |
| --- | --- |
| Ligar/desligar seções | `CONFIG.secoes` (`clinica`, `atendimentos`, `comoFunciona`, `antesDeAgendar`, `duvidas`, `contato`, `agendamento`, `ctaFinal`, `marquee`) |
| Endereço, WhatsApp, Instagram, mapa | `CONFIG.endereco`, `CONFIG.whatsapp` (só dígitos), `CONFIG.instagram`, `CONFIG.mapsUrl` |
| Horários | `CONFIG.horarios` (também geram os horários do formulário em blocos de 1 h). Para um intervalo de almoço, use `pausa: { inicio: "12:00", fim: "13:00" }` |
| Atendimentos | `CONFIG.atendimentos` (frente `facial` ou `corporal`) |
| Mensagens do WhatsApp | `CONFIG.mensagens` |
| Formulário | `CONFIG.agendamento` (`exigirAtendimento`, `limiteObservacoes`, `urgencia`) |

### Fotos

1. Coloque as fotos do ambiente em `referencias/fotos/` (sem pessoas, sem procedimentos, sem corpos).
2. Rode `npm run assets`: gera AVIF e WebP (480 e 960 px) com o tratamento de cor em `public/img/`.
3. Liste a foto em `CONFIG.fotosClinica` (galeria "O espaço") ou em `CONFIG.fotoContato`, com `alt`, `largura` e `altura`.

Foto da profissional: só aparece com o registro preenchido (abaixo), em `CONFIG.profissional.foto`.

### Título, registro e formação da profissional

Preencha `CONFIG.profissional.titulo`, `.registro` (ex.: `CRM-MG 00000`) e, se quiser, `.formacao` e `.bio`.
**Sem `registro`, nada disso aparece:** o site apresenta só a clínica.
Com o registro, ele fica visível no selo do hero, no bloco "A profissional", no rodapé e no JSON-LD.

### Procedimentos do grupo B (toxina, preenchedores, lasers, hidrolipo, teste epigenético, emagrecimento)

Ficam em `src/procedimentos-medicos.ts` e só entram com `MOSTRAR_PROCEDIMENTOS_MEDICOS = true` no topo de `src/config.ts`.
**Ligue somente com profissional habilitada e registro em conselho preenchido e visível.**
Revise as descrições com a profissional antes. Com `false`, esses nomes nem entram no código publicado.

### Cursos

`CONFIG.mostrarCursos` está `false` e não há seção, porque faltam detalhes. Quando houver, preencha `CONFIG.cursos` e peça a criação da seção.

### Desligar o modo rascunho (publicação definitiva)

1. `CONFIG.rascunho = false` (remove a faixa e troca as metas para `index, follow`).
2. `public/robots.txt`: troque por `User-agent: *` + `Allow: /`.
3. `public/_headers` e `vercel.json`: remova o cabeçalho `X-Robots-Tag`.
4. Remova a faixa de rascunho de `public/privacidade.html` e `public/404.html` e a meta `noindex` delas.
5. Ajuste `CONFIG.siteUrl` para o domínio final.

## O que falta para publicar de forma definitiva

- Conselho profissional e número de registro da profissional (sem isso, não há título nem procedimentos do grupo B).
- Foto profissional (opcional). As fotos do ambiente vieram de capturas de tela do Instagram; os arquivos originais ficariam ainda melhores.
- Logo em alta resolução (PNG transparente ou SVG). O atual tem 203 x 203 px e foi recortado e ampliado.
- Confirmação da lista de atendimentos, das descrições e dos horários (inclusive intervalo de almoço e feriados).
- Detalhes dos cursos, se forem divulgados.

## Notas

- O formulário "Solicitar agendamento" não envia nada a servidor: monta a mensagem e abre o WhatsApp. Nada é guardado.
- O mapa do Google só carrega quando a pessoa toca em "Mostrar mapa aqui".
- A linha rosê (`src/components/SpiralLine.tsx`) nasce no glifo do hero, segue as seções marcadas com `data-line` e termina em volta do botão com `data-line-end`.
