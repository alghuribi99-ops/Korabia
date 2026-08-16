/** All visible copy for the Korabia site, in one place. */

export const CONTACT = {
  whatsappDigits: "821066679149",
  whatsappDisplay: "+82 10 6667 9149",
  email: "info@korabia.co",
  city: "إنشون، كوريا الجنوبية",
  hoursKr: "10:00 حتى 20:00 بتوقيت كوريا",
  hoursSa: "04:00 حتى 14:00 بتوقيت السعودية",
  social: [
    { label: "انستقرام", href: "https://instagram.com/korabia.services" },
    { label: "إكس", href: "https://x.com/korabia_service" },
    { label: "فيسبوك", href: "https://facebook.com/102333592638814" },
    { label: "يوتيوب", href: "https://youtube.com/channel/UC6uUVXG_RIwRbUrQLhYqYUg" },
  ],
} as const;

export function whatsappLink(message: string) {
  return "https://wa.me/" + CONTACT.whatsappDigits + "?text=" + encodeURIComponent(message);
}

export const CTA = { request: "اطلب سيارتك", whatsapp: "واتساب مباشر" } as const;

export const NAV = [
  { label: "الخدمات", href: "#services" },
  { label: "كيف نعمل", href: "#process" },
  { label: "السيارات", href: "#vehicles" },
  { label: "خدمات كوريا", href: "#korea" },
  { label: "الأسئلة", href: "#faq" },
] as const;

export const HERO = {
  headline: ["سيارتك من كوريا،", "بدون وسطاء."],
  sub: "نبحث عنها، نفحصها فحصاً موثقاً، ونشحنها من ميناء إنشون إلى مينائك مع متابعة كاملة حتى الاستلام.",
} as const;

export type Service = { id: string; title: string; en: string; body: string; image: string; alt: string };

export const SERVICES: Service[] = [
  {
    id: "auction",
    title: "مزاد السيارات في كوريا",
    en: "Korean Car Auction",
    body: "نحضر المزاد نيابة عنك بعد فحص السيارة وتقييمها، ونزايد بسقف سعر تحدده أنت مسبقاً.",
    image: "/assets/service-auction.webp",
    alt: "صالة مزاد سيارات في كوريا وصفوف من السيارات المعروضة",
  },
  {
    id: "inspection",
    title: "الفحص والتقييم",
    en: "Inspection & Valuation",
    body: "تقرير مصور بحالة الهيكل والمحرك وسماكة الطلاء وسجل السيارة، يصلك قبل أي التزام مالي.",
    image: "/assets/service-inspection.webp",
    alt: "فاحص يستخدم جهاز قياس سماكة الطلاء على سيارة",
  },
  {
    id: "shipping",
    title: "الشحن والتصدير",
    en: "Shipping & Export",
    body: "حجز الشحنة، التخليص من ميناء إنشون، وتجهيز الوثائق ومتابعتها حتى ميناء الوصول.",
    image: "/assets/service-shipping.webp",
    alt: "سيارة على ساحة ميناء التصدير مع رافعات الميناء في الخلفية",
  },
  {
    id: "commercial",
    title: "التنسيق التجاري",
    en: "Commercial Sourcing",
    body: "قطع غيار وبضائع بالجملة ومنتجات كورية، بتنسيق مباشر مع الموردين وبعقود واضحة.",
    image: "/assets/service-commercial.webp",
    alt: "شارع في سيول في الصباح الباكر",
  },
];

export const PROCESS = {
  title: "من المزاد إلى بابك",
  intro: "أربع مراحل واضحة، وأنت تعرف موقع سيارتك في كل واحدة منها.",
  steps: [
    { n: "01", title: "الطلب والمواصفات", body: "تحدد الموديل والسنة والميزانية، ونرشح لك خيارات واقعية متوفرة فعلاً في السوق الكوري." },
    { n: "02", title: "الفحص والمزايدة", body: "نفحص السيارة على أرض الواقع ونرسل لك التقرير، ثم نشارك في المزاد بسقف السعر المتفق عليه." },
    { n: "03", title: "التخليص والشحن", body: "نجهز وثائق التصدير ونحجز الشحنة من ميناء إنشون إلى ميناء الوصول الذي تحدده." },
    { n: "04", title: "الاستلام", body: "نتابع الشحنة معك حتى الوصول، ونسلمك كل المستندات المطلوبة للتخليص الجمركي في بلدك." },
  ],
  closing: "ابدأ بالمرحلة الأولى الآن",
} as const;

export type Vehicle = { id: string; title: string; en: string; note: string; image: string; alt: string };

export const VEHICLES: Vehicle[] = [
  { id: "sedan", title: "سيدان عائلية", en: "Family Sedan", note: "الأكثر طلباً من المزادات الكورية", image: "/assets/car-sedan.webp", alt: "سيارة سيدان عائلية بلون رمادي داكن" },
  { id: "suv", title: "دفع رباعي وعائلي", en: "SUV", note: "خيارات سبع مقاعد متوفرة", image: "/assets/car-suv.webp", alt: "سيارة دفع رباعي عائلية بلون أبيض لؤلؤي" },
  { id: "luxury", title: "سيدان فاخرة", en: "Executive Sedan", note: "فحص إضافي للمحرك وناقل الحركة", image: "/assets/car-luxury.webp", alt: "سيارة سيدان فاخرة طويلة بلون كحلي" },
  { id: "ev", title: "سيارات كهربائية", en: "Electric", note: "نرفق تقرير صحة البطارية", image: "/assets/car-ev.webp", alt: "سيارة كروس أوفر كهربائية بلون رمادي فاتح" },
  { id: "van", title: "فان تجاري", en: "Commercial Van", note: "للشركات والاستخدام التجاري", image: "/assets/car-van.webp", alt: "فان تجاري أبيض" },
  { id: "pickup", title: "بيك أب", en: "Pickup", note: "غرفتين ودفع رباعي", image: "/assets/car-pickup.webp", alt: "سيارة بيك أب بغرفتين بلون رمادي داكن" },
];

export const WHY = {
  eyebrow: "لماذا كورابيا",
  title: "الشفافية قبل السعر",
  body: "أغلب مشاكل الاستيراد تبدأ من معلومة ناقصة: حادث غير مذكور، عداد غير مطابق، أو رسوم تظهر بعد الشحن. طريقتنا بسيطة، نعطيك الصورة كاملة قبل أن تدفع، وأنت من يقرر.",
  pillars: [
    { title: "بدون وسطاء", body: "نتعامل مباشرة مع المعارض والمزادات في كوريا، فلا يوجد هامش وسيط مخفي في السعر." },
    { title: "فحص موثق", body: "صور وفيديو وتقرير مكتوب لحالة السيارة يصلك قبل الشراء، وليس بعده." },
    { title: "حضور على الأرض", body: "فريقنا مقره إنشون، وهذا يعني حضوراً فعلياً في المزاد ومتابعة مباشرة للشحن." },
  ],
} as const;

export type KoreaService = { title: string; en: string; body: string; icon: string };

export const KOREA_TITLE = "خدماتنا الأخرى في كوريا";
export const KOREA_INTRO =
  "الشركة نفسها التي تشحن سيارتك تستطيع تنسيق بقية احتياجاتك أثناء وجودك في كوريا.";

export const KOREA_SERVICES: KoreaService[] = [
  { title: "مترجم", en: "Translator", body: "ترجمة عربية كورية للاجتماعات والمعارض والمواعيد الرسمية.", icon: "/assets/icon-translate.webp" },
  { title: "سائق خاص", en: "Personal Driver", body: "تنقل داخل سيول وإنشون والمدن الصناعية بسائق يعرف الطريق.", icon: "/assets/icon-wheel.webp" },
  { title: "السكن", en: "Residential", body: "حجز شقق وفنادق قريبة من وجهتك وبما يناسب مدة إقامتك.", icon: "/assets/icon-house.webp" },
  { title: "خطة سياحية", en: "Travel Plan", body: "برنامج زيارة مرتب حسب أيامك واهتماماتك، وليس جولة جاهزة.", icon: "/assets/icon-key.webp" },
  { title: "منسق", en: "Coordinator", body: "شخص واحد مسؤول عن ترتيب مواعيدك وتنقلاتك طوال الرحلة.", icon: "/assets/icon-clipboard.webp" },
  { title: "مستشفيات", en: "Hospitals", body: "حجز المواعيد الطبية في كوريا ومرافقة وترجمة أثناء الزيارة.", icon: "/assets/icon-doc.webp" },
  { title: "الدراسة", en: "Study", body: "تنسيق القبول في معاهد اللغة والجامعات وترتيب أوراق الإقامة.", icon: "/assets/icon-gavel.webp" },
  { title: "منتجات", en: "Products", body: "شراء وشحن منتجات كورية وقطع غيار بالجملة أو بكميات صغيرة.", icon: "/assets/icon-ship.webp" },
];

export const REQUEST = {
  eyebrow: "طلب سيارة",
  title: "خبرنا وش تدور، ونرجع لك بخيارات",
  sub: "املأ الطلب وسنتواصل معك على الواتساب بخيارات وأسعار تقديرية. لا يوجد أي التزام في هذه المرحلة.",
  fields: {
    name: "الاسم",
    phone: "رقم الواتساب مع مفتاح الدولة",
    country: "الدولة وميناء الوصول",
    category: "نوع السيارة",
    model: "الموديل والسنة المطلوبة",
    budget: "الميزانية التقديرية",
    notes: "ملاحظات إضافية",
  },
  placeholders: {
    phone: "966500000000",
    country: "السعودية، ميناء الدمام",
    model: "سوناتا 2021 أو ما يقاربها",
    budget: "بالدولار أو بالريال",
    notes: "لون مفضل، حد أقصى للممشى، أي شيء يهمك",
  },
  optional: "اختياري",
  submit: "أرسل الطلب",
  sending: "جاري الإرسال",
  successTitle: "وصلنا طلبك",
  successBody: "سنتواصل معك على الرقم الذي كتبته. تحب تستعجل الرد؟ افتح المحادثة مباشرة.",
  errorBody: "ما قدرنا نستقبل الطلب الآن. جرب مرة ثانية أو راسلنا على الواتساب.",
  another: "أرسل طلباً آخر",
} as const;

export const FAQ_TITLE = "أسئلة يسألها كل عميل قبل أول طلب";

export const FAQ: { q: string; a: string }[] = [
  { q: "كم يستغرق وصول السيارة؟", a: "المدة تعتمد على ميناء الوصول وجدول خط الشحن. نعطيك تقديراً واضحاً للمدة قبل حجز الشحنة، ونحدثك إذا تغير الجدول." },
  { q: "هل أقدر أشوف السيارة قبل ما أشتريها؟", a: "نعم. نرسل لك صوراً وفيديو وتقريراً مكتوباً يشمل حالة الهيكل والمحرك وسماكة الطلاء وقراءة العداد وسجل السيارة، قبل أي دفعة." },
  { q: "كيف تتم عملية الدفع؟", a: "على مراحل مرتبطة بخطوات ملموسة: مرحلة عند تأكيد الشراء ومرحلة عند الشحن. نوضح كل مرحلة ومبلغها قبل أن تبدأ." },
  { q: "هل تشحنون إلى كل دول الخليج؟", a: "نشحن إلى موانئ الشرق الأوسط. أرسل لنا ميناء الوصول الذي تريده ونؤكد لك توفر الخط والتكلفة التقديرية." },
  { q: "هل تستوردون من الصين أيضاً؟", a: "نعم. نغطي كوريا الجنوبية والصين، والاختيار بينهما يعتمد على الموديل المطلوب وميزانيتك." },
  { q: "ماذا عن الرسوم الجمركية في بلدي؟", a: "الرسوم الجمركية تدفع في بلد الوصول وتختلف من دولة لأخرى. نجهز لك كل المستندات المطلوبة للتخليص ونوضح ما الذي يشمله سعرنا وما الذي لا يشمله." },
];

export const FOOTER = {
  tagline: "تصدير السيارات من كوريا والصين إلى الشرق الأوسط.",
  rights: "كورابيا. جميع الحقوق محفوظة.",
} as const;
