"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Game } from "@/data/games";

interface GameModalProps {
  selectedGame: Game | null;
  onClose: () => void;
}

export function GameModal({ selectedGame, onClose }: GameModalProps) {
  return (
    <AnimatePresence>
      {selectedGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 p-2"
        >
          {/* Header */}
          <div className="mb-4 flex w-full max-w-5xl items-center justify-between text-white">
            <h2 className="text-xl font-bold">{selectedGame.title}</h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 px-4 py-1 hover:bg-white/30"
            >
              Close
            </button>
          </div>

          {/* Iframe */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="h-[90vh] w-full max-w-5xl overflow-hidden rounded-sm bg-black shadow-2xl ring-1 ring-white/10"
          >
            <iframe
              src={selectedGame.embedUrl}
              className="h-full w-full border-0"
              allowFullScreen
              allow="autoplay; gamepad; gyroscope; accelerometer"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
