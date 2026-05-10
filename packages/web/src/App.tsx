import { useState, useCallback } from 'react';
import {
  createInitialState,
  runPhase,
  runFullCycle,
  type GameState,
  type ResourceKind,
  type DistrictId,
  type RoleId,
  type PhaseInput,
  type CyclePhase,
} from '@tlahtoa/core';
import './styles.css';

const LABEL_RECURSO: Record<ResourceKind, string> = {
  maiz:         'Maíz — Tlaolli',
  copal:        'Copal — Copalli',
  jade:         'Jade — Chalchiuitl',
  ft:           'Fuerza de Trabajo',
  conocimiento: 'Conocimiento — Toltecayotl',
};

const LABEL_ROL: Record<RoleId, string> = {
  sacerdote:   'Teopixqui — Sacerdote',
  general:     'Cuāuhpilli — General',
  comerciante: 'Pochtecatl — Comerciante',
  curandera:   'Ticitl — Curandera',
  astronomo:   'Tonalpouhqui — Astrónomo',
};

const PHASE_LABELS: Record<CyclePhase, string> = {
  amanecer: 'Amanecer',
  consejo:  'Consejo',
  acciones: 'Acciones',
  evento:   'Evento',
  consumo:  'Consumo',
  completo: 'Completo',
};

const INITIAL_STATE = createInitialState({
  scenarioId: 1,
  jugadores: [
    { nombre: 'Jugador 1', role: 'sacerdote' },
    { nombre: 'Jugador 2', role: 'general' },
    { nombre: 'Jugador 3', role: 'curandera' },
    { nombre: 'Jugador 4', role: 'astronomo' },
  ],
  seed: 20250510,
});

function getDefaultInput(state: GameState): PhaseInput {
  const phase = state.activeCycle.phase;
  switch (phase) {
    case 'amanecer':
      return { phase: 'amanecer' };
    case 'consejo':
      return {
        phase: 'consejo',
        council: {
          progressionVotes: {},
          policyVotes: Object.fromEntries(
            state.players.map((p) => [p.role, 'A' as const]),
          ) as Record<RoleId, 'A' | 'B'>,
        },
      };
    case 'acciones':
      return {
        phase: 'acciones',
        actions: state.players.flatMap((p) => {
          const first =
            p.role === 'sacerdote' ? 'ritual' :
            p.role === 'astronomo' ? 'estudiar' :
            'cultivar';
          return [
            { role: p.role, action: first as 'ritual' | 'estudiar' | 'cultivar' },
            { role: p.role, action: 'pasar' as const },
          ];
        }),
      };
    case 'evento':
      return { phase: 'evento', event: { useDice: false } };
    case 'consumo':
      return { phase: 'consumo' };
    default:
      return { phase: 'amanecer' };
  }
}

export function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const handleNextPhase = useCallback(() => {
    setState((prev) => runPhase(prev, getDefaultInput(prev)));
  }, []);

  const handleSkipCycle = useCallback(() => {
    setState((prev) => runFullCycle(prev));
  }, []);

  const handleReset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const isOver = state.result !== 'en_curso';
  const cycleDisplay = Math.min(state.currentCycle, state.scenario.totalCycles);
  const recentLog = [...state.log].reverse().slice(0, 12);

  return (
    <main className="app">
      <h1>Tlahtoa</h1>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div className="status-bar">
        <span className="status-scenario">{state.scenario.nombre}</span>
        <span className="status-cycle">
          Ciclo {cycleDisplay}/{state.scenario.totalCycles}
        </span>
        <span className={`status-phase fase-${state.activeCycle.phase}`}>
          {PHASE_LABELS[state.activeCycle.phase]}
        </span>
        <span className={`status-result result-${state.result}`}>
          {state.result === 'en_curso' ? 'En curso' :
           state.result === 'victoria' ? '¡Victoria!' : 'Derrota'}
        </span>
      </div>

      {/* ── Controls ────────────────────────────────────────────── */}
      <div className="controls">
        <button
          className="btn-primary"
          onClick={handleNextPhase}
          disabled={isOver}
        >
          Siguiente fase →
        </button>
        <button
          className="btn-secondary"
          onClick={handleSkipCycle}
          disabled={isOver}
        >
          Ciclo completo ⏭
        </button>
        <button className="btn-reset" onClick={handleReset}>
          Reiniciar ↺
        </button>
      </div>

      {isOver && (
        <div className={`end-banner result-${state.result}`}>
          {state.result === 'victoria'
            ? '¡El consejo ha guiado la ciudad a la prosperidad!'
            : 'La ciudad no pudo sostenerse. El consejo ha fallado.'}
        </div>
      )}

      <div className="board-grid">
        {/* ── Recursos ──────────────────────────────────────────── */}
        <section className="panel">
          <h2>Recursos</h2>
          <ul className="recursos">
            {(Object.keys(state.resources) as ResourceKind[]).map((key) => {
              const r = state.resources[key];
              const pct = Math.round((r.value / r.max) * 100);
              return (
                <li key={key}>
                  <span className="resource-name">{LABEL_RECURSO[key]}</span>
                  <div className="resource-bar-wrap">
                    <div className="resource-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="resource-value">
                    {r.value}<span className="resource-max">/{r.max}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Barrios ───────────────────────────────────────────── */}
        <section className="panel">
          <h2>Barrios</h2>
          <ul className="barrios">
            {(Object.keys(state.districts) as DistrictId[]).map((id) => {
              const b = state.districts[id];
              return (
                <li key={id} data-activo={b.active}>
                  <span className="barrio-nombre">{b.nombre}</span>
                  <span className={`barrio-estado ${b.active ? 'activo' : 'caido'}`}>
                    {b.active ? 'Activo' : 'Caído'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Consejo ───────────────────────────────────────────── */}
        <section className="panel">
          <h2>Consejo</h2>
          <ul className="jugadores">
            {state.players.map((j) => (
              <li key={j.role}>
                <span className="rol-nombre">{LABEL_ROL[j.role]}</span>
                <span className="rol-info">
                  {j.nombre} · Nv.{j.level} · {j.actionsLeft} acc.
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Próximo evento ────────────────────────────────────── */}
        <section className="panel">
          <h2>Mazo ({state.eventDeck.length} cartas)</h2>
          {state.activeCycle.drawnEvent && (
            <div className={`drawn-event carta-${state.activeCycle.drawnEvent.category}`}>
              <span className="carta-cat">{state.activeCycle.drawnEvent.category}</span>
              <span className="carta-nombre">{state.activeCycle.drawnEvent.nombre}</span>
            </div>
          )}
          <ul className="mazo">
            {state.eventDeck.slice(0, 4).map((carta, i) => (
              <li key={carta.id} className={`carta-${carta.category}`}>
                <span className="carta-pos">#{i + 1}</span>
                <span className="carta-nombre">{carta.nombre}</span>
                <span className="carta-cat">{carta.category}</span>
              </li>
            ))}
            {state.eventDeck.length > 4 && (
              <li className="mazo-more">+{state.eventDeck.length - 4} más…</li>
            )}
          </ul>
        </section>
      </div>

      {/* ── Bitácora ──────────────────────────────────────────────── */}
      <section className="panel panel-log">
        <h2>Bitácora</h2>
        <ul className="log">
          {recentLog.map((entry, i) => (
            <li key={i}>
              <span className="log-meta">
                C{entry.cycle} · {PHASE_LABELS[entry.phase]}
              </span>
              <span className="log-msg">{entry.mensaje}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
