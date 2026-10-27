# CIVAMI Clínica de Saúde: site (rascunho)

Site de página única da CIVAMI Clínica de Saúde, em Alfenas - MG.
Vite + React + TypeScript + Tailwind CSS 4, estático e pré-renderizado no build.
Sem backend, sem formulário, sem analytics: o contato é só pelo WhatsApp.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview  # serve o dist/ em http://localhost:4173
npm run zip      # cria site-civami.zip a partir do dist/ (index.html na raiz)
```

## Onde editar

Quase tudo fica em **`src/config.ts`**:

| O quê | Campo |
|---|---|
| WhatsApp, Instagram, Maps, endereço | `whatsapp`, `instagram`, `mapsUrl`, `endereco` |
| Horários (inclui a pausa de almoço) | `horarios` (`confirmar: true` mostra o selo "Confirmar") |
| Mensagens prontas do WhatsApp | `mensagens` |
| Atendimentos | `atendimentos` (vazio = mostra os exemplos marcados `[A CONFIRMAR COM A CLÍNICA]`) |
| Profissionais | `profissionais` (vazio = mostra cartões de exemplo) |
| Responsáveis técnicos (CRO e CRM) | `responsaveisTecnicos` |
| Nota do Google | `mostrarNotaGoogle` + `notaGoogle` (desligada por padrão; sem depoimentos) |
| Ligar/desligar seções | `secoes` |
| URL final (canonical, og:url, og:image) | `siteUrl` |

### Preencher atendimentos

```ts
atendimentos: [
  { area: 'odontologia', titulo: 'Ortodontia', descricao: 'Texto educativo curto, sem promessa.' },
  { area: 'medicina', titulo: 'Clínica médica', descricao: '...' },
],
```

Assim que a lista tiver um item, os exemplos deixam de aparecer.

### Preencher a equipe

```ts
profissionais: [
  { nome: 'Dra. Nome Sobrenome', categoria: 'Cirurgiã-dentista', registro: 'CRO-MG 00000',
    especialidade: 'Ortodontia (registro no CRO)', foto: '/fotos/nome.webp' },
  { nome: 'Dr. Nome Sobrenome', categoria: 'Médico', registro: 'CRM-MG 00000',
    especialidade: 'Clínica médica, RQE 0000' },
],
```

Só informe especialidade com registro no CRO (odontologia) ou RQE (medicina).

### Versão curta

Em `secoes`, troque para `false` o que não quiser exibir (ex.: `paraQuem`, `compromissos`, `estrutura`, `faixa`).
O link do menu some junto com a seção.

## Fotos e logo

- Foto da equipe: `public/fotos/equipe-civami-{480,720,960,1170}.{avif,webp}`. Para trocar, gere os mesmos
  tamanhos e ajuste `fotos.equipe` em `config.ts`.
- Foto do espaço: coloque o arquivo em `public/fotos/` e preencha `fotos.espaco` (`src` e `alt`). Sem ela,
  aparece o bloco "Foto da clínica (substituir)".
- Logo: `public/brand/` (`civami-simbolo.png` no topo, `logo-civami.png` no rodapé, `logo-civami-original.jpg`
  é o arquivo recebido). O logo veio em JPG de 150 px; **um PNG ou SVG em alta resolução melhora muito o
  resultado** no topo e no rodapé.
- Imagem de compartilhamento: `public/og-civami.jpg` (1200×630).

## Desligar o modo rascunho (publicação final)

1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /` e adicione `Sitemap:` se criar um.
3. `public/_headers` e `vercel.json`: remova as linhas `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: mantenha o `noindex` só no 404; tire a faixa de rascunho da
   página de privacidade.
5. `npm run build` e publique de novo.

## O que a clínica precisa confirmar

- [ ] Lista de atendimentos de **odontologia** (e quais especialidades têm registro no CRO)
- [ ] Lista de atendimentos de **medicina** (e quais especialidades têm RQE)
- [ ] Profissionais: nome, categoria, **CRO-MG / CRM-MG**, especialidade/RQE e foto (opcional)
- [ ] Responsável técnico odontológico (nome + CRO) e diretor técnico médico (nome + CRM)
- [ ] Endereço (R. Bias Fortes, 722 - Centro, Alfenas - MG, 37130-085)
- [ ] Horários, **inclusive segunda-feira** (a ficha do Google mostrava "Dia de Finados")
- [ ] Faixa etária atendida
- [ ] Formas de pagamento e convênios
- [ ] Estacionamento e acessibilidade
- [ ] Fotos do espaço da clínica
- [ ] Autorização de uso da foto da equipe no site (e se os nomes podem aparecer)
- [ ] Logo em PNG/SVG de alta resolução
- [ ] Se a nota do Google pode ser exibida (só a nota, sem depoimentos)
- [ ] Compromissos de atendimento (texto marcado "[A VALIDAR COM A CLÍNICA]")
- [ ] Encarregado(a) de dados (LGPD), citado na página de privacidade

## Regras de conteúdo (CFO e CFM)

Sem promessa de resultado, superlativos ("o melhor", "referência", "excelência"…), antes e depois, fotos de
pacientes, depoimentos, preços, promoções ou parcelamento. CRO/CRM junto ao nome de cada profissional;
especialidade só com registro (CRO) ou RQE (CRM). O rodapé deve identificar os responsáveis técnicos.

## Créditos técnicos

- Fontes: Fraunces (recortada para latin, pesos 300–500) e Manrope, ambas OFL, servidas pelo próprio site.
- Padrões de interação inspirados em componentes do 21st.dev (revelação de texto, abas com indicador
  deslizante, cartão com luz, botão magnético, linha do tempo com progresso, faixa de texto), reescritos em
  CSS e JavaScript nativo para manter o site leve.
