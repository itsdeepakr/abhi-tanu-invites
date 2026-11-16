import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TornPhoto, { transitionVariants } from './TornPhoto';
import { ParallaxDrift } from '../context/ScrollContext';
import { useCouple } from '../context/CoupleContext';

export default function NoteSection({
  note = {},
  coupleTitle = '',
  photos = [],
}) {
  if (!note.heading && !note.message) return null;

  const couple = useCouple();
  const hasUserPhotos = Array.isArray(photos) && photos.length > 0 && photos.some(p => p && p.src);
  const photoBack = hasUserPhotos ? (photos[1]?.src || photos[0]?.src || null) : null;
  const photoLoose = hasUserPhotos ? (photos[2]?.src || null) : null;
  const notePhoto = note.photo || (hasUserPhotos ? (photos[0]?.src || null) : null);

  // Dynamic names from active invitation couple
  const displayNames = couple?.coupleShortTitle || coupleTitle || (couple ? `${couple.bride} & ${couple.groom}` : 'The Couple');
  const formattedNames = displayNames.replace(/\s+([A-Za-z]\.)$/, '\u00A0$1');

  return (
    <section className="fv-note-sec" aria-label={note.heading || 'A note'}>
      <div className="fv-collage">
        {/* Bottom-left polaroid placed underneath the paper corner */}
        {photoBack && (
          <ParallaxDrift depth={0} className="fv-col fv-col--under" style={{ zIndex: 2 }}>
            <TornPhoto src={photoBack} alt="" rotate={-7} />
          </ParallaxDrift>
        )}

        {/* Bottom-right taped polaroid */}
        {photoLoose && (
          <ParallaxDrift depth={10} className="fv-col fv-col--loose" style={{ zIndex: 2 }}>
            <TornPhoto src={photoLoose} alt="" rotate={8} />
            <span className="fv-tape fv-tape--gold" aria-hidden="true" />
          </ParallaxDrift>
        )}

        {/* Fern Sprig Accent */}
        <ParallaxDrift depth={-10} className="fv-sprig fv-sprig--fern" style={{ zIndex: 1 }}>
          <img
            src="/templates/forever/paper/sprig-fern.webp"
            alt=""
            draggable={false}
            decoding="async"
          />
        </ParallaxDrift>

        {/* The Handwritten Love Note Paper - High Z-Index so text is 100% on top */}
        <ParallaxDrift depth={4} className="fv-note-slot" style={{ zIndex: 6 }}>
          <motion.div className="fv-note" {...transitionVariants(0, -0.8)}>
            <span className="fv-note-shadow" aria-hidden="true" />
            <article className="fv-note-paper">
              {note.heading && <h2 className="fv-note-title">{note.heading}</h2>}
              {note.message && <p className="fv-note-msg">{note.message}</p>}
              {note.signoff && <p className="fv-note-sign">{note.signoff}</p>}
              <AnimatePresence mode="wait">
                <motion.p
                  key={couple.isFlipped ? 'note-flipped' : 'note-normal'}
                  className="fv-note-names"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35 }}
                >
                  <span data-fit="">{formattedNames}</span>
                </motion.p>
              </AnimatePresence>
            </article>
          </motion.div>
        </ParallaxDrift>

        {/* Polaroid with Washi Tape - Corner pinned, clear of all headings */}
        {notePhoto && (
          <ParallaxDrift depth={12} className="fv-col fv-col--taped" style={{ zIndex: 7 }}>
            <TornPhoto src={notePhoto} alt="" rotate={7} />
            <span className="fv-tape" aria-hidden="true" />
          </ParallaxDrift>
        )}

        {/* Rose Sprig Accent */}
        <ParallaxDrift depth={90} className="fv-sprig fv-sprig--rose">
          <img
            src="/templates/forever/paper/sprig-rose.webp"
            alt=""
            draggable={false}
            decoding="async"
          />
        </ParallaxDrift>
      </div>
    </section>
  );
}
