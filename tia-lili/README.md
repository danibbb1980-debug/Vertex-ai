# Site da Dra. Liliane Ormeneze (Tia Lili): rascunho

Página única para a odontologia de bebês, crianças e adolescentes da Dra. Liliane Ormeneze (Tia Lili), em Poços de Caldas - MG.
O objetivo é gerar agendamentos de avaliação pelo WhatsApp.

Vite + Preact (API do React) + TypeScript + Tailwind CSS 4. O site é estático, sem backend, sem analytics e sem formulário.
O HTML sai pré-renderizado no build, o que ajuda no SEO e deixa a página abrir mais rápido.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (checa tipos, faz o build e pré-renderiza o HTML)
npm run preview    # serve dist/ em http://localhost:4173
```

## Onde editar

**Todos os dados ficam em `src/config.ts`**: nome, CRO, WhatsApp, endereço, horários, formas de pagamento, mensagens do WhatsApp, URL do site e fotos.
O que ainda precisa de confirmação aparece no site como um selo tracejado `[A CONFIRMAR]` e, no código, com o comentário `CONFIRMAR COM A CLÍNICA`.

### Ligar e desligar seções

Use `CONFIG.secoes` (cada seção é `true` ou `false`). Para uma versão curta, desligue `faixa`, `paraOsPais`, `estrutura` e `duvidas`.

Algumas seções também dependem de outras chaves:

| Seção | Como ligar | Padrão |
|---|---|---|
| Sedação | `mostrarSedacao: true` | desligada |
| Atendimento hospitalar | `mostrarHospitalar: true` | desligada |
| Nota do Google | `mostrarNotaGoogle: true` e `notaGoogle.nota` preenchida | desligada |
| Especialidade no título e no cartão da doutora | `mostrarEspecialidades: true` e `especialidade` preenchida | desligada |

Ligue sedação, hospitalar e especialidade **somente depois que a doutora comprovar** o registro e a habilitação no CRO. É uma exigência do CFO.

### Trocar fotos e logo

1. Coloque as fotos em `referencias/fotos/`, com os mesmos nomes (`doutora`, `recepcao`, `consultorio`, `fachada`) em `.jpg`, `.png` ou `.webp`. Use só fotos sem pacientes.
2. Para trocar o logo, substitua `referencias/logo-transparente.png` (fundo transparente).
3. Rode `npm run imagens`. O script gera as versões AVIF/WebP em `public/fotos/`, o logo em `public/marca/`, os favicons e a imagem de compartilhamento `public/og.jpg`.
4. Para mudar os textos alternativos das fotos, edite `CONFIG.fotos`.

As fotos atuais foram recortadas de prints do Instagram da doutora (os prints estão em `referencias/originais/`). Uma foto da mesa com material didático **ficou de fora de propósito**, porque mostrava fotos de bocas e dentes, o que as regras de publicidade do CFO não permitem. Fotos originais em alta resolução vão deixar o site mais nítido.

### Tirar do modo rascunho (publicar de verdade)

O rascunho bloqueia o Google em três camadas. Para publicar, desfaça as quatro coisas abaixo:

1. Em `src/config.ts`: `rascunho: false` (some a faixa e as metas `noindex`) e `siteUrl` com o domínio final.
2. Em `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. Em `public/_headers`: apague a linha `X-Robots-Tag: noindex, nofollow`.
4. Em `vercel.json`: apague o cabeçalho `X-Robots-Tag`.

Também tire a linha "noindex" de `public/privacidade.html` e `public/404.html`. Depois, rode `npm run build` e publique de novo.

## Publicação

- **Vercel**: projeto `tia-lili-rascunho-v2`. O `vercel.json` já define o framework (Vite), o build e os cabeçalhos.
- **Plano B (Netlify Drop)**: rode `npm run build` e depois `cd dist && zip -r ../site-tia-lili.zip . -x "*.DS_Store"`. Arraste o zip em https://app.netlify.com/drop. O `_headers` vai junto.

## O que a clínica precisa confirmar

- [ ] Número do **CRO-MG** da doutora (aparece no hero, no cartão da profissional e no rodapé como responsável técnica).
- [ ] **Especialidade registrada no CRO** (odontopediatria). Até lá, o site diz "odontologia para bebês, crianças e adolescentes" e não usa "especialista". O **logo** traz a palavra "Odontopediatra". Se a especialidade não estiver registrada, o logo também precisa ser revisto.
- [ ] **Habilitação em sedação medicamentosa e óxido nitroso** (está na bio do Instagram). A seção fica desligada até a comprovação.
- [ ] **Atendimento hospitalar** (está na bio do Instagram). A seção fica desligada até a comprovação.
- [ ] **Nome do consultório**, se houver.
- [ ] **Horários**, inclusive a **segunda-feira**: a ficha do Google mostrou "Dia de Finados", e foi usado 08h–12h e 14h–18h.
- [ ] **Endereço** (R. Paraíba, 356 - Centro, 37701-022).
- [ ] **Faixa etária atendida** (a bio diz bebês, crianças e adolescentes).
- [ ] Se **os pais acompanham o atendimento** e como isso funciona.
- [ ] Os três **pilares** da seção "O consultório" (Acolhimento, Explicação clara aos pais, Cuidado em cada fase), que foram escritos como proposta.
- [ ] **Formação e trajetória** da doutora (só o que ela informar e puder comprovar).
- [ ] **Fotos** originais em alta resolução (consultório, recepção, fachada e retrato), sem pacientes.
- [ ] **Logo** em arquivo original (vetor ou PNG grande).
- [ ] Se pode mostrar a **nota do Google** (só a nota e o link, sem depoimentos).

## Regras que o site segue (CFO)

Não há promessa de resultado, "sem dor", "indolor", "sem trauma", superlativos, preços, descontos, parcelamento, depoimentos, antes e depois nem imagens de pacientes.
A especialidade e as habilitações só aparecem se forem comprovadas, e o CRO fica visível junto ao nome.
O mapa do Google só carrega quando a pessoa clica, e não há cookies próprios.

## Créditos de componentes

- Revelação de texto do hero: adaptada do componente "Text Reveal" do 21st.dev (@kuratlielia), sem blur e com suporte a uma palavra em ênfase.
- Linha de assinatura, cartões com luz, marquee, linha do tempo, acordeão e botão magnético: escritos para este projeto, a partir de referências encontradas no 21st.dev (Svg follow scroll, Line Draw SVG, Spotlight, Marquee, Animated Progress Stepper, FAQ Accordion Reveal, Magnetic Button).
