import type {
  GameState,
  Escenario,
  Barrio,
  BarrioId,
  Recursos,
  Jugador,
  RolId,
  ResourceKind,
} from './types.js';
import { crearRng, barajar } from './rng.js';

const BARRIO_DEF: Record<BarrioId, Pick<Barrio, 'id' | 'nombre' | 'produccion'>> = {
  norte:  { id: 'norte',  nombre: 'Norte — Milpa',        produccion: 'maiz'         },
  sur:    { id: 'sur',    nombre: 'Sur — Mercado',         produccion: 'jade'         },
  este:   { id: 'este',   nombre: 'Este — Artesanos',      produccion: 'ft'           },
  oeste:  { id: 'oeste',  nombre: 'Oeste — Escribas',      produccion: 'conocimiento' },
  centro: { id: 'centro', nombre: 'Centro — Templo Mayor', produccion: 'copal'        },
};

const MAXIMO: Record<ResourceKind, number> = {
  maiz: 10, copal: 8, jade: 6, ft: 8, conocimiento: 8,
};

const BARRIO_IDS: BarrioId[] = ['norte', 'sur', 'este', 'oeste', 'centro'];

const ROLES_FACIL: RolId[] = ['sacerdote', 'general', 'curandera', 'astronomo'];

export function crearPartida(
  escenario: Escenario,
  roles: RolId[] = ROLES_FACIL,
): GameState {
  const rng = crearRng(escenario.seed);

  const ri = escenario.recursosIniciales;
  const recursos: Recursos = {
    maiz:         { valor: ri.maiz,         maximo: MAXIMO.maiz         },
    copal:        { valor: ri.copal,        maximo: MAXIMO.copal        },
    jade:         { valor: ri.jade,         maximo: MAXIMO.jade         },
    ft:           { valor: ri.ft,           maximo: MAXIMO.ft           },
    conocimiento: { valor: ri.conocimiento, maximo: MAXIMO.conocimiento },
  };

  const barrios = Object.fromEntries(
    BARRIO_IDS.map((id) => [
      id,
      { ...BARRIO_DEF[id], activo: escenario.barriosIniciales.includes(id) },
    ]),
  ) as Record<BarrioId, Barrio>;

  const mazoEventos = barajar(escenario.mazoCarta, rng);

  const jugadores: Jugador[] = roles.map((rol) => ({
    rol,
    nivel: 0 as const,
    rama: null,
    cooldown: 0,
    especialUsada: false,
    accionesRestantes: 2,
  }));

  return {
    escenario,
    cicloActual: 1,
    recursos,
    barrios,
    jugadores,
    mazoEventos,
    cicloEnCurso: { numero: 1, fase: 'amanecer', huboRitual: false },
    hayEpidemia: false,
    sitioActivo: null,
    resultado: 'en_curso',
    log: [{ ciclo: 1, fase: 'amanecer', mensaje: 'El consejo se reúne.' }],
  };
}
