# Gera o palco do hero: SUV preto centralizado num fundo grafite, em P&B,
# em duas exposições (silhueta e acesa) para a sequência de abertura.
import sys
import numpy as np
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
BG = np.array([12, 13, 15], dtype=np.float32)
im = Image.open(SRC).convert('L').crop((0, 1048, 1170, 2055))  # do teto do carro até o piso
W, H = 1800, 1100
car_h = 800
car = im.resize((round(im.width * car_h / im.height), car_h), Image.LANCZOS)
a = np.asarray(car, dtype=np.float32) / 255.0
h, w = a.shape
# contraste: curva em S suave
a = np.clip((a - 0.04) / 0.92, 0, 1)
a = a * a * (3 - 2 * a) * 0.55 + a * 0.45
# máscara: elipse que some nas bordas (tira teto, prateleiras e piso)
yy, xx = np.mgrid[0:h, 0:w]
nx = (xx - w / 2) / (w / 2)
ny = (yy - h * 0.52) / (h * 0.62)
r = np.sqrt(nx ** 2 * 1.0 + ny ** 2 * 0.55)
mask = np.clip((1.0 - r) / 0.26, 0, 1)
mask = mask * mask * (3 - 2 * mask)
mask *= np.clip((h - yy) / (h * 0.10), 0, 1)  # base some no piso
mask *= np.clip((yy - h * 0.02) / (h * 0.16), 0, 1) ** 1.5  # topo some no escuro
def compose(lum):
    rgb = lum[..., None] * 255.0
    out = rgb * mask[..., None] + BG * (1 - mask[..., None])
    canvas = np.tile(BG, (H, W, 1))
    x0, y0 = (W - w) // 2, H - h
    canvas[y0:y0 + h, x0:x0 + w] = out
    return Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
lit = compose(a)
dark = compose(np.clip((a ** 2.6) * 0.95, 0, 1))  # só os reflexos sobrevivem
for name, img in (('hero-carro', lit), ('hero-carro-escuro', dark)):
    for ww in (1800, 1000):
        img.resize((ww, round(ww * H / W)), Image.LANCZOS).save(f'{OUT}/{name}-{ww}.webp', quality=80, method=6)
print('ok', W, H)
