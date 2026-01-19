"use client";

import { MotionConfig } from "motion/react";
import { useOSStore } from "@/store/osStore";

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useOSStore((state) => state.reducedMotion);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
