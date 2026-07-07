import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { WebGLEngine, Entity } from "@galacean/engine";
import { LitePhysics } from "@galacean/engine-physics-lite";


interface GalaceanContextType {
    engine: WebGLEngine | null;
    rootEntity: Entity | null;
}

const GalaceanContext = createContext<GalaceanContextType>({engine: null, rootEntity: null});

export const GalaceanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [contextValue, setContextValue] = useState<GalaceanContextType>({ engine: null, rootEntity: null});

    useEffect(() => {
        if (!canvasRef.current) return;

        let isDestroyed = false;
        let engineInstance: WebGLEngine | null = null;

        const init = async () => {
            if (!canvasRef.current) return;

            const engine = await WebGLEngine.create({
                canvas: canvasRef.current,
                physics: new LitePhysics()
            });

            if(isDestroyed) {
                engine.destroy();
                return;
            }

            engineInstance = engine;
            engine.canvas.resizeByClientSize();

            const scene = engine.sceneManager.activeScene;
            const rootEntity = scene.createRootEntity("SceneRoot");

            engine.run();
            setContextValue({engine, rootEntity});
        };

        init();

        return () => {
            isDestroyed = true;
            if(engineInstance) engineInstance.destroy();
            setContextValue({ engine: null, rootEntity: null});
        };
    }, []);

    return (
        <GalaceanContext.Provider value={contextValue}>
            <div className='w-full h-full relative'>
                <canvas ref={canvasRef} className='w-full h-full block'/>
                {contextValue.engine && children}
            </div>
        </GalaceanContext.Provider>
    );
}

export const useGalacean = () => useContext(GalaceanContext);