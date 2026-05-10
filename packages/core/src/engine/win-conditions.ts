import type { GameState, GameResult } from '../types.js';

// TODO(design): victory conditions are simplified.
//   Scenario 1: requires completing Gran Milpa (Conocimiento ≥ 5, FT ≥ 4, spend 3 Maíz + 2 Jade unanimously).
//   Scenario 2: requires reopening north district + Maíz ≥ 5 at cycle 9.
//   Scenario 3: requires 3-phase temple construction including Sacerdote level 3.
//   For now: surviving all cycles = victoria.
//
// TODO(design): district loss mechanics not yet wired — districts only fall via event
//   secondary effects, which are not yet implemented. Inactive-district defeat counts
//   will always read 0 until that is built.
//
// TODO(design): epidemic marker progression undefined in doc. hasEpidemic = true
//   means there is an active epidemic, but how it advances and defeats are TBD.

export function checkWinConditions(state: GameState): GameResult {
  if (state.result !== 'en_curso') return state.result;

  const { resources, districts, scenario, currentCycle, consecutiveMaizZero } = state;

  // Universal: Copal = 0 → immediate defeat
  if (resources.copal.value === 0) return 'derrota';

  const inactiveCount = Object.values(districts).filter((d) => !d.active).length;

  switch (scenario.difficulty) {
    case 'facil':
      if (consecutiveMaizZero >= 2) return 'derrota'; // 2 consecutive cycles with maiz = 0
      if (inactiveCount >= 3) return 'derrota';       // 3+ districts fallen simultaneously
      break;
    case 'normal':
      if (resources.maiz.value === 0) return 'derrota'; // immediate, no grace period
      if (inactiveCount >= 2) return 'derrota';
      break;
    case 'dificil':
      if (resources.maiz.value === 0) return 'derrota';
      if (inactiveCount >= 1) return 'derrota'; // any district fall = defeat
      break;
  }

  if (currentCycle > scenario.totalCycles) return 'victoria';

  return 'en_curso';
}
