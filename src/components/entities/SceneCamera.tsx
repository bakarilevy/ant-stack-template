import { useEffect, useRef } from "react";
import { Camera, Script, Entity } from "@galacean/engine";
import { OrbitControl } from "@galacean/engine-toolkit-controls";
import { useGalacean } from "../../contexts/GalceanContext";
import { useSettingsStore } from "../../stores/useSettingsStore";

interface CameraProps {
    mode: "2D" | "3D";
    position?: [number, number, number];
    enableControls: boolean;
    resetTrigger?: number;
    scripts?: Array<new (...args: any[]) => Script>;
}

export const SceneCamera = ({
    mode,
    position = [0, 0, 0],
    enableControls = false,
    resetTrigger = 0,
    scripts = []
}: CameraProps) => {
    const { rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);
    const controlsRef = useRef<OrbitControl | null>(null);

    // Seed store once using declarative props
    useEffect(() => {
        useSettingsStore.getState().setCameraPosition(position);
    }, []);

    // Engine Mount & Subscription Pipeline
    useEffect(() => {
        if (!rootEntity) return;

        const cameraEntity = rootEntity.createChild("GenericSceneCamera");
        const camera = cameraEntity.addComponent(Camera);

        if (mode === "2D") {
            camera.isOrthographic = true;
            camera.orthographicSize = 5;
        }

        entityRef.current = cameraEntity;

        if (enableControls && mode === "3D") {
            controlsRef.current = cameraEntity.addComponent(OrbitControl);
        }

        // Apply fallback base coordinates instantly
        cameraEntity.transform.setPosition(...position);

        // Runtime subscription
        const unsubscribe = useSettingsStore.subscribe((state) => {
            if (!entityRef.current) return;

            // If script moves camera programmatically, update positioning matrix vectors
            entityRef.current.transform.setPosition(...state.cameraPosition);

            // Sync OrbitControl reference values if active to avoid conflicting position resets
            if (controlsRef.current) {
                // If moving via code, tell OrbitControl to look at the space adjustments correctly
                // Optional: controlsRef.current.enabled = false; // toggles control constraints
            }
        });

        return () => {
            unsubscribe();
            cameraEntity.destroy();
            entityRef.current = null;
            controlsRef.current = null;
        };
    }, [rootEntity, mode, enableControls]); 

    // Handle structural UI reset actions cleanly via decoupled context triggers
    useEffect(() => {
        if (resetTrigger === 0 || !entityRef.current) return;

        // Reset store values first
        useSettingsStore.getState().setCameraPosition(position);

        if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0); 
        }
    }, [resetTrigger]);

    // Attach custom structural behavior engine scripts
    useEffect(() => {
        const cameraEntity = entityRef.current;
        if (!cameraEntity) return;

        const scriptInstances = scripts.map((script) => cameraEntity.addComponent(script));

        return () => {
            scriptInstances.forEach(instance => {
                if (!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length]);

    return null;
};
