/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const COLORS = [
  "#000000", // Black
  "#FF3B30", // Red
  "#4CD964", // Green
  "#007AFF", // Blue
  "#FFD60A", // Yellow
  "#FF2D55", // Pink
  "#FFFFFF", // White
];

type ToolMode = "hand" | "brush" | "eraser";

const Palette = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State Management ---
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(8);

  const [mode, setMode] = useState<ToolMode>("hand");

  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(true);

  // Mobile Popover States
  const [showMobileSize, setShowMobileSize] = useState(false);
  const [showMobileColors, setShowMobileColors] = useState(false);

  // --- Initial Mode Setup ---
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setMode("brush");
    }
  }, []);

  // Detect pointer capabilities (fine vs coarse)
  useEffect(() => {
    try {
      const fine =
        window.matchMedia &&
        (window.matchMedia("(pointer: fine)").matches ||
          window.matchMedia("(any-pointer: fine)").matches);
      setHasFinePointer(!!fine);
    } catch {
      setHasFinePointer(true);
    }
  }, []);

  // --- Canvas Resizing Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const oldW = canvas.width;
      const oldH = canvas.height;
      const temp = document.createElement("canvas");
      temp.width = oldW || 1;
      temp.height = oldH || 1;
      const tempCtx = temp.getContext("2d");
      if (tempCtx && oldW && oldH) {
        try {
          const img = ctx.getImageData(0, 0, oldW, oldH);
          tempCtx.putImageData(img, 0, 0);
        } catch (e) {
          tempCtx.drawImage(canvas, 0, 0);
        }
      }

      const newW = container.clientWidth;
      const newH = container.clientHeight;
      canvas.width = newW;
      canvas.height = newH;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (temp.width && temp.height) {
        try {
          ctx.drawImage(temp, 0, 0, temp.width, temp.height, 0, 0, newW, newH);
        } catch (e) {
          // ignore
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [color, lineWidth]);

  // --- Drawing Logic ---
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const setCtxForTool = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = lineWidth;

      if (mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.fillStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
      }
    },
    [color, lineWidth, mode],
  );

  const getPosFromMouse = (e: MouseEvent | React.MouseEvent | React.Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e && e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const me = e as MouseEvent;
    return {
      x: (me as any).clientX - rect.left,
      y: (me as any).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode === "hand") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosFromMouse(e as any);
    if (!pos) return;

    setCtxForTool(ctx);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPoint.current = pos;
    moved.current = false;
    setIsDrawing(true);
  };

  const drawingRequestRef = useRef<number | null>(null);

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || mode === "hand") return;
    if (drawingRequestRef.current) return;
    drawingRequestRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const pos = getPosFromMouse(e as any);
      
      if (!ctx || !pos || !lastPoint.current) {
        drawingRequestRef.current = null;
        return;
      }

      const midX = (lastPoint.current.x + pos.x) / 2;
      const midY = (lastPoint.current.y + pos.y) / 2;

      setCtxForTool(ctx);
      ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, midX, midY);
      ctx.stroke();

      lastPoint.current = pos;
      moved.current = true;
      drawingRequestRef.current = null; // Reset for next frame
    });
  };

  const stopDrawing = useCallback(
    (e?: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsDrawing(false);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsDrawing(false);
        return;
      }

      if (!moved.current && lastPoint.current) {
        setCtxForTool(ctx);
        ctx.beginPath();
        ctx.arc(
          lastPoint.current.x,
          lastPoint.current.y,
          Math.max(1, lineWidth / 2),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.closePath();
      setIsDrawing(false);
      lastPoint.current = null;
      moved.current = false;
    },
    [isDrawing, lineWidth, setCtxForTool],
  );

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- Interaction Handlers ---
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const handleMove = (ev: MouseEvent) => {
      if (mode === "hand" || !hasFinePointer) return;
      const rect = c.getBoundingClientRect();
      setCursor({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
    };
    const handleEnter = () => setPointerInside(true);
    const handleLeave = () => {
      setPointerInside(false);
      setCursor(null);
    };

    c.addEventListener("mousemove", handleMove);
    c.addEventListener("mouseenter", handleEnter);
    c.addEventListener("mouseleave", handleLeave);

    const handleWindowUp = () => stopDrawing();
    window.addEventListener("mouseup", handleWindowUp);
    window.addEventListener("touchend", handleWindowUp);

    const handleKeyDown = (ev: KeyboardEvent) => {
      const target = ev.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as any).isContentEditable)
      )
        return;

      const k = (ev.key || "").toLowerCase();
      if (k === "e") {
        setMode((prev) => (prev === "eraser" ? "brush" : "eraser"));
      } else if (k === "c") {
        clearCanvas();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      c.removeEventListener("mousemove", handleMove);
      c.removeEventListener("mouseenter", handleEnter);
      c.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mouseup", handleWindowUp);
      window.removeEventListener("touchend", handleWindowUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, stopDrawing, hasFinePointer]);

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
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "scale-110 border-gray-400 shadow-md" : "border-transparent"}`}
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
            title="Eraser"
            className={`hidden rounded-lg p-3 transition-transform md:block ${
              mode === "eraser"
                ? "scale-105 bg-gray-100 shadow-md dark:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Eraser size={20} />
          </button>

          <button
            onClick={clearCanvas}
            className="rounded-lg p-3 text-gray-500 transition-colors active:bg-red-50 active:text-red-500 md:mt-auto md:mb-20 md:hover:bg-red-50 md:hover:text-red-500"
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
