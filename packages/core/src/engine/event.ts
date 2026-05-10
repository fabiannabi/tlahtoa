import type { GameState } from '../types.js';
import { applyDamage } from './resources.js';
import { applyDiceResult, DICE_NAMES, type DiceRoll } from './dice.js';

export interface EventInput {
  useDice: boolean;
  diceRoll?: DiceRoll;
}

export function runEvent(state: GameState, input: EventInput): GameState {
  const [drawn, ...remaining] = state.eventDeck;

  if (!drawn) {
    return {
      ...state,
      activeCycle: { ...state.activeCycle, phase: 'consumo' },
      log: [
        ...state.log,
        { cycle: state.currentCycle, phase: 'evento' as const, mensaje: 'Sin cartas de evento restantes.' },
      ],
    };
  }

  const withDice = input.useDice && state.scenario.diceEnabled && input.diceRoll !== undefined;
  const finalDamage = withDice
    ? applyDiceResult(input.diceRoll!, drawn.baseDamage)
    : drawn.baseDamage;

  const diceInfo = withDice
    ? ` Dado ${input.diceRoll} (${DICE_NAMES[input.diceRoll!]}).`
    : ' Daño fijo.';

  const dmgDesc = Object.entries(finalDamage)
    .filter(([, v]) => v && (v as number) > 0)
    .map(([k, v]) => `${k} −${v}`)
    .join(', ');

  const msg = `Evento: "${drawn.nombre}" (${drawn.category}).${diceInfo}${dmgDesc ? ` [${dmgDesc}]` : ' Sin daño.'}`;

  return {
    ...state,
    resources: applyDamage(state.resources, finalDamage),
    eventDeck: remaining,
    activeCycle: { ...state.activeCycle, phase: 'consumo', drawnEvent: drawn },
    log: [...state.log, { cycle: state.currentCycle, phase: 'evento' as const, mensaje: msg }],
  };
}
