import { create } from 'zustand';

interface SettingsState {
    rotationSpeed: number;
    setRotationSpeed: (speed: number) => void;
    // Lighting controls
    lightPosition: [number, number, number];
    setLightPosition: (pos: [number, number, number]) => void;
    lightColor: [number, number, number, number];
    setLightColor: (color: [number, number, number, number]) => void;
    lightRotation: [number, number, number];
    setLightRotation: (rot: [number, number, number]) => void;
    // Camera controls
    cameraPosition: [number, number, number];
    setCameraPosition: (pos: [number, number, number]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    rotationSpeed: 50,
    setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
    //Light props
    lightPosition:[0, 3, 0],
    setLightPosition: (pos) => set({ lightPosition: pos }),
    lightColor: [1.0, 0.5, 0.5, 1.0],
    setLightColor: (color) => set({ lightColor: color }),
    lightRotation: [-45, -45, 0],
    setLightRotation: (rot) => set({ lightRotation: rot }),
    //Camera props
    cameraPosition:[0, 0, 1],
    setCameraPosition: (pos) => set({ cameraPosition: pos }),
}));
