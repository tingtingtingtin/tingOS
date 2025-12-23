/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FileNode {
  name: string;
  type: "file" | "dir";
  path: string;
  url?: string;
  children?: { [key: string]: FileNode }; // Hash map for O(1) lookup
  content?: string; // Cached content after a 'cat'
}

const USER = "tingtingtingtin";
const REPO = "tingos";
const BRANCH = "main";

const CACHE_KEY = `vfs_${USER}_${REPO}`;

/**
 * Fetches the repo structure and builds a Virtual File System
 */
export async function initializeFileSystem(): Promise<FileNode> {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${USER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    );

    if (!response.ok) throw new Error("Failed to fetch repo");

    const data = await response.json();

    const root: FileNode = { name: "~", type: "dir", path: "", children: {} };

    data.tree.forEach((item: any) => {
      const parts = item.path.split("/");
      let current = root;

      parts.forEach((part: string, index: number) => {
        if (!current.children) current.children = {};

        if (!current.children[part]) {
          const isFile = index === parts.length - 1 && item.type === "blob";
          current.children[part] = {
            name: part,
            type: isFile ? "file" : "dir",
            path: item.path,
            url: item.url,
            children: isFile ? undefined : {},
          };
        }
        current = current.children[part];
      });
    });

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(root));
    return root;
  } catch (error) {
    console.error(error);
    return { name: "~", type: "dir", path: "", children: {} };
  }
}

/**
 * Fetches raw file content on demand (Lazy Loading)
 */
export async function getFileContent(node: FileNode): Promise<string> {
  if (node.content) return node.content; // Return cached if available

  try {
    // Use raw.githubusercontent for cleaner text (avoids base64 decoding issues from API)
    const res = await fetch(
      `https://raw.githubusercontent.com/${USER}/${REPO}/${BRANCH}/${node.path}`,
    );
    if (!res.ok) throw new Error("File not found");

    const text = await res.text();
    node.content = text; // Cache it in memory for this session
    return text;
  } catch (err) {
    return "Error: Could not fetch file content: " + err;
  }
}
