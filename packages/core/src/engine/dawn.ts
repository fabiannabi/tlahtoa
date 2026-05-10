import type { GameState } from '../types.js';

// TODO: if Astrónomo has level ≥ 1 passive unlocked, set a "peekedCategory" flag
// on the cycle so the UI can show the next card's category. For now, no state change.
export function runDawn(state: GameState): GameState {
  return {
    ...state,
    activeCycle: { ...state.activeCycle, phase: 'consejo' },
    log: [
      ...state.log,
      {
        cycle: state.currentCycle,
        phase: 'amanecer' as const,
        mensaje: `Ciclo ${state.currentCycle} de ${state.scenario.totalCycles}: El amanecer llega a la ciudad.`,
      },
    ],
  };
}
