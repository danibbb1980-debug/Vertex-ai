# Odontologia Estética · Dr. André Totti & Dr. Douglas Barbosa (rascunho)

Site de página única do consultório em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4, estático e pré-renderizado no build, sem backend.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Editar o conteúdo: `src/config.ts`

Todos os dados estão nesse arquivo. **Campo vazio ou ausente não aparece no site**: a seção ou o cartão é omitido e o layout se reorganiza.

| O que | Onde |
|---|---|
| Ligar/desligar seções | `secoes` (`true`/`false`) |
| Faixa e noindex de rascunho | `rascunho` (veja "Publicação definitiva") |
| CRO, foto e formação dos dentistas | `profissionais[i].cro`, `.foto`, `.formacao`. Com o CRO preenchido aparecem os cartões individuais, o CRO no rodapé e no JSON-LD |
| Fotos do consultório | `fotosConsultorio` (arquivos em `public/img/`) |
| Fotos dos dentistas | `fotosEquipe` (exibidas **sem nome**, ver pendências) |
| Atendimentos | `atendimentos` |
| Horários | `horarios` (0 = domingo). Aceita `almoco: { inicio, fim }`; o formulário exclui esse intervalo |
| Sedação | `mostrarSedacao`: **ligue só com habilitação comprovada**. Desligada, a palavra não aparece no site |
| Faixa de acolhimento | `mostrarAcolhimento` |
| Aviso de urgência no formulário | `urgencia` (só se a clínica fizer pronto atendimento) |

As fotos originais (miniaturas do Google) ficam em `referencias/fotos/` e o logo em `referencias/`.

## Pendências para confirmar com a clínica

- **A quem pertence cada WhatsApp**: (35) 98877-5060 (`whatsapp`, usado em todos os botões) e (35) 99972-3296 (`whatsapp2`). Hoje aparecem sem nome de pessoa.
- **Quem é quem nas fotos da equipe**: as fotos não têm nome associado. Depois de confirmar, mova cada foto para `profissionais[i].foto`.
- **CRO de cada dentista** (exigência do CFO para publicidade).
- Formação dos dentistas, se quiserem exibir.
- Sedação: só com comprovação de habilitação.

## Publicação definitiva

1. Preencha o CRO de cada dentista.
2. Troque as fotos por versões em alta resolução (as atuais têm ~200 px e foram ampliadas).
3. Envie o logo em PNG/SVG com fundo transparente (o atual é um JPG de 150 px).
4. Em `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
5. Remova o noindex: apague o `X-Robots-Tag` de `vercel.json` e de `public/_headers`, e troque `public/robots.txt` por `User-agent: *` / `Allow: /`.

## Privacidade

O formulário "Solicitar agendamento" só monta uma mensagem e abre o WhatsApp. Nada é enviado a servidores nem salvo no navegador; não há cookies nem analytics. Ver `public/privacidade.html`.
