/* eslint-disable react-hooks/refs */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import {
  RefreshCw,
  Eraser,
  Hand,
  PenLine,
  Settings2,
  Palette as PaletteIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NotebookDecor from "./NotebookDecor";
import BrushSizeSlider from "./BrushSizeSlider";
import { useCanvasDraw } from "./useCanvasDraw";

const COLORS = [
  "#000000", // Black
  "#FF3B30", // Red
  "#4CD964", // Green
  "#007AFF", // Blue
  "#FFD60A", // Yellow
  "#FF2D55", // Pink
  "#FFFFFF", // White
];

const Palette = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile Popover States
  const [showMobileSize, setShowMobileSize] = useState(false);
  const [showMobileColors, setShowMobileColors] = useState(false);

  // Canvas drawing logic
  const {
    canvasRef,
    color,
    setColor,
    lineWidth,
    setLineWidth,
    mode,
    setMode,
    cursor,
    pointerInside,
    hasFinePointer,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  } = useCanvasDraw(containerRef);

  return (
    <div className="flex h-full flex-col-reverse bg-gray-50 font-sans text-gray-800 md:flex-row dark:bg-gray-900 dark:text-gray-100">
      {/* --- Toolbar --- */}
      <aside className="z-20 flex w-full shrink-0 flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 pb-4 shadow-sm md:h-full md:w-24 md:flex-col md:justify-start md:overflow-hidden md:border-t-0 md:border-r md:py-6 dark:border-gray-800 dark:bg-gray-800">
        {/* MOBILE: Segmented Control (Hand | Brush | Eraser) */}
        <div className="flex items-center rounded-2xl bg-gray-100 p-1 md:hidden dark:bg-gray-700/50">
          <button
            onClick={() => setMode("hand")}
            className={`rounded-xl px-4 py-2 transition-all ${
              mode === "hand"
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Hand size={20} />
          </button>
          <button
            onClick={() => setMode("brush")}
            className={`rounded-xl px-4 py-2 transition-all ${
              mode === "brush"
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <PenLine size={20} />
          </button>
          <button
            onClick={() => setMode("eraser")}
            className={`rounded-xl px-4 py-2 transition-all ${
              mode === "eraser"
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Eraser size={20} />
          </button>
        </div>

        {/* DESKTOP: Color Column (Hidden on Mobile) */}
        <div className="hidden flex-col gap-3 overflow-visible px-0 md:flex">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setMode("brush");
              }}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 hover:cursor-pointer ${color === c ? "scale-110 border-gray-400 shadow-md" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <div className="my-2 h-px w-8 bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* MOBILE: Right Side - Action Groups */}
        <div className="flex items-center gap-2 md:w-full md:flex-col md:gap-4">
          {/* Mobile Color Popover Trigger */}
          <div className="relative md:hidden">
            <button
              onClick={() => {
                setShowMobileColors(!showMobileColors);
                setShowMobileSize(false);
              }}
              className="rounded-full border border-gray-700 p-2 dark:border-gray-700"
              style={{ backgroundColor: color }}
            >
              <PaletteIcon
                size={20}
                className="text-white/50 mix-blend-difference"
              />
            </button>
            <AnimatePresence>
              {showMobileColors && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed bottom-32 left-1/2 z-60 flex w-[90vw] max-w-sm -translate-x-1/2 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                >
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        setMode("brush");
                        setShowMobileColors(false);
                      }}
                      className={`h-10 w-10 rounded-full border-2 ${color === c ? "scale-110 border-gray-400" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Size Slider (Mobile Popover / Desktop Inline) */}
          <div className="relative md:flex md:w-full md:flex-col md:items-center">
            {/* Mobile Toggle Button */}
            <button
              className="z-60 rounded-lg p-3 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700"
              onClick={() => {
                setShowMobileSize(!showMobileSize);
                setShowMobileColors(false);
              }}
            >
              <Settings2 size={20} />
            </button>

            {/* Mobile Popover Slider (Horizontal) */}
            <AnimatePresence>
              {showMobileSize && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="fixed bottom-32 left-1/2 z-60 flex w-[90vw] max-w-sm -translate-x-1/2 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-xl md:hidden dark:border-gray-700 dark:bg-gray-800"
                >
                  <label className="mb-4 block text-xs font-bold text-gray-400">
                    Brush Size
                  </label>
                  <BrushSizeSlider
                    value={lineWidth}
                    onChange={setLineWidth}
                    min={1}
                    max={50}
                    color={color}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Sidebar Slider (Vertical) */}
            <div className="hidden h-40 w-full flex-col items-center justify-center pt-4 md:flex">
              <BrushSizeSlider
                value={lineWidth}
                onChange={setLineWidth}
                min={1}
                max={60}
                color={color}
                vertical={true}
              />
            </div>
          </div>

          {/* Desktop Eraser Button */}
          <button
            onClick={() =>
              setMode((prev) => (prev === "eraser" ? "brush" : "eraser"))
            }
            aria-pressed={mode === "eraser"}
            title={mode === "eraser" ? "Disable Eraser" : "Enable Eraser"}
            className={`hidden rounded-lg p-3 transition-transform hover:cursor-pointer md:block ${
              mode === "eraser"
                ? "scale-105 bg-gray-100 shadow-md dark:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Eraser size={20} />
          </button>

          <button
            onClick={clearCanvas}
            className="rounded-lg p-3 text-gray-500 transition-colors hover:cursor-pointer active:bg-red-50 active:text-red-500 md:mt-auto md:mb-20 md:hover:bg-red-50 md:hover:text-red-500"
            title="Clear Canvas"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </aside>

      {/* --- Main Area --- */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <NotebookDecor />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={(e) => stopDrawing(e)}
          onMouseLeave={(e) => stopDrawing(e)}
          onTouchStart={(e) => startDrawing(e)}
          onTouchMove={(e) => draw(e)}
          onTouchEnd={(e) => stopDrawing(e)}
          className={`absolute inset-0 z-10 ${mode === "hand" ? "pointer-events-none cursor-grab" : "pointer-events-auto cursor-none touch-none"}`}
          style={{ background: "transparent" }}
        />

        {/* Brush Cursor (only on fine-pointer devices) */}
        {hasFinePointer && mode !== "hand" && pointerInside && cursor && (
          <motion.div
            initial={false}
            animate={{ x: cursor.x, y: cursor.y }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 0,
            }}
            className="pointer-events-none fixed z-50 hidden md:block"
            style={{
              left: containerRef.current?.getBoundingClientRect().left ?? 0,
              top: containerRef.current?.getBoundingClientRect().top ?? 0,
            }}
          >
            <div
              style={{
                width: Math.max(8, lineWidth + 6),
                height: Math.max(8, lineWidth + 6),
                marginLeft: -Math.max(8, lineWidth + 6) / 2,
                marginTop: -Math.max(8, lineWidth + 6) / 2,
                borderRadius: "9999px",
                background: mode === "eraser" ? "rgba(255,255,255,0.6)" : color,
                border: "2px solid rgba(0,0,0,0.25)",
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Palette;
