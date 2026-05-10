import type { ResourceKind, Difficulty } from '../types.js';

export interface Trade {
  gives: Partial<Record<ResourceKind, number>>;
  gets: Partial<Record<ResourceKind, number>>;
}

export interface AlliedCity {
  id: string;
  nombre: string;
  position: 'norte' | 'sur' | 'este' | 'oeste' | 'variable';
  trade: Trade;
  condition?: string;
  onlyInDifficulty?: Difficulty;
}

export const CIUDADES_FIJAS: AlliedCity[] = [
  {
    id: 'teotihuacan',
    nombre: 'Teotihuacan',
    position: 'norte',
    trade: { gives: { jade: 1 }, gets: { maiz: 2 } },
    condition: 'Si Conocimiento ≥ 4: 1 Jade → 3 Maíz',
  },
  {
    id: 'monte-alban',
    nombre: 'Monte Albán',
    position: 'sur',
    trade: { gives: { maiz: 2 }, gets: { conocimiento: 1 } },
    condition: 'Si Copal ≥ 3: también 1 Maíz → 1 Copal (1×/ciclo)',
  },
];

export const MAZO_CIUDADES_ALEATORIAS: AlliedCity[] = [
  {
    id: 'cholula',
    nombre: 'Cholula',
    position: 'variable',
    trade: { gives: { copal: 1 }, gets: { ft: 2 } },
    condition: 'Se bloquea con evento de ciudad rival',
  },
  {
    id: 'tula',
    nombre: 'Tula',
    position: 'variable',
    trade: { gives: { jade: 1 }, gets: { maiz: 1, conocimiento: 1 } },
  },
  {
    id: 'mitla',
    nombre: 'Mitla',
    position: 'variable',
    trade: { gives: { ft: 1 }, gets: { conocimiento: 2 } },
    condition: 'Solo activa si FT ≥ 4',
  },
  {
    id: 'xochicalco',
    nombre: 'Xochicalco',
    position: 'variable',
    trade: { gives: { jade: 2 }, gets: { maiz: 3, copal: 1 } },
    condition: 'Sin evento militar ese ciclo',
  },
  {
    id: 'el-tajin',
    nombre: 'El Tajín',
    position: 'variable',
    trade: { gives: {}, gets: {} },
    condition: 'Chip aleatorio: ×0.5 / ×1 / ×1.5 / ×2 del intercambio base',
  },
  {
    id: 'palenque',
    nombre: 'Palenque',
    position: 'variable',
    trade: { gives: { copal: 1 }, gets: { jade: 1 } },
    condition: 'Solo si el Sacerdote realizó ritual ese ciclo',
  },
  {
    id: 'tenochtitlan',
    nombre: 'Tenochtitlan',
    position: 'variable',
    trade: { gives: { ft: 1 }, gets: { jade: 1, maiz: 1 } },
    condition: 'Inactiva los primeros 3 ciclos',
  },
  {
    id: 'cantona',
    nombre: 'Cantona',
    position: 'sur',
    trade: { gives: {}, gets: {} },
    condition: 'Genera evento de ciudad rival cada 3 ciclos. Primer evento en ciclo 4.',
    onlyInDifficulty: 'dificil',
  },
];
