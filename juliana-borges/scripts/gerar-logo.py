"""Gera a reprodução vetorial do logo J|B (letras convertidas em contornos)."""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

NM = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "node_modules") + "/"
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets", "brand")
os.makedirs(OUT, exist_ok=True)

def load(path, **axes):
    f = TTFont(path)
    return instantiateVariableFont(f, axes) if axes else f

BODONI = load(NM + "@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2", wght=500, opsz=96)
JOST = load(NM + "@fontsource-variable/jost/files/jost-latin-wght-normal.woff2", wght=400)


def text_path(font, text, size, x, y, tracking=0.0, sy=1.0):
    """Converte texto em path SVG. (x, y) = início na linha de base. Retorna (d, largura, bounds)."""
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    s = size / upm
    pen = SVGPathPen(gs)
    bp = BoundsPen(gs)
    cx = 0.0
    for ch in text:
        g = cmap[ord(ch)]
        t = (s, 0, 0, -s * sy, x + cx, y)
        gs[g].draw(TransformPen(pen, t))
        gs[g].draw(TransformPen(bp, t))
        cx += hmtx[g][0] * s + tracking * size
    width = cx - tracking * size
    return pen.getCommands(), width, bp.bounds


def width_of(font, text, size, tracking=0.0):
    return text_path(font, text, size, 0, 0, tracking)[1]


JY = 1.3  # o J do logo original desce abaixo da linha de base


def monogram(cx, base, size, gap):
    """J e B centrados em cx, com uma linha vertical entre eles."""
    cap = size * BODONI["OS/2"].sCapHeight / BODONI["head"].unitsPerEm
    jbase = base - cap + cap * JY  # topo do J alinhado ao topo do B
    dj, wj, bj = text_path(BODONI, "J", size, 0, jbase, sy=JY)
    db, wb, bb = text_path(BODONI, "B", size, 0, base)
    # largura visual real de cada letra
    vj = bj[2] - bj[0]
    vb = bb[2] - bb[0]
    total = vj + gap * 2 + vb
    xj = cx - total / 2 - bj[0]
    xb = cx - total / 2 + vj + gap * 2 - bb[0]
    dj, _, bj = text_path(BODONI, "J", size, xj, jbase, sy=JY)
    db, _, bb = text_path(BODONI, "B", size, xb, base)
    top = min(bj[1], bb[1])
    bottom = max(bj[3], bb[3])
    return dj + db, top, bottom, (bj, bb)


GOLD = "currentColor"


def lockup(descriptor_lines, name="JULIANA BORGES"):
    W = 640
    cx = W / 2
    size = 300
    base = 250
    d_mono, top, bottom, (bj, bb) = monogram(cx, base, size, gap=20)

    name_size = 25
    name_track = 0.42
    nw = width_of(JOST, name, name_size, name_track)
    name_y = base - 12
    d_name, _, nb = text_path(JOST, name, name_size, cx - nw / 2, name_y, name_track)

    # faixa recortada atrás do nome (o monograma é interrompido ali)
    pad = 9
    cut_y = nb[1] - pad
    cut_h = (nb[3] - nb[1]) + pad * 2

    line_top = top - 26
    line_bottom = bottom + 22

    parts = []
    y = line_bottom + 52
    desc_paths = []
    for line in descriptor_lines:
        ds = 22
        tr = 0.34
        w = width_of(JOST, line, ds, tr)
        d, _, _ = text_path(JOST, line, ds, cx - w / 2, y, tr)
        desc_paths.append(d)
        y += 38
    H = y - 20 if descriptor_lines else line_bottom + 12
    vb_top = line_top - 12

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {vb_top:.0f} {W} {H - vb_top:.0f}" role="img" aria-labelledby="t">
<title id="t">Juliana Borges{" — " + " · ".join(l.title() for l in descriptor_lines) if descriptor_lines else ""}</title>
<defs><mask id="m"><rect x="0" y="{vb_top:.0f}" width="{W}" height="{H - vb_top:.0f}" fill="#fff"/><rect x="0" y="{cut_y:.1f}" width="{W}" height="{cut_h:.1f}" fill="#000"/></mask></defs>
<g fill="{GOLD}">
<g mask="url(#m)"><path d="{d_mono}"/><rect x="{cx - 1.1:.2f}" y="{line_top:.1f}" width="2.2" height="{line_bottom - line_top:.1f}"/></g>
<path d="{d_name}"/>
{"".join(f'<path d="{d}"/>' for d in desc_paths)}
</g>
</svg>'''
    return svg


def mono_only(square=False, bg=None, fg="currentColor"):
    W = 400
    cx = W / 2
    size = 300
    base = 250
    d_mono, top, bottom, _ = monogram(cx, base, size, gap=22)
    line_top = top - 22
    line_bottom = bottom + 18
    if square:
        h = line_bottom - line_top
        pad = 40
        side = max(h + pad * 2, 0)
        vx = cx - side / 2
        vy = (line_top + line_bottom) / 2 - side / 2
        rect = f'<rect x="{vx:.1f}" y="{vy:.1f}" width="{side:.1f}" height="{side:.1f}" rx="{side*0.18:.1f}" fill="{bg}"/>' if bg else ""
        vb = f"{vx:.1f} {vy:.1f} {side:.1f} {side:.1f}"
    else:
        rect = ""
        vb = f"0 {line_top - 4:.1f} {W} {line_bottom - line_top + 8:.1f}"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Juliana Borges">{rect}<g fill="{fg}"><path d="{d_mono}"/><rect x="{cx - 1.6:.2f}" y="{line_top:.1f}" width="3.2" height="{line_bottom - line_top:.1f}"/></g></svg>'''


def compacta(svg):
    import re
    def num(m):
        v = round(float(m.group(0)), 1)
        t = f"{v:.1f}".rstrip("0").rstrip(".")
        return "0" if t in ("-0", "") else t
    return re.sub(r"-?\d+\.\d+", num, svg)


def write(name, s):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(compacta(s))


write("logo-juliana-borges.svg", lockup(["MASSOTERAPEUTA", "BELEZA E ESTÉTICA"]))
write("logo-juliana-borges-nome.svg", lockup([]))
write("monograma.svg", mono_only())
write("favicon.svg", mono_only(square=True, bg="#FBF4EE", fg="#8A5A3C"))
write("icon-dark.svg", mono_only(square=True, bg="#2A1B15", fg="#E6C3AF"))
print("ok")
