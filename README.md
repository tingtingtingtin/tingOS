# tingOS Portfolio

A desktop OS-inspired personal portfolio website built with Next.js.

## Features

### Desktop Interface

- **Icon Grid**: Launch applications by clicking desktop icons
- **Taskbar**: Bottom taskbar with pinned apps, running indicators, and system controls
- **Window Management**: Open multiple windows that can be closed and reopened
- **Motion Controls**: Toggle reduced motion via settings panel

### Pages

- **About**: Interactive drawing canvas with personal bio and notebook-style layout
  - Smooth quadratic bezier brush strokes
  - Eraser tool with adjustable brush size
  - Touch and mouse support
  - Custom cursor preview
  - Non-destructive canvas resize
- **Projects**: GitHub Webhook-integrated project showcase with latest commit activity and user data
- **Resume**: Text-based resume viewer

### State Management

- Zustand store for managing running applications and motion preferences
- GitHub Webhook API integration for fetching live commit data, with revalidation logic via POST request

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

---

_Work in progress_
