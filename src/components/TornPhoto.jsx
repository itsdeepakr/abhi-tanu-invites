import React from 'react';
import { motion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

export const transitionVariants = (index = 0, rotate = 0) => ({
  initial: { opacity: 0, y: 26, rotate: 2.2 * rotate },
  whileInView: { opacity: 1, y: 0, rotate },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.85, ease: EASE_OUT, delay: 0.05 + 0.08 * index },
});

export default function TornPhoto({
  src,
  alt = '',
  rotate = 0,
  still = false,
  kenBurns = false,
  torn = false,
  className = '',
  objectPosition,
  imgStyle = {},
}) {
  return (
    <motion.figure
      className={`fv-print${torn ? ' fv-print--torn' : ''} ${className}`}
      {...(still ? {} : transitionVariants(0, rotate))}
    >
      {torn && <span className="fv-torn-shadow" aria-hidden="true" />}
      <div className="fv-print-win">
        <motion.img
          className="fv-print-img"
          src={src}
          alt={alt}
          draggable={false}
          decoding="async"
          style={{
            ...(objectPosition ? { objectPosition } : {}),
            ...imgStyle,
          }}
          {...(kenBurns
            ? {
                initial: { scale: 1.14 },
                animate: { scale: 1 },
                transition: { duration: 9, ease: [0.2, 0.6, 0.3, 1] },
              }
            : {})}
        />
      </div>
      {torn && <span className="fv-torn-frame" aria-hidden="true" />}
    </motion.figure>
  );
}

