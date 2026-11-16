import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Sparkles,
  Heart,
  X,
  Check,
  Download,
  Share2,
  Calendar,
  User,
  Image as ImageIcon,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Trash2,
  Flag,
  Edit3,
  Trophy,
  Crown,
  Flame,
  Swords,
  Users,
  Bell,
  Volume2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import ConcaveCarousel from './ConcaveCarousel';
import { useCouple } from '../context/CoupleContext';

const GUEST_STORAGE_KEY = 'vyoma_guest_profile_prod';
const PHOTOS_STORAGE_KEY = 'vyoma_wedding_hub_photos_prod';
const HIDDEN_PHOTOS_KEY = 'vyoma_hidden_photos_prod';
const SQUAD_STORAGE_KEY = 'vyoma_guest_side_prod'; // 'bride' | 'groom'
const MY_PHOTOS_STORAGE_KEY = 'vyoma_my_photo_ids_prod';
const LIKED_PHOTOS_KEY = 'vyoma_liked_photos_prod';
const DAILY_CHEERS_KEY = 'vyoma_daily_cheers_prod';
const MAX_DAILY_CHEERS = 5;
const HOST_PIN = '1611'; // Nov 16 Wedding Date (also supports legacy '1234')

// Authentic wedding celebration moments for the Royal Wall & Squad Battle
const INITIAL_GALLERY_PHOTOS = [
  {
    id: 'at-photo-1',
    src: '/photos/abhishek_tanuja/photo-1.jpg',
    caption: 'Abhishek & Tanuja - Together towards a beautiful forever 💫💍',
    eventTag: 'Muhurtham',
    team: 'groom',
    likes: 64,
    uploader: {
      name: 'Abhishek & Tanuja',
      relation: "The Couple",
      timestamp: 'Wedding Day'
    }
  },
  {
    id: 'at-photo-2',
    src: '/photos/abhishek_tanuja/photo-2.jpg',
    caption: 'Radiant smiles and heartwarming wedding moments with loved ones 🌸✨',
    eventTag: 'Reception',
    team: 'bride',
    likes: 58,
    uploader: {
      name: 'Tanuja & Family',
      relation: "Bride's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'at-photo-3',
    src: '/photos/abhishek_tanuja/photo-3.jpg',
    caption: 'Royal traditional portrait in auspicious ceremonial elegance 👑💛',
    eventTag: 'Celebrations',
    team: 'groom',
    likes: 54,
    uploader: {
      name: 'Abhishek & Friends',
      relation: "Groom's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'at-photo-4',
    src: '/photos/abhishek_tanuja/photo-4.jpg',
    caption: 'Cherished memories and celebration laughs 💫',
    eventTag: 'Reception',
    team: 'bride',
    likes: 49,
    uploader: {
      name: "Bride's Squad",
      relation: "Family",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-8',
    src: '/templates/forever/desi/obj-thali.webp',
    caption: 'The sacred Dhara Muhurtham thali mangalsutra moment of eternal bond 💍✨',
    eventTag: 'Muhurtham',
    team: 'bride',
    likes: 52,
    uploader: {
      name: 'Family Elders',
      relation: "Bride's Squad",
      timestamp: 'Wedding Day'
    }
  },
  {
    id: 'snap-6',
    src: '/templates/forever/desi/obj-safa.webp',
    caption: 'Grand Royal Baraat procession with traditional safa and dhol beats 🥁👑',
    eventTag: 'Reception',
    team: 'groom',
    likes: 46,
    uploader: {
      name: 'Chacha & Brothers',
      relation: "Groom's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-9',
    src: '/templates/forever/desi/obj-rings.webp',
    caption: 'Radiant rings exchange ceremony surrounded by love, cheers & petals 💫',
    eventTag: 'Celebrations',
    team: 'groom',
    likes: 43,
    uploader: {
      name: 'Abhishek & Friends',
      relation: "Groom's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-7',
    src: '/templates/forever/desi/obj-chooda.webp',
    caption: 'Emotional chooda & kalire blessing ceremony with maternal uncles and aunts 🌸',
    eventTag: 'Celebrations',
    team: 'bride',
    likes: 38,
    uploader: {
      name: 'Maternal Family',
      relation: "Bride's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-5',
    src: '/templates/forever/desi/bangles.webp',
    caption: 'Traditional green glass bangles and bridal shringaar celebration 💚',
    eventTag: 'Mehendi',
    team: 'bride',
    likes: 35,
    uploader: {
      name: 'Radhika & Cousins',
      relation: "Bride's Squad",
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-1',
    src: '/templates/forever/demo/photo-1.webp',
    caption: 'Golden Haldi celebration smiles! Joy and blessings in the air 💛',
    eventTag: 'Haldi',
    team: 'bride',
    likes: 34,
    uploader: {
      name: "Bride's Family",
      relation: 'Ladkiwale',
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-4',
    src: '/templates/forever/desi/obj-cocktail.webp',
    caption: 'Sizzling pre-wedding sangeet cocktails and laughter with friends! 🥂✨',
    eventTag: 'Reception',
    team: 'groom',
    likes: 31,
    uploader: {
      name: 'Baraat Boys',
      relation: 'Groom Squad',
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-2',
    src: '/templates/forever/demo/photo-2.webp',
    caption: 'Electrifying Sangeet night beats and celebration dance 🕺✨',
    eventTag: 'Sangeet',
    team: 'groom',
    likes: 28,
    uploader: {
      name: "Groom's Family",
      relation: 'Ladkewale',
      timestamp: 'Celebration Day'
    }
  },
  {
    id: 'snap-3',
    src: '/templates/forever/demo/photo-3.webp',
    caption: 'Intricate mehendi artistry and laughter all around 🌸',
    eventTag: 'Mehendi',
    team: 'bride',
    likes: 22,
    uploader: {
      name: 'Celebration Guest',
      relation: "Bride's Squad",
      timestamp: 'Celebration Day'
    }
  }
];

export default function PhotoGalleryHub({
  schema,
  brideName: propBrideName,
  groomName: propGroomName,
  squads,
}) {
  const couple = useCouple();
  const bName = propBrideName || schema?.hero?.bride_name || couple?.bride || 'Tanuja';
  const gName = propGroomName || schema?.hero?.groom_name || couple?.groom || 'Abhishek';
  const brideShort = bName.split(' ')[0].trim() || 'Tanuja';
  const groomShort = gName.split(' ')[0].trim() || 'Abhishek';
  const brideTeamName = squads?.bride?.title || (bName.toLowerCase().includes('tanuja') ? 'Team Tanuja' : (bName.toLowerCase().includes('kavana') ? 'Team Kavana' : `Team ${brideShort}`));
  const groomTeamName = squads?.groom?.title || (gName.toLowerCase().includes('abhishek') ? 'Team Abhishek' : (gName.toLowerCase().includes('nithin') ? 'Team Nithin' : `Team ${groomShort}`));

  const isBrideTeam = (t) => t === 'bride' || t === 'kavana' || t === 'tanuja';
  const isGroomTeam = (t) => t === 'groom' || t === 'nithin' || t === 'abhishek';

  // Guest Identity Profile
  const [guestProfile, setGuestProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { name: '', relation: '' };
    } catch (e) {
      return { name: '', relation: '' };
    }
  });

  // Permanently Locked Squad Allegiance ('bride' | 'groom' | null)
  const [userTeam, setUserTeam] = useState(() => {
    try {
      return localStorage.getItem(SQUAD_STORAGE_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  // Track User's Uploaded Photo IDs for Edit/Delete Permissions
  const [myPhotoIds, setMyPhotoIds] = useState(() => {
    try {
      const saved = localStorage.getItem(MY_PHOTOS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Track Photos User Has Already Liked (Single Like Rule)
  const [likedPhotoIds, setLikedPhotoIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_PHOTOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LIKED_PHOTOS_KEY, JSON.stringify(likedPhotoIds));
    } catch (e) { }
  }, [likedPhotoIds]);

  // Hidden/Removed photos filter (Host Moderation)
  const [hiddenPhotoIds, setHiddenPhotoIds] = useState(() => {
    try {
      const saved = localStorage.getItem(HIDDEN_PHOTOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Photo Collection - loads all saved or celebration photos
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(PHOTOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validOnly = parsed.filter((p) => p && p.id && p.src);
          if (validOnly.length > 0) return validOnly;
        }
      }
    } catch (e) { }
    return INITIAL_GALLERY_PHOTOS;
  });

  // Daily Cheers Tracking (max 5 per guest per day to prevent spam)
  const [dailyCheersUsed, setDailyCheersUsed] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(DAILY_CHEERS_KEY) || '{}');
      const today = new Date().toISOString().slice(0, 10);
      return data.date === today ? (data.count || 0) : 0;
    } catch (e) {
      return 0;
    }
  });

  // Default ceremony tag: 'Reception' (User can freely tap and select any ceremony anytime)
  const getAutoCeremonyTag = () => 'Reception';

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // ── Real-Time Cloud Sync with Neon Database ──
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/photos');
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.success) return;

      const serverPhotos = (Array.isArray(data.photos) ? data.photos : []).filter(
        (p) => p && p.id && p.src
      );

      // Check if user has uploaded photos locally on their phone that aren't on server yet
      let localSaved = [];
      try {
        const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (raw) localSaved = JSON.parse(raw);
      } catch (e) {}

      if (Array.isArray(localSaved) && localSaved.length > 0) {
        const cleanLocal = localSaved.filter((p) => p && p.id && p.src);
        const serverIds = new Set(serverPhotos.map((p) => p.id));
        const unsynced = cleanLocal.filter((p) => !serverIds.has(p.id) && p.src);

        if (unsynced.length > 0) {
          console.log(`Auto-syncing ${unsynced.length} phone photos to royal cloud gallery...`);
          setIsCloudSyncing(true);
          try {
            await fetch('/api/photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'batch_sync', photos: unsynced }),
            });
            setReactionToast('☁️ Synced your uploaded photos so everyone on desktop & mobile can view them!');
            setTimeout(() => setReactionToast(''), 4000);

            // Fetch refreshed list after batch sync
            const freshRes = await fetch('/api/photos');
            if (freshRes.ok) {
              const freshData = await freshRes.json();
              if (freshData.photos) {
                const freshClean = freshData.photos.filter((p) => p && p.id && p.src);
                setPhotos(freshClean);
                try {
                  localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(freshClean));
                } catch (e) {}
                return;
              }
            }
          } catch (syncErr) {
            console.warn('Batch sync error:', syncErr);
          } finally {
            setIsCloudSyncing(false);
          }
        }
      }

      // Update state with server photos
      if (serverPhotos.length > 0) {
        setPhotos(serverPhotos);
        try {
          localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(serverPhotos));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Could not sync gallery with server:', err);
    }
  }, []);

  useEffect(() => {
    syncWithServer();

    // Auto-refresh every 12 seconds so guest uploads appear live on all screens
    const pollInterval = setInterval(syncWithServer, 12000);

    // Refresh immediately when window regains focus
    const onFocus = () => syncWithServer();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', onFocus);
    };
  }, [syncWithServer]);

  // Harmonious Golden Victory Chime Synthesis with Web Audio API + Haptic Vibration
  const playTeamChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.18, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.6);
      });
    } catch (e) { }
    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 140]);
    }
  };

  // Active filter tab ('All', 'My Snaps', 'Most Loved', 'Reception', 'Muhurtham')
  const [selectedTag, setSelectedTag] = useState('All');
  // Carousel active slide index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Host Mode & Moderation
  const [isHostMode, setIsHostMode] = useState(false);
  const [showHostPinModal, setShowHostPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);

  // Edit Photo Modal State
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editTag, setEditTag] = useState('Muhurtham');

  // Animated Reactions & Popups
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [reactionToast, setReactionToast] = useState('');

  // Upload Form State
  const [uploadName, setUploadName] = useState(guestProfile.name || '');
  const [uploadRelation, setUploadRelation] = useState(guestProfile.relation || '');
  const [uploadEmail, setUploadEmail] = useState('');
  const [uploadTag, setUploadTag] = useState(() => getAutoCeremonyTag());
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImageSrc, setUploadImageSrc] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Email Notification Subscription State
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeName, setSubscribeName] = useState(guestProfile.name || '');
  const [subscribeStatus, setSubscribeStatus] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    if (guestProfile.name) {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestProfile));
      } catch (e) { }
    }
  }, [guestProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
    } catch (e) { }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDDEN_PHOTOS_KEY, JSON.stringify(hiddenPhotoIds));
    } catch (e) { }
  }, [hiddenPhotoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(MY_PHOTOS_STORAGE_KEY, JSON.stringify(myPhotoIds));
    } catch (e) { }
  }, [myPhotoIds]);

  // Unhidden photos across entire gallery
  const unhiddenPhotos = useMemo(() => {
    return photos.filter((p) => !hiddenPhotoIds.includes(p.id));
  }, [photos, hiddenPhotoIds]);

  // Check if a photo belongs to the current user
  const isMyPhoto = (photo) => {
    if (!photo) return false;
    if (myPhotoIds.includes(photo.id)) return true;
    if (guestProfile.name && photo.uploader?.name?.toLowerCase() === guestProfile.name.toLowerCase()) {
      return true;
    }
    return false;
  };

  // Gamification Scores Calculation (Bride Squad vs Groom Squad)
  const bridePhotos = useMemo(
    () => unhiddenPhotos.filter((p) => isBrideTeam(p.team)),
    [unhiddenPhotos]
  );
  const groomPhotos = useMemo(
    () => unhiddenPhotos.filter((p) => isGroomTeam(p.team)),
    [unhiddenPhotos]
  );

  const brideSnapsCount = bridePhotos.length;
  const brideLikesCount = useMemo(
    () => bridePhotos.reduce((sum, p) => sum + (p.likes || 0), 0),
    [bridePhotos]
  );
  const brideScore = brideSnapsCount * 10 + brideLikesCount * 2;

  const groomSnapsCount = groomPhotos.length;
  const groomLikesCount = useMemo(
    () => groomPhotos.reduce((sum, p) => sum + (p.likes || 0), 0),
    [groomPhotos]
  );
  const groomScore = groomSnapsCount * 10 + groomLikesCount * 2;

  const totalGameScore = brideScore + groomScore;
  const bridePercent = totalGameScore === 0 ? 50 : Math.round((brideScore / totalGameScore) * 100);
  const groomPercent = totalGameScore === 0 ? 50 : 100 - bridePercent;

  // Filtered photos based on selected tab
  const visiblePhotos = useMemo(() => {
    if (selectedTag === 'All') return unhiddenPhotos;
    if (selectedTag === 'My Snaps') {
      return unhiddenPhotos.filter((p) => isMyPhoto(p));
    }
    if (selectedTag === 'Most Loved') {
      return [...unhiddenPhotos].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (selectedTag === 'Reception') {
      return unhiddenPhotos.filter((p) => p.eventTag?.toLowerCase().includes('reception'));
    }
    if (selectedTag === 'Dhara Muhurtham' || selectedTag === 'Muhurtham') {
      return unhiddenPhotos.filter(
        (p) => p.eventTag?.toLowerCase().includes('muhurtham') || p.eventTag?.toLowerCase().includes('dhara')
      );
    }
    if (selectedTag === 'Celebrations') {
      return unhiddenPhotos.filter(
        (p) => p.eventTag?.toLowerCase().includes('celebration') || p.eventTag?.toLowerCase().includes('memory')
      );
    }
    return unhiddenPhotos.filter(
      (p) => p.eventTag?.toLowerCase() === selectedTag.toLowerCase()
    );
  }, [unhiddenPhotos, selectedTag, myPhotoIds, guestProfile.name]);

  // Reset carousel index if filter changes and index is out of bounds
  useEffect(() => {
    if (carouselIndex >= visiblePhotos.length) {
      setCarouselIndex(0);
    }
  }, [visiblePhotos.length, carouselIndex]);

  // Radiant Golden Particle Animation + Royal Proclamation Toast
  const triggerHeartReaction = (originX, originY, customToast = '') => {
    const defaultX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
    const defaultY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    const startX = originX !== undefined && originX > 0 ? originX : defaultX;
    const startY = originY !== undefined && originY > 0 ? originY : defaultY;
    const symbols = ['✦', '★', '✧', '⋆', '✦'];

    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      originX: startX,
      originY: startY,
      symbol: symbols[i % symbols.length],
      x: (Math.random() - 0.5) * 140,
      y: -50 - Math.random() * 110,
      scale: 0.9 + Math.random() * 0.7,
      rotate: (Math.random() - 0.5) * 60,
    }));

    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setReactionToast(customToast || '✦ Toast bestowed to this cherished memory! ✦');

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(40); } catch (e) { }
    }

    setTimeout(() => {
      setReactionToast('');
    }, 2800);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.slice(newHearts.length));
    }, 1200);
  };

  // Like reaction handler (+2 points for that team, strictly 1 like per photo)
  const handleLike = (photoId, e) => {
    const originX = e?.clientX;
    const originY = e?.clientY;

    if (likedPhotoIds.includes(photoId)) {
      setReactionToast("You've already cheered for this memory! ❤️");
      setTimeout(() => setReactionToast(''), 2500);
      return;
    }

    setLikedPhotoIds((prev) => [...prev, photoId]);

    let targetTeam = '';
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === photoId) {
          targetTeam = photo.team || 'bride';
          return { ...photo, likes: (photo.likes || 0) + 1 };
        }
        return photo;
      })
    );

    if (selectedLightboxPhoto && selectedLightboxPhoto.id === photoId) {
      setSelectedLightboxPhoto((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));
    }

    const teamLabel = isBrideTeam(targetTeam) ? brideTeamName : groomTeamName;
    triggerHeartReaction(originX, originY, `+2 Cheer Points for ${teamLabel}!`);

    // Sync like to cloud database
    try {
      fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id: photoId }),
      }).catch(() => {});
    } catch (e) {}
  };

  // Direct Squad Cheer handler with daily anti-spam limit
  const handleCheerSquad = (team, e) => {
    const originX = e?.clientX;
    const originY = e?.clientY;

    if (dailyCheersUsed >= MAX_DAILY_CHEERS) {
      triggerHeartReaction(
        originX,
        originY,
        `Daily cheer limit of ${MAX_DAILY_CHEERS} reached! Post a candid snap to score +10 points!`
      );
      return;
    }

    const nextCount = dailyCheersUsed + 1;
    setDailyCheersUsed(nextCount);
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(DAILY_CHEERS_KEY, JSON.stringify({ date: today, count: nextCount }));
    } catch (err) { }

    playTeamChime();

    // Pick a photo from that team to receive the cheer point
    const teamPhotos = unhiddenPhotos.filter((p) => (isBrideTeam(team) ? isBrideTeam(p.team) : isGroomTeam(p.team)));
    if (teamPhotos.length > 0) {
      const randomPhoto = teamPhotos[Math.floor(Math.random() * teamPhotos.length)];
      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id === randomPhoto.id) {
            return { ...photo, likes: (photo.likes || 0) + 1 };
          }
          return photo;
        })
      );
    }

    const teamLabel = isBrideTeam(team) ? brideTeamName : groomTeamName;
    triggerHeartReaction(
      originX,
      originY,
      `+2 Cheer Points for ${teamLabel}! (${nextCount}/${MAX_DAILY_CHEERS} cheers used today)`
    );

    // Sync cheer to cloud database
    try {
      fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cheer', team: isBrideTeam(team) ? 'bride' : 'groom' }),
      }).catch(() => {});
    } catch (e) {}
  };

  // Permanent Squad Pledge Handler
  const handlePledgeSquad = (chosenTeam) => {
    const canonicalTeam = isBrideTeam(chosenTeam) ? 'bride' : 'groom';
    try {
      localStorage.setItem(SQUAD_STORAGE_KEY, canonicalTeam);
    } catch (e) { }
    setUserTeam(canonicalTeam);
    setShowPledgeModal(false);

    const teamLabel = isBrideTeam(canonicalTeam) ? brideTeamName : groomTeamName;
    triggerHeartReaction(undefined, undefined, `You proudly joined ${teamLabel}! Your allegiance is sealed! ✨`);
  };

  // Host Mode PIN verification
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin.trim() === HOST_PIN || enteredPin.trim() === '1234') {
      setIsHostMode(true);
      setShowHostPinModal(false);
      setEnteredPin('');
      setPinError('');
      triggerHeartReaction(undefined, undefined, 'Host Mode Activated: You can remove any photo');
    } else {
      setPinError('Incorrect PIN. Please re-enter the 4-digit Wedding PIN.');
    }
  };

  // Host Delete / Hide Photo
  const handleHostDeletePhoto = (photoId) => {
    if (window.confirm('Host Action: Are you sure you want to remove this photo from the celebration album?')) {
      setHiddenPhotoIds((prev) => [...prev, photoId]);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      try {
        const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (raw) {
          const list = JSON.parse(raw);
          localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(list.filter((p) => p.id !== photoId)));
        }
      } catch (e) {}
      if (selectedLightboxPhoto && selectedLightboxPhoto.id === photoId) {
        setSelectedLightboxPhoto(null);
      }
      setReactionToast('🗑️ Photo removed by host moderation');
      setTimeout(() => setReactionToast(''), 3000);

      try {
        fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'moderate', pin: '1611', subAction: 'delete', id: photoId }),
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Host Purge / Reset All Photos for Production
  const handleHostClearAll = () => {
    if (window.confirm('Host Action: Are you sure you want to purge all candid photos and reset the gallery wall?')) {
      setPhotos([]);
      try {
        localStorage.removeItem(PHOTOS_STORAGE_KEY);
      } catch (e) { }
      if (selectedLightboxPhoto) setSelectedLightboxPhoto(null);
      triggerHeartReaction(undefined, undefined, '✨ Gallery Wall Purged Clean for Guests! ✨');
    }
  };

  // User Delete My Photo
  const handleDeleteMyPhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete your candid photo from the wedding album?')) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setMyPhotoIds((prev) => prev.filter((id) => id !== photoId));
      try {
        const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (raw) {
          const list = JSON.parse(raw);
          localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(list.filter((p) => p.id !== photoId)));
        }
      } catch (e) {}
      if (selectedLightboxPhoto && selectedLightboxPhoto.id === photoId) {
        setSelectedLightboxPhoto(null);
      }
      setReactionToast('🗑️ Your photo has been removed from the wedding album.');
      setTimeout(() => setReactionToast(''), 3000);

      try {
        fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete_photo', id: photoId }),
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Start Editing My Photo
  const handleStartEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption || '');
    setEditTag(photo.eventTag || 'Muhurtham');
  };

  // Save Edited Photo
  const handleSaveEditPhoto = (e) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const trimmedCaption = editCaption.trim();
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === editingPhoto.id) {
          return {
            ...p,
            caption: trimmedCaption,
            eventTag: editTag,
          };
        }
        return p;
      })
    );

    if (selectedLightboxPhoto && selectedLightboxPhoto.id === editingPhoto.id) {
      setSelectedLightboxPhoto((prev) => ({
        ...prev,
        caption: trimmedCaption,
        eventTag: editTag,
      }));
    }

    setEditingPhoto(null);
    setReactionToast('Your candid photo was updated successfully!');
    setTimeout(() => setReactionToast(''), 3000);
  };

  // Validate Guest Input
  const validateGuestContent = (name, relation, caption) => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return 'Please enter your name so the couple knows who shared this candid memory.';
    }
    const inappropriatePatterns = [
      /\b(fuck|shit|bitch|bastard|asshole|dick|pussy|porn|spam|scam)\b/i,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
    ];
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(name) || pattern.test(relation) || pattern.test(caption)) {
        return 'Please keep wishes and captions respectful for this sacred celebration.';
      }
    }
    return null;
  };

  // Image File Selection with Browser Resizing & Auto Ceremony Tag Detection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setUploadError('');

    // Default to Reception if no ceremony chosen yet
    if (!uploadTag) {
      setUploadTag('Reception');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setUploadImageSrc(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit new photo to gallery hub
  const handleUploadSubmit = (e) => {
    e.preventDefault();

    // Check if user has chosen their squad side
    if (!userTeam) {
      setShowPledgeModal(true);
      return;
    }

    const validationMsg = validateGuestContent(uploadName, uploadRelation, uploadCaption);
    if (validationMsg) {
      setUploadError(validationMsg);
      return;
    }

    if (!uploadImageSrc) {
      setUploadError('Please select or capture a photo from the celebration.');
      return;
    }

    setIsPosting(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const newId = `guest-${Date.now()}`;

    const newPhoto = {
      id: newId,
      src: uploadImageSrc,
      eventTag: uploadTag || 'Reception',
      team: userTeam, // Attributed to the user's permanent team!
      uploader: {
        name: uploadName.trim(),
        relation: uploadRelation.trim() || (isBrideTeam(userTeam) ? `${brideTeamName}` : `${groomTeamName}`),
        email: uploadEmail.trim(),
        timestamp: `${dateString}, ${timeString}`,
      },
      caption: uploadCaption.trim(),
      likes: 1,
    };

    // Save profile for future uploads
    setGuestProfile({
      name: uploadName.trim(),
      relation: uploadRelation.trim(),
    });

    // Record this ID as owned by current user
    setMyPhotoIds((prev) => [...prev, newId]);

    // Optimistically update local state & localStorage
    setPhotos((prev) => [newPhoto, ...prev]);
    try {
      const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify([newPhoto, ...existing]));
    } catch (e) {}

    // Cloud upload to Neon database so all desktop and phone users see it instantly!
    fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'upload',
        id: newPhoto.id,
        src: newPhoto.src,
        eventTag: newPhoto.eventTag,
        team: newPhoto.team,
        caption: newPhoto.caption,
        uploader: newPhoto.uploader,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          syncWithServer();
        }
      })
      .catch((err) => {
        console.warn('Background sync will retry on next poll:', err);
      });

    setTimeout(() => {
      setIsPosting(false);
      setIsUploadModalOpen(false);
      setUploadCaption('');
      setUploadImageSrc(null);
      setUploadEmail('');
      setCarouselIndex(0);
      playTeamChime();

      const teamName = isBrideTeam(userTeam) ? brideTeamName : groomTeamName;
      setReactionToast(`✨ +10 Pts! Your candid memory is live for everyone to see!`);
      setTimeout(() => setReactionToast(''), 3500);
    }, 450);
  };

  // Open Upload Modal (with pre-check for Squad Pledge & auto ceremony selection)
  const handleOpenUpload = () => {
    if (!userTeam) {
      setShowPledgeModal(true);
    } else {
      setUploadName(guestProfile.name || '');
      setUploadRelation(guestProfile.relation || '');
      setUploadTag(getAutoCeremonyTag());
      setUploadCaption('');
      setUploadImageSrc(null);
      setUploadError('');
      setUploadEmail('');
      setIsUploadModalOpen(true);
    }
  };

  // Handle Email Subscription for New Photo Alerts
  const handleSubscribeEmail = async (e) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes('@')) {
      setSubscribeStatus('error');
      setSubscribeMsg('Please enter a valid email address.');
      return;
    }
    setSubscribeStatus('submitting');
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'subscribe_email',
          email: subscribeEmail.trim(),
          name: subscribeName.trim() || guestProfile.name || 'Wedding Guest',
          team: userTeam || 'bride',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribeStatus('success');
        setSubscribeMsg('✨ You will receive instant notifications when new celebration photos are posted!');
        triggerHeartReaction(undefined, undefined, '🔔 Subscribed for Photo Notifications!');
        setTimeout(() => {
          setIsSubscribeModalOpen(false);
          setSubscribeStatus('');
          setSubscribeMsg('');
        }, 2200);
      } else {
        setSubscribeStatus('error');
        setSubscribeMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMsg('Network error. Please try again.');
    }
  };

  return (
    <section
      id="wedding-gallery-hub"
      className="relative w-full pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 bg-[#68183C] text-[#FFFDF8] overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top center, rgba(166, 124, 69, 0.28) 0%, rgba(85, 18, 48, 0.98) 70%)',
      }}
    >
      {/* ── Full-Bleed Edge-to-Edge Royal Gold Zari Border at Section Top ── */}
      <div
        className="fv-zari absolute top-0 left-0 right-0 w-full z-20 pointer-events-none"
        aria-hidden="true"
        style={{
          boxShadow: '0 8px 24px rgba(42, 12, 24, 0.65), 0 -4px 16px rgba(74, 44, 39, 0.3)',
        }}
      />

      {/* Background silk & zari pattern ornamentation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'url("/templates/forever/desi/silk-berry.webp")',
          backgroundSize: '400px',
        }}
      />

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Sacred Kalash / Camera Motif with Host Mode Toggle */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#F4D9A6] to-[#D4AF37]" />
          <div className="p-3 rounded-full bg-[#FFFBF3]/15 border-2 border-[#D4AF37]/60 shadow-lg">
            <Camera className="w-5 h-5 text-[#F4D9A6]" />
          </div>
          <div className="h-[1.5px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#F4D9A6] to-[#D4AF37]" />

          {/* Discreet Host Mode Lock Button */}
          <button
            type="button"
            onClick={() => {
              if (isHostMode) {
                setIsHostMode(false);
              } else {
                setShowHostPinModal(true);
              }
            }}
            className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F4D9A6]/70 hover:text-[#F4D9A6] transition cursor-pointer"
            title={isHostMode ? 'Host Mode Active (Tap to Lock)' : 'Couple & Family Host Controls'}
          >
            {isHostMode ? <Unlock className="w-3.5 h-3.5 text-emerald-300" /> : <Lock className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Section Kicker */}
        <p className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.25em] text-[#F4D9A6] drop-shadow-sm">
          Moments & Memories
        </p>

        {/* Section Title with Grandeur */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#FFFDF8] mt-2 mb-3 tracking-wide drop-shadow-lg"
          style={{
            fontFamily: 'var(--fv-names, "Playfair Display"), Georgia, serif',
            textShadow: '0 3px 14px rgba(0, 0, 0, 0.75)',
          }}
        >
          Wedding Photo Hub
        </h2>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#FFFDF8]/95 font-serif leading-relaxed px-4 drop-shadow-sm">
          Every smile, dance, and sacred ritual captured through your lens. Upload candid snaps to
          bring glory to your squad and make memories for {bName} & {gName}!
        </p>

        {/* Host Status Notice & Production Purge if Active */}
        {isHostMode && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-xs text-emerald-200 font-serif">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Host Moderation Active (Host Controls)</span>
            </div>
            <button
              type="button"
              onClick={handleHostClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500 text-xs text-red-200 font-serif cursor-pointer transition shadow-sm"
              title="Reset all guest uploads and purge wall"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-300" />
              <span>Purge Wall for Production</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            GAMIFICATION: ROYAL SQUAD CHALLENGE ARENA
            Permanently visible to all guests: Live scoreboard, tug-of-war bar,
            interactive cheer buttons (+2 pts), and squad cards.
        ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#1B0610]/95 border-2 border-[#D4AF37]/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
          {/* Header & Leader Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-[#F4D9A6] animate-bounce" />
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#FFFDF8] tracking-wider uppercase">
                Royal Squad Challenge
              </h3>
            </div>

            {/* Dynamic Leader Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-xs font-serif font-bold text-[#F4D9A6] shadow-md">
              {brideScore > groomScore ? (
                <>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>{brideTeamName} Leads (+{brideScore - groomScore} pts)</span>
                </>
              ) : groomScore > brideScore ? (
                <>
                  <Crown className="w-4 h-4 text-blue-400" />
                  <span>{groomTeamName} Leads (+{groomScore - brideScore} pts)</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Tied Battle! Next candid snap takes the lead!</span>
                </>
              )}
            </div>
          </div>

          {/* Guest Squad Allegiance Badge or Call-to-Action */}
          {userTeam ? (
            <div className={`mt-4 mb-2 p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-serif ${isBrideTeam(userTeam)
              ? 'bg-gradient-to-r from-[#4A0E2E]/90 to-[#250516]/90 border-[#FF4081]/80 text-[#FFD1DC]'
              : 'bg-gradient-to-r from-[#0E2A4A]/90 to-[#051525]/90 border-[#2196F3]/80 text-[#D0E2FF]'
              }`}>
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Your Squad: <strong className="text-white uppercase tracking-wider">{isBrideTeam(userTeam) ? brideTeamName : groomTeamName}</strong> • Pledged & Locked In
                </span>
              </div>
              <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                +10 pts per candid snap
              </span>
            </div>
          ) : (
            <div className="mt-4 mb-2 p-3 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#240816]/80 via-[#18040E]/80 to-[#240816]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-serif text-[#F4D9A6]">
              <div className="flex items-center gap-2 font-medium">
                <Swords className="w-4 h-4 text-[#E8C877] shrink-0" />
                <span>
                  Choose your side below to champion the Bride or Groom! Snaps add <strong className="text-white">+10 pts</strong> & cheers add <strong className="text-white">+2 pts</strong>.
                </span>
              </div>
            </div>
          )}

          {/* Tug-of-Celebration Split Progress Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs sm:text-sm font-serif font-bold px-1 mb-2">
              <span className="text-[#FF9EAA] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{brideTeamName} ({bridePercent}%)</span>
              </span>
              <span className="text-[#A5C9FF] flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-blue-400" />
                <span>{groomTeamName} ({groomPercent}%)</span>
              </span>
            </div>

            <div className="relative h-5 rounded-full overflow-hidden bg-black/70 p-0.5 border border-[#D4AF37]/50 flex shadow-inner">
              <motion.div
                initial={{ width: '50%' }}
                animate={{ width: `${bridePercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-l-full bg-gradient-to-r from-[#D81B60] via-[#FF4081] to-[#E0218A] shadow-[0_0_12px_rgba(255,64,129,0.6)]"
              />
              <motion.div
                initial={{ width: '50%' }}
                animate={{ width: `${groomPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-r-full bg-gradient-to-r from-[#1976D2] via-[#2196F3] to-[#0D47A1] shadow-[0_0_12px_rgba(33,150,243,0.6)]"
              />
            </div>

            <p className="text-[11px] sm:text-xs text-[#F4D9A6]/80 font-serif mt-2 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5 text-[#D4AF37]" /> Candid snap = +10 pts</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> Cheer = +2 pts (Max 5 daily)</span>
            </p>
          </div>

          {/* Side-by-Side Spacious Squad Arena Stations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {/* Bride Squad Card */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all text-center relative flex flex-col justify-between ${isBrideTeam(userTeam)
                ? 'bg-gradient-to-b from-[#4A0E2E] to-[#250516] border-[#FF4081] shadow-[0_0_24px_rgba(255,64,129,0.35)]'
                : 'bg-[#260717]/80 border-[#D4AF37]/30 hover:border-[#FF4081]/60'
                }`}
            >
              <div>
                {isBrideTeam(userTeam) && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF4081] text-white text-[10px] font-bold font-serif shadow-md border border-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> YOUR SQUAD
                  </span>
                )}

                <div className="flex items-center justify-center gap-2 text-base font-serif font-bold text-[#FFB6C1]">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>{brideTeamName}</span>
                </div>
                <p className="text-xs text-[#FF80AB] font-serif font-medium mt-0.5">
                  Bride's Squad • Ladkiwale
                </p>

                <p className="text-4xl font-serif font-extrabold text-[#FFFDF8] mt-2 tracking-tight">
                  {brideScore} <span className="text-xs font-mono text-[#F4D9A6]">PTS</span>
                </p>
                <p className="text-xs text-[#FFFDF8]/80 font-serif mt-1">
                  {brideSnapsCount} Candids ({(brideSnapsCount * 10)} pts) • {brideLikesCount} Cheers ({brideLikesCount} pts)
                </p>
              </div>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={(e) => handleCheerSquad('bride', e)}
                  disabled={dailyCheersUsed >= MAX_DAILY_CHEERS}
                  className="w-full min-h-[44px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-bold bg-[#FF4081]/25 hover:bg-[#FF4081]/45 text-[#FFB6C1] border border-[#FF4081]/60 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500 shrink-0" />
                  <span>Cheer Squad (+2 pts • {Math.max(0, MAX_DAILY_CHEERS - dailyCheersUsed)} left)</span>
                </button>

                {!userTeam && (
                  <button
                    type="button"
                    onClick={() => handlePledgeSquad('bride')}
                    className="w-full min-h-[44px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-bold bg-gradient-to-r from-[#FF4081] to-[#D81B60] text-white hover:brightness-110 shadow transition flex items-center justify-center gap-1.5 cursor-pointer border border-pink-300 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-white shrink-0" />
                    <span>Pledge for {brideTeamName}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Groom Squad Card */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all text-center relative flex flex-col justify-between ${isGroomTeam(userTeam)
                ? 'bg-gradient-to-b from-[#0E2A4A] to-[#051525] border-[#2196F3] shadow-[0_0_24px_rgba(33,150,243,0.35)]'
                : 'bg-[#0B1A2A]/80 border-[#D4AF37]/30 hover:border-[#2196F3]/60'
                }`}
            >
              <div>
                {isGroomTeam(userTeam) && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2196F3] text-white text-[10px] font-bold font-serif shadow-md border border-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> YOUR SQUAD
                  </span>
                )}

                <div className="flex items-center justify-center gap-2 text-base font-serif font-bold text-[#A5C9FF]">
                  <Crown className="w-4 h-4 text-blue-400" />
                  <span>{groomTeamName}</span>
                </div>
                <p className="text-xs text-[#82B1FF] font-serif font-medium mt-0.5">
                  Groom's Squad • Ladkewale
                </p>

                <p className="text-4xl font-serif font-extrabold text-[#FFFDF8] mt-2 tracking-tight">
                  {groomScore} <span className="text-xs font-mono text-[#F4D9A6]">PTS</span>
                </p>
                <p className="text-xs text-[#FFFDF8]/80 font-serif mt-1">
                  {groomSnapsCount} Candids ({(groomSnapsCount * 10)} pts) • {groomLikesCount} Cheers ({groomLikesCount} pts)
                </p>
              </div>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={(e) => handleCheerSquad('groom', e)}
                  disabled={dailyCheersUsed >= MAX_DAILY_CHEERS}
                  className="w-full min-h-[44px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-bold bg-[#2196F3]/25 hover:bg-[#2196F3]/45 text-[#A5C9FF] border border-[#2196F3]/60 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-4 h-4 fill-blue-500 text-blue-500 shrink-0" />
                  <span>Cheer Squad (+2 pts • {Math.max(0, MAX_DAILY_CHEERS - dailyCheersUsed)} left)</span>
                </button>

                {!userTeam && (
                  <button
                    type="button"
                    onClick={() => handlePledgeSquad('groom')}
                    className="w-full min-h-[44px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-serif font-bold bg-gradient-to-r from-[#1E88E5] to-[#0D47A1] text-white hover:brightness-110 shadow transition flex items-center justify-center gap-1.5 cursor-pointer border border-blue-300 active:scale-95"
                  >
                    <Crown className="w-4 h-4 text-white shrink-0" />
                    <span>Pledge for {groomTeamName}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guest Profile Banner & Primary CTA */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {guestProfile.name ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E0812]/85 border-2 border-[#D4AF37]/50 text-xs font-serif shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#FFFDF8]">
                Posting as <strong className="text-[#F4D9A6] font-bold">{guestProfile.name}</strong>
                {guestProfile.relation && ` (${guestProfile.relation})`}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                <Lock className="w-2.5 h-2.5" />
                <span>Verified</span>
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E0812]/60 border border-[#D4AF37]/40 text-xs text-[#F4D9A6] font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#F4D9A6]" />
              <span>Share candid smiles and joyous memories with the couple</span>
            </div>
          )}

          {/* Primary CTA: Snap & Share Candid Photo */}
          <button
            type="button"
            onClick={handleOpenUpload}
            className="fv-btn fv-btn--maps px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold tracking-wider cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #FFFDF8 0%, #F5DE98 50%, #E6C364 100%)',
              color: '#1E0812',
              boxShadow: '0 6px 24px rgba(212, 175, 55, 0.5), 0 0 0 2px #D4AF37',
            }}
          >
            <Camera className="w-4 h-4 text-[#8B5A2B]" />
            <span>Snap & Share Candid (+10 pts)</span>
          </button>

          {/* Email Notification Trigger Pill */}
          <button
            type="button"
            onClick={() => setIsSubscribeModalOpen(true)}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-serif font-bold border border-[#D4AF37]/60 text-[#F4D9A6] bg-[#1E0812]/80 hover:bg-[#1E0812] hover:border-[#D4AF37] transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
          >
            <Bell className="w-4 h-4 text-[#F4D9A6] animate-bounce" />
            <span>Photo Alerts</span>
          </button>
        </div>

        {/* Live Memory Counter Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E0812]/80 border border-[#D4AF37]/50 text-xs font-serif text-[#F4D9A6] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F4D9A6] animate-pulse" />
            <span>
              <strong className="text-[#FFFDF8] font-bold">{unhiddenPhotos.length}</strong> Moments Preserved for {brideShort} & {groomShort}
            </span>
          </div>
        </div>

        {/* ── Event & Quick Filter Tabs (Includes 'My Snaps'!) ── */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-1.5 sm:gap-2.5 px-2 max-w-xl mx-auto">
          {['All', 'My Snaps', 'Most Loved', 'Reception', 'Dhara Muhurtham', 'Celebrations'].map((tag) => {
            const count =
              tag === 'All'
                ? unhiddenPhotos.length
                : tag === 'My Snaps'
                  ? unhiddenPhotos.filter((p) => isMyPhoto(p)).length
                  : tag === 'Most Loved'
                    ? unhiddenPhotos.filter((p) => (p.likes || 0) > 0).length
                    : tag === 'Reception'
                      ? unhiddenPhotos.filter((p) => p.eventTag?.toLowerCase().includes('reception')).length
                      : tag === 'Dhara Muhurtham'
                        ? unhiddenPhotos.filter((p) => p.eventTag?.toLowerCase().includes('muhurtham') || p.eventTag?.toLowerCase().includes('dhara')).length
                        : tag === 'Celebrations'
                          ? unhiddenPhotos.filter((p) => p.eventTag?.toLowerCase().includes('celebration') || p.eventTag?.toLowerCase().includes('memory')).length
                          : unhiddenPhotos.filter((p) => p.eventTag?.toLowerCase() === tag.toLowerCase()).length;
            const isSelected = selectedTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSelectedTag(tag);
                  setCarouselIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-serif transition-all cursor-pointer ${isSelected
                  ? 'bg-[#F4D9A6] text-[#1E0812] font-bold shadow-lg scale-102 border-2 border-[#D4AF37]'
                  : 'bg-[#1E0812]/75 text-[#FFFDF8] hover:bg-[#1E0812] border border-[#D4AF37]/40 hover:border-[#D4AF37]'
                  }`}
              >
                <span className="flex items-center gap-1">
                  {tag === 'All' && <Sparkles className="w-3 h-3 text-[#D4AF37]" />}
                  {tag === 'My Snaps' && <Camera className="w-3 h-3 text-emerald-400" />}
                  {tag === 'Most Loved' && <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />}
                  {tag === 'Reception' && <Calendar className="w-3 h-3 text-amber-300" />}
                  {tag === 'Dhara Muhurtham' && <Crown className="w-3 h-3 text-[#F4D9A6]" />}
                  {tag === 'Celebrations' && <Sparkles className="w-3 h-3 text-purple-300" />}
                  <span>{tag === 'All' ? 'All Moments' : tag === 'My Snaps' ? 'My Snaps' : tag === 'Most Loved' ? 'Most Loved' : tag}</span>
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isSelected ? 'bg-[#1E0812] text-[#F4D9A6]' : 'bg-white/20 text-white'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 3D Concave Interactive Drum Gallery ── */}
        <div className="mt-4">
          {visiblePhotos.length > 0 ? (
            <ConcaveCarousel
              items={visiblePhotos}
              activeIndex={carouselIndex}
              onChangeActive={setCarouselIndex}
              onPhotoClick={setSelectedLightboxPhoto}
              onLike={handleLike}
              isHostMode={isHostMode}
              onDeletePhoto={handleDeleteMyPhoto}
              onEditPhoto={handleStartEditPhoto}
              myPhotoIds={myPhotoIds}
              likedPhotoIds={likedPhotoIds}
              guestName={guestProfile.name}
              autoDrift={true}
              driftIntervalMs={4800}
            />
          ) : (
            <div className="py-16 px-6 max-w-lg mx-auto text-center bg-[#1E0812]/80 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl my-8 backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F4D9A6] to-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-lg text-[#1E0812]">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-xl text-[#FFFDF8] tracking-wide">
                {selectedTag === 'My Snaps'
                  ? "You Haven't Posted Snaps Yet!"
                  : selectedTag === 'All'
                  ? 'The Royal Wall Awaits Your Memories!'
                  : `No Snaps in ${selectedTag} Yet`}
              </h4>
              <p className="text-xs sm:text-sm text-[#F4D9A6]/90 font-serif mt-2 leading-relaxed">
                {selectedTag === 'My Snaps'
                  ? `Be the first to capture candid memories! Every photo you upload earns +10 points for ${isBrideTeam(userTeam) ? brideTeamName : isGroomTeam(userTeam) ? groomTeamName : 'your squad'}!`
                  : `Be the first to capture and share candid memories from ${bName} & ${gName}'s grand celebration! Every snap earns +10 points for your squad.`}
              </p>
              <button
                type="button"
                onClick={handleOpenUpload}
                className="mt-6 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4D9A6] text-[#1E0812] text-xs font-serif font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <Camera className="w-4 h-4 text-[#8B5A2B]" />
                <span>Snap & Share Candid (+10 pts)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PORTALLED OVERLAYS (TOASTS, PARTICLES & MODALS)
          Mounted directly to document.body to avoid transform/overflow clipping
      ═══════════════════════════════════════════════════════════════ */}
      {typeof document !== 'undefined' && document.body && createPortal(
        <>
          {/* Floating Animated Golden Starburst Particles */}
          <div className="fixed inset-0 pointer-events-none z-[10005]">
            {floatingHearts.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 1, x: star.originX, y: star.originY, scale: 0.5 }}
                animate={{
                  opacity: 0,
                  x: star.originX + star.x,
                  y: star.originY + star.y,
                  scale: star.scale * 1.3,
                  rotate: star.rotate,
                }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="absolute text-xl font-bold select-none text-[#FFDF73] drop-shadow-[0_0_8px_rgba(255,223,115,0.9)]"
              >
                {star.symbol || '✦'}
              </motion.div>
            ))}
          </div>

          {/* Royal Heraldic Proclamation Banner Toast */}
          <AnimatePresence>
            {reactionToast && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[10006] max-w-[92vw] sm:max-w-md w-max px-5 py-3 rounded-2xl bg-gradient-to-r from-[#220715] via-[#480E29] to-[#220715] text-[#FFFDF8] shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(212,175,55,0.45)] border-2 border-[#D4AF37] flex items-center gap-3 backdrop-blur-md pointer-events-auto"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFDF73] to-[#B8860B] flex items-center justify-center text-[#200512] shadow-md shrink-0">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#FFDF73]">
                    Royal Squad Proclamation
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-medium text-[#FFFDF8]">
                    {reactionToast}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════════
              PERMANENT SQUAD PLEDGE MODAL (CANNOT BE CHANGED ONCE CHOSEN)
          ═══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showPledgeModal && (
          <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[#FFFDF8] text-[#1E0812] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowPledgeModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EBDACF]/80 text-[#1E0812] hover:bg-[#D4AF37] hover:text-white transition cursor-pointer"
                aria-label="Close pledge modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F4D9A6] to-[#D4AF37] flex items-center justify-center shadow-lg">
                <Swords className="w-7 h-7 text-[#1E0812]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E0812] tracking-wide">
                Pledge Your Allegiance
              </h3>

              <p className="text-xs sm:text-sm text-[#4A2C27] font-serif leading-relaxed mt-1">
                Whose side do you belong to for {bName} & {gName}'s grand wedding battle?
              </p>

              {/* Strict Royal Rule Warning */}
              <div className="my-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 font-serif leading-relaxed text-left flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Wedding Rule:</strong> Guests can only represent ONE side! Once pledged, your allegiance is permanently locked and cannot be changed.
                </span>
              </div>

              {/* The Two Squad Cards */}
              <div className="space-y-3 mt-4">
                {/* Bride Squad Choice */}
                <button
                  type="button"
                  onClick={() => handlePledgeSquad('bride')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#FFE4E1] border-2 border-[#FF69B4] hover:border-[#E0218A] hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4081] to-[#C2185B] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#880E4F]">
                        {brideTeamName} (Bride)
                      </h4>
                      <p className="text-xs text-[#AD1457] font-medium">
                        Ladkiwale Squad • Elegance, smiles & grace
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#C2185B] group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Groom Squad Choice */}
                <button
                  type="button"
                  onClick={() => handlePledgeSquad('groom')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#F0F8FF] to-[#E6F2FF] border-2 border-[#64B5F6] hover:border-[#1976D2] hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#0D47A1] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0D47A1]">
                        {groomTeamName} (Groom)
                      </h4>
                      <p className="text-xs text-[#1565C0] font-medium">
                        Ladkewale Squad • Baraat energy & banter
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#0D47A1] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          EDIT PHOTO MODAL (CAPTION & CEREMONY TAG)
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingPhoto && (
          <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[#FFFDF8] text-[#1E0812] rounded-3xl p-6 shadow-2xl border-2 border-[#D4AF37]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EBDACF]/80 text-[#1E0812] hover:bg-[#D4AF37] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                  <Edit3 className="w-6 h-6 text-amber-800" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1E0812]">
                  Edit Your Candid Snap
                </h3>
                <p className="text-xs text-[#5A3831] font-serif mt-1">
                  Update your caption or ceremony tag for this memory.
                </p>
              </div>

              {/* Photo Thumbnail */}
              <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-[#D4AF37]/40 bg-black/10">
                <img
                  src={editingPhoto.src}
                  alt="Editing snap"
                  className="w-full h-full object-cover"
                />
              </div>

              <form onSubmit={handleSaveEditPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-serif text-[#1E0812] mb-1.5 uppercase tracking-wider">
                    Ceremony / Celebration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Reception', 'Dhara Muhurtham', 'Celebrations'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setEditTag(tag)}
                        className={`py-2 px-2 rounded-xl text-xs font-serif text-center font-bold transition-all cursor-pointer ${
                          editTag === tag || (tag === 'Dhara Muhurtham' && editTag === 'Muhurtham')
                          ? 'bg-[#68183C] text-[#FFFDF8] border-2 border-[#D4AF37] shadow-md scale-102'
                          : 'bg-white text-[#2A0C18] border border-[#C5A059]/40 hover:bg-[#FDF9F3]'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-serif text-[#1E0812] mb-1 uppercase tracking-wider">
                    Caption or Wish
                  </label>
                  <textarea
                    rows={3}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Update your caption..."
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 font-serif font-bold text-xs uppercase cursor-pointer hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4D9A6] text-[#1E0812] font-serif font-bold text-xs uppercase shadow-md hover:scale-102 transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          PHOTO UPLOAD MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-[#FFFDF8] text-[#1E0812] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EBDACF]/80 text-[#1E0812] hover:bg-[#D4AF37] hover:text-white transition cursor-pointer"
                aria-label="Close upload modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F4D9A6] to-[#D4AF37] flex items-center justify-center shadow-md">
                  <Camera className="w-6 h-6 text-[#1E0812]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E0812] tracking-wide">
                  Share a Candid Memory
                </h3>

                {/* Squad Banner Tag in Upload Modal */}
                {userTeam && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold shadow-sm bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-400 text-amber-950">
                    <span>
                      Representing:{' '}
                      <strong className="font-extrabold">
                        {isBrideTeam(userTeam) ? `${brideTeamName} (Bride)` : `${groomTeamName} (Groom)`}
                      </strong>
                    </span>
                    <span className="text-amber-800">• +10 pts for squad!</span>
                  </div>
                )}
              </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {/* Error banner */}
                  {uploadError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 text-xs font-serif font-semibold">
                      {uploadError}
                    </div>
                  )}

                  {/* Section 1: Guest Details (Locked Verified Identity) */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#D4AF37]/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold font-serif text-[#1E0812] uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#8B5A2B]" />
                        <span>Posting As (Verified Guest)</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    </div>

                    {guestProfile.name ? (
                      <div className="p-3 rounded-xl bg-[#FDF9F0] border border-[#D4AF37]/40 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B5A2B] text-white font-bold font-serif text-xs flex items-center justify-center shrink-0">
                            {guestProfile.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E0812] leading-tight">
                              {guestProfile.name}
                            </p>
                            <p className="text-xs text-[#5A3831] mt-0.5">
                              {guestProfile.relation || (isBrideTeam(userTeam) ? "Bride's Squad" : "Groom's Squad")}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-serif font-bold text-[#8B5A2B] bg-white px-2.5 py-1 rounded-md border border-[#D4AF37]/40 shadow-xs">
                          {isBrideTeam(userTeam) ? brideTeamName : groomTeamName}
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#1E0812] mb-1">
                            Your Full Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={uploadName}
                            onChange={(e) => setUploadName(e.target.value)}
                            placeholder="e.g. Aditi Hegde"
                            className="w-full px-3 py-2.5 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1E0812] mb-1">
                            Relation or Squad Role
                          </label>
                          <input
                            type="text"
                            value={uploadRelation}
                            onChange={(e) => setUploadRelation(e.target.value)}
                            placeholder={isBrideTeam(userTeam) ? "e.g. Bride's Sister, Friend" : "e.g. Groom's Brother, Friend"}
                            className="w-full px-3 py-2.5 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#D4AF37]/20">
                      <label className="block text-xs font-bold text-[#1E0812] mb-1">
                        Your Email ID <span className="text-[#8C6D62] text-[10px] font-normal font-sans">(Optional • receive alerts when guests post & cheer)</span>
                      </label>
                      <input
                        type="email"
                        value={uploadEmail}
                        onChange={(e) => setUploadEmail(e.target.value)}
                        placeholder="e.g. yourname@example.com"
                        className="w-full px-3 py-2.5 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                      />
                    </div>
                  </div>

                  {/* Section 2: Photo Upload Area */}
                  <div>
                    <label className="block text-xs font-bold font-serif text-[#1E0812] mb-1.5 uppercase tracking-wider">
                      Choose or Capture Photo <span className="text-red-600">*</span>
                    </label>

                    {/* Hidden Native Inputs: Camera direct capture and standard Gallery file picker */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {uploadImageSrc ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-[#180610] aspect-[4/3] flex items-center justify-center group shadow-inner">
                        {/* Ambient blur backdrop */}
                        <img
                          src={uploadImageSrc}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                        />
                        {/* Crisp uncropped photo foreground */}
                        <img
                          src={uploadImageSrc}
                          alt="Selected preview"
                          className="relative max-w-full max-h-full object-contain z-1"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-2">
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-full bg-white text-[#1E0812] text-xs font-serif font-bold shadow-md hover:bg-[#F4D9A6] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Camera className="w-4 h-4 text-[#8B5A2B]" />
                            <span>Retake Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-full bg-white text-[#1E0812] text-xs font-serif font-bold shadow-md hover:bg-[#F4D9A6] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 text-[#8B5A2B]" />
                            <span>Choose Another</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="py-6 px-4 border-2 border-dashed border-[#C5A059] rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#FFFDF8] hover:bg-[#FDF9F0] transition-colors cursor-pointer group shadow-sm active:scale-98"
                        >
                          <div className="p-3 rounded-full bg-[#EBDACF]/60 group-hover:bg-[#D4AF37]/20 transition-colors">
                            <Camera className="w-6 h-6 text-[#8B5A2B]" />
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E0812] uppercase tracking-wider">
                            Take Live Photo (Camera)
                          </span>
                          <span className="text-[11px] text-[#8C6D62]">
                            Snap directly from phone camera
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="py-6 px-4 border-2 border-dashed border-[#C5A059] rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#FFFDF8] hover:bg-[#FDF9F0] transition-colors cursor-pointer group shadow-sm active:scale-98"
                        >
                          <div className="p-3 rounded-full bg-[#EBDACF]/60 group-hover:bg-[#D4AF37]/20 transition-colors">
                            <Upload className="w-6 h-6 text-[#8B5A2B]" />
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E0812] uppercase tracking-wider">
                            Choose from Gallery
                          </span>
                          <span className="text-[11px] text-[#8C6D62]">
                            Select from saved memories
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Ceremony Selection (Freely Selectable Anytime - No Time Lock) */}
                  <div>
                    <label className="block text-xs font-bold font-serif text-[#1E0812] uppercase tracking-wider mb-1.5">
                      Choose Ceremony / Celebration
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'Reception',
                          title: 'Reception',
                          sub: 'Sunday, 15 Nov · Evening',
                          badge: 'Eve Party',
                        },
                        {
                          id: 'Dhara Muhurtham',
                          title: 'Dhara Muhurtham',
                          sub: 'Monday, 16 Nov · Morning',
                          badge: 'Sacred Ritual',
                        },
                        {
                          id: 'Celebrations',
                          title: 'Celebrations',
                          sub: 'Family, Friends & Candid',
                          badge: 'All Memories',
                        },
                      ].map((item) => {
                        const isSelected =
                          uploadTag === item.id ||
                          (item.id === 'Dhara Muhurtham' && uploadTag === 'Muhurtham');
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setUploadTag(item.id)}
                            className={`p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#68183C] border-[#D4AF37] text-[#FFFDF8] shadow-md scale-[1.02]'
                                : 'bg-[#FDF9F0] border-[#D4AF37]/35 text-[#1E0812] hover:border-[#D4AF37]/70'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span
                                className={`text-[9px] font-serif uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold ${
                                  isSelected
                                    ? 'bg-[#D4AF37] text-[#1E0812]'
                                    : 'bg-[#C5A059]/20 text-[#8B5A2B]'
                                }`}
                              >
                                {item.badge}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#F4D9A6]" />}
                            </div>
                            <div className="text-xs font-serif font-extrabold leading-tight">
                              {item.title}
                            </div>
                            <div
                              className={`text-[10px] mt-0.5 leading-snug ${
                                isSelected ? 'text-[#F4D9A6]/90' : 'text-[#8C6D62]'
                              }`}
                            >
                              {item.sub}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 4: Caption / Note */}
                  <div>
                    <label className="block text-xs font-bold font-serif text-[#1E0812] mb-1 uppercase tracking-wider">
                      Caption or Wish for {bName} & {gName}
                    </label>
                    <textarea
                      rows={2}
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="e.g. Beautiful moments from the celebration! Wishing you both forever love..."
                      className="w-full px-3 py-2 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                    />
                  </div>

                  {/* Etiquette Note */}
                  <div className="p-3 rounded-xl bg-[#F5DE98]/20 border border-[#D4AF37]/40 text-[11px] text-[#4A2C27] font-serif leading-relaxed flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                    <span>Photos are lovingly preserved for the couple's keepsake album.</span>
                  </div>

                  {/* Golden Submit Button */}
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="fv-btn w-full py-3.5 text-sm font-bold tracking-wider uppercase cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #FFFDF8 0%, #F5DE98 50%, #E6C364 100%)',
                      color: '#1E0812',
                      boxShadow: '0 6px 22px rgba(212, 175, 55, 0.55), 0 0 0 2px #D4AF37',
                    }}
                  >
                    {isPosting ? (
                      <span>Adding to Celebration Wall...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
                        <span>Post to Wedding Hub (+10 pts)</span>
                      </>
                    )}
                  </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          HOST VERIFICATION PIN MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showHostPinModal && (
          <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-sm bg-[#FFFDF8] text-[#1E0812] rounded-3xl p-6 shadow-2xl border-2 border-[#D4AF37]"
            >
              <button
                type="button"
                onClick={() => {
                  setShowHostPinModal(false);
                  setPinError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-[#1E0812] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300">
                  <Lock className="w-6 h-6 text-amber-800" />
                </div>
                <h4 className="text-lg font-serif font-bold text-[#1E0812]">
                  Couple & Host Controls
                </h4>
                <p className="text-xs text-[#5A3831] font-serif mt-1">
                  Exclusively for {bName}, {gName} & Wedding Hosts to moderate or remove photos.
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-[#FDF3D8] border border-[#D4AF37] text-[11px] font-mono font-bold text-[#8B5A2B]">
                  Default Host PIN: 1611
                </div>
              </div>

              {pinError && (
                <p className="text-xs font-semibold text-red-600 mb-3 text-center">{pinError}</p>
              )}

              <form onSubmit={handleVerifyPin} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="PIN: 1611"
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 bg-white rounded-xl border-2 border-[#D4AF37] text-[#1E0812] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#1E0812] text-[#F4D9A6] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#34111E] transition cursor-pointer"
                >
                  Unlock Moderation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          EMAIL NOTIFICATIONS SUBSCRIPTION MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isSubscribeModalOpen && (
          <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[#FFFDF8] text-[#1E0812] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D4AF37]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setIsSubscribeModalOpen(false);
                  setSubscribeMsg('');
                  setSubscribeStatus('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 text-[#1E0812] cursor-pointer"
                aria-label="Close notification modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F4D9A6] to-[#D4AF37] flex items-center justify-center shadow-md">
                  <Bell className="w-6 h-6 text-[#1E0812]" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#1E0812]">
                  Celebration Photo Alerts
                </h4>
                <p className="text-xs text-[#5A3831] font-serif mt-1">
                  Get notified instantly whenever {brideShort} & {groomShort}'s guests post candid photos and cheers!
                </p>
              </div>

              {subscribeMsg && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-serif font-semibold border ${
                    subscribeStatus === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}
                >
                  {subscribeMsg}
                </div>
              )}

              <form onSubmit={handleSubscribeEmail} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1E0812] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={subscribeName}
                    onChange={(e) => setSubscribeName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E0812] mb-1">
                    Your Email ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="e.g. guest@example.com"
                    className="w-full px-3 py-2 text-sm bg-white rounded-xl border-2 border-[#C5A059]/60 text-[#1E0812] font-medium placeholder-[#8C6D62] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={subscribeStatus === 'submitting'}
                  className="fv-btn w-full py-3 text-sm font-bold tracking-wider uppercase cursor-pointer mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #FFFDF8 0%, #F5DE98 50%, #E6C364 100%)',
                    color: '#1E0812',
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4), 0 0 0 1px #D4AF37',
                  }}
                >
                  {subscribeStatus === 'submitting' ? 'Subscribing...' : '🔔 Notify Me of New Photos'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          FULLSCREEN PHOTO LIGHTBOX MODAL WITH EDIT & DELETE
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedLightboxPhoto && (
          <div
            className="fixed inset-0 z-[10003] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md"
            onClick={() => setSelectedLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative max-w-4xl w-full bg-[#14040B] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 flex flex-col md:flex-row max-h-[94vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Display */}
              <div className="relative flex-1 bg-black/60 flex items-center justify-center min-h-[300px] md:min-h-[500px] p-2">
                <img
                  src={selectedLightboxPhoto.src}
                  alt={selectedLightboxPhoto.caption || 'Wedding moment'}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl"
                />
              </div>

              {/* Details Sidebar */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#220713] border-t md:border-t-0 md:border-l border-[#D4AF37]/30 text-[#FFFDF8]">
                <div className="space-y-4">
                  {/* Event & Team Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedLightboxPhoto.eventTag && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#F4D9A6] text-[#1E0812] shadow-sm">
                        {selectedLightboxPhoto.eventTag}
                      </span>
                    )}
                    {isBrideTeam(selectedLightboxPhoto.team) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif font-bold bg-[#E0218A] text-white shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{brideTeamName}</span>
                      </span>
                    )}
                    {isGroomTeam(selectedLightboxPhoto.team) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif font-bold bg-[#1E3A8A] text-[#F4D9A6] border border-[#D4AF37]/40 shadow-sm">
                        <Crown className="w-3.5 h-3.5" />
                        <span>{groomTeamName}</span>
                      </span>
                    )}
                  </div>

                  {/* Uploader Details */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B5A2B] text-[#1E0812] text-sm font-bold font-serif flex items-center justify-center shrink-0 shadow-inner">
                      {selectedLightboxPhoto.uploader?.name
                        ? selectedLightboxPhoto.uploader.name.charAt(0).toUpperCase()
                        : 'G'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold font-serif text-[#F4D9A6]">
                          {selectedLightboxPhoto.uploader?.name || 'Wedding Guest'}
                        </p>
                        {isMyPhoto(selectedLightboxPhoto) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/50 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#E8C877]/80">
                        {selectedLightboxPhoto.uploader?.relation || 'Guest'}
                      </p>
                      {selectedLightboxPhoto.uploader?.timestamp && (
                        <p className="text-[10px] text-[#F6E7D6]/60 mt-0.5">
                          {selectedLightboxPhoto.uploader.timestamp}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Caption */}
                  {selectedLightboxPhoto.caption && (
                    <div className="pt-2">
                      <p className="text-xs text-[#F6E7D6] italic font-serif leading-relaxed bg-[#FFFDF8]/5 p-3 rounded-xl border border-[#D4AF37]/25">
                        "{selectedLightboxPhoto.caption}"
                      </p>
                    </div>
                  )}

                  {/* Owner Controls (Edit / Delete) */}
                  {isMyPhoto(selectedLightboxPhoto) && (
                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditPhoto(selectedLightboxPhoto)}
                        className="flex-1 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#F4D9A6] border border-[#D4AF37]/60 text-xs font-serif flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Caption</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMyPhoto(selectedLightboxPhoto.id)}
                        className="flex-1 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-500/60 text-xs font-serif flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Photo</span>
                      </button>
                    </div>
                  )}

                  {/* Host Delete Action if in Host Mode & Not Owner */}
                  {!isMyPhoto(selectedLightboxPhoto) && isHostMode && (
                    <button
                      type="button"
                      onClick={() => handleHostDeletePhoto(selectedLightboxPhoto.id)}
                      className="w-full py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500 text-xs font-serif flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Host: Remove from Album</span>
                    </button>
                  )}
                </div>

                {/* Lightbox Actions */}
                <div className="pt-6 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
                  {/* Heart reaction */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(selectedLightboxPhoto.id, e)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF8]/15 hover:bg-[#FFFDF8]/25 border border-[#D4AF37]/40 transition text-sm text-[#FFFDF8] cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${(selectedLightboxPhoto.likes || 0) > 0
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                        }`}
                    />
                    <span>{selectedLightboxPhoto.likes || 0} Loves</span>
                  </button>

                  {/* Download Photo Button */}
                  <a
                    href={selectedLightboxPhoto.src}
                    download={`wedding-moment-${selectedLightboxPhoto.id}.jpg`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4D9A6] text-[#1E0812] text-xs font-serif font-bold shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Photo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>,
        document.body
      )}

      {/* ── Full-Bleed Edge-to-Edge Royal Gold Zari Border at Section Bottom ── */}
      <div
        className="fv-zari absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none"
        aria-hidden="true"
        style={{
          boxShadow: '0 -8px 24px rgba(42, 12, 24, 0.65)',
        }}
      />
    </section>
  );
}
