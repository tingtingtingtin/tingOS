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
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center border-t border-white/10 bg-gray-900/80 px-4 backdrop-blur-md">
      {/* Start Button / Home */}
      <div className="mr-6">
        <Link
          href="/"
          className="flex h-10 w-10 cursor-default items-center justify-center rounded text-white transition-colors hover:bg-white/10"
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
              className={`group relative flex h-10 w-10 items-center justify-center rounded transition-all ${isActive ? "bg-white/15" : "hover:bg-white/10"} `}
            >
              <app.icon
                size={20}
                className={
                  isActive
                    ? "text-blue-400"
                    : "text-gray-300 group-hover:text-white"
                }
              />

              {/* Running Indicator (Dot) */}
              {isRunning && (
                <div
                  className={`absolute -bottom-1 h-1 w-1 rounded-full transition-all ${isActive ? "w-4 bg-blue-400" : "bg-gray-400"} `}
                />
              )}

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-10 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Side (help + settings moved left of time) */}
      <div
        className="ml-auto flex items-center text-sm font-medium text-white tabular-nums"
        ref={settingsRef}
      >
        {/* Help Button */}
        <div className="group relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
            onClick={() => {
              /* intentionally no-op for now */
            }}
          >
            <FaQuestionCircle size={18} />
          </button>
          <span className="pointer-events-none absolute -top-10 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            Help (WIP)
          </span>
        </div>

        {/* Settings Button + Panel */}
        <div className="relative">
          <button
            className="flex h-10 w-10 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
            onClick={() => setSettingsOpen((s) => !s)}
          >
            <FaCog size={18} />
          </button>
          <span className="pointer-events-none absolute -top-10 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            Settings
          </span>

          {settingsOpen && (
            <SettingsPanel
              reducedMotion={reducedMotion}
              toggleMotion={toggleMotion}
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
