interface GlyphProps {
  size?: number;
  color?: string;
}

// ── Resource glyphs ───────────────────────────────────────────────────────────

export function MaizGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* cob body */}
      <ellipse cx="12" cy="9" rx="5" ry="7" />
      {/* kernel rows */}
      <line x1="7" y1="6" x2="17" y2="6" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="12" x2="17" y2="12" />
      {/* stem */}
      <line x1="12" y1="16" x2="12" y2="21" />
      {/* leaf */}
      <path d="M12 18 Q9 17 6 13" />
    </svg>
  );
}

export function CopalGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* smoke */}
      <path d="M9 9 Q8 6 10 3" />
      <path d="M15 9 Q16 6 14 3" />
      {/* bowl */}
      <path d="M5 9 L6 15 Q12 19 18 15 L19 9 Z" />
      {/* rim */}
      <line x1="5" y1="9" x2="19" y2="9" />
      {/* legs */}
      <line x1="8" y1="15" x2="7" y2="20" />
      <line x1="16" y1="15" x2="17" y2="20" />
    </svg>
  );
}

export function JadeGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* diamond */}
      <path d="M12 2 L21 12 L12 22 L3 12 Z" />
      {/* facet lines */}
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

export function FtGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* head */}
      <circle cx="12" cy="5" r="3" />
      {/* body */}
      <line x1="12" y1="8" x2="12" y2="16" />
      {/* arms */}
      <line x1="6" y1="11" x2="18" y2="11" />
      {/* legs */}
      <line x1="12" y1="16" x2="8" y2="22" />
      <line x1="12" y1="16" x2="16" y2="22" />
    </svg>
  );
}

export function ConocimientoGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* eye outline */}
      <path d="M2 12 Q12 3 22 12 Q12 21 2 12 Z" />
      {/* iris */}
      <circle cx="12" cy="12" r="3.5" />
      {/* pupil */}
      <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}

// ── District glyphs ───────────────────────────────────────────────────────────

export function MilpaGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* ground */}
      <line x1="2" y1="20" x2="22" y2="20" />
      {/* plant 1 */}
      <line x1="6" y1="20" x2="6" y2="13" />
      <path d="M6 15 Q3 13 3 10" />
      {/* plant 2 (taller, two leaves) */}
      <line x1="12" y1="20" x2="12" y2="9" />
      <path d="M12 13 Q9 11 9 8" />
      <path d="M12 13 Q15 11 15 8" />
      {/* plant 3 */}
      <line x1="18" y1="20" x2="18" y2="13" />
      <path d="M18 15 Q21 13 21 10" />
    </svg>
  );
}

export function MercadoGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* vessel body */}
      <ellipse cx="12" cy="15" rx="7" ry="5" />
      {/* neck */}
      <rect x="9" y="8" width="6" height="4" rx="1" />
      {/* opening rim */}
      <line x1="8" y1="8" x2="16" y2="8" />
      {/* handles */}
      <path d="M5 13 Q2 13 2 15 Q2 17 5 17" />
      <path d="M19 13 Q22 13 22 15 Q22 17 19 17" />
    </svg>
  );
}

export function ArtesanosGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* crossed tools */}
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
      {/* tool heads (filled squares at top) */}
      <rect x="2" y="2" width="4" height="4" rx="1" fill={color} stroke="none" />
      <rect x="18" y="2" width="4" height="4" rx="1" fill={color} stroke="none" />
    </svg>
  );
}

export function EscribasGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* codex scroll */}
      <rect x="3" y="14" width="18" height="7" rx="2" />
      {/* writing lines */}
      <line x1="6" y1="17" x2="18" y2="17" />
      <line x1="6" y1="19" x2="13" y2="19" />
      {/* brush handle */}
      <line x1="19" y1="3" x2="9" y2="13" />
      {/* brush tip */}
      <path d="M9 13 L6 15 L9 11" />
    </svg>
  );
}

export function TemploGlyph({ size = 24, color = 'currentColor' }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* base */}
      <line x1="2" y1="21" x2="22" y2="21" />
      {/* tier 3 — bottom */}
      <path d="M3 21 L6 17 L18 17 L21 21" />
      {/* tier 2 — middle */}
      <path d="M6 17 L9 13 L15 13 L18 17" />
      {/* tier 1 — top */}
      <path d="M9 13 L11 9 L13 9 L15 13" />
      {/* altar */}
      <rect x="9" y="6" width="6" height="3" />
    </svg>
  );
}
