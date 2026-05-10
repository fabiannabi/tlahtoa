import type { GameState, RoleId } from '../types.js';
import { addResource, subtractResource } from './resources.js';

export interface CouncilInput {
  // Who each player nominates for level-up. Empty = no vote.
  progressionVotes: Partial<Record<RoleId, RoleId>>;
  // Which policy option each player picks.
  policyVotes: Partial<Record<RoleId, 'A' | 'B'>>;
}

export function runCouncil(state: GameState, input: CouncilInput): GameState {
  let next = state;

  // ── Votación A: Progresión de nivel ──────────────────────────────────────────
  const tally = new Map<RoleId, number>();
  for (const vote of Object.values(input.progressionVotes)) {
    if (vote) tally.set(vote, (tally.get(vote) ?? 0) + 1);
  }

  let winner: RoleId | null = null;
  let top = 0;
  let tied = false;
  for (const [role, count] of tally) {
    if (count > top) { winner = role; top = count; tied = false; }
    else if (count === top) { tied = true; }
  }

  if (winner && !tied) {
    const target = next.players.find((p) => p.role === winner);
    if (target && target.level < 3) {
      const newLevel = (target.level + 1) as 0 | 1 | 2 | 3;
      next = {
        ...next,
        players: next.players.map((p) =>
          p.role === winner ? { ...p, level: newLevel } : p,
        ),
        log: [
          ...next.log,
          {
            cycle: next.currentCycle,
            phase: 'consejo' as const,
            mensaje: `Progresión: ${winner} sube al nivel ${newLevel}.`,
          },
        ],
      };
    }
  }

  // ── Votación B: Política del ciclo ───────────────────────────────────────────
  // TODO(spec): "+1 Copal por unidad" is ambiguous — could mean flat +1 or
  // +1 per player in majority. Using flat +1 for now; same for "−1 por desacuerdo".
  const policyList = Object.values(input.policyVotes);
  const aCount = policyList.filter((v) => v === 'A').length;
  const bCount = policyList.filter((v) => v === 'B').length;
  const total = aCount + bCount;

  let copalDelta = 0;
  let ftDelta = 0;
  let policyMsg: string;

  if (total === 0) {
    policyMsg = 'Sin votación de política este ciclo.';
  } else if (aCount !== bCount) {
    copalDelta = 1;
    policyMsg = `Política: ${aCount > bCount ? 'Opción A' : 'Opción B'} gana (${aCount}-${bCount}). Copal +1.`;
  } else {
    ftDelta = 1;
    policyMsg = `Política: empate (${aCount}-${bCount}). El General decide. FT −1.`;
  }

  let { resources } = next;
  if (copalDelta > 0) resources = addResource(resources, 'copal', copalDelta);
  if (ftDelta > 0) resources = subtractResource(resources, 'ft', ftDelta);

  return {
    ...next,
    resources,
    activeCycle: { ...next.activeCycle, phase: 'acciones' },
    log: [
      ...next.log,
      { cycle: next.currentCycle, phase: 'consejo' as const, mensaje: policyMsg },
    ],
  };
}
