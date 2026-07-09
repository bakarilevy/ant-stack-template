import { create, StoreApi, UseBoundStore } from 'zustand';

/**
 * Centralized Game Animation Enums
 * Each enum value should be an exact string literal matching the baked glTF clip names.
 */

export enum PlayerAnims {
  IDLE = "Idle_Pose",
  FLY = "Flap_Wings",
  CRASH = "Fall_Down"
}

export enum EnemyAnims {
  PATROL = "Walk_Loop",
  ATTACK = "Bite_Action",
  DIE = "Death_Animation"
}

/**
 * State Interface
 */
interface AnimationState<T extends string> {
  currentAnimation: T;
  setAnimation: (animation: T) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
}

/**
 * Generates an isolated, Zustand store for any specific Enum string group.
 */
export const createAnimationStore = <T extends string>(
  defaultAnimation: T
): UseBoundStore<StoreApi<AnimationState<T>>> => {
  return create<AnimationState<T>>((set) => ({
    currentAnimation: defaultAnimation,
    setAnimation: (animation) => set({ currentAnimation: animation }),
    isPaused: false,
    setPaused: (paused) => set({ isPaused: paused }),
  }));
};

/**
 * Instantiate animation stores for each object
 */
export const usePlayerAnimationStore = createAnimationStore<PlayerAnims>(PlayerAnims.IDLE);
export const useEnemyAnimationStore = createAnimationStore<EnemyAnims>(EnemyAnims.PATROL);
