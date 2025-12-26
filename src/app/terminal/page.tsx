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

  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const fsRef = useRef<FileNode | null>(null);
  const pathRef = useRef<string[]>([]);
  const inputBuffer = useRef("");
  const cursorPos = useRef(0);

  useEffect(() => {
    // fsRef.current = fileSystem;
  }, [fileSystem]);

  useEffect(() => {
    pathRef.current = currentPath;

    if (xtermRef.current) {
      xtermRef.current.write("\r\x1b[K"); 
      const prompt = formatPrompt(currentPath);
      xtermRef.current.write(prompt);
      inputBuffer.current = "";
      cursorPos.current = 0;
    }
  }, [currentPath]);

  useEffect(() => {
    initializeFileSystem().then((root) => {
      setFileSystem(root);
      fsRef.current = root;
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

      const refreshLine = () => {
        const prompt = formatPrompt(pathRef.current);
        const backAmount = inputBuffer.current.length - cursorPos.current;

        let output = "\r\x1b[K" + prompt + inputBuffer.current;
        if (backAmount > 0) {
          output += "\b".repeat(backAmount);
        }
        term.write(output);
      };

      term.onData(async (key) => {
        const charCode = key.charCodeAt(0);

        if (key === "\x1b[A") { // Up arrow
          if (history.current.length > 0 && historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            const prevCommand = history.current[history.current.length - 1 - historyIndex.current];

            inputBuffer.current = prevCommand;
            cursorPos.current = prevCommand.length;
            refreshLine();
          }
          return;
        }

        if (key === "\x1b[B") { // Down arrow
          if (historyIndex.current > -1) {
            historyIndex.current--;
            const nextCommand = historyIndex.current === -1
              ? ""
              : history.current[history.current.length - 1 - historyIndex.current];

            inputBuffer.current = nextCommand;
            cursorPos.current = nextCommand.length;
            refreshLine();
          }
          return;
        }

        if (key === "\x1b[D") { // Left arrow
          if (cursorPos.current > 0) {
            cursorPos.current--;
            term.write(key);
          }
          return;
        }

        if (key === "\x1b[C") { // Right arrow
          if (cursorPos.current < inputBuffer.current.length) {
            cursorPos.current++;
            term.write(key);
          }
          return;
        }

        if (charCode === 13) { // Enter key
          term.write("\r\n");
          const cmd = inputBuffer.current;
          if (cmd.trim() && fsRef.current) {
            history.current.push(cmd.trim());
            historyIndex.current = -1;
            const output = await processCommand(cmd.trim(), fsRef.current!, pathRef.current, (p) => setCurrentPath(p), router);
            if (output) term.writeln(output);
          }

          inputBuffer.current = "";
          cursorPos.current = 0;
          if (!cmd.startsWith("cd")) {
            term.write(formatPrompt(pathRef.current));
          }
        }
        else if (charCode === 127) { // Backspace
          if (cursorPos.current > 0) {
            const left = inputBuffer.current.slice(0, cursorPos.current - 1);
            const right = inputBuffer.current.slice(cursorPos.current);
            inputBuffer.current = left + right;
            cursorPos.current--;
            refreshLine();
          }
        }
        else if (key === "\x1b[3~") { // Delete key
          if (cursorPos.current < inputBuffer.current.length) {
            const left = inputBuffer.current.slice(0, cursorPos.current);
            const right = inputBuffer.current.slice(cursorPos.current + 1);
            inputBuffer.current = left + right;
            refreshLine();
          }
          return;
        }
        else if (charCode >= 32 && charCode <= 126) { // Normal Char (printable)
          const left = inputBuffer.current.slice(0, cursorPos.current);
          const right = inputBuffer.current.slice(cursorPos.current);
          inputBuffer.current = left + key + right;
          cursorPos.current++;
          refreshLine();
        }
      });

      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        term.dispose();
        xtermRef.current = null;
      };
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