"""Gera src/fonts/newsreader-300-opsz-*.woff2: Newsreader com peso fixo 300,
eixo de tamanho óptico (opsz) preservado e subconjunto Latin-1 (pt-BR).
Uso: pip install fonttools brotli && python3 -I scripts/fontes.py
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC = 'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-%s.woff2'
UNI = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2022]
for st in ('normal', 'italic'):
    f = instancer.instantiateVariableFont(TTFont(SRC % st), {'wght': 300})
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'lnum', 'tnum', 'onum', 'pnum', 'calt', 'ccmp', 'locl', 'mark', 'mkmk']
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNI)
    s.subset(f)
    f.flavor = 'woff2'
    out = f'src/fonts/newsreader-300-opsz-{st}.woff2'
    f.save(out)
    print(out, os.path.getsize(out))
