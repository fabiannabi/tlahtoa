import type { CartaEvento, Escenario } from '../types.js';

export function saludoTlahtoa(): string {
  return '¡Bienvenido a Tlahtoa! El consejo te espera para gobernar la ciudad-estado.';
}

// ── Mazo escenario fácil ──────────────────────────────────────────────────────
// 8 cartas para 8 ciclos.
// Graves (redadas + sitio): 4 cartas — en partida real van a ciclos 5-8.
// TODO(setup): al barajar, forzar cartas 'redada'/'sitio' a posiciones >= 4.
// Leves (ritual + neutral): 4 cartas — ciclos 1-4.

export const cartasEventoFacil: CartaEvento[] = [
  // Redadas — graves
  {
    id: 'redada-chichimeca',
    nombre: 'Guerreros chichimecas',
    categoria: 'redada',
    danoBase: { ft: 2 },
    efectoSecundario: 'Copal −1 por pánico',
  },
  {
    id: 'redada-emboscada',
    nombre: 'Emboscada en ruta',
    categoria: 'redada',
    danoBase: { jade: 2 },
    efectoSecundario: 'Jade −1 adicional si la ruta estaba en uso',
  },
  {
    id: 'redada-milpa',
    nombre: 'Saqueo de milpa',
    categoria: 'redada',
    danoBase: { maiz: 2 },
    efectoSecundario: 'Barrio norte inactivo 1 ciclo',
  },
  // Sitio — grave
  {
    id: 'sitio-otomi',
    nombre: 'Campamento otomí',
    categoria: 'sitio',
    danoBase: { maiz: 1 },
    efectoSecundario: 'Si no se resuelve: redada automática cada ciclo',
  },
  // Rituales — leves
  {
    id: 'ritual-lluvia',
    nombre: 'Ofrenda de lluvia',
    categoria: 'ritual',
    danoBase: { copal: 1 },
  },
  {
    id: 'ritual-cosecha',
    nombre: 'Ceremonia de la cosecha',
    categoria: 'ritual',
    danoBase: { copal: 1 },
  },
  // Neutrales — leves
  {
    id: 'neutral-sequia',
    nombre: 'Sequía menor',
    categoria: 'neutral',
    danoBase: { maiz: 1 },
  },
  {
    id: 'neutral-tributo',
    nombre: 'Disputa de tributo',
    categoria: 'neutral',
    danoBase: { jade: 1 },
  },
];

export const escenarioFacil: Escenario = {
  id: 'escenario-facil',
  nombre: 'La primera cosecha',
  dificultad: 'facil',
  ciclosTotales: 8,
  recursosIniciales: {
    maiz: 6,
    copal: 5,
    jade: 4,
    ft: 6,
    conocimiento: 4,
  },
  barriosIniciales: ['norte', 'sur', 'este', 'oeste', 'centro'],
  dadoActivo: false,
  nivelDosActivo: false,
  ciudadesAleatorias: false,
  mazoCarta: cartasEventoFacil,
  seed: 20250510,
};
