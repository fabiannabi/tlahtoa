import type { GameState, GameResult } from '../types.js';

export interface WinCheck {
  result: GameResult;
  reason: string | null;
}

export function checkWinConditions(state: GameState): WinCheck {
  if (state.result !== 'en_curso') return { result: state.result, reason: null };

  const { resources, districts, scenario, currentCycle, consecutiveMaizZero } = state;

  // Universal: Copal = 0 → immediate defeat
  if (resources.copal.value === 0) {
    return { result: 'derrota', reason: 'El Copal se agotó: el templo enmudece y el orden ritual colapsa.' };
  }

  const inactiveCount = Object.values(districts).filter((d) => !d.active).length;

  switch (scenario.difficulty) {
    case 'facil':
      if (consecutiveMaizZero >= 2) {
        return { result: 'derrota', reason: 'El Maíz se agotó dos ciclos seguidos: el hambre devasta la ciudad.' };
      }
      if (inactiveCount >= 3) {
        return { result: 'derrota', reason: `${inactiveCount} barrios han caído: la ciudad se fragmenta sin remedio.` };
      }
      // Victory requires completing Gran Milpa
      if (state.greatMilpaCompleted) return { result: 'victoria', reason: null };
      if (currentCycle > scenario.totalCycles) {
        return { result: 'derrota', reason: 'El tiempo ritual se cerró sin que la Gran Milpa floreciera.' };
      }
      break;

    case 'normal':
      if (resources.maiz.value === 0) {
        return { result: 'derrota', reason: 'El Maíz se agotó: el pueblo no puede sobrevivir.' };
      }
      if (inactiveCount >= 2) {
        return { result: 'derrota', reason: `${inactiveCount} barrios han caído: la ciudad pierde cohesión.` };
      }
      if (currentCycle > scenario.totalCycles) return { result: 'victoria', reason: null };
      break;

    case 'dificil':
      if (resources.maiz.value === 0) {
        return { result: 'derrota', reason: 'El Maíz se agotó: el pueblo no puede sobrevivir.' };
      }
      if (inactiveCount >= 1) {
        return { result: 'derrota', reason: 'Un barrio ha caído: la ciudad no puede permitirse ni una pérdida.' };
      }
      if (currentCycle > scenario.totalCycles) return { result: 'victoria', reason: null };
      break;
  }

  return { result: 'en_curso', reason: null };
}
