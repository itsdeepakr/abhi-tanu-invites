import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Monogram from './Monogram';
import { useCouple } from '../context/CoupleContext';

export default function EnvelopeIntro({
  phase, // 'sealed' | 'opening' | 'open'
  onOpen,
  onSkip,
  envelopePath = '/templates/forever/envelope/',
  monogram = '',
  hint = 'Tap to open',
  brideName,
  groomName,
}) {
  const couple = useCouple();
  const o = envelopePath;
  const coupleTitle = couple.coupleTitle || `${brideName} & ${groomName}`;

  return (
    <motion.section
      className="fv-intro"
      aria-label="Sealed invitation"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="fv-env">
        <div className="fv-env-press">
          <img className="fv-layer fv-liner" src={`${o}liner.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          <img className="fv-layer fv-light" src={`${o}bloom.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          <img className="fv-layer fv-fixed fv-fixed--left" src={`${o}flap-left.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          <img className="fv-layer fv-fixed fv-fixed--right" src={`${o}flap-right.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          <img className="fv-layer fv-fixed fv-fixed--bottom" src={`${o}flap-bottom.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          <img className="fv-layer fv-top-shadow" src={`${o}flap-top-shadow.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />

          <div className="fv-cast-clip">
            <img className="fv-layer fv-cast" src={`${o}flap-cast.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          </div>

          <div className="fv-glow-clip fv-glow-clip--rest">
            <img className="fv-layer fv-glow" src={`${o}glow.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
          </div>

          <div className="fv-flap3d">
            <div className="fv-flap">
              <div className="fv-flap-peek">
                <div className="fv-face fv-face--out">
                  <img className="fv-layer fv-flap-img" src={`${o}flap-top.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
                  <div className="fv-glow-clip fv-glow-clip--flap">
                    <img className="fv-layer fv-glow" src={`${o}glow-top.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
                  </div>
                  <div className="fv-seal">
                    <img className="fv-layer fv-seal-img" src={`${o}seal.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
                    <Monogram text={monogram} brideName={brideName} groomName={groomName} />
                    <span className="fv-seal-light" aria-hidden="true" />
                    <span className="fv-orbit" aria-hidden="true" />
                    <span className="fv-halo" aria-hidden="true" />
                  </div>
                </div>
                <div className="fv-face fv-face--in">
                  <img className="fv-layer fv-flap-img" src={`${o}flap-top-in.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
                </div>
              </div>
            </div>
          </div>

          <img className="fv-layer fv-bloom" src={`${o}bloom.webp`} alt="" aria-hidden="true" draggable={false} decoding="async" />
        </div>

        {hint && (
          <p className={`fv-hint${phase === 'sealing' ? ' fv-hint--sealing' : ''}`}>
            {hint}
          </p>
        )}
      </div>

      <div className="fv-whiteout" aria-hidden="true" />

      {phase === 'sealed' && (
        <button
          type="button"
          className="fv-open"
          onClick={onOpen}
          aria-label={`Open the invitation from ${coupleTitle}`}
        />
      )}

      {phase === 'opening' && (
        <button
          type="button"
          className="fv-skip"
          onClick={onSkip}
          aria-label="Skip the opening"
        >
          Skip <ChevronRight className="w-4 h-4 ml-1 inline-block" strokeWidth={1.6} aria-hidden="true" />
        </button>
      )}
    </motion.section>
  );
}

