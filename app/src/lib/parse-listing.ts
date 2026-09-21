/**
 * Best effort read of a car described in a WhatsApp message. Everything it
 * finds lands in the form as a suggestion the seller can correct, so a wrong
 * guess costs a tap rather than a bad listing.
 */
export type Parsed = {
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  price?: string;
  transmission?: "auto" | "manual";
  fuel?: "petrol" | "diesel" | "hybrid" | "electric";
  color?: "white" | "black" | "silver" | "gray" | "blue" | "red";
};

const MAKES: [RegExp, string][] = [
  [/hyundai|هيونداي|هونداي|현대/i, "Hyundai"],
  [/genesis|جينيسيس|제네시스/i, "Genesis"],
  [/\bkia\b|كيا|기아/i, "Kia"],
  [/ssangyong|kg ?mobility|سانج ?يونج|쌍용/i, "KG Mobility"],
  [/chevrolet|شيفروليه|쉐보레/i, "Chevrolet"],
  [/renault|رينو|르노/i, "Renault"],
  [/mercedes|benz|مرسيدس|بنز|벤츠/i, "Mercedes-Benz"],
  [/\bbmw\b|بي ?ام ?دبليو/i, "BMW"],
  [/\baudi\b|اودي|أودي/i, "Audi"],
  [/porsche|بورش/i, "Porsche"],
  [/lexus|لكزس|렉서스/i, "Lexus"],
  [/toyota|تويوتا|도요타/i, "Toyota"],
  [/honda|هوندا/i, "Honda"],
  [/nissan|نيسان/i, "Nissan"],
  [/volkswagen|فولكس/i, "Volkswagen"],
  [/tesla|تسلا/i, "Tesla"],
  [/\bbyd\b/i, "BYD"],
  [/land ?rover|لاند ?روفر/i, "Land Rover"],
  [/volvo|فولفو/i, "Volvo"],
];

const CLEAN = /[٠-٩]/g;
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function latinDigits(s: string) {
  return s.replace(CLEAN, (d) => String(AR_DIGITS.indexOf(d)));
}

export function parseListing(raw: string): Parsed {
  const text = latinDigits(raw);
  const out: Parsed = {};

  const year = text.match(/\b(19[89]\d|20[0-4]\d)\b/);
  if (year) out.year = year[1];

  const km = text.match(/([\d][\d.,\s]{2,})\s*(km|kms|كم|كيلو|킬로|㎞)\b/i);
  if (km) {
    const n = km[1].replace(/[^\d]/g, "");
    if (n) out.mileage = String(Number(n));
  } else {
    const labelled = text.match(/(?:ممشى|المشي|mileage|odo)\D{0,6}([\d][\d.,\s]{2,})/i);
    if (labelled) {
      const n = labelled[1].replace(/[^\d]/g, "");
      if (n) out.mileage = String(Number(n));
    }
  }

  const price =
    text.match(/(?:\$|USD|usd)\s?[\d][\d.,]*/) ||
    text.match(/[\d][\d.,]*\s?(?:\$|USD|usd|دولار|ريال|SAR|AED|درهم|KRW|원|만원)/i) ||
    text.match(/(?:السعر|price|가격)\D{0,4}([\d][\d.,]*)/i);
  if (price) out.price = price[0].replace(/^(?:السعر|price|가격)\D{0,4}/i, "").trim();

  if (/اوتوماتيك|أوتوماتيك|اتوماتيك|automatic|\bauto\b|오토|자동/i.test(text)) out.transmission = "auto";
  else if (/عادي|مانوال|manual|수동/i.test(text)) out.transmission = "manual";

  if (/هايبرد|هجين|hybrid|하이브리드/i.test(text)) out.fuel = "hybrid";
  else if (/كهرب|electric|\bev\b|전기/i.test(text)) out.fuel = "electric";
  else if (/ديزل|diesel|디젤/i.test(text)) out.fuel = "diesel";
  else if (/بنزين|petrol|gasoline|가솔린|휘발유/i.test(text)) out.fuel = "petrol";

  if (/أبيض|ابيض|white|흰|화이트/i.test(text)) out.color = "white";
  else if (/أسود|اسود|black|검정|블랙/i.test(text)) out.color = "black";
  else if (/فضي|silver|은색|실버/i.test(text)) out.color = "silver";
  else if (/رمادي|gray|grey|회색/i.test(text)) out.color = "gray";
  else if (/أزرق|ازرق|blue|파랑|블루/i.test(text)) out.color = "blue";
  else if (/أحمر|احمر|\bred\b|빨강|레드/i.test(text)) out.color = "red";

  for (const [re, name] of MAKES) {
    const hit = text.match(re);
    if (!hit) continue;
    out.make = name;
    const after = text.slice((hit.index ?? 0) + hit[0].length);
    const line = after.split(/[\n،,|/\-–]/)[0] ?? "";
    const words = line
      .replace(/\b(19[89]\d|20[0-4]\d)\b/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !/^\d+$/.test(w) && w.length < 18)
      .slice(0, 3);
    if (words.length) out.model = words.join(" ");
    break;
  }

  return out;
}
