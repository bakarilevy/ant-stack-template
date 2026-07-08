import { useState } from "react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import Example3DScene from "../scenes/Example3DScene";


const GCanvasView = () => {
    const rotationSpeed = useSettingsStore((state) => state.rotationSpeed);
    const setRotationSpeed = useSettingsStore((state) => state.setRotationSpeed);
    const [resetTrigger, setResetTrigger] = useState(0);

    return(
        <>
          <Example3DScene resetTrigger={resetTrigger}/>
        </>
    )
}

export default GCanvasView;