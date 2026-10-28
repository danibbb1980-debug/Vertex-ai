"""Gera as imagens otimizadas do site a partir de ./referencias.

Uso (na pasta vc-odontologia):  python3 -I scripts/preparar-imagens.py
Requer Pillow com suporte a WebP e AVIF.

- Retratos do hero: recortados da arte "doutores lado a lado" APENAS na área
  da foto, acima de qualquer texto da arte.
- Retratos dos perfis: recortados dos stories, acima do nome; o filete branco
  da moldura da arte é removido por interpolação das linhas vizinhas.
- Nenhum texto das artes do Instagram é reproduzido.
"""

import pathlib
import sys

from PIL import Image, ImageOps

BASE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
REF = BASE / "referencias"
OUT = BASE / "public" / "fotos"
MARCA = BASE / "public" / "marca"
OUT.mkdir(parents=True, exist_ok=True)
MARCA.mkdir(parents=True, exist_ok=True)


def salvar(img: Image.Image, nome: str, larguras: list[int]) -> None:
    img = img.convert("RGB")
    for w in larguras:
        if w > img.width:
            w = img.width
        h = round(img.height * w / img.width)
        r = img.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{nome}-{w}.webp", "WEBP", quality=80, method=6)
        r.save(OUT / f"{nome}-{w}.avif", "AVIF", quality=58)
        print(f"{nome}-{w}  {w}x{h}")


def remover_filete(img: Image.Image, linhas: range) -> Image.Image:
    """Apaga um filete horizontal claro de 1-3 px, só onde ele aparece."""
    img = img.convert("RGB")
    px = img.load()
    y0, y1 = linhas.start - 1, linhas.stop
    for x in range(img.width):
        cima, baixo = px[x, y0], px[x, y1]
        meio = px[x, (linhas.start + linhas.stop) // 2]
        if sum(meio) - (sum(cima) + sum(baixo)) / 2 > 60:
            for y in linhas:
                t = (y - y0) / (y1 - y0)
                px[x, y] = tuple(round(cima[i] * (1 - t) + baixo[i] * t) for i in range(3))
    return img


# Retratos do hero (fundo bege, paletó azul-marinho)
arte = Image.open(REF / "instagram" / "arte-doutores-lado-a-lado.jpg")
salvar(arte.crop((0, 0, 538, 660)), "otavio-retrato", [320, 420, 538])
salvar(arte.crop((542, 0, 1080, 660)), "tales-retrato", [320, 420, 538])

# Retratos dos perfis (dos stories), sem o nome nem o filete da moldura
otavio = remover_filete(Image.open(REF / "instagram" / "story-otavio-carvalho.jpg"), range(410, 415))
salvar(otavio.crop((150, 180, 790, 1140)), "otavio-perfil", [400, 640])
tales = remover_filete(Image.open(REF / "instagram" / "story-tales-vilhena.jpg"), range(410, 415))
salvar(tales.crop((140, 230, 780, 1190)), "tales-perfil", [400, 640])

# Os dois doutores na recepção (foto de alta resolução)
dupla = ImageOps.exif_transpose(Image.open(REF / "fotos" / "dupla-recepcao.jpg"))
salvar(dupla.crop((0, 260, 3024, 4032)), "dupla-recepcao", [480, 760, 1100])

# Fachada (frame de story, sem textos)
fachada = Image.open(REF / "instagram" / "story-fachada-dia.jpg")
salvar(fachada.crop((0, 120, 720, 1080)), "fachada", [480, 720])

# Fotos internas (Google Maps): originais pequenos (~200x270). Ampliadas 2x com
# nitidez leve; peça à clínica as versões em alta resolução para substituir.
from PIL import ImageFilter

def interna(arquivo: str, nome: str, borrar: tuple[int, int, int, int] | None = None) -> None:
    img = Image.open(REF / "maps" / arquivo).convert("RGB")
    img = ImageOps.fit(img, (405, 540), Image.LANCZOS)
    if borrar:  # desfoca uma área (ex.: tela com imagem clínica)
        img.paste(img.crop(borrar).filter(ImageFilter.GaussianBlur(8)), borrar[:2])
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=2))
    salvar(img, nome, [270, 405])

interna("maps-03.jpg", "recepcao")
interna("maps-04.jpg", "sala-de-espera")
# A TV do consultório mostra o que parece uma radiografia: a tela é desfocada.
interna("maps-09.jpg", "consultorio", borrar=(192, 204, 270, 262))
interna("maps-07.jpg", "sala-de-atendimento")

# Logo: usado exatamente como enviado (monograma dourado sobre azul-marinho)
logo = Image.open(REF / "logo-vc-monograma-96px.jpg").convert("RGB")
logo.save(MARCA / "logo-vc-96.webp", "WEBP", quality=95)
logo.save(MARCA / "logo-vc-96.png")
logo.resize((180, 180), Image.LANCZOS).save(BASE / "public" / "apple-touch-icon.png")
logo.resize((32, 32), Image.LANCZOS).save(BASE / "public" / "favicon-32.png")
print("ok")
