import { RefreshCw } from "lucide-react";

interface ClearCanvasButtonProps {
  onClear: () => void;
}

export const ClearCanvasButton = ({ onClear }: ClearCanvasButtonProps) => {
  return (
    <button
      onClick={onClear}
      className="rounded-lg p-3 text-gray-500 transition-colors hover:cursor-pointer active:bg-red-50 active:text-red-500 md:mt-auto md:mb-20 md:hover:bg-red-50 md:hover:text-red-500"
      title="Clear Canvas"
    >
      <RefreshCw size={20} />
    </button>
  );
};
