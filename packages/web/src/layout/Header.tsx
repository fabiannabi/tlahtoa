import type { GameState, ResourceKind, CyclePhase } from '@tlahtoa/core';

const PHASE_LABELS: Record<CyclePhase, string> = {
  amanecer: 'Amanecer', consejo: 'Consejo', acciones: 'Acciones',
  evento: 'Evento', consumo: 'Consumo', completo: 'Completo',
};

interface RiskItem { label: string; level: 'ok' | 'warn' | 'crit'; }

function computeRisks(state: GameState): RiskItem[] {
  const { resources: r, districts, scenario, currentCycle, consecutiveMaizZero } = state;
  const inactiveCount = Object.values(districts).filter((d) => !d.active).length;
  const cyclesLeft = scenario.totalCycles - currentCycle + 1;
  const items: RiskItem[] = [];

  if (r.maiz.value === 0) {
    const streak = consecutiveMaizZero >= 1 ? ` (ciclo ${consecutiveMaizZero} de 2)` : '';
    items.push({ label: `Maíz agotado${streak}`, level: 'crit' });
  } else if (r.maiz.value <= 2) {
    items.push({ label: `Maíz crítico: ${r.maiz.value}`, level: 'warn' });
  }

  if (r.copal.value === 0) {
    items.push({ label: 'Copal agotado — derrota inminente', level: 'crit' });
  } else if (r.copal.value <= 1) {
    items.push({ label: `Copal crítico: ${r.copal.value} — haz un ritual`, level: 'warn' });
  }

  if (scenario.difficulty === 'facil') {
    if (inactiveCount >= 2) items.push({ label: `${inactiveCount} barrios caídos — 1 más = derrota`, level: 'crit' });
    else if (inactiveCount === 1) items.push({ label: '1 barrio caído', level: 'warn' });
  } else if (scenario.difficulty === 'normal' && inactiveCount >= 1) {
    items.push({ label: `${inactiveCount} barrio caído — 1 más = derrota`, level: 'crit' });
  }

  items.push({
    label: `${Math.max(0, cyclesLeft)} ciclos restantes`,
    level: cyclesLeft <= 1 ? 'crit' : cyclesLeft <= 3 ? 'warn' : 'ok',
  });

  if (scenario.difficulty === 'facil' && !state.greatMilpaCompleted) {
    const ready = r.conocimiento.value >= 5 && r.ft.value >= 4 && r.maiz.value >= 3 && r.jade.value >= 2;
    items.push({
      label: ready
        ? '¡Gran Milpa disponible!'
        : `Gran Milpa: Conoc.${r.conocimiento.value}/5 FT ${r.ft.value}/4 Maíz ${r.maiz.value}/3 Jade ${r.jade.value}/2`,
      level: ready ? 'ok' : 'warn',
    });
  }

  return items;
}

export function Header({ state }: { state: GameState }) {
  const isOver = state.result !== 'en_curso';
  const cycleDisplay = Math.min(state.currentCycle, state.scenario.totalCycles);
  const risks = computeRisks(state);

  return (
    <header className="app-header">
      <h1>Tlahtoa</h1>

      <div className="status-bar">
        <span className="status-scenario">{state.scenario.nombre}</span>
        <span className="status-cycle">Ciclo {cycleDisplay} / {state.scenario.totalCycles}</span>
        <span className={`status-phase fase-${state.activeCycle.phase}`}>
          {PHASE_LABELS[state.activeCycle.phase]}
        </span>
        <span className={`status-result result-${state.result}`}>
          {state.result === 'en_curso' ? 'En curso' :
           state.result === 'victoria' ? '¡Victoria!' : 'Derrota'}
        </span>
      </div>

      {isOver && (
        <div className={`end-banner result-${state.result}`}>
          {state.result === 'victoria'
            ? '¡El consejo ha guiado la ciudad a la prosperidad!'
            : (state.defeatReason ?? 'La ciudad no pudo sostenerse.')}
        </div>
      )}

      {!isOver && risks.length > 0 && (
        <div className="risks-panel">
          {risks.map((r, i) => (
            <span key={i} className={`risk-item risk-${r.level}`}>{r.label}</span>
          ))}
        </div>
      )}
    </header>
  );
}
