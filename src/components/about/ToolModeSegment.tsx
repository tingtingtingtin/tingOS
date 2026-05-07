import { Hand, PenLine, Eraser } from "lucide-react";

type ToolMode = "hand" | "brush" | "eraser";

interface ToolModeSegmentProps {
  mode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}

export const ToolModeSegment = ({
  mode,
  onModeChange,
}: ToolModeSegmentProps) => {
  return (
    <div className="flex items-center rounded-2xl bg-gray-100 p-1 md:hidden dark:bg-gray-700/50">
      <button
        onClick={() => onModeChange("hand")}
        className={`rounded-xl px-4 py-2 transition-all ${
          mode === "hand"
            ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
      >
        <Hand size={20} />
      </button>
      <button
        onClick={() => onModeChange("brush")}
        className={`rounded-xl px-4 py-2 transition-all ${
          mode === "brush"
            ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
      >
        <PenLine size={20} />
      </button>
      <button
        onClick={() => onModeChange("eraser")}
        className={`rounded-xl px-4 py-2 transition-all ${
          mode === "eraser"
            ? "bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
      >
        <Eraser size={20} />
      </button>
    </div>
  );
};
