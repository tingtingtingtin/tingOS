"use client";

import Image from 'next/image';

const NotebookDecor = () => {
  return (
    <div className="absolute inset-0 p-8 md:p-12 z-0 pointer-events-none overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto h-full flex flex-col md:flex-row gap-12 items-start justify-center md:justify-start">
        <div className="shrink-0 w-full md:w-1/3 flex flex-col gap-6 bg-white/80 dark:bg-black/20 px-8 pt-8 pb-20 rotate-2 shadow-md">
          <div className="relative group aspect-square w-full overflow-hidden">
            <Image
              src="/profile.jpg"
              alt="Tingxuan Wu"
              fill
              className="z-10 object-cover rounded-md shadow-sm border-4 border-white dark:border-gray-700 bg-white"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-500 dark:text-white mb-2">
              Ting<span className='opacity-50'>xuan</span> Wu
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Engineer & Artist</p>
          </div>
        </div>

        <div className="grow pt-4 md:pt-8 font-mono text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
          <div className="relative pl-6 border-l-2 border-blue-500/30">
            <p className="text-lg mb-4">
              Hello! I&apos;m currently a <span className="font-bold text-gray-900 dark:text-white">MS Computer Science student</span> at UC Riverside, aiming for graduation in <span className="underline decoration-blue-500/50 decoration-2">June 2026</span>.
            </p>
            <p className="text-lg">I love making all sorts of things.</p>
          </div>

          <div>
            <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4">OFFLINE STATUS</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span>Sketching and digital art</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>Learning anime songs on guitar</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Making characters in D&D</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Playing Overwatch, Hoyoverse games, LoL (sadly)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>Hanging out with my cat</span>
              </li>
            </ul>
            <div className="mt-8 opacity-60">Feel free to draw using the tools and space provided!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotebookDecor;