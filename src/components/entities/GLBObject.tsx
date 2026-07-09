import { useEffect, useRef } from "react";
import { Script, Entity, GLTFResource, AssetType, Animator } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";

interface GLBProps<T extends string | number = string> {
    modelUrl: string;
    position?: [number, number, number];
    name?: string;
    scale?: [number, number, number];
    scripts?: Array<new (...args: any[]) => Script>;
    animationName?: T;
    animationEnum?: Record<string, T> | Record<number, string>;
}

export const GLBObject = <T extends string | number = string>({ 
    modelUrl, 
    position = [0, 0, 0], 
    name = "GenericGLBModel", 
    scale = [1, 1, 1], 
    scripts = [],
    animationName,
    animationEnum
}: GLBProps<T>) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);
    const animatorRef = useRef<Animator | null>(null);

    // Helper utility to safely extract the string name that Galacean expects
    const getTargetClipName = (value: T | undefined): string | null => {
        if (value === undefined) return null;
        if (animationEnum) {
            return String(value);
        }
        return String(value);
    };

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

            const animator = modelContent.getComponent(Animator);
            if (animator) {
                animatorRef.current = animator;
                
                const clipName = getTargetClipName(animationName);
                if (clipName) {
                    animator.play(clipName);
                }
            }
        })
        .catch((err) => {
            console.error(`[GLBObject] Failed to pipeline model stream asset at: ${modelUrl}`, err);
        });

        return () => {
            isCancelled = true;
            meshEntity.destroy();
            entityRef.current = null;
            animatorRef.current = null;
        };
    }, [engine, rootEntity, modelUrl]);

    // Reactive clip swapper hook
    useEffect(() => {
        const animator = animatorRef.current;
        if (!animator) return;

        const clipName = getTargetClipName(animationName);
        if (clipName) {
            animator.enabled = true;
            animator.play(clipName);
        } else {
            animator.enabled = false;
        }
    }, [animationName]);

    useEffect(() => {
        if (entityRef.current) entityRef.current.transform.setPosition(...position);
    }, [position]);

    useEffect(() => {
        if (entityRef.current) entityRef.current.transform.setScale(...scale);
    }, [scale]);

    useEffect(() => {
        const meshEntity = entityRef.current;
        if (!meshEntity) return;

        const scriptInstances = scripts.map((script) => meshEntity.addComponent(script));
        return () => {
            scriptInstances.forEach((instance) => {
                if (!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length]);

    return null;
};
