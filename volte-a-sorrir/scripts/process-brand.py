"""
Gera as versões web do logo a partir do arquivo original enviado pela clínica.

    python3 scripts/process-brand.py public/brand/logo-original.jpg public/brand

O original (640×1136, logo centralizado sobre amarelo liso) não é alterado.
Nada é redesenhado: o script só remove o fundo amarelo e recorta/reposiciona
os pixels do próprio arquivo.

Saídas:
  logo-vertical.png    símbolo + lettering, fundo transparente (recorte justo)
  logo-horizontal.png  versão derivada: símbolo à esquerda, lettering à direita
  logo-mark.png        só o símbolo do dente, fundo transparente
  logo-on-yellow.png   recorte quadrado com o fundo amarelo original

Como o fundo é removido sem estragar o símbolo:
  - No dente, só some o amarelo ligado à borda da imagem (preenchimento a
    partir das bordas). O traço amarelo dentro da coroa faz parte do desenho e
    fica protegido pelo branco ao redor.
  - No lettering, todo amarelo sai, inclusive o miolo de letras como O, R e A.
  - Pixels de borda (antisserrilhado) viram semitransparentes: cada um é
    tratado como mistura do fundo com branco, azul-marinho ou coral, e a cor
    é "descontaminada" do amarelo.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

BG = np.array([255, 221, 88], dtype=float)  # amarelo do arquivo original
INKS = {
    "white": np.array([255, 255, 255], dtype=float),
    "navy": np.array([14, 40, 55], dtype=float),
    "coral": np.array([196, 78, 14], dtype=float),
}

# Limites medidos no original (x0, y0, x1, y1), em pixels.
TOOTH = (232, 424, 422, 645)
LETTERING = (150, 644, 514, 746)


def unmix(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Alpha e cor sem o amarelo, escolhendo a tinta que melhor explica o pixel."""
    best_alpha = np.zeros(rgb.shape[:2])
    best_res = np.full(rgb.shape[:2], np.inf)
    for ink in INKS.values():
        d = ink - BG
        alpha = np.clip(((rgb - BG) @ d) / (d @ d), 0, 1)
        res = np.linalg.norm(rgb - (BG + alpha[..., None] * d), axis=2)
        take = res < best_res
        best_alpha[take] = alpha[take]
        best_res[take] = res[take]
    alpha = best_alpha
    alpha[alpha < 0.08] = 0
    alpha[alpha > 0.92] = 1
    safe = np.maximum(alpha, 1e-3)[..., None]
    color = np.clip(BG + (rgb - BG) / safe, 0, 255)
    return alpha, color


def dilate(mask: np.ndarray, steps: int = 1) -> np.ndarray:
    out = mask.copy()
    for _ in range(steps):
        grown = out.copy()
        grown[1:, :] |= out[:-1, :]
        grown[:-1, :] |= out[1:, :]
        grown[:, 1:] |= out[:, :-1]
        grown[:, :-1] |= out[:, 1:]
        out = grown
    return out


def background_from_edges(rgb: np.ndarray) -> np.ndarray:
    near_bg = np.abs(rgb - BG).sum(axis=2) < 70
    seed = np.zeros_like(near_bg)
    seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
    filled = seed & near_bg
    while True:
        grown = dilate(filled) & near_bg
        if (grown == filled).all():
            return filled
        filled = grown


def main(src: str, out_dir: str) -> None:
    out = Path(out_dir)
    img = Image.open(src).convert("RGB")
    rgb = np.asarray(img).astype(float)
    h, w, _ = rgb.shape

    alpha = np.ones((h, w))
    color = rgb.copy()
    unmixed_alpha, unmixed_color = unmix(rgb)

    # Dente: só o fundo ligado às bordas e a faixa de antisserrilhado ao redor.
    edge_zone = dilate(background_from_edges(rgb), 2)
    tooth = np.zeros((h, w), bool)
    x0, y0, x1, y1 = TOOTH
    tooth[y0:y1, x0:x1] = True
    zone = edge_zone & tooth
    alpha[zone] = unmixed_alpha[zone]
    color[zone] = unmixed_color[zone]

    # Lettering: remove todo o amarelo da faixa de texto.
    x0, y0, x1, y1 = LETTERING
    alpha[y0:y1, x0:x1] = unmixed_alpha[y0:y1, x0:x1]
    color[y0:y1, x0:x1] = unmixed_color[y0:y1, x0:x1]

    # Fora das duas regiões não há marca: tudo transparente.
    region = tooth.copy()
    region[y0:y1, x0:x1] = True
    alpha[~region] = 0

    rgba = np.dstack([color, alpha * 255]).round().astype(np.uint8)
    full = Image.fromarray(rgba, "RGBA")

    def tight(im: Image.Image, pad: int = 4) -> Image.Image:
        x0, y0, x1, y1 = im.getbbox()
        return im.crop((max(x0 - pad, 0), max(y0 - pad, 0), x1 + pad, y1 + pad))

    vertical = tight(full)
    vertical.save(out / "logo-vertical.png", optimize=True)

    mark = tight(full.crop(TOOTH))
    mark.save(out / "logo-mark.png", optimize=True)

    lettering = tight(full.crop(LETTERING), pad=2)

    # Versão horizontal derivada: símbolo com altura 1,32× a do lettering.
    scale = lettering.height * 1.32 / mark.height
    mark_small = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    gap = round(lettering.height * 0.28)
    canvas = Image.new("RGBA", (mark_small.width + gap + lettering.width, mark_small.height), (0, 0, 0, 0))
    canvas.alpha_composite(mark_small, (0, 0))
    canvas.alpha_composite(lettering, (mark_small.width + gap, round((mark_small.height - lettering.height) / 2)))
    canvas.save(out / "logo-horizontal.png", optimize=True)

    # Quadrado com o amarelo original, para avatar e compartilhamento.
    x0, y0, x1, y1 = vertical.getbbox()
    side = 420
    cx, cy = (155 + 508) // 2, (429 + 741) // 2
    img.crop((cx - side // 2, cy - side // 2, cx + side // 2, cy + side // 2)).save(out / "logo-on-yellow.png", optimize=True)

    for name in ["logo-vertical.png", "logo-horizontal.png", "logo-mark.png", "logo-on-yellow.png"]:
        print(name, Image.open(out / name).size)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
