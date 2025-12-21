"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import { FaHome } from "react-icons/fa";

const Taskbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { runningApps, launchApp } = useOSStore();

  const taskbarApps = apps.filter((app) => app.isPinned || runningApps.includes(app.id));

  const handleAppClick = (appId: string, route: string) => {
    const isActive = pathname === route;

    if (isActive) {
      // If currently active, "minimize" -> go to Desktop
      router.push('/');
    } else {
      // If minimized or inactive, open/restore it
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
                ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}
              `}
            >
              <app.icon 
                size={20} 
                className={isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'} 
              />
              
              {/* Running Indicator (Dot) */}
              {isRunning && (
                <div className={`
                  absolute -bottom-1 w-1 h-1 rounded-full transition-all
                  ${isActive ? 'bg-blue-400 w-4' : 'bg-gray-400'}
                `} />
              )}
              
              {/* Tooltip */}
              <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Side (Clock placeholder) */}
      <div className="ml-auto text-white text-sm font-medium tabular-nums">
        <div className="relative group flex flex-col items-end">
          {/* Time */}
          <span>
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Los_Angeles" })}
          </span>
          {/* Date */}
          <span className="text-xs text-gray-300">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" })}
          </span>
          {/* Tooltip */}
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-700 z-50">
            My Local Time (PST)
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Taskbar;