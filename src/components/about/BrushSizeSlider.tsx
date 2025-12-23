/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useCallback } from "react";

const BrushSizeSlider = ({
  value,
  onChange,
  min,
  max,
  color,
  vertical = false,
  className = "",
}: {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  color: string;
  vertical?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientY: number, clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      let percentage;
      if (vertical) {
        const relativeY = rect.bottom - clientY;
        percentage = Math.max(0, Math.min(1, relativeY / rect.height));
      } else {
        const relativeX = clientX - rect.left;
        percentage = Math.max(0, Math.min(1, relativeX / rect.width));
      }

      const newValue = Math.round(min + percentage * (max - min));
      onChange(newValue);
    },
    [max, min, onChange, vertical],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent scrolling
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);

    handleMove(e.clientY, e.clientX);

    const onPointerMove = (ev: PointerEvent) =>
      handleMove(ev.clientY, ev.clientX);
    const onPointerUp = (ev: PointerEvent) => {
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener("pointermove", onPointerMove as any);
      target.removeEventListener("pointerup", onPointerUp as any);
    };

    target.addEventListener("pointermove", onPointerMove as any);
    target.addEventListener("pointerup", onPointerUp as any);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      className={`relative flex cursor-pointer touch-none items-center justify-center select-none ${
        vertical ? "h-full w-12" : "h-12 w-full"
      } ${className}`}
    >
      {/* Track Line */}
      <div
        className={`absolute rounded-full bg-gray-200 dark:bg-gray-600 ${
          vertical ? "h-full w-1" : "h-1 w-full"
        }`}
      />

      {/* Thumb / Brush Preview */}
      <div
        className="absolute flex items-center justify-center transition-transform active:scale-110"
        style={{
          left: vertical ? "50%" : `${percentage}%`,
          bottom: vertical ? `${percentage}%` : "50%",
          transform: "translate(-50%, 50%)",
        }}
      >
        <div
          style={{
            width: Math.max(10, value * 0.5),
            height: Math.max(10, value * 0.5),
            backgroundColor: color,
          }}
          className={`rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:border-gray-500 dark:ring-white/10`}
        />
      </div>
    </div>
  );
};

export default BrushSizeSlider;
