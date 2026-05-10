import { useEffect, useRef, useState } from 'react';
import type { ResourceKind } from '@tlahtoa/core';
import {
  MaizGlyph, CopalGlyph, JadeGlyph, FtGlyph, ConocimientoGlyph,
} from '../glyphs/index';

const GLYPH = {
  maiz: MaizGlyph, copal: CopalGlyph, jade: JadeGlyph,
  ft: FtGlyph, conocimiento: ConocimientoGlyph,
} as const;

const LABEL: Record<ResourceKind, string> = {
  maiz: 'Maíz', copal: 'Copal', jade: 'Jade',
  ft: 'FT', conocimiento: 'Conoc.',
};

interface Props {
  kind: ResourceKind;
  value: number;
  max: number;
}

export function ResourceTrack({ kind, value, max }: Props) {
  const prevRef = useRef(value);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 380);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const pct = Math.round((value / max) * 100);
  const GlyphComp = GLYPH[kind];
  const critical = value === 0;
  const warn     = !critical && (kind === 'maiz' ? value <= 2 : kind === 'copal' ? value <= 1 : false);

  return (
    <li className={`resource-row ${critical ? 'resource-crit' : warn ? 'resource-warn' : ''}`}>
      <span className="resource-glyph" aria-hidden="true">
        <GlyphComp size={18} color={critical ? 'var(--danger)' : warn ? 'var(--accent)' : 'var(--jade)'} />
      </span>
      <span className="resource-name">{LABEL[kind]}</span>
      <div className="resource-bar-wrap" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={LABEL[kind]}>
        <div
          className={`resource-bar ${critical ? 'bar-crit' : warn ? 'bar-warn' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`resource-value ${bouncing ? 'anim-bounce' : ''}`}>
        {value}<span className="resource-max">/{max}</span>
      </span>
    </li>
  );
}
