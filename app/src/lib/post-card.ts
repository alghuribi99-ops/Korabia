import type { Offer } from "./api/offers.functions";
import { OFFER_TEXT, type Color, type Fuel, type Transmission } from "../site/offer-labels";

const AR = OFFER_TEXT.ar;

export type PostSize = "square" | "story";

type Layout = {
  w: number;
  h: number;
  photo: number;
  pad: number;
  title: number;
  price: number;
  chip: number;
  foot: number;
};

/**
 * Two canvases, one drawing routine. Square feeds Instagram and Facebook;
 * story feeds Snapchat, Reels and TikTok, which all crop to 9:16.
 */
const LAYOUT: Record<PostSize, Layout> = {
  square: { w: 1080, h: 1080, photo: 540, pad: 64, title: 54, price: 64, chip: 26, foot: 26 },
  story: { w: 1080, h: 1920, photo: 1260, pad: 72, title: 66, price: 82, chip: 30, foot: 30 },
};

const INK = "#111619";
const PAPER = "#FFFFFF";
const MUTED = "#8C959B";
const ACCENT = "#93C5FD";
const LINE = "rgba(255,255,255,0.18)";

/** Canvas needs the faces resident before the first fillText, not just linked. */
export async function loadFonts() {
  const specs = [
    '300 40px "IBM Plex Sans Arabic"',
    '400 40px "IBM Plex Sans Arabic"',
    '500 40px "IBM Plex Sans Arabic"',
    '600 40px "IBM Plex Sans Arabic"',
    '700 40px "IBM Plex Sans Arabic"',
    '500 40px "Outfit"',
    '600 40px "Outfit"',
    '700 40px "Outfit"',
  ];
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s, "0123456789 سيارة")));
    await document.fonts.ready;
  } catch {
    /* A missing face degrades to the system font rather than failing the card. */
  }
}

/** letterSpacing is newer than some lib.dom versions; set it without depending on that. */
function setTracking(ctx: CanvasRenderingContext2D, value: string) {
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = value;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

/** Fills the box without distorting the car. */
function cover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/** Trims a run with no break opportunity until it fits, rather than bleeding off the edge. */
function clamp(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(cut + "…").width > max) cut = cut.slice(0, -1);
  return cut + "…";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, lines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (ctx.measureText(next).width <= max || !line) {
      line = next;
    } else {
      out.push(line);
      line = word;
      if (out.length === lines) break;
    }
  }
  if (out.length < lines && line) out.push(line);
  if (out.length === lines && words.length) {
    // Anything that did not fit is dropped rather than overflowing the panel.
    const joined = out.join(" ");
    if (joined.length < text.length) out[lines - 1] = out[lines - 1].replace(/\s*\S*$/, "…");
  }
  return out.map((l) => clamp(ctx, l, max));
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function specsOf(offer: Offer): string[] {
  const nf = new Intl.NumberFormat("en-US");
  return [
    offer.year ? String(offer.year) : null,
    offer.mileage !== null ? nf.format(offer.mileage) + " " + AR.km : null,
    offer.transmission ? AR.transmission[offer.transmission as Transmission] : null,
    offer.fuel ? AR.fuel[offer.fuel as Fuel] : null,
    offer.color ? AR.color[offer.color as Color] : null,
  ].filter(Boolean) as string[];
}

export function titleOf(offer: Offer) {
  return [offer.make, offer.model].filter(Boolean).join(" ");
}

/** The caption he pastes with the image. Price and link do the qualifying. */
export function captionOf(offer: Offer) {
  const specs = specsOf(offer);
  const lines = [
    titleOf(offer),
    "",
    offer.price ? "السعر: " + offer.price : AR.askPrice,
    specs.length ? specs.join(" · ") : "",
    "",
    "سيارة جاهزة من كوريا الجنوبية — فحص موثّق قبل الشراء، شحن من ميناء إنشون، وأوراق كاملة.",
    "العرض ساري ٤٨ ساعة فقط.",
    "",
    "التفاصيل والطلب: korabia.co",
    "",
    "#كورابيا #سيارات #استيراد_سيارات #سيارات_كورية #كوريا #جدة #الرياض #الدمام #سيارات_للبيع",
  ];
  return lines.filter((l, i) => !(l === "" && lines[i - 1] === "")).join("\n");
}

export async function drawPostCard(offer: Offer, size: PostSize): Promise<Blob> {
  const L = LAYOUT[size];
  const canvas = document.createElement("canvas");
  canvas.width = L.w;
  canvas.height = L.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, L.w, L.h);

  // --- photo -------------------------------------------------------------
  if (offer.images[0]) {
    try {
      const photo = await loadImage("/img?k=" + encodeURIComponent(offer.images[0]));
      cover(ctx, photo, 0, 0, L.w, L.photo);
    } catch {
      /* No photo is survivable; the panel below still carries the offer. */
    }
  }

  const veil = ctx.createLinearGradient(0, L.photo * 0.42, 0, L.photo);
  veil.addColorStop(0, "rgba(17,22,25,0)");
  veil.addColorStop(1, "rgba(17,22,25,0.92)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, L.photo * 0.42, L.w, L.photo * 0.58 + 2);

  // --- brand mark --------------------------------------------------------
  const markSize = Math.round(L.pad * 0.84);
  try {
    const mark = await loadImage("/assets/mark.webp");
    ctx.save();
    roundRect(ctx, L.pad, L.pad, markSize, markSize, 12);
    ctx.clip();
    ctx.drawImage(mark, L.pad, L.pad, markSize, markSize);
    ctx.restore();
  } catch {
    /* ignore */
  }
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = PAPER;
  setTracking(ctx, "0.3em");
  ctx.font = '600 ' + Math.round(markSize * 0.46) + 'px "Outfit", system-ui, sans-serif';
  ctx.fillText("KORABIA", L.pad + markSize + 18, L.pad + markSize * 0.68);
  setTracking(ctx, "0px");

  // --- 48h badge ---------------------------------------------------------
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.font = '600 ' + L.chip + 'px "IBM Plex Sans Arabic", system-ui, sans-serif';
  const badge = "٤٨ ساعة فقط";
  const bw = ctx.measureText(badge).width + L.chip * 2.2;
  const bh = L.chip * 2.5;
  ctx.fillStyle = "#1F3FB8";
  roundRect(ctx, L.w - L.pad - bw, L.pad, bw, bh, bh / 2);
  ctx.fill();
  ctx.fillStyle = PAPER;
  ctx.fillText(badge, L.w - L.pad - L.chip * 1.1, L.pad + bh * 0.66);

  // --- panel -------------------------------------------------------------
  // The block is centred between the photo and the footer rule, so a one-line
  // and a two-line title both sit comfortably instead of one of them colliding
  // with the rule. Model names here run long ("Palisade 2.5 Gasoline 4WD …").
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  const right = L.w - L.pad;

  ctx.font = '600 ' + L.title + 'px "IBM Plex Sans Arabic", system-ui, sans-serif';
  const lines = wrap(ctx, titleOf(offer), L.w - L.pad * 2, 2);

  const titleLead = L.title * 1.28;
  const gapTitlePrice = L.pad * 0.45;
  const gapPriceChips = L.pad * 0.5;
  const chipH = L.chip * 2.3;
  const footY = L.h - L.pad * 1.5;
  const ruleY = footY - L.foot * 1.6;

  const blockH =
    L.title + (lines.length - 1) * titleLead + gapTitlePrice + L.price + gapPriceChips + chipH;
  const top = L.photo + Math.max(L.pad * 0.8, (ruleY - L.photo - blockH) / 2);

  ctx.fillStyle = PAPER;
  let y = top + L.title;
  lines.forEach((line, i) => ctx.fillText(line, right, y + i * titleLead));
  y += (lines.length - 1) * titleLead;

  y += gapTitlePrice + L.price;
  ctx.fillStyle = offer.price ? ACCENT : MUTED;
  if (offer.price) {
    ctx.direction = "ltr";
    ctx.font = '700 ' + L.price + 'px "Outfit", system-ui, sans-serif';
    ctx.fillText(clamp(ctx, offer.price, L.w - L.pad * 2), right, y);
  } else {
    ctx.font = '600 ' + Math.round(L.price * 0.72) + 'px "IBM Plex Sans Arabic", system-ui, sans-serif';
    ctx.fillText(AR.askPrice, right, y);
  }

  // --- spec chips --------------------------------------------------------
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  y += gapPriceChips;
  ctx.font = '400 ' + L.chip + 'px "IBM Plex Sans Arabic", system-ui, sans-serif';
  let x = right;
  for (const spec of specsOf(offer).slice(0, size === "story" ? 5 : 4)) {
    const cw = ctx.measureText(spec).width + L.chip * 1.8;
    if (x - cw < L.pad) break;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    roundRect(ctx, x - cw, y, cw, chipH, chipH / 2);
    ctx.stroke();
    ctx.fillStyle = "#D7DCE1";
    ctx.fillText(spec, x - L.chip * 0.9, y + chipH * 0.66);
    x -= cw + L.chip * 0.5;
  }

  // --- footer ------------------------------------------------------------
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(L.pad, ruleY);
  ctx.lineTo(L.w - L.pad, ruleY);
  ctx.stroke();

  ctx.direction = "rtl";
  ctx.textAlign = "right";
  ctx.fillStyle = PAPER;
  ctx.font = '500 ' + L.foot + 'px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillText("اطلبها من الموقع أو واتساب", right, footY);

  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  setTracking(ctx, "0.04em");
  ctx.font = '500 ' + L.foot + 'px "Outfit", system-ui, sans-serif';
  ctx.fillText("korabia.co", L.pad, footY);
  setTracking(ctx, "0px");

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", 0.92),
  );
}
