import React, { useEffect, useState } from 'react';

const COLORS = ['#F5D130', '#ffe178', '#8FBCE6', '#ffffff', '#15803d', '#092C5C'];

// Lightweight CSS confetti — fires for ~2.5s then unmounts.
export default function Confetti({ active, onDone, count = 70 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { onDone?.(); return; }

    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 7 + Math.random() * 9,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
      });
    }
    setPieces(arr);
    const t = setTimeout(() => { setPieces([]); onDone?.(); }, 3200);
    return () => clearTimeout(t);
  }, [active, count, onDone]);

  if (pieces.length === 0) return null;
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.42}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
