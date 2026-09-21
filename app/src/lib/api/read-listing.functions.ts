import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { COLORS, FUELS, TRANSMISSIONS } from "../../site/offer-labels";
import { bindings } from "../bindings.server";
import { parseListing } from "../parse-listing";

export type ReadFields = {
  make: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
  transmission: string;
  fuel: string;
  color: string;
  note: string;
};

export type ReadResult = {
  ok: boolean;
  source: "ai" | "rules";
  filled: number;
  fields: ReadFields;
};

const BLANK: ReadFields = {
  make: "",
  model: "",
  year: "",
  mileage: "",
  price: "",
  transmission: "",
  fuel: "",
  color: "",
  note: "",
};

// A dealer's WhatsApp message is prose, not a form: mixed languages, typos,
// emoji, and model names no fixed list would ever hold. The instructions below
// therefore ask for extraction only — every rule pushes towards leaving a field
// empty rather than inventing a plausible value, because a blank field costs a
// tap and a wrong one costs a misleading listing.
const SYSTEM = `You read a used-car listing written by a dealer and return only what the text actually says.
The message may be in Arabic, Korean, English, Russian, Spanish, or a mix, with typos, emoji and line breaks.

Return one JSON object and nothing else, with exactly these keys:
make, model, year, mileage, price, transmission, fuel, color, note.

make: the manufacturer in Latin script, properly capitalised — "Hyundai", "Kia", "Genesis", "KG Mobility", "Mercedes-Benz", "BYD", "Chevrolet".
model: the model and trim as a buyer would recognise it, in Latin script — "Palisade 2.5 Gasoline", "Sonata DN8", "Sorento Signature", "G80 3.5 Turbo". Never include the make, the year or the mileage in it.
year: four digits, or "".
mileage: kilometres, digits only, no separators, or "". Convert only if the text says miles.
price: exactly as written, with its currency — "USD 14,500", "48,798$", "32,000,000 KRW" — or "" when no price is given.
transmission: one of auto, manual, or "".
fuel: one of petrol, diesel, hybrid, electric, or "".
color: one of white, black, silver, gray, blue, red, other, or "".
note: one short Arabic line, at most 120 characters, listing only extras the text explicitly mentions (فتحة سقف، جلد، كاميرا، بدون حوادث، مالك واحد). "" when it mentions none.

Never guess and never fill a field from general knowledge. If the text does not state something, return "" for it.`;

// Tried in order. A model that is retired, busy, or gated behind a paid plan
// simply hands the read to the next one, and the rule reader backs them all.
const MODELS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/google/gemma-4-26b-a4b-it",
  "@cf/meta/llama-3.1-8b-instruct-fast",
];

/** Pulls the JSON object out of a reply that may be fenced or padded with prose. */
function readJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const value = JSON.parse(text.slice(start, end + 1)) as unknown;
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function str(value: unknown, max: number): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || /^(null|none|n\/a|unknown|غير معروف)$/i.test(trimmed)) return "";
  return trimmed.slice(0, max);
}

function oneOf(value: unknown, allowed: readonly string[]): string {
  const found = str(value, 20).toLowerCase();
  return (allowed as readonly string[]).includes(found) ? found : "";
}

function digits(value: unknown, min: number, max: number): string {
  const raw = str(value, 20).replace(/[^\d]/g, "");
  if (!raw) return "";
  const n = Number(raw);
  return Number.isFinite(n) && n >= min && n <= max ? String(n) : "";
}

function fromModel(raw: Record<string, unknown>): ReadFields {
  return {
    make: str(raw.make, 40),
    model: str(raw.model, 60),
    year: digits(raw.year, 1980, 2100),
    mileage: digits(raw.mileage, 0, 2000000),
    price: str(raw.price, 40),
    transmission: oneOf(raw.transmission, TRANSMISSIONS),
    fuel: oneOf(raw.fuel, FUELS),
    color: oneOf(raw.color, COLORS),
    note: str(raw.note, 120),
  };
}

/** The rule-based reader still runs, and fills whatever the model left blank. */
function withRules(fields: ReadFields, text: string): ReadFields {
  const rules = parseListing(text);
  return {
    make: fields.make || (rules.make ?? ""),
    model: fields.model || (rules.model ?? ""),
    year: fields.year || (rules.year ?? ""),
    mileage: fields.mileage || (rules.mileage ?? ""),
    price: fields.price || (rules.price ?? ""),
    transmission: fields.transmission || (rules.transmission ?? ""),
    fuel: fields.fuel || (rules.fuel ?? ""),
    color: fields.color || (rules.color ?? ""),
    note: fields.note,
  };
}

function countFilled(fields: ReadFields): number {
  return Object.values(fields).filter((v) => v !== "").length;
}

function sameSecret(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function askModel(text: string): Promise<ReadFields | null> {
  const { AI } = bindings();
  if (!AI) return null;

  for (const model of MODELS) {
    try {
      const reply = (await AI.run(model, {
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: text },
        ],
        max_tokens: 400,
        temperature: 0,
      })) as { response?: unknown };

      const raw = typeof reply?.response === "string" ? readJson(reply.response) : null;
      if (raw) return fromModel(raw);
    } catch (error) {
      // A model that is busy or unavailable should cost the next one a try,
      // and failing that the rule reader — never the whole publish flow.
      console.error(`read-listing: ${model} failed`, error);
    }
  }
  return null;
}

/**
 * Reads a pasted dealer message into the offer form. The model does the
 * understanding; the rule reader is kept as a floor so a paste never comes back
 * completely empty just because the model was unavailable.
 */
export const readListing = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      password: z.string().min(1).max(200),
      text: z.string().trim().min(1).max(4000),
    }),
  )
  .handler(async ({ data }): Promise<ReadResult> => {
    const { ADMIN_PASSWORD } = bindings();
    if (!ADMIN_PASSWORD || !sameSecret(data.password, ADMIN_PASSWORD)) {
      return { ok: false, source: "rules", filled: 0, fields: BLANK };
    }

    const fromAi = await askModel(data.text);
    const fields = withRules(fromAi ?? BLANK, data.text);
    return {
      ok: true,
      source: fromAi ? "ai" : "rules",
      filled: countFilled(fields),
      fields,
    };
  });
