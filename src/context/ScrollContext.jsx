import React, { createContext, useContext, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useScroll, useMotionValue, useTransform, interpolate, useReducedMotion, motion } from 'framer-motion';

export const ScrollContext = createContext({
  y: null,
  vh: null,
  container: null,
  version: 0,
});

function getElementTop(element, container) {
  let top = 0;
  let curr = element;
  while (curr && curr !== container) {
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  if (container && curr !== container) {
    for (let c = container; c; c = c.offsetParent) {
      top -= c.offsetTop;
    }
  }
  return top;
}

export function ScrollProvider({ children, containerRef = null, style = {} }) {
  const rootRef = useRef(null);
  const { scrollY } = useScroll(containerRef ? { container: containerRef } : {});
  const vh = useMotionValue(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [version, setVersion] = useState(0);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const containerEl = containerRef?.current;
      const height = containerEl ? containerEl.clientHeight : window.innerHeight;
      vh.set(height);
      setVersion((v) => v + 1);
    };

    updateDimensions();

    const ro = new ResizeObserver(updateDimensions);
    if (rootRef.current) ro.observe(rootRef.current);
    if (containerRef?.current) ro.observe(containerRef.current);
    window.addEventListener('resize', updateDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef, vh]);

  return (
    <ScrollContext.Provider value={{ y: scrollY, vh, container: containerRef, version }}>
      <div
        ref={rootRef}
        className="fv-invite"
        style={{
          position: 'relative',
          '--fv-screen': `${vh.get()}px`,
          '--fv-stage': `${vh.get()}px`,
          '--fv-tall': `${vh.get()}px`,
          ...style,
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}

export function useSceneProgress(ref, offset = 0) {
  const ctx = useContext(ScrollContext);
  const layout = useRef({ top: 0, h: 0 });
  const tick = useMotionValue(0);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      layout.current = {
        top: getElementTop(el, ctx.container?.current ?? null),
        h: el.offsetHeight,
      };
      tick.set(tick.get() + 1);
    }
  }, [ref, ctx.version, ctx.container, offset, tick]);

  const fallback = useMotionValue(1);
  if (prefersReduced) return fallback;
  if (!ctx.y || !ctx.vh) return tick;

  return useTransform([ctx.y, ctx.vh, tick], ([yVal, vhVal]) => {
    const { top, h } = layout.current;
    const scrollRange = h - (offset || vhVal);
    if (scrollRange <= 0) return 1;
    return Math.min(1, Math.max(0, (yVal - top) / scrollRange));
  });
}

export function useDriftProgress(ref) {
  const ctx = useContext(ScrollContext);
  const layout = useRef({ top: 0, h: 0 });
  const tick = useMotionValue(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      layout.current = {
        top: getElementTop(el, ctx.container?.current ?? null),
        h: el.offsetHeight,
      };
      tick.set(tick.get() + 1);
    }
  }, [ref, ctx.version, ctx.container, tick]);

  if (!ctx.y || !ctx.vh) return tick;

  return useTransform([ctx.y, ctx.vh, tick], ([yVal, vhVal]) => {
    const { top, h } = layout.current;
    const totalDistance = h + vhVal || 1;
    return Math.min(1, Math.max(0, (yVal + vhVal - top) / totalDistance));
  });
}

export function ParallaxDrift({ depth = 0, className = '', style = {}, children }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const progress = useDriftProgress(ref);
  const y = useTransform(progress, (t) => (prefersReduced ? 0 : depth * (1 - 2 * t)));

  return (
    <motion.div ref={ref} className={`fv-drift ${className}`} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}

export function useTransformRange(progress, inputRange, outputRange) {
  return useTransform(progress, (v) => interpolate(inputRange, outputRange)(v));
}

