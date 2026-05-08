"use client";

import { useEffect, useRef } from "react";
import { SplatViewer } from "@tingtingtingtin/splatkit";

const SPLAT_URL = "https://media.reshot.ai/models/nike_next/model.splat";

export default function SplatKitViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new SplatViewer(containerRef.current, {
      url: SPLAT_URL,
      moveSpeed: 3,
      enableWASD: true,
      enableRightDragPan: true,
    });

    viewer.waitUntilReady().then(() => {
      viewer.setInstancePercent(100);
    });

    return () => viewer.dispose();
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
