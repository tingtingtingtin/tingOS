"use client";

import DesktopIcon from '@/components/DesktopIcon';
import { FileText, Terminal, Github } from 'lucide-react';

export default function Desktop() {
  return (
    <main 
      className="min-h-screen w-full bg-cover bg-center overflow-hidden relative selection:bg-transparent"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=3000")',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Icon Grid Area */}
      <div className="relative z-10 p-4 grid grid-flow-col auto-rows-[110px] gap-4 content-start items-start w-fit">
        
        <DesktopIcon 
          label="Projects" 
          icon={Github} 
          route="/projects" 
        />

        <DesktopIcon 
          label="resume.txt" 
          icon={FileText} 
          route="/resume" 
        />
        
        <DesktopIcon 
          label="Terminal" 
          icon={Terminal} 
          route="/contact" 
        />

      </div>
    </main>
  );
}