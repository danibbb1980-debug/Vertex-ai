# Site Dra. Isabella Dias (rascunho)

Página única estática: Vite, React, TypeScript, Tailwind e `motion`. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve dist/
```

## Onde editar

Todos os dados ficam em `src/config.ts`. Campo vazio = bloco não aparece.

| O quê | Campo |
| --- | --- |
| Tirar o modo rascunho (faixa + noindex nas metas) | `rascunho: false`, e depois apagar `public/robots.txt` (ou trocar por `Allow: /`), `public/_headers` e o bloco `X-Robots-Tag` do `vercel.json` |
| URL definitiva (canonical, og:url, og:image) | `siteUrl` |
| Ligar/desligar seções | `secoes` |
| Atendimentos | `atendimentos` (cada item tem `ativo`); novos itens entram no índice, nas dúvidas e no formulário |
| Especialidade com registro | `especialidade` e `rqe` |
| Responsável técnico (rodapé) | `responsavelTecnico` |
| Tempo de atuação | `anosAtuacao` (0 = não exibe) |
| Fotos da profissional | `fotos.retrato` / `fotos.consultorio` (`null` oculta). Arquivos em `public/fotos/`, com versões `-560` e `-320` para telas menores |
| Registros clínicos | `casos` (lista vazia oculta a seção). Arquivos em `public/casos/` |
| Logotipo | `logo`. Os arquivos em `public/marca/` são máscaras brancas com transparência, coloridas por CSS; para trocar, substitua por versões do arquivo original em alta resolução, no mesmo formato |

### WhatsApp

O agendamento pelo WhatsApp está **ligado** com o número (19) 3892-3894 (`551938923894`), o mesmo do telefone fixo, usado no WhatsApp Business da clínica:
os botões abrem o WhatsApp (com "Ligar" como opção secundária) e a seção "Solicitar agendamento" (`#agendar`) aparece.
O formulário só monta a mensagem e abre `wa.me`; nada é enviado a servidor nem guardado no navegador.

- Outro número: troque `WHATSAPP_PADRAO` em `src/config.ts` (só dígitos, com 55 e DDD).
- Desligar o WhatsApp (tudo volta a "Ligar para agendar" e o formulário some): `WHATSAPP_PADRAO = ""`, ou `VITE_WHATSAPP=off npm run build`.

## Origem dos arquivos

`referencias/` guarda as capturas originais enviadas e os recortes:

- logotipo extraído da arte "Dra Isabella Dias · Cirurgiã-dentista · CRO-SP 89.630";
- duas fotos da profissional;
- sete registros clínicos (antes e depois), recortados sem a interface do celular nem a faixa com telefone.

## Falta confirmar antes da publicação definitiva

1. **CRO**: o logotipo traz "CRO-SP 89.630"; o texto usa "CRO-SP 89630". Confirmar o número.
2. **Especialidade**: a formação aparece só como "Pós-graduação em Implantes e Harmonização Orofacial (HOF)". Se houver registro de especialidade no CRO, preencher `especialidade` e `rqe`. HOF está desativada em `atendimentos` até comprovação do registro.
3. **20 anos de atuação**: dado divulgado no Instagram, confirmar com a profissional.
4. **Registros clínicos (antes e depois)**: entraram a pedido. A publicação exige termo de consentimento por escrito de cada paciente e caráter educativo (Res. CFO 196/2019). Sem esses termos, desligue `secoes.casos`.
5. **Fotos**: confirmar autorização de uso das duas fotos da profissional.
6. **Logotipo**: o atual foi extraído de uma captura de tela. Pedir o arquivo original (vetor ou PNG grande).
7. **Lista real de procedimentos**.
8. **WhatsApp**: confirmar que (19) 3892-3894 recebe mensagens pelo WhatsApp Business.
