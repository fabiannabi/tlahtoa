import type { DistrictId, District } from '../types.js';

export const ALL_DISTRICTS: Record<DistrictId, Omit<District, 'active'>> = {
  norte:  { id: 'norte',  nombre: 'Norte — Milpa',        produces: 'maiz'         },
  sur:    { id: 'sur',    nombre: 'Sur — Mercado',         produces: 'jade'         },
  este:   { id: 'este',   nombre: 'Este — Artesanos',      produces: 'ft'           },
  oeste:  { id: 'oeste',  nombre: 'Oeste — Escribas',      produces: 'conocimiento' },
  centro: { id: 'centro', nombre: 'Centro — Templo Mayor', produces: 'copal'        },
};

export const ALL_DISTRICT_IDS: DistrictId[] = ['norte', 'sur', 'este', 'oeste', 'centro'];
