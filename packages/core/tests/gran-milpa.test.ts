import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/setup.js';
import { runPhase } from '../src/engine/phases.js';
import type { GameState } from '../src/types.js';

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

// Build a state ready to accept acciones phase, with resources set to given values
function stateReadyForActions(overrides: Partial<GameState['resources']> & {} = {}): GameState {
  const base = createInitialState(BASE_OPTS);
  return {
    ...base,
    activeCycle: { ...base.activeCycle, phase: 'acciones' },
    resources: {
      maiz:         { value: 7, max: 10 },
      copal:        { value: 5, max: 8  },
      jade:         { value: 5, max: 6  },
      ft:           { value: 5, max: 8  },
      conocimiento: { value: 6, max: 8  },
      ...overrides,
    },
  };
}

const GRAN_MILPA_ACTION = { phase: 'acciones' as const, actions: [{ role: 'sacerdote', action: 'gran_milpa' as const }] };

describe('gran_milpa action', () => {
  it('succeeds with all conditions met', () => {
    const state = stateReadyForActions();
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(true);
    expect(next.resources.maiz.value).toBe(4);   // 7 − 3
    expect(next.resources.jade.value).toBe(3);   // 5 − 2
  });

  it('success triggers victoria result', () => {
    const state = stateReadyForActions();
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.result).toBe('victoria');
  });

  it('logs success message', () => {
    const state = stateReadyForActions();
    const next = runPhase(state, GRAN_MILPA_ACTION);
    const msgs = next.log.map((e) => e.mensaje);
    expect(msgs.some((m) => m.includes('Gran Milpa completada'))).toBe(true);
  });

  it('fails if Conocimiento < 5', () => {
    const state = stateReadyForActions({ conocimiento: { value: 4, max: 8 } });
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(false);
    expect(next.result).toBe('en_curso');
  });

  it('fails if FT < 4', () => {
    const state = stateReadyForActions({ ft: { value: 3, max: 8 } });
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(false);
    expect(next.result).toBe('en_curso');
  });

  it('fails if Maíz < 3', () => {
    const state = stateReadyForActions({ maiz: { value: 2, max: 10 } });
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(false);
  });

  it('fails if Jade < 2', () => {
    const state = stateReadyForActions({ jade: { value: 1, max: 6 } });
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(false);
  });

  it('fails on non-facil scenario', () => {
    const base = createInitialState({ ...BASE_OPTS, scenarioId: 2 });
    const state: GameState = {
      ...base,
      activeCycle: { ...base.activeCycle, phase: 'acciones' },
      resources: { maiz: { value: 7, max: 10 }, copal: { value: 5, max: 8 }, jade: { value: 5, max: 6 }, ft: { value: 5, max: 8 }, conocimiento: { value: 6, max: 8 } },
    };
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.greatMilpaCompleted).toBe(false);
  });

  it('fails if already completed', () => {
    const state: GameState = { ...stateReadyForActions(), greatMilpaCompleted: true };
    const maizBefore = state.resources.maiz.value;
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.resources.maiz.value).toBe(maizBefore); // no resources spent
  });

  it('does not affect Copal or FT resources on success', () => {
    const state = stateReadyForActions();
    const next = runPhase(state, GRAN_MILPA_ACTION);
    expect(next.resources.copal.value).toBe(state.resources.copal.value);
    expect(next.resources.ft.value).toBe(state.resources.ft.value);
  });
});
