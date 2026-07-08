import { useEffect, useRef } from "react";
import { MeshRenderer, PrimitiveMesh, BlinnPhongMaterial, Script, Entity, StaticCollider, BoxColliderShape, Vector3 } from "@galacean/engine";
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

        const meshEntity = rootEntity.createChild("GenericCubeMeshObject");
        const renderer = meshEntity.addComponent(MeshRenderer);

        renderer.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2);
        
        const collider = meshEntity.addComponent(StaticCollider);
        const boxShape = new BoxColliderShape();
        boxShape.size = new Vector3(2, 2, 2);
        collider.addShape(boxShape);

        renderer.setMaterial(new BlinnPhongMaterial(engine));
        meshEntity.transform.setPosition(...position);
        entityRef.current = meshEntity;

        return () => {
            meshEntity.destroy();
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
