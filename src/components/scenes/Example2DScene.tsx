
import { GalaceanProvider } from "../../contexts/GalceanContext";
import { SceneCamera } from "../entities/SceneCamera";
import { RotateScript } from "../../scripts/RotateScript";
import { SpriteObject } from "../entities/SpriteObject";


interface Example2DProps {
    resetTrigger?: number;
}

const OBJECT_SCRIPTS = [RotateScript];

const Example2DScene = ({ resetTrigger = 0 }: Example2DProps) => {
    return (
            <GalaceanProvider>

                {/* Viewport Control */}
                <SceneCamera
                    mode={'2D'}
                    position={[0, 0, 1]}
                    enableControls={true}
                    resetTrigger={resetTrigger}
                />

                {/* 2D Scene Objects */}
                <SpriteObject
                    name="Background"
                    textureUrl="/assets/2D/sprites/background.png"
                    position={[0, 0, 0]}
                />

            </GalaceanProvider>
    );
};

export default Example2DScene;