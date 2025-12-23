"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useOSStore } from "@/store/osStore";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
}

const DesktopIcon = ({ id, label, icon: Icon, route }: DesktopIconProps) => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const { launchApp, darkMode } = useOSStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDoubleClick = () => {
    launchApp(id);
    setTimeout(() => {
      router.push(route);
    }, 50);
  };

  const handleClick = () => {
    setIsSelected(true);
  };

  return (
    <div
      ref={iconRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`group flex w-24 cursor-pointer flex-col items-center gap-1 rounded-md p-2 transition-all duration-100 ${
        isSelected
          ? "border border-blue-500/50 bg-blue-500/30 backdrop-blur-sm"
          : "border border-transparent hover:bg-black/5 dark:hover:bg-white/10"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center drop-shadow-lg filter">
        <Icon
          size={48}
          className={darkMode ? "text-white" : "text-gray-800"}
          strokeWidth={1.5}
        />
      </div>

      <span
        className={`rounded-sm px-1 text-center text-sm font-medium select-none ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
        style={{
          textShadow: isSelected
            ? "none"
            : darkMode
              ? "0 1px 2px rgba(0,0,0,0.8)"
              : "0 1px 2px rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;
