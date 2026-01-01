"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOSStore } from "@/store/osStore";
import Header from "./Header";

interface WindowFrameProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const WindowFrame = ({ id, title, children }: WindowFrameProps) => {
  const router = useRouter();
  const { closeApp, reducedMotion } = useOSStore();
  const [isVisible, setIsVisible] = useState(true);

  const handleMinimize = () => {
    router.push("/");
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeApp(id);
      router.push("/");
    }, 300);
  };

  const variants = {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 20 },
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center pb-14">
      {/* pointer-events-none on container lets clicks pass through to desktop for future transparency

          pointer-events-auto on the window itself ensures interaction.

       */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={reducedMotion ? false : "initial"}
            animate="animate"
            exit={reducedMotion ? { opacity: 0 } : "exit"}
            variants={variants}
            transition={{
              duration: reducedMotion ? 0 : 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-t-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            {/* Header */}
            <Header
              title={title}
              onClose={handleClose}
              onMinimize={handleMinimize}
            />

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindowFrame;
