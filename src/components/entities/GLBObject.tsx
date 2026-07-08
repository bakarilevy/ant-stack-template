import { useEffect, useRef } from "react";
import { Script, Entity, GLTFResource, AssetType } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";

interface GLBProps {
    modelUrl: string;
    position?: [number, number, number];
    name?: string;
    scale?: [number, number, number];
    scripts?: Array<new (...args: any[]) => Script>;
}

export const GLBObject = ({ 
    modelUrl, 
    position = [0, 0 , 0], 
    name = "GenericGLBModel", 
    scale = [1, 1, 1], 
    scripts = [] 
}: GLBProps) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);

    useEffect(() => {
        if (!engine || !rootEntity) return;

        const meshEntity = rootEntity.createChild(name);
        entityRef.current = meshEntity;

        let isCancelled = false;

        engine.resourceManager.load<GLTFResource>({
            url: modelUrl,
            type: AssetType.GLTF
        })
        .then((gltfResource) => {
            if (isCancelled || meshEntity.destroyed) return;

            const modelContent = gltfResource.instantiateSceneRoot();
            meshEntity.addChild(modelContent);
            
            meshEntity.transform.setPosition(...position);
            meshEntity.transform.setScale(...scale);
        })
        .catch((err) => {
            console.error(`[GLBObject] Failed to pipeline model stream asset at: ${modelUrl}`, err);
        });

        return () => {
            isCancelled = true;
            meshEntity.destroy();
            entityRef.current = null;
        };
    }, [engine, rootEntity, modelUrl]);

    useEffect(() => {
        if (entityRef.current) {
            entityRef.current.transform.setPosition(...position);
        }
    }, [position]);

    useEffect(() => {
        if (entityRef.current) {
            entityRef.current.transform.setScale(...scale);
        }
    }, [scale]);

    useEffect(() => {
        const meshEntity = entityRef.current;
        if (!meshEntity) return;

        const scriptInstances = scripts.map((script) => {
            return meshEntity.addComponent(script);
        });

        return () => {
            scriptInstances.forEach((instance) => {
                if (!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length]);

    return null;
};
