import { GalaceanProvider } from "../../contexts/GalceanContext";
import { SceneCamera } from "../entities/SceneCamera";
import { DirectionalLight } from "../entities/DirectionalLight";
import { GLBObject } from "../entities/GLBObject";
import { RotateScript } from "../../scripts/RotateScript";


interface Example3DProps {
    resetTrigger?: number;
}

const OBJECT_SCRIPTS = [RotateScript];

const Example3DScene = ({ resetTrigger = 0 }: Example3DProps) => {
    return (
            <GalaceanProvider>

                {/* Viewport Control */}
                <SceneCamera
                    mode={'3D'}
                    position={[0, 5, 10]}
                    enableControls={true}
                    resetTrigger={resetTrigger}
                />

                {/* Lighting */}
                <DirectionalLight
                    position={[0, 3, 0]}
                    rotation={[-45, -45, 0]} 
                />

                {/* 3D Scene Objects */}
                <GLBObject
                    name="Duck"
                    modelUrl="/assets/3D/models/duck.glb"
                    position={[0, 0, 0]}
                    scripts={OBJECT_SCRIPTS}
                />

            </GalaceanProvider>
    );
};

export default Example3DScene;