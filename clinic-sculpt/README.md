# Clinic Sculpt | Estética Personalizada (rascunho)

Site de página única da Clinic Sculpt (Clínica Patrícia Caroline), Varginha - MG.
Vite + React + TypeScript + Tailwind CSS 4, estático, sem backend. O HTML é pré-renderizado no build.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (index.html pré-renderizado, _headers, robots.txt, vercel.json)
```

## Onde editar

Tudo fica em `src/config.ts`. Regra: campo vazio (`""`) ou lista vazia (`[]`) não aparece no site;
a seção some e o layout se reorganiza.

| O quê | Campo |
| --- | --- |
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`) |
| Tirar o modo rascunho | `CONFIG.rascunho = false` (remove a faixa e libera a indexação no build) |
| URL pública | `CONFIG.siteUrl` (canonical, og:url, og:image, JSON-LD) |
| Tratamentos | `CONFIG.tratamentos` (acrescente itens; índice, formulário e dúvidas crescem sozinhos) |
| Profissão e registro | `CONFIG.profissionais[0].profissao` e `.registro` (ex.: "Biomédica" e "CRBM nº ...") |
| Responsável técnico | `CONFIG.responsavelTecnico` (nome **e** registro; aparece no rodapé) |
| Logo original | coloque o arquivo em `public/` e preencha `CONFIG.logo` (ex.: `"/logo.svg"`) |
| Horários | `CONFIG.horarios` (o formulário gera os horários a partir daqui) |
| WhatsApp | `CONFIG.whatsapp` (só dígitos, com 55) e `CONFIG.usarWhatsapp` |

### Fotos

As fotos ficam em `public/fotos/` em duas larguras: `nome-560.webp` e `nome-900.webp`.
No config, `src` é o caminho **sem** o sufixo (ex.: `"/fotos/espaco-sala"`).
As imagens originais (prints enviados) estão em `referencias/`.

Para gerar as duas larguras a partir de um JPG/PNG:

```bash
python3 -c "from PIL import Image;import sys;im=Image.open(sys.argv[1]).convert('RGB');[im.resize((w,round(im.height*w/im.width))).save(f'public/fotos/{sys.argv[2]}-{w}.webp',quality=80) for w in (560,900)]" foto.jpg nome
```

## Ao remover o rascunho

1. `CONFIG.rascunho = false` em `src/config.ts`.
2. Em `vercel.json`, apague o bloco do cabeçalho `X-Robots-Tag`.
3. Em `public/robots.txt` e `public/_headers`, o build já reescreve os arquivos de `dist/`; confira o resultado.
4. Novo deploy.

## O que falta para publicar de forma definitiva

- **Profissão e registro profissional** da Patrícia Caroline (conselho e número).
- **Responsável técnico** (nome e registro), se aplicável.
- **Grafia do nome**: o Instagram usa "Patrícia Caroline Manoel"; o WhatsApp, "Patrícia Caroline". Confirmar.
- **Lista real de tratamentos** (hoje: toxina botulínica, tratamentos para a pele, estética corporal).
- **Autorização de uso das fotos**: as fotos do espaço (entrada, recepção, sala) vieram de prints de uma
  publicação atribuída a "Letícia Davanso"; as fotos da profissional vieram do Instagram
  @clinicapatriciacaroline. Confirmar o direito de uso e, se possível, obter os arquivos originais em alta.
- **Logo em alta resolução** (SVG ou PNG): o atual foi recriado a partir de um print (linha vetorizada + texto em Jost).
