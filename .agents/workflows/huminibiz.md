---
description:
---

React Native CLI (not Expo)

TypeScript (strict mode enabled)

GlueStack UI for components

Zustand for global state management

TanStack Query for API calls and server state

No dark mode support (light theme only)

Pixel-perfect UI implementation from Figma

Scalable folder structure

Production-ready architecture

API Handling

Always use TanStack Query for API calls.

Never use useEffect + fetch directly.

Create API functions inside src/services/

Queries must be reusable and clean.

Example structure:

services/
auth.service.ts
user.service.ts
7️⃣ Global State

Use Zustand for global app state.

Do not use Redux.

Do not use Context API for global state unless absolutely required.

Keep stores modular.

Example:

store/
auth.store.ts
user.store.ts
🔐 Authentication Pattern

Store tokens securely.

Separate auth logic from UI.

Use interceptors if needed.

Follow scalable architecture.

🎬 Animation Rules

Use React Native Reanimated (if animation required).

Avoid heavy animation libraries.

Keep animations smooth and native-like.

Optimize performance.

🧼 Code Quality Rules

AI must:

Use TypeScript properly (no any unless unavoidable).

Write reusable components.

Avoid duplicate code.

Use clean naming conventions.

Avoid deeply nested logic.

Keep components small and focused.

Follow separation of concerns.

🚀 Performance Rules

Avoid unnecessary re-renders.

Use memoization where needed.

Avoid inline functions inside render.

Use FlashList instead of FlatList for large lists (if needed).

Optimize images properly.

🧪 Production Readiness

Error handling must be included.

Loading states must be included.

Empty states must be included.

API failure states must be handled properly.

No console.logs in production code.

📦 Dependency Rules

Before suggesting a new library:

AI must:

Justify why it is needed.

Ensure it is compatible with React Native CLI.

Avoid unnecessary packages.

📱 Platform Rules

Ensure Android and iOS compatibility.

Mention platform-specific code if required.

Avoid Expo-only packages.

🧩 Component Rules

When creating a new feature:

AI must generate:

Screen

Reusable components (if needed)

API service

Zustand store (if global state required)

Proper TypeScript types

🛑 Strict Prohibitions

AI must NOT:

Use Expo APIs

Add dark mode

Install random UI libraries

Use Redux

Use inline SVG strings

Break folder structure

Write unscalable code

IMPORTANT: ALWAYS USE THE gluestack UI ELEMENT TO DEVELOP THE UI

FOR THE ASSETS, YOU HAVE TO DOWNLOAD THE SVG FILE AND KEEP UNDER THE ASSETS FOLDER THEN USE IN THE UI SCREEN
