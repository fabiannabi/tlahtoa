import type { ResourceKind } from '../types.js';

export type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

export const DICE_NAMES: Record<DiceRoll, string> = {
  1: 'Catástrofe',
  2: 'Grave',
  3: 'Normal',
  4: 'Leve',
  5: 'Menor',
  6: 'Desviado',
};

// Per design doc. Roll 6 = no damage (and no bonus resources — see regla de diseño).
// Roll 4 minimum 1: reduces but never fully cancels any resource damage.
export function applyDiceResult(
  roll: DiceRoll,
  baseDamage: Partial<Record<ResourceKind, number>>,
): Partial<Record<ResourceKind, number>> {
  if (roll === 6) return {};

  const result: Partial<Record<ResourceKind, number>> = {};
  for (const [k, base] of Object.entries(baseDamage) as [ResourceKind, number | undefined][]) {
    if (!base) continue;
    let final: number;
    switch (roll) {
      case 1: final = base * 2;                  break; // ×2
      case 2: final = Math.ceil(base * 1.5);     break; // ×1.5 rounded up
      case 3: final = base;                      break; // base
      case 4: final = Math.max(1, base - 1);     break; // −1, min 1
      case 5: final = Math.ceil(base / 2);       break; // /2 rounded up
      default: final = 0;
    }
    if (final > 0) result[k] = final;
  }
  return result;
}
