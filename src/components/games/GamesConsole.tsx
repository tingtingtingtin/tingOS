"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { games } from "@/data/games";
import { GameModal } from "./GameModal";
import { GameCarousel } from "./GameCarousel";
import { ControlButtons } from "./ControlButtons";

export default function GamesConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);

  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);


  const tickAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    tickAudio.current = new Audio("/tick.wav");
    tickAudio.current.volume = 1;
  }, []);

  // --- AUDIO ---
  const playSound = (type: "tick" | "select") => {
    if (type === "tick" && tickAudio.current) {
      tickAudio.current.currentTime = 0;
      tickAudio.current.play();
      return;
    }
    const audio = new Audio("/select.mp3");
    audio.volume = 0.2
    audio.play().catch(() => {});
  };

  useEffect(() => {
    playSound("select");
  }, [])

  // --- NAVIGATION ---
  const handleNavigate = useCallback((dir: number) => {
    if (selectedGame) return;
    setActiveIndex((prev) => prev + dir);
    playSound("tick");
  }, [selectedGame]);

  const handleSelect = useCallback(() => {
    if (selectedGame) return;
    const len = games.length;
    const actualIndex = ((activeIndex % len) + len) % len;
    const game = games[actualIndex];
    if (!game.embedUrl) return;
    setSelectedGame(game);
    playSound("select");
  }, [activeIndex, selectedGame]);

  const handleClose = () => setSelectedGame(null);

  // --- KEYBOARD ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") handleNavigate(-1);
      if (e.key === "ArrowRight") handleNavigate(1);
      if (e.key === "Enter" || e.key === " " || e.key === "a") handleSelect();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigate, handleSelect]);

  // --- RENDER LOGIC ---
  const getGame = (index: number) => {
    const len = games.length;
    const wrappedIndex = ((index % len) + len) % len;
    return games[wrappedIndex];
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#EBEBEB] text-gray-900 transition-colors duration-300 dark:bg-[#2D2D2D] dark:text-white">
      <div className="relative flex flex-1 flex-col justify-center">
        <GameCarousel 
          activeIndex={activeIndex}
          games={games}
          onNavigate={handleNavigate}
          onSelect={handleSelect}
          time={time}
        />
      </div>

      <ControlButtons 
        activeGameData={getGame(activeIndex)}
        onSelect={handleSelect}
      />

      <GameModal selectedGame={selectedGame} onClose={handleClose} />

    </div>
  );
}