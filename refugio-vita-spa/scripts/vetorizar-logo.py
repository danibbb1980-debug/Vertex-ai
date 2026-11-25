"""Vetoriza o logo a partir do JPG (traçando o dourado sobre o verde) e gera SVGs sem fundo.
Uso: pip install potracer pillow numpy && python3 scripts/vetorizar-logo.py"""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import potrace

raiz = Path(__file__).resolve().parent.parent
ESCALA = 4
im = Image.open(raiz / 'referencias' / 'logo-refugio-vita-spa.jpg').convert('RGB')
im = im.resize((im.width * ESCALA, im.height * ESCALA), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
a = np.asarray(im).astype(float)
fundo = np.array([22, 45, 39.0])
ouro = np.array([212, 190, 127.0])
# quanto cada pixel está entre o fundo verde e o dourado (0..1)
t = ((a - fundo) @ (ouro - fundo)) / ((ouro - fundo) @ (ouro - fundo))
mask = t > 0.42

def tracar(m):
    bmp = potrace.Bitmap(~m)  # o potracer trata False como tinta
    path = bmp.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curva in path:
        sx, sy = curva.start_point.x, curva.start_point.y
        d.append(f'M{sx/ESCALA:.1f} {sy/ESCALA:.1f}')
        for seg in curva.segments:
            if seg.is_corner:
                cx, cy = seg.c.x, seg.c.y; ex, ey = seg.end_point.x, seg.end_point.y
                d.append(f'L{cx/ESCALA:.1f} {cy/ESCALA:.1f}L{ex/ESCALA:.1f} {ey/ESCALA:.1f}')
            else:
                x1, y1, x2, y2, ex, ey = seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.end_point.x, seg.end_point.y
                d.append(f'C{x1/ESCALA:.1f} {y1/ESCALA:.1f} {x2/ESCALA:.1f} {y2/ESCALA:.1f} {ex/ESCALA:.1f} {ey/ESCALA:.1f}')
        d.append('Z')
    return ''.join(d)

def recorte(y0, y1):
    m = np.zeros_like(mask)
    m[y0 * ESCALA:y1 * ESCALA] = mask[y0 * ESCALA:y1 * ESCALA]
    return tracar(m)

partes = {
    'arvore': recorte(55, 484),   # árvore, pássaros e linha do chão
    'nome': recorte(484, 590),    # REFÚGIO VITA (com o acento do Ú)
    'spa': recorte(590, 670),     # SPA e filetes
}
out = raiz / 'src' / 'assets'
out.mkdir(parents=True, exist_ok=True)
import json
(out / 'logo-paths.json').write_text(json.dumps(partes))
for k, v in partes.items():
    print(k, len(v) // 1024, 'KB')

# ---- arquivos SVG (o contorno extra deixa o traço mais encorpado) ----
CORES = {'ouro': '#D4B66F', 'escuro': '#856526'}
CONTORNO = 3
def grupo(d, cor, transform=''):
    t = f' transform="{transform}"' if transform else ''
    return f'<g{t} fill="{cor}" stroke="{cor}" stroke-width="{CONTORNO}" stroke-linejoin="round"><path d="{d}"/></g>'

pub = raiz / 'public'
for nome_cor, cor in CORES.items():
    vertical = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="300 52 680 612" role="img" aria-label="Refúgio Vita Spa">'
                + grupo(partes['arvore'], cor) + grupo(partes['nome'], cor) + grupo(partes['spa'], cor) + '</svg>')
    (pub / f'logo-vertical-{nome_cor}.svg').write_text(vertical)
    # horizontal: árvore à esquerda, nome à direita
    texto = f'translate(651 115) scale(1.4) translate(-312 -507)'
    horizontal = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 1575 445" role="img" aria-label="Refúgio Vita Spa">'
                  + grupo(partes['arvore'], cor, 'translate(-344 -65)')
                  + grupo(partes['nome'], cor, texto) + grupo(partes['spa'], cor, texto) + '</svg>')
    (pub / f'logo-horizontal-{nome_cor}.svg').write_text(horizontal)
    simbolo = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="338 59 603 425" role="img" aria-label="Refúgio Vita Spa">'
               + grupo(partes['arvore'], cor) + '</svg>')
    (pub / f'logo-simbolo-{nome_cor}.svg').write_text(simbolo)
print('SVGs gerados em public/')
