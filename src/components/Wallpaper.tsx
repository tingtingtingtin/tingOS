"use client";

import Image from "next/image";
import { useOSStore } from "@/store/osStore";

const Wallpaper = () => {
  const darkMode = useOSStore((s) => s.darkMode);

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-500"
        style={{ opacity: darkMode ? 1 : 0 }}
      >
        <Image
          src="/wallpapers/dark.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-500"
        style={{ opacity: darkMode ? 0 : 1 }}
      >
        <Image
          src="/wallpapers/light.jpg"
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          darkMode
            ? "bg-black/40"
            : "bg-white/50 bg-linear-to-t from-white/10 via-transparent to-white/30 md:bg-transparent"
        }`}
      />
    </div>
  );
};

export default Wallpaper;
