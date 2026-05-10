import { useState, useCallback } from 'react';
import { createInitialState, runPhase, runFullCycle, type GameState, type PhaseInput } from '@tlahtoa/core';
import { AppLayout } from './layout/AppLayout';
import { Header }    from './layout/Header';
import { BoardPanel } from './board/BoardPanel';
import { CouncilPanel } from './council/CouncilPanel';
import { PhaseControl } from './phase/PhaseControl';
import './styles.css';

const INITIAL_STATE = createInitialState({
  scenarioId: 1,
  jugadores: [
    { nombre: 'Jugador 1', role: 'sacerdote' },
    { nombre: 'Jugador 2', role: 'general' },
    { nombre: 'Jugador 3', role: 'curandera' },
    { nombre: 'Jugador 4', role: 'astronomo' },
  ],
  seed: 20250510,
});

export function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const handlePhase = useCallback((input: PhaseInput) => {
    setState((prev) => runPhase(prev, input));
  }, []);

  const handleSkip = useCallback(() => {
    setState((prev) => runFullCycle(prev));
  }, []);

  const handleReset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return (
    <div className="app">
      <AppLayout
        header={<Header state={state} />}
        left={<BoardPanel state={state} />}
        board={
          <PhaseControl
            state={state}
            onPhase={handlePhase}
            onSkip={handleSkip}
            onReset={handleReset}
          />
        }
        right={<CouncilPanel state={state} onPhase={handlePhase} />}
      />
    </div>
  );
}
