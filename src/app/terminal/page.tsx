"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import WindowFrame from "@/components/WindowFrame";
import { initializeFileSystem, FileNode } from "@/utils/vfs";
import { processCommand, formatPrompt } from "@/utils/shell";
import { useRouter } from "next/navigation";

const TerminalApp = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const router = useRouter();

  const [fileSystem, setFileSystem] = useState<FileNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const fsRef = useRef<FileNode | null>(null);
  const pathRef = useRef<string[]>([]);
  const inputBuffer = useRef("");

  useEffect(() => {
    fsRef.current = fileSystem;
  }, [fileSystem]);

  useEffect(() => {
    pathRef.current = currentPath;

    if (xtermRef.current) {
      const prompt = formatPrompt(currentPath);
      xtermRef.current.write(prompt);
    }
  }, [currentPath]);

  useEffect(() => {
    initializeFileSystem().then((root) => {
      setFileSystem(root);
    });

    // Initialize Xterm
    if (terminalRef.current && !xtermRef.current) {
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: '"Menlo", "Consolas", "Courier New", monospace',
        fontSize: 14,
        theme: {
          background: "#1a1b26",
          foreground: "#a9b1d6",
          cursor: "#f7768e",
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
      xtermRef.current = term;

      term.writeln("\x1b[1;32mWelcome to TingOS Terminal v1.0.0\x1b[0m");
      term.writeln("Type \x1b[1;34mhelp\x1b[0m to see available commands.");

      term.onData(async (key) => {
        const charCode = key.charCodeAt(0);

        if (charCode === 13) {
          term.write("\r\n");
          const command = inputBuffer.current.trim();

          if (fsRef.current) {
            const output = await processCommand(
              command,
              fsRef.current,
              pathRef.current,
              (newPath) => setCurrentPath(newPath),
              router,
            );

            if (output) term.writeln(output);
          } else {
            term.writeln("File system initializing... (Try again in a moment)");
          }

          inputBuffer.current = "";

          if (!command.startsWith("cd")) {
            term.write(formatPrompt(pathRef.current));
          }
        }
        // Backspace
        else if (charCode === 127) {
          if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            term.write("\b \b");
          }
        }
        // Normal Char
        else {
          inputBuffer.current += key;
          term.write(key);
        }
      });

      window.addEventListener("resize", () => fitAddon.fit());
    }
  }, [router]);

  return (
    <WindowFrame id="terminal" title="Terminal - Source Explorer">
      <div className="h-full w-full overflow-hidden bg-[#1a1b26] p-2">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </WindowFrame>
  );
};

export default TerminalApp;
