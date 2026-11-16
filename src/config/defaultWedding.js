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

const isVyomaHost = typeof window !== 'undefined' && window.location.hostname.includes('vyoma');

export const DEFAULT_WEDDING_DATA = {
  theme: {
    id: "royal-heritage",
    name: "Royal Heritage",
    couple_font: "playfair", // 'playfair' | 'greatvibes' | 'cinzel' | 'vandella' | 'bodoni'
  },
  hero: {
    bride_name: "Tanuja K",
    groom_name: "Abhishek K N",
    kicker: "The wedding of",
  },
  countdown: {
    wedding_date: "2026-11-30",
    start_time: "09:30",
  },
  photos: [
    { src: "/photos/couple-1.jpg", objectPosition: "center 30%" },
    { src: "/photos/couple-2.jpg", objectPosition: "center center" },
    { src: "/photos/couple-3.jpg", objectPosition: "center center" },
    { src: "/photos/abhishek_tanuja/photo-1.jpg" },
    { src: "/photos/abhishek_tanuja/photo-2.jpg" },
    { src: "/photos/abhishek_tanuja/photo-3.jpg" },
    { src: "/photos/abhishek_tanuja/photo-4.jpg" },
  ],
  envelope: {
    monogram: "A & T",
    hint: "Tap to open",
  },
  invitation: {
    intro: "|| Sri Nanjundeshwara Swamy Prasanna ||  || Sri Honnadevi Krupe ||",
    bride_full_name: "Tanuja K",
    bride_parents: "D/o Smt. Padmavathi H & Sri. Kemparaju N",
    groom_full_name: "Abhishek K N",
    groom_parents: "S/o Smt. Shakunthala & Sri. Nagaraja H (Grandson of Smt Late Kempamma & Sri Late Chikkahonnaiah)",
    message: "Solicit your gracious presence with family & friends on the auspicious occasion of the marriage of our son\nChi. Ry. Abhishek K N\nwith\nChi. Sou. Tanuja K",
    time: "9:30 AM – 10:30 AM",
    venue: "\"The AMARA\" NANDI LINK GROUNDS",
    city: "Bengaluru",
    note: "Reception: Sunday, 29 Nov (7:00 PM onwards) · Muhurtham: Monday, 30 Nov (9:30 AM – 10:30 AM) · Beegaara Oota: Sunday, 13 Dec (12:00 PM onwards)",
  },
  details: {
    title: "The Details",
    when_label: "When",
    when: "Sunday, 29 November 2026 · Reception (7:00 PM onwards)\nMonday, 30 November 2026 · Muhurtham (9:30 AM – 10:30 AM)\nSunday, 13 December 2026 · Beegaara Oota (12:00 PM onwards)",
    where_label: "Where",
    where: "\"The AMARA\" NANDI LINK GROUNDS\nPanthar Palya, Nayandahalli, Mysore Road\nBengaluru, Karnataka 560039",
    address: "\"The AMARA\" NANDI LINK GROUNDS, Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
    attire: "Traditional Indian & Festive Formal",
    attire_label: "Attire",
    map_url: "#venue-map",
    rsvp_by: "25 November 2026",
    rsvp_name: "Smt. Shakunthala & Sri. Nagaraja H / Smt. Padmavathi H & Sri. Kemparaju N",
    rsvp_phone: "9845245268, 9901083528",
    closing: "Awaiting your gracious presence with love and blessings.",
    show_map: true,
    show_calendar: true,
    card_map_url: "#venue-map",
  },
  events: {
    heading: "The Celebrations",
    intro: "Join Us For Every Cherished Moment",
    items: [
      {
        name: "The Reception / ಆರತಕ್ಷತೆ",
        date: "Sunday, 29 November 2026",
        time: "7:00 PM onwards",
        venue: "\"The AMARA\" NANDI LINK GROUNDS",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
        map_url: "#venue-map",
        tone: "sindoor",
        object: "rings",
      },
      {
        name: "The Wedding Muhurtham / ವಿವಾಹ ಮುಹೂರ್ತ",
        date: "Monday, 30 November 2026",
        time: "9:30 AM – 10:30 AM",
        venue: "\"The AMARA\" NANDI LINK GROUNDS",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bengaluru - 560039",
        map_url: "#venue-map",
        tone: "ivory",
        object: "thali",
      },
      {
        name: "Beegaara Oota / ಬೀಗರ ಊಟದ ಕೂಟ",
        date: "Sunday, 13 December 2026",
        time: "12:00 PM onwards",
        venue: "\"Sambhrama\" Nandi Link Grounds",
        address: "Panthar Palya, Nayandahalli, Mysore Road, Bangalore - 560039",
        map_url: "#venue-map",
        tone: "rani",
        object: "kalash",
      },
    ],
  },
  note: {
    heading: "A Note From Us",
    message: "You have watched us grow, laughed with us, and loved us through every chapter. It would mean the world to have you beside us as we begin this new one.\nCome hungry, come ready to dance, and bring your brightest smile.",
    signoff: "With love,",
    photo: "/photos/couple-1.jpg",
  },
  blessings: {
    heading: "With the heavenly blessings of",
    names: "|| Sri Nanjundeshwara Swamy Prasanna ||  || Sri Honnadevi Krupe ||\nSmt Late Kempamma & Sri Late Chikkahonnaiah\nOur Beloved Parents, Grandparents & Family",
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
