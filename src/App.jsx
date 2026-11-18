import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { DEFAULT_WEDDING_DATA, parseIsoDate } from './config/defaultWedding';
import EnvelopeIntro from './components/EnvelopeIntro';
import HeroSection from './components/HeroSection';
import InvitationCard from './components/InvitationCard';
import EventsSection from './components/EventsSection';
import VenueMapSection from './components/VenueMapSection';
import CountdownSection from './components/CountdownSection';
import NoteSection from './components/NoteSection';
import BlessingsFinale from './components/BlessingsFinale';
import MusicPlayer from './components/MusicPlayer';
import CustomizeDrawer from './components/CustomizeDrawer';
import GuideHint from './components/GuideHint';
import { ScrollProvider } from './context/ScrollContext';
import { CoupleProvider } from './context/CoupleContext';

const STORAGE_KEY = 'vyoma_wedding_invitation_data_v3';

export default function App() {
  const [data, setData] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vyoma_wedding_invitation_data');
      }
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const hasInviteParam = params && (params.get('inviteId') || params.get('id'));
      if (!hasInviteParam) {
        const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.hero?.groom_name === DEFAULT_WEDDING_DATA.hero.groom_name) {
            // Ensure photos always use latest framing if not user custom uploads
            if (!parsed.photos || parsed.photos.some(p => p?.src?.includes('couple-') || p?.src?.includes('hero_'))) {
              parsed.photos = DEFAULT_WEDDING_DATA.photos;
            }
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read saved wedding data:', e);
    }
    return DEFAULT_WEDDING_DATA;
  });

  const [phase, setPhase] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isOwnerEdit = params.get('mode') === 'owner_edit' && (Boolean(localStorage.getItem('vyoma_customer_session')) || params.has('owner_token'));
      if (isOwnerEdit && (params.get('edit') === '1' || params.get('customize') === '1')) {
        return 'open'; // skip envelope intro directly to canvas only for authenticated owner
      }
    } catch {}
    return 'sealed';
  });
  const [drawerOpen, setDrawerOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isOwnerEdit = params.get('mode') === 'owner_edit' && (Boolean(localStorage.getItem('vyoma_customer_session')) || params.has('owner_token'));
      return isOwnerEdit && (params.get('edit') === '1' || params.get('customize') === '1');
    } catch {}
    return false;
  });
  const [screenHeight, setScreenHeight] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const scrollContainerRef = useRef(null);
  
  // Resolve client invitation ID or slug from query or path
  const resolveInviteId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('inviteId') || params.get('id');
    if (q) return q;

    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (!path) return null;
    const segs = path.split('/');
    if ((segs[0] === 'invite' || segs[0] === 'w') && segs.length > 1) {
      return segs[1];
    }
    const reserved = ['invite', 'internal', 'api', 'assets', 'uploads', 'photos', 'audio', 'templates', 'fonts', 'index.html'];
    if (segs.length === 1 && !reserved.includes(segs[0])) {
      return segs[0];
    }
    return null;
  }, []);

  const inviteId = typeof window !== 'undefined' ? resolveInviteId() : null;

  // Dynamic API Hydration from ?inviteId=, ?id=, or vanity path
  useEffect(() => {
    try {
      const targetId = resolveInviteId();
      if (targetId) {
        fetch(`/api/invitations/${encodeURIComponent(targetId)}`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(rawResp => {
            const apiData = (rawResp && rawResp.data && rawResp.data.hero) ? rawResp.data : rawResp;
            if (apiData && apiData.hero) {
              const mapped = {
                ...DEFAULT_WEDDING_DATA,
                theme: {
                  ...DEFAULT_WEDDING_DATA.theme,
                  ...(apiData.theme || {}),
                  id: apiData.theme?.id || 'royal-heritage'
                },
                hero: {
                  ...DEFAULT_WEDDING_DATA.hero,
                  bride_name: apiData.hero.bride_name,
                  groom_name: apiData.hero.groom_name,
                  wedding_date: apiData.hero.wedding_date || apiData.countdown?.wedding_date || '2026-11-30',
                  city: apiData.hero.city,
                  venue: apiData.hero.venue
                },
                countdown: {
                  wedding_date: apiData.countdown?.wedding_date || apiData.hero.wedding_date || '2026-11-30',
                  start_time: apiData.countdown?.start_time || '09:30'
                },
                envelope: {
                  monogram: apiData.monogram?.text || apiData.envelope?.monogram || 'V',
                  hint: apiData.envelope?.hint || 'Tap to open invitation'
                },
                invitation: {
                  ...DEFAULT_WEDDING_DATA.invitation,
                  bride_full_name: apiData.invitation?.bride_full_name || apiData.hero.bride_name,
                  bride_parents: apiData.invitation?.bride_parents || '',
                  groom_full_name: apiData.invitation?.groom_full_name || apiData.hero.groom_name,
                  groom_parents: apiData.invitation?.groom_parents || '',
                  message: apiData.invitation?.message || DEFAULT_WEDDING_DATA.invitation.message,
                  venue: apiData.invitation?.venue || apiData.venue?.name,
                  city: apiData.invitation?.city || apiData.hero.city,
                  time: apiData.invitation?.time || DEFAULT_WEDDING_DATA.invitation.time || '9:30 AM to 10:30 AM',
                  note: apiData.invitation?.note || ''
                },
                events: apiData.events?.items ? apiData.events : {
                  heading: 'The Celebrations',
                  items: apiData.events || DEFAULT_WEDDING_DATA.events.items
                },
                details: {
                  ...DEFAULT_WEDDING_DATA.details,
                  ...(apiData.details || {}),
                  where: apiData.details?.where || (apiData.venue?.name ? `${apiData.venue.name}\n${apiData.venue.address || ''}` : DEFAULT_WEDDING_DATA.details.where),
                  address: apiData.details?.address || apiData.venue?.address || DEFAULT_WEDDING_DATA.details.address,
                  map_url: apiData.details?.map_url || apiData.venue?.map_url || '#venue-map'
                },
                venue: apiData.venue || DEFAULT_WEDDING_DATA.venue,
                photos: Array.isArray(apiData.photos)
                  ? apiData.photos.filter(p => p && p.src)
                  : (apiData.photos?.gallery?.map(src => ({ src })).filter(p => p && p.src) || []),
                squads: apiData.squads || {
                  bride: { title: `Team ${apiData.hero.bride_name.split(' ')[0]}` },
                  groom: { title: `Team ${apiData.hero.groom_name.split(' ')[0]}` }
                },
                note: apiData.note || {
                  heading: 'A Note From Us',
                  message: apiData.invitation?.note || apiData.notes?.loveStory || apiData.notes?.welcomeMessage || "We can't wait to celebrate with you.",
                  signoff: 'With love,',
                  photo: null,
                },
                blessings: apiData.blessings || DEFAULT_WEDDING_DATA.blessings,
                audio_url: apiData.audio_url || apiData.music?.url || DEFAULT_WEDDING_DATA.audio_url,
              };
              if (apiData.hero?.bride_name && apiData.hero?.groom_name) {
                document.title = `${apiData.hero.bride_name} & ${apiData.hero.groom_name} — Wedding Celebration | VYOMA`;
              }
              setData(mapped);
            }
          })
          .catch(err => console.warn('Could not hydrate invitation from API:', err));
      }
    } catch (e) {
      console.warn('Hydration query parsing error:', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save wedding data:', e);
    }
  }, [data]);

  // Viewport height tracking for the scroll container
  useEffect(() => {
    let lastH = 0;
    const measure = () => {
      const el = scrollContainerRef.current;
      const h = el ? el.clientHeight : window.innerHeight;
      if (Math.abs(h - lastH) < 8) return;
      lastH = h;
      setScreenHeight(h);
      document.documentElement.style.setProperty('--fv-screen', `${h}px`);
      document.documentElement.style.setProperty('--fv-stage', `${h}px`);
      document.documentElement.style.setProperty('--fv-tall', `${h}px`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (scrollContainerRef.current) ro.observe(scrollContainerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const [wasSkipped, setWasSkipped] = useState(false);

  // Envelope opening sequence (5.6s timer aligned with CSS bloom climax)
  useEffect(() => {
    if (phase === 'opening') {
      const timer = setTimeout(() => {
        setPhase('open');
      }, 5600);
      return () => clearTimeout(timer);
    }
    if (phase === 'sealing') {
      const timer = setTimeout(() => {
        setPhase('sealed');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Natural human-like auto-scroll after 3.5 seconds of stillness on the open invitation
  useEffect(() => {
    if (phase !== 'open') return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let animId = null;
    let autoScrollCancelled = false;

    // Detect actual manual user scrolling (> 20px displacement)
    const onManualScroll = () => {
      if (container.scrollTop > 20) {
        autoScrollCancelled = true;
      }
    };

    let touchStartY = null;
    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (touchStartY !== null && e.touches && e.touches[0]) {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        if (deltaY > 15) {
          autoScrollCancelled = true;
          if (animId) cancelAnimationFrame(animId);
        }
      }
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > 5) {
        autoScrollCancelled = true;
        if (animId) cancelAnimationFrame(animId);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('scroll', onManualScroll, { passive: true });

    // After 3.5s of stillness on the hero: initiate human-like smooth glide
    const timer = setTimeout(() => {
      if (autoScrollCancelled || container.scrollTop > 20) {
        return;
      }

      const startY = container.scrollTop;
      // Scroll smoothly to reveal the royal invitation card below the hero
      const targetY = Math.min(window.innerHeight * 0.72, 540);
      const distance = targetY - startY;
      if (distance <= 0) return;

      const duration = 2200; // 2.2s natural thumb-flick momentum
      const startTime = performance.now();

      const interrupt = () => {
        autoScrollCancelled = true;
        if (animId) cancelAnimationFrame(animId);
        cleanupInterrupt();
      };

      const cleanupInterrupt = () => {
        window.removeEventListener('touchstart', interrupt);
        window.removeEventListener('wheel', interrupt);
      };

      window.addEventListener('touchstart', interrupt, { passive: true });
      window.addEventListener('wheel', interrupt, { passive: true });

      // Natural thumb-swipe cubic bezier curve
      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now) => {
        if (autoScrollCancelled) {
          cleanupInterrupt();
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        container.scrollTop = startY + distance * eased;

        if (progress < 1 && !autoScrollCancelled) {
          animId = requestAnimationFrame(step);
        } else {
          cleanupInterrupt();
        }
      };

      animId = requestAnimationFrame(step);
    }, 3500);

    return () => {
      clearTimeout(timer);
      autoScrollCancelled = true;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('scroll', onManualScroll);
    };
  }, [phase]);

  // Preload photos and textures during opening with a gentle delay to preserve GPU bandwidth
  useEffect(() => {
    if (phase === 'opening') {
      const timer = setTimeout(() => {
        const urls = [
          ...(data.photos || []).map((p) => p.src),
          '/templates/forever/paper/card.webp',
          '/templates/forever/paper/grain.webp',
          '/templates/forever/paper/foil-deep.webp',
          '/templates/forever/paper/foil-light.webp',
          '/templates/forever/paper/note.webp',
          '/templates/forever/paper/sprig-fern.webp',
          '/templates/forever/paper/sprig-rose.webp',
          '/templates/forever/paper/tape-gold.webp',
          '/templates/forever/desi/silk.webp',
          '/templates/forever/desi/zari.webp',
          '/templates/forever/desi/bangles.webp',
          '/templates/forever/desi/silk-berry.webp',
          '/templates/forever/desi/mandala-half.webp',
          '/templates/forever/desi/rangoli.webp',
          '/templates/heritage-scroll-assamese/our_story_frame.webp',
          '/templates/heritage-scroll-assamese/our_story_frame_shadow_v2.webp',
        ];
        urls.forEach((url) => {
          if (!url) return;
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, data.photos]);

  const handleOpen = () => {
    if (phase === 'sealed') {
      setWasSkipped(false);
      setPhase('opening');
      setMusicPlaying(true);
    }
  };

  const handleSkip = () => {
    setWasSkipped(true);
    setPhase('open');
    setMusicPlaying(true);
  };

  const handleMusicToggle = useCallback((explicitState) => {
    setMusicPlaying((prev) => (typeof explicitState === 'boolean' ? explicitState : !prev));
  }, []);

  const handleReplay = () => {
    // Play warm tactile wax seal sound
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(170, now + 1.1);
        osc.frequency.exponentialRampToValueAtTime(50, now + 1.45);
        gain.gain.setValueAtTime(0.32, now + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.48);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 1.1);
        osc.stop(now + 1.5);
        setTimeout(() => {
          try { ctx.close(); } catch (e) { }
        }, 2000);
      }
    } catch (e) { }

    if (navigator.vibrate) {
      setTimeout(() => {
        try { navigator.vibrate([60, 30, 80]); } catch (e) { }
      }, 1100);
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    setPhase('sealing');
  };

  const handleReset = () => {
    if (window.confirm('Reset all details to the default wedding template?')) {
      setData(DEFAULT_WEDDING_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) { }
    }
  };

  const weddingDateObj = parseIsoDate(data.countdown?.wedding_date);
  const brideName = data.hero?.bride_name || 'Bride';
  const groomName = data.hero?.groom_name || 'Groom';
  const coupleTitle = `${brideName} & ${groomName}`;

  const FONT_MAP = {
    playfair: '"Playfair Display", Georgia, serif',
    greatvibes: '"Great Vibes", "Allura", cursive',
    cinzel: '"Cinzel", "Playfair Display", Georgia, serif',
    vandella: '"Vandella", "Great Vibes", cursive',
    bodoni: '"Bodoni Moda", "Playfair Display", serif',
  };
  const coupleFontKey = data.theme?.couple_font || 'playfair';
  const namesFontFamily = FONT_MAP[coupleFontKey] || FONT_MAP.playfair;

  return (
    <MotionConfig reducedMotion="user">
      <CoupleProvider
        bride={brideName}
        groom={groomName}
        brideParents={data.invitation?.bride_parents}
        groomParents={data.invitation?.groom_parents}
      >
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-[#68183C]">
        {/* Floating Customizer Drawer */}
        <CustomizeDrawer
          data={data}
          onChange={setData}
          onReset={handleReset}
          isOpen={drawerOpen}
          onToggle={() => setDrawerOpen(!drawerOpen)}
          inviteId={inviteId}
        />

        {/* Ambient Wedding Music Player */}
        <MusicPlayer
          src={data.audio_url || '/audio/wedding_music.mp3'}
          isPlaying={musicPlaying}
          onTogglePlay={handleMusicToggle}
        />

        {/* Designated scroll container matching ScrollVite's #app-scroll */}
        <main
          id="app-scroll"
          ref={scrollContainerRef}
          style={{ position: 'relative', overscrollBehaviorY: 'none', WebkitOverflowScrolling: 'touch' }}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative"
        >
          <div
            className={`fv-root fv--forever ${data.theme?.id === 'floral-luxe' ? 'theme-floral-luxe' : 'theme-royal-heritage'}`}
            data-theme={data.theme?.id || 'royal-heritage'}
            data-phase={phase}
            style={{ '--fv-names': namesFontFamily }}
          >
            {/* Sealed Envelope Opening Sequence */}
            <AnimatePresence>
              {phase !== 'open' && (
                <EnvelopeIntro
                  key="intro"
                  phase={phase}
                  onOpen={handleOpen}
                  onSkip={handleSkip}
                  monogram={data.envelope?.monogram}
                  hint={phase === 'sealing' ? 'Sealing the royal invitation...' : data.envelope?.hint}
                  brideName={brideName}
                  groomName={groomName}
                />
              )}
            </AnimatePresence>

            {/* Seamless Persistent Golden Light Bridge (Guarantees zero-flash handoff on mobile) */}
            <div
              className={`fv-fixed-bridge ${phase === 'open' ? 'fv-fixed-bridge--fadeout' : ''}`}
              aria-hidden="true"
            />

            {/* Open State: The Royal Wedding Invitation Page */}
            {phase === 'open' && (
              <>
                <ScrollProvider
                  containerRef={scrollContainerRef}
                  style={{
                    '--fv-names': namesFontFamily,
                    ...(screenHeight
                      ? {
                        '--fv-screen': `${screenHeight}px`,
                        '--fv-stage': `${screenHeight}px`,
                        '--fv-tall': `${screenHeight}px`,
                      }
                      : {}),
                  }}
                >
                  {/* Hero & First Section */}
                  <div className="fv-first">
                    <div className="fv-first-bg" aria-hidden="true" />
                  <HeroSection
                    brideName={brideName}
                    groomName={groomName}
                    kicker={data.hero?.kicker}
                    dateObj={weddingDateObj}
                    photos={data.photos}
                  />
                  <InvitationCard
                    schema={data}
                    dateObj={weddingDateObj}
                  />
                </div>

                {/* Celebrations / Functions */}
                <EventsSection events={data.events} />

                {/* Embedded Venue Map & Driving Directions for Reception & Muhurtham */}
                <VenueMapSection venue={data.venue} details={data.details} />

                {/* Live Wedding Countdown */}
                <CountdownSection
                  weddingDate={weddingDateObj}
                  startTime={data.countdown?.start_time}
                />

                {/* Romantic Note from the Couple */}
                <NoteSection
                  note={data.note}
                  coupleTitle={coupleTitle}
                  photos={data.photos}
                />

                {/* Blessings, Finale Wax Seal, and Replay Button */}
                <BlessingsFinale
                  schema={data}
                  onReplay={handleReplay}
                />

                {/* Continuous scroll guide hint prompting exploration */}
                <GuideHint
                  kind="scroll"
                  text="Scroll down to explore"
                  scrollRef={scrollContainerRef}
                />
              </ScrollProvider>
            </>
          )}
          </div>
        </main>
      </div>
      </CoupleProvider>
    </MotionConfig>
  );
}
