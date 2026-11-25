"""Reduz as fontes: fixa o peso (400 na serifa; 400-600 na sans) e mantém só os caracteres do português.
Uso: python3 scripts/subset-fontes.py (requer fonttools e brotli)"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

raiz = Path(__file__).resolve().parent.parent
nm = raiz / 'node_modules'
unicodes = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2016, 0x00B7, 0x20AC]
fontes = [
    (nm / '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2', 'newsreader-normal.woff2', {'wght': 400}),
    (nm / '@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2', 'newsreader-italic.woff2', {'wght': 400}),
    (nm / '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2', 'hanken-grotesk.woff2', None),
]
destino = raiz / 'public' / 'fonts'
for origem, nome, eixos in fontes:
    f = TTFont(origem)
    if eixos:
        f = instancer.instantiateVariableFont(f, eixos)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'onum', 'lnum', 'tnum', 'pnum']
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=unicodes)
    s.subset(f)
    f.flavor = 'woff2'
    f.save(destino / nome)
    print(nome, (destino / nome).stat().st_size // 1024, 'KB')
