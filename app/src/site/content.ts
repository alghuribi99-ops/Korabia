import { ar } from "./dict.ar";
import { en } from "./dict.en";
import { es } from "./dict.es";
import { ko } from "./dict.ko";
import { ru } from "./dict.ru";
import type { Dict, Lang } from "./types";

export const DICTS: Record<Lang, Dict> = { ar, en, ru, es, ko };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

export * from "./types";
