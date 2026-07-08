
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
        <div className="w-full h-full">
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
                    rotation={[-45, -45, 0]} 
                />

                {/* 3D Scene Objects */}
                <GLBObject
                    modelUrl="/assets/3D/models/lowpoly_car.glb"
                    position={[0, 0, 0]}
                    scripts={OBJECT_SCRIPTS}
                />

            </GalaceanProvider>
        </div>
    );
};

export default Example3DScene;