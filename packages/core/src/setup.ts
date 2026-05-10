import type {
  GameState,
  District,
  DistrictId,
  Resources,
  Player,
  RoleId,
  ResourceKind,
} from './types.js';
import { createRng, shuffle } from './rng.js';
import { ALL_DISTRICTS, ALL_DISTRICT_IDS } from './data/barrios.js';
import { SCENARIOS } from './data/scenarios.js';

const RESOURCE_MAX: Record<ResourceKind, number> = {
  maiz: 10,
  copal: 8,
  jade: 6,
  ft: 8,
  conocimiento: 8,
};

export interface CreateGameOpts {
  scenarioId: 1 | 2 | 3;
  jugadores: Array<{ nombre: string; role: RoleId }>;
  seed: number;
}

export function createInitialState(opts: CreateGameOpts): GameState {
  const scenario = SCENARIOS[opts.scenarioId];
  const rng = createRng(opts.seed);

  const ir = scenario.initialResources;
  const resources: Resources = {
    maiz:         { value: ir.maiz,         max: RESOURCE_MAX.maiz         },
    copal:        { value: ir.copal,        max: RESOURCE_MAX.copal        },
    jade:         { value: ir.jade,         max: RESOURCE_MAX.jade         },
    ft:           { value: ir.ft,           max: RESOURCE_MAX.ft           },
    conocimiento: { value: ir.conocimiento, max: RESOURCE_MAX.conocimiento },
  };

  const districts = Object.fromEntries(
    ALL_DISTRICT_IDS.map((id) => [
      id,
      { ...ALL_DISTRICTS[id], active: scenario.initialDistricts.includes(id) },
    ]),
  ) as Record<DistrictId, District>;

  const eventDeck = shuffle(scenario.cardDeck, rng);

  const players: Player[] = opts.jugadores.map((j) => ({
    nombre: j.nombre,
    role: j.role,
    level: 0 as const,
    branch: null,
    cooldown: 0,
    specialUsed: false,
    actionsLeft: 2,
  }));

  return {
    scenario,
    currentCycle: 1,
    resources,
    districts,
    players,
    eventDeck,
    activeCycle: { number: 1, phase: 'amanecer', hadRitual: false, drawnEvent: null },
    consecutiveMaizZero: 0,
    hasEpidemic: false,
    activeSiege: null,
    result: 'en_curso',
    log: [{ cycle: 1, phase: 'amanecer', mensaje: 'El consejo se reúne.' }],
  };
}
