"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useOSStore } from "@/store/osStore";

export default function TitleBlinker() {
  const pathname = usePathname();
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const pathRef = useRef("");

  useEffect(() => {
    const routeMap: Record<string, string> = {
      "/": "",
      "/about": "~/ting",
      "/projects": "~/code",
      "/experience": "log/exp",
      "/resume": "etc/resume.txt",
      "/contact": "dev/tty0",
      "/terminal": "bin/sh",
    };
    pathRef.current = routeMap[pathname] || pathname.replace("/", "");

    if (reducedMotion) {
      document.title = `tingOS:/${pathRef.current}$`;
    }
  }, [pathname, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let showCursor = true;

    const interval = setInterval(() => {
      const cursor = showCursor ? "_" : " ";
      document.title = `tingOS:/${pathRef.current}$ ${cursor}`;
      showCursor = !showCursor;
    }, 1000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return null;
}
