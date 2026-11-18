import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import Monogram from './Monogram';
import { transitionVariants } from './TornPhoto';
import { ScrollContext, ParallaxDrift } from '../context/ScrollContext';
import { useCouple } from '../context/CoupleContext';

export default function BlessingsFinale({
  schema,
  onReplay,
  envelopePath = '/templates/forever/envelope/',
}) {
  const eventItems = schema.events?.items || [];
  const firstEvDate = eventItems[0]?.date ? (eventItems[0].date.includes(',') ? eventItems[0].date.split(',')[1].trim() : eventItems[0].date) : '29 November 2026';
  const secondEvDate = eventItems[1]?.date ? (eventItems[1].date.includes(',') ? eventItems[1].date.split(',')[1].trim() : eventItems[1].date) : '30 November 2026';
  const city = schema.hero?.city || 'Bengaluru';
  const finaleDateText = eventItems.length >= 2
    ? `${firstEvDate.replace(/\s*\d{4}$/, '')} & ${secondEvDate} · ${city}`
    : `29 – 30 November 2026 · ${city}`;
  const sealRef = useRef(null);
  const namesRef = useRef(null);
  const [inView, setInView] = useState(false);
  const ctx = useContext(ScrollContext);

  useEffect(() => {
    const el = sealRef.current;
    if (!el) return;

    const rootEl = ctx?.container?.current ?? null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          setInView(true);
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > (entry.rootBounds?.top ?? 0)) {
          setInView(false);
        }
      },
      {
        root: rootEl,
        threshold: [0, 0.5],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ctx?.container]);

  const hero = schema.hero || {};
  const details = schema.details || {};
  const blessings = schema.blessings || {};
  const envelope = schema.envelope || {};

  const couple = useCouple();
  const brideName = hero.bride_name || couple.bride || 'Bride';
  const groomName = hero.groom_name || couple.groom || 'Groom';

  const blessingNames = (blessings.names || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const rangoliVariants = {
    away: {
      clipPath: 'circle(0% at 50% 50%)',
      rotate: -24,
      transition: { duration: 1.3, ease: [0.5, 0, 0.75, 0.9], delay: 0.45 },
    },
    here: {
      clipPath: 'circle(71% at 50% 50%)',
      rotate: 0,
      transition: { duration: 1.6, ease: [0.3, 0.1, 0.25, 1] },
    },
  };

  const sealVariants = {
    away: {
      opacity: 0,
      scale: 1.45,
      rotate: -14,
      transition: { duration: 0.55, ease: [0.5, 0, 0.8, 0.6] },
    },
    here: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.95, ease: [0.2, 0.9, 0.25, 1], delay: 1.05 },
    },
  };

  return (
    <section className="fv-details" aria-label="Blessings">
      <div className="fv-zari" aria-hidden="true" />

      {/* Traditional Indian Wedding Blessings Card */}
      {(blessings.heading || blessingNames.length > 0) && (
        <ParallaxDrift depth={14} className="fv-bless-slot">
          <motion.article className="fv-bless-card" {...transitionVariants(0, -0.4)}>
            {/* Sacred Auspicious Kalash Emblem */}
            <div className="fv-bless-icon" aria-hidden="true">
              <img
                src="/templates/forever/desi/obj-kalash.webp"
                alt=""
                draggable={false}
                decoding="async"
              />
            </div>

            {blessings.heading && (
              <h2 className="fv-bless-title fv-foil">{blessings.heading}</h2>
            )}

            <div className="fv-bless-divider" aria-hidden="true">
              <span className="fv-bless-line" />
              <span className="fv-bless-diamond" />
              <span className="fv-bless-line" />
            </div>

            {blessingNames.length > 0 && (
              <ul className="fv-bless-names">
                {blessingNames.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </motion.article>
        </ParallaxDrift>
      )}

      {/* Extra Cards (if configured) */}
      {(schema.extras || []).map((extra, idx) => {
        if (!extra.heading?.trim() && !extra.text?.trim()) return null;
        return (
          <ParallaxDrift key={idx} depth={14} className="fv-bless-slot fv-extra-slot">
            <motion.article className="fv-bless-card" {...transitionVariants(0, idx % 2 ? 0.5 : -0.5)}>
              {extra.heading?.trim() && (
                <h2 className="fv-enc-title fv-foil">{extra.heading}</h2>
              )}
              {extra.text?.trim() && <p className="fv-extra-text">{extra.text}</p>}
            </motion.article>
          </ParallaxDrift>
        );
      })}

      {/* Grand Finale */}
      <footer className="fv-finale">
        {/* Animated Rangoli & Stamped Wax Seal */}
        <motion.div
          ref={sealRef}
          className="fv-fin-seal-wrap"
          aria-hidden="true"
          initial="away"
          animate={inView ? 'here' : 'away'}
        >
          {/* Unfurling Mandala Rangoli */}
          <motion.span className="fv-rangoli" variants={rangoliVariants}>
            <img
              src="/templates/forever/desi/rangoli.webp"
              alt=""
              draggable={false}
              decoding="async"
            />
          </motion.span>

          {/* Stamping Wax Seal */}
          <motion.div className="fv-fin-seal" variants={sealVariants}>
            <img
              className="fv-layer fv-seal-img"
              src={`${envelopePath}seal.webp`}
              alt=""
              draggable={false}
              decoding="async"
            />
            <Monogram text={envelope.monogram} brideName={brideName} groomName={groomName} />
          </motion.div>
        </motion.div>

        {/* The Royal Keepsake Closing Plaque */}
        <motion.div
          className="fv-fin-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Intertwined Gold & Rose Gold Monogram Crest */}
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#1E0812]/50 shadow-md">
            <span
              style={{
                fontFamily: 'var(--fv-names, "Cinzel", "Playfair Display", Georgia, serif)',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#f5de98',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
              }}
            >
              {envelope.monogram || `${brideName.trim().charAt(0)} & ${groomName.trim().charAt(0)}`}
            </span>
          </div>

          {details.closing && <p className="fv-fin-closing">{details.closing}</p>}

          <div className="fv-fin-divider" aria-hidden="true">
            <span className="fv-fin-line" />
            <span className="fv-fin-gem" />
            <span className="fv-fin-line" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={couple.isFlipped ? 'fin-flipped' : 'fin-normal'}
              className="fv-fin-couple"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="fv-fin-name">{couple.firstName}</h3>
              <span className="fv-fin-amp">&amp;</span>
              <h3 className="fv-fin-name">{couple.secondName}</h3>
            </motion.div>
          </AnimatePresence>

          <p className="fv-fin-date">{finaleDateText}</p>

          <div className="mt-6">
            <button
              type="button"
              className="fv-btn-seal-replay"
              onClick={onReplay}
              aria-label="Seal the royal invitation"
            >
              <RotateCcw className="w-4 h-4 mr-2 inline-block text-[#8B5A2B]" strokeWidth={2.2} aria-hidden="true" />
              <span>Seal The Royal Invitation</span>
            </button>
          </div>
        </motion.div>
      </footer>
    </section>
  );
}
