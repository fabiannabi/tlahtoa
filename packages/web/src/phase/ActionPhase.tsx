import { useState } from 'react';
import {
  DndContext, useDraggable, useDroppable,
  PointerSensor, KeyboardSensor, useSensors, useSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { GameState, PhaseInput, RoleId, DistrictId } from '@tlahtoa/core';
import {
  MilpaGlyph, MercadoGlyph, ArtesanosGlyph, EscribasGlyph, TemploGlyph,
} from '../glyphs/index';

// ── Data ──────────────────────────────────────────────────────────────────────

type ActionType = 'cultivar' | 'construir' | 'estudiar' | 'ritual' | 'comerciar' | 'pasar' | 'gran_milpa';

const DISTRICT_ACTION: Record<DistrictId, ActionType> = {
  norte: 'cultivar', sur: 'comerciar', este: 'construir', oeste: 'estudiar', centro: 'ritual',
};

const ACTION_DESC: Record<ActionType, string> = {
  cultivar: '+2 Maíz', construir: '+1 FT', estudiar: '+1 Conoc.',
  ritual: '+1 Copal', comerciar: 'Rutas', pasar: 'Sin acción',
  gran_milpa: 'Maíz −3, Jade −2',
};

const GLYPH_BARRIO = {
  norte: MilpaGlyph, sur: MercadoGlyph, este: ArtesanosGlyph,
  oeste: EscribasGlyph, centro: TemploGlyph,
} as const;

const ROLE_COLOR: Record<RoleId, string> = {
  sacerdote: '#d4a373', general: '#e07060', comerciante: '#c39bd3',
  curandera: '#7fb069', astronomo: '#5dade2',
};

const ROLE_SHORT: Record<RoleId, string> = {
  sacerdote: 'S', general: 'G', comerciante: 'C', curandera: 'K', astronomo: 'A',
};

// ── Draggable token ───────────────────────────────────────────────────────────

interface TokenId { role: RoleId; slot: 1 | 2 }

function tokenKey(t: TokenId) { return `${t.role}-${t.slot}`; }

function ActionToken({ token, player, assigned }: {
  token: TokenId;
  player: { nombre: string; role: RoleId };
  assigned: boolean;
}) {
  const id = tokenKey(token);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: token,
    disabled: assigned,
  });

  const style = isDragging
    ? { transform: CSS.Transform.toString(transform), opacity: 0.35, zIndex: 50 }
    : { transform: CSS.Transform.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`action-token ${assigned ? 'token-assigned' : ''} ${isDragging ? 'token-dragging' : ''}`}
      aria-label={`Ficha de acción de ${player.nombre}${assigned ? ' (ya asignada)' : ''}`}
      aria-grabbed={isDragging}
    >
      <span
        className="token-circle"
        style={{ background: ROLE_COLOR[token.role] }}
        aria-hidden="true"
      >
        {ROLE_SHORT[token.role]}
      </span>
      <span className="token-label">{player.nombre.split(' ')[1] ?? player.nombre}</span>
    </div>
  );
}

// ── Droppable district zone ───────────────────────────────────────────────────

function DistrictZone({ district, action, assignedTokens, onUnassign, canGranMilpa }: {
  district: { id: DistrictId; nombre: string; active: boolean };
  action: ActionType;
  assignedTokens: TokenId[];
  onUnassign: (key: string) => void;
  canGranMilpa?: boolean;
}) {
  const [pulsing, setPulsing] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: district.id });

  const prevLen = assignedTokens.length;

  // Trigger glyph pulse when a token lands
  const handlePulse = () => {
    if (assignedTokens.length > prevLen) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 320);
    }
  };
  void handlePulse; // pulse is triggered by key changes instead

  const GlyphComp = GLYPH_BARRIO[district.id];
  const fallen = !district.active;
  const glowClass = isOver
    ? fallen ? 'zone-over-fallen' : 'zone-over'
    : '';

  return (
    <div
      ref={setNodeRef}
      className={`district-zone ${fallen ? 'zone-fallen' : ''} ${glowClass}`}
      aria-label={`Barrio ${district.nombre}, ${fallen ? 'caído' : 'activo'}, acción: ${ACTION_DESC[action]}`}
      aria-dropeffect="move"
    >
      <span className={`zone-glyph ${pulsing ? 'anim-pulse' : ''}`} aria-hidden="true">
        <GlyphComp size={32} color={fallen ? 'var(--muted)' : 'var(--jade)'} />
      </span>
      <span className="zone-name">{district.nombre}</span>
      <span className="zone-action">{ACTION_DESC[action]}</span>
      {fallen && <span className="zone-fallen-badge">Caído → pasar</span>}
      {district.id === 'centro' && canGranMilpa && (
        <span className="zone-milpa-hint">o Gran Milpa ✦</span>
      )}
      {assignedTokens.length > 0 && (
        <div className="zone-tokens">
          {assignedTokens.map((t) => (
            <button
              key={tokenKey(t)}
              className="zone-token-chip"
              style={{ background: ROLE_COLOR[t.role] }}
              onClick={() => onUnassign(tokenKey(t))}
              title="Quitar asignación"
              aria-label={`Quitar ficha de ${t.role} de este barrio`}
            >
              {ROLE_SHORT[t.role]} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pasar zone ────────────────────────────────────────────────────────────────

function PasarZone({ assignedTokens, onUnassign }: {
  assignedTokens: TokenId[];
  onUnassign: (key: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pasar' });
  return (
    <div
      ref={setNodeRef}
      className={`district-zone zone-pasar ${isOver ? 'zone-over' : ''}`}
      aria-label="Zona de pasar: acción libre"
      aria-dropeffect="move"
    >
      <span className="zone-name">— Pasar —</span>
      <span className="zone-action">Sin acción</span>
      {assignedTokens.map((t) => (
        <button
          key={tokenKey(t)}
          className="zone-token-chip"
          style={{ background: ROLE_COLOR[t.role] }}
          onClick={() => onUnassign(tokenKey(t))}
          aria-label={`Quitar ficha de ${t.role}`}
        >
          {ROLE_SHORT[t.role]} ×
        </button>
      ))}
    </div>
  );
}

// ── Main ActionPhase ──────────────────────────────────────────────────────────

interface Props {
  state: GameState;
  onPhase: (input: PhaseInput) => void;
}

export function ActionPhase({ state, onPhase }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const canGranMilpa =
    state.scenario.difficulty === 'facil' &&
    !state.greatMilpaCompleted &&
    state.resources.conocimiento.value >= 5 &&
    state.resources.ft.value >= 4 &&
    state.resources.maiz.value >= 3 &&
    state.resources.jade.value >= 2;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const token = active.data.current as TokenId;
    const targetId = over.id as string;
    setAssignments((prev) => ({ ...prev, [tokenKey(token)]: targetId }));

    const targetName =
      targetId === 'pasar' ? 'zona de pasar'
      : state.districts[targetId as DistrictId]?.nombre ?? targetId;
    const actionType =
      targetId === 'pasar' ? 'pasar'
      : DISTRICT_ACTION[targetId as DistrictId] ?? 'pasar';
    setAnnouncement(`Acción de ${actionType} asignada en ${targetName}`);
  }

  function handleUnassign(key: string) {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleConfirm() {
    const actions = state.players.flatMap((p) =>
      ([1, 2] as const).map((slot) => {
        const key = tokenKey({ role: p.role, slot });
        const target = assignments[key];
        const districtAction =
          !target || target === 'pasar'
            ? 'pasar' as const
            : state.districts[target as DistrictId]?.active
              ? DISTRICT_ACTION[target as DistrictId]
              : ('pasar' as const);
        return { role: p.role, action: districtAction };
      }),
    );
    onPhase({ phase: 'acciones', actions });
    setAssignments({});
  }

  function handleGranMilpa() {
    onPhase({
      phase: 'acciones',
      actions: [{ role: state.players[0].role, action: 'gran_milpa' }],
    });
  }

  const tokens: TokenId[] = state.players.flatMap((p) =>
    ([1, 2] as const).map((slot) => ({ role: p.role, slot })),
  );

  const tokensForZone = (zoneId: string) =>
    tokens.filter((t) => assignments[tokenKey(t)] === zoneId);

  const allAssigned = tokens.every((t) => assignments[tokenKey(t)] !== undefined);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {/* sr-only live region for accessibility */}
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>

      <section className="action-phase" aria-label="Fase de acciones">
        <h2 className="phase-heading">Acciones del consejo</h2>

        {/* District drop zones */}
        <div className="action-districts" role="group" aria-label="Barrios disponibles">
          {(Object.values(state.districts)).map((d) => (
            <DistrictZone
              key={d.id}
              district={d}
              action={DISTRICT_ACTION[d.id]}
              assignedTokens={tokensForZone(d.id)}
              onUnassign={handleUnassign}
              canGranMilpa={canGranMilpa && d.id === 'centro'}
            />
          ))}
          <PasarZone
            assignedTokens={tokensForZone('pasar')}
            onUnassign={handleUnassign}
          />
        </div>

        {/* Player action tokens */}
        <div className="action-tokens-section">
          <p className="tokens-label">Arrastra las fichas a un barrio:</p>
          <div className="action-tokens-row" role="group" aria-label="Fichas de acción disponibles">
            {tokens.map((t) => {
              const player = state.players.find((p) => p.role === t.role)!;
              return (
                <ActionToken
                  key={tokenKey(t)}
                  token={t}
                  player={player}
                  assigned={assignments[tokenKey(t)] !== undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="action-controls">
          {canGranMilpa && (
            <button className="btn-milpa" onClick={handleGranMilpa}>
              ¡Gran Milpa! ✦
            </button>
          )}
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!allAssigned}
            title={allAssigned ? '' : 'Asigna todas las fichas primero'}
          >
            Confirmar acciones →
          </button>
          <button
            className="btn-reset"
            onClick={() => setAssignments({})}
          >
            Limpiar
          </button>
        </div>
      </section>
    </DndContext>
  );
}
