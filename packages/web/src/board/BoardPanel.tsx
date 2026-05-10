import type { GameState, ResourceKind, DistrictId } from '@tlahtoa/core';
import { ResourceTrack } from './ResourceTrack';
import {
  MilpaGlyph, MercadoGlyph, ArtesanosGlyph, EscribasGlyph, TemploGlyph,
} from '../glyphs/index';

const GLYPH_BARRIO = {
  norte: MilpaGlyph, sur: MercadoGlyph, este: ArtesanosGlyph,
  oeste: EscribasGlyph, centro: TemploGlyph,
} as const;

export function BoardPanel({ state }: { state: GameState }) {
  return (
    <>
      <section className="panel" aria-label="Recursos de la ciudad">
        <h2>Recursos</h2>
        <ul className="recursos" role="list">
          {(Object.keys(state.resources) as ResourceKind[]).map((key) => (
            <ResourceTrack
              key={key}
              kind={key}
              value={state.resources[key].value}
              max={state.resources[key].max}
            />
          ))}
        </ul>
      </section>

      <section className="panel" aria-label="Barrios de la ciudad">
        <h2>Barrios</h2>
        <ul className="barrios" role="list">
          {(Object.keys(state.districts) as DistrictId[]).map((id) => {
            const b = state.districts[id];
            const GlyphComp = GLYPH_BARRIO[id];
            return (
              <li key={id} aria-label={`${b.nombre}, ${b.active ? 'activo' : 'caído'}`}>
                <span className="barrio-glyph" aria-hidden="true">
                  <GlyphComp size={18} color={b.active ? 'var(--jade)' : 'var(--muted)'} />
                </span>
                <span className="barrio-nombre">{b.nombre}</span>
                <span className={`barrio-estado ${b.active ? 'activo' : 'caido'}`}>
                  {b.active ? '✓' : '✗'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
