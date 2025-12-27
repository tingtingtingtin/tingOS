import { useOSStore } from "@/store/osStore";
import { FileNode, getFileContent } from "./vfs";
import { resolvePath, getNodeAtPath } from "./pathUtils";

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

type PathSetter = (p: string[]) => void;

export type CommandContext = {
  root: FileNode;
  currentPath: string[];
  setPath: PathSetter;
  router: { push: (path: string) => void };
};

export type CommandHandler = (
  args: string[],
  ctx: CommandContext,
) => Promise<string> | string;

export const formatPrompt = (path: string[]) => {
  const pathString = path.length === 0 ? "~" : "~/" + path.join("/");
  return `${C.Green}guest@tingOS${C.Reset}:${C.Blue}${pathString}${C.Reset}$ `;
};

// Helper: Ensure all newlines include a Carriage Return (\r)
const normalize = (str: string) => str.replace(/\n/g, "\r\n");

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

const handleLs: CommandHandler = (_, ctx) => {
  const node = getNodeAtPath(ctx.root, ctx.currentPath);
  if (!node.children) return "";

  const files = Object.values(node.children).map((child) => {
    const color = child.type === "dir" ? C.Blue : C.Reset;
    const suffix = child.type === "dir" ? "/" : "";
    return `${color}${child.name}${suffix}${C.Reset}`;
  });

  return files.join("  ");
};

const handleCd: CommandHandler = ([arg], ctx) => {
  if (!arg) {
    ctx.setPath([]);
    return "";
  }

  const { node, newPath } = resolvePath(ctx.root, ctx.currentPath, arg);
  if (node && node.type === "dir") {
    ctx.setPath(newPath);
    return "";
  }
  else if (node) return `cd: ${arg} is a file`;

  return `cd: no such file or directory: ${arg}`;
};

const handleCat: CommandHandler = async ([arg], ctx) => {
  if (!arg) return "usage: cat [file]";
  const { node } = resolvePath(ctx.root, ctx.currentPath, arg);

  if (!node) return `cat: ${arg}: No such file or directory`;
  if (node.type === "dir") return `cat: ${arg} is a directory`;

  const content = await getFileContent(node);
  return highlightCode(content, node.name);
};

const handlePwd: CommandHandler = (_, ctx) => "/" + ctx.currentPath.join("/");

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

const handleCowsay: CommandHandler = (args) => {
  const message = args.length > 0 ? args.join(" ") : "Moo!";
  return cowsay(message);
};

const handleClear: CommandHandler = () => "\x1b[2J\x1b[3J\x1b[H";

const handleWhoami: CommandHandler = () =>
  normalize(`${C.Yellow}
     My name is Ting! I am currently a MS Student studying Computer Science at UC Riverside.
${C.Reset}`);

const handleSudo: CommandHandler = () =>
  `${C.Red}User is not in the sudoers file. This incident will be reported (just kidding LO L).${C.Reset}`;

const handleTheme: CommandHandler = ([arg]) => {
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
};

const handleOpen: CommandHandler = ([arg], ctx) => {
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
    ctx.router.push(appMap[arg]);
    return `Opening ${arg}...`;
  }

  return `open: app not found: ${arg}. Available apps: ${Object.keys(appMap).join(", ")}`;
};

const handleEcho: CommandHandler = (args) => args.join(" ");

const handleDate: CommandHandler = () => new Date().toLocaleString();

const handleTree: CommandHandler = (_, ctx) => {
  const buildTree = (node: FileNode, prefix = ""): string => {
    if (!node.children) return "";

    const entries = Object.values(node.children);
    return entries.map((child, i) => {
      const isLast = i === entries.length - 1;
      const line = `${prefix}${isLast ? "└── " : "├── "}${child.name}${child.type === "dir" ? "/" : ""}`;
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      const childrenTree = child.type === "dir" ? buildTree(child, newPrefix) : "";
      return line + (childrenTree ? "\n" + childrenTree : "");
    }).join("\n");
  };

  return normalize(buildTree(getNodeAtPath(ctx.root, ctx.currentPath)));
};

const handleExit: CommandHandler = (_, ctx) => {
  const { closeApp } = useOSStore.getState();
  closeApp("terminal");
  ctx.router.push("/");
  return "";
};

const handleGrep: CommandHandler = async ([pattern, filename], ctx) => {
  if (!pattern || !filename) return "usage: grep <pattern> <file>";
  
  const { node } = resolvePath(ctx.root, ctx.currentPath, filename);
  if (!node) return `grep: ${filename}: No such file or directory`;
  if (node.type === "dir") return `grep: ${filename}: Is a directory`;

  const content = await getFileContent(node);
  const lines = content.split("\n");
  const matches = lines
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line }) => line.toLowerCase().includes(pattern.toLowerCase()))
    .map(({ line, num }) => {
      const regex = new RegExp(`(${pattern})`, "gi");
      const highlightedLine = line.replace(regex, `${C.Red}$1${C.Reset}`);
      return `${C.Yellow}${num}${C.Reset}: ${highlightedLine}`;
    });

  return matches.length > 0 ? normalize(matches.join("\n")) : `No matches found for '${pattern}'`;
};

const handleTouch: CommandHandler = ([filename], ctx) => {
  if (!filename) return "usage: touch <filename>";
  if (filename.includes("/")) return "touch: cannot create file with path separators";

  const currentNode = getNodeAtPath(ctx.root, ctx.currentPath);
  if (!currentNode.children) return "touch: cannot create file here";
  
  if (currentNode.children[filename]) {
    return `touch: '${filename}' already exists`;
  }

  const newPath = ctx.currentPath.concat(filename).join("/");

  currentNode.children[filename] = {
    name: filename,
    type: "file",
    path: newPath,
    content: "",
  };

  return "";
};

const handleMkdir: CommandHandler = ([dirname], ctx) => {
  if (!dirname) return "usage: mkdir <directory>";
  if (dirname.includes("/")) return "mkdir: cannot create directory with path separators";

  const currentNode = getNodeAtPath(ctx.root, ctx.currentPath);
  if (!currentNode.children) return "mkdir: cannot create directory here";
  
  if (currentNode.children[dirname]) {
    return `mkdir: cannot create directory '${dirname}': File exists`;
  }

  const newPath = ctx.currentPath.concat(dirname).join("/");

  currentNode.children[dirname] = {
    name: dirname,
    type: "dir",
    path: newPath,
    children: {},
  };

  return "";
};

// TODO: js (sandboxed eval())

const handleHelp: CommandHandler = () =>
  normalize(`
Available commands:
  ${C.Bright}ls${C.Reset}        List directory contents
  ${C.Bright}cd${C.Reset}        Change directory
  ${C.Bright}cat${C.Reset}       Print file content
  ${C.Bright}pwd${C.Reset}       Print working directory
  ${C.Bright}grep${C.Reset}      Search for pattern in file
  ${C.Bright}clear${C.Reset}     Clear screen
  ${C.Bright}open${C.Reset}      Open app (projects|contact|resume|about|experience)
  ${C.Bright}theme${C.Reset}     Change theme (dark|light)
  ${C.Bright}whoami${C.Reset}    Display user info
  ${C.Bright}exit${C.Reset}      Close terminal
`);

export const commandHandlers: Record<string, CommandHandler> = {
  ls: handleLs,
  cd: handleCd,
  cat: handleCat,
  pwd: handlePwd,
  grep: handleGrep,
  clear: handleClear,
  exit: handleExit,
  whoami: handleWhoami,
  theme: handleTheme,
  open: handleOpen,
  help: handleHelp,
  // Easter egg commands (Hi there!)
  cowsay: handleCowsay,
  sudo: handleSudo,
  echo: handleEcho,
  touch: handleTouch,
  mkdir: handleMkdir,
  date: handleDate,
  tree: handleTree,
  "": () => "", // handles blank enter
};
