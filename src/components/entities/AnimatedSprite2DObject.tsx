import { useEffect, useState, useRef } from "react";
import { SpriteAtlasObject } from "./SpriteAtlasObject";

interface AnimatedSprite2DProps {
    atlasUrl: string;
    /** Ordered list of sub-region name identifiers in the atlas */
    frames: string[];
    /** Frames per second to control playback speed */
    fps?: number;
    loop?: boolean;
    position: [number, number, number];
    scale?: [number, number, number];
    name?: string;
}

export const AnimatedSprite2DObject = ({
    atlasUrl,
    frames,
    fps = 12,
    loop = true,
    position,
    scale,
    name = "GenericAnimatedSprite"
}: AnimatedSprite2DProps) => {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const animationRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number>(performance.now());
    const frameDuration = 1000 / fps; // target ms per frame

    useEffect(() => {
        if (frames.length <= 1) return;

        let frameIndex = 0;
        lastUpdateTimeRef.current = performance.now();

        const tick = (now: number) => {
            const elapsed = now - lastUpdateTimeRef.current;

            if (elapsed >= frameDuration) {
                // Calculate passed frames if delta drops low
                const framesPassed = Math.floor(elapsed / frameDuration);
                frameIndex += framesPassed;

                if (frameIndex >= frames.length) {
                    if (loop) {
                        frameIndex = frameIndex % frames.length;
                    } else {
                        frameIndex = frames.length - 1;
                        setCurrentFrameIndex(frameIndex);
                        return; // Halt loop execution
                    }
                }

                setCurrentFrameIndex(frameIndex);
                // Keep residual time slice for sub-frame consistency
                lastUpdateTimeRef.current = now - (elapsed % frameDuration);
            }
            animationRef.current = requestAnimationFrame(tick);
        };

        animationRef.current = requestAnimationFrame(tick);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [frames, fps, loop, frameDuration]);

    return (
        <SpriteAtlasObject
            atlasUrl={atlasUrl}
            spriteName={frames[currentFrameIndex]}
            position={position}
            scale={scale}
            name={name}
        />
    );
};
