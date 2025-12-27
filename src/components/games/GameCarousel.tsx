"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Game } from "@/data/games";

const CARD_SIZE = 268;
const CARD_GAP = 24;
const VISIBLE_RANGE = 3;

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
  const renderRange = [];
  for (let i = -VISIBLE_RANGE; i <= VISIBLE_RANGE; i++) {
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
      <div className="flex flex-col mb-8 z-20 ml-[15%] text-left">
        <div className="flex items-center gap-4">
          <div className="h-6 w-1 bg-[#00C3E3] rounded-full" />
          <h2 className="text-xl md:text-2xl font-medium text-[#00C3E3]">
            {activeGameData.title}
          </h2>
        </div>
        <p className="ml-3 mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
          {activeDescription}
        </p>
      </div>

      {/* Carousel Track */}
      <div className="relative flex h-80 items-center justify-center perspective-dramatic">
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
                  opacity: Math.abs(offset) > VISIBLE_RANGE - 0.5 ? 0 : 1,
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
      </div>
    </>
  );
}
