/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useOSStore } from "@/store/osStore";

type ToolMode = "hand" | "brush" | "eraser";

export const useCanvasDraw = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkMode = useOSStore((s) => s.darkMode);

  // --- State Management ---
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(() => (darkMode ? "#FFFFFF" : "#000000"));
  const [lineWidth, setLineWidth] = useState(8);
  const [mode, setMode] = useState<ToolMode>("hand");

  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pointerInside, setPointerInside] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if ("touches" in e && (e as any).touches && (e as any).touches[0]) {
      return {
        x: (e as any).touches[0].clientX - rect.left,
        y: (e as any).touches[0].clientY - rect.top,
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
      ctx.quadraticCurveTo(
        lastPoint.current.x,
        lastPoint.current.y,
        midX,
        midY,
      );
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

  return {
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
  };
};
