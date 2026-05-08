"use client";

import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useOSStore } from "@/store/osStore";
import Header from "./Header";

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose: () => void;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const TASKBAR_H = 56;

const DraggableWindow = ({
  title,
  children,
  defaultWidth = 800,
  defaultHeight = 560,
  onClose,
}: DraggableWindowProps) => {
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const [isVisible, setIsVisible] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const w = useMotionValue(defaultWidth);
  const h = useMotionValue(defaultHeight);

  useLayoutEffect(() => {
    left.set((window.innerWidth - defaultWidth) / 2);
    top.set((window.innerHeight - TASKBAR_H - defaultHeight) / 2);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest("button")) return;
    const startX = e.clientX - left.get();
    const startY = e.clientY - top.get();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const headerH = headerRef.current?.offsetHeight ?? 40;
      const clampedTop = Math.max(
        0,
        Math.min(window.innerHeight - TASKBAR_H - headerH, ev.clientY - startY),
      );
      const clampedLeft = Math.max(
        100 - w.get(),
        Math.min(window.innerWidth - 100, ev.clientX - startX),
      );
      left.set(clampedLeft);
      top.set(clampedTop);
    };
    const onUp = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = w.get();
    const startH = h.get();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      w.set(Math.max(MIN_WIDTH, startW + ev.clientX - startX));
      h.set(Math.max(MIN_HEIGHT, startH + ev.clientY - startY));
    };
    const onUp = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={reducedMotion ? false : { scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          style={{
            position: "fixed",
            left,
            top,
            width: w,
            height: h,
            zIndex: 50,
          }}
          className="flex flex-col overflow-hidden rounded-t-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            ref={headerRef}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handleHeaderPointerDown}
          >
            <Header title={title} onClose={handleClose} />
          </div>

          <div className="relative flex-1 overflow-auto bg-gray-50 dark:bg-gray-950/50">
            {children}
          </div>

          <div
            className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
            onPointerDown={handleResizePointerDown}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DraggableWindow;
