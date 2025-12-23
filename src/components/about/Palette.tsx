/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Eraser } from "lucide-react";
import { motion } from "motion/react";
import NotebookDecor from "./NotebookDecor";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(8);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pointerInside, setPointerInside] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      // Preserve current drawing by drawing to a temp canvas first
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
          // getImageData can fail if canvas is tainted; fallback to drawImage
          tempCtx.drawImage(canvas, 0, 0);
        }
      }

      const newW = container.clientWidth;
      const newH = container.clientHeight;
      canvas.width = newW;
      canvas.height = newH;

      // Re-apply styles after resize clears context
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      // Paint the preserved image scaled to new size
      if (temp.width && temp.height) {
        try {
          ctx.drawImage(temp, 0, 0, temp.width, temp.height, 0, 0, newW, newH);
        } catch (e) {
          // ignore drawing failures
        }
      }
    };

    // Initial sizing
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [color, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  // Points used for quadratic smoothing
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const setCtxForTool = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.fillStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    }
  };

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
    e.preventDefault();
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

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const handleMove = (ev: MouseEvent) => {
      const rect = c.getBoundingClientRect();
      setCursor({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
    };
    const handleEnter = () => setPointerInside(true);
    const handleLeave = () => {
      setPointerInside(false);
      setCursor(null);
    };
    const handleTouchMove = (t: TouchEvent) => {
      const touch = t.touches[0];
      if (!touch) return;
      const rect = c.getBoundingClientRect();
      setCursor({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    };

    c.addEventListener("mousemove", handleMove);
    c.addEventListener("mouseenter", handleEnter);
    c.addEventListener("mouseleave", handleLeave);
    c.addEventListener("touchmove", handleTouchMove as EventListener);
    c.addEventListener("touchmove", handleTouchMove as EventListener);

    // ensure drawing stops if pointer released outside canvas
    const handleWindowUp = () => {
      stopDrawing();
    };

    // keyboard shortcuts: E toggles eraser, C clears canvas
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
        setTool((t) => (t === "brush" ? "eraser" : "brush"));
      } else if (k === "c") {
        clearCanvas();
      }
    };

    window.addEventListener("mouseup", handleWindowUp);
    window.addEventListener("touchend", handleWindowUp);
    window.addEventListener("touchcancel", handleWindowUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      c.removeEventListener("mousemove", handleMove);
      c.removeEventListener("mouseenter", handleEnter);
      c.removeEventListener("mouseleave", handleLeave);
      c.removeEventListener("touchmove", handleTouchMove as EventListener);

      window.removeEventListener("mouseup", handleWindowUp);
      window.removeEventListener("touchend", handleWindowUp);
      window.removeEventListener("touchcancel", handleWindowUp);
      window.removeEventListener("keydown", handleKeyDown);
    };

    return () => {
      c.removeEventListener("mousemove", handleMove);
      c.removeEventListener("mouseenter", handleEnter);
      c.removeEventListener("mouseleave", handleLeave);
      c.removeEventListener("touchmove", handleTouchMove as EventListener);
    };
  }, []);

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPosFromMouse(e as any);
    if (!pos || !lastPoint.current) return;

    // Quadratic smoothing using midpoint
    const midX = (lastPoint.current.x + pos.x) / 2;
    const midY = (lastPoint.current.y + pos.y) / 2;

    setCtxForTool(ctx);
    ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, midX, midY);
    ctx.stroke();

    lastPoint.current = pos;
    moved.current = true;
  };

  const stopDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
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

    // Single-click: draw a dot
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
      if (tool === "eraser") {
        ctx.fill();
      } else {
        ctx.fill();
      }
    }

    // finish path
    ctx.closePath();
    setIsDrawing(false);
    lastPoint.current = null;
    moved.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* --- Sidebar (Tools) --- */}
      <aside className="z-10 flex w-20 flex-col items-center gap-4 border-r border-gray-200 bg-white py-6 md:w-24 dark:border-gray-800 dark:bg-gray-800">
        {/* Color Swatches */}
        <div className="flex flex-col gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c
                  ? "scale-110 border-gray-400 shadow-md"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        <div className="my-2 h-px w-8 bg-gray-300 dark:bg-gray-700" />

        {/* Tools */}

        <button
          onClick={() => setTool((t) => (t === "brush" ? "eraser" : "brush"))}
          aria-pressed={tool === "eraser"}
          title="Eraser"
          className={`rounded-lg p-3 transition-transform ${tool === "eraser" ? "scale-105 bg-gray-100 shadow-md dark:bg-gray-700" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        >
          <Eraser size={20} />
        </button>

        <div className="flex w-full flex-col items-center px-3">
          <label className="mb-2 text-xs text-gray-400">Size</label>
          <div className="flex h-32 items-center">
            <input
              aria-label="Brush size"
              type="range"
              min={1}
              max={80}
              value={lineWidth}
              onChange={(v) =>
                setLineWidth(Number((v.target as HTMLInputElement).value))
              }
              className="mt-1 w-32 origin-center -rotate-90 transform"
            />
          </div>
        </div>

        <button
          onClick={clearCanvas}
          className="mt-auto mb-20 rounded-lg p-3 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Clear Canvas"
        >
          <RefreshCw size={20} />
        </button>
      </aside>

      {/* --- Main Canvas Area --- */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <NotebookDecor />

        {/* 2. Canvas Layer (Overlay) */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={(e) => stopDrawing(e)}
          onMouseLeave={(e) => stopDrawing(e)}
          onTouchStart={(e) => startDrawing(e)}
          onTouchMove={(e) => draw(e)}
          onTouchEnd={(e) => stopDrawing(e)}
          className="absolute inset-0 z-10 cursor-none touch-none"
          style={{ background: "transparent" }}
        />

        {/* Brush preview cursor */}
        {pointerInside && cursor && (
          <motion.div
            initial={false}
            animate={{ x: cursor.x, y: cursor.y }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-none fixed z-50"
            style={{
              left: containerRef.current?.getBoundingClientRect().left ?? 0,
              top: containerRef.current?.getBoundingClientRect().top ?? 0,
            }}
          >
            {(() => {
              const prefersDark =
                typeof window !== "undefined" &&
                (document.documentElement.classList.contains("dark") ||
                  window.matchMedia?.("(prefers-color-scheme: dark)").matches);
              const visibleSize = Math.max(8, lineWidth + 6); // slightly wider than linewidth
              const borderColor = prefersDark
                ? "rgba(255,255,255,0.85)"
                : "rgba(0,0,0,0.25)";
              return (
                <div
                  style={{
                    width: visibleSize,
                    height: visibleSize,
                    marginLeft: -visibleSize / 2,
                    marginTop: -visibleSize / 2,
                    borderRadius: "9999px",
                    background:
                      tool === "eraser" ? "rgba(255,255,255,0.6)" : color,
                    border: `2px solid ${borderColor}`,
                    boxShadow:
                      tool === "eraser"
                        ? "0 0 0 1px rgba(0,0,0,0.12) inset"
                        : "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Palette;
