import type { GameState } from '../types.js';
import { subtractResource } from './resources.js';

export function runConsumption(state: GameState): GameState {
  let next = state;

  const activeCount = Object.values(next.districts).filter((d) => d.active).length;
  const maizAvail = next.resources.maiz.value;
  const consumed = Math.min(maizAvail, activeCount);
  const unfed = activeCount - consumed;

  // Maíz −1 per active district
  next = { ...next, resources: subtractResource(next.resources, 'maiz', consumed) };

  // FT −1 per unfed district (hunger penalty)
  if (unfed > 0) {
    next = { ...next, resources: subtractResource(next.resources, 'ft', unfed) };
  }

  // Copal −1 if no ritual this cycle
  if (!next.activeCycle.hadRitual) {
    next = { ...next, resources: subtractResource(next.resources, 'copal', 1) };
  }

  const newConsecutiveMaizZero =
    next.resources.maiz.value === 0 ? next.consecutiveMaizZero + 1 : 0;

  const nextCycleNum = next.currentCycle + 1;

  const parts: string[] = [
    `Maíz −${consumed} (${activeCount} barrios activos)`,
    ...(unfed > 0 ? [`FT −${unfed} (hambre: ${unfed} barrios sin alimento)`] : []),
    ...(!state.activeCycle.hadRitual ? ['Copal −1 (sin ritual este ciclo)'] : []),
  ];

  return {
    ...next,
    currentCycle: nextCycleNum,
    consecutiveMaizZero: newConsecutiveMaizZero,
    players: next.players.map((p) => ({ ...p, actionsLeft: 2 })),
    activeCycle: {
      number: nextCycleNum,
      phase: 'amanecer',
      hadRitual: false,
      drawnEvent: null,
    },
    log: [
      ...next.log,
      {
        cycle: state.currentCycle,
        phase: 'consumo' as const,
        mensaje: `Consumo: ${parts.join('. ')}.`,
      },
    ],
  };
}
