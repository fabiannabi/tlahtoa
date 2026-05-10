// ── Recursos ─────────────────────────────────────────────────────────────────

export type ResourceKind = 'maiz' | 'copal' | 'jade' | 'ft' | 'conocimiento';

export interface Recurso {
  valor: number;
  maximo: number;
}

export type Recursos = Record<ResourceKind, Recurso>;

// ── Barrios ───────────────────────────────────────────────────────────────────

export type BarrioId = 'norte' | 'sur' | 'este' | 'oeste' | 'centro';

export interface Barrio {
  id: BarrioId;
  nombre: string;
  produccion: ResourceKind;
  activo: boolean;
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export type RolId = 'sacerdote' | 'general' | 'comerciante' | 'curandera' | 'astronomo';

export interface Jugador {
  rol: RolId;
  nivel: 0 | 1 | 2 | 3;
  rama: null | 'A' | 'B';
  cooldown: number;
  especialUsada: boolean;
  accionesRestantes: number;
}

// ── Cartas de evento ──────────────────────────────────────────────────────────

export type CategoriaEvento =
  | 'ritual'
  | 'redada'
  | 'sitio'
  | 'infiltracion'
  | 'epidemia'
  | 'neutral';

export interface CartaEvento {
  id: string;
  nombre: string;
  categoria: CategoriaEvento;
  danoBase: Partial<Record<ResourceKind, number>>;
  efectoSecundario?: string;
}

// ── Sitio prolongado ──────────────────────────────────────────────────────────

export interface Sitio {
  carta: CartaEvento;
  fase: 1 | 2;
  ciclosActivo: number;
}

// ── Escenario ─────────────────────────────────────────────────────────────────

export type Dificultad = 'facil' | 'normal' | 'dificil';

export interface Escenario {
  id: string;
  nombre: string;
  dificultad: Dificultad;
  ciclosTotales: number;
  recursosIniciales: Record<ResourceKind, number>;
  barriosIniciales: BarrioId[];
  dadoActivo: boolean;
  nivelDosActivo: boolean;
  ciudadesAleatorias: boolean;
  mazoCarta: CartaEvento[];
  seed: number;
}

// ── Ciclo en curso ────────────────────────────────────────────────────────────

export type FaseCiclo =
  | 'amanecer'
  | 'consejo'
  | 'acciones'
  | 'evento'
  | 'consumo'
  | 'completo';

export interface CicloEnCurso {
  numero: number;
  fase: FaseCiclo;
  huboRitual: boolean;
}

// ── Resultado y log ───────────────────────────────────────────────────────────

export type ResultadoPartida = 'en_curso' | 'victoria' | 'derrota';

export interface EntradaLog {
  ciclo: number;
  fase: FaseCiclo;
  mensaje: string;
}

// ── GameState principal ───────────────────────────────────────────────────────

export interface GameState {
  escenario: Escenario;
  cicloActual: number;
  recursos: Recursos;
  barrios: Record<BarrioId, Barrio>;
  jugadores: Jugador[];
  mazoEventos: CartaEvento[];
  cicloEnCurso: CicloEnCurso;
  hayEpidemia: boolean;
  sitioActivo: Sitio | null;
  resultado: ResultadoPartida;
  log: EntradaLog[];
}
