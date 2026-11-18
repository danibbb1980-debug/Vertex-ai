"""Gera Newsreader enxuta: só peso 400 (eixo opsz mantido) e caracteres latinos.
Uso: python3 scripts/subset-fontes.py  (pip install fonttools brotli)"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

R = Path(__file__).resolve().parent.parent
SRC = R / "node_modules/@fontsource-variable/newsreader/files"
OUT = R / "src/fonts"
OUT.mkdir(exist_ok=True)
chars = "".join(chr(c) for c in range(0x20, 0x7F)) + "ÀÁÂÃÇÉÊÍÓÔÕÚÜàáâãçéêíóôõúü·–—‘’“”…ºª°"
for estilo in ("normal", "italic"):
    f = TTFont(str(SRC / f"newsreader-latin-opsz-{estilo}.woff2"))
    f = instancer.instantiateVariableFont(f, {"wght": 400})
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "lnum", "tnum", "pnum", "onum"]
    opts.name_IDs = ["*"]
    s = subset.Subsetter(opts)
    s.populate(text=chars)
    s.subset(f)
    dest = OUT / f"newsreader-{estilo}.woff2"
    f.flavor = "woff2"
    f.save(str(dest))
    print(dest.name, dest.stat().st_size)
