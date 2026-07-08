import { create } from 'zustand';


interface SettingsState {
    rotationSpeed: number;
    setRotationSpeed: (speed: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    rotationSpeed: 30,
    setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
}));

export const useRotationSpeed = () => {
    const speed = useSettingsStore((state) => state.rotationSpeed);
    const setSpeed = useSettingsStore((state) => state.setRotationSpeed);
    return [speed, setSpeed] as const;
};