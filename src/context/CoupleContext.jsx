import React, { createContext, useContext, useState, useEffect } from 'react';

const CoupleContext = createContext(null);

export function CoupleProvider({
  children,
  bride,
  groom,
  brideParents = '',
  groomParents = '',
}) {
  const isVyomaHost = typeof window !== 'undefined' && window.location.hostname.includes('vyoma');
  const defaultBride = isVyomaHost ? 'Tanuja K' : 'Tanuja K';
  const defaultGroom = isVyomaHost ? 'Abhishek K N' : 'Abhishek K N';

  const activeBride = bride || defaultBride;
  const activeGroom = groom || defaultGroom;

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Only alternate when page is actively viewed, pausing when hidden to eliminate background memory/battery drain
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        setIsFlipped((prev) => !prev);
      }
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const firstName = isFlipped ? activeGroom : activeBride;
  const secondName = isFlipped ? activeBride : activeGroom;
  const firstParents = isFlipped ? groomParents : brideParents;
  const secondParents = isFlipped ? brideParents : groomParents;

  const brideShort = (activeBride || 'Bride').split(' ')[0].trim();
  const groomShort = (activeGroom || 'Groom').split(' ')[0].trim();

  const firstShort = isFlipped ? groomShort : brideShort;
  const secondShort = isFlipped ? brideShort : groomShort;
  const monogram = isFlipped 
    ? `${groomShort.charAt(0)} & ${brideShort.charAt(0)}` 
    : `${brideShort.charAt(0)} & ${groomShort.charAt(0)}`;
  const coupleTitle = `${activeBride} & ${activeGroom}`;
  const coupleShortTitle = `${brideShort} & ${groomShort}`;

  return (
    <CoupleContext.Provider
      value={{
        isFlipped,
        bride: activeBride,
        groom: activeGroom,
        firstName,
        secondName,
        firstParents,
        secondParents,
        firstShort,
        secondShort,
        monogram,
        coupleTitle,
        coupleShortTitle,
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) {
    const isVyomaHost = typeof window !== 'undefined' && window.location.hostname.includes('vyoma');
    const defaultBride = isVyomaHost ? 'Tanuja K' : 'Tanuja K';
    const defaultGroom = isVyomaHost ? 'Abhishek K N' : 'Abhishek K N';
    const brideShort = defaultBride.split(' ')[0].trim();
    const groomShort = defaultGroom.split(' ')[0].trim();
    return {
      isFlipped: false,
      bride: defaultBride,
      groom: defaultGroom,
      firstName: defaultBride,
      secondName: defaultGroom,
      firstParents: '',
      secondParents: '',
      firstShort: brideShort,
      secondShort: groomShort,
      monogram: `${brideShort.charAt(0)} & ${groomShort.charAt(0)}`,
      coupleTitle: `${defaultBride} & ${defaultGroom}`,
      coupleShortTitle: `${brideShort} & ${groomShort}`,
    };
  }
  return ctx;
}
