"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import { FaHome, FaCog, FaQuestionCircle } from "react-icons/fa";

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
      if (settingsRef.current && !settingsRef.current.contains(ev.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const taskbarApps = apps.filter((app) => app.isPinned || runningApps.includes(app.id));

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
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-gray-900/80 backdrop-blur-md border-t border-white/10 flex items-center px-4 z-50">
      {/* Start Button / Home */}
      <div className="mr-6">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white"
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
              className={`
                relative group flex items-center justify-center w-10 h-10 rounded transition-all
                ${isActive ? "bg-white/15" : "hover:bg-white/10"}
              `}
            >
              <app.icon
                size={20}
                className={isActive ? "text-blue-400" : "text-gray-300 group-hover:text-white"}
              />

              {/* Running Indicator (Dot) */}
              {isRunning && (
                <div
                  className={`
                  absolute -bottom-1 w-1 h-1 rounded-full transition-all
                  ${isActive ? "bg-blue-400 w-4" : "bg-gray-400"}
                `}
                />
              )}

              {/* Tooltip */}
              <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="ml-auto text-white text-sm font-medium tabular-nums flex items-center gap-4" ref={settingsRef}>
        <div className="relative group flex flex-col items-end">
          {/* Time */}
          <span>
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "America/Los_Angeles",
            })}
          </span>
          {/* Date */}
          <span className="text-xs text-gray-300">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "America/Los_Angeles",
            })}
          </span>
          {/* Tooltip */}
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700 z-50">
            My Local Time (PST)
          </span>
        </div>

        {/* Help Button */}
        <div className="relative group">
          <button
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white"
            onClick={() => {
              /* TODO */
            }}
          >
            <FaQuestionCircle size={18} />
          </button>
          <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
            Help
          </span>
        </div>

        {/* Settings Button */}
        <div className="relative">
          <button
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white"
            onClick={() => setSettingsOpen((s) => !s)}
          >
            <FaCog size={18} />
          </button>
          <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
            Settings
          </span>

          {/* Settings mini-tab */}
          {settingsOpen && (
            <div className="absolute bottom-14 right-0 bg-gray-800 border border-gray-700 rounded p-3 w-48 text-white z-50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Motion</div>
                  <div className="text-xs text-gray-300">Reduce animations</div>
                </div>
                <button
                  aria-pressed={reducedMotion}
                  onClick={() => toggleMotion()}
                  className={`ml-3 px-3 py-1 rounded-full border transition-colors ${reducedMotion ? "bg-blue-500 border-blue-500" : "bg-gray-700 border-gray-600"}`}
                >
                  {reducedMotion ? "On" : "Off"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Taskbar;