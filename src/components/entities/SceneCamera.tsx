import { useEffect, useRef } from "react";
import { Camera, Script, Entity } from "@galacean/engine";
import { OrbitControl } from "@galacean/engine-toolkit-controls";
import { useGalacean } from "../../contexts/GalceanContext";


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

    useEffect(() => {
        if(!rootEntity) return;

        const cameraEntity = rootEntity.createChild("GenericSceneCamera");
        const camera = cameraEntity.addComponent(Camera);

        // Configure hardware viewport modes
        if(mode === "2D") {
            camera.isOrthographic = true;
            camera.orthographicSize = 5;
        }

        entityRef.current = cameraEntity;

        // Add spatial control mouse-drag tracking mapping
        if(enableControls && mode === "3D") {
            controlsRef.current = cameraEntity.addComponent(OrbitControl);
        }

        return () => {
            cameraEntity.destroy();
            entityRef.current = null;
            controlsRef.current = null;
        };
    }, [rootEntity, mode, enableControls]); // Reallocate matrix space only if mode shifts

    useEffect(() => {
        if(entityRef.current) {
            entityRef.current.transform.setPosition(...position);
        }
    }, [position]);

    useEffect(() => {
        if(resetTrigger === 0 || !entityRef.current) return;

        entityRef.current.transform.setPosition(...position);

        if(controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0); // Focus back to grid center
        }
    }, [resetTrigger, position]);

    useEffect(() => {
        const cameraEntity = entityRef.current;
        if(!cameraEntity) return;

        const scriptInstances = scripts.map((script) => {
            return cameraEntity.addComponent(script);
        });

        return () => {
            scriptInstances.forEach(instance => {
                if(!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length]);

    return null;
}