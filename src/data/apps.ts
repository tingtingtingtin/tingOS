import {
  Palette,
  FileText,
  Terminal,
  Github,
  LucideIcon,
  Twitter,
  MessageCircle,
  // Trash,
  Gamepad,
  Sparkles,
} from "lucide-react";

export interface AppConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  isPinned: boolean;
  url?: string;
  floating?: boolean;
}

export const apps: AppConfig[] = [
  {
    id: "about",
    label: "About Me",
    icon: Palette,
    route: "/about",
    isPinned: true,
  },
  {
    id: "projects",
    label: "Projects",
    icon: Github,
    route: "/projects",
    isPinned: true,
  },
  {
    id: "experience",
    label: "Experience",
    icon: Twitter,
    route: "/experience",
    isPinned: true,
  },
  {
    id: "contact",
    label: "Contact",
    icon: MessageCircle,
    route: "/contact",
    isPinned: true,
  },
  {
    id: "resume",
    label: "resume.txt",
    icon: FileText,
    route: "/resume",
    isPinned: false,
  },
  // {
  //   id: "old",
  //   label: "Old Site",
  //   icon: Trash,
  //   route: "/",
  //   url: "https://tingx.vercel.app/",
  //   isPinned: false,
  // },
  {
    id: "terminal",
    label: "Terminal",
    icon: Terminal,
    route: "/terminal",
    isPinned: false,
  },
  {
    id: "games",
    label: "Games",
    icon: Gamepad,
    route: "/games",
    isPinned: false,
  },
  {
    id: "three",
    label: "cool stuff",
    icon: Sparkles,
    route: "/three",
    isPinned: false,
    floating: true,
  },
];
