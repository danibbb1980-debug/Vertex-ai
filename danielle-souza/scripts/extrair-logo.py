"""Extrai o logo de referencias/logo-original.jpg para PNG com fundo transparente.

1. Estima o fundo (cinza claro com vinheta) ajustando uma superfície quadrática
   aos pixels claros e pouco saturados.
2. Remove esse fundo por "color to alpha": alpha = max_c (B_c - P_c) / B_c, e a cor
   do traço é recuperada de forma que traço sobre o fundo original reproduza o pixel.
3. Recorta na caixa do conteúdo e gera: logo.png (cores originais), logo-branco.png
   (monocromático para fundos escuros) e amostras de cor.

Uso: python3 -I scripts/extrair-logo.py referencias/logo-original.jpg public/brand
"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float64)
h, w, _ = im.shape
lum = im.mean(axis=2)
sat = im.max(axis=2) - im.min(axis=2)

# 1. fundo: pixels claros e neutros
ys, xs = np.mgrid[0:h, 0:w]
mask = (lum > 228) & (sat < 10)
X = np.stack([np.ones_like(xs), xs, ys, xs * xs, ys * ys, xs * ys], axis=-1).reshape(-1, 6) / 1.0
Xn = X.copy()
Xn[:, 1] /= w; Xn[:, 2] /= h; Xn[:, 3] /= w * w; Xn[:, 4] /= h * h; Xn[:, 5] /= w * h
bg = np.zeros_like(im)
for c in range(3):
    coef, *_ = np.linalg.lstsq(Xn[mask.ravel()], im[..., c].ravel()[mask.ravel()], rcond=None)
    bg[..., c] = (Xn @ coef).reshape(h, w)
bg = np.clip(bg, 1, 255)

# 2. luminosidade do fundo como transparência, preservando a cor do traço.
#    alpha vem da distância de luminosidade ao fundo (traço com luminosidade <= L_INK
#    fica opaco) ou da saturação (o verde-água claro do degradê também fica opaco).
#    A cor é "desmisturada" do fundo: ink = (P - (1 - a) * B) / a.
L_INK = 150.0
bl = bg.mean(axis=2)
a_lum = np.clip((bl - lum - 4) / (bl - L_INK), 0, 1)
a_sat = np.clip((sat - 8) / 58.0, 0, 1)
alpha = np.maximum(a_lum, a_sat)
alpha = np.where(alpha < 0.04, 0, alpha)
a = np.clip(alpha, 1e-4, 1)[..., None]
ink = np.clip((im - (1 - a) * bg) / a, 0, 255)

# franja: em pixels de borda (alpha baixo) a desmistura amplifica o ruído do JPEG e
# gera halo claro. A cor desses pixels passa a ser a do traço opaco mais próximo.
core = alpha >= 0.6
col = np.where(core[..., None], ink, 0.0)
wgt = core.astype(np.float64)
for _ in range(6):
    pc = np.pad(col, ((1, 1), (1, 1), (0, 0)))
    pw = np.pad(wgt, 1)
    sc = sum(pc[1 + dy:h + 1 + dy, 1 + dx:w + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1))
    sw = sum(pw[1 + dy:h + 1 + dy, 1 + dx:w + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1))
    grow = (wgt == 0) & (sw > 0)
    col[grow] = sc[grow] / sw[grow][:, None]
    wgt = np.where(grow, 1.0, wgt)
edge = (~core) & (wgt > 0)
ink[edge] = col[edge]

# 3. recorte
ys_, xs_ = np.where(alpha > 0.02)
pad = 6
y0, y1 = max(ys_.min() - pad, 0), min(ys_.max() + pad, h)
x0, x1 = max(xs_.min() - pad, 0), min(xs_.max() + pad, w)
rgba = np.dstack([ink, alpha * 255]).astype(np.uint8)[y0:y1, x0:x1]
Image.fromarray(rgba, "RGBA").save(f"{out}/logo.png", optimize=True)

white = rgba.copy()
white[..., :3] = 255
white[..., 3] = np.clip(white[..., 3].astype(np.float64) * 1.2, 0, 255).astype(np.uint8)
Image.fromarray(white, "RGBA").save(f"{out}/logo-branco.png", optimize=True)

# WebP (usado no site; o PNG fica como arquivo-mestre transparente)
for name, arr in (("logo", rgba), ("logo-branco", white)):
    Image.fromarray(arr, "RGBA").save(f"{out}/{name}.webp", "WEBP", quality=92, alpha_quality=100, method=6)

# amostras de cor: traços bem opacos
strong = alpha[y0:y1, x0:x1] > 0.85
cols = ink[y0:y1, x0:x1][strong]
teal = cols[(cols[:, 1] - cols[:, 0]) > 40]
grey = cols[(np.abs(cols[:, 1] - cols[:, 0]) < 12) & (cols.mean(axis=1) < 150)]
hexc = lambda v: "#%02X%02X%02X" % tuple(int(round(x)) for x in v)
print("recorte", (x0, y0, x1, y1), "tamanho", rgba.shape[1], rgba.shape[0])
if len(teal):
    print("verde-água mediana", hexc(np.median(teal, axis=0)), "escuro p20", hexc(np.percentile(teal, 20, axis=0)), "claro p80", hexc(np.percentile(teal, 80, axis=0)))
if len(grey):
    print("grafite mediana", hexc(np.median(grey, axis=0)))
