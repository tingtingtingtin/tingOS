"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import { FaHome, FaCog, FaQuestionCircle } from "react-icons/fa";
import TimeDisplay from "./TimeDisplay";
import SettingsPanel from "./SettingsPanel";

const Taskbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { runningApps, launchApp } = useOSStore();
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const toggleMotion = useOSStore((s) => s.toggleMotion);
  const darkMode = useOSStore((s) => s.darkMode);
  const toggleDarkMode = useOSStore((s) => s.toggleDarkMode);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(ev.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const taskbarApps = apps.filter(
    (app) => app.isPinned || runningApps.includes(app.id),
  );

  const handleAppClick = (appId: string, route: string) => {
    const isActive = pathname === route;

    if (isActive) {
      router.push("/");
    } else {
      launchApp(appId);
      router.push(route);
    }
  };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center border-t border-black/10 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-gray-900/80">
      {/* Start Button / Home */}
      <div className="mr-6">
        <Link
          href="/"
          className="flex h-10 w-10 cursor-default items-center justify-center rounded text-gray-900 transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
        >
          <FaHome size={20} />
        </Link>
      </div>

      {/* App Icons */}
      <div className="flex items-center gap-2">
        {taskbarApps.map((app) => {
          const isActive = pathname === app.route;
          const isRunning = runningApps.includes(app.id);

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id, app.route)}
              className={`group relative flex h-10 w-10 items-center justify-center rounded transition-all ${isActive ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"} `}
            >
              <app.icon
                size={20}
                className={
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
                }
              />

              {/* Running Indicator (Dot) */}
              {isRunning && (
                <div
                  className={`absolute -bottom-1 h-1 w-1 rounded-full transition-all ${isActive ? "w-4 bg-blue-600 dark:bg-blue-400" : "bg-gray-400 dark:bg-gray-400"} `}
                />
              )}

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Side (help + settings moved left of time) */}
      <div
        className="ml-auto flex items-center text-sm font-medium text-gray-900 tabular-nums dark:text-white"
        ref={settingsRef}
      >
        {/* Help Button */}
        <div className="group relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-gray-900 transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => {
              /* intentionally no-op for now */
            }}
          >
            <FaQuestionCircle size={18} />
          </button>
          <span className="pointer-events-none absolute -top-10 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            Help (WIP)
          </span>
        </div>

        {/* Settings Button + Panel */}
        <div className="relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-gray-900 transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => setSettingsOpen((s) => !s)}
          >
            <FaCog size={18} />
          </button>
          <span className="pointer-events-none absolute -top-10 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            Settings
          </span>

          {settingsOpen && (
            <SettingsPanel
              reducedMotion={reducedMotion}
              toggleMotion={toggleMotion}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          )}
        </div>

        {/* Time */}
        <TimeDisplay />
      </div>
    </nav>
  );
};

export default Taskbar;
