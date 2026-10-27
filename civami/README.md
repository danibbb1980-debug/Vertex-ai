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
| Atendimentos | `atendimentos` (área, título, descrição e profissional) |
| Profissionais | `profissionais` (nome, categoria, especialidade, bio, foto e `registro` CRO/CRM) |
| Estacionamento, acessibilidade, pagamento | `estrutura` |
| Responsáveis técnicos (CRO e CRM) | `responsaveisTecnicos` (vazio = bloco não aparece no rodapé) |
| Nota do Google | `mostrarNotaGoogle` + `notaGoogle` (desligada por padrão; sem depoimentos) |
| Ligar/desligar seções | `secoes` |
| URL final (canonical, og:url, og:image) | `siteUrl` |

O que não foi informado pela clínica simplesmente não aparece no site (não há placeholders).

### Incluir o registro de um profissional

```ts
{ nome: 'Dra. Mirian Aquino', categoria: 'Cirurgiã-dentista', registro: 'CRO-MG 00000', ... }
```

O registro aparece no cartão da equipe e no rodapé.

### Versão curta

Em `secoes`, troque para `false` o que não quiser exibir (ex.: `paraQuem`, `compromissos`, `estrutura`, `faixa`).
O link do menu some junto com a seção.

## Fotos e logo

- Foto da equipe: `public/fotos/equipe-civami-{480,720,960,1170}.{avif,webp}`. Para trocar, gere os mesmos
  tamanhos e ajuste `fotos.equipe` em `config.ts`.
- Retratos dos profissionais: `public/fotos/{mirian-aquino,vanessa-aquino,cicero}-{360,600}.{avif,webp}`,
  recortados das apresentações no Instagram da clínica.
- Foto do espaço: coloque o arquivo em `public/fotos/` e preencha `fotos.espaco` (`src` e `alt`); ela aparece
  na seção "Estrutura e conforto".
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

## Pendências antes da versão final

Informado pela clínica (Instagram e ficha do Google) e já no site: profissionais e especialidades, atendimentos,
horários, estacionamento, acessibilidade e formas de pagamento.

Ainda falta, e é **exigido pelo CFO e pelo CFM** em publicidade de saúde:

- [ ] Número do **CRO-MG** da Dra. Mirian Aquino e da Dra. Vanessa Aquino, e do **CRM-MG** do Dr. Cicero
      (com o sobrenome completo dele)
- [ ] Registro de especialista no CRO (implantodontia, ortodontia) e **RQE** de dermatologia
- [ ] Responsável técnico odontológico (nome + CRO) e diretor técnico médico (nome + CRM), para o rodapé

Opcional: fotos do espaço, logo em PNG/SVG de alta resolução e a nota do Google (só a nota, sem depoimentos).

Ficou de fora de propósito: "performance", "longevidade" e "medicina regenerativa", citados no post do
Dr. Cicero. O CFM restringe a divulgação desses temas; o site fala em "cuidado com feridas" e "emagrecimento".

## Regras de conteúdo (CFO e CFM)

Sem promessa de resultado, superlativos ("o melhor", "referência", "excelência"…), antes e depois, fotos de
pacientes, depoimentos, preços, promoções ou parcelamento. CRO/CRM junto ao nome de cada profissional;
especialidade só com registro (CRO) ou RQE (CRM). O rodapé deve identificar os responsáveis técnicos.

## Créditos técnicos

- Fontes: Fraunces (recortada para latin, pesos 300–500) e Manrope, ambas OFL, servidas pelo próprio site.
- Padrões de interação inspirados em componentes do 21st.dev (revelação de texto, abas com indicador
  deslizante, cartão com luz, botão magnético, linha do tempo com progresso, faixa de texto), reescritos em
  CSS e JavaScript nativo para manter o site leve.
