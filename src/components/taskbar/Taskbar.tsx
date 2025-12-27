"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import {
  FaHome,
  FaCog,
  FaQuestionCircle,
  FaLock,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import TimeDisplay from "./TimeDisplay";
import SettingsPanel from "./SettingsPanel";
import AppIcon from "./AppIcon";
import MobileTabsOverlay from "./MobileTabsOverlay";

const Taskbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { runningApps, launchApp } = useOSStore();

  // Settings Store
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const toggleMotion = useOSStore((s) => s.toggleMotion);
  const darkMode = useOSStore((s) => s.darkMode);
  const toggleDarkMode = useOSStore((s) => s.toggleDarkMode);

  const isRouteActive = (route: string) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  // UI States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);

  // REFS
  const settingsRef = useRef<HTMLDivElement | null>(null); // For Desktop
  const mobileMenuRef = useRef<HTMLDivElement | null>(null); // For Mobile

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      const clickedInsideDesktop =
        settingsRef.current && settingsRef.current.contains(ev.target as Node);
      const clickedInsideMobile =
        mobileMenuRef.current &&
        mobileMenuRef.current.contains(ev.target as Node);

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
    const isActive = isRouteActive(route);
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

  return (
    <>
      {/* =========================================================
          DESKTOP TASKBAR
         ========================================================= */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 hidden h-14 items-center border-t border-black/10 bg-white/80 px-4 backdrop-blur-md md:flex dark:border-white/10 dark:bg-gray-900/80">
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
            const isActive = isRouteActive(app.route);
            const isRunning = runningApps.includes(app.id);

            return (
              <AppIcon
                key={app.id}
                app={app}
                isActive={isActive}
                isRunning={isRunning}
                onClick={() => handleAppClick(app.id, app.route)}
              />
            );
          })}
        </div>

        {/* Right Side Tools */}
        <div
          className="ml-auto flex items-center text-sm font-medium text-gray-900 tabular-nums dark:text-white"
          ref={settingsRef}
        >
          <div className="group relative">
            <button
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
              onClick={handleLock}
              aria-label="Lock System"
            >
              <FaLock size={16} />
            </button>
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              Lock System
            </span>
          </div>

          <div className="group relative">
            <button
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Help (WIP)"
            >
              <FaQuestionCircle size={18} />
            </button>
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              Help (WIP)
            </span>
          </div>

          <div className="group relative">
            <button
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setSettingsOpen((s) => !s)}
              aria-label="Settings"
            >
              <FaCog size={18} />
            </button>
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
          <TimeDisplay />
        </div>
      </nav>

      {/* =========================================================
          MOBILE TASKBAR
         ========================================================= */}
      <nav className="pb-safe fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-black/10 bg-white/90 px-6 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-gray-950/90">
        <Link
          href="/"
          onClick={() => setMobileTabsOpen(false)}
          className="flex flex-col items-center gap-1 text-gray-600 transition-transform active:scale-90 dark:text-gray-400"
        >
          <FaHome size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <button
          onClick={() => setMobileTabsOpen(!mobileTabsOpen)}
          className="flex flex-col items-center gap-1 text-gray-600 transition-transform active:scale-90 dark:text-gray-400"
        >
          <FaLayerGroup size={24} />
          <span className="text-[10px] font-medium">Tabs</span>
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-600 transition-transform active:scale-90 dark:text-gray-400"
        >
          <FaCog size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* MOBILE SETTINGS MODAL */}
      <AnimatePresence>
        {settingsOpen && (
          <div
            className="fixed inset-0 z-60 flex items-end justify-center bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              ref={mobileMenuRef} // ATTACH REF HERE
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full rounded-t-2xl bg-white p-6 pb-24 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Settings</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full bg-gray-100 p-2 dark:bg-gray-800"
                >
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
              <button
                onClick={handleLock}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-4 font-bold text-red-500"
              >
                <FaLock /> Lock System
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE TABS OVERLAY (Refactored) */}
      <MobileTabsOverlay
        isOpen={mobileTabsOpen}
        onClose={() => setMobileTabsOpen(false)}
        onAppClick={handleAppClick}
      />
    </>
  );
};

export default Taskbar;
