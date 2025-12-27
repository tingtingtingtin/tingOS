"use client";

import { Github, Globe, Play } from "lucide-react";
import type { Game } from "@/data/games";

interface ControlButtonsProps {
  onSelect: () => void;
  activeGameData: Game;
}

export function ControlButtons({
  onSelect,
  activeGameData,
}: ControlButtonsProps) {
  const hasGithub = Boolean(activeGameData.githubUrl);
  const hasExternal = Boolean(activeGameData.extUrl);
  const hasEmbed = Boolean(activeGameData.embedUrl);

  return (
    <>
      {/* --- BOTTOM ROW (System Buttons) --- */}
      <div className="relative z-30 md:mb-4 mb-20 flex items-center justify-center gap-8">
        {/* Button 1: GitHub */}
        {hasGithub && (
          <div
            className="flex flex-col items-center gap-2 group cursor-pointer relative"
            onClick={() =>
              activeGameData.githubUrl &&
              window.open(activeGameData.githubUrl, "_blank")
            }
          >
            <div className="flex h-12 w-12 mb-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 dark:bg-[#3d3d3d] dark:text-gray-300">
              <Github size={24} />
            </div>
            <span className="absolute bottom-1 whitespace-nowrap text-xs font-bold tracking-tight text-[#00C3E3] opacity-0 transition-opacity group-hover:opacity-100">
              Source
            </span>
          </div>
        )}

        {/* Center: Play Indicator */}
        <div
          className={`flex flex-col items-center gap-2 mb-2 group ${hasEmbed ? "cursor-pointer" : "cursor-not-allowed"}`}
          onClick={() => hasEmbed && onSelect()}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#00C3E3]/30 bg-white text-[#00C3E3] shadow-lg transition-transform ${hasEmbed ? "group-hover:scale-110 group-active:scale-95" : "opacity-50"} dark:bg-[#3d3d3d]`}>
            <Play fill="currentColor" size={28} className="ml-1" />
          </div>
          <span className="text-xs font-bold tracking-tight text-[#00C3E3]">
            {hasEmbed ? "Start" : "Unavailable"}
          </span>
        </div>

        {/* Button 3: External Link */}
        {hasExternal && (
          <div
            className="flex flex-col items-center gap-2 group cursor-pointer relative"
            onClick={() =>
              activeGameData.extUrl && window.open(activeGameData.extUrl, "_blank")
            }
          >
            <div className="flex h-12 w-12 mb-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 dark:bg-[#3d3d3d] dark:text-gray-300">
              <Globe size={24} />
            </div>
            <span className="absolute bottom-1 whitespace-nowrap text-xs font-bold tracking-tight text-[#00C3E3] opacity-0 transition-opacity group-hover:opacity-100">
              External Link
            </span>
          </div>
        )}
      </div>

      {/* --- CONTROLS FOOTER --- */}
      <div className="hidden md:flex w-full items-center justify-between border-t border-gray-300 bg-[#EBEBEB] px-8 py-3 text-xs font-bold text-gray-500 dark:border-gray-700 dark:bg-[#2D2D2D] dark:text-gray-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded dark:bg-gray-800 dark:text-white bg-white text-gray-900">
                &lt;
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded dark:bg-gray-800 dark:text-white bg-white text-gray-900">
                &gt;
              </span>
            </div>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black dark:bg-gray-800 dark:text-white">
              A
            </span>
            <span>Start</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Ver. 16.0.3</span>
        </div>
      </div>
    </>
  );
}
