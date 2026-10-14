"""Tratamento das fotos do site (rodar a partir dos ORIGINAIS, nunca dos arquivos já exportados).

Uso:
  python tratar_fotos.py <capa_original> <colagem_original> <pasta_saida>

Requer: opencv-python-headless, numpy, pillow (com suporte a AVIF/WebP).

Pipeline (igual para todas, para manter a mesma identidade visual):
  1. Recorte a partir do original (sem recompressão intermediária).
  2. Redução de ruído/artefatos JPEG (Non-Local Means, intensidade ajustada por foto).
  3. Ampliação Lanczos quando a foto é exibida maior que o arquivo (sem IA generativa:
     não inventa detalhes nem altera rostos).
  4. Balanço de branco: neutraliza a dominante de cor usando as paredes brancas como referência.
  5. Tons: curva suave de exposição/contraste e um leve "levantar sombras" que protege realces.
  6. Contraste local leve (CLAHE no canal de luminância, misturado a 35%).
  7. Vibração: aumenta mais a cor dos tons apagados do que a dos já saturados; pele protegida.
  8. Nitidez só na luminância, com limiar (não realça ruído nem gera halos coloridos).
  9. Exporta AVIF + WebP em 1x e 2x para srcset.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def white_balance(img, strength=0.8):
    """Neutraliza a dominante usando os pixels claros e pouco saturados (paredes, teto)."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, a, b = lab[..., 0], lab[..., 1] - 128, lab[..., 2] - 128
    mask = (L > np.percentile(L, 70)) & (np.hypot(a, b) < 14)
    if mask.sum() < 500:
        return img
    lab[..., 1] -= a[mask].mean() * strength
    lab[..., 2] -= b[mask].mean() * strength
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)


def tone(img, exposure=0.0, contrast=0.12, shadows=0.10, clahe_mix=0.35):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    L = lab[..., 0].astype(np.float32) / 255.0

    # Exposição (ganho suave no meio-tom, sem estourar o branco)
    if exposure:
        L = 1 - (1 - L) ** (1 + exposure)

    # Levantar sombras com peso que some acima do meio-tom
    w = np.clip(1 - L / 0.5, 0, 1) ** 2
    L = L + shadows * w * (0.5 - L) * 0.6

    # Curva S suave (contraste) ancorada no meio
    L = L + contrast * (L - 0.5) * (1 - np.abs(2 * L - 1))

    L8 = np.clip(L * 255, 0, 255).astype(np.uint8)
    if clahe_mix:
        cl = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8, 8)).apply(L8)
        L8 = cv2.addWeighted(L8, 1 - clahe_mix, cl, clahe_mix, 0)
    lab[..., 0] = L8
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def vibrance(img, amount=0.18):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    a, b = lab[..., 1] - 128, lab[..., 2] - 128
    chroma = np.hypot(a, b)
    hue = np.degrees(np.arctan2(b, a))
    boost = 1 + amount * np.clip(1 - chroma / 45, 0, 1)
    # tons de pele (matiz ~ 30–80°): metade do ganho, para não alaranjar
    skin = np.clip(1 - np.abs(hue - 55) / 30, 0, 1)
    boost = 1 + (boost - 1) * (1 - 0.5 * skin)
    lab[..., 1] = 128 + a * boost
    lab[..., 2] = 128 + b * boost
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)


def sharpen(img, sigma=1.0, amount=0.6, threshold=3):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    L = lab[..., 0].astype(np.float32)
    blur = cv2.GaussianBlur(L, (0, 0), sigma)
    detail = L - blur
    detail[np.abs(detail) < threshold] = 0
    lab[..., 0] = np.clip(L + amount * detail, 0, 255).astype(np.uint8)
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def process(img, *, denoise, scale, exposure=0.0, shadows=0.10, sharp_sigma=1.0, sharp_amount=0.6):
    if denoise:
        img = cv2.fastNlMeansDenoisingColored(img, None, denoise, denoise * 0.8, 5, 21)
    if scale != 1:
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LANCZOS4)
    img = white_balance(img)
    img = tone(img, exposure=exposure, shadows=shadows)
    img = vibrance(img)
    img = sharpen(img, sigma=sharp_sigma * max(scale, 1) ** 0.5, amount=sharp_amount)
    return img


def export(img, out_dir, name, widths, q_avif=58, q_webp=80):
    rgb = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    for w in widths:
        h = round(rgb.height * w / rgb.width)
        im = rgb if w == rgb.width else rgb.resize((w, h), Image.LANCZOS)
        suffix = f"-{w}"
        im.save(out_dir / f"{name}{suffix}.avif", quality=q_avif, speed=4)
        im.save(out_dir / f"{name}{suffix}.webp", quality=q_webp, method=6)


def main(capa_src, colagem_src, out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    capa = cv2.imread(capa_src)      # 1080x1080 (foto profissional, comprimida)
    col = cv2.imread(colagem_src)    # 1440x1440 (colagem de 8 selfies)

    # Capa: hero em tela cheia. 1080 -> 1600 (limite pedido), denoise leve.
    hero = process(capa, denoise=3, scale=1600 / 1080, sharp_amount=0.55)
    export(hero, out, "capa", [1080, 1600])

    # Sobre: recorte da Dai a partir da MESMA foto (mesmo enquadramento de antes: x 120..680).
    sobre = process(capa[:, 120:680], denoise=3, scale=1.5, sharp_amount=0.55)
    export(sobre, out, "sobre", [560, 840])

    # Galeria: painéis da colagem (mesmos recortes de antes), muito comprimidos -> denoise maior, 2x.
    paineis = {
        "galeria-1": (1088, 18),   # topo, 4º painel
        "galeria-2": (374, 732),   # baixo, 2º painel
        "galeria-3": (730, 732),   # baixo, 3º painel
    }
    expo = {"galeria-1": 0.0, "galeria-2": 0.18, "galeria-3": 0.18}
    for name, (x, y) in paineis.items():
        crop = col[y:y + 690, x:x + 336]
        g = process(crop, denoise=5, scale=2, exposure=expo[name], shadows=0.16, sharp_amount=0.45)
        export(g, out, name, [336, 672])


if __name__ == "__main__":
    main(*sys.argv[1:4])
