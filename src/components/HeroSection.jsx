import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, interpolate, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import TornPhoto from './TornPhoto';
import { shortDate } from '../config/defaultWedding';
import { useSceneProgress } from '../context/ScrollContext';
import { useCouple } from '../context/CoupleContext';

const EASE_OUT = [0.16, 1, 0.3, 1];

export default function HeroSection({
  brideName = 'Bride',
  groomName = 'Groom',
  kicker = 'The wedding of',
  dateObj,
  photos = [],
}) {
  const couple = useCouple();
  const effectiveBride = brideName || couple.bride;
  const effectiveGroom = groomName || couple.groom;
  const firstName = couple.isFlipped ? effectiveGroom : effectiveBride;
  const secondName = couple.isFlipped ? effectiveBride : effectiveGroom;

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const namesRef = useRef(null);
  const restNamesRef = useRef(null);
  const restContainerRef = useRef(null);

  const [dimensions, setDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 440,
    h: typeof window !== 'undefined' ? window.innerHeight : 956,
  });
  const [restHeight, setRestHeight] = useState(110);
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

  // Text auto-fitting
  useEffect(() => {
    const fitElements = () => {
      [namesRef.current, restNamesRef.current].forEach((container) => {
        if (!container) return;
        const items = container.querySelectorAll('[data-fit]');
        items.forEach((item) => {
          const parentWidth = (container.parentElement?.clientWidth || container.clientWidth) - 32;
          const scrollWidth = item.scrollWidth || 1;
          const ratio = Math.max(0.5, Math.min(1, parentWidth / scrollWidth));
          container.style.setProperty('--fit', ratio.toFixed(3));
        });
      });
      if (restContainerRef.current) {
        setRestHeight(restContainerRef.current.offsetHeight);
      }
    };

    fitElements();
    window.addEventListener('resize', fitElements);
    document.fonts?.ready?.then(fitElements);
    return () => window.removeEventListener('resize', fitElements);
  }, [brideName, groomName, couple.isFlipped]);

  const { w: width, h: height } = dimensions;
  const isPortrait = width < 0.82 * height;
  const gap = Math.max(4, Math.min(10, 0.014 * width));
  const bottomMargin = Math.max(18, 0.03 * height);
  const availableHeight = Math.max(0, height - restHeight - bottomMargin - 2 * Math.max(28, 0.06 * height));

  let mainW, mainH, totalW, totalH;
  if (isPortrait) {
    mainW = Math.max(0, Math.min(0.76 * width, 440, (availableHeight - gap + (0.8 * gap) / 1.8) / (1.25 + 0.8 / 1.8)));
    mainH = 1.25 * mainW;
    totalW = mainW;
    totalH = mainH + gap + (0.8 * (mainW - gap)) / 1.8;
  } else {
    mainW = Math.max(0, Math.min((Math.min(0.84 * width, 900) - gap + gap / 1.8) / (1 + 1.25 / 1.8), availableHeight / 1.25));
    mainH = 1.25 * mainW;
    totalW = mainW + gap + (1.25 * mainW - gap) / 1.8;
    totalH = mainH;
  }

  const leftOffset = (width - totalW) / 2;
  const topOffset = Math.max(16, (height - totalH - bottomMargin - restHeight) / 2);
  const sideW = isPortrait ? (0.8 * (mainW - gap)) / 1.8 : (1.25 * mainW - gap) / 1.8;

  const positions = isPortrait
    ? {
      back: { left: leftOffset, top: topOffset + mainH + gap, width: sideW },
      front: { left: leftOffset + sideW + gap, top: topOffset + mainH + gap, width: 1.25 * sideW },
    }
    : {
      back: { left: leftOffset + mainW + gap, top: topOffset, width: sideW },
      front: { left: leftOffset + mainW + gap, top: topOffset + sideW + gap, width: sideW },
    };

  const centerMainX = leftOffset + mainW / 2;
  const centerMainY = topOffset + mainH / 2;
  const scaleMultiplier = mainW ? 1.02 * Math.max(width / (0.74 * mainW), height / (mainH * 0.74)) : 1;
  const initialMainW = mainW * scaleMultiplier;
  const initialMainH = 1.25 * initialMainW;

  // On landscape/desktop, avoid pushing the top of the photo above the screen to prevent cropping heads
  const initialTop = isPortrait
    ? (height - initialMainH) / 2
    : Math.max(height - initialMainH, -0.05 * initialMainH);
  const initialCenterY = initialTop + initialMainH / 2;

  // Dynamic transforms via interpolate callback (never stale!)
  const mainScale = useTransform(scrollYProgress, (p) => interpolate([0.04, 0.58], [1, 1 / scaleMultiplier])(p));
  const mainX = useTransform(scrollYProgress, (p) => interpolate([0.04, 0.58], [0, centerMainX - width / 2])(p));
  const mainY = useTransform(scrollYProgress, (p) => interpolate([0.04, 0.58], [0, centerMainY - initialCenterY])(p));
  const mainRotate = useTransform(scrollYProgress, (p) => interpolate([0.04, 0.32, 0.6], [0, -3.4, -1.6])(p));

  const backX = useTransform(
    scrollYProgress,
    (p) => interpolate([0.08, 0.54], [isPortrait ? -(positions.back.left + sideW + 40) : 100, isPortrait ? 6 : -4])(p)
  );
  const backY = useTransform(
    scrollYProgress,
    (p) => interpolate([0.08, 0.54], [isPortrait ? 0.22 * height : -60, isPortrait ? -8 : 10])(p)
  );
  const backRotate = useTransform(
    scrollYProgress,
    (p) => interpolate([0.08, 0.54], [isPortrait ? -20 : 18, isPortrait ? 3.2 : 2.6])(p)
  );

  const frontX = useTransform(
    scrollYProgress,
    (p) => interpolate([0.14, 0.60], [isPortrait ? width - positions.front.left + 40 : 100, isPortrait ? -5 : 8])(p)
  );
  const frontY = useTransform(
    scrollYProgress,
    (p) => interpolate([0.14, 0.60], [isPortrait ? 0.3 * height : 60, isPortrait ? 6 : -6])(p)
  );
  const frontRotate = useTransform(
    scrollYProgress,
    (p) => interpolate([0.14, 0.60], [isPortrait ? 22 : -18, isPortrait ? -2.6 : -3.2])(p)
  );

  const heroOverlayOpacity = useTransform(scrollYProgress, (p) => interpolate([0, 0.2], [1, 0])(p));
  const heroOverlayY = useTransform(scrollYProgress, (p) => interpolate([0, 0.3], [0, -90])(p));

  const restOpacity = useTransform(scrollYProgress, (p) => interpolate([0.66, 0.86], [0, 1])(p));
  const restY = useTransform(scrollYProgress, (p) => interpolate([0.66, 0.88], [26, 0])(p));
  const restScrollHintOpacity = useTransform(scrollYProgress, (p) => interpolate([0.88, 0.97], [0, 1])(p));

  const hasUserPhotos = Array.isArray(photos) && photos.length > 0 && photos.some(p => p && (p.src || typeof p === 'string'));
  const photoMainObj = hasUserPhotos ? photos[0] : null;
  const photoBackObj = hasUserPhotos ? photos[1] : null;
  const photoFrontObj = hasUserPhotos ? photos[2] : null;
  const photoMain = photoMainObj?.src || (typeof photoMainObj === 'string' ? photoMainObj : null);
  const photoBack = photoBackObj?.src || (typeof photoBackObj === 'string' ? photoBackObj : null);
  const photoFront = photoFrontObj?.src || (typeof photoFrontObj === 'string' ? photoFrontObj : null);

  const entryTransition = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, ease: EASE_OUT, delay },
  });

  return (
    <section
      ref={sectionRef}
      className="fv-scene fv-scene--hero"
      data-still={prefersReduced ? '' : undefined}
      aria-label={`${brideName} & ${groomName}`}
    >
      <div ref={containerRef} className="fv-sticky" style={width ? undefined : { visibility: 'hidden' }}>
        {/* Back Photo */}
        {photoBack && (
          <motion.div
            className="fv-print-slot fv-print-slot--back"
            style={{
              ...positions.back,
              x: backX,
              y: backY,
              rotate: backRotate,
            }}
          >
            <TornPhoto
              still
              torn
              src={photoBack}
              objectPosition={photoBackObj?.objectPosition || 'center center'}
              alt={`${brideName} & ${groomName}`}
            />
          </motion.div>
        )}

        {/* Front Photo */}
        {photoFront && (
          <motion.div
            className="fv-print-slot fv-print-slot--front"
            style={{
              ...positions.front,
              x: frontX,
              y: frontY,
              rotate: frontRotate,
            }}
          >
            <TornPhoto
              still
              torn
              src={photoFront}
              objectPosition={photoFrontObj?.objectPosition || 'center center'}
              alt={`${brideName} & ${groomName}`}
            />
          </motion.div>
        )}

        {/* Center Main Photo (if user uploaded photos) */}
        {photoMain && (
          <motion.div
            className="fv-print-slot fv-print-slot--main"
            style={{
              left: (width - initialMainW) / 2,
              top: initialTop,
              width: initialMainW,
              '--k': scaleMultiplier,
              x: mainX,
              y: mainY,
              scale: mainScale,
              rotate: mainRotate,
            }}
          >
            <TornPhoto
              still
              torn
              kenBurns
              src={photoMain}
              objectPosition={photoMainObj?.objectPosition || 'center 30%'}
              alt={`${brideName} & ${groomName}`}
            />
          </motion.div>
        )}

        {/* If no user photos are added: Render Royal Monogram Crest Centerpiece */}
        {!hasUserPhotos && (
          <motion.div
            className="fv-print-slot fv-print-slot--main"
            style={{
              left: (width - initialMainW) / 2,
              top: initialTop,
              width: initialMainW,
              '--k': scaleMultiplier,
              x: mainX,
              y: mainY,
              scale: mainScale,
              rotate: mainRotate,
            }}
          >
            <div className="fv-royal-crest-card">
              <div className="fv-crest-inner">
                <div className="fv-crest-monogram-ring">
                  <span className="fv-crest-monogram-initials">
                    {effectiveBride?.[0] || 'V'}{effectiveGroom?.[0] ? ` & ${effectiveGroom[0]}` : ''}
                  </span>
                </div>
                <div className="fv-crest-couple-names">
                  <span>{firstName}</span>
                  <span className="fv-crest-amp">&amp;</span>
                  <span>{secondName}</span>
                </div>
                {dateObj && (
                  <div className="fv-crest-date">
                    {shortDate(dateObj)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero Vignette Scrim */}
        <motion.div className="fv-hero-scrim" style={{ opacity: heroOverlayOpacity }} aria-hidden="true" />

        {/* Hero Text Overlay */}
        <motion.div
          ref={namesRef}
          className="fv-hero-over"
          style={{ opacity: heroOverlayOpacity, y: heroOverlayY }}
        >
          {kicker && (
            <motion.p className="fv-hero-kicker" {...entryTransition(0.3)}>
              {kicker}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            <motion.h1
              key={couple.isFlipped ? 'hero-flipped' : 'hero-normal'}
              className="fv-hero-big"
              initial={{ opacity: 0, y: 10, filter: 'blur(1px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(1px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="fv-hero-name" data-fit="">
                {firstName}
              </span>{' '}
              <span className="fv-hero-and">&amp;</span>{' '}
              <span className="fv-hero-name" data-fit="">
                {secondName}
              </span>
            </motion.h1>
          </AnimatePresence>

          {dateObj && (
            <motion.p className="fv-hero-when" {...entryTransition(0.7)}>
              {shortDate(dateObj)}
            </motion.p>
          )}

          <motion.div {...entryTransition(0.9)}>
            <p className="fv-scroll-hint fv-scroll-hint--flow fv-scroll-hint--start" aria-hidden="true">
              Scroll <ChevronDown className="w-4 h-4 ml-1 inline-block animate-bounce" strokeWidth={1.8} />
            </p>
          </motion.div>

          <motion.span className="fv-cue" aria-hidden="true" {...entryTransition(0.9)} />
        </motion.div>

        {/* Rest Bar (settles after hero scroll) */}
        <motion.div
          ref={restContainerRef}
          className="fv-rest"
          aria-hidden="true"
          style={{
            top: topOffset + totalH + bottomMargin,
            opacity: restOpacity,
            y: restY,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={couple.isFlipped ? 'rest-flipped' : 'rest-normal'}
              ref={restNamesRef}
              className="fv-rest-names fv-foil fv-foil--light"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              <span className="fv-rest-name">{firstName}</span>{' '}
              <span className="fv-rest-amp">&amp;</span>{' '}
              <span className="fv-rest-name">{secondName}</span>
            </motion.p>
          </AnimatePresence>

          {dateObj && <p className="fv-key fv-rest-date">{shortDate(dateObj)}</p>}

          <motion.p
            className="fv-scroll-hint fv-scroll-hint--flow"
            style={{ opacity: restScrollHintOpacity }}
            aria-hidden="true"
          >
            Keep scrolling <ChevronDown className="w-4 h-4 ml-1 inline-block" strokeWidth={1.4} />
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
