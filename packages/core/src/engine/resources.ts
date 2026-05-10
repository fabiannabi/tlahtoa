import type { Resources, ResourceKind } from '../types.js';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function addResource(
  resources: Resources,
  kind: ResourceKind,
  amount: number,
): Resources {
  const r = resources[kind];
  return { ...resources, [kind]: { ...r, value: clamp(r.value + amount, 0, r.max) } };
}

export function subtractResource(
  resources: Resources,
  kind: ResourceKind,
  amount: number,
): Resources {
  return addResource(resources, kind, -amount);
}

export function applyDamage(
  resources: Resources,
  damage: Partial<Record<ResourceKind, number>>,
): Resources {
  let result = resources;
  for (const [k, v] of Object.entries(damage) as [ResourceKind, number | undefined][]) {
    if (v !== undefined && v > 0) result = subtractResource(result, k, v);
  }
  return result;
}
