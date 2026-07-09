import { useEffect, useRef } from "react";
import { SpriteRenderer, SpriteAtlas, Entity } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";

interface SpriteAtlasProps {
    /** Public URL path targeting the .atlas configuration file */
    atlasUrl: string;
    /** The unique string key matching the desired target sub-region inside your map file */
    spriteName: string;
    /** Standard 3D transformation array */
    position: [number, number, number];
    /** Transform scale parameter applied to the wrapper entity */
    scale?: [number, number, number];
    /** Optional identifier name for scene graph debugging */
    name?: string;
}

export const SpriteAtlasObject = ({
    atlasUrl,
    spriteName,
    position,
    scale = [1, 1, 1],
    name = "GenericSpriteAtlas"
}: SpriteAtlasProps) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);
    const rendererRef = useRef<SpriteRenderer | null>(null);
    const atlasRef = useRef<SpriteAtlas | null>(null);

    // 1. Establish structural existence inside the Galacean graph
    useEffect(() => {
        if (!engine || !rootEntity) return;

        const atlasEntity = rootEntity.createChild(name);
        const renderer = atlasEntity.addComponent(SpriteRenderer);
        
        entityRef.current = atlasEntity;
        rendererRef.current = renderer;

        let isCancelled = false;

        // Load the shared packed file via ResourceManager
        engine.resourceManager
            .load<SpriteAtlas>(atlasUrl)
            .then((atlas) => {
                if (isCancelled || atlasEntity.destroyed) return;
                
                // Cache the reference globally within this instance to enable instant hot-swapping
                atlasRef.current = atlas;
                
                // Fetch the slice and push to structural hardware state
                const targetSprite = atlas.getSprite(spriteName);
                if (targetSprite) {
                    renderer.sprite = targetSprite;
                }
            })
            .catch((err) => 
                console.error(`[SpriteAtlasObject] Failed to load asset configuration: ${atlasUrl}`, err)
            );

        return () => {
            isCancelled = true;
            atlasEntity.destroy();
            entityRef.current = null;
            rendererRef.current = null;
            atlasRef.current = null;
        };
    }, [engine, rootEntity, atlasUrl]); // Hard rebuild only triggered if texture map origin shifts

    // 2. High frequency / Reactive sprite key index hopping
    useEffect(() => {
        // Skip entirely if initialization loop is still cooking
        if (!rendererRef.current || !atlasRef.current) return;

        const nextSprite = atlasRef.current.getSprite(spriteName);
        if (nextSprite) {
            rendererRef.current.sprite = nextSprite;
        } else {
            console.warn(`[SpriteAtlasObject] Key reference "${spriteName}" missing inside map definitions.`);
        }
    }, [spriteName]);

    // 3. Transformation state sync pipelines
    useEffect(() => {
        if (entityRef.current && !entityRef.current.destroyed) {
            entityRef.current.transform.setPosition(...position);
        }
    }, [position]);

    useEffect(() => {
        if (entityRef.current && !entityRef.current.destroyed) {
            entityRef.current.transform.setScale(...scale);
        }
    }, [scale]);

    return null;
};
