import { create } from 'zustand';

export enum GameState {
  Idle,
  Flying,
  Crash,
  Result,
}

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: GameState.Idle,
  setGameState: (state) => {
    console.log("React/Zustand: Global state changed to", state);
    set({ gameState: state });
  }
}));
