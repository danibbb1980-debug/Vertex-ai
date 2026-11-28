# Gera o carro do hero recortado (fundo transparente), em P&B, em duas exposições
# (silhueta e aceso). Entrada: recorte feito com rembg (isnet-general-use) a partir
# da foto original do SUV preto, salvo em scripts/hero-recorte.png.
import sys
import numpy as np
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
im = Image.open(SRC).convert('RGBA')
rgba = np.asarray(im, dtype=np.float32)
alpha = rgba[..., 3] / 255.0
# limpezas do recorte: letreiro entre os rack de teto e pano atrás do retrovisor direito
alpha[0:27, 385:785] = 0
alpha[160:258, 975:1032] = 0
# borda levemente suavizada
a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
alpha = np.asarray(a_img, dtype=np.float32) / 255.0
lum = (0.2126 * rgba[..., 0] + 0.7152 * rgba[..., 1] + 0.0722 * rgba[..., 2]) / 255.0
lum = np.clip((lum - 0.03) / 0.94, 0, 1)
lum = lum * lum * (3 - 2 * lum) * 0.55 + lum * 0.45
# recorta a caixa útil
ys, xs = np.where(alpha > 0.05)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
def save(l, name):
    rgb = np.repeat((l * 255)[..., None], 3, axis=2)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)[y0:y1, x0:x1]
    img = Image.fromarray(out, 'RGBA')
    for w in (1100, 640):
        img.resize((w, round(w * img.height / img.width)), Image.LANCZOS).save(f'{OUT}/{name}-{w}.webp', quality=82, method=6)
    return img.size
print(save(lum, 'hero-carro'), save(np.clip(lum ** 2.6, 0, 1), 'hero-carro-escuro'))
