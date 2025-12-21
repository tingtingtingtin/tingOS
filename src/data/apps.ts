import {
  Palette,
  FileText,
  Terminal,
  Github,
  Mail,
  LucideIcon,
  Twitter,
} from "lucide-react";

export interface AppConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  isPinned: boolean;
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
    id: "resume",
    label: "resume.txt",
    icon: FileText,
    route: "/resume",
    isPinned: false,
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    route: "/contact",
    isPinned: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: Terminal,
    route: "/terminal",
    isPinned: true,
  },
];
