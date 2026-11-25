"""Gera as versões WebP das fotos (referencias/fotos/*.png|jpg) em public/fotos,
o logo em public/ e os ícones. Uso: npm run fotos"""
from pathlib import Path
from PIL import Image
import json
raiz = Path(__file__).resolve().parent.parent
origem = raiz / 'referencias' / 'fotos'
destino = raiz / 'public' / 'fotos'
destino.mkdir(parents=True, exist_ok=True)
info = {}
for f in sorted(list(origem.glob('*.png')) + list(origem.glob('*.jpg')) + list(origem.glob('*.jpeg'))):
    im = Image.open(f).convert('RGB')
    for w in (480, 960):
        w2 = min(w, im.width)
        r = im.resize((w2, round(im.height * w2 / im.width)), Image.LANCZOS)
        r.save(destino / f'{f.stem}-{w}.webp', 'WEBP', quality=78, method=6)
    info[f.stem] = [im.width, im.height]
print(json.dumps(info))
logo = Image.open(raiz / 'referencias' / 'logo-refugio-vita-spa.jpg').convert('RGB')
pub = raiz / 'public'
logo.save(pub / 'og-logo.jpg', 'JPEG', quality=88)
# ícone: recorte quadrado da própria árvore do logo, sem redesenho
icone = logo.crop((420, 50, 860, 490))
for s, nome in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (512, 'icon-512.png')):
    icone.resize((s, s), Image.LANCZOS).save(pub / nome)
print('cor do fundo do logo:', '#%02X%02X%02X' % logo.getpixel((2, 2)))
