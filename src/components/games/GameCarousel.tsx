"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Wifi, BatteryMedium, ChevronLeft, ChevronRight } from "lucide-react";
import type { Game } from "@/data/games";
import TitleArea from "./TitleDescription";

const CARD_SIZE = 268;
const CARD_GAP = 24;
const DESKTOP_VISIBLE_RANGE = 3;

interface GameCarouselProps {
  isMobile: boolean;
  activeIndex: number;
  games: Game[];
  onNavigate: (direction: number) => void;
  onSelect: () => void;
  time: string;
}

const GameCarousel = ({
  isMobile,
  activeIndex,
  games,
  onNavigate,
  onSelect,
  time,
}: GameCarouselProps) => {
  const [showProgress, setShowProgress] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const mouseDownX = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const hideProgressTimer = useRef<NodeJS.Timeout | null>(null);
  const showProgressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showProgressTimer.current) clearTimeout(showProgressTimer.current);
    showProgressTimer.current = setTimeout(() => setShowProgress(true), 0);

    if (hideProgressTimer.current) clearTimeout(hideProgressTimer.current);
    hideProgressTimer.current = setTimeout(() => setShowProgress(false), 2000);

    return () => {
      if (showProgressTimer.current) clearTimeout(showProgressTimer.current);
      if (hideProgressTimer.current) clearTimeout(hideProgressTimer.current);
    };
  }, [activeIndex]);

  const visibleRange = isMobile ? 0 : DESKTOP_VISIBLE_RANGE;

  const handleSelect = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onSelect();
      setIsLaunching(false);
    }, 400);
  };

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
  const isUnsupported = (isMobile && activeGameData.desktopOnly) || false;

  return (
    <>
      {/* System Info Header */}
      <div className="grid w-full grid-cols-3 items-center px-8 pt-4 opacity-80 md:pt-6">
        {/* User Icon (Top Left) */}
        <div className="flex items-center justify-start gap-4">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-400/30 bg-gray-300 dark:bg-gray-700">
            <Image
              src="/profile.jpg"
              alt="User"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Progress Bar - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showProgress ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-2 px-4"
        >
          {games.map((_, i) => {
            const currentWrappedIndex =
              ((activeIndex % games.length) + games.length) % games.length;
            const isActive = i === currentWrappedIndex;

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive
                    ? "#00C3E3"
                    : "rgba(156, 163, 175, 0.5)", // gray-400/50
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-1.5 w-1.5 rounded-full"
              />
            );
          })}
        </motion.div>

        {/* System Status */}
        <div className="flex items-center justify-end gap-4 text-sm font-medium">
          <span>{time}</span>
          <Wifi size={18} />
          <BatteryMedium size={20} />
        </div>
      </div>

      {/* Title Area (Desktop) */}
      <div className="hidden md:block">
        <TitleArea
          title={activeGameData.title}
          description={activeDescription}
          isUnsupported={isUnsupported}
        />
      </div>

      {/* Carousel Track */}
      <div
        className="relative flex h-80 cursor-grab items-center justify-center select-none perspective-dramatic active:cursor-grabbing"
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
                  scale: isCenter ? (isLaunching ? 1.1 : 1.0) : 0.85,
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
                className={`absolute top-4 ${isLaunching && isCenter ? "z-50" : ""}`}
                style={{
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                  left: "50%",
                  marginLeft: -(CARD_SIZE / 2),
                }}
              >
                <div
                  onClick={() =>
                    !isUnsupported && isCenter
                      ? handleSelect()
                      : onNavigate(offset)
                  }
                  className={`group relative h-full w-full cursor-pointer bg-white dark:bg-gray-800 ${isCenter ? "z-20" : "z-10 brightness-90 grayscale-[0.1]"} ${isLaunching && isCenter ? "ring-12 ring-white/50 duration-150" : ""} `}
                >
                  {/* Card */}
                  <div
                    className={`relative h-full w-full overflow-hidden transition-all duration-200 ${
                      isCenter
                        ? "border-4 border-transparent shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-4 ring-[#00C3E3]"
                        : "shadow-lg"
                    } `}
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
          <div className="absolute inset-0 flex items-center justify-between px-0 md:hidden">
            <button
              aria-label="Previous game"
              className="flex h-15 w-15 items-center justify-center text-gray-700 shadow dark:text-white"
              onClick={() => onNavigate(-1)}
            >
              <ChevronLeft size={30} />
            </button>
            <button
              aria-label="Next game"
              className="flex h-15 w-15 items-center justify-center text-gray-700 shadow dark:text-white"
              onClick={() => onNavigate(1)}
            >
              <ChevronRight size={30} />
            </button>
          </div>
        )}
      </div>
      <div className="block md:hidden">
        <TitleArea
          title={activeGameData.title}
          description={activeDescription}
          isUnsupported={isUnsupported}
        />
      </div>
    </>
  );
};

export default GameCarousel;
