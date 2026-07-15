import React, { useState } from 'react';
import { Vector3, Color } from '@galacean/engine';
import { FormItemVector3, FormItemColor, FormItemButton } from '@galacean/gui';
import { useSettingsStore } from '../../stores/useSettingsStore';

const BasicGUI = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Pull store actions statically. Do not select values here so this component never re-renders on drag.
  const setLightRotation = useSettingsStore((state) => state.setLightRotation);
  const setLightColor = useSettingsStore((state) => state.setLightColor);

  // Initialize unchanging vector snapshots for GUI element layouts on initial mount
  const initialStore = useSettingsStore.getState();
  const [guiRotation] = useState(() => new Vector3(...initialStore.lightRotation));
  const [guiColor] = useState(() => new Color(...initialStore.lightColor));

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end pointer-events-auto target-gui">
      <FormItemButton 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-xs font-medium rounded shadow-md transition-colors text-gray-200"
      >
        {isOpen ? '✕ Hide Controls' : '⚙️ Light Controls'}
      </FormItemButton>

      <div className={`mt-2 p-3 bg-gray-900/95 border border-gray-800 rounded-md text-white shadow-xl min-w-[240px] text-xs backdrop-blur-sm ${!isOpen ? 'hidden' : ''}`}>
        <div className="mt-2 pt-2 border-t border-gray-800">
          <FormItemVector3 
            label="Rotation" 
            value={guiRotation} 
            onChange={(val) => {
              setLightRotation([val.x, val.y, val.z]);
            }} 
          />
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-800">
          <FormItemColor 
            label="Color" 
            value={guiColor} 
            onChange={(val: any) => {
              const r = val?.r ?? 1.0;
              const g = val?.g ?? 1.0;
              const b = val?.b ?? 1.0;
              const a = val?.a ?? 1.0;
              setLightColor([r, g, b, a]);
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default BasicGUI;
