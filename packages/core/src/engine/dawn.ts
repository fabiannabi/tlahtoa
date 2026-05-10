import type { GameState } from '../types.js';
import { addResource } from './resources.js';

export function runDawn(state: GameState): GameState {
  let resources = state.resources;
  const producedParts: string[] = [];

  // Each active district produces +1 of its resource — Centro excluded (produces only on ritual)
  for (const district of Object.values(state.districts)) {
    if (!district.active || district.id === 'centro') continue;
    resources = addResource(resources, district.produces, 1);
    producedParts.push(`${district.produces} +1`);
  }

  const produccionMsg = producedParts.length > 0
    ? `Producción: ${producedParts.join(', ')}.`
    : 'Sin barrios activos que produzcan.';

  return {
    ...state,
    resources,
    activeCycle: { ...state.activeCycle, phase: 'consejo' },
    log: [
      ...state.log,
      {
        cycle: state.currentCycle,
        phase: 'amanecer' as const,
        mensaje: `Ciclo ${state.currentCycle} de ${state.scenario.totalCycles}: El amanecer llega. ${produccionMsg}`,
      },
    ],
  };
}
