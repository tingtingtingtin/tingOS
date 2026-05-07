import { motion } from "motion/react";

type ToolMode = "hand" | "brush" | "eraser";

interface BrushCursorProps {
  lineWidth: number;
  color: string;
  mode: ToolMode;
  cursor: { x: number; y: number } | null;
  show: boolean;
  containerLeft: number;
  containerTop: number;
}

export const BrushCursor = ({
  lineWidth,
  color,
  mode,
  cursor,
  show,
  containerLeft,
  containerTop,
}: BrushCursorProps) => {
  if (!show || !cursor) return null;

  const size = Math.max(8, lineWidth + 6);

  return (
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
        left: containerLeft,
        top: containerTop,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: "9999px",
          background: mode === "eraser" ? "rgba(255,255,255,0.6)" : color,
          border: "2px solid rgba(0,0,0,0.25)",
        }}
      />
    </motion.div>
  );
};
