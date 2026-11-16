import React from 'react';
import { useCouple } from '../context/CoupleContext';

export default function Monogram({ text, brideName, groomName }) {
  const couple = useCouple();
  const b = brideName || couple?.bride || 'B';
  const g = groomName || couple?.groom || 'G';
  const initials = text || `${b.trim().charAt(0)} & ${g.trim().charAt(0)}`;

  return (
    <div className="fv-seal-mono-container" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span
        style={{
          fontFamily: 'var(--fv-names, "Cinzel", "Playfair Display", Georgia, serif)',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#f5de98',
          textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.4)',
          userSelect: 'none',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
