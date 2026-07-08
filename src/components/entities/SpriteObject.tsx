import { useEffect, useRef } from "react";
import { SpriteRenderer, Sprite, Texture2D, Script, Entity } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";


interface SpriteProps {
    textureUrl: string;
    position: [number, number, number];
    name?: string;
    scripts?: Array<new (...args: any[]) => Script>;
}

export const SpriteObject = ({ textureUrl, position, name = "Generic2DSprite", scripts = []}: SpriteProps) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);


    // Establish structure
    useEffect(() => {
        if(!engine || !rootEntity) return;

        const spriteEntity = rootEntity.createChild(name);
        const renderer = spriteEntity.addComponent(SpriteRenderer);
        entityRef.current = spriteEntity;

        let isCancelled = false;

        // Async texture loader pipeline
        engine.resourceManager.load<Texture2D>(textureUrl).then((texture) => {
            // Don't assign texture memory state if component unmounted mid processing
            if(isCancelled || spriteEntity.destroyed) return;
            renderer.sprite = new Sprite(engine, texture);
        }).catch(err => console.error(`[SpriteObject] Failed to fetch asset texture: ${textureUrl} `, err));

        return () => {
            isCancelled = true;
            spriteEntity.destroy();
            entityRef.current = null;
        };
    }, [engine, rootEntity, textureUrl]); // Rebuild if texure source path updates

    // State Sync
    useEffect(() => {
        if (entityRef.current) {
            entityRef.current.transform.setPosition(...position);
        }
    }, [position]);

    // Attach scripts
    useEffect(() => {
        const spriteEntity = entityRef.current;
        if(!spriteEntity) return;

        const scriptInstances = scripts.map((script) => {
            return spriteEntity.addComponent(script);
        });

        return () => {
            scriptInstances.forEach(instance => {
                if(!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length]);

    return null;
}