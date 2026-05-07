import { Eraser } from "lucide-react";

type ToolMode = "hand" | "brush" | "eraser";

interface DesktopEraserButtonProps {
  mode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}

export const DesktopEraserButton = ({
  mode,
  onModeChange,
}: DesktopEraserButtonProps) => {
  return (
    <button
      onClick={() =>
        onModeChange((prev) => (prev === "eraser" ? "brush" : "eraser"))
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
  );
};
