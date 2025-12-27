export interface Game {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  color?: string;
  embedUrl?: string;
  githubUrl?: string;
  extUrl?: string;
  desktopOnly?: boolean;
}

export const games: Game[] = [
  {
    id: "tricksonit",
    title: "Tricks On It (2025)",
    description:
      "A high-speed, third-person action game where style is your weapon",
    color: "#252a34",
    thumbnail:
      "https://img.itch.zone/aW1nLzIxNjIzODA4LnBuZw==/original/ytoIxR.png",
    embedUrl: "https://itch.io/embed-upload/13963190?color=252a34",
    githubUrl: "https://github.com/TMarwah/TricksOnIt",
    extUrl: "https://almondcrumbs.itch.io/tricks-on-it",
    desktopOnly: true,
  },
  {
    id: "livelaughdie",
    title: "Live Laugh Die (2024)",
    description: "Bullet hell game that laughs at you when you fail!",
    color: "#0C0C0D",
    thumbnail:
      "https://github.com/ajarean/ggj-bullet-hell/blob/main/Assets/Sprites/thing.png?raw=true",
    embedUrl: "https://itch.io/embed-upload/9610018?color=000000",
    githubUrl: "https://github.com/ajarean/ggj-bullet-hell/",
    extUrl: "https://almondcrumbs.itch.io/live-laugh-die",
    desktopOnly: true,
  },
  {
    id: "projectstars",
    title: "Project Stars (2023, Unreleased)",
    description: "An idol-themed visual novel ",
    thumbnail:
      "https://github.com/tingtingtingtin/project-stars/blob/dev/ProjectStaRS/game/gui/main_menu.png?raw=true",
    embedUrl: "https://gamespawn.github.io/projects/Project_StaRS.html",
    githubUrl: "https://github.com/tingtingtingtin/project-stars/tree/dev",
    extUrl: "https://gamespawn.github.io/projects/Project_StaRS.html",
  },
  {
    id: "hurdle",
    title: "Hurdle (2024)",
    description: "Wordle spin-off browser game",
    thumbnail:
      "https://raw.githubusercontent.com/tingtingtingtin/hurdle/4e8682b7b69d2efc30642c43e7ad0d144c5f6ca9/public/favicon.svg",
    embedUrl: "https://hurdle-vert.vercel.app/",
    githubUrl: "https://github.com/tingtingtingtin/hurdle",
    extUrl: "https://hurdle-vert.vercel.app/",
    desktopOnly: true,
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    description: "More is on the way. Stay tuned!",
  },
];
