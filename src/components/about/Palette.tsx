/* eslint-disable react-hooks/refs */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { Settings2, Palette as PaletteIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NotebookDecor from "./NotebookDecor";
import BrushSizeSlider from "./BrushSizeSlider";
import { useCanvasDraw } from "./useCanvasDraw";
import { ToolModeSegment } from "./ToolModeSegment";
import { DesktopColorColumn } from "./DesktopColorColumn";
import { DesktopEraserButton } from "./DesktopEraserButton";
import { ClearCanvasButton } from "./ClearCanvasButton";
import { BrushCursor } from "./BrushCursor";

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
        <ToolModeSegment mode={mode} onModeChange={setMode} />

        {/* DESKTOP: Color Column (Hidden on Mobile) */}
        <DesktopColorColumn
          colors={COLORS}
          currentColor={color}
          onColorSelect={setColor}
          onModeChange={() => setMode("brush")}
        />

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
          <DesktopEraserButton mode={mode} onModeChange={setMode} />

          <ClearCanvasButton onClear={clearCanvas} />
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
        <BrushCursor
          lineWidth={lineWidth}
          color={color}
          mode={mode}
          cursor={cursor}
          show={hasFinePointer && mode !== "hand" && pointerInside}
          containerLeft={
            containerRef.current?.getBoundingClientRect().left ?? 0
          }
          containerTop={containerRef.current?.getBoundingClientRect().top ?? 0}
        />
      </div>
    </div>
  );
};

export default Palette;
