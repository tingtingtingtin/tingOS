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

  return `cd: no such file or directory: ${arg}`;
};

const handleCat: CommandHandler = async ([arg], ctx) => {
  if (!arg) return "usage: cat [file]";
  const { node } = resolvePath(ctx.root, ctx.currentPath, arg);

  if (!node) return `cat: ${arg}: No such file or directory`;
  if (node.type === "dir") return `cat: ${arg}: Is a directory`;

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

const handleHelp: CommandHandler = () =>
  normalize(`
Available commands:
  ${C.Bright}ls${C.Reset}      List directory contents
  ${C.Bright}cd${C.Reset}      Change directory
  ${C.Bright}cat${C.Reset}     Print file content
  ${C.Bright}pwd${C.Reset}     Print working directory
  ${C.Bright}theme${C.Reset}   [dark|light] Change website theme
  ${C.Bright}open${C.Reset}    [projects|contact|resume] Open app
  ${C.Bright}whoami${C.Reset}  Display user info
`);

export const commandHandlers: Record<string, CommandHandler> = {
  ls: handleLs,
  cd: handleCd,
  cat: handleCat,
  pwd: handlePwd,
  cowsay: handleCowsay,
  whoami: handleWhoami,
  sudo: handleSudo,
  theme: handleTheme,
  open: handleOpen,
  help: handleHelp,
  "": () => "",
};
