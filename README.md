# Royal Indian Wedding Web App (Replication of ScrollVite Forever Template)

A luxury, interactive digital wedding invitation web application faithfully reverse-engineered from [ScrollVite Template 4 ("Forever")](https://www.scrollvite.com/templates/wedding/4). Designed specifically for your sister's wedding with high-end animations, authentic textures, calligraphy typography, ambient background music, and an interactive customization suite.

---

## ✨ Features & Effects

- **Royal Sealed Envelope Opening (3D Physics)**:
  - Custom rose-gold textured envelope with metallic wax seal monogram.
  - Interactive "Tap to open" action triggering 3D envelope fold (`perspective: 1400px`, `rotateX(180deg)`), wax seal burst, radial light bloom, and smooth unfolding.
  - Optional "Skip" button for quick access.
- **Cinematic Hero Collage**:
  - Authentic photorealistic torn paper borders (`.fv-print--torn`) and realistic drop shadows.
  - Ken Burns slow cinematic zoom effect.
  - Parallax drift and rotation on scroll.
  - Couple's names rendered in royal custom script calligraphy (`Armelie-Regular.woff2`).
  - Auto-shrinking sticky rest bar as you scroll past the hero.
- **The Royal Invitation Card**:
  - Letter drawing up out of the golden floral envelope pocket on scroll.
  - Ceremony time, wedding date, venue, and direct Google Maps link.
  - "The Details" card with Attire ("Festive Indian or black tie"), "Add to Calendar" (Google Calendar link generator), and "Open in Maps".
- **"The Celebrations" (Events Deck)**:
  - Textured background with traditional Indian golden zari borders.
  - Festive jewel-toned cards (*Ivory*, *Rani Pink*, *Blush*, *Sindoor Red*).
  - Traditional Indian event motif illustrations (Mehendi cones, Ghungroo, Kalash, Rings, Haldi bowl, Safa, Chooda, etc.).
  - Individual "Open in Maps" links for each venue.
- **Live Wedding Countdown**:
  - Night sky backdrop with a rising golden half-mandala sun.
  - Live rolling 3D numbers for **Days, Hours, Minutes, and Seconds** ticking in real time to the wedding date.
  - Floating flickering golden diyas with ambient glow.
- **"A Note From Us" (Love Story & Polaroid Collage)**:
  - Romantic personal note from the bride and groom.
  - Polaroid-style photo collage with gold washi tape and botanical sprigs (fern and rose).
- **Blessings & Finale Replay**:
  - Grandparents' / family elders' blessings.
  - Grand finale animation: Rotating golden mandala rangoli unfurls with expanding circular clip-path, followed by the wax seal stamping down in 3D.
  - Closing message and "Seal the envelope again" replay button.
- **Ambient Wedding Music Player**:
  - Plays authentic shehnai & flute romantic wedding melody (`/audio/wedding_music.mp3`).
  - Circular floating music toggle with sound wave pinging animation and mute/unmute control.
  - Automatic playback with browser gesture activation.
- **Interactive In-App Wedding Customizer**:
  - Live in-app drawer to customize bride & groom names, dates, times, venue address, events, love note, elder blessings, couple photos, and audio.
  - Automatically saves to `localStorage` and includes a "Share" button to copy clean invite links.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for production
```bash
npm run build
```
The optimized bundle will be in `dist/`.

---

## 🎨 How to Personalize for Your Sister's Wedding

You have two convenient ways to customize the invitation:

### Option A: Using the In-App Visual Customizer (Recommended)
1. Launch the app (`npm run dev`).
2. Click the **"Customize Wedding"** button in the top-left corner.
3. Update:
   - **Bride's Name** (your sister) and **Groom's Name**.
   - **Wedding Date & Ceremony Time**.
   - **Main Venue, Address & Google Maps link**.
   - **Wedding Events** (add/edit Mehendi, Haldi, Sangeet, Wedding, Reception).
   - **RSVP Details** (Contact name, phone, deadline).
   - **Upload Couple Photos** (replaces photos in real time).
   - **Upload Custom Wedding Music** (optional .mp3).
4. All changes save automatically to your browser.
5. Click **"Share"** to copy the clean link for guests!

### Option B: Editing `src/config/defaultWedding.js`
Open `src/config/defaultWedding.js` and edit `DEFAULT_WEDDING_DATA`:
```javascript
export const DEFAULT_WEDDING_DATA = {
  hero: {
    bride_name: "Pooja",      // Your sister's name
    groom_name: "Anand",      // Groom's name
    kicker: "The wedding of",
  },
  countdown: {
    wedding_date: "2026-12-15", // Target wedding date (YYYY-MM-DD)
    start_time: "18:30",
  },
  photos: [
    { src: "/photos/couple-1.jpg" },
    { src: "/photos/couple-2.jpg" },
    { src: "/photos/couple-3.jpg" },
  ],
  ...
}
```

---

## 🌐 Deploying & Delivering to Guests

You can host this invitation for free on **Vercel**, **Netlify**, or **GitHub Pages**:

### Deploying to Vercel (Instant)
```bash
npx vercel
```
Or import this repository directly into [vercel.com](https://vercel.com). All assets, fonts, audio, and animations will work immediately out of the box with zero configuration!

