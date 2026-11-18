export const DEFAULT_LOOK = {
  id: "forever",
  envelope: "/templates/forever/envelope/",
};

export const EVENT_TONES = ["ivory", "rani", "blush", "sindoor"];

export const EVENT_OBJECTS = {
  mehendi: "Mehendi cones",
  haldi: "Haldi bowl",
  rings: "Rings",
  ghungroo: "Ghungroo",
  kalash: "Kalash",
  thali: "Puja thali",
  safa: "Safa & sehra",
  chooda: "Chooda & kaleere",
  cocktail: "Cocktail",
};

export const DEFAULT_WEDDING_DATA = {
  theme: {
    id: "royal-heritage",
    name: "Royal Heritage",
    couple_font: "playfair",
  },
  hero: {
    bride_name: "Tanuja K",
    groom_name: "Abhishek K N",
    kicker: "The wedding of",
    wedding_date: "2026-11-30",
    city: "Bengaluru",
    venue: "\"The AMARA\" NANDI LINK GROUNDS",
    hero_image: "/photos/hero_main_at.jpg?v=2",
  },
  countdown: {
    wedding_date: "2026-11-30",
    start_time: "09:30",
  },
  photos: [
    { src: "/photos/hero_main_at.jpg?v=2", objectPosition: "center 30%" },
    { src: "/photos/hero_back_at.jpg?v=2", objectPosition: "center center" },
    { src: "/photos/hero_front_at.jpg?v=2", objectPosition: "center center" },
    { src: "/photos/abhishek_tanuja/photo-1.jpg" },
  ],
  envelope: {
    monogram: "A & T",
    hint: "Tap wax seal to open invitation",
  },
  invitation: {
    intro: "|| Sri Nanjundeshwara Swamy Prasanna ||   || Sri Honnadevi Krupe ||",
    bride_full_name: "Chi. Sou. Tanuja K",
    bride_parents: "D/o Smt. Padmavathi H & Sri. Kemparaju N",
    groom_full_name: "Chi. Ry. Abhishek K N",
    groom_parents: "S/o Smt. Shakunthala & Sri. Nagaraja H (Grandson of Smt Late Kempamma & Sri Late Chikkahonnaiah)",
    message: "Solicit your gracious presence with family & friends on the auspicious occasion of the marriage of our son\nChi. Ry. Abhishek K N\nwith\nChi. Sou. Tanuja K\n(D/o Smt. Padmavathi H & Sri. Kemparaju N, No. 81, Avalahalli, Bangalore - 26)",
    time: "9:30 AM to 10:30 AM",
    venue: "\"The AMARA\" NANDI LINK GROUNDS",
    city: "Bengaluru",
    note: "Reception: Sunday, 29 Nov 2026 (7:00 PM onwards) · Muhurtham: Monday, 30 Nov 2026 (9:30 AM to 10:30 AM) · Beegaara Oota: Sunday, 13 Dec 2026 (12:00 PM onwards)",
  },
  details: {
    title: "Wedding Celebrations & Venue Itinerary",
    when_label: "When",
    when: "Sunday, 29 November 2026 · Reception / ಆರತಕ್ಷತೆ (7:00 PM onwards)\nMonday, 30 November 2026 · Muhurtham / ವಿವಾಹ ಮುಹೂರ್ತ (9:30 AM to 10:30 AM)\nSunday, 13 December 2026 · Beegaara Oota / ಬೀಗರ ಊಟ (12:00 PM onwards)",
    where_label: "Where",
    where: "\"The AMARA\" NANDI LINK GROUNDS\nPanthar Palya, Nayandahalli, Mysore Road\nBengaluru, Karnataka - 560039",
    address: "\"The AMARA\" NANDI LINK GROUNDS, Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
    attire: "Traditional Festive & Indian Formal",
    attire_label: "Attire",
    map_url: "https://maps.google.com/?q=Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039",
    rsvp_by: "25 November 2026",
    rsvp_name: "Smt. Shakunthala & Sri. Nagaraja H / Smt. Padmavathi H & Sri. Kemparaju N",
    rsvp_phone: "9845245268, 9901083528",
    closing: "Awaiting your presence: Smt Shakunthala & Sri. Nagaraja H & Smt. Padmavathi H & Sri. Kemparaju N",
    show_map: true,
    show_calendar: true,
    card_map_url: "https://maps.google.com/?q=Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039",
  },
  events: {
    heading: "The Celebrations",
    intro: "Join Us For Every Auspicious Moment",
    items: [
      {
        name: "Reception / ಆರತಕ್ಷತೆ",
        date: "Sunday, 29 November 2026",
        time: "7:00 PM onwards",
        venue: "\"The AMARA\" NANDI LINK GROUNDS",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
        map_url: "https://maps.google.com/?q=Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039",
        tone: "sindoor",
        object: "rings",
      },
      {
        name: "Muhurtham / ವಿವಾಹ ಮುಹೂರ್ತ",
        date: "Monday, 30 November 2026",
        time: "9:30 AM to 10:30 AM",
        venue: "\"The AMARA\" NANDI LINK GROUNDS",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
        map_url: "https://maps.google.com/?q=Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039",
        tone: "ivory",
        object: "thali",
      },
      {
        name: "Beegaara Oota / ಬೀಗರ ಊಟ",
        date: "Sunday, 13 December 2026",
        time: "12:00 PM onwards",
        venue: "\"Sambhrama\" Nandi Link Grounds",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bangalore - 560039",
        map_url: "https://maps.google.com/?q=Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039",
        tone: "rani",
        object: "kalash",
      },
    ],
  },
  note: {
    heading: "A Note From Abhishek & Tanuja",
    message: "With the divine grace of Sri Nanjundeshwara Swamy and Sri Honnadevi, and the blessings of our beloved elders, we begin our new journey together.\nYour presence and blessings will make our special day complete.",
    signoff: "With love & respect,",
    photo: "/photos/hero_main_at.jpg",
  },
  blessings: {
    heading: "With the heavenly blessings of",
    names: "|| Sri Nanjundeshwara Swamy Prasanna ||   || Sri Honnadevi Krupe ||\nSmt Late Kempamma & Sri Late Chikkahonnaiah\nSmt Shakunthala & Sri. Nagaraja H\nSmt. Padmavathi H & Sri. Kemparaju N",
  },
  extras: [],
  audio_url: "/audio/kannada_neenaade_naa.mp3",
};

export function parseIsoDate(str) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str || "");
  if (!match) return null;
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function countdownTarget(dateObj, timeStr) {
  const match = /^(\d{1,2}):(\d{2})/.exec(timeStr || "");
  const target = new Date(dateObj);
  if (match) {
    target.setHours(Math.min(23, Number(match[1])), Math.min(59, Number(match[2])), 0, 0);
  }
  return target;
}

export function shortDate(d) {
  if (!d) return "";
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export function formalDateLines(d) {
  if (!d) return ["", ""];
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return [weekday, `${d.getDate()} ${month} ${d.getFullYear()}`];
}

export function calendarUrl(dateObj, title, location, description) {
  if (!dateObj) return "";
  const nextDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1);
  const rx = d =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${rx(dateObj)}/${rx(nextDay)}`,
    location: location || "",
    details: description || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mapsUrl(url, venue, address, city) {
  if (url && url.trim()) return url.trim();
  const parts = [venue, address || city].filter(Boolean).join(", ");
  return parts ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}` : "";
}

export function autoDetails(schema) {
  const d = parseIsoDate(schema.date || schema.countdown?.wedding_date);
  return {
    when: [d ? shortDate(d) : "", schema.invitation?.time].filter(Boolean).join("\n"),
    where: [schema.invitation?.venue, schema.details?.address || schema.invitation?.city].filter(Boolean).join("\n"),
  };
}

export const getInitial = (str) => {
  const trimmed = (str || "").trim();
  return (Array.from(trimmed)[0] || "").toUpperCase();
};
