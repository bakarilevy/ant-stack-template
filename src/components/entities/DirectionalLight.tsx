import { useEffect } from "react";
import { DirectLight } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";

interface DirectionalLightProps {
    name?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
}

export const DirectionalLight = ({
    name = "DirectionalLight",
    position = [0, 0, 0],
    rotation = [-45, -45, 0],
}: DirectionalLightProps) => {
    const { engine, rootEntity } = useGalacean();

    useEffect(() => {
        if (!engine || !rootEntity) return;

        const lightEntity = rootEntity.createChild(name);
        lightEntity.addComponent(DirectLight);
        
        // Apply spatial settings
        lightEntity.transform.setPosition(...position);
        lightEntity.transform.setRotation(...rotation);

        return () => {
            lightEntity.destroy();
        };
    }, [engine, rootEntity, name, JSON.stringify(position), JSON.stringify(rotation)]);

    return null;
};
