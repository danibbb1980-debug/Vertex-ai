# Doctors Odontologia e Saúde — site (rascunho)

Site de página única da Doctors Odontologia e Saúde (Pouso Alegre - MG).
Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies e sem analytics.
O HTML é pré-renderizado no build (abre rápido e funciona antes do JavaScript).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com o HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**. Campo vazio (`''`) ou lista vazia (`[]`) = o bloco não aparece, e o layout se reorganiza.

| O quê | Campo |
|---|---|
| Faixa de rascunho e noindex | `rascunho` |
| Endereço do site (canonical, og:url, og:image) | `siteUrl` |
| WhatsApp, Instagram, endereço, horários | `whatsapp`, `instagram`, `endereco`, `horarios` |
| Atendimentos (cartões, marquee, select do formulário, FAQ) | `atendimentos` |
| Fotos do espaço | `fotos.destaque`, `fotos.ambiente` |
| Profissionais | `equipe` |
| Responsável técnico | `responsavelTecnico` |
| Ligar/desligar seções | `secoes` |
| Formulário de agendamento | `agendamento` |

### Ligar/desligar seções
Em `CONFIG.secoes`, troque `true` por `false`. Os links do menu somem junto.

### Adicionar dentistas e CRO
A lista `equipe` já tem os nomes que aparecem nas artes do Instagram. **Um profissional só aparece no site quando o campo `cro` estiver preenchido.**
Exemplo: `{ nome: 'Dra. Fulana', atuacao: 'Ortodontia', cro: 'MG-00000', foto: '/fotos/equipe/fulana.webp' }`.
Use "Especialista em…" somente com registro de especialidade no CFO (campo `registroEspecialidade`).

### Responsável técnico
Preencha `responsavelTecnico.nome` e `responsavelTecnico.cro`. Eles aparecem no rodapé e no JSON-LD.

### Fotos
Coloque o arquivo em `public/fotos/` com duas versões (`nome.webp` e `nome.jpg`) e adicione em `fotos.ambiente` com `src: '/fotos/nome'` (sem extensão), `alt`, `legenda`, `largura` e `altura`.
As fotos atuais (recepção, consultório, sala e fachada) foram recortadas de capturas de tela do celular; os originais recortados estão em `referencias/fotos/`. A fachada fica em `fotos.fachada` e aparece na seção de contato. Fotos tiradas direto da câmera, com pelo menos 1600 px, vão deixar o resultado mais nítido.

### Desligar o rascunho (publicação definitiva)
1. `rascunho: false` em `src/config.ts` (tira a faixa e muda as metas para `index, follow`).
2. Apague `public/robots.txt` ou troque por `Allow: /`.
3. Remova a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
4. Atualize `siteUrl` para o domínio final.

## O que falta para publicar de forma definitiva
- **Responsável técnico com CRO** (exigência do CFO para publicidade odontológica).
- **CRO de cada profissional** antes de exibir a equipe.
- **Testar o WhatsApp**: o número `553597191553` foi copiado do link da bio da clínica e tem 8 dígitos depois do DDD. Envie uma mensagem de teste; se não abrir conversa, peça o número correto à clínica.
- **Fotos** em boa resolução do espaço (e da equipe, se desejado).
- **Logo em alta qualidade** (PNG transparente ou SVG). O arquivo atual tem 222 × 223 px; o fundo foi removido para o site, mas um original vetorial deixa o logo nítido.

## Arquivos de referência
- `referencias/logo-doctors.jpg`: logo original enviado.
- `referencias/fotos/`: fotos do espaço usadas no site (recortes sem a interface do celular).
- `referencias/instagram-equipe/`: artes do Instagram com a equipe. **Não usadas no site**: são artes de campanha com selos de "especialistas" e títulos de especialidade sem registro informado, e o briefing pede para não copiar artes do Instagram. Serviram só para preencher os nomes em `equipe`.

## Privacidade
O formulário "Solicitar agendamento" só monta uma mensagem e abre o WhatsApp (`wa.me`). Nada é enviado a servidor nem salvo no navegador. O mapa do Google só carrega se a pessoa clicar em "Carregar mapa". Detalhes em `public/privacidade.html`.
