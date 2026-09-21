import type { Lang } from "./types";

/**
 * An offer is entered once as structured data, so every locale renders the same
 * row. Only labels are translated; makes, models and numbers never are.
 */
export const TRANSMISSIONS = ["auto", "manual"] as const;
export const FUELS = ["petrol", "diesel", "hybrid", "electric"] as const;
export const COLORS = ["white", "black", "silver", "gray", "blue", "red", "other"] as const;

export type Transmission = (typeof TRANSMISSIONS)[number];
export type Fuel = (typeof FUELS)[number];
export type Color = (typeof COLORS)[number];

type Bank = {
  title: string;
  intro: string;
  empty: string;
  endsIn: string;
  expired: string;
  archiveTitle: string;
  askPrice: string;
  inquire: string;
  specYear: string;
  specMileage: string;
  specTransmission: string;
  specFuel: string;
  specColor: string;
  km: string;
  d: string;
  h: string;
  m: string;
  s: string;
  waIntro: string;
  transmission: Record<Transmission, string>;
  fuel: Record<Fuel, string>;
  color: Record<Color, string>;
};

export const OFFER_TEXT: Record<Lang, Bank> = {
  ar: {
    title: "عروض اليوم",
    intro: "سيارات متاحة الآن من المزادات والمعارض الكورية. كل عرض يبقى ٤٨ ساعة ثم ينتهي.",
    empty: "ما فيه عروض نشطة في هذه اللحظة. تابعنا، ننزل سيارات باستمرار.",
    endsIn: "ينتهي بعد",
    expired: "انتهى العرض",
    archiveTitle: "عروض سابقة",
    askPrice: "تواصل للسعر",
    inquire: "استفسر عن السيارة",
    specYear: "الموديل",
    specMileage: "الممشى",
    specTransmission: "ناقل الحركة",
    specFuel: "الوقود",
    specColor: "اللون",
    km: "كم",
    d: "ي",
    h: "س",
    m: "د",
    s: "ث",
    waIntro: "السلام عليكم، أبي أستفسر عن هذي السيارة",
    transmission: { auto: "أوتوماتيك", manual: "عادي" },
    fuel: { petrol: "بنزين", diesel: "ديزل", hybrid: "هايبرد", electric: "كهربائي" },
    color: { white: "أبيض", black: "أسود", silver: "فضي", gray: "رمادي", blue: "أزرق", red: "أحمر", other: "لون آخر" },
  },
  en: {
    title: "Today's offers",
    intro: "Cars available right now from Korean auctions and dealers. Each offer stays live for 48 hours.",
    empty: "No live offers at this moment. Check back, we add cars regularly.",
    endsIn: "Ends in",
    expired: "Offer ended",
    archiveTitle: "Previous offers",
    askPrice: "Ask for price",
    inquire: "Ask about this car",
    specYear: "Year",
    specMileage: "Mileage",
    specTransmission: "Transmission",
    specFuel: "Fuel",
    specColor: "Colour",
    km: "km",
    d: "d",
    h: "h",
    m: "m",
    s: "s",
    waIntro: "Hello, I would like to ask about this car",
    transmission: { auto: "Automatic", manual: "Manual" },
    fuel: { petrol: "Petrol", diesel: "Diesel", hybrid: "Hybrid", electric: "Electric" },
    color: { white: "White", black: "Black", silver: "Silver", gray: "Grey", blue: "Blue", red: "Red", other: "Other" },
  },
  ru: {
    title: "Предложения дня",
    intro: "Автомобили, доступные сейчас с корейских аукционов и у дилеров. Каждое предложение живёт 48 часов.",
    empty: "Сейчас активных предложений нет. Заглядывайте, мы регулярно добавляем автомобили.",
    endsIn: "Осталось",
    expired: "Предложение завершено",
    archiveTitle: "Прошлые предложения",
    askPrice: "Уточнить цену",
    inquire: "Спросить об этом авто",
    specYear: "Год",
    specMileage: "Пробег",
    specTransmission: "Коробка",
    specFuel: "Топливо",
    specColor: "Цвет",
    km: "км",
    d: "д",
    h: "ч",
    m: "м",
    s: "с",
    waIntro: "Здравствуйте, хочу узнать про этот автомобиль",
    transmission: { auto: "Автомат", manual: "Механика" },
    fuel: { petrol: "Бензин", diesel: "Дизель", hybrid: "Гибрид", electric: "Электро" },
    color: { white: "Белый", black: "Чёрный", silver: "Серебристый", gray: "Серый", blue: "Синий", red: "Красный", other: "Другой" },
  },
  es: {
    title: "Ofertas de hoy",
    intro: "Coches disponibles ahora mismo de subastas y concesionarios de Corea. Cada oferta dura 48 horas.",
    empty: "No hay ofertas activas en este momento. Vuelve pronto, añadimos coches con frecuencia.",
    endsIn: "Termina en",
    expired: "Oferta terminada",
    archiveTitle: "Ofertas anteriores",
    askPrice: "Consultar precio",
    inquire: "Preguntar por este coche",
    specYear: "Año",
    specMileage: "Kilometraje",
    specTransmission: "Cambio",
    specFuel: "Combustible",
    specColor: "Color",
    km: "km",
    d: "d",
    h: "h",
    m: "min",
    s: "s",
    waIntro: "Hola, quiero información sobre este coche",
    transmission: { auto: "Automático", manual: "Manual" },
    fuel: { petrol: "Gasolina", diesel: "Diésel", hybrid: "Híbrido", electric: "Eléctrico" },
    color: { white: "Blanco", black: "Negro", silver: "Plata", gray: "Gris", blue: "Azul", red: "Rojo", other: "Otro" },
  },
  ko: {
    title: "오늘의 매물",
    intro: "한국 경매장과 딜러에서 지금 바로 가능한 차량입니다. 각 매물은 48시간 동안만 게시됩니다.",
    empty: "현재 진행 중인 매물이 없습니다. 차량은 수시로 올라오니 다시 확인해 주세요.",
    endsIn: "남은 시간",
    expired: "마감된 매물",
    archiveTitle: "지난 매물",
    askPrice: "가격 문의",
    inquire: "이 차량 문의하기",
    specYear: "연식",
    specMileage: "주행거리",
    specTransmission: "변속기",
    specFuel: "연료",
    specColor: "색상",
    km: "km",
    d: "일",
    h: "시간",
    m: "분",
    s: "초",
    waIntro: "안녕하세요, 이 차량에 대해 문의드립니다",
    transmission: { auto: "자동", manual: "수동" },
    fuel: { petrol: "가솔린", diesel: "디젤", hybrid: "하이브리드", electric: "전기" },
    color: { white: "흰색", black: "검정", silver: "은색", gray: "회색", blue: "파랑", red: "빨강", other: "기타" },
  },
};
