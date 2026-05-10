import { describe, it, expect } from 'vitest';
import { checkWinConditions } from '../src/engine/win-conditions.js';
import { createInitialState } from '../src/setup.js';
import type { GameState } from '../src/types.js';

function base(scenarioId: 1 | 2 | 3 = 1): GameState {
  return createInitialState({
    scenarioId,
    jugadores: [
      { nombre: 'P1', role: 'sacerdote' },
      { nombre: 'P2', role: 'general' },
      { nombre: 'P3', role: 'curandera' },
      { nombre: 'P4', role: 'astronomo' },
    ],
    seed: 1,
  });
}

describe('checkWinConditions', () => {
  it('returns en_curso for a normal mid-game state', () => {
    expect(checkWinConditions(base()).result).toBe('en_curso');
  });

  it('copal = 0 → derrota (universal)', () => {
    const s = { ...base(), resources: { ...base().resources, copal: { value: 0, max: 8 } } };
    const r = checkWinConditions(s);
    expect(r.result).toBe('derrota');
    expect(r.reason).toContain('Copal');
  });

  it('copal = 0 → reason string is non-empty', () => {
    const s = { ...base(), resources: { ...base().resources, copal: { value: 0, max: 8 } } };
    expect(checkWinConditions(s).reason).toBeTruthy();
  });

  describe('facil (scenario 1)', () => {
    it('consecutiveMaizZero = 1 → still en_curso', () => {
      const s = { ...base(), consecutiveMaizZero: 1 };
      expect(checkWinConditions(s).result).toBe('en_curso');
    });

    it('consecutiveMaizZero = 2 → derrota with reason', () => {
      const s = { ...base(), consecutiveMaizZero: 2 };
      const r = checkWinConditions(s);
      expect(r.result).toBe('derrota');
      expect(r.reason).toContain('dos ciclos');
    });

    it('3+ inactive districts → derrota', () => {
      const s: GameState = {
        ...base(),
        districts: {
          ...base().districts,
          norte:  { ...base().districts.norte,  active: false },
          sur:    { ...base().districts.sur,    active: false },
          este:   { ...base().districts.este,   active: false },
        },
      };
      const r = checkWinConditions(s);
      expect(r.result).toBe('derrota');
      expect(r.reason).toContain('barrios');
    });

    it('greatMilpaCompleted = true → victoria', () => {
      const s = { ...base(), greatMilpaCompleted: true };
      expect(checkWinConditions(s).result).toBe('victoria');
    });

    it('currentCycle > totalCycles without milpa → derrota', () => {
      const s = { ...base(), currentCycle: 9 }; // totalCycles = 8
      const r = checkWinConditions(s);
      expect(r.result).toBe('derrota');
      expect(r.reason).toContain('Gran Milpa');
    });

    it('does not trigger maiz=0 derrota on first zero (consecutive < 2)', () => {
      const s: GameState = {
        ...base(),
        resources: { ...base().resources, maiz: { value: 0, max: 10 } },
        consecutiveMaizZero: 1,
      };
      expect(checkWinConditions(s).result).toBe('en_curso');
    });
  });

  describe('normal (scenario 2)', () => {
    it('maiz = 0 → derrota immediately', () => {
      const s = { ...base(2), resources: { ...base(2).resources, maiz: { value: 0, max: 10 } } };
      expect(checkWinConditions(s).result).toBe('derrota');
    });

    it('2+ inactive districts → derrota', () => {
      const s: GameState = {
        ...base(2),
        districts: {
          ...base(2).districts,
          sur:  { ...base(2).districts.sur,  active: false },
          este: { ...base(2).districts.este, active: false },
        },
      };
      expect(checkWinConditions(s).result).toBe('derrota');
    });

    it('currentCycle > totalCycles → victoria', () => {
      const s = { ...base(2), currentCycle: 10 }; // totalCycles = 9
      expect(checkWinConditions(s).result).toBe('victoria');
    });
  });

  it('passes through already-set result without rechecking', () => {
    const s = { ...base(), result: 'derrota' as const };
    expect(checkWinConditions(s).result).toBe('derrota');
  });
});
