import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/setup.js';
import { runPhase } from '../src/engine/phases.js';

const BASE_OPTS = {
  scenarioId: 1 as const,
  jugadores: [
    { nombre: 'P1', role: 'sacerdote' as const },
    { nombre: 'P2', role: 'general' as const },
    { nombre: 'P3', role: 'curandera' as const },
    { nombre: 'P4', role: 'astronomo' as const },
  ],
  seed: 1,
};

describe('runDawn — district production', () => {
  it('advances phase from amanecer to consejo', () => {
    const state = createInitialState(BASE_OPTS);
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.activeCycle.phase).toBe('consejo');
  });

  it('adds +1 Maíz from Norte when active', () => {
    const state = createInitialState(BASE_OPTS); // norte always active in scenario 1
    const before = state.resources.maiz.value;
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.resources.maiz.value).toBe(before + 1);
  });

  it('adds +1 Jade from Sur when active', () => {
    const state = createInitialState(BASE_OPTS);
    const before = state.resources.jade.value;
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.resources.jade.value).toBe(before + 1);
  });

  it('adds +1 FT from Este when active', () => {
    const state = createInitialState(BASE_OPTS);
    const before = state.resources.ft.value;
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.resources.ft.value).toBe(before + 1);
  });

  it('adds +1 Conocimiento from Oeste when active', () => {
    const state = createInitialState(BASE_OPTS);
    const before = state.resources.conocimiento.value;
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.resources.conocimiento.value).toBe(before + 1);
  });

  it('does not add Copal from Centro at dawn (only on ritual)', () => {
    const state = createInitialState(BASE_OPTS);
    const before = state.resources.copal.value;
    const next = runPhase(state, { phase: 'amanecer' });
    expect(next.resources.copal.value).toBe(before); // unchanged
  });

  it('does not produce from inactive district', () => {
    // Scenario 2 starts without Norte
    const state = createInitialState({ ...BASE_OPTS, scenarioId: 2 });
    expect(state.districts.norte.active).toBe(false);
    const before = state.resources.maiz.value;
    const next = runPhase(state, { phase: 'amanecer' });
    // Norte is inactive so no +1 Maíz from it (other active districts still produce)
    expect(next.resources.maiz.value).toBe(before);
  });

  it('logs production message', () => {
    const state = createInitialState(BASE_OPTS);
    const next = runPhase(state, { phase: 'amanecer' });
    const lastLog = next.log[next.log.length - 1];
    expect(lastLog.mensaje).toContain('Producción');
    expect(lastLog.mensaje).toContain('maiz +1');
  });

  it('caps resources at max', () => {
    // Scenario 1 initial FT is 6, max is 8 — production adds 1 → 7, still under cap
    // To test cap: start with FT at max (8) via a manipulated state
    const state = createInitialState(BASE_OPTS);
    const capped = {
      ...state,
      resources: { ...state.resources, ft: { value: 8, max: 8 } },
    };
    const next = runPhase(capped, { phase: 'amanecer' });
    expect(next.resources.ft.value).toBe(8); // clamped at max
  });
});
