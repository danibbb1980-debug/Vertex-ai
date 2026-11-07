"""Gera a marca provisória (SVG em contornos) a partir das fontes do site.

Uso: python3 scripts/gerar-marca.py
Saída: public/brand/*.svg, public/favicon.svg e src/lib/brand-paths.ts
"""
import re
import json
import math
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@fontsource-variable"

OLIVA = "#34493B"
GRAFITE = "#1E241F"
MEL = "#D9A441"
MEL_CLARO = "#E8C27A"
AVEIA = "#F6F0E6"


def load(path, wght):
    font = TTFont(path)
    return instantiateVariableFont(font, {"wght": wght}, inplace=False)


def text_path(font, text, size, x=0.0, baseline=0.0, tracking=0.0):
    """Retorna (d, largura) do texto em contornos, com kerning simples via GPOS ignorado."""
    upm = font["head"].unitsPerEm
    scale = size / upm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    pen = SVGPathPen(gs)
    cursor = x
    for i, ch in enumerate(text):
        name = cmap.get(ord(ch))
        if name is None:
            continue
        tp = TransformPen(pen, (scale, 0, 0, -scale, cursor, baseline))
        gs[name].draw(tp)
        cursor += hmtx[name][0] * scale
        if i < len(text) - 1:
            cursor += tracking
    return pen.getCommands(), cursor - x


def rounded_hexagon(cx, cy, r, corner):
    """Hexágono de ponta para cima com cantos arredondados (favo)."""
    pts = [
        (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
        for a in (-90, -30, 30, 90, 150, 210)
    ]
    d = []
    n = len(pts)
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]

        def toward(a, b, dist):
            vx, vy = b[0] - a[0], b[1] - a[1]
            length = math.hypot(vx, vy)
            return (a[0] + vx / length * dist, a[1] + vy / length * dist)

        a = toward(p1, p0, corner)
        b = toward(p1, p2, corner)
        d.append(("M" if i == 0 else "L") + f"{a[0]:.2f} {a[1]:.2f}")
        d.append(f"Q{p1[0]:.2f} {p1[1]:.2f} {b[0]:.2f} {b[1]:.2f}")
    d.append("Z")
    return "".join(d)


def drop(cx, top, h):
    """Gota de mel: ponta para cima, base redonda."""
    w = h * 0.62
    r = w / 2
    by = top + h - r
    return (
        f"M{cx:.2f} {top:.2f}"
        f"C{cx + r * 0.35:.2f} {top + h * 0.28:.2f} {cx + r:.2f} {by - r * 0.55:.2f} {cx + r:.2f} {by:.2f}"
        f"A{r:.2f} {r:.2f} 0 0 1 {cx - r:.2f} {by:.2f}"
        f"C{cx - r:.2f} {by - r * 0.55:.2f} {cx - r * 0.35:.2f} {top + h * 0.28:.2f} {cx:.2f} {top:.2f}Z"
    )


serif = load(FONTS / "literata" / "files" / "literata-latin-wght-normal.woff2", 460)
serif_it = load(FONTS / "literata" / "files" / "literata-latin-wght-italic.woff2", 420)
sans = load(FONTS / "figtree" / "files" / "figtree-latin-wght-normal.woff2", 560)

# ---------- Monograma (viewBox 0 0 100 100) ----------
hexa = rounded_hexagon(50, 50, 46, 9)
hexa_inner = rounded_hexagon(50, 50, 40.5, 7.5)
# "BG" em itálico, um pouco sobreposto, centralizado
b_d, b_w = text_path(serif_it, "B", 34, 0, 0)
g_d, g_w = text_path(serif_it, "G", 34, 0, 0)
overlap = 3.2
total = b_w + g_w - overlap
x0 = 50 - total / 2 + 0.6
bg_b, _ = text_path(serif_it, "B", 34, x0, 57)
bg_g, _ = text_path(serif_it, "G", 34, x0 + b_w - overlap, 57)
gota = drop(50, 64.5, 13)

monograma = {
    "hexa": hexa,
    "hexaInner": hexa_inner,
    "letras": bg_b + bg_g,
    "gota": gota,
}

# ---------- Wordmark ----------
WM_SIZE = 44
wm_d, wm_w = text_path(serif, "Barbara Garcia", WM_SIZE, 0, 44, tracking=-0.2)
# Descritor centralizado sob o nome
desc_size = 10.5
_, desc_w = text_path(sans, "ESTÉTICA", desc_size, 0, 0, tracking=4.2)
desc_d, _ = text_path(sans, "ESTÉTICA", desc_size, (wm_w - desc_w) / 2, 66, tracking=4.2)
# filetes de mel dos dois lados do descritor
gap = 10
line_y = 62.2
fio_esq = f"M{(wm_w - desc_w) / 2 - gap - 34:.2f} {line_y}H{(wm_w - desc_w) / 2 - gap:.2f}"
fio_dir = f"M{(wm_w + desc_w) / 2 + gap:.2f} {line_y}H{(wm_w + desc_w) / 2 + gap + 34:.2f}"

wordmark = {
    "nome": wm_d,
    "descritor": desc_d,
    "fios": fio_esq + fio_dir,
    "largura": round(wm_w, 2),
    "altura": 72,
}

def round_path(d):
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), d)


out_ts = ROOT / "src" / "lib" / "brand-paths.ts"
out_ts.write_text(
    "// Gerado por scripts/gerar-marca.py. Não edite à mão.\n"
    f"export const MONOGRAMA = {json.dumps({k: round_path(v) for k, v in monograma.items()}, indent=2)} as const\n",
    encoding="utf-8",
)


def svg_monograma(stroke, letras, gota_cor, fundo=None, size=100):
    fill_bg = f'<path d="{hexa}" fill="{fundo}"/>' if fundo else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}" role="img" aria-label="Monograma BG">'
        f"{fill_bg}"
        f'<path d="{hexa}" fill="none" stroke="{stroke}" stroke-width="2.4"/>'
        f'<path d="{hexa_inner}" fill="none" stroke="{stroke}" stroke-width="0.9" opacity="0.55"/>'
        f'<path d="{bg_b + bg_g}" fill="{letras}"/>'
        f'<path d="{gota}" fill="{gota_cor}"/>'
        "</svg>"
    )


def svg_logo(cor_nome, cor_desc, cor_fio, cor_mono, cor_gota, bg=None):
    mono_size = 72
    pad = 22
    w = mono_size + pad + wm_w
    h = 72
    bg_rect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 {w + 16:.1f} {h + 16}" role="img" aria-label="Barbara Garcia Estética">'
        f"{bg_rect}"
        f'<g transform="scale(0.72)">'
        f'<path d="{hexa}" fill="none" stroke="{cor_mono}" stroke-width="2.4"/>'
        f'<path d="{hexa_inner}" fill="none" stroke="{cor_mono}" stroke-width="0.9" opacity="0.55"/>'
        f'<path d="{bg_b + bg_g}" fill="{cor_mono}"/>'
        f'<path d="{gota}" fill="{cor_gota}"/>'
        "</g>"
        f'<g transform="translate({mono_size + pad} 0)">'
        f'<path d="{wm_d}" fill="{cor_nome}"/>'
        f'<path d="{desc_d}" fill="{cor_desc}"/>'
        f'<path d="{wordmark["fios"]}" stroke="{cor_fio}" stroke-width="1.1" stroke-linecap="round"/>'
        "</g></svg>"
    )


brand = ROOT / "public" / "brand"
brand.mkdir(parents=True, exist_ok=True)
(brand / "logo-fundo-claro.svg").write_text(svg_logo(GRAFITE, OLIVA, MEL, OLIVA, MEL), encoding="utf-8")
(brand / "logo-fundo-escuro.svg").write_text(svg_logo(AVEIA, MEL_CLARO, MEL, AVEIA, MEL), encoding="utf-8")
(brand / "monograma-fundo-claro.svg").write_text(svg_monograma(OLIVA, OLIVA, MEL), encoding="utf-8")
(brand / "monograma-fundo-escuro.svg").write_text(svg_monograma(AVEIA, AVEIA, MEL), encoding="utf-8")
(ROOT / "public" / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 96 96">'
    f'<path d="{hexa}" fill="{OLIVA}"/>'
    f'<path d="{bg_b + bg_g}" fill="{AVEIA}" transform="translate(50 50) scale(1.22) translate(-50 -54)"/>'
    f'<path d="{gota}" fill="{MEL}" transform="translate(50 50) scale(1.15) translate(-50 -47)"/>'
    "</svg>",
    encoding="utf-8",
)
print("ok", round(wm_w, 1))
