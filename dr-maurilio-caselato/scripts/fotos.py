"""Gera as fotos otimizadas (webp + jpg) a partir de referencias/fotos-originais.
Recortes removem marcas/logos de terceiros, marca d'água e pessoas não autorizadas."""
import sys, pathlib
from PIL import Image
raiz = pathlib.Path(__file__).resolve().parent.parent
src = raiz / "referencias" / "fotos-originais"
out = raiz / "public" / "fotos"
out.mkdir(parents=True, exist_ok=True)
# nome: (arquivo, recorte (l,t,r,b) ou None, larguras)
FOTOS = {
    "retrato-consultorio": ("retrato-consultorio.jpg", None, [400]),
    "sala-de-espera": ("sala-de-espera.jpg", None, [480, 800]),
    "sala-atendimento": ("sala-atendimento.jpg", (0, 180, 360, 600), [360]),  # sem TV/banner de marca
    "sala-arcos": ("sala-arcos.jpg", None, [480, 800]),
    "recepcao": ("recepcao.jpg", (370, 40, 800, 600), [430]),  # sem a pessoa da recepção
}
for nome, (arq, crop, larguras) in FOTOS.items():
    im = Image.open(src / arq).convert("RGB")
    if crop: im = im.crop(crop)
    for w in larguras:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(out / f"{nome}-{w}.webp", "WEBP", quality=78, method=6)
        r.save(out / f"{nome}-{w}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        print(nome, w, h)
