import { Script } from "@galacean/engine";
import { useGameStore, GameState } from "../stores/useGameStore";

export class BirdScript extends Script {
  onAwake(): void {
    // Using native event dispatcher
    this.engine.on("State_Change", (state: GameState) => {
      console.log("Bird Engine Script: React triggered an state mutation:", state);
    });
  }

  onUpdate(deltaTime: number): void {
    const store = useGameStore.getState();

    if (
      store.gameState === GameState.Idle &&
      this.engine.inputManager.isPointerDown()
    ) {
      console.log("Bird Engine Script: Screen pointer down detected! Starting match.");
      
      useGameStore.getState().setGameState(GameState.Flying);
      this.engine.dispatch("State_Change", GameState.Flying);
    }
  }
}
