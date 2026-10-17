# Lugat-ı Âlem — Ottoman & Historical Lexicon Mobile App

A cross-platform mobile dictionary application built with Next.js 16, React 19, Capacitor 8, and Firebase. Designed to deliver rotating historical and Ottoman Turkish vocabulary to users with daily discovery features, favorites, and notification support.

---

## Overview

Classical and Ottoman literature contains rich vocabulary that is often absent in contemporary Turkish vernacular. **Lugat-ı Âlem** makes rediscovering historical terminology effortless through a modern, responsive mobile interface powered by Capacitor, delivering daily rotating words, detailed etymological definitions, and contextual usage examples.

---

## Features

- **Daily Word Discovery:** Rotating Ottoman and classical terms with pronunciation, root origins, and contextual sentences.
- **Cross-Platform Architecture:** Web codebase compiled natively to Android via Capacitor 8.
- **Local Notifications:** Daily reminders and word-of-the-day notifications via `@capacitor/local-notifications`.
- **User Preferences & Bookmarks:** Offline-first saved favorites using `@capacitor/preferences`.
- **Firebase Backend:** Cloud-synced dictionary database and user state management.
- **Modern Design:** Polished typography and styling with Tailwind CSS and Radix/Shadcn primitives.

---

## Tech Stack

- **Framework:** Next.js 16, React 19
- **Mobile Runtime:** Capacitor 8 (`@capacitor/core`, `@capacitor/android`)
- **Backend / Auth:** Firebase 12
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **State & Storage:** Capacitor Preferences, Local Notifications

---

## Project Structure

```
ottoman-lexicon/
├── SOZLUK/                      # Core Next.js + Capacitor application
│   ├── app/                     # Next.js app router & pages
│   ├── components/              # UI components & word cards
│   ├── android/                 # Native Android project wrapper
│   ├── constants/               # Lexicon datasets & categories
│   ├── hooks/                   # Custom application hooks
│   ├── capacitor.config.json    # Capacitor build configuration
│   ├── package.json
│   └── .env.example             # Firebase environment template
│
└── store-assets/                # Store listing assets & graphics
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18+ (pnpm or npm)
- Android Studio & Android SDK (for native Android builds)

### 2. Environment Configuration

Navigate to the `SOZLUK` directory and copy `.env.example` to `.env.local`:

```bash
cd SOZLUK
cp .env.example .env.local
```

Fill in your Firebase project credentials.

### 3. Web Development Server

```bash
pnpm install
pnpm dev
```

### 4. Android Build & Sync

```bash
pnpm build
npx cap sync android
npx cap open android
```

---

## License

© 2026 Umutcan Kırımlı. All rights reserved. The source code is published for viewing as part of a portfolio; copying, redistribution or use in other apps requires written permission.
