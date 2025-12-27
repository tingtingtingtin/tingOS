"use client";

import { useEffect, useRef, memo } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { FileNode } from "@/utils/vfs";
import { processCommand, formatPrompt } from "@/utils/shell";
import { getNodeAtPath } from "@/utils/pathUtils";

interface TerminalProps {
  fs: FileNode;
  currentPath: string[];
  setCurrentPath: (p: string[]) => void;
  router: { push: (path: string) => void };
}

const Terminal = ({
  fs,
  currentPath,
  setCurrentPath,
  router,
}: TerminalProps) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<XTerm | null>(null);

  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const fsRef = useRef<FileNode | null>(null);
  const pathRef = useRef<string[]>([]);
  const inputBuffer = useRef("");
  const cursorPos = useRef(0);

  // Keep refs in sync with props
  useEffect(() => {
    fsRef.current = fs;
  }, [fs]);

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
    const savedHistory = sessionStorage.getItem("terminal_history");
    if (savedHistory) {
      try {
        history.current = JSON.parse(savedHistory);
      } catch (e) {
        history.current = [];
        console.log("! History not found: ", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new XTerm({
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
      if (backAmount > 0) output += "\b".repeat(backAmount);
      term.write(output);
    };

    term.onData(async (key) => {
      const charCode = key.charCodeAt(0);

      if (key === "\x1b[A") {
        // Up arrow
        if (
          history.current.length > 0 &&
          historyIndex.current < history.current.length - 1
        ) {
          historyIndex.current++;
          const prevCommand =
            history.current[history.current.length - 1 - historyIndex.current];
          inputBuffer.current = prevCommand;
          cursorPos.current = prevCommand.length;
          refreshLine();
        }
        return;
      }

      if (key === "\x1b[B") {
        // Down arrow
        if (historyIndex.current > -1) {
          historyIndex.current--;
          const nextCommand =
            historyIndex.current === -1
              ? ""
              : history.current[
                  history.current.length - 1 - historyIndex.current
                ];
          inputBuffer.current = nextCommand;
          cursorPos.current = nextCommand.length;
          refreshLine();
        }
        return;
      }

      if (key === "\x1b[D") {
        // Left arrow
        if (cursorPos.current > 0) {
          cursorPos.current--;
          term.write(key);
        }
        return;
      }

      if (key === "\x1b[C") {
        // Right arrow
        if (cursorPos.current < inputBuffer.current.length) {
          cursorPos.current++;
          term.write(key);
        }
        return;
      }

      if (charCode === 9) {
        // Tab key
        const currentLine = inputBuffer.current.slice(0, cursorPos.current);
        const words = currentLine.split(/\s+/);
        const lastWord = words[words.length - 1];

        if (!lastWord && words.length > 1) return;

        if (fsRef.current) {
          const currentNode = getNodeAtPath(fsRef.current, pathRef.current);
          if (currentNode.children) {
            // case blind search
            const matches = Object.keys(currentNode.children).filter((name) =>
              name.toLowerCase().startsWith(lastWord.toLowerCase()),
            );

            if (matches.length === 1) {
              const matchedName = matches[0];
              const isDir = currentNode.children[matchedName].type === "dir";
              const suffix = isDir ? "/" : " ";

              const lineBeforeLastWord = currentLine.slice(
                0,
                currentLine.length - lastWord.length,
              );
              const rightSide = inputBuffer.current.slice(cursorPos.current);

              inputBuffer.current =
                lineBeforeLastWord + matchedName + suffix + rightSide;

              cursorPos.current = (
                lineBeforeLastWord +
                matchedName +
                suffix
              ).length;

              refreshLine();
            }
          }
        }
        return;
      }

      if (charCode === 13) {
        // Enter
        term.write("\r\n");
        const cmd = inputBuffer.current.trim();
        if (cmd && fsRef.current) {
          if (history.current[history.current.length - 1] !== cmd) {
            history.current.push(cmd);
            sessionStorage.setItem(
              "terminal_history",
              JSON.stringify(history.current),
            );
          }
          historyIndex.current = -1;
          const output = await processCommand(
            cmd,
            fsRef.current!,
            pathRef.current,
            (p) => setCurrentPath(p),
            router,
            history.current,
          );
          if (output) term.writeln(output);
        }

        inputBuffer.current = "";
        cursorPos.current = 0;
        if (!cmd.startsWith("cd")) term.write(formatPrompt(pathRef.current));
        return;
      }

      if (charCode === 127) {
        // Backspace
        if (cursorPos.current > 0) {
          const left = inputBuffer.current.slice(0, cursorPos.current - 1);
          const right = inputBuffer.current.slice(cursorPos.current);
          inputBuffer.current = left + right;
          cursorPos.current--;
          refreshLine();
        }
        return;
      }

      if (key === "\x1b[3~") {
        // Delete
        if (cursorPos.current < inputBuffer.current.length) {
          const left = inputBuffer.current.slice(0, cursorPos.current);
          const right = inputBuffer.current.slice(cursorPos.current + 1);
          inputBuffer.current = left + right;
          refreshLine();
        }
        return;
      }

      if (charCode >= 32 && charCode <= 126) {
        // Printable
        const left = inputBuffer.current.slice(0, cursorPos.current);
        const right = inputBuffer.current.slice(cursorPos.current);
        inputBuffer.current = left + key + right;
        cursorPos.current++;
        refreshLine();
        return;
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    // Initial prompt
    term.write(formatPrompt(pathRef.current));

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, [setCurrentPath, router]);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default memo(Terminal);
