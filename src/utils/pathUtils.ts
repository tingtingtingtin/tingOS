import { FileNode } from "./vfs";

export const resolvePath = (
  root: FileNode,
  currentPath: string[],
  targetPath: string,
) => {
  if (targetPath === "/" || targetPath === "~")
    return { node: root, newPath: [] };

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
    } else if (current.children && current.children[part]) {
      current = current.children[part];
      tempPath.push(part);
    } else {
      return { node: null, newPath: tempPath };
    }
  }
  return { node: current, newPath: tempPath };
};

export const getNodeAtPath = (root: FileNode, path: string[]) => {
  let node = root;
  for (const p of path) {
    node = node.children![p];
  }
  return node;
};
