"use client";

import DesktopIcon from '@/components/DesktopIcon';
import { apps } from '@/data/apps';

const Desktop = () => {
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
        {apps.map((app) => (
             <DesktopIcon
               key={app.id}
               id={app.id}
               label={app.label} 
               icon={app.icon} 
               route={app.route} 
             />
        ))}

      </div>
    </main>
  );
}

export default Desktop;