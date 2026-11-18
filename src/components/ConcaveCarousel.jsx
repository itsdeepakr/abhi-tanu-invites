import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ZoomIn, Sparkles, User, Calendar, Trash2, Edit3, Crown } from 'lucide-react';

export default function ConcaveCarousel({
  items = [],
  activeIndex = 0,
  onChangeActive,
  onPhotoClick,
  onLike,
  isHostMode = false,
  onDeletePhoto,
  onEditPhoto,
  myPhotoIds = [],
  likedPhotoIds = [],
  guestName = '',
  brideTeamName = 'Team Bride',
  groomTeamName = 'Team Groom',
  autoDrift = true,
  driftIntervalMs = 4500,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [dimensions, setDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 400,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : true,
  });

  // Track window resizing for responsive 3D radius and angles
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth || window.innerWidth;
        setDimensions({
          w,
          isMobile: w < 768,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = items.length;
  const current = activeIndex;

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    const next = (current - 1 + total) % total;
    onChangeActive?.(next);
  }, [current, total, onChangeActive]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    const next = (current + 1) % total;
    onChangeActive?.(next);
  }, [current, total, onChangeActive]);

  // Gentle auto-drift when not hovered or dragged, pausing when page is hidden
  useEffect(() => {
    if (!autoDrift || isHovered || isDragging || total <= 1) return;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      handleNext();
    }, driftIntervalMs);
    return () => clearInterval(timer);
  }, [autoDrift, isHovered, isDragging, total, driftIntervalMs, handleNext]);

  // Pointer drag handling for 3D curved dragging
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || (e.touches && e.touches[0]?.clientX) || 0);
    setDragDeltaX(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const delta = clientX - dragStartX;
    setDragDeltaX(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = dimensions.isMobile ? 45 : 70;
    if (dragDeltaX > threshold) {
      handlePrev();
    } else if (dragDeltaX < -threshold) {
      handleNext();
    }
    setDragDeltaX(0);
  };

  if (total === 0) {
    return (
      <div className="py-12 text-center text-[#F4D9A6]/80 font-serif">
        No wedding moments uploaded yet. Be the first to share one!
      </div>
    );
  }

  // 3D Geometry settings for concave drum curvature (Mobile-First Responsive)
  const isMobile = dimensions.isMobile;
  const itemWidth = isMobile
    ? Math.min(300, Math.max(275, Math.floor(dimensions.w - 52)))
    : 340;
  const itemHeight = isMobile ? 425 : 460;
  const radius = isMobile ? 420 : 560;
  const angleStep = isMobile ? 32 : 28;

  return (
    <div
      ref={containerRef}
      id="concave-moments-carousel"
      className="relative w-full max-w-5xl mx-auto py-3 sm:py-6 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      style={{
        perspective: '1200px',
        touchAction: 'pan-y',
      }}
    >
      {/* 3D Curved Gallery Stage Container */}
      <div
        className="relative mx-auto flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          width: '100%',
          height: `${itemHeight + (isMobile ? 25 : 40)}px`,
        }}
      >
        {items.map((item, index) => {
          let diff = (index - current) % total;
          if (diff < -Math.floor(total / 2)) diff += total;
          if (diff > Math.floor(total / 2)) diff -= total;

          const isVisible = Math.abs(diff) <= (isMobile ? 2 : 3);
          if (!isVisible) return null;

          const absDiff = Math.abs(diff);
          const dir = Math.sign(diff);
          const isActive = diff === 0;

          // Non-overlapping spacing with inward concave curvature
          const baseOffset = isMobile ? Math.round(itemWidth * 0.80) : 270;
          const extraOffset = isMobile ? 100 : 160;
          const tx = isActive ? 0 : dir * (baseOffset + (absDiff - 1) * extraOffset);
          const tz = isActive ? 0 : -absDiff * (isMobile ? 70 : 85);
          const scale = isActive ? 1.02 : Math.max(0.72, 0.88 - (absDiff - 1) * 0.1);
          const ry = isActive ? 0 : dir * (isMobile ? -14 : -18);

          const isMyPhoto =
            myPhotoIds.includes(item.id) ||
            (guestName && item.uploader?.name?.toLowerCase() === guestName.toLowerCase());
          const hasLiked = likedPhotoIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              className="absolute cursor-pointer will-change-transform"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                zIndex: 100 - absDiff * 15,
                opacity: Math.max(0.3, 1 - absDiff * 0.22),
                filter: isActive ? 'none' : 'brightness(0.85) contrast(0.95)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transition: isDragging
                  ? 'none'
                  : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease',
              }}
              onClick={() => {
                if (isActive) {
                  onPhotoClick?.(item);
                } else {
                  onChangeActive?.(index);
                }
              }}
            >
              {/* Royal Wedding Polaroid Card */}
              <div className="relative w-full h-full bg-[#FFFBF3] rounded-2xl p-3 sm:p-4 flex flex-col justify-between border border-[#A67C45]/40 shadow-[0_12px_36px_rgba(74,44,39,0.22)] overflow-hidden">
                {/* Gold filigree corner accents on active slide */}
                {isActive && (
                  <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none rounded-tl-sm" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none rounded-tr-sm" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none rounded-bl-sm" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none rounded-br-sm" />
                  </>
                )}

                {/* Photo container with Smart Aspect Ratio Preservation */}
                <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-[#180610] group border border-[#D4AF37]/30 shadow-inner flex items-center justify-center">
                  {/* Subtle blurred ambient backdrop to fill landscape / portrait gaps */}
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                    loading="lazy"
                  />
                  {/* The uncropped photo - shows complete image naturally */}
                  <img
                    src={item.src}
                    alt={item.caption || 'Wedding moment'}
                    className="relative max-w-full max-h-full object-contain z-1 transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />

                  {/* Top-Left Floating Badge: Ceremony Tag */}
                  {item.eventTag && (
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-[#68183C]/90 text-[#FFFDF8] border border-[#D4AF37]/60 shadow-md backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-[#F4D9A6]" />
                        <span>{item.eventTag}</span>
                      </span>
                    </div>
                  )}

                  {/* Top-Right Floating Button: Heart Reaction */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike?.(item.id, e);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-serif font-bold transition-all shadow-md backdrop-blur-md cursor-pointer active:scale-90 border ${
                        hasLiked
                          ? 'bg-rose-950/85 text-rose-200 border-rose-400'
                          : 'bg-[#1E0812]/75 hover:bg-[#1E0812] text-[#FFFDF8] border-white/30 hover:border-[#D4AF37]'
                      }`}
                      title={hasLiked ? "You cheered for this photo" : "Send love (+2 pts)"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          hasLiked || (item.likes || 0) > 0 ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                      <span className="font-mono text-xs font-bold">{item.likes || 0}</span>
                    </button>
                  </div>

                  {/* Tap to expand hint on active item */}
                  {isActive && !isHostMode && (
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-serif font-bold tracking-wider bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-2">
                      <ZoomIn className="w-4 h-4 text-[#E8C877]" />
                      <span>View Full Resolution</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Generous text padding, mobile-first alignment */}
                <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/30 flex flex-col gap-2 text-left">
                  {/* Uploader & Actions Header Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#8B5A2B] text-[#1E0812] text-xs font-bold font-serif flex items-center justify-center shrink-0 border border-[#FFFDF8] shadow-sm">
                        {item.uploader?.name ? item.uploader.name.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs sm:text-sm font-bold font-serif text-[#1E0812] truncate leading-tight">
                            {item.uploader?.name || 'Wedding Guest'}
                          </p>
                          {isMyPhoto && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#5A3831] font-bold border border-[#D4AF37]/40 leading-none">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] leading-snug">
                          {(item.team === 'kavana' || item.team === 'bride' || item.team === 'tanuja') && (
                            <span className="text-pink-700 font-bold flex items-center gap-0.5">
                              <Sparkles className="w-3 h-3 text-pink-500" />
                              <span>{brideTeamName || 'Team Bride'}</span>
                            </span>
                          )}
                          {(item.team === 'nithin' || item.team === 'groom' || item.team === 'abhishek') && (
                            <span className="text-blue-700 font-bold flex items-center gap-0.5">
                              <Crown className="w-3 h-3 text-blue-500" />
                              <span>{groomTeamName || 'Team Groom'}</span>
                            </span>
                          )}
                          {item.uploader?.relation && (
                            <span className="text-[#5A3831] opacity-75 truncate">
                              • {item.uploader.relation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner / Host Actions */}
                    {(isMyPhoto || (isHostMode && onDeletePhoto)) && (
                      <div className="flex items-center gap-1 shrink-0">
                        {isMyPhoto && onEditPhoto && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPhoto(item);
                            }}
                            className="p-1.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#8B5A2B] border border-[#D4AF37]/40 transition active:scale-95 cursor-pointer"
                            title="Edit caption"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {((isMyPhoto && onDeletePhoto) || (!isMyPhoto && isHostMode && onDeletePhoto)) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePhoto(item.id);
                            }}
                            className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 transition active:scale-95 cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Caption Box: Generous padding, readable 2 lines */}
                  {item.caption ? (
                    <div className="bg-[#FDF9F0] rounded-xl px-3 py-2 border border-[#D4AF37]/25 shadow-2xs">
                      <p className="text-xs text-[#2A0C18] italic font-serif leading-relaxed line-clamp-2">
                        “{item.caption}”
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#FDF9F0]/60 rounded-xl px-3 py-2 border border-[#D4AF37]/15">
                      <p className="text-xs text-[#8C6D62] italic font-serif leading-relaxed">
                        A candid celebration memory 🌸
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Royal Navigation Controls (Mobile-First Thumb Friendly) */}
      <div className="relative z-20 flex items-center justify-between px-3 sm:px-8 mt-3 pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto w-10 h-10 rounded-full bg-[#FFFBF3]/95 hover:bg-[#FFFBF3] text-[#4A2C27] shadow-xl border border-[#D4AF37]/60 hover:scale-105 active:scale-95 transition-all backdrop-blur-md cursor-pointer flex items-center justify-center"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5 text-[#8B5A2B]" />
        </button>

        {/* Carousel indicators with compact mobile pagination */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#1E0812]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 shadow-lg">
          {total <= 7 ? (
            items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => onChangeActive?.(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === current
                    ? 'w-6 h-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D9A6]'
                    : 'w-2 h-2 bg-[#FFFBF3]/35 hover:bg-[#FFFBF3]/70'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#F4D9A6]">
              <span>{current + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/80">{total}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto w-10 h-10 rounded-full bg-[#FFFBF3]/95 hover:bg-[#FFFBF3] text-[#4A2C27] shadow-xl border border-[#D4AF37]/60 hover:scale-105 active:scale-95 transition-all backdrop-blur-md cursor-pointer flex items-center justify-center"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5 text-[#8B5A2B]" />
        </button>
      </div>

      {/* Helpful Mobile Gestures Hint */}
      <div className="mt-2 text-center pointer-events-none">
        <span className="text-[11px] font-serif text-[#F4D9A6]/75 inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Swipe or tap arrows to explore wedding moments</span>
        </span>
      </div>
    </div>
  );
}
