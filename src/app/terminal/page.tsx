"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import WindowFrame from "@/components/WindowFrame";
import { initializeFileSystem, FileNode } from "@/utils/vfs";
import { processCommand, formatPrompt } from "@/utils/shell";
import { useRouter } from "next/navigation";

export default function TerminalApp() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const router = useRouter();

  // State for rendering (if needed elsewhere)
  const [fileSystem, setFileSystem] = useState<FileNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // REFS: These are crucial to fix the "Stale Closure" bug.
  // The xterm listener needs instant access to the latest values.
  const fsRef = useRef<FileNode | null>(null);
  const pathRef = useRef<string[]>([]);
  const inputBuffer = useRef("");

  // 1. Sync State to Refs
  useEffect(() => {
    fsRef.current = fileSystem;
  }, [fileSystem]);

  useEffect(() => {
    pathRef.current = currentPath;

    // Update prompt when path changes
    if (xtermRef.current) {
      // We write the prompt here.
      // NOTE: We do NOT write it in the init block to avoid the double prompt.
      const prompt = formatPrompt(currentPath);
      xtermRef.current.write(prompt);
    }
  }, [currentPath]);

  // 2. Initialize Logic
  useEffect(() => {
    // Load VFS
    initializeFileSystem().then((root) => {
      setFileSystem(root); // Triggers the Ref update above
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

      // Initial Greeting
      term.writeln("\x1b[1;32mWelcome to TingOS Terminal v1.0.0\x1b[0m");
      term.writeln("Type \x1b[1;34mhelp\x1b[0m to see available commands.");

      // REMOVED: term.write(formatPrompt([]));
      // Reason: The useEffect([currentPath]) above will fire immediately on mount
      // and write the first prompt for us.

      // 3. Handle Input
      term.onData(async (key) => {
        const charCode = key.charCodeAt(0);

        // Enter Key
        if (charCode === 13) {
          term.write("\r\n");
          const command = inputBuffer.current.trim();

          // FIX: Use fsRef.current instead of fileSystem state
          if (fsRef.current) {
            const output = await processCommand(
              command,
              fsRef.current, // Use Ref
              pathRef.current, // Use Ref
              (newPath) => setCurrentPath(newPath),
              router,
            );

            if (output) term.writeln(output);
          } else {
            term.writeln("File system initializing... (Try again in a moment)");
          }

          inputBuffer.current = "";

          // We don't write the new prompt here manually.
          // Updating `setCurrentPath` triggers the useEffect, which writes the prompt.
          // However, if the command DID NOT change the path (e.g. 'ls'),
          // we need to manually reprompt because the useEffect won't fire.

          // Small helper to check if we need to manually reprompt
          // (If the command was NOT 'cd', the path state might not change)
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
  }, [router]); // dependency array cleaned up

  return (
    <WindowFrame id="terminal" title="Terminal - Source Explorer">
      <div className="h-full w-full overflow-hidden bg-[#1a1b26] p-2">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </WindowFrame>
  );
}
