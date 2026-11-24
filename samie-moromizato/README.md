# Samie Moromizato · rascunho do site

Vite + React + TypeScript, estático, sem backend. O HTML é pré-renderizado no build
(o conteúdo existe sem JavaScript). Projeto Vercel: `samie-moromizato-rascunho`.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML pré-renderizado + CSS inline)
npm run preview  # serve dist/
```

## Editar o conteúdo: `src/config.ts`

Tudo vem de `src/config.ts`. Campo vazio (`""`, `null`, `[]`) ou `ativo: false` = o bloco não aparece.

| O que | Onde |
| --- | --- |
| Ligar/desligar seções | `secoes.*` (`true`/`false`) |
| Ligar um atendimento | `atendimentos[i].ativo = true` e preencher `descricao` (geral, sem promessa) |
| WhatsApp | preencher `whatsapp` (só dígitos, com 55) e `usarWhatsapp = true`. Os botões passam a abrir o WhatsApp, "Ligar" vira secundário e a seção **Solicitar agendamento** (#agendar) aparece |
| Abertura (intro) | `intro` (padrão `false`; ainda não implementada visualmente, a assinatura do hero já cumpre o papel) |
| Método / tempo de atuação | `metodo` (`""` some) e `desde` (`null` some) |
| Fotos | `fotos.retrato`, `fotos.mesa`, `fotos.fachada` (`null` some) e `fotos.espaco` (lista). Arquivos em `public/fotos/{nome}-640.webp` e `-1100.webp`; originais em `referencias/fotos/` |
| Logo | trocar `public/logo.png` (e `logo.largura/altura` no config) |
| Faixa de rascunho | `rascunho = false` (lembre de também retirar o noindex: `public/robots.txt`, `public/_headers`, `vercel.json` e as páginas `public/privacidade.html` / `404.html`) |
| URL do site | `siteUrl` (usado em canonical, og:url, og:image e JSON-LD) |

## Pendências antes de publicar de forma definitiva

1. **Fotos**: as 10 fotos vieram de capturas do Instagram/Google (recortadas). Confirmar a
   autorização da Samie. **Duas delas (`cesto`, `sala`) foram publicadas por uma cliente numa
   avaliação do Google** (`origem: "cliente"` no config): pedir autorização ou removê-las.
   Ideal: receber os arquivos originais em alta resolução (as capturas têm ~1170 px de largura).
2. **WhatsApp**: confirmado que (19) 3713-5233 tem WhatsApp; `usarWhatsapp = true`.
3. **Método INTEGRAR©**: confirmar o uso do nome e do símbolo ©.
4. **"Desde 2011"**: o perfil traz números que não batem entre si (anos de atuação, número de clientes). Confirmar.
5. **Atendimentos anunciáveis**: cuidados capilares, laser e luz intensa pulsada estão desligados. Ligar só com confirmação e descrição dela.
6. **Área para profissionais da estética** (mentoria): perguntar se ela quer, com as palavras e a oferta dela.
7. **Logo em alta resolução** (vetor ou PNG grande com fundo transparente): o atual foi recortado de uma captura.
