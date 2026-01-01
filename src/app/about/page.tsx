"use client";

import WindowFrame from "@/components/WindowFrame";
import dynamic from "next/dynamic";

const Palette = dynamic(() => import("@/components/about/Palette"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading canvas...
        </p>
      </div>
    </div>
  ),
});

const AboutApp = () => {
  return (
    <WindowFrame id="about" title="About_Me.can" skipInitialLoading>
      <div className="h-full">
        <Palette />
      </div>
    </WindowFrame>
  );
};

export default AboutApp;
