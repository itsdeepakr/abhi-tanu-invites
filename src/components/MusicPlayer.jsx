import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Ambient Wedding Music Player
 * - Autoplays on user gesture or envelope opening
 * - Bulletproof synchronization without pause/play oscillation
 * - High fidelity HTML5 audio with zero glitching or buffer underrun
 */
export default function MusicPlayer({
  src = '/audio/kannada_wedding_instrumental.mp3',
  positionClassName = 'bottom-5 right-5 md:bottom-6 md:right-6',
  isPlaying: parentIsPlaying,
  onTogglePlay,
}) {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep callback reference updated without triggering effect re-runs
  const onToggleRef = useRef(onTogglePlay);
  useEffect(() => {
    onToggleRef.current = onTogglePlay;
  }, [onTogglePlay]);

  // Stable playback controller
  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setIsPlaying(true);
          onToggleRef.current?.(true);
        })
        .catch((err) => {
          // Autoplay policy prevented playback until explicit gesture
          console.debug('Autoplay waiting for user gesture:', err);
        });
    }
  }, []);

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    onToggleRef.current?.(false);
  }, []);

  // React to parent isPlaying state (e.g. envelope seal tap / skip button)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (parentIsPlaying === true && audio.paused) {
      startPlayback();
    } else if (parentIsPlaying === false && !audio.paused) {
      pausePlayback();
    }
  }, [parentIsPlaying, startPlayback, pausePlayback]);

  // One-time window gesture unlock (runs ONCE on mount, NEVER tears down audio on re-render)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let unlocked = false;

    const handleFirstGesture = (e) => {
      // Ignore if clicking directly on the toggle button
      if (buttonRef.current?.contains(e.target)) return;

      if (!unlocked) {
        unlocked = true;
        if (audio.paused) {
          startPlayback();
        }
        cleanup();
      }
    };

    const cleanup = () => {
      ['pointerdown', 'touchend', 'click', 'keydown'].forEach((ev) => {
        window.removeEventListener(ev, handleFirstGesture, { capture: true });
      });
    };

    ['pointerdown', 'touchend', 'click', 'keydown'].forEach((ev) => {
      window.addEventListener(ev, handleFirstGesture, { capture: true, passive: true });
    });

    return cleanup;
  }, [startPlayback]);

  // Direct toggle on button click
  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      startPlayback();
    } else {
      pausePlayback();
    }
  };

  const isPaused = !isPlaying;
  const label = isPaused ? 'Play Kannada wedding music' : 'Mute wedding music';
  const icon = isPaused ? '🔇' : '🔊';

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePlay}
        aria-label={label}
        title={label}
        className={`fixed ${positionClassName} z-[10000] flex items-center justify-center h-11 w-11 md:h-12 md:w-12 text-lg md:text-xl rounded-full bg-[#200512]/85 text-[#F4D9A6] shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#34091E] active:scale-95 border-2 border-[#D4AF37]/60 cursor-pointer`}
      >
        <span aria-hidden="true" className="select-none">{icon}</span>
        {isPaused && (
          <span className="absolute inset-0 rounded-full ring-2 ring-[#FFDF73]/60 animate-ping pointer-events-none" />
        )}
      </button>
    </>
  );
}
