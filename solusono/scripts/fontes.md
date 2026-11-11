# Fontes

As fontes em `src/fontes/` saem dos pacotes npm `@fontsource-variable/newsreader` e
`@fontsource/schibsted-grotesk`, recortadas com fontTools para ficarem leves:

- Newsreader (normal e itálico): eixo de peso limitado a 250–400, tamanho óptico fixo em 60 (ótica de display).
- Schibsted Grotesk 400 e 600.
- Caracteres: latim básico, Latin-1 (acentos do português), aspas, travessões e reticências.

```bash
pip install fonttools brotli
```

Em Python:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
U = list(range(0x20, 0x7f)) + list(range(0xa0, 0x100)) + [0x152, 0x153, 0x2013, 0x2014, 0x2018, 0x2019, 0x201a, 0x201c, 0x201d, 0x201e, 0x2022, 0x2026]
f = instancer.instantiateVariableFont(TTFont("node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2"), {"wght": (250, 400), "opsz": 60})
o = subset.Options(); o.flavor = "woff2"
s = subset.Subsetter(o); s.populate(unicodes=U); s.subset(f)
f.flavor = "woff2"; f.save("src/fontes/newsreader.woff2")
```

Repita para o itálico (`newsreader-latin-opsz-italic.woff2`) e, sem o `instancer`, para os arquivos da Schibsted Grotesk.
