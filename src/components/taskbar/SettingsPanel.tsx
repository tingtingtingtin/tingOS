"use client";

interface SettingsPanelProps {
  reducedMotion: boolean;
  toggleMotion: () => void;
}

const SettingsPanel = ({ reducedMotion, toggleMotion }: SettingsPanelProps) => {
  return (
    <div className="absolute right-0 bottom-14 z-50 w-48 rounded border border-gray-700 bg-gray-800 p-3 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Reduced motion</div>
          <div className="text-xs text-gray-300">
            Recommended for slower devices
          </div>
        </div>
        <button
          aria-pressed={reducedMotion}
          onClick={toggleMotion}
          className={`ml-3 rounded-full border px-3 py-1 transition-colors ${reducedMotion ? "border-blue-500 bg-blue-500" : "border-gray-600 bg-gray-700"}`}
        >
          {reducedMotion ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
