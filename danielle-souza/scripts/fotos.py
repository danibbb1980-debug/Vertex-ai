"""Recorta e otimiza as fotos autorizadas da profissional para public/fotos/.
Gera <nome>.webp (1100 px de largura) e <nome>-640.webp, em 4:5.
Uso: python3 -I scripts/fotos.py
"""
from PIL import Image, ImageOps

FOTOS = {
    # nome: (arquivo original, recorte (x0, y0, x1, y1))
    'danielle-estudio': ('referencias/fotos-originais/danielle-estudio.jpg', (150, 300, 1290, 1725)),
    'danielle-congresso': ('referencias/fotos-originais/danielle-congresso.jpg', (560, 60, 1410, 1122)),
}
for nome, (src, box) in FOTOS.items():
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB').crop(box)
    for w, suf in ((min(1100, im.width), ''), (640, '-640')):
        h = round(w * 5 / 4)
        im.resize((w, h), Image.LANCZOS).save(f'public/fotos/{nome}{suf}.webp', 'WEBP', quality=80, method=6)
    print(nome, im.size)
