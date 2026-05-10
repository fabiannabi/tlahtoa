import { useState } from 'react';
import type { GameState, RoleId, CyclePhase, PhaseInput } from '@tlahtoa/core';

const PHASE_LABELS: Record<CyclePhase, string> = {
  amanecer: 'Amanecer', consejo: 'Consejo', acciones: 'Acciones',
  evento: 'Evento', consumo: 'Consumo', completo: 'Completo',
};

const LABEL_ROL: Record<RoleId, string> = {
  sacerdote: 'Teopixqui — Sacerdote', general: 'Cuāuhpilli — General',
  comerciante: 'Pochtecatl — Comerciante', curandera: 'Ticitl — Curandera',
  astronomo: 'Tonalpouhqui — Astrónomo',
};

interface Props {
  state: GameState;
  onPhase: (input: PhaseInput) => void;
}

// ── Council phase (voting) ────────────────────────────────────────────────────

function CouncilVoting({ state, onPhase }: Props) {
  const roles = state.players.map((p) => p.role);
  const [policyVotes, setPolicyVotes] = useState<Partial<Record<RoleId, 'A' | 'B'>>>({});
  const [progressVote, setProgressVote] = useState<RoleId | 'nadie' | null>(null);

  function handleConfirm() {
    const fullPolicyVotes = Object.fromEntries(
      roles.map((r) => [r, policyVotes[r] ?? 'A']),
    ) as Record<RoleId, 'A' | 'B'>;

    const progressionVotes: Partial<Record<RoleId, RoleId>> = {};
    if (progressVote && progressVote !== 'nadie') {
      roles.forEach((r) => { progressionVotes[r] = progressVote as RoleId; });
    }

    onPhase({ phase: 'consejo', council: { progressionVotes, policyVotes: fullPolicyVotes } });
    setPolicyVotes({});
    setProgressVote(null);
  }

  return (
    <div className="voting-panel">
      {/* Progression vote */}
      <h3 className="voting-title">¿Quién sube de nivel?</h3>
      <div className="vote-progression">
        {state.players.map((p) => (
          <button
            key={p.role}
            className={`vote-progress-btn ${progressVote === p.role ? 'selected' : ''}`}
            onClick={() => setProgressVote(p.role)}
            aria-pressed={progressVote === p.role}
          >
            {p.nombre}
          </button>
        ))}
        <button
          className={`vote-progress-btn ${progressVote === 'nadie' ? 'selected' : ''}`}
          onClick={() => setProgressVote('nadie')}
          aria-pressed={progressVote === 'nadie'}
        >
          Nadie
        </button>
      </div>

      {/* Policy vote — TODO: true secret voting (currently visible) */}
      <h3 className="voting-title">Política del ciclo</h3>
      <div className="vote-policy">
        {state.players.map((p) => (
          <div key={p.role} className="vote-policy-row">
            <span className="vote-player-name">{p.nombre}</span>
            <div className="vote-btn-group" role="group" aria-label={`Voto de ${p.nombre}`}>
              <button
                className={`vote-btn ${policyVotes[p.role] === 'A' ? 'selected' : ''}`}
                onClick={() => setPolicyVotes((v) => ({ ...v, [p.role]: 'A' }))}
                aria-pressed={policyVotes[p.role] === 'A'}
              >A</button>
              <button
                className={`vote-btn ${policyVotes[p.role] === 'B' ? 'selected' : ''}`}
                onClick={() => setPolicyVotes((v) => ({ ...v, [p.role]: 'B' }))}
                aria-pressed={policyVotes[p.role] === 'B'}
              >B</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary btn-council-confirm" onClick={handleConfirm}>
        Confirmar Consejo →
      </button>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function CouncilPanel({ state, onPhase }: Props) {
  const recentLog = [...state.log].reverse().slice(0, 12);
  const isConsejo = state.activeCycle.phase === 'consejo' && state.result === 'en_curso';

  return (
    <>
      <section className="panel" aria-label="Consejo de la ciudad">
        <h2>Consejo</h2>
        {isConsejo ? (
          <CouncilVoting state={state} onPhase={onPhase} />
        ) : (
          <ul className="jugadores" role="list">
            {state.players.map((j) => (
              <li key={j.role}>
                <span className="rol-nombre">{LABEL_ROL[j.role]}</span>
                <span className="rol-info">{j.nombre} · Nv.{j.level} · {j.actionsLeft} acc.</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel panel-log" aria-label="Bitácora de eventos">
        <h2>Bitácora</h2>
        <ul className="log" role="log" aria-live="polite" aria-relevant="additions">
          {recentLog.map((entry, i) => (
            <li key={i}>
              <span className="log-meta">C{entry.cycle} · {PHASE_LABELS[entry.phase]}</span>
              <span className="log-msg">{entry.mensaje}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
