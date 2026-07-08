import { Script } from "@galacean/engine";
import { useSettingsStore } from "../stores/useSettingsStore";


export class RotateScript extends Script {
    onUpdate(deltaTime: number): void {
        const targetSpeed = useSettingsStore.getState().rotationSpeed;
        const degreesToRotate = targetSpeed * deltaTime * 1.5;
        this.entity.transform.rotate(0, degreesToRotate, 0);
    }
}