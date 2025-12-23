"use client";

import { useOSStore } from "@/store/osStore";

const Wallpaper = () => {
  const darkMode = useOSStore((s) => s.darkMode);

  const darkUrl =
    "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=3000";
  const lightUrl =
    "https://images.unsplash.com/photo-1543241964-2aff6a70473f?auto=format&fit=crop&q=80&w=3000";

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url("${darkMode ? darkUrl : lightUrl}")`,
      }}
    >
      <div
        className={`absolute inset-0 transition-colors duration-700 ${darkMode ? "bg-black/20" : "bg-white/10"}`}
      />
    </div>
  );
};

export default Wallpaper;
