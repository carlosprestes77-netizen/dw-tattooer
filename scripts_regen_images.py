#!/usr/bin/env python3
"""
Regenera as imagens do site DW Tattooer a partir das 12 fotos originais.

USO:
  1. Baixe as 12 imagens da pasta Google Drive "Dw Tatto" e salve em /tmp/dw_src/
     com EXATAMENTE estes nomes: IMG_7637.PNG ... IMG_7648.PNG
     (IDs do Drive estão em DEPLOY_INSTRUCTIONS.md)
  2. Rode na raiz do projeto:  python3 scripts_regen_images.py
  3. Ele preenche public/portfolio, public/flashes, public/flashes/sim e public/artist.

Requer Pillow:  pip install pillow
"""
from PIL import Image
import os, glob

SRC = os.environ.get("DW_SRC", "/tmp/dw_src")
PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

def load(name):
    return Image.open(f"{SRC}/{name}").convert("RGB")

def save_jpg(img, path, maxdim=1500, q=85):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w, h = img.size
    if max(w, h) > maxdim:
        sc = maxdim / max(w, h)
        img = img.resize((int(w*sc), int(h*sc)))
    img.save(path, "JPEG", quality=q)

# limpa imagens antigas
for p in glob.glob(f"{PUB}/portfolio/*.jpg") + glob.glob(f"{PUB}/flashes/*.png") + \
         glob.glob(f"{PUB}/flashes/sim/*.png") + glob.glob(f"{PUB}/artist/*.jpg"):
    os.remove(p)

# HERO + RETRATO
save_jpg(load("IMG_7637.PNG"), f"{PUB}/portfolio/hero.jpg", maxdim=1600, q=88)
save_jpg(load("IMG_7648.PNG"), f"{PUB}/artist/portrait.jpg", maxdim=1000, q=88)

# PORTFOLIO (7 tatuagens na pele) -> work-01..07
portfolio = ["IMG_7637.PNG", "IMG_7638.PNG", "IMG_7639.PNG", "IMG_7640.PNG",
             "IMG_7642.PNG", "IMG_7643.PNG", "IMG_7646.PNG"]
for i, n in enumerate(portfolio, 1):
    save_jpg(load(n), f"{PUB}/portfolio/work-{i:02d}.jpg")

# FLASHES (4 desenhos no papel) -> flash-01..04
flashes = ["IMG_7641.PNG", "IMG_7644.PNG", "IMG_7645.PNG", "IMG_7647.PNG"]
for i, n in enumerate(flashes, 1):
    save_jpg(load(n), f"{PUB}/flashes/flash-{i:02d}.png", maxdim=1200, q=88)

# FLASHES simulador -> recorta fundo claro para transparente
os.makedirs(f"{PUB}/flashes/sim", exist_ok=True)
for i, n in enumerate(flashes, 1):
    im = Image.open(f"{SRC}/{n}").convert("RGBA")
    w, h = im.size
    if max(w, h) > 900:
        sc = 900 / max(w, h)
        im = im.resize((int(w*sc), int(h*sc)))
    px = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            lum = 0.299*r + 0.587*g + 0.114*b
            if lum > 218:
                px[x, y] = (r, g, b, 0) if lum >= 245 else (r, g, b, int(255*(245-lum)/27))
    im.save(f"{PUB}/flashes/sim/flash-{i:02d}.png")

print("OK. Imagens geradas em public/. Confira:")
for d in ["artist", "portfolio", "flashes", "flashes/sim"]:
    fs = sorted(f for f in os.listdir(f"{PUB}/{d}") if not f.startswith("."))
    print(f"  {d}/ ({len(fs)}): {fs}")
