import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarPlus } from 'lucide-react';
import { mapsUrl, calendarUrl, EVENT_TONES, parseIsoDate } from '../config/defaultWedding';
import { transitionVariants } from './TornPhoto';
import { useCouple } from '../context/CoupleContext';

const MOTIF_REGEXES = [
  [/cocktail|after.?party|\bdj\b|bachelor/i, 'cocktail'],
  [/chooda|chura|choora|kaleere|kalire/i, 'chooda'],
  [/baraat|barat|sehra|ghudchadi|ghodi|milni/i, 'safa'],
  [/puja|pooja|ganesh|tilak|roka|chowki|jagran|griha|havan|satsang|\bpath\b/i, 'thali'],
  [/meh?e?n?di|mehndi|henna/i, 'mehendi'],
  [/haldi|pithi|ubtan|tel ?baan/i, 'haldi'],
  [/reception|engage|sagai|ring|roka|tilak|party/i, 'rings'],
  [/sangeet|sangit|cocktail|dance|garba|dandiya|music|ladies/i, 'ghungroo'],
  [/wedding|shaadi|shadi|vivah|vivaah|phera|ceremony|nikah|biy[ae]|kalyanam|anand|lagan|muhurat/i, 'kalash'],
];

function getEventMotif(event) {
  if (event.object === 'none') return null;
  if (event.object && typeof event.object === 'string') {
    return `obj-${event.object}.webp`;
  }
  const match = MOTIF_REGEXES.find(([rx]) => rx.test(event.name || ''));
  return match ? `obj-${match[1]}.webp` : null;
}

const LIGHT_FOIL_TONES = ['rani', 'sindoor'];

export default function EventsSection({ events = {} }) {
  const couple = useCouple();
  const items = (events.items || []).filter((e) => e.name || e.date || e.venue);
  const deckRef = useRef(null);

  // Equalize card heights for clean physical deck stacking
  useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const equalize = () => {
      const cards = [...deck.querySelectorAll('.fv-ev')];
      if (!cards.length) return;
      cards.forEach((c) => {
        c.style.minHeight = '';
      });
      const maxH = Math.max(380, ...cards.map((c) => c.offsetHeight));
      cards.forEach((c) => {
        c.style.minHeight = `${maxH}px`;
      });
    };

    equalize();
    let frame = 0;
    const debounced = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(equalize);
    };

    const ro = new ResizeObserver(debounced);
    ro.observe(deck);
    document.fonts?.addEventListener('loadingdone', debounced);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      document.fonts?.removeEventListener('loadingdone', debounced);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="fv-events" aria-label={events.heading || 'The celebrations'}>
      <div className="fv-events-bg" aria-hidden="true" />
      <div className="fv-zari" aria-hidden="true" />

      <div className="fv-events-in">
        {(events.heading || events.intro) && (
          <motion.header className="fv-sec-head" {...transitionVariants(0, 0)}>
            {events.heading && <h2 className="fv-sec-title">{events.heading}</h2>}
            {events.intro && <p className="fv-sec-intro">{events.intro}</p>}
          </motion.header>
        )}

        <div ref={deckRef} className="fv-deck">
          {items.map((item, idx) => {
            const mapLink = mapsUrl(item.map_url, item.venue, item.address || '', '');
            const tone = EVENT_TONES.includes(item.tone) ? item.tone : EVENT_TONES[idx % EVENT_TONES.length];
            const motif = getEventMotif(item);
            const isLightFoil = LIGHT_FOIL_TONES.includes(tone);

            // Construct specific Google Calendar invite from event item date
            let eventDate = new Date(2026, 10, 30);
            if (item.date) {
              const parsed = parseIsoDate(item.date);
              if (parsed) {
                eventDate = parsed;
              } else if (/29/i.test(item.date)) {
                eventDate = new Date(2026, 10, 29);
              } else if (/30/i.test(item.date)) {
                eventDate = new Date(2026, 10, 30);
              } else if (/13.*dec/i.test(item.date)) {
                eventDate = new Date(2026, 11, 13);
              } else if (/15/i.test(item.date)) {
                eventDate = new Date(2026, 10, 15);
              } else if (/16/i.test(item.date)) {
                eventDate = new Date(2026, 10, 16);
              }
            }
            const coupleName = couple?.coupleShortTitle || couple?.coupleTitle || 'Wedding Celebration';
            const calLink = calendarUrl(
              eventDate,
              `${coupleName}: ${item.name}`,
              [item.venue, item.address].filter(Boolean).join(', '),
              `Celebration of ${couple?.coupleTitle || coupleName} - ${item.name} at ${item.venue}.`
            );

            return (
              <motion.div
                key={idx}
                className="fv-deck-slot"
                style={{ '--i': idx }}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
              >
                <div className="fv-ev-shadow">
                  <article className={`fv-ev fv-ev--${tone}${motif ? ' fv-ev--with-obj' : ''}`}>
                    {item.name && (
                      <h3 className={`fv-ev-name fv-foil${isLightFoil ? ' fv-foil--light' : ''}`}>
                        {item.name}
                      </h3>
                    )}

                    <hr className="fv-ev-rule" aria-hidden="true" />

                    {item.date && <p className="fv-key fv-ev-date">{item.date}</p>}
                    {item.time && <p className="fv-key fv-ev-time">{item.time}</p>}
                    {item.venue && <p className="fv-ev-venue font-semibold">{item.venue}</p>}
                    {item.address && item.address !== item.venue && (
                      <p className="fv-ev-venue text-[0.82rem] opacity-90 mt-0.5 leading-snug">{item.address}</p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3">
                      {mapLink && (
                        <a
                          className="fv-link fv-link--maps"
                          href={mapLink}
                          target={mapLink.startsWith('#') ? undefined : "_blank"}
                          rel={mapLink.startsWith('#') ? undefined : "noopener noreferrer"}
                          onClick={mapLink.startsWith('#') ? (e) => {
                            e.preventDefault();
                            document.querySelector(mapLink)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          } : undefined}
                          aria-label={`${item.venue} on Google Maps`}
                        >
                          <MapPin className="w-4 h-4 mr-0.5 inline-block" strokeWidth={1.8} aria-hidden="true" />
                          Open in Maps
                        </a>
                      )}
                      {calLink && (
                        <a
                          className="fv-link fv-link--cal"
                          href={calLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Add ${item.name} to Calendar`}
                        >
                          <CalendarPlus className="w-4 h-4 mr-0.5 inline-block" strokeWidth={1.8} aria-hidden="true" />
                          Add to Calendar
                        </a>
                      )}
                    </div>
                  </article>
                </div>

                {motif && (
                  <span
                    className={`fv-ev-obj fv-ev-obj--${idx % 2 ? 'left' : 'right'}`}
                    aria-hidden="true"
                  >
                    <img
                      src={`/templates/forever/desi/${motif}`}
                      alt=""
                      draggable={false}
                      decoding="async"
                    />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

