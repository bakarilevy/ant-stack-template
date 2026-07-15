import { useEffect, useRef } from "react";
import { DirectLight, Entity } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";
import { useSettingsStore } from "../../stores/useSettingsStore";

interface DirectionalLightProps {
    name?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    color?: [number, number, number, number];
}

export const DirectionalLight = ({
    name = "DirectionalLight",
    position = [0, 3, 0],
    rotation = [-45, -45, 0],
    color = [1.0, 0.5, 0.5, 1.0]
}: DirectionalLightProps) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);
    const lightComponentRef = useRef<DirectLight | null>(null);

    // 1. INITIALIZATION: Seed the Zustand store with your declarative scene props
    useEffect(() => {
        const store = useSettingsStore.getState();
        store.setLightPosition(position);
        store.setLightRotation(rotation);
        store.setLightColor(color);
    }, []); // Empty array ensures this only seeds once on canvas startup

    // 2. ENGINE MOUNT & SUBSCRIPTION PIPELINE
    useEffect(() => {
        if (!engine || !rootEntity) return;

        const lightEntity = rootEntity.createChild(name);
        const lightComponent = lightEntity.addComponent(DirectLight);
        
        entityRef.current = lightEntity;
        lightComponentRef.current = lightComponent;

        // Apply properties using your explicit scene values as immediate baseline targets
        lightEntity.transform.setPosition(...position);
        lightEntity.transform.setRotation(...rotation);
        lightComponent.color.set(color[0], color[1], color[2], color[3]);

        // 3. RUNTIME DRIVER: Listen to store changes continuously outside React lifecycle loops
        const unsubscribe = useSettingsStore.subscribe((state) => {
            if (entityRef.current) {
                entityRef.current.transform.setPosition(...state.lightPosition);
                entityRef.current.transform.setRotation(...state.lightRotation);
            }
            if (lightComponentRef.current) {
                lightComponentRef.current.color.set(
                    state.lightColor[0], 
                    state.lightColor[1], 
                    state.lightColor[2], 
                    state.lightColor[3]
                );
            }
        });

        return () => {
            unsubscribe();
            lightEntity.destroy();
            entityRef.current = null;
            lightComponentRef.current = null;
        };
    }, [engine, rootEntity, name]); // Free from shifting prop arrays to avoid constant entity creation/destruction

    return null;
};
