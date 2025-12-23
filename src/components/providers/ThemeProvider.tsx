"use client";
import { useEffect } from "react";
import { useOSStore } from "@/store/osStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useOSStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark");
  }, [darkMode]);

  return <>{children}</>;
}
