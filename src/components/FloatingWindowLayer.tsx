"use client";

import dynamic from "next/dynamic";
import { useOSStore } from "@/store/osStore";
import { apps } from "@/data/apps";
import DraggableWindow from "./DraggableWindow";

const SplatKitViewer = dynamic(() => import("@/app/three/SplatKitViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#111111] text-sm text-gray-500">
      Loading...
    </div>
  ),
});

const windowComponents: Record<string, React.ComponentType> = {
  three: SplatKitViewer,
};

export default function FloatingWindowLayer() {
  const runningApps = useOSStore((s) => s.runningApps);
  const closeApp = useOSStore((s) => s.closeApp);

  const floatingApps = apps.filter(
    (a) => a.floating && runningApps.includes(a.id),
  );

  return (
    <>
      {floatingApps.map((app) => {
        const Component = windowComponents[app.id];
        if (!Component) return null;
        return (
          <DraggableWindow
            key={app.id}
            title={app.label}
            onClose={() => closeApp(app.id)}
          >
            <Component />
          </DraggableWindow>
        );
      })}
    </>
  );
}
