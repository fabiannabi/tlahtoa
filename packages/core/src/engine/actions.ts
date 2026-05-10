import type { GameState, ResourceKind } from '../types.js';
import { addResource, subtractResource } from './resources.js';

export type ActionType =
  | 'cultivar'    // +2 Maíz, costs 1 action
  | 'construir'   // +1 FT, costs 1 action + 1 Maíz
  | 'estudiar'    // +1 Conocimiento, costs 1 action
  | 'descansar'   // +1 any resource, costs 2 actions
  | 'comerciar'   // uses a trade route, costs 1 action — TODO: implement
  | 'ritual'      // +1 Copal, prevents decay, costs 1 action (Sacerdote or Templo)
  | 'pasar';      // no action

export interface PlayerAction {
  role: string;
  action: ActionType;
  target?: ResourceKind; // for 'descansar'
}

function applyOne(state: GameState, pa: PlayerAction): GameState {
  let r = state.resources;
  let hadRitual = state.activeCycle.hadRitual;
  let msg: string | null = null;

  switch (pa.action) {
    case 'cultivar':
      r = addResource(r, 'maiz', 2);
      msg = `${pa.role} cultivó: Maíz +2.`;
      break;

    case 'construir':
      if (r.maiz.value >= 1) {
        r = subtractResource(r, 'maiz', 1);
        r = addResource(r, 'ft', 1);
        msg = `${pa.role} construyó: FT +1, Maíz −1.`;
      }
      // Silently skip if no Maíz — TODO: return error to UI
      break;

    case 'estudiar':
      r = addResource(r, 'conocimiento', 1);
      msg = `${pa.role} estudió: Conocimiento +1.`;
      break;

    case 'ritual':
      r = addResource(r, 'copal', 1);
      hadRitual = true;
      msg = `${pa.role} realizó el ritual: Copal +1. Decay prevenido este ciclo.`;
      break;

    case 'descansar':
      if (pa.target) {
        r = addResource(r, pa.target, 1);
        msg = `${pa.role} descansó: ${pa.target} +1.`;
      }
      break;

    case 'comerciar':
      // TODO: implement trade routes with allied cities
      msg = `${pa.role} comerció (rutas no implementadas aún).`;
      break;

    case 'pasar':
      break;
  }

  return {
    ...state,
    resources: r,
    activeCycle: { ...state.activeCycle, hadRitual },
    log: msg
      ? [...state.log, { cycle: state.currentCycle, phase: 'acciones' as const, mensaje: msg }]
      : state.log,
  };
}

export function runActions(state: GameState, actions: PlayerAction[]): GameState {
  let next = state;
  for (const action of actions) next = applyOne(next, action);
  return {
    ...next,
    players: next.players.map((p) => ({ ...p, actionsLeft: 0 })),
    activeCycle: { ...next.activeCycle, phase: 'evento' },
  };
}
