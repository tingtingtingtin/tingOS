'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { useOSStore } from '@/store/osStore';


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
  const { launchApp } = useOSStore();

  // Handle clicking "outside" to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      className={`
        w-24 flex flex-col items-center gap-1 p-2 rounded-md cursor-pointer transition-all duration-100 group
        ${isSelected ? 'bg-blue-500/30 border border-blue-500/50 backdrop-blur-sm' : 'hover:bg-white/10 border border-transparent'}
      `}
    >
      {/* Icon Container */}
      <div className="w-12 h-12 flex items-center justify-center filter drop-shadow-lg">
        <Icon size={48} className="text-white" strokeWidth={1.5} />
      </div>

      {/* Label */}
      <span 
        className={`
          text-sm text-white font-medium text-center px-1 rounded-sm select-none
        `}
        style={{ textShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.8)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default DesktopIcon;