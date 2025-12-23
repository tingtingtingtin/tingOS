"use client";
import { FaMoon, FaSun } from "react-icons/fa";

interface SettingsPanelProps {
  reducedMotion: boolean;
  toggleMotion: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsPanel = ({
  reducedMotion,
  toggleMotion,
  darkMode,
  toggleDarkMode,
}: SettingsPanelProps) => {
  return (
    <div className="absolute right-0 bottom-14 z-50 w-64 rounded-lg border border-gray-200 bg-white/95 p-4 text-gray-900 shadow-2xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/95 dark:text-white">
      <div className="space-y-4">
        {/* Reduced Motion Row */}
        <div className="flex items-center justify-between">
          <div className="pr-2">
            <div className="text-sm font-medium">Reduced Motion</div>
            <div className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              Recommended for slower devices
            </div>
          </div>
          <button
            onClick={toggleMotion}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reducedMotion ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Dark Mode Row */}
        <div className="flex items-center justify-between">
          <div className="pr-2">
            <div className="text-sm font-medium">Theme</div>
            <div className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {darkMode ? "Dark" : "Light"}
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="relative flex h-8 w-16 items-center justify-around rounded-full border border-gray-300 bg-gray-100 p-1 dark:border-gray-600 dark:bg-gray-700"
          >
            <FaSun
              className={`z-10 text-[12px] ${!darkMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <FaMoon
              className={`z-10 text-[12px] ${darkMode ? "text-blue-400" : "text-gray-400"}`}
            />
            <div
              className={`absolute top-1 bottom-1 left-1 w-7 rounded-full bg-white shadow-sm transition-transform dark:bg-gray-500 ${darkMode ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
