import type { GameState, RoleId } from '../types.js';
import { runDawn } from './dawn.js';
import { runCouncil, type CouncilInput } from './council.js';
import { runActions, type PlayerAction, type ActionType } from './actions.js';
import { runEvent, type EventInput } from './event.js';
import { runConsumption } from './consumption.js';
import { checkWinConditions } from './win-conditions.js';

export type { CouncilInput, PlayerAction, ActionType, EventInput };

export type PhaseInput =
  | { phase: 'amanecer' }
  | { phase: 'consejo'; council: CouncilInput }
  | { phase: 'acciones'; actions: PlayerAction[] }
  | { phase: 'evento'; event: EventInput }
  | { phase: 'consumo' };

export interface CycleDecisions {
  progressionVotes?: Partial<Record<RoleId, RoleId>>;
  policyVotes?: Partial<Record<RoleId, 'A' | 'B'>>;
  actions?: PlayerAction[];
  useDice?: boolean;
  diceRoll?: 1 | 2 | 3 | 4 | 5 | 6;
}

function withWinCheck(state: GameState): GameState {
  const result = checkWinConditions(state);
  if (result === state.result) return state;
  const endMsg =
    result === 'victoria'
      ? '¡Victoria! El consejo ha guiado la ciudad a la prosperidad.'
      : 'Derrota. La ciudad no pudo sostenerse.';
  return {
    ...state,
    result,
    log: [
      ...state.log,
      { cycle: state.currentCycle, phase: state.activeCycle.phase, mensaje: endMsg },
    ],
  };
}

export function runPhase(state: GameState, input: PhaseInput): GameState {
  if (state.result !== 'en_curso') return state;
  if (input.phase !== state.activeCycle.phase) return state;

  let next: GameState;
  switch (input.phase) {
    case 'amanecer': next = runDawn(state);                    break;
    case 'consejo':  next = runCouncil(state, input.council);  break;
    case 'acciones': next = runActions(state, input.actions);  break;
    case 'evento':   next = runEvent(state, input.event);      break;
    case 'consumo':  next = runConsumption(state);             break;
  }

  return withWinCheck(next);
}

// Sensible defaults for automated / demo play.
function defaultActions(state: GameState): PlayerAction[] {
  return state.players.flatMap((p) => {
    const first: ActionType =
      p.role === 'sacerdote' ? 'ritual' :
      p.role === 'astronomo' ? 'estudiar' :
      'cultivar';
    return [
      { role: p.role, action: first },
      { role: p.role, action: 'pasar' as const },
    ];
  });
}

export function runFullCycle(state: GameState, decisions: CycleDecisions = {}): GameState {
  const allVoteA = Object.fromEntries(
    state.players.map((p) => [p.role, 'A' as const]),
  ) as Partial<Record<RoleId, 'A' | 'B'>>;

  let s = runPhase(state, { phase: 'amanecer' });
  s = runPhase(s, {
    phase: 'consejo',
    council: {
      progressionVotes: decisions.progressionVotes ?? {},
      policyVotes: decisions.policyVotes ?? allVoteA,
    },
  });
  s = runPhase(s, { phase: 'acciones', actions: decisions.actions ?? defaultActions(state) });
  s = runPhase(s, {
    phase: 'evento',
    event: { useDice: decisions.useDice ?? false, diceRoll: decisions.diceRoll },
  });
  s = runPhase(s, { phase: 'consumo' });
  return s;
}
