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

// ── Risk panel ────────────────────────────────────────────────────────────────

interface RiskItem { label: string; level: 'ok' | 'warn' | 'crit'; }

function computeRisks(state: GameState): RiskItem[] {
  const { resources, districts, scenario, currentCycle, consecutiveMaizZero } = state;
  const inactiveCount = Object.values(districts).filter((d) => !d.active).length;
  const cyclesLeft = scenario.totalCycles - currentCycle + 1;
  const items: RiskItem[] = [];

  // Maíz
  if (resources.maiz.value === 0) {
    const streak = consecutiveMaizZero >= 1 ? ` (ciclo ${consecutiveMaizZero} de 2)` : '';
    items.push({ label: `Maíz agotado${streak}`, level: 'crit' });
  } else if (resources.maiz.value <= 2) {
    items.push({ label: `Maíz crítico: ${resources.maiz.value}`, level: 'warn' });
  }

  // Copal
  if (resources.copal.value === 0) {
    items.push({ label: 'Copal agotado — derrota inminente', level: 'crit' });
  } else if (resources.copal.value <= 1) {
    items.push({ label: `Copal crítico: ${resources.copal.value} — haz un ritual`, level: 'warn' });
  }

  // Districts
  if (scenario.difficulty === 'facil') {
    if (inactiveCount >= 2)
      items.push({ label: `${inactiveCount} barrios caídos — 1 más = derrota`, level: 'crit' });
    else if (inactiveCount === 1)
      items.push({ label: '1 barrio caído', level: 'warn' });
  } else if (scenario.difficulty === 'normal') {
    if (inactiveCount >= 1)
      items.push({ label: `${inactiveCount} barrio caído — 1 más = derrota`, level: 'crit' });
  }

  // Cycles left
  if (cyclesLeft <= 0) {
    items.push({ label: 'Último ciclo', level: 'crit' });
  } else if (cyclesLeft <= 2) {
    items.push({ label: `${cyclesLeft} ciclos restantes`, level: 'warn' });
  } else {
    items.push({ label: `${cyclesLeft} ciclos restantes`, level: 'ok' });
  }

  // Gran Milpa progress (scenario 1 only)
  if (scenario.difficulty === 'facil' && !state.greatMilpaCompleted) {
    const conocOk = resources.conocimiento.value >= 5;
    const ftOk = resources.ft.value >= 4;
    const maizOk = resources.maiz.value >= 3;
    const jadeOk = resources.jade.value >= 2;
    const allOk = conocOk && ftOk && maizOk && jadeOk;
    items.push({
      label: allOk
        ? '¡Gran Milpa disponible!'
        : `Gran Milpa: Conoc. ${resources.conocimiento.value}/5 · FT ${resources.ft.value}/4 · Maíz ${resources.maiz.value}/3 · Jade ${resources.jade.value}/2`,
      level: allOk ? 'ok' : 'warn',
    });
  }

  return items;
}

// ── App ───────────────────────────────────────────────────────────────────────

export function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [showMilpaModal, setShowMilpaModal] = useState(false);
  const [milpaVotes, setMilpaVotes] = useState<Record<string, boolean>>({});

  const handleNextPhase = useCallback(() => {
    setState((prev) => runPhase(prev, getDefaultInput(prev)));
  }, []);

  const handleSkipCycle = useCallback(() => {
    setState((prev) => runFullCycle(prev));
  }, []);

  const handleReset = useCallback(() => {
    setState(INITIAL_STATE);
    setMilpaVotes({});
    setShowMilpaModal(false);
  }, []);

  const handleGranMilpa = useCallback(() => {
    setState((prev) =>
      runPhase(prev, {
        phase: 'acciones',
        actions: [{ role: prev.players[0].role, action: 'gran_milpa' }],
      }),
    );
    setShowMilpaModal(false);
    setMilpaVotes({});
  }, []);

  const isOver = state.result !== 'en_curso';
  const cycleDisplay = Math.min(state.currentCycle, state.scenario.totalCycles);
  const recentLog = [...state.log].reverse().slice(0, 12);

  const canAttemptGranMilpa =
    !isOver &&
    !state.greatMilpaCompleted &&
    state.scenario.difficulty === 'facil' &&
    state.activeCycle.phase === 'acciones' &&
    state.resources.conocimiento.value >= 5 &&
    state.resources.ft.value >= 4 &&
    state.resources.maiz.value >= 3 &&
    state.resources.jade.value >= 2;

  const milpaVoteUnanimous = state.players.every((p) => milpaVotes[p.role] === true);

  const risks = computeRisks(state);

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
        {canAttemptGranMilpa && (
          <button className="btn-milpa" onClick={() => setShowMilpaModal(true)}>
            ¡Gran Milpa! ✦
          </button>
        )}
        <button className="btn-reset" onClick={handleReset}>
          Reiniciar ↺
        </button>
      </div>

      {/* ── End banner ──────────────────────────────────────────── */}
      {isOver && (
        <div className={`end-banner result-${state.result}`}>
          {state.result === 'victoria'
            ? '¡El consejo ha guiado la ciudad a la prosperidad!'
            : (state.defeatReason ?? 'La ciudad no pudo sostenerse.')}
        </div>
      )}

      {/* ── Risks panel ─────────────────────────────────────────── */}
      {!isOver && (
        <div className="risks-panel">
          {risks.map((r, i) => (
            <span key={i} className={`risk-item risk-${r.level}`}>{r.label}</span>
          ))}
        </div>
      )}

      {/* ── Gran Milpa modal ────────────────────────────────────── */}
      {showMilpaModal && (
        <div className="modal-overlay" onClick={() => setShowMilpaModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Gran Milpa — Votación del Consejo</h3>
            <p className="modal-cost">Coste: Maíz −3, Jade −2. Requiere unanimidad.</p>
            <ul className="milpa-votes">
              {state.players.map((p) => (
                <li key={p.role}>
                  <label className="vote-label">
                    <input
                      type="checkbox"
                      checked={milpaVotes[p.role] ?? false}
                      onChange={(e) =>
                        setMilpaVotes((v) => ({ ...v, [p.role]: e.target.checked }))
                      }
                    />
                    <span>{LABEL_ROL[p.role]}</span>
                    <span className="vote-nombre">{p.nombre}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="modal-actions">
              <button
                className="btn-milpa"
                onClick={handleGranMilpa}
                disabled={!milpaVoteUnanimous}
              >
                Confirmar
              </button>
              <button
                className="btn-reset"
                onClick={() => { setShowMilpaModal(false); setMilpaVotes({}); }}
              >
                Cancelar
              </button>
            </div>
            {!milpaVoteUnanimous && (
              <p className="modal-hint">Todos los jugadores deben votar a favor.</p>
            )}
          </div>
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
