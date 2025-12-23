"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import { FaHome, FaCog, FaQuestionCircle, FaLock, FaLayerGroup, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import TimeDisplay from "./TimeDisplay";
import SettingsPanel from "./SettingsPanel";

const Taskbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { runningApps, launchApp } = useOSStore();
  
  // Settings Store
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const toggleMotion = useOSStore((s) => s.toggleMotion);
  const darkMode = useOSStore((s) => s.darkMode);
  const toggleDarkMode = useOSStore((s) => s.toggleDarkMode);

  // UI States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
  
  // REFS
  const settingsRef = useRef<HTMLDivElement | null>(null); // For Desktop
  const mobileMenuRef = useRef<HTMLDivElement | null>(null); // For Mobile

const transition = {
  duration: 0.25,
  ease: [0, 0.71, 0.2, 1.01],
} as const;

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      // FIX: Check BOTH refs. If click is in Desktop Settings OR Mobile Menu, ignore it.
      const clickedInsideDesktop = settingsRef.current && settingsRef.current.contains(ev.target as Node);
      const clickedInsideMobile = mobileMenuRef.current && mobileMenuRef.current.contains(ev.target as Node);

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLock = () => {
    sessionStorage.removeItem("tingOS_unlocked");
    window.dispatchEvent(new Event("os-lock"));
  };

  const handleAppClick = (appId: string, route: string) => {
    setMobileTabsOpen(false); 
    const isActive = pathname === route;
    if (isActive) {
      router.push("/");
    } else {
      launchApp(appId);
      router.push(route);
    }
  };

  const desktopTaskbarApps = apps.filter(
    (app) => app.isPinned || runningApps.includes(app.id),
  );

  const mobileRunningApps = apps.filter((app) => runningApps.includes(app.id));

  return (
    <>
      {/* =========================================================
          DESKTOP TASKBAR
         ========================================================= */}
      <nav className="hidden md:flex fixed right-0 bottom-0 left-0 z-50 h-14 items-center border-t border-black/10 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-gray-900/80">
        
        {/* Start Button */}
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
          {desktopTaskbarApps.map((app) => {
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
                {isRunning && (
                  <div className={`absolute -bottom-1 h-1 w-1 rounded-full transition-all ${isActive ? "w-4 bg-blue-600 dark:bg-blue-400" : "bg-gray-400 dark:bg-gray-400"} `} />
                )}
                <span className="pointer-events-none absolute -top-10 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  {app.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side Tools */}
        <div className="ml-auto flex items-center text-sm font-medium text-gray-900 tabular-nums dark:text-white" ref={settingsRef}>
          <button className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10" onClick={handleLock}>
            <FaLock size={16} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10">
            <FaQuestionCircle size={18} />
          </button>

          <div className="relative">
            <button
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setSettingsOpen((s) => !s)}
            >
              <FaCog size={18} />
            </button>
            {settingsOpen && (
              <SettingsPanel
                reducedMotion={reducedMotion}
                toggleMotion={toggleMotion}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            )}
          </div>
          <TimeDisplay />
        </div>
      </nav>


      {/* =========================================================
          MOBILE TASKBAR
         ========================================================= */}
      <nav className="flex md:hidden fixed right-0 bottom-0 left-0 z-50 h-16 items-center justify-around border-t border-black/10 bg-white/90 px-6 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/90 pb-safe">
        <Link
          href="/"
          onClick={() => setMobileTabsOpen(false)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 active:scale-90 transition-transform"
        >
          <FaHome size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <button
          onClick={() => setMobileTabsOpen(!mobileTabsOpen)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 active:scale-90 transition-transform"
        >
          <FaLayerGroup size={24} />
          <span className="text-[10px] font-medium">Tabs</span>
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 active:scale-90 transition-transform"
        >
          <FaCog size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* MOBILE SETTINGS MODAL */}
      <AnimatePresence>
        {settingsOpen && (
            <div className="md:hidden fixed inset-0 z-60 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSettingsOpen(false)}>
                <motion.div 
                    ref={mobileMenuRef} // ATTACH REF HERE
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-6 pb-24"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold dark:text-white">Settings</h2>
                        <button onClick={() => setSettingsOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <FaTimes />
                        </button>
                    </div>
                     <SettingsPanel
                        reducedMotion={reducedMotion}
                        toggleMotion={toggleMotion}
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                        isMobile={true}
                    />
                     <button onClick={handleLock} className="mt-4 w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2">
                        <FaLock /> Lock System
                     </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* MOBILE TABS OVERLAY */}
      <AnimatePresence mode="wait">
        {mobileTabsOpen && (
            <motion.div
              initial={{ opacity: 0  }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              className="md:hidden fixed inset-0 z-49 flex flex-col bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-6 pt-12 mb-16 rounded-t-md"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold dark:text-white">Active Tabs</h2>
                    <button 
                        onClick={() => setMobileTabsOpen(false)}
                        className="p-3 bg-black/5 dark:bg-white/10 rounded-full dark:text-white"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {mobileRunningApps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-1/2 text-gray-500">
                        <p>No apps running.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {mobileRunningApps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => handleAppClick(app.id, app.route)}
                                className={`
                                    flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all
                                    ${pathname === app.route 
                                        ? "bg-blue-500/20 border-blue-500/50" 
                                        : "bg-white/40 dark:bg-gray-800/40 border-white/20 dark:border-white/10"
                                    }
                                `}
                            >
                                <app.icon size={42} className={pathname === app.route ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"} />
                                <span className="font-medium dark:text-white">{app.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Taskbar;