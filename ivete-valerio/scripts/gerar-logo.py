"""Gera o logotipo da Ivete Valério Estética em SVG, com texto convertido em contornos.

Uso: python3 scripts/gerar-logo.py   (precisa de: pip install fonttools brotli)
Saídas: public/brand/*.svg e src/components/logo-paths.ts
"""
import math
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
NM = ROOT / "node_modules"
SERIF = NM / "@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2"
SANS = NM / "@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2"


def load(path, axes=None):
    f = TTFont(str(path))
    if axes and "fvar" in f:
        f = instancer.instantiateVariableFont(f, axes)
    return f


def text_path(font, text, size, x, baseline, tracking=0.0):
    upm = font["head"].unitsPerEm
    s = size / upm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    out = []
    cx = x
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        tp = TransformPen(pen, (s, 0, 0, -s, cx, baseline))
        gs[g].draw(tp)
        d = pen.getCommands()
        if d:
            out.append(d)
        cx += hmtx[g][0] * s + tracking * size
    return " ".join(out), cx - tracking * size


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
    )


# A linha de uma mão só: arco de sobrancelha que termina em onda suave.
SEGS = [
    ((2, 30), (9, 11), (28, 3), (43, 12)),
    ((43, 12), (51, 17), (53, 25), (61, 25)),
    ((61, 25), (69, 25), (71, 17), (79, 17)),
    ((79, 17), (85, 17), (88, 21), (93, 23)),
]


def stroke_shape(segs, wmax, wmin):
    pts = []
    n = 40
    for i, s in enumerate(segs):
        for k in range(n + (1 if i == len(segs) - 1 else 0)):
            pts.append(bez(*s, k / n))
    total = len(pts) - 1
    left, right = [], []
    for i, p in enumerate(pts):
        a = pts[max(i - 1, 0)]
        b = pts[min(i + 1, total)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        t = i / total
        # traço de pincel: começa fino, engrossa no arco, afina na onda
        w = wmin + (wmax - wmin) * (math.sin(math.pi * min(1, t * 1.35)) ** 0.8) * (1 - 0.55 * t)
        w = max(wmin * 0.7, w)
        left.append((p[0] + nx * w / 2, p[1] + ny * w / 2))
        right.append((p[0] - nx * w / 2, p[1] - ny * w / 2))
    poly = left + right[::-1]
    d = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in poly) + "Z"
    return d


def main():
    serif = load(SERIF, {"opsz": 60, "wght": 400})
    sans = load(SANS)
    mark = stroke_shape(SEGS, 3.4, 1.1)
    name_d, name_end = text_path(serif, "Ivete Valério", 30, 106, 30, tracking=-0.01)
    tag_d, tag_end = text_path(sans, "ESTÉTICA", 8.6, 107.5, 46, tracking=0.34)
    width = math.ceil(max(name_end, tag_end) + 3)
    height = 52

    brand = ROOT / "public/brand"
    brand.mkdir(parents=True, exist_ok=True)
    variants = {
        "logo-cacau": ("#2E1E17", "#A4553A", "#2E1E17"),
        "logo-cru": ("#F5EEE6", "#D9997B", "#F5EEE6"),
    }
    for name, (txt, line, tag) in variants.items():
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            f'width="{width * 4}" height="{height * 4}" role="img" aria-label="Ivete Valério Estética">'
            f'<path fill="{line}" d="{mark}"/><path fill="{txt}" d="{name_d}"/>'
            f'<path fill="{tag}" d="{tag_d}"/></svg>'
        )
        (brand / f"{name}.svg").write_text(svg)
    # favicon só com a marca
    fav = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -14 104 64">'
        '<rect x="-4" y="-14" width="104" height="64" rx="10" fill="#2E1E17"/>'
        f'<path fill="#E2A98D" transform="translate(0 2)" d="{stroke_shape(SEGS, 7, 2.6)}"/></svg>'
    )
    (ROOT / "public/favicon.svg").write_text(fav)

    ts = (
        "// Gerado por scripts/gerar-logo.py. Não editar à mão.\n"
        f"export const LOGO_VIEWBOX = '0 0 {width} {height}'\n"
        f"export const LOGO_MARK = '{mark}'\n"
        f"export const LOGO_NAME = '{name_d}'\n"
        f"export const LOGO_TAG = '{tag_d}'\n"
    )
    (ROOT / "src/components/logo-paths.ts").write_text(ts)
    print("ok", width, height)


if __name__ == "__main__":
    main()
