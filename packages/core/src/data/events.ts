import type { EventCard } from '../types.js';

// ── Shared pool ───────────────────────────────────────────────────────────────

const REDADAS_BASE: EventCard[] = [
  {
    id: 'redada-chichimeca',
    nombre: 'Guerreros chichimecas',
    category: 'redada',
    baseDamage: { ft: 2 },
    secondaryEffect: 'Copal −1 por pánico',
  },
  {
    id: 'redada-emboscada',
    nombre: 'Emboscada en ruta',
    category: 'redada',
    baseDamage: { jade: 2 },
    secondaryEffect: 'Jade −1 adicional si la ruta estaba en uso',
  },
  {
    id: 'redada-milpa',
    nombre: 'Saqueo de milpa',
    category: 'redada',
    baseDamage: { maiz: 2 },
    secondaryEffect: 'Barrio norte inactivo 1 ciclo',
  },
];

const REDADAS_NORMAL: EventCard[] = [
  ...REDADAS_BASE,
  {
    id: 'redada-otomies',
    nombre: 'Guerreros otomíes',
    category: 'redada',
    baseDamage: { ft: 2 },
    secondaryEffect: 'Maíz −1 por saqueo menor',
  },
  {
    id: 'redada-mercado',
    nombre: 'Incendio del mercado',
    category: 'redada',
    baseDamage: { jade: 2 },
    secondaryEffect: 'Barrio sur inactivo 1 ciclo',
  },
];

const REDADAS_DIFICIL: EventCard[] = [
  ...REDADAS_NORMAL,
  {
    id: 'redada-nocturna',
    nombre: 'Asalto nocturno',
    category: 'redada',
    baseDamage: { maiz: 2, ft: 1 },
    secondaryEffect: 'Sin posibilidad de respuesta del General ese ciclo',
  },
  {
    id: 'redada-campos',
    nombre: 'Quema de campos',
    category: 'redada',
    baseDamage: { maiz: 3 },
    secondaryEffect: 'Barrio norte inactivo 2 ciclos',
  },
];

const SITIOS_BASE: EventCard[] = [
  {
    id: 'sitio-otomi',
    nombre: 'Campamento otomí',
    category: 'sitio',
    baseDamage: { maiz: 1 },
    secondaryEffect: 'Si no se resuelve: redada automática cada ciclo',
  },
];

const SITIOS_NORMAL: EventCard[] = [
  ...SITIOS_BASE,
  {
    id: 'sitio-purepecha',
    nombre: 'Ejército purépecha',
    category: 'sitio',
    baseDamage: { copal: 1 },
    secondaryEffect: 'Rutas este y oeste bloqueadas. Fase 2: FT −2/ciclo, barrio en pánico',
  },
];

const SITIOS_DIFICIL: EventCard[] = [
  ...SITIOS_NORMAL,
  {
    id: 'sitio-asedio-total',
    nombre: 'Asedio total',
    category: 'sitio',
    baseDamage: { ft: 2, conocimiento: 1 },
    secondaryEffect: 'Fase 2: todos los barrios producen −1. Solo el General en nivel 2A puede resolverlo.',
  },
];

const INFILTRACIONES: EventCard[] = [
  {
    id: 'infiltracion-tlaxcaltecas',
    nombre: 'Espías tlaxcaltecas',
    category: 'infiltracion',
    baseDamage: {},
    secondaryEffect: 'El voto del próximo consejo se invierte si no se detectan',
  },
  {
    id: 'infiltracion-mayas',
    nombre: 'Comerciantes mayas',
    category: 'infiltracion',
    baseDamage: { conocimiento: 1 },
    secondaryEffect: 'Conocimiento −1/ciclo sin que el marcador sea visible hasta fin de ciclo',
  },
];

const LEVES_RITUAL: EventCard[] = [
  {
    id: 'ritual-lluvia',
    nombre: 'Ofrenda de lluvia',
    category: 'ritual',
    baseDamage: { copal: 1 },
  },
  {
    id: 'ritual-cosecha',
    nombre: 'Ceremonia de la cosecha',
    category: 'ritual',
    baseDamage: { copal: 1 },
  },
];

const LEVES_NEUTRAL: EventCard[] = [
  {
    id: 'neutral-sequia',
    nombre: 'Sequía menor',
    category: 'neutral',
    baseDamage: { maiz: 1 },
  },
  {
    id: 'neutral-tributo',
    nombre: 'Disputa de tributo',
    category: 'neutral',
    baseDamage: { jade: 1 },
  },
];

// ── Decks per scenario ────────────────────────────────────────────────────────
// Leves van primero en el array — setup los ubica en ciclos 1-4 al barajar.
// TODO(setup): forzar cartas graves a posiciones >= 4 en la baraja.

export const EVENTS_SCENARIO_1: EventCard[] = [
  ...LEVES_RITUAL,
  ...LEVES_NEUTRAL,
  ...REDADAS_BASE,
  ...SITIOS_BASE,
];

export const EVENTS_SCENARIO_2: EventCard[] = [
  { id: 'neutral-sequia-temp', nombre: 'Sequía de temporada', category: 'neutral', baseDamage: { maiz: 1 } },
  ...REDADAS_NORMAL,
  ...SITIOS_NORMAL,
  INFILTRACIONES[0]!,
];

// 12 cartas para 10 ciclos — en partidas cortas no todas se revelan.
// TODO(design): decidir si el mazo tiene más cartas que ciclos o si se filtra.
export const EVENTS_SCENARIO_3: EventCard[] = [
  ...REDADAS_DIFICIL,
  ...SITIOS_DIFICIL,
  ...INFILTRACIONES,
];
