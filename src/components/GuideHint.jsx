import React, { useState, useEffect } from 'react';
import { Pointer, ChevronDown } from 'lucide-react';

export default function GuideHint({
  kind = 'scroll', // 'tap' | 'scroll'
  text = 'Scroll down to explore',
  stopAtEnd = false,
  scrollRef = null,
}) {
  const [pos, setPos] = useState(null);
  const [dynamicText, setDynamicText] = useState(text);

  useEffect(() => {
    const container = scrollRef?.current ?? null;
    const scrollTarget = container ?? window;

    const getMetrics = () => {
      if (container) {
        return {
          top: container.scrollTop,
          h: container.clientHeight,
          full: container.scrollHeight,
        };
      }
      const de = document.documentElement;
      return {
        top: window.scrollY,
        h: window.innerHeight,
        full: de.scrollHeight,
      };
    };

    let timer = 0;
    const isAtEnd = () => {
      const m = getMetrics();
      return m.full - m.top - m.h < 0.35 * m.h;
    };

    const showGuide = () => {
      const m = getMetrics();
      if (isAtEnd()) {
        setPos(null);
        return;
      }

      if (kind === 'scroll') {
        if (m.top < 150) {
          setDynamicText('Scroll down to explore');
        } else {
          setDynamicText('Keep scrolling');
        }
      }

      if (container) {
        const rect = container.getBoundingClientRect();
        setPos({
          left: rect.left + rect.width / 2,
          bottom: window.innerHeight - rect.bottom,
        });
      } else {
        setPos({
          left: window.innerWidth / 2,
          bottom: 0,
        });
      }
    };

    if (kind === 'tap') {
      timer = window.setTimeout(showGuide, 1500);
      return () => window.clearTimeout(timer);
    }

    const checkAndShow = () => {
      const m = getMetrics();
      if (isAtEnd()) {
        setPos(null);
        return;
      }
      showGuide();
    };

    const scheduleShow = (delay) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(checkAndShow, delay);
    };

    const onScroll = () => {
      setPos(null);
      // Gentle reminder if reader pauses for 1.8 seconds anywhere in the journey
      scheduleShow(1800);
    };

    // Show initial scroll guidance promptly after opening (800ms)
    scheduleShow(800);
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      scrollTarget.removeEventListener('scroll', onScroll);
    };
  }, [scrollRef, kind, stopAtEnd, text]);

  const handleClick = () => {
    const container = scrollRef?.current;
    if (container) {
      const targetY = Math.min(window.innerHeight * 0.68, 540);
      container.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`sv-guide${pos ? ' sv-guide--on' : ''}`}
      style={pos ? { left: pos.left, bottom: `calc(${pos.bottom}px + var(--sv-guide-lift, 68px))` } : undefined}
      role="status"
      aria-live="polite"
    >
      {pos && (
        <span
          onClick={handleClick}
          className="sv-guide-pill cursor-pointer shadow-2xl border border-[#D4AF37]/50 bg-[#1C0D15]/85 backdrop-blur-md transition-transform active:scale-95"
        >
          <span className={`sv-guide-hand sv-guide-hand--${kind}`} aria-hidden="true">
            <span className={kind === 'tap' ? 'sv-guide-ring' : 'sv-guide-trail'} />
            <Pointer className="sv-guide-finger text-[#FFDF73]" strokeWidth={1.8} />
          </span>
          <span className="sv-guide-text font-serif text-[#FFF6EA] tracking-wide flex items-center gap-1.5 font-medium">
            {dynamicText}
            {kind === 'scroll' && (
              <ChevronDown className="w-3.5 h-3.5 text-[#FFDF73] animate-bounce" strokeWidth={2.2} />
            )}
          </span>
        </span>
      )}
    </div>
  );
}
