# Site da Dra. Jessika Domingues (rascunho)

Odontologia para bebês, crianças e adolescentes em Alfenas - MG.
Vite + React + TypeScript + Tailwind CSS 4 + motion. Página estática, sem backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ já pré-renderizado (HTML pronto para o Google)
npm run preview  # serve o dist/
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**: nome, CRO, WhatsApp, endereço,
horários, links, textos das mensagens do WhatsApp e fotos. Os itens que ainda
precisam de confirmação estão comentados com `CONFIRMAR COM A CLÍNICA`.

- **Ligar/desligar seções:** `CONFIG.secoes` (true/false em cada uma).
- **Cartão "Desenvolvimento dos maxilares":** `CONFIG.mostrarCartaoMaxilares`.
- **Especialidades:** `CONFIG.mostrarEspecialidades = true` só depois de
  comprovado o registro no CRO. Isso também troca "Odontologia infantil" por
  "Odontopediatria" no logo, no hero e no título da página.
- **Nota do Google:** `CONFIG.mostrarNotaGoogle` + `CONFIG.notaGoogle`.
- **Selos "a confirmar":** desligados a pedido (`CONFIG.mostrarMarcadores = false`).
  Os itens sem informação (formação, acessibilidade, estacionamento, pagamento,
  convênios, nome do consultório) foram retirados do site; ver a lista abaixo.

## Fotos e logo

- Originais em `referencias/fotos/`. Versões do site em `public/fotos/`
  (AVIF + WebP, duas larguras cada). Para trocar, gere arquivos com os mesmos
  nomes ou ajuste `CONFIG.fotos`.
- As fotos foram recortadas para mostrar só a doutora: sem a arte do Instagram e
  sem os banners do outro instituto.
- Os blocos "Foto do consultório (substituir)" ficam em
  `src/sections/Estrutura.tsx`.
- Logo: hoje é uma assinatura tipográfica com um traço próprio
  (`src/components/Logo.tsx` e `public/favicon.svg`). Com o logo oficial, troque
  o conteúdo de `Assinatura` por uma `<img>`.
- Imagem de compartilhamento: `public/og.jpg` (1200×630).

## Tirar do modo rascunho

1. `src/config.ts`: `rascunho: false` (some a faixa e os selos "a confirmar"; as
   metas passam a `index, follow`).
2. Apague `public/robots.txt` (ou troque `Disallow: /` por `Allow: /`).
3. Remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
4. Ajuste `CONFIG.siteUrl` para o domínio final e publique de novo.

## Pendências para a clínica confirmar

- Nome do consultório
- CRO-MG 48389 e responsável técnica
- Especialidades registradas no CRO (Odontopediatria; Ortopedia Funcional dos Maxilares)
- Se oferece acompanhamento de ortopedia funcional dos maxilares, e em que termos
- Endereço (R. Gáspar Lopes, 124 - Parque das Nações, 37130-153)
- Horários, inclusive segunda-feira (a ficha do Google mostrou "Dia de Finados")
- Faixa etária atendida
- Se os pais acompanham o atendimento
- Atendimento com hora marcada
- Formação e cursos
- Acessibilidade, estacionamento, formas de pagamento e convênios
- Fotos do consultório e logo oficial
- Se as duas fotos da doutora usadas no site podem ser publicadas
- Se pode mostrar a nota do Google
- Os três compromissos da seção "O consultório"

## Publicar

- **Vercel:** projeto com *Root Directory* `dra-jessika-domingues`
  (o `vercel.json` já define build, saída e o cabeçalho `noindex`).
- **Netlify Drop:** arraste o zip do `dist/` (o `_headers` já vai junto):
  `cd dist && zip -r ../site-dra-jessika-domingues.zip . -x "*.DS_Store"`
