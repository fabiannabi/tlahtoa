import { describe, it, expect } from 'vitest';
import { addResource, subtractResource, applyDamage, clamp } from '../src/engine/resources.js';
import type { Resources } from '../src/types.js';

const BASE: Resources = {
  maiz:         { value: 5, max: 10 },
  copal:        { value: 3, max: 8  },
  jade:         { value: 4, max: 6  },
  ft:           { value: 6, max: 8  },
  conocimiento: { value: 2, max: 8  },
};

describe('clamp', () => {
  it('returns value within range unchanged', () => expect(clamp(5, 0, 10)).toBe(5));
  it('clamps to max', () => expect(clamp(15, 0, 10)).toBe(10));
  it('clamps to min', () => expect(clamp(-3, 0, 10)).toBe(0));
});

describe('addResource', () => {
  it('adds within range', () => {
    expect(addResource(BASE, 'maiz', 3).maiz.value).toBe(8);
  });
  it('clamps to max', () => {
    expect(addResource(BASE, 'jade', 10).jade.value).toBe(6); // max is 6
  });
  it('does not change max', () => {
    expect(addResource(BASE, 'maiz', 3).maiz.max).toBe(10);
  });
  it('does not affect other resources', () => {
    const r = addResource(BASE, 'maiz', 1);
    expect(r.copal.value).toBe(BASE.copal.value);
    expect(r.jade.value).toBe(BASE.jade.value);
  });
  it('adding 0 is a no-op', () => {
    expect(addResource(BASE, 'ft', 0).ft.value).toBe(6);
  });
  it('negative amount decreases (floors at 0)', () => {
    expect(addResource(BASE, 'copal', -10).copal.value).toBe(0);
  });
});

describe('subtractResource', () => {
  it('subtracts within range', () => {
    expect(subtractResource(BASE, 'maiz', 2).maiz.value).toBe(3);
  });
  it('clamps to 0 (never negative)', () => {
    expect(subtractResource(BASE, 'ft', 999).ft.value).toBe(0);
  });
  it('subtracting 0 is a no-op', () => {
    expect(subtractResource(BASE, 'maiz', 0).maiz.value).toBe(5);
  });
  it('exact depletion to 0', () => {
    expect(subtractResource(BASE, 'copal', 3).copal.value).toBe(0);
  });
});

describe('applyDamage', () => {
  it('applies damage to multiple resources', () => {
    const r = applyDamage(BASE, { maiz: 2, copal: 1 });
    expect(r.maiz.value).toBe(3);
    expect(r.copal.value).toBe(2);
  });
  it('does not affect resources not in damage map', () => {
    const r = applyDamage(BASE, { jade: 1 });
    expect(r.maiz.value).toBe(BASE.maiz.value);
    expect(r.ft.value).toBe(BASE.ft.value);
  });
  it('floors at 0, never negative', () => {
    expect(applyDamage(BASE, { jade: 100 }).jade.value).toBe(0);
  });
  it('skips undefined values in partial damage map', () => {
    const partial: Partial<Record<'maiz' | 'copal' | 'jade' | 'ft' | 'conocimiento', number>> = { maiz: 2 };
    const r = applyDamage(BASE, partial);
    expect(r.maiz.value).toBe(3);
    expect(r.copal.value).toBe(3);
  });
  it('empty damage map returns equivalent state', () => {
    const r = applyDamage(BASE, {});
    expect(r.maiz.value).toBe(BASE.maiz.value);
    expect(r.ft.value).toBe(BASE.ft.value);
  });
});
