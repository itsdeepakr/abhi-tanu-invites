import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check, ExternalLink } from 'lucide-react';

const VENUE_NAME = "\"The AMARA\" NANDI LINK GROUNDS";
const VENUE_ADDRESS = "Panthar Palya, Nayandahalli, Mysore Road, Bengaluru, Karnataka 560039";
const MAPS_APP_URL = "https://www.google.com/maps/search/?api=1&query=The+AMARA+Nandi+Link+Grounds+Panthar+Palya+Nayandahalli+Mysore+Road+Bengaluru+560039";
const EMBED_MAP_SRC = "https://maps.google.com/maps?q=The+AMARA+Nandi+Link+Grounds+Nayandahalli+Mysore+Road+Bengaluru+560039&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function VenueMapSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${VENUE_NAME}, ${VENUE_ADDRESS}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="venue-map"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-[#250817] text-[#FFFDF8] overflow-hidden"
      aria-label="Venue location and directions map"
      style={{
        backgroundImage: 'radial-gradient(ellipse at top center, rgba(166, 124, 69, 0.22) 0%, rgba(37, 8, 23, 0.98) 75%)',
      }}
    >
      {/* Royal Gold Zari Divider at Top */}
      <div className="fv-zari absolute top-0 left-0 right-0 w-full pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto z-10 text-center">
        {/* Section Header Motif */}
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <MapPin className="w-5 h-5 text-[#E8C877]" />
          <span className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.28em] text-[#F4D9A6]">
            Venue & Route Guide
          </span>
          <MapPin className="w-5 h-5 text-[#E8C877]" />
        </div>

        {/* Venue Title with Grand Typography */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFFDF8] tracking-wide drop-shadow-md"
          style={{ fontFamily: 'var(--fv-names, "Playfair Display"), Georgia, serif' }}
        >
          {VENUE_NAME}
        </h2>

        {/* Subtitle clarifying ceremonies */}
        <p className="text-xs sm:text-sm text-[#FFE58F] font-serif font-medium mt-1.5 uppercase tracking-wider">
          Venue for The Reception (Sunday, 29 Nov 2026) & Wedding Muhurtham (Monday, 30 Nov 2026)
        </p>

        {/* Address Card */}
        <div className="mt-4 max-w-2xl mx-auto p-4 rounded-2xl bg-black/35 border border-[#D4AF37]/40 shadow-inner">
          <p className="text-xs sm:text-sm text-[#FFFDF8]/90 font-serif leading-relaxed">
            {VENUE_ADDRESS}
          </p>
        </div>

        {/* Embedded Google Map Frame */}
        <motion.div
          className="mt-7 relative rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_16px_40px_rgba(0,0,0,0.6)] bg-black/50 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <iframe
            src={EMBED_MAP_SRC}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="The AMARA Nandi Link Grounds Location Map"
            className="w-full block"
          />
        </motion.div>

        {/* Map Quick Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {/* Direct Launch to Google Maps App for Turn-by-Turn GPS Directions */}
          <a
            href={MAPS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif font-bold text-[#1E0812] bg-gradient-to-r from-[#FFFDF8] via-[#F5DE98] to-[#E6C364] hover:brightness-110 shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer border border-[#D4AF37]"
            aria-label="Open in Google Maps for live directions"
          >
            <Navigation className="w-4 h-4 text-[#8B5A2B]" />
            <span>Open in Google Maps App (Directions)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Copy Address Button */}
          <button
            type="button"
            onClick={handleCopyAddress}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-serif font-semibold text-[#FFFDF8] bg-white/10 hover:bg-white/20 border border-[#D4AF37]/60 shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            aria-label="Copy venue address"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Address Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#F4D9A6]" />
                <span>Copy Address</span>
              </>
            )}
          </button>
        </div>

        {/* Landmark & Parking Note */}
        <p className="mt-4 text-[11px] sm:text-xs text-[#F4D9A6]/75 font-serif">
          Located along Mysore Road, Panthar Palya, Nayandahalli. Dedicated guest parking and drop-off zone available at the entrance.
        </p>
      </div>

      {/* Royal Gold Zari Divider at Bottom */}
      <div className="fv-zari absolute bottom-0 left-0 right-0 w-full pointer-events-none" aria-hidden="true" />
    </section>
  );
}
