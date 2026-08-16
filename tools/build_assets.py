"""Turn the generated Higgsfield kit into the site's public assets."""
import os, subprocess
from PIL import Image, ImageChops

B = "https://d8j0ntlcm91z4.cloudfront.net/user_38UAdnsB0QrV5kMe0pEpCOHSt0d/"
RAW, OUT = "/tmp/raw", "app/public/assets"
GROUND, ACCENT = (242, 242, 239), (31, 63, 184)

SRC = {
  "hero": "hf_20260816_003331_ebe2e6ee-5f68-4a63-8c45-3a0d88f66d6e.png",
  "apron": "hf_20260816_003331_452195d8-34db-4a03-a20b-c39df24a69e2.png",
  "sedan": "hf_20260816_003332_08fd4bcf-681d-4edb-b638-06391d70ae3c.png",
  "suv": "hf_20260816_003332_843ab3a4-6489-4676-865f-c84002ca309c.png",
  "luxury": "hf_20260816_003332_161e4ee6-17e7-4ce8-aae5-dc1669d203c7.png",
  "ev": "hf_20260816_003332_cff34b37-8723-4d6c-8c27-61bacf220c1f.png",
  "van": "hf_20260816_003332_7d82b52d-bf29-4327-9c76-fc060eb9fe9c.png",
  "pickup": "hf_20260816_003331_276a38d4-ea68-4187-8971-bf5090d2626b.png",
  "macro": "hf_20260816_003332_fa315f30-5757-467d-9c61-2777e9353602.png",
  "seoul": "hf_20260816_003332_c385ea0f-4ec4-4214-84f6-a57b36339ffc.png",
  "icons": "hf_20260816_003332_250c4b33-f902-489c-97c9-db6beb26611d.png",
  "mark": "hf_20260816_003332_27432358-cdbe-487f-90d9-0c8e427e4d36.png",
  "auction": "hf_20260816_003512_5b23e479-d053-4ede-b840-a29b7b507e1b.png",
  "inspect": "hf_20260816_003512_7940bddb-457a-4760-958f-c5e9ef542fee.png",
  "cover": "hf_20260816_003512_c2a19065-9999-4eb5-a8da-8333283f057e.png",
}

os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)
for k, n in SRC.items():
    d = RAW + "/" + k + ".png"
    if not os.path.exists(d):
        subprocess.run(["curl", "-sfL", "-o", d, B + n], check=True)

def load(k):
    return Image.open(RAW + "/" + k + ".png").convert("RGB")

def crop(img, ratio):
    w, h = img.size
    t = w / ratio
    if t <= h:
        top = int((h - t) / 2)
        return img.crop((0, top, w, top + int(t)))
    tw = int(h * ratio); left = int((w - tw) / 2)
    return img.crop((left, 0, left + tw, h))

def save(img, name, width, q=78):
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    p = OUT + "/" + name + ".webp"
    img.save(p, "WEBP", quality=q, method=6)
    print(name, img.size, os.path.getsize(p))

def bbox(cell, bg=GROUND, thr=34):
    d = ImageChops.difference(cell, Image.new("RGB", cell.size, bg)).convert("L")
    return d.point(lambda p: 255 if p > thr else 0).getbbox()

def squared(cell, bx, pad=0.14, bg=GROUND):
    if not bx:
        return None
    g = cell.crop(bx); s = int(max(g.size) * (1 + pad * 2))
    c = Image.new("RGB", (s, s), bg)
    c.paste(g, ((s - g.width) // 2, (s - g.height) // 2))
    return c

save(crop(load("hero"), 16 / 9), "hero", 2000, 76)
save(crop(load("apron"), 3 / 4), "service-shipping", 900)
save(crop(load("auction"), 3 / 4), "service-auction", 900)
save(crop(load("inspect"), 3 / 4), "service-inspection", 900)
save(crop(load("seoul"), 3 / 4), "service-commercial", 900)
save(crop(load("macro"), 3 / 2), "macro", 1200)
save(crop(load("cover"), 1200 / 630), "og-cover", 1200, 82)
for k in ["sedan", "suv", "luxury", "ev", "van", "pickup"]:
    save(crop(load(k), 4 / 3), "car-" + k, 820)

sheet = load("icons")
names = [None, "icon-clipboard", "icon-gavel", "icon-ship", "icon-doc", "icon-key",
         "icon-translate", "icon-wheel", "icon-house"]
cw, ch = sheet.width / 3, sheet.height / 3
for i, nm in enumerate(names):
    if not nm:
        continue
    r, c = divmod(i, 3)
    cell = sheet.crop((int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch)))
    bx = bbox(cell)
    print("cell", i, nm, "bbox", bx, "of", cell.size)
    out = squared(cell, bx) or cell
    out.resize((128, 128), Image.LANCZOS).save(OUT + "/" + nm + ".webp", "WEBP", quality=88, method=6)

m = load("mark"); mb = bbox(m)
print("mark bbox", mb, "of", m.size)
mark = squared(m, mb, 0.10) or m
mark.resize((256, 256), Image.LANCZOS).save(OUT + "/mark.webp", "WEBP", quality=92, method=6)
glyph = mark.crop(bbox(mark) or (0, 0, mark.width, mark.height))

def on_accent(size, inset):
    c = Image.new("RGB", (size, size), ACCENT)
    g = glyph.copy(); g.thumbnail((int(size * (1 - inset * 2)),) * 2, Image.LANCZOS)
    w = Image.new("RGB", g.size, GROUND)
    mk = ImageChops.difference(g, Image.new("RGB", g.size, GROUND)).convert("L")
    mk = mk.point(lambda p: 255 if p > 34 else 0)
    c.paste(w, ((size - g.width) // 2, (size - g.height) // 2), mk)
    return c

on_accent(64, 0.16).save(OUT + "/favicon.png")
on_accent(180, 0.20).save(OUT + "/apple-touch-icon.png")
on_accent(192, 0.18).save(OUT + "/icon-192.png")
on_accent(512, 0.18).save(OUT + "/icon-512.png")
on_accent(512, 0.28).save(OUT + "/icon-512-maskable.png")
print("head kit done")
