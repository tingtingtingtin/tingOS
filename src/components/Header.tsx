"use client";

import { X } from "lucide-react";

interface HeaderProps {
  title: string;
  onClose: () => void;
}

const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <header 
      // TODO: handle class for dragability
      className="bg-gray-200 dark:bg-gray-800 p-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 select-none"
    >
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 px-2 flex items-center gap-2">
          {/* TODO: Add a small icon here based on the app later */}
          {title}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors text-gray-500 flex items-center justify-center"
          title="Close App"
        >
          <X size={18} />
        </button>
    </header>
  )
}

export default Header;