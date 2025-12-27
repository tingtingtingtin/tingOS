# tingOS Portfolio

A desktop OS-inspired personal portfolio website built with Next.js.

## Features

### Desktop OS Experience

- **Boot Sequence & Lock Screen**: Full startup animations with loading messages, time display, and drag-to-unlock lock screen
- **User Authentication**: Guest and admin (password-protected) user accounts with session management
- **Icon Grid**: Desktop icons to launch applications
- **Taskbar**: Bottom taskbar with pinned apps, running indicators, system controls, and settings panel
- **Window Management**: Open multiple windows that can be closed and reopened
- **Dark/Light Theme Toggle**: Theme preferences stored and synced across the system
- **Motion Controls**: Toggle reduced motion via settings panel for accessibility

### Applications

- **About**: Interactive drawing canvas with personal bio and notebook-style layout
  - Smooth quadratic bezier brush strokes
  - Eraser tool with adjustable brush size (1-60px)
  - Touch and mouse support with custom cursor preview
  - Non-destructive canvas resize
  - Keyboard shortcuts (E to toggle eraser, C to clear canvas)
- **Projects**: GitHub Webhook-integrated project showcase
  - Live commit activity with GitHub user data
  - Displays latest commits and repository information
  - Automatic revalidation via GitHub webhooks
- **Experience**: Twitter-style feed with experience and education
  - Tab-based view switching between roles and education
  - Tweet-style cards with engagement metrics
- **Contact**: Interactive messenger-style contact form
  - Multi-step conversational interface with bot replies
  - Form validation and email submission via `/api/send`
  - Typing indicators and smooth scrolling
- **Terminal**: Full in-browser terminal emulator
  - xterm.js-based terminal with vim-like styling
  - Virtual file system that mirrors GitHub repository structure
  - Lazy-loaded file content from GitHub API
  - Session-cached filesystem for performance
  - Command processing with navigation and file operations
- **Resume**: Resume PDF viewer

### State Management

- **Zustand** store for managing running applications, motion preferences, and theme settings
- Session storage for authentication state and filesystem caching
- GitHub Webhook API integration with HMAC signature verification for live data updates

## Tech Stack

- **Framework**: Next.js with TypeScript
- **UI/Animation**: React, Framer Motion
- **Terminal**: xterm.js with FitAddon for responsive sizing
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, React Icons
- **Storage**: Zustand (state), sessionStorage (caching)
- **API**: GitHub REST API for repos and commits

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view. You may need ngrok for testing GitHub webhooks.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

# Design Notes

- Mobile-first responsive design with distinct desktop/mobile layouts
- Accessibility optimizations including reduced motion support
- Dark mode support throughout with preference detection

## Performance & Mobile Optimizations

### Interaction Latency (INP)
- Disabled expensive React state updates for cursor previews on touch devices
- Transitioned canvas rendering to `requestAnimationFrame` to decouple drawing from main thread

### Prefetching Strategy
- **Boot-time**: Background-loads all primary routes during the 1.6s boot animation
- **Intent-based**: Dynamically prefetches application chunks on icon hover/keyboard focus
- Standardized boot manager initialization to prevent "hydration flicker" on lock screen for authenticated users

---

_Work in progress: Terminal commands and features continue to expand_
