"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  SplatViewer,
  type SplatRendererProgress,
} from "@tingtingtingtin/splatkit";

const SPLAT_URL = "https://media.reshot.ai/models/nike_next/model.splat";

const STAGE_LABEL: Record<SplatRendererProgress["stage"], string> = {
  fetch: "Fetching model",
  pack: "Packing geometry",
  complete: "Ready",
};

export default function SplatKitViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<SplatRendererProgress["stage"]>("fetch");
  const [progress, setProgress] = useState(0);
  const [overlayMounted, setOverlayMounted] = useState(true);
  const [isBgVisible, setIsBgVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new SplatViewer(containerRef.current, {
      url: SPLAT_URL,
      moveSpeed: 3,
      enableWASD: true,
      enableRightDragPan: true,
      onProgress: (p: SplatRendererProgress) => {
        setStage(p.stage);
        setProgress(p.progress);
        if (p.stage === "complete") {
          setTimeout(() => setOverlayMounted(false), 600);
        }
      },
    });

    viewer.waitUntilReady().then(() => viewer.setInstancePercent(100));

    return () => viewer.dispose();
  }, []);

  return (
    <div
      className={`group relative h-full w-full transition-colors duration-300 ${
        isBgVisible ? "bg-white dark:bg-gray-900" : ""
      }`}
    >
      <div ref={containerRef} className="h-full w-full" />

      {overlayMounted && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-500 dark:bg-gray-900 ${
            stage === "complete" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex w-56 flex-col items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {STAGE_LABEL[stage]}
            </p>
            <div className="h-px w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full bg-gray-400 transition-all duration-300 dark:bg-gray-500"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="tabular-nums text-xs text-gray-400 dark:text-gray-600">
              {Math.round(progress * 100)}%
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsBgVisible((v) => !v)}
        className="absolute right-2 bottom-2 z-10 rounded p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-500 dark:text-gray-700 dark:hover:text-gray-400"
        title={isBgVisible ? "Hide background" : "Show background"}
      >
        {isBgVisible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
    </div>
  );
}
