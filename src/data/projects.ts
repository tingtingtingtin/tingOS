export interface Project {
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Garbogotchi",
    description:
      "Gamified trash-sorting app with virtual pet mechanics and hardware integration. Won 2nd Place at CitrusHack 2025.",
    repoUrl: "https://github.com/tingtingtingtin/garbogotchi",
    demoUrl: "https://devpost.com/software/garbogotchi",
  },
  {
    title: "Hurdle",
    description: "A spin-off of the popular word game.",
    repoUrl: "https://github.com/tingtingtingtin/hurdle",
  },
  {
    title: "TricksOnIt",
    description: "A movement based action game for my senior project.",
    repoUrl: "https://github.com/TMarwah/TricksOnIt",
    demoUrl: "https://almondcrumbs.itch.io/tricks-on-it",
  },
  {
    title: "Personal Portfolio",
    description: "",
    repoUrl: "https://github.com/tingtingtingtin/portfolio-v2",
  },
  {
    title: "Generositree",
    description: "",
    repoUrl: "https://github.com/tingtingtingtin/generositree",
    demoUrl: "https://www.generositree.co/",
  },
];
