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

export default function WindowFrame({ id, title, children }: WindowFrameProps) {
  const router = useRouter();
  const { closeApp } = useOSStore();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeApp(id);
      router.push("/");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
       {/* pointer-events-none on container lets clicks pass through to desktop for future transparency
          pointer-events-auto on the window itself ensures interaction.
       */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 pointer-events-auto"
          >
            {/* Header */}
            <Header title={title} onClose={handleClose} />

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}