import type { GameState, PhaseInput, RoleId, CyclePhase } from '@tlahtoa/core';
import { ActionPhase } from './ActionPhase';

const PHASE_LABELS: Record<CyclePhase, string> = {
  amanecer: 'Amanecer', consejo: 'Consejo', acciones: 'Acciones',
  evento: 'Evento', consumo: 'Consumo', completo: 'Completo',
};

function getAutoInput(state: GameState): PhaseInput {
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
            p.role === 'astronomo' ? 'estudiar' : 'cultivar';
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

interface Props {
  state: GameState;
  onPhase: (input: PhaseInput) => void;
  onSkip: () => void;
  onReset: () => void;
}

// ── Event phase panel ─────────────────────────────────────────────────────────

function EventPanel({ state }: { state: GameState }) {
  const { drawnEvent } = state.activeCycle;
  return (
    <section className="panel event-panel" aria-label="Fase de evento">
      <h2>Mazo de eventos ({state.eventDeck.length} cartas)</h2>
      {drawnEvent && (
        <div
          key={drawnEvent.id}
          className={`drawn-event carta-${drawnEvent.category} anim-card-enter`}
          role="alert"
          aria-label={`Evento: ${drawnEvent.nombre}, categoría ${drawnEvent.category}`}
        >
          <span className="carta-cat">{drawnEvent.category}</span>
          <span className="carta-nombre">{drawnEvent.nombre}</span>
        </div>
      )}
      <ul className="mazo" role="list">
        {state.eventDeck.slice(0, 5).map((carta, i) => (
          <li key={carta.id} className={`carta-${carta.category}`}>
            <span className="carta-pos">#{i + 1}</span>
            <span className="carta-nombre">{carta.nombre}</span>
            <span className="carta-cat">{carta.category}</span>
          </li>
        ))}
        {state.eventDeck.length > 5 && (
          <li className="mazo-more">+{state.eventDeck.length - 5} más…</li>
        )}
      </ul>
    </section>
  );
}

// ── Default phase panels ──────────────────────────────────────────────────────

function DefaultPhasePanel({ state, phase, onNext }: {
  state: GameState;
  phase: CyclePhase;
  onNext: () => void;
}) {
  const descriptions: Partial<Record<CyclePhase, string>> = {
    amanecer: 'Los barrios activos producen sus recursos. El Astrónomo puede avistar el próximo evento.',
    consumo:  'La ciudad consume Maíz. Si no hay suficiente, la FT decrece. El Copal decae sin ritual.',
    completo: 'El ciclo ha terminado.',
  };

  return (
    <section className="panel phase-default-panel" aria-label={`Fase de ${PHASE_LABELS[phase]}`}>
      <h2>{PHASE_LABELS[phase]}</h2>
      {descriptions[phase] && <p className="phase-desc">{descriptions[phase]}</p>}
      <button className="btn-primary phase-advance-btn" onClick={onNext}>
        {phase === 'consumo' ? 'Terminar ciclo →' : `Avanzar a ${PHASE_LABELS[phase] ? '' : PHASE_LABELS[phase]} →`}
        Avanzar →
      </button>
    </section>
  );
}

// ── PhaseControl ──────────────────────────────────────────────────────────────

export function PhaseControl({ state, onPhase, onSkip, onReset }: Props) {
  const { phase } = state.activeCycle;
  const isOver = state.result !== 'en_curso';

  function handleNext() {
    onPhase(getAutoInput(state));
  }

  const boardContent = (() => {
    if (isOver) {
      return (
        <section className="panel phase-default-panel">
          <h2>Partida terminada</h2>
          <p className="phase-desc">
            {state.result === 'victoria'
              ? '¡La Gran Milpa ha florecido!'
              : state.defeatReason ?? 'El consejo ha fallado.'}
          </p>
        </section>
      );
    }
    if (phase === 'acciones') return <ActionPhase state={state} onPhase={onPhase} />;
    if (phase === 'evento' || (phase === 'consumo' && state.activeCycle.drawnEvent))
      return <EventPanel state={state} />;
    return <DefaultPhasePanel state={state} phase={phase} onNext={handleNext} />;
  })();

  return (
    <div className="phase-control">
      {/* Global controls — always visible */}
      <div className="controls" role="toolbar" aria-label="Controles globales">
        {phase !== 'acciones' && !isOver && (
          <button className="btn-primary" onClick={handleNext}>
            Siguiente fase →
          </button>
        )}
        <button className="btn-secondary" onClick={onSkip} disabled={isOver}>
          Ciclo completo ⏭
        </button>
        <button className="btn-reset" onClick={onReset}>
          Reiniciar ↺
        </button>
      </div>

      {boardContent}
    </div>
  );
}
