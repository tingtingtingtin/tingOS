"use client";

import { useEffect, useState } from "react";
import WindowFrame from "@/components/WindowFrame";
import { initializeFileSystem, FileNode } from "@/utils/vfs";
import { useRouter } from "next/navigation";
import Terminal from "@/components/terminal/Terminal";

export default function TerminalPage() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [fileSystem, setFileSystem] = useState<FileNode | null>(null);
  const router = useRouter();

  useEffect(() => {
    initializeFileSystem().then((root) => setFileSystem(root));
  }, []);

  return (
    <WindowFrame id="terminal" title="Terminal - Source Explorer">
      <div className="h-full w-full bg-[#1a1b26] p-2">
        {fileSystem ? (
          <Terminal
            fs={fileSystem}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            router={router}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            Loading files...
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
