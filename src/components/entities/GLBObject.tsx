import { useEffect, useRef } from "react";
import { Script, Entity, GLTFResource, AssetType, Animator } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";

interface GLBProps<T extends string = string> {
    modelUrl: string;
    position?: [number, number, number];
    name?: string;
    scale?: [number, number, number];
    scripts?: Array<new (...args: any[]) => Script>;
    animation?: T;
}

export const GLBObject = <T extends string = string>({ 
    modelUrl, 
    position = [0, 0, 0], 
    name = "GenericGLBModel", 
    scale = [1, 1, 1], 
    scripts = [],
    animation
}: GLBProps<T>) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);
    const animatorRef = useRef<Animator | null>(null);

    // Asset loading pipeline
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
                
                // Play immediately on mount if requested
                if (animation) {
                    animator.play(animation);
                }
            }
        })
        .catch((err) => {
            console.error(`[GLBObject] Failed to parse asset at: ${modelUrl}`, err);
        });

        return () => {
            isCancelled = true;
            meshEntity.destroy();
            entityRef.current = null;
            animatorRef.current = null;
        };
    }, [engine, rootEntity, modelUrl]);

    // Single-responsibility reactive driver for runtime updates
    useEffect(() => {
        const animator = animatorRef.current;
        if (!animator) return;

        if (animation) {
            animator.enabled = true;
            animator.play(animation);
        } else {
            animator.enabled = false; // Freeze model state if animation is pulled
        }
    }, [animation]);

    // Position tracker
    useEffect(() => {
        if (entityRef.current) entityRef.current.transform.setPosition(...position);
    }, [position]);

    // Scale tracker
    useEffect(() => {
        if (entityRef.current) entityRef.current.transform.setScale(...scale);
    }, [scale]);

    // Custom engine script attacher
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
