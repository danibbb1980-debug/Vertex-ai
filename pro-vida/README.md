# Instituto Médico Pró Vida · site (rascunho)

Página única, curta, focada em agendar pelo WhatsApp.
Vite · React · TypeScript · Tailwind 4 · motion. Estático, sem backend.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/ (HTML já pré-renderizado)
```

## Editar dados

Tudo fica em **`src/config.ts`**: endereço, horários, WhatsApp, áreas,
profissionais, responsáveis técnicos, Instagram, Maps e URL do site.
Cada item ainda não validado tem o comentário `CONFIRMAR COM A CLÍNICA`.

- **WhatsApp**: `whatsapp` só com números (55 + DDD + número).
- **Profissionais**: troque `registro` (ex.: `CRM-SP 000000`). Para foto, salve
  em `public/fotos/nome.webp` e preencha `foto: '/fotos/nome.webp'`.
  Sem foto, aparecem as iniciais.
- **Nota do Google**: `mostrarNotaGoogle: true` mostra só a nota e o link do Maps.

## Fotos e logo

- **Logo**: `public/logo-pro-vida.webp` (logo original da clínica, só com a
  margem branca recortada). Original em `referencias/logo-pro-vida.png`.
  Para trocar, substitua o arquivo mantendo o nome.
- **Foto do hero**: hoje é um bloco gráfico com a legenda "Foto da clínica
  (substituir)". Para usar uma foto real (fachada ou recepção), troque o
  componente `FotoReservada` em `src/App.tsx` por um `<img>` em WebP.
  Não use fotos de pacientes nem do Google/Instagram sem autorização.

## Desligar o rascunho (ao publicar)

1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers`: apague a linha `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: remova a faixa `.faixa` e as
   metas `robots`/`googlebot`.
5. `npm run build` e publique `dist/`.

## Publicar no Netlify Drop

```bash
npm run build
cd dist && zip -r ../site-pro-vida-rascunho.zip . -x "*.DS_Store"
```

Arraste o zip em https://app.netlify.com/drop (o `index.html` fica na raiz).

## O que a clínica precisa confirmar

- [ ] Diretor técnico médico: nome e CRM-SP
- [ ] Responsável técnico odontológico: nome e CRO-SP
- [ ] Profissionais: nomes, áreas e CRM/CRO (e RQE, se houver)
- [ ] Se há outros profissionais a incluir
- [ ] Áreas de atendimento (as seis da ficha do Google)
- [ ] Horários (segunda-feira inclusa) e endereço com CEP
- [ ] Se o (19) 3631-1819 recebe WhatsApp
- [ ] Fotos autorizadas (fachada, recepção, profissionais)
- [ ] Logo em alta resolução (a atual tem 150 px)
- [ ] Se pode mostrar a nota do Google
- [ ] Domínio final e canal de contato para LGPD

**Observação**: posts antigos do Instagram (marca "Essencialis") mostram
registros que podem agilizar a confirmação: Dr. Márcio A. Pennacchi
(CRM-SP 130.886), Dr. Gutemberg Adrian Oliveira (CRM-SP 92162) e um
neurocirurgião, Dr. João Buçard (CRM-SP 196.920), que não está na ficha do
Google. Nada disso foi colocado no site até a clínica confirmar.

## Créditos

- Entrada do título: adaptado de "Text Reveal" (21st.dev · @kuratlielia).
- Revelação dos cartões: escrita com motion, inspirada em "Stagger Reveal Grid"
  (21st.dev · @pulkitxm).
