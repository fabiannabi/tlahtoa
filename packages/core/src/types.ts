// ── Resources ─────────────────────────────────────────────────────────────────

export type ResourceKind = 'maiz' | 'copal' | 'jade' | 'ft' | 'conocimiento';

export interface Resource {
  value: number;
  max: number;
}

export type Resources = Record<ResourceKind, Resource>;

// ── Districts ─────────────────────────────────────────────────────────────────

export type DistrictId = 'norte' | 'sur' | 'este' | 'oeste' | 'centro';

export interface District {
  id: DistrictId;
  nombre: string;
  produces: ResourceKind;
  active: boolean;
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export type RoleId = 'sacerdote' | 'general' | 'comerciante' | 'curandera' | 'astronomo';

export interface Player {
  nombre: string;
  role: RoleId;
  level: 0 | 1 | 2 | 3;
  branch: null | 'A' | 'B';
  cooldown: number;
  specialUsed: boolean;
  actionsLeft: number;
}

// ── Event cards ───────────────────────────────────────────────────────────────

export type EventCategory =
  | 'ritual'
  | 'redada'
  | 'sitio'
  | 'infiltracion'
  | 'epidemia'
  | 'neutral';

export interface EventCard {
  id: string;
  nombre: string;
  category: EventCategory;
  baseDamage: Partial<Record<ResourceKind, number>>;
  secondaryEffect?: string;
}

// ── Active siege ──────────────────────────────────────────────────────────────

export interface Siege {
  card: EventCard;
  phase: 1 | 2;
  cyclesActive: number;
}

// ── Policy cards ──────────────────────────────────────────────────────────────

export interface PolicyCard {
  id: string;
  nombre: string;
  optionA: string;
  optionB: string;
}

// ── Scenario ──────────────────────────────────────────────────────────────────

export type Difficulty = 'facil' | 'normal' | 'dificil';

export interface Scenario {
  id: string;
  nombre: string;
  difficulty: Difficulty;
  totalCycles: number;
  initialResources: Record<ResourceKind, number>;
  initialDistricts: DistrictId[];
  diceEnabled: boolean;
  level2Enabled: boolean;
  randomCities: boolean;
  cardDeck: EventCard[];
}

// ── Active cycle ──────────────────────────────────────────────────────────────

export type CyclePhase =
  | 'amanecer'
  | 'consejo'
  | 'acciones'
  | 'evento'
  | 'consumo'
  | 'completo';

export interface CurrentCycle {
  number: number;
  phase: CyclePhase;
  hadRitual: boolean;
}

// ── Result and log ────────────────────────────────────────────────────────────

export type GameResult = 'en_curso' | 'victoria' | 'derrota';

export interface LogEntry {
  cycle: number;
  phase: CyclePhase;
  mensaje: string;
}

// ── GameState ─────────────────────────────────────────────────────────────────

export interface GameState {
  scenario: Scenario;
  currentCycle: number;
  resources: Resources;
  districts: Record<DistrictId, District>;
  players: Player[];
  eventDeck: EventCard[];
  activeCycle: CurrentCycle;
  hasEpidemic: boolean;
  activeSiege: Siege | null;
  result: GameResult;
  log: LogEntry[];
}
