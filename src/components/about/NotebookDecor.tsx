"use client";

import Image from "next/image";

const NotebookDecor = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-y-auto p-8 select-none md:p-12">
      <div className="mx-auto flex h-full max-w-4xl flex-col items-start justify-center gap-12 md:flex-row md:justify-start">
        <div className="flex w-full shrink-0 rotate-2 flex-col gap-6 bg-white/80 px-8 pt-8 pb-20 shadow-md md:w-1/3 dark:bg-black/20">
          <div className="group relative aspect-square w-full overflow-hidden">
            <Image
              src="/profile.jpg"
              alt="Tingxuan Wu"
              fill
              className="z-10 rounded-md border-4 border-white bg-white object-cover shadow-sm dark:border-gray-700"
              priority
            />
          </div>

          <div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-500 md:text-4xl dark:text-white">
              Ting<span className="opacity-50">xuan</span> Wu
            </h1>
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              Engineer & Artist
            </p>
          </div>
        </div>

        <div className="grow space-y-8 pt-4 font-mono leading-relaxed text-gray-700 md:pt-8 dark:text-gray-300">
          <div className="relative border-l-2 border-blue-500/30 pl-6">
            <p className="mb-4 text-lg">
              Hello! I&apos;m currently a{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                MS Computer Science student
              </span>{" "}
              at UC Riverside, aiming for graduation in{" "}
              <span className="underline decoration-blue-500/50 decoration-2">
                June 2026
              </span>
              .
            </p>
            <p className="text-lg">I love making all sorts of things.</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
              OFFLINE STATUS
            </h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                <span>Sketching and digital art</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                <span>Learning anime songs on guitar</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Making characters in D&D</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Playing Overwatch, Hoyoverse games, LoL (sadly)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span>Hanging out with my cat</span>
              </li>
            </ul>
            <div className="mt-8 opacity-60">
              Feel free to draw using the tools and space provided!
              <br /> - E to toggle eraser
              <br /> - C to clear screen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookDecor;
