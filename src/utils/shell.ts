import { useOSStore } from "@/store/osStore";
import { FileNode, getFileContent } from "./vfs";

// ANSI Colors for Xterm
const C = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Green: "\x1b[32m",
  Blue: "\x1b[34m",
  Cyan: "\x1b[36m",
  Red: "\x1b[31m",
  Yellow: "\x1b[33m",
  Magenta: "\x1b[35m",
};

export const formatPrompt = (path: string[]) => {
  const pathString = path.length === 0 ? "~" : "~/" + path.join("/");
  return `${C.Green}guest@tingOS${C.Reset}:${C.Blue}${pathString}${C.Reset}$ `;
};

// Helper: Ensure all newlines include a Carriage Return (\r)
const normalize = (str: string) => str.replace(/\n/g, "\r\n");

const resolvePath = (
  root: FileNode,
  currentPath: string[],
  targetPath: string,
) => {
  if (targetPath === "/") return { node: root, newPath: [] };
  if (targetPath === "~") return { node: root, newPath: [] };

  const parts = targetPath.split("/");
  const tempPath = targetPath.startsWith("/") ? [] : [...currentPath];
  let current = root;
  if (!targetPath.startsWith("/")) {
    for (const p of tempPath) {
      if (current.children && current.children[p]) {
        current = current.children[p];
      }
    }
  }

  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      tempPath.pop();
      current = root;
      for (const p of tempPath) {
        current = current.children![p];
      }
    } else {
      if (current.children && current.children[part]) {
        current = current.children[part];
        tempPath.push(part);
      } else {
        return { node: null, newPath: tempPath };
      }
    }
  }
  return { node: current, newPath: tempPath };
};

const highlightCode = (code: string, fileName: string): string => {
  if (!fileName.match(/\.(tsx|ts|js|jsx|css|json)$/)) return normalize(code);

  const lines = code.split("\n");

  const highlighted = lines.map((line) => {
    return line
      .replace(/({|}|\[|\]|\(|\))/g, `${C.Cyan}$1${C.Reset}`)
      .replace(/('.*?'|".*?"|`.*?`)/g, `${C.Green}$1${C.Reset}`)
      .replace(
        /\b(import|export|const|let|var|function|return|if|else|for|while|interface|type|from)\b/g,
        `${C.Magenta}$1${C.Reset}`,
      )
      .replace(/(\/\/.*)/g, `${C.Yellow}$1${C.Reset}`);
  });

  return highlighted.join("\r\n");
};

const cowsay = (text: string = "Moo!") => {
  const line = "_".repeat(text.length + 2);
  const bottomLine = "-".repeat(text.length + 2);
  const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

  return normalize(`
 ${line}
< ${text} >
 ${bottomLine} ${cow}
`);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function processCommand(
  input: string,
  root: FileNode,
  currentPath: string[],
  setPath: (p: string[]) => void,
  router: any,
): Promise<string> {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args[0];

  switch (cmd) {
    case "ls": {
      let node = root;
      for (const p of currentPath) {
        node = node.children![p];
      }
      if (!node.children) return "";

      const files = Object.values(node.children).map((child) => {
        const color = child.type === "dir" ? C.Blue : C.Reset;
        const suffix = child.type === "dir" ? "/" : "";
        return `${color}${child.name}${suffix}${C.Reset}`;
      });
      // Join with double space for readability
      return files.join("  ");
    }

    case "cd": {
      if (!arg) {
        setPath([]);
        return "";
      }
      const { node, newPath } = resolvePath(root, currentPath, arg);
      if (node && node.type === "dir") {
        setPath(newPath);
        return "";
      }
      return `cd: no such file or directory: ${arg}`;
    }

    case "cat": {
      if (!arg) return "usage: cat [file]";
      const { node } = resolvePath(root, currentPath, arg);

      if (!node) return `cat: ${arg}: No such file or directory`;
      if (node.type === "dir") return `cat: ${arg}: Is a directory`;

      const content = await getFileContent(node);
      return highlightCode(content, node.name);
    }

    case "pwd":
      return "/" + currentPath.join("/");

    case "cowsay": {
      const message = args.length > 0 ? args.join(" ") : "Moo!";
      return cowsay(message);
    }

    case "whoami":
      return normalize(`${C.Yellow}
     My name is Ting! I am currently a MS Student studying Computer Science at UC Riverside.
${C.Reset}`);

    case "sudo":
      return `${C.Red}User is not in the sudoers file. This incident will be reported (just kidding LO L).${C.Reset}`;

    case "theme":
      const { toggleDarkMode, darkMode } = useOSStore.getState();
      if (arg === "dark") {
        if (!darkMode) toggleDarkMode();
        return "Theme set to dark";
      }
      if (arg === "light") {
        if (darkMode) toggleDarkMode();
        return "Theme set to light";
      }
      return `Current theme is ${darkMode ? "dark" : "light"}. Use 'theme dark' or 'theme light'`;

    case "open": {
      if (!arg) return "usage: open [app_name]";

      const { launchApp } = useOSStore.getState();

      const appMap: Record<string, string> = {
        projects: "/projects",
        contact: "/contact",
        resume: "/resume",
        about: "/about",
        experience: "/experience",
      };

      if (appMap[arg]) {
        launchApp(arg);
        router.push(appMap[arg]);
        return `Opening ${arg}...`;
      }

      return (
        `open: app not found: ${arg}. Available apps: ` + Object.keys(appMap)
      );
    }

    case "help":
      return normalize(`
Available commands:
  ${C.Bright}ls${C.Reset}      List directory contents
  ${C.Bright}cd${C.Reset}      Change directory
  ${C.Bright}cat${C.Reset}     Print file content
  ${C.Bright}pwd${C.Reset}     Print working directory
  ${C.Bright}theme${C.Reset}   [dark|light] Change website theme
  ${C.Bright}open${C.Reset}    [projects|contact|resume] Open app
  ${C.Bright}whoami${C.Reset}  Display user info
`);

    case "":
      return "";

    default:
      return `command not found: ${cmd}`;
  }
}
