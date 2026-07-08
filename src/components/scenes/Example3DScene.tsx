import { GalaceanProvider } from "../../contexts/GalceanContext";
import { CubeObject } from "../entities/CubeObject";
import { SceneCamera } from "../entities/SceneCamera";
import { RotateScript } from "../../scripts/RotateScript";


interface Example3DProps {
    resetTrigger?: number;
}

const CUBE_SCRIPTS = [RotateScript];

const Example3DScene = ({resetTrigger = 0}: Example3DProps) => {
    return (
        <div className="w-full h-full">
            <GalaceanProvider>

                <SceneCamera
                  mode={'3D'}
                  position={[0, 5, 10]}
                  enableControls={true}
                  resetTrigger={resetTrigger}
                />

                <CubeObject
                  position={[0, 0, 0]}
                  scripts={CUBE_SCRIPTS}
                />

            </GalaceanProvider>
        </div>
    );
}

export default Example3DScene;