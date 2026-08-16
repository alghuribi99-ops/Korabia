import type { Dict } from "./types";

export const en: Dict = {
  meta: {
    title: "Korabia | Car export from Korea and China to the Middle East",
    description:
      "We source the right car from Korean auctions and dealers, inspect it on the ground with a documented report, and ship it from Incheon to your port with no middlemen and full tracking until delivery.",
    keywords:
      "import cars from Korea, Korean car auction, car export Korea, ship car from Incheon, used Korean cars, import cars from China, korabia",
  },
  hours: { kr: "10:00 to 20:00 Korea time", sa: "04:00 to 14:00 Gulf time", city: "Incheon, South Korea" },
  cta: { request: "Request a car", whatsapp: "Message on WhatsApp" },
  nav: ["Services", "How it works", "Vehicles", "Korea services", "FAQ"],
  hero: {
    headline: ["Your car from Korea,", "no middlemen."],
    sub: "We find it, inspect it on the ground, and ship it from Incheon to your port with full tracking until you take delivery.",
    alt: "Rows of new cars on a Korean export terminal quay with a car carrier vessel behind them",
  },
  services: {
    eyebrow: "Services",
    title: "Four services, each with a named owner",
    items: [
      { title: "Korean car auction", en: "Auction", body: "We attend the auction on your behalf after inspecting and valuing the car, and bid to a ceiling price you set in advance.", alt: "A Korean car auction hall with rows of vehicles on display" },
      { title: "Inspection and valuation", en: "Inspection", body: "A photo report covering body, engine, paint thickness and vehicle history, sent to you before any financial commitment.", alt: "An inspector using a paint thickness gauge on a car" },
      { title: "Shipping and export", en: "Shipping", body: "Booking the shipment, clearing it out of Incheon, and preparing and tracking the paperwork through to the arrival port.", alt: "A car on the export terminal apron with port cranes behind" },
      { title: "Commercial sourcing", en: "Sourcing", body: "Spare parts, wholesale goods and Korean products, coordinated directly with suppliers under clear contracts.", alt: "A Seoul street in the early morning" },
    ],
  },
  process: {
    title: "From the auction to your door",
    intro: "Four clear stages, and you know where your car sits in every one of them.",
    steps: [
      { n: "01", title: "Brief and specification", body: "You set the model, year and budget, and we shortlist realistic options that are actually available in the Korean market." },
      { n: "02", title: "Inspection and bidding", body: "We inspect the car in person and send you the report, then bid at the auction up to the ceiling you agreed." },
      { n: "03", title: "Clearance and shipping", body: "We prepare the export documents and book the shipment from Incheon to the arrival port you name." },
      { n: "04", title: "Delivery", body: "We track the shipment with you until it lands and hand over every document your local customs will ask for." },
    ],
    closing: "Start with stage one now",
  },
  vehicles: {
    title: "We import the category that fits how you drive",
    intro:
      "Availability shifts weekly with the auctions and dealers. Tell us the category and model and we come back with real options open right now.",
    items: [
      { title: "Family sedan", en: "Family Sedan", note: "The most requested from Korean auctions", alt: "A dark graphite family sedan" },
      { title: "SUV and crossover", en: "SUV", note: "Seven seat options available", alt: "A pearl white family SUV" },
      { title: "Executive sedan", en: "Executive Sedan", note: "Extra engine and transmission checks", alt: "A long navy blue executive sedan" },
      { title: "Electric", en: "Electric", note: "Battery health report included", alt: "A light grey electric crossover" },
      { title: "Commercial van", en: "Commercial Van", note: "For companies and trade use", alt: "A white commercial panel van" },
      { title: "Pickup", en: "Pickup", note: "Double cab, four wheel drive", alt: "A dark grey double cab pickup truck" },
    ],
  },
  why: {
    eyebrow: "Why Korabia",
    title: "Transparency before price",
    body: "Most import problems start with a missing fact: an undisclosed accident, an odometer that does not match, or a fee that appears after the car has shipped. Our method is simple. You get the full picture before you pay, and the decision stays yours.",
    macroAlt: "Close crop of a headlight edge and car paintwork during inspection",
    pillars: [
      { title: "No middlemen", body: "We deal directly with Korean dealers and auctions, so there is no hidden agent margin buried in the price." },
      { title: "Documented inspection", body: "Photos, video and a written condition report reach you before the purchase, not after it." },
      { title: "People on the ground", body: "Our team is based in Incheon, which means a real presence at the auction and direct oversight of the shipment." },
    ],
  },
  korea: {
    title: "What else we handle in Korea",
    intro: "The same company that ships your car can coordinate the rest of your needs while you are in Korea.",
    items: [
      { title: "Translator", en: "Translator", body: "Korean interpreting for meetings, showrooms and official appointments." },
      { title: "Personal driver", en: "Personal Driver", body: "Getting around Seoul, Incheon and the industrial cities with a driver who knows the route." },
      { title: "Accommodation", en: "Residential", body: "Apartments and hotels booked close to where you need to be, for the length of your stay." },
      { title: "Travel plan", en: "Travel Plan", body: "A visit built around your days and your interests, not an off the shelf tour." },
      { title: "Coordinator", en: "Coordinator", body: "One person responsible for your schedule and transport for the whole trip." },
      { title: "Hospitals", en: "Hospitals", body: "Medical appointments in Korea, with someone to accompany and interpret for you." },
      { title: "Study", en: "Study", body: "Placement at language institutes and universities, plus the residence paperwork." },
      { title: "Products", en: "Products", body: "Buying and shipping Korean goods and spare parts, wholesale or in small quantities." },
    ],
  },
  request: {
    eyebrow: "Car request",
    title: "Tell us what you are after and we come back with options",
    sub: "Fill this in and we will reach you on WhatsApp with options and indicative prices. Nothing is committed at this stage.",
    fields: {
      name: "Name",
      phone: "WhatsApp number with country code",
      country: "Country and arrival port",
      category: "Vehicle category",
      model: "Model and year you want",
      budget: "Indicative budget",
      notes: "Anything else",
    },
    placeholders: {
      phone: "966500000000",
      country: "Saudi Arabia, Dammam port",
      model: "Sonata 2021 or similar",
      budget: "In USD or local currency",
      notes: "Preferred colour, mileage ceiling, anything that matters to you",
    },
    other: "Something else",
    optional: "optional",
    submit: "Send request",
    sending: "Sending",
    successTitle: "We have your request",
    successBody: "We will contact you on the number you gave us. Want a faster reply? Open the chat directly.",
    errorBody: "We could not take the request just now. Try again or message us on WhatsApp.",
    another: "Send another request",
    waSummary: { heading: "Car request from the website", name: "Name", category: "Category", wanted: "Wanted", destination: "Destination", budget: "Budget" },
    waGeneral: "Hello, I would like to ask about importing a car from Korea",
  },
  faq: {
    title: "What every client asks before the first order",
    items: [
      { q: "How long does the car take to arrive?", a: "It depends on the arrival port and the shipping line schedule. We give you a clear estimate before booking the shipment and tell you if the schedule moves." },
      { q: "Can I see the car before I buy it?", a: "Yes. We send photos, video and a written report covering body and engine condition, paint thickness, odometer reading and vehicle history, before any payment." },
      { q: "How does payment work?", a: "In stages tied to concrete steps: one at purchase confirmation and one at shipping. We explain each stage and its amount before it begins." },
      { q: "Do you ship to every Gulf country?", a: "We ship to Middle East ports. Send us the arrival port you want and we confirm the route and the indicative cost." },
      { q: "Do you import from China as well?", a: "Yes. We cover South Korea and China, and the choice between them depends on the model you want and your budget." },
      { q: "What about customs duty in my country?", a: "Customs duty is paid in the country of arrival and differs from one country to another. We prepare every document your clearance needs and set out exactly what our price does and does not cover." },
    ],
  },
  footer: {
    tagline: "Car export from Korea and China to the Middle East.",
    rights: "Korabia. All rights reserved.",
    contactHeading: "Contact",
    sectionsHeading: "Sections",
    languagesHeading: "Languages",
  },
  notFound: { code: "404", title: "Page not found", body: "That link is wrong or the page has moved.", home: "Back to home" },
  errorPage: { title: "This page did not load", body: "Something went wrong on our side. Try refreshing.", retry: "Try again", home: "Home" },
};
