export const escenarioFacilResources = {
  Maíz: 5,
  Jade: 3,
  Obsidiana: 4,
  Cacao: 6,
  Plumas: 2,
  Turquesa: 1,
} as const;

export type ResourceKind = keyof typeof escenarioFacilResources;

export function saludoTlahtoa(): string {
  return "¡Bienvenido a Tlahtoa! El juego de las palabras del mundo antiguo.";
}
