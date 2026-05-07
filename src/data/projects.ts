export interface Project {
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  tech?: string[];
}

export const projects: Project[] = [
  {
    title: "Personal Portfolio",
    description: "This very website!",
    repoUrl: "https://github.com/tingtingtingtin/tingOS",
    tech: ["Next.js", "Webhooks", "TailwindCSS", "Zustand", "Motion"],
  },
  {
    title: "SplatKit",
    description:
      "Gaussian Splat renderer built with Three.js, TypeScript, GLSL, and Web Workers",
    repoUrl: "https://github.com/tingtingtingtin/splatkit",
    demoUrl: "https://splatkit.vercel.app",
    tech: ["Three.js", "TypeScript", "GLSL", "Web Workers"],
  },
  {
    title: "CounselCoach",
    description: "AI patient simulator for therapist development",
    repoUrl: "https://github.com/tingtingtingtin/CounselCoach",
    demoUrl: "https://counselcoach.tech",
    tech: ["Next.js", "React", "Gemini", "ElevenLabs"],
  },
  {
    title: "Garbogotchi",
    description:
      "Gamified trash-sorting app with virtual pet mechanics and hardware integration. Won 2nd Place at CitrusHack 2025.",
    repoUrl: "https://github.com/tingtingtingtin/garbogotchi",
    demoUrl: "https://devpost.com/software/garbogotchi",
    tech: ["Electron", "React", "Arduino", "TensorFlow.js"],
  },
  {
    title: "Generositree",
    description:
      "An image sharing platform for inspiring environmental impact.",
    repoUrl: "https://github.com/tingtingtingtin/generositree",
    demoUrl: "https://generositree.vercel.app/",
    tech: ["Next.js", "Firebase", "TypeScript", "TailwindCSS", "Three.js"],
  },
  {
    title: "TricksOnIt",
    description:
      "A movement-based 3D action game inspired by Jet Set Radio, created in Spring 2025 for my senior project.",
    repoUrl: "https://github.com/TMarwah/TricksOnIt",
    demoUrl: "https://almondcrumbs.itch.io/tricks-on-it",
    tech: ["Unity", "C#"],
  },
  {
    title: "Hurdle",
    description: "A spin-off of the popular word game, Wordle.",
    repoUrl: "https://github.com/tingtingtingtin/hurdle",
    demoUrl: "https://hurdle-vert.vercel.app",
    tech: ["Vite", "React", "Express"],
  },
];
