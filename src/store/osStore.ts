import { create } from 'zustand';

interface OSState {
  runningApps: string[];
  launchApp: (id: string) => void;
  closeApp: (id: string) => void;
  isAppRunning: (id: string) => boolean;
}

export const useOSStore = create<OSState>((set, get) => ({
  runningApps: [],

  launchApp: (id) => {
    if (!get().runningApps.includes(id)) {
      set((state) => ({ runningApps: [...state.runningApps, id] }));
    }
    console.log("App launched")
  },

  closeApp: (id) => {
    set((state) => ({ runningApps: state.runningApps.filter((appId) => appId !== id) }));
  },

  isAppRunning: (id) => get().runningApps.includes(id),
}));