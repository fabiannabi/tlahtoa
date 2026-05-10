import type { Scenario } from '../types.js';
import { EVENTS_SCENARIO_1, EVENTS_SCENARIO_2, EVENTS_SCENARIO_3 } from './events.js';

export const SCENARIOS: Record<1 | 2 | 3, Scenario> = {
  1: {
    id: 'scenario-1',
    nombre: 'La primera cosecha',
    difficulty: 'facil',
    totalCycles: 8,
    initialResources: { maiz: 6, copal: 5, jade: 4, ft: 6, conocimiento: 4 },
    initialDistricts: ['norte', 'sur', 'este', 'oeste', 'centro'],
    diceEnabled: false,
    level2Enabled: false,
    randomCities: false,
    cardDeck: EVENTS_SCENARIO_1,
  },
  2: {
    id: 'scenario-2',
    nombre: 'El año del hambre',
    difficulty: 'normal',
    totalCycles: 9,
    initialResources: { maiz: 3, copal: 4, jade: 3, ft: 5, conocimiento: 3 },
    initialDistricts: ['sur', 'este', 'oeste', 'centro'],
    diceEnabled: true,
    level2Enabled: true,
    randomCities: true,
    cardDeck: EVENTS_SCENARIO_2,
  },
  3: {
    id: 'scenario-3',
    nombre: 'El fin del quinto sol',
    difficulty: 'dificil',
    totalCycles: 10,
    initialResources: { maiz: 4, copal: 3, jade: 2, ft: 4, conocimiento: 2 },
    initialDistricts: ['norte', 'sur', 'centro'],
    diceEnabled: true,
    level2Enabled: true,
    randomCities: true,
    cardDeck: EVENTS_SCENARIO_3,
  },
};
