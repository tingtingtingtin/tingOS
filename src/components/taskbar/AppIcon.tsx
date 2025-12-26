"use client";

import { AppConfig } from "@/data/apps";

interface AppIconProps {
  app: AppConfig;
  isActive: boolean;
  isRunning: boolean;
  onClick: () => void;
}

const AppIcon = ({ app, isActive, isRunning, onClick }: AppIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-10 w-10 items-center justify-center rounded transition-all ${isActive ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"} `}
      aria-label={app.label}
      title={app.label}
    >
      <app.icon
        size={20}
        className={
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
        }
      />
      {isRunning && (
        <div
          className={`absolute -bottom-1 h-1 w-1 rounded-full transition-all ${isActive ? "w-4 bg-blue-600 dark:bg-blue-400" : "bg-gray-400 dark:bg-gray-400"} `}
        />
      )}
      <span className="pointer-events-none absolute -top-10 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        {app.label}
      </span>
    </button>
  );
};

export default AppIcon;
