import { useEffect, useRef } from "react";
import {
    MeshRenderer,
    PrimitiveMesh,
    BlinnPhongMaterial,
    DirectLight,
    Script,
    Entity,
    StaticCollider,
    BoxColliderShape,
    Vector3,
} from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";


interface CubeProps {
    position: [number, number, number],
    onScriptsReady?: (instances: Script[]) => void;
    scripts?: Array<new (...args: any[]) => Script>;
}

export const CubeObject = ({ position, scripts = [], onScriptsReady}: CubeProps) => {
    const { engine, rootEntity } = useGalacean();
    const entityRef = useRef<Entity | null>(null);

    useEffect(() => {
        if(!engine || !rootEntity) return;

        const lightEntity = rootEntity.createChild("Light");
        lightEntity.addComponent(DirectLight);
        lightEntity.transform.setRotation(-45, -45, 0);

        const meshEntity = rootEntity.createChild("GenericCubeMeshObject");
        const renderer = meshEntity.addComponent(MeshRenderer);

        // Add mesh
        renderer.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2);
        // Add collider
        const collider = meshEntity.addComponent(StaticCollider);
        const boxShape = new BoxColliderShape();
        boxShape.size = new Vector3(2, 2, 2) // Must match geometry
        collider.addShape(boxShape);

        renderer.setMaterial(new BlinnPhongMaterial(engine));
        meshEntity.transform.setPosition(...position);
        entityRef.current = meshEntity;

        return () => {
            meshEntity.destroy();
            lightEntity.destroy();
            entityRef.current = meshEntity;
        };
    }, [engine, rootEntity]);

    useEffect(() => {
        const meshEntity = entityRef.current;
        if(!meshEntity) return;

        const scriptInstances = scripts.map((script) => {
            return meshEntity.addComponent(script);
        });

        if(onScriptsReady) {
            onScriptsReady(scriptInstances);
        }

        return () => {
            scriptInstances.forEach(instance => {
                if(!instance.destroyed) instance.destroy();
            });
        };
    }, [scripts.length, onScriptsReady]);
    return null;
};