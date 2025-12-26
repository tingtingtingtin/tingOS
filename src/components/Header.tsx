"use client";

import { Minus, X } from "lucide-react";

interface HeaderProps {
  title: string;
  onClose: () => void;
  onMinimize?: () => void;
}

const Header = ({ title, onClose, onMinimize }: HeaderProps) => {
  return (
    <header
      // TODO: handle class for dragability
      className="flex items-center justify-between border-b border-gray-300 bg-gray-200 p-2 select-none dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center gap-2 px-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
        {/* TODO: Add a small icon here based on the app later */}
        {title}
      </div>
      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="flex items-center justify-center rounded p-1 text-gray-500 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700"
            title="Minimize"
          >
            <Minus size={16} />
          </button>
        )}
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded p-1 text-gray-500 transition-colors hover:bg-red-500 hover:text-white"
          title="Close App"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
