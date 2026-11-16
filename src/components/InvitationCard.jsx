import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useTransform, interpolate } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { mapsUrl } from '../config/defaultWedding';
import { useSceneProgress } from '../context/ScrollContext';
import { useCouple } from '../context/CoupleContext';

export default function InvitationCard({
  schema,
  dateObj,
  envelopePath = '/templates/forever/envelope/',
}) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const [dimensions, setDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 440,
    h: typeof window !== 'undefined' ? window.innerHeight : 956,
  });
  const prefersReduced = useReducedMotion();

  // Exact scene progress using ScrollVite's formula
  const scrollYProgress = useSceneProgress(sectionRef, dimensions.h);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setDimensions((prev) =>
        prev.w === el.clientWidth && prev.h === el.clientHeight
          ? prev
          : { w: el.clientWidth, h: el.clientHeight }
      );
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w: width, h: height } = dimensions;

  const inv = schema.invitation || {};
  const hero = schema.hero || {};
  const details = schema.details || {};
  const cardInfo = schema.card || {};

  const couple = useCouple();
  const brideName = inv.bride_full_name?.trim() || hero.bride_name || couple.bride || 'Bride';
  const groomName = inv.groom_full_name?.trim() || hero.groom_name || couple.groom || 'Groom';
  const brideParents = inv.bride_parents?.trim() || couple.firstParents || '';
  const groomParents = inv.groom_parents?.trim() || couple.secondParents || '';

  // Alternating equal names: dynamic order switches every 2 seconds smoothly
  const firstName = couple.isFlipped ? groomName : brideName;
  const secondName = couple.isFlipped ? brideName : groomName;
  const firstParents = couple.isFlipped ? groomParents : brideParents;
  const secondParents = couple.isFlipped ? brideParents : groomParents;
  const coupleTitle = `${firstName} & ${secondName}`;

  const mapLink = mapsUrl(details.map_url, inv.venue, details.address, inv.city);

  // Sizing formula from ScrollVite
  const cardW = Math.max(0, Math.min(0.8 * width, 420, ((height - 96) * 5) / 7));
  const cardH = 1.4 * cardW;
  const pocketW = cardW / 0.9;
  const pocketTop = height - 0.95 * pocketW;

  // Auto-fit card text using ScrollVite's --vfit algorithm
  useLayoutEffect(() => {
    const card = cardRef.current;
    const inner = card?.querySelector('.fv-card-inner');
    if (!card || !inner) return;

    const fit = () => {
      card.style.setProperty('--vfit', '1');
      const cs = getComputedStyle(inner);
      const availableHeight =
        inner.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

      const getChildrenHeight = () =>
        [...inner.children].reduce((sum, el) => sum + el.offsetHeight, 0) +
        [...inner.children].reduce((sum, el) => {
          const s = getComputedStyle(el);
          return sum + parseFloat(s.marginTop) + parseFloat(s.marginBottom);
        }, 0);

      let scale = 1;
      for (let i = 0; i < 4 && getChildrenHeight() > availableHeight; i++) {
        scale = Math.max(0.58, scale * Math.min(0.98, availableHeight / getChildrenHeight()));
        card.style.setProperty('--vfit', scale.toFixed(3));
      }
    };

    fit();
    let frame = 0;
    const debounced = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    const ro = new ResizeObserver(debounced);
    ro.observe(card);
    document.fonts?.addEventListener('loadingdone', debounced);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.fonts?.removeEventListener('loadingdone', debounced);
    };
  }, [
    brideName,
    groomName,
    brideParents,
    groomParents,
    inv.intro,
    inv.message,
    inv.time,
    inv.venue,
    inv.city,
    inv.note,
    dateObj,
    cardW,
  ]);

  // Dynamic transforms via interpolate callback
  const drawCardY = useTransform(
    scrollYProgress,
    (p) =>
      interpolate(
        [0.06, 0.42, 0.78],
        [
          pocketTop + 0.1 * pocketW + cardH / 2 - height / 2,
          Math.max(pocketTop + 0.2 * pocketW - cardH / 2, 20 + cardH / 2) - height / 2,
          0,
        ]
      )(p)
  );
  const drawCardRotate = useTransform(
    scrollYProgress,
    (p) => interpolate([0.06, 0.42, 0.78], [0, -1.2, -0.4])(p)
  );

  const pocketY = useTransform(scrollYProgress, (p) => interpolate([0.44, 0.8], [0, 0.8 * height])(p));
  const pocketOpacity = useTransform(scrollYProgress, (p) => interpolate([0.55, 0.8], [1, 0])(p));
  const scrollHintOpacity = useTransform(scrollYProgress, (p) => interpolate([0, 0.012, 0.07, 0.11], [0, 1, 1, 0])(p));

  const pocketStyle = {
    left: (width - pocketW) / 2,
    top: pocketTop,
    width: pocketW,
    height: 1.5 * pocketW,
  };

  const s = envelopePath;

  return (
    <div style={{ '--card-w': `${cardW}px` }}>
      {/* Scene: Pocket and Drawing Card */}
      <section
        ref={sectionRef}
        className="fv-scene fv-scene--invite"
        data-still={prefersReduced ? '' : undefined}
        aria-label="The invitation"
      >
        <div ref={containerRef} className="fv-sticky" style={width ? undefined : { visibility: 'hidden' }}>
          {/* Scroll hint to draw out */}
          <motion.p
            className="fv-scroll-hint fv-scroll-hint--top"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden="true"
          >
            Keep scrolling to open <ChevronDown className="w-4 h-4 ml-1 inline-block" strokeWidth={1.4} />
          </motion.p>

          {/* Pocket Back Layer (Liner & Folded Flap) */}
          <motion.div
            className="fv-pocket"
            style={{ ...pocketStyle, y: pocketY, opacity: pocketOpacity, zIndex: 1 }}
            aria-hidden="true"
          >
            <img className="fv-layer fv-pocket-flap" src={`${s}flap-top-in.webp`} alt="" draggable={false} decoding="async" />
            <img className="fv-layer fv-liner" src={`${s}liner.webp`} alt="" draggable={false} decoding="async" />
          </motion.div>

          {/* The Royal Invitation Card (Slides Up) */}
          <motion.div
            className="fv-draw-card"
            style={{ y: drawCardY, rotate: drawCardRotate }}
          >
            <article ref={cardRef} className="fv-card" aria-label={`Wedding invitation from ${coupleTitle}`}>
              <div className="fv-card-inner">
                {inv.intro && <p className="fv-c-intro">{inv.intro}</p>}

                {/* Animated Changing Names (Alters order every 2s in pure equality, zero overlap) */}
                <h2 className="fv-c-names-wrap" style={{ margin: 0 }}>
                  <motion.span
                    key={firstName}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="fv-c-name"
                    data-fit=""
                  >
                    {firstName}
                  </motion.span>
                  {firstParents && <span className="fv-c-family">{firstParents}</span>}
                  <span className="fv-c-and" style={{ display: 'block' }}>&amp;</span>
                  <motion.span
                    key={secondName}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="fv-c-name"
                    data-fit=""
                  >
                    {secondName}
                  </motion.span>
                  {secondParents && <span className="fv-c-family">{secondParents}</span>}
                </h2>

                {inv.message && <p className="fv-c-msg">{inv.message}</p>}

                <hr className="fv-c-rule" />

                {/* Dual Event Royal Showcase: BOTH Reception (15th) & Muhurtham (16th) Prominently Highlighted Side-by-Side */}
                <div className="fv-c-events-twin">
                  {/* Reception Column (Sunday, 15 Nov) */}
                  <div className="fv-c-twin-card fv-c-twin-card--reception">
                    <span className="fv-c-twin-badge">RECEPTION</span>
                    <p className="fv-c-twin-day">SUNDAY</p>
                    <p className="fv-c-twin-date">15 NOV 2026</p>
                    <p className="fv-c-twin-time">6:30 PM ONWARDS</p>
                  </div>

                  {/* Elegant Golden Hairline Separator */}
                  <div className="fv-c-twin-divider" aria-hidden="true" />

                  {/* Muhurtham Column (Monday, 16 Nov) */}
                  <div className="fv-c-twin-card fv-c-twin-card--muhurtham">
                    <span className="fv-c-twin-badge">MUHURTHAM</span>
                    <p className="fv-c-twin-day">MONDAY</p>
                    <p className="fv-c-twin-date">16 NOV 2026</p>
                    <p className="fv-c-twin-time">9:45 – 10:45 AM</p>
                  </div>
                </div>

                {/* Venue & City */}
                {inv.venue && (
                  <div className="fv-c-venue-wrap">
                    <p className="fv-key fv-c-venue">
                      {mapLink ? (
                        <a
                          className="fv-c-venue-link"
                          href={mapLink}
                          target={mapLink.startsWith('#') ? undefined : "_blank"}
                          rel={mapLink.startsWith('#') ? undefined : "noopener noreferrer"}
                          onClick={mapLink.startsWith('#') ? (e) => {
                            e.preventDefault();
                            document.querySelector(mapLink)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          } : undefined}
                          aria-label={`${inv.venue} (view venue on map)`}
                        >
                          {inv.venue}
                        </a>
                      ) : (
                        inv.venue
                      )}
                    </p>
                    {inv.city && <p className="fv-key fv-c-city">{inv.city}</p>}
                  </div>
                )}

                {mapLink && (
                  <a
                    className="fv-c-maps"
                    href={mapLink}
                    target={mapLink.startsWith('#') ? undefined : "_blank"}
                    rel={mapLink.startsWith('#') ? undefined : "noopener noreferrer"}
                    onClick={mapLink.startsWith('#') ? (e) => {
                      e.preventDefault();
                      document.querySelector(mapLink)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } : undefined}
                  >
                    <MapPin className="w-4 h-4 mr-1 inline-block" strokeWidth={1.6} aria-hidden="true" />
                    Open in Maps
                  </a>
                )}
              </div>
            </article>
          </motion.div>

          {/* Pocket Front Layer (Bottom & Side Flaps) */}
          <motion.div
            className="fv-pocket"
            style={{ ...pocketStyle, y: pocketY, opacity: pocketOpacity, zIndex: 3 }}
            aria-hidden="true"
          >
            <img className="fv-layer fv-fixed--left" src={`${s}flap-left.webp`} alt="" draggable={false} decoding="async" />
            <img className="fv-layer fv-fixed--right" src={`${s}flap-right.webp`} alt="" draggable={false} decoding="async" />
            <img className="fv-layer fv-fixed--bottom" src={`${s}flap-bottom.webp`} alt="" draggable={false} decoding="async" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
