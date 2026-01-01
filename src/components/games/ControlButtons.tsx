"use client";

import { Github, Globe, Play } from "lucide-react";
import type { Game } from "@/data/games";

interface ControlButtonsProps {
  onSelect: () => void;
  activeGameData: Game;
  isMobile: boolean;
}

const ControlButtons = ({
  onSelect,
  activeGameData,
  isMobile,
}: ControlButtonsProps) => {
  const hasGithub = Boolean(activeGameData.githubUrl);
  const hasExternal = Boolean(activeGameData.extUrl);
  const hasEmbed = Boolean(activeGameData.embedUrl);
  const isUnsupported = isMobile && activeGameData.desktopOnly;

  return (
    <>
      {/* --- BOTTOM ROW (System Buttons) --- */}
      <div className="relative z-30 flex items-center justify-center gap-8">
        {/* Button 1: GitHub */}
        {hasGithub && (
          <div
            className="group relative flex cursor-pointer flex-col items-center gap-2"
            onClick={() =>
              activeGameData.githubUrl &&
              window.open(activeGameData.githubUrl, "_blank")
            }
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 dark:bg-[#3d3d3d] dark:text-gray-300">
              <Github size={24} />
            </div>
            <span className="absolute bottom-1 text-xs font-bold tracking-tight whitespace-nowrap text-[#00C3E3] opacity-0 transition-opacity group-hover:opacity-100">
              Source
            </span>
          </div>
        )}

        {/* Center: Play Indicator */}
        <div
          className={`group relative flex flex-col items-center ${
            hasEmbed && !isUnsupported ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          onClick={() => hasEmbed && !isUnsupported && onSelect()}
        >
          <div
            className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#00C3E3]/30 bg-white text-[#00C3E3] shadow-lg transition-transform ${
              hasEmbed && !isUnsupported
                ? "group-hover:scale-110 group-active:scale-95"
                : "opacity-50"
            } dark:bg-[#3d3d3d]`}
          >
            <Play fill="currentColor" size={28} className="ml-1" />
          </div>
          <span className="absolute bottom-2 text-xs font-bold tracking-tight whitespace-nowrap text-[#00C3E3]">
            {hasEmbed
              ? isUnsupported
                ? "Unsupported"
                : "Start"
              : "Unavailable"}
          </span>
        </div>

        {/* Button 3: External Link */}
        {hasExternal && (
          <div
            className="group relative flex cursor-pointer flex-col items-center gap-2"
            onClick={() =>
              activeGameData.extUrl &&
              window.open(activeGameData.extUrl, "_blank")
            }
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform group-hover:scale-110 group-active:scale-95 dark:bg-[#3d3d3d] dark:text-gray-300">
              <Globe size={24} />
            </div>
            <span className="absolute bottom-1 text-xs font-bold tracking-tight whitespace-nowrap text-[#00C3E3] opacity-0 transition-opacity group-hover:opacity-100">
              External Link
            </span>
          </div>
        )}
      </div>

      {/* --- CONTROLS FOOTER --- */}
      <div className="z-20 mt-auto mb-2 hidden w-full items-center justify-between border-t border-gray-400 px-8 py-3 text-xs font-bold text-gray-900 md:flex dark:border-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                &lt;
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
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
};

export default ControlButtons;
