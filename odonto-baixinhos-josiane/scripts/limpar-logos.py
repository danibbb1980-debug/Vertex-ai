"""Remove o fundo (gradiente creme/rosa) dos logos recortados das artes,
sem redesenhar: normaliza o fundo para branco e converte branco em transparência.
Uso: python3 -I scripts/limpar-logos.py"""
from PIL import Image, ImageFilter
import sys

def limpar(entrada, saida, raio, escala=3):
    im = Image.open(entrada).convert("RGB")
    im = im.resize((im.width * escala, im.height * escala), Image.LANCZOS)
    fundo = im.filter(ImageFilter.MaxFilter(raio)).filter(ImageFilter.GaussianBlur(raio))
    px, fx = im.load(), fundo.load()
    out = Image.new("RGBA", im.size)
    ox = out.load()
    for y in range(im.height):
        for x in range(im.width):
            c = [min(255, int(px[x, y][i] * 255 / max(1, fx[x, y][i]))) for i in range(3)]
            a = 1 - min(c) / 255
            if a < 0.06:
                ox[x, y] = (0, 0, 0, 0)
                continue
            a = min(1, a * 1.15)
            cor = [max(0, min(255, int((c[i] - (1 - a) * 255) / a))) for i in range(3)]
            ox[x, y] = (*cor, int(a * 255))
    bbox = out.getbbox()
    out.crop(bbox).save(saida)
    print(saida, out.crop(bbox).size)

limpar("referencias/logos/logo-dra-josiane-recorte.png", sys.argv[1] + "/logo-dra-josiane.png", 15)
limpar("referencias/logos/logo-odonto-baixinhos-recorte.png", sys.argv[1] + "/logo-odonto-baixinhos.png", 31)
