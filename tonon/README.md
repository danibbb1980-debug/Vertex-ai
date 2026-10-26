# Laboratório Tonon · site (rascunho)

Página única para pacientes, focada em agendar avaliação pelo WhatsApp.
Vite · React · TypeScript · Tailwind 4 · motion. Estático, HTML pré-renderizado.
O briefing completo do site está em `PROMPT.md`.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
```

## Editar

Tudo em **`src/config.ts`**: contatos, endereço, horários, áreas, passos,
atributos do espaço, fotos e casos. Itens pendentes têm o comentário
`CONFIRMAR COM O CLIENTE`.

- **Fotos**: `public/fotos/` (WebP). Para trocar, mantenha o nome do arquivo
  ou ajuste o caminho no `config.ts`.
- **Casos (antes e depois)**: `mostrarCasos: false` remove a seção inteira.
- **Logo**: a enviada (`referencias/logo-tonon-96px.png`) tem 96 px; o site usa
  uma assinatura em texto até chegar a versão vetorial ou em alta.

## Desligar o rascunho (ao publicar)

1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
2. `public/robots.txt`: `Allow: /`.
3. `vercel.json`: apagar o cabeçalho `X-Robots-Tag`.
4. `public/privacidade.html` e `public/404.html`: remover a faixa e as metas robots.

## O que o cliente precisa confirmar

- [ ] Registro do Matheus: CRO (cirurgião-dentista) ou TPD. **Importante:** técnico
      em prótese não pode atender paciente diretamente (Lei 6.710/1979). Se for TPD,
      o site precisa indicar o cirurgião-dentista que faz a avaliação.
- [ ] Responsável técnico com CRO-SP (rodapé)
- [ ] Autorização assinada (TCLE) dos 3 pacientes dos casos e quem assina os casos (CFO, Res. 196/2019)
- [ ] Serviços específicos a listar (lentes, facetas, coroas, protocolos...)
- [ ] Fotos em alta resolução (as atuais têm 200–500 px) e logo em vetor
- [ ] Atributo "empresa de empreendedoras" da ficha do Google (não usado)
- [ ] Domínio final
