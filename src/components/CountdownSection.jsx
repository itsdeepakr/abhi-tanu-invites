import React, { useState, useEffect } from 'react';
import { countdownTarget, shortDate } from '../config/defaultWedding';
import { ParallaxDrift } from '../context/ScrollContext';

function RollingNumber({ value, className = '' }) {
  return (
    <span className="fv-roll">
      <span className={className} key={value}>
        {value}
      </span>
    </span>
  );
}

export default function CountdownSection({ weddingDate, startTime = '19:00' }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!weddingDate) return null;

  const targetTime = countdownTarget(weddingDate, startTime).getTime();
  const dayAfterTarget = new Date(
    weddingDate.getFullYear(),
    weddingDate.getMonth(),
    weddingDate.getDate() + 1
  ).getTime();

  // If wedding was more than a day ago
  if (now >= dayAfterTarget) {
    return null;
  }

  const diff = Math.max(0, targetTime - now);
  const isToday = diff === 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const units = [
    { label: 'Hours', val: String(hours).padStart(2, '0') },
    { label: 'Minutes', val: String(minutes).padStart(2, '0') },
    { label: 'Seconds', val: String(seconds).padStart(2, '0') },
  ];

  const diyaDepths = [12, 20, 16];

  return (
    <section className="fv-night" aria-label="Countdown">
      <div className="fv-night-inner">
        {/* Royal Celestial Pavilion */}
        <div className="fv-countdown-pavilion">
          {/* Ornate Pavilion Filigree Corner Brackets */}
          <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none rounded-tl-sm opacity-80" />
          <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none rounded-tr-sm opacity-80" />
          <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none rounded-bl-sm opacity-80" />
          <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none rounded-br-sm opacity-80" />

          <p className="fv-night-kicker">
            {isToday ? 'The day is here' : 'Counting down'}
          </p>

          <div className="fv-night-hero">
            {/* Half Mandala Backdrop with Parallax */}
            <ParallaxDrift depth={-36} className="fv-night-sun">
              <img
                src="/templates/forever/desi/mandala-half.webp"
                alt=""
                draggable={false}
                decoding="async"
              />
            </ParallaxDrift>

            {isToday ? (
              <p className="fv-night-today fv-foil">Today</p>
            ) : (
              <>
                <p className="fv-night-days">
                  <RollingNumber value={days} className="fv-foil" />
                </p>
                <p className="fv-night-unit">{days === 1 ? 'Day' : 'Days'}</p>
              </>
            )}
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-2 opacity-80" aria-hidden="true">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#FFDF73] to-transparent" />
            <span className="text-[#FFDF73] text-xs">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#FFDF73] to-transparent" />
          </div>

          {/* Rolling Hours, Minutes, Seconds */}
          {!isToday && (
            <div className="fv-night-row" aria-hidden="true">
              {units.map((u, i) => (
                <React.Fragment key={u.label}>
                  <div className="fv-night-cell">
                    <span className="fv-night-n">
                      <RollingNumber value={u.val} className="fv-foil" />
                    </span>
                    <span className="fv-night-u">{u.label}</span>
                  </div>
                  {i < units.length - 1 && (
                    <span className="fv-night-sep" aria-hidden="true">
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <p className="fv-night-line">
            {isToday ? 'we say forever' : 'until we say forever'}
          </p>

          <div className="mt-3">
            <p className="fv-night-date">{shortDate(weddingDate)}</p>
          </div>
        </div>

        {/* Ambient Flickering Diyas with Optical Parallax */}
        <div className="fv-diyas" aria-hidden="true">
          {[1, 2, 3].map((num) => (
            <ParallaxDrift
              key={num}
              depth={diyaDepths[num - 1]}
              className={`fv-diya fv-diya--${num}`}
            >
              <span className="fv-diya-glow" />
              <img
                src={`/templates/forever/desi/diya-${num}.webp`}
                alt=""
                draggable={false}
                decoding="async"
              />
            </ParallaxDrift>
          ))}
        </div>
      </div>
    </section>
  );
}
