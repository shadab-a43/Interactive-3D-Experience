# Interactive 3D Experience

## Overview
This is a small interactive 3D product configurator built with React, TypeScript, Three.js, and React Three Fiber.

## Features
- Interactive 3D car
- Interactive smart speaker
- Mouse/touch orbit and zoom
- Three material options: Pearl White, Midnight Blue, Sunset Orange
- Auto Rotate toggle
- Responsive/mobile-friendly layout
- prefers-reduced-motion support
- Procedural 3D geometry with no external 3D model files

## Tech Stack
- React
- TypeScript
- Three.js
- React Three Fiber
- Vite

## Performance & Accessibility
Lighthouse results from the production preview:
- Performance: 87
- Accessibility: 94
- Best Practices: 100
- SEO: 91
- First Contentful Paint: 2.5s
- Largest Contentful Paint: 2.5s
- Cumulative Layout Shift: 0
- Total network transfer: about 306 KiB

The main performance consideration is the JavaScript bundle size. With more time, future optimization could include code splitting and deferred loading of the 3D experience.

## Run Locally
```bash
npm install
npm run dev
```

Additional commands:
```bash
npm run build
npm run preview
```

## What I Would Add With More Time
- lazy-load the 3D experience
- optimize and code-split the JavaScript bundle
- add more lightweight 3D configurations
