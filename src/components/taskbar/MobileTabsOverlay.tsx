"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { apps } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import { FaTimes } from "react-icons/fa";

interface MobileTabsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (appId: string, route: string) => void;
}

const MobileTabsOverlay = ({
  isOpen,
  onClose,
  onAppClick,
}: MobileTabsOverlayProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const runningApps = useOSStore((s) => s.runningApps);
  const closeApp = useOSStore((s) => s.closeApp);

  const isRouteActive = (route: string) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const mobileRunningApps = apps.filter((app) => runningApps.includes(app.id));

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0, 0.71, 0.2, 1.01] }}
          className="fixed inset-0 z-49 mb-16 flex flex-col rounded-t-md bg-white/60 p-6 pt-12 backdrop-blur-2xl md:hidden dark:bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="mb-8 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold dark:text-white">Active Tabs</h2>
            <button
              onClick={onClose}
              className="rounded-full bg-black/5 p-3 dark:bg-white/10 dark:text-white"
            >
              <FaTimes size={20} />
            </button>
          </motion.div>

          {mobileRunningApps.length === 0 ? (
            <div className="flex h-1/2 flex-col items-center justify-center text-gray-500">
              <p>No apps running.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence>
                {mobileRunningApps.map((app) => (
                  <motion.button
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(event, info) => {
                      if (info.offset.y < -60) {
                        closeApp(app.id);
                        router.push("/");
                      }
                    }}
                    onClick={() => onAppClick(app.id, app.route)}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all select-none ${
                      isRouteActive(app.route)
                        ? "border-blue-500/50 bg-blue-500/20"
                        : "border-white/20 bg-white/40 dark:border-white/10 dark:bg-gray-800/40"
                    } `}
                  >
                    <app.icon
                      size={42}
                      className={
                        isRouteActive(app.route)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    />
                    <span className="font-medium dark:text-white">
                      {app.label}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileTabsOverlay;
