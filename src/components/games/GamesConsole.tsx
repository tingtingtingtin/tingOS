"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { games } from "@/data/games";
import GameModal from "./GameModal";
import GameCarousel from "./GameCarousel";
import ControlButtons from "./ControlButtons";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const GamesConsole = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<(typeof games)[0] | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  );
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentGame = useMemo(() => {
    const len = games.length;
    const wrappedIndex = ((activeIndex % len) + len) % len;
    return games[wrappedIndex];
  }, [activeIndex]);

  const tickAudio = useRef<HTMLAudioElement | null>(null);
  const selectAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    tickAudio.current = new Audio("/tick.wav");
    tickAudio.current.volume = 1;
    selectAudio.current = new Audio("/select.mp3");
    selectAudio.current.volume = 0.2;
  }, []);

  const playSound = (type: "tick" | "select") => {
    if (type === "tick" && tickAudio.current) {
      tickAudio.current.currentTime = 0;
      tickAudio.current.play();
      return;
    }
    if (selectAudio.current) {
      selectAudio.current.currentTime = 0;
      selectAudio.current.play().catch(() => {});
    }
  };

  const handleNavigate = useCallback(
    (dir: number) => {
      if (selectedGame) return;
      setActiveIndex((prev) => prev + dir);
      playSound("tick");
    },
    [selectedGame],
  );

  const handleSelect = useCallback(() => {
    if (selectedGame) return;
    if (!currentGame.embedUrl) return;
    setSelectedGame(currentGame);
    playSound("select");
  }, [currentGame, selectedGame]);

  const handleClose = useCallback(() => {
    setSelectedGame(null);
  }, []);

  // --- KEYBOARD ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key))
        e.preventDefault();
      if (e.key === "ArrowLeft") handleNavigate(-1);
      if (e.key === "ArrowRight") handleNavigate(1);
      if (e.key === "Enter" || e.key === " " || e.key === "a") handleSelect();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigate, handleSelect, handleClose]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#EBEBEB] text-gray-900 transition-colors duration-300 dark:bg-[#2D2D2D] dark:text-white">
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentGame.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {currentGame.thumbnail ? (
              <Image
                src={currentGame.thumbnail}
                alt={currentGame.title + " thumbnail"}
                fill
                className="scale-110 object-cover opacity-40"
                loading="eager"
                quality={50}
              />
            ) : (
              <div
                className="h-full w-full opacity-30"
                style={{ backgroundColor: currentGame.color || "#94a3b8" }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl dark:bg-black/40" />
      </div>

      <GameCarousel
        activeIndex={activeIndex}
        games={games}
        onNavigate={handleNavigate}
        onSelect={handleSelect}
        time={time}
        isMobile={isMobile}
      />

      <ControlButtons
        activeGameData={currentGame}
        onSelect={handleSelect}
        isMobile={isMobile}
      />

      <GameModal selectedGame={selectedGame} onClose={handleClose} />
    </div>
  );
};

export default GamesConsole;
