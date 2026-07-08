import { useEffect } from "react";
import { Script } from "@galacean/engine";
import { useGalacean } from "../../contexts/GalceanContext";


interface GenericEntityProps {
    name: string;
    position: [number, number, number];
    scripts?: Array<new (...args: any[]) => Script>;
}

export const GenericEntity = ({name, position, scripts = []}: GenericEntityProps) => {
    const { rootEntity } =  useGalacean();

    useEffect(() => {
        if(!rootEntity) return;

        const entity = rootEntity.createChild(name);
        entity.transform.setPosition(...position);

        scripts.forEach((script) => {
            entity.addComponent(script);
        });

        return () => {
            entity.destroy();
        };
    }, [rootEntity, name, position, scripts]);

    return null;
};

