"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Game } from "@/data/games";

const CARD_SIZE = 268;
const CARD_GAP = 24;
const DESKTOP_VISIBLE_RANGE = 3;

interface GameCarouselProps {
  activeIndex: number;
  games: Game[];
  onNavigate: (direction: number) => void;
  onSelect: () => void;
}

export function GameCarousel({
  activeIndex,
  games,
  onNavigate,
  onSelect,
}: GameCarouselProps) {
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const mouseDownX = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const visibleRange = isMobile ? 0 : DESKTOP_VISIBLE_RANGE;

  const renderRange = [];
  for (let i = -visibleRange; i <= visibleRange; i++) {
    renderRange.push(activeIndex + i);
  }

  const getGame = (index: number) => {
    const len = games.length;
    const wrappedIndex = ((index % len) + len) % len;
    return games[wrappedIndex];
  };

  const activeGameData = getGame(activeIndex);
  const activeDescription = activeGameData.description ?? "";

  return (
    <>
      {/* Title Area */}
      <div className="flex flex-col mb-8 z-20 text-left md:ml-[15%] md:text-left items-center md:items-start">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="h-6 w-1 bg-[#00C3E3] rounded-full" />
          <h2 className="text-xl md:text-2xl font-medium text-[#00C3E3]">
            {activeGameData.title}
          </h2>
        </div>
        <p className="ml-3 mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
          {activeDescription}
        </p>
      </div>

      {/* Carousel Track */}
      <div
        className="relative flex h-80 items-center justify-center perspective-dramatic cursor-grab active:cursor-grabbing select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(deltaX) > 50) {
            onNavigate(deltaX > 0 ? -1 : 1);
          }
          touchStartX.current = null;
        }}
        onMouseDown={(e) => {
          mouseDownX.current = e.clientX;
          isDraggingRef.current = true;
        }}
        onMouseMove={(e) => {
          if (!isDraggingRef.current || mouseDownX.current === null) return;
          const deltaX = e.clientX - mouseDownX.current;
          if (Math.abs(deltaX) > 20) {
            isDraggingRef.current = false;
            onNavigate(deltaX > 0 ? -1 : 1);
          }
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
          mouseDownX.current = null;
        }}
        onMouseLeave={() => {
          isDraggingRef.current = false;
          mouseDownX.current = null;
        }}
      >
        <div className="relative h-full w-full max-w-6xl">
          {renderRange.map((index) => {
            const game = getGame(index);
            const isCenter = index === activeIndex;
            const offset = index - activeIndex;
            const backgroundColor = game.color ?? "transparent";
            const hasThumbnail = Boolean(game.thumbnail);

            return (
              <motion.div
                key={index}
                layout
                initial={{ x: offset * (CARD_SIZE + CARD_GAP), scale: 0.8 }}
                animate={{
                  x: offset * (CARD_SIZE + CARD_GAP),
                  scale: isCenter ? 1.0 : 0.85,
                  opacity: Math.abs(offset) > visibleRange ? 0 : 1,
                  zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                  rotateY: offset * 10,
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                  mass: 1,
                }}
                className="absolute top-4"
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE, // Making it square based on your variable
                  left: "50%",
                  marginLeft: -(CARD_SIZE / 2), // This perfectly anchors the "0" point to the center
                }}
              >
                <div
                  onClick={() =>
                    isCenter ? onSelect() : onNavigate(offset)
                  }
                  className={`
                    group relative h-full w-full cursor-pointer bg-white dark:bg-gray-800 
                    ${isCenter ? "z-20" : "z-10 brightness-90 grayscale-[0.1]"}
                  `}
                >
                  {/* Card */}
                  <div
                    className={`
                      relative h-full w-full overflow-hidden 
                      transition-all duration-200
                      ${
                        isCenter
                          ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-4 ring-[#00C3E3] border-4 border-transparent"
                          : "shadow-lg"
                      }
                    `}
                    style={{ backgroundColor }}
                  >
                    {hasThumbnail ? (
                      <Image
                        src={game.thumbnail as string}
                        alt={game.title}
                        width={1000}
                        height={1000}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-6 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {game.title}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {isMobile && (
          <div className="absolute inset-0 flex items-center justify-between px-4 md:hidden">
            <button
              aria-label="Previous game"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow dark:bg-gray-800/80 dark:text-white"
              onClick={() => onNavigate(-1)}
            >
              {"<"}
            </button>
            <button
              aria-label="Next game"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow dark:bg-gray-800/80 dark:text-white"
              onClick={() => onNavigate(1)}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
