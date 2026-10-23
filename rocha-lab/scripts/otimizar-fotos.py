"""Converte referencias/fotos/* em WebP otimizado dentro de public/fotos/.

Uso (na pasta rocha-lab):  python3 scripts/otimizar-fotos.py
Requer Pillow (pip install pillow). Fotos com mais de 700 px de largura
ganham também uma versão de 640 px (sufixo -640) para o srcset.
"""
from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "referencias" / "fotos"
DESTINO = RAIZ / "public" / "fotos"
DESTINO.mkdir(parents=True, exist_ok=True)

for arq in sorted(ORIGEM.iterdir()):
    if arq.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    im = ImageOps.exif_transpose(Image.open(arq)).convert("RGB")
    im.save(DESTINO / f"{arq.stem}.webp", "WEBP", quality=80, method=6)
    linha = f"{arq.stem}: {im.width}x{im.height}"
    if im.width > 700:
        p = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
        p.save(DESTINO / f"{arq.stem}-640.webp", "WEBP", quality=78, method=6)
        linha += " (+640)"
    print(linha)
