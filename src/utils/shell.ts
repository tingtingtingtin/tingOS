import { commandHandlers, CommandContext, formatPrompt } from "./shellCommands";

export { formatPrompt };

export async function processCommand(
  input: string,
  root: CommandContext["root"],
  currentPath: CommandContext["currentPath"],
  setPath: CommandContext["setPath"],
  router: CommandContext["router"],
  history: CommandContext["history"],
  clearHistory: CommandContext["clearHistory"],
): Promise<string> {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const handler = commandHandlers[cmd];
  if (!handler) return `command not found: ${cmd}`;

  const ctx: CommandContext = {
    root,
    currentPath,
    setPath,
    router,
    history,
    clearHistory,
  };
  return handler(args, ctx);
}
