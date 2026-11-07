import sys, os
from PIL import Image, ImageEnhance, features
S, P, Z = sys.argv[1], sys.argv[2], sys.argv[3]
out = os.path.join(P, "public/img")
print("avif:", features.check("avif"))

def tone(im, warm=1.0):
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb = ImageEnhance.Color(rgb).enhance(0.96)
    r, g, b = rgb.split()
    r = r.point(lambda v: min(255, int(v * (1 + 0.02 * warm))))
    b = b.point(lambda v: int(v * (1 - 0.025 * warm)))
    rgb = Image.merge("RGB", (r, g, b))
    if im.mode == "RGBA":
        rgb.putalpha(im.getchannel("A"))
    return rgb

def save(im, name, widths, q=78):
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(f"{out}/{name}-{w}.webp", quality=q, method=6)
        r.save(f"{out}/{name}-{w}.avif", quality=q - 18)
        print(name, w, h)

# Retrato recortado: corta acima da marca d'água da arte original
cut = Image.open(f"{S}/cut/birefnet-portrait.png").convert("RGBA")
bbox = cut.getchannel("A").getbbox()
portrait = cut.crop((max(bbox[0] - 10, 0), max(bbox[1] - 20, 0), 1080, 1070))
portrait = tone(portrait)
portrait.save(f"{P}/referencias/fotos/juliana-recorte-transparente.png", optimize=True)
save(portrait, "juliana", [400, 600, 800])

# Fotos do espaço (prints do WhatsApp: só a área da foto)
names = {
    "WhatsApp Image 2026-11-07 at 12.05.12.jpeg": "espaco-sala",
    "WhatsApp Image 2026-11-07 at 12.05.11.jpeg": "espaco-maca",
    "WhatsApp Image 2026-11-07 at 12.05.11 (2).jpeg": "espaco-ambiente",
    "WhatsApp Image 2026-11-07 at 12.05.11 (1).jpeg": "espaco-recepcao",
}
for src, name in names.items():
    im = Image.open(f"{Z}/{src}")
    im = im.crop((0, 309, im.width, 1291))
    im = tone(im, 0.6)
    im.save(f"{P}/referencias/fotos/{name}.jpg", quality=92)
    save(im, name, [400, 560, 739], q=76)
print("ok")
