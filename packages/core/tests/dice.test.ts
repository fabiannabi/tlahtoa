import { describe, it, expect } from 'vitest';
import { applyDiceResult } from '../src/engine/dice.js';

const base4_2 = { maiz: 4, ft: 2 };

describe('applyDiceResult', () => {
  describe('roll 1 — Catástrofe (×2)', () => {
    it('doubles every resource', () => {
      const r = applyDiceResult(1, base4_2);
      expect(r.maiz).toBe(8);
      expect(r.ft).toBe(4);
    });
    it('doubles single resource', () => {
      expect(applyDiceResult(1, { jade: 3 }).jade).toBe(6);
    });
  });

  describe('roll 2 — Grave (×1.5 rounded up)', () => {
    it('exact multiplication', () => {
      expect(applyDiceResult(2, { maiz: 4 }).maiz).toBe(6); // 4*1.5 = 6
    });
    it('rounds up for odd base', () => {
      expect(applyDiceResult(2, { maiz: 3 }).maiz).toBe(5); // ceil(4.5) = 5
    });
    it('rounds up for base 1', () => {
      expect(applyDiceResult(2, { copal: 1 }).copal).toBe(2); // ceil(1.5) = 2
    });
  });

  describe('roll 3 — Normal (base damage)', () => {
    it('returns base unchanged', () => {
      const r = applyDiceResult(3, base4_2);
      expect(r.maiz).toBe(4);
      expect(r.ft).toBe(2);
    });
  });

  describe('roll 4 — Leve (−1 per resource, min 1)', () => {
    it('reduces by 1', () => {
      const r = applyDiceResult(4, base4_2);
      expect(r.maiz).toBe(3);
      expect(r.ft).toBe(1);
    });
    it('clamps to minimum 1 when base is 1', () => {
      expect(applyDiceResult(4, { jade: 1 }).jade).toBe(1);
    });
    it('clamps to minimum 1 when base is 2', () => {
      expect(applyDiceResult(4, { copal: 2 }).copal).toBe(1);
    });
  });

  describe('roll 5 — Menor (/2 rounded up)', () => {
    it('halves and rounds up odd base', () => {
      expect(applyDiceResult(5, { maiz: 3 }).maiz).toBe(2); // ceil(1.5) = 2
    });
    it('halves even base exactly', () => {
      expect(applyDiceResult(5, { maiz: 4 }).maiz).toBe(2);
    });
    it('base 1 → 1 (ceil(0.5) = 1)', () => {
      expect(applyDiceResult(5, { ft: 1 }).ft).toBe(1);
    });
  });

  describe('roll 6 — Desviado (no damage, no bonus)', () => {
    it('returns empty object', () => {
      const r = applyDiceResult(6, base4_2);
      expect(Object.keys(r).length).toBe(0);
    });
    it('returns empty even for large base', () => {
      expect(Object.keys(applyDiceResult(6, { maiz: 10 })).length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('skips resources with 0 base damage', () => {
      const r = applyDiceResult(1, { maiz: 0, jade: 2 });
      expect(r.maiz).toBeUndefined();
      expect(r.jade).toBe(4);
    });
    it('multi-resource damage on roll 1', () => {
      const r = applyDiceResult(1, { maiz: 2, copal: 3, ft: 1 });
      expect(r.maiz).toBe(4);
      expect(r.copal).toBe(6);
      expect(r.ft).toBe(2);
    });
  });
});
