import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OSState {
  runningApps: string[];
  launchApp: (id: string) => void;
  closeApp: (id: string) => void;
  isAppRunning: (id: string) => boolean;
  reducedMotion: boolean;
  toggleMotion: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      runningApps: [], // reset on refresh

      launchApp: (id) => {
        if (!get().runningApps.includes(id)) {
          set((state) => ({ runningApps: [...state.runningApps, id] }));
        }
      },

      closeApp: (id) => {
        set((state) => ({
          runningApps: state.runningApps.filter((appId) => appId !== id),
        }));
      },

      isAppRunning: (id) => get().runningApps.includes(id),

      reducedMotion: false,
      toggleMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),

      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "ting-os-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        reducedMotion: state.reducedMotion,
      }),
    },
  ),
);
