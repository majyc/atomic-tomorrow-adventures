# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based website for "Atomic Tomorrow Adventures," a work-in-progress TTRPG set in the retrofuturistic year 2025. The project contains:

1. **Jekyll Site** - Main documentation and game rules website
2. **React Character Creator** - Interactive character generation app (`code/atomic-tomorrow-creator/`)
3. **Game System Documentation** - Markdown files organized by category (`game-system/`)
4. **Manuscript** - Book volumes for the complete game

## Commands

### Jekyll Site
```bash
# Install dependencies
bundle install

# Serve locally (from root directory)
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

### React Character Creator App
```bash
# Navigate to app directory
cd code/atomic-tomorrow-creator

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Jekyll Site Structure
- Uses `minima` theme with custom layouts in `_layouts/`
- Game rules organized in `game-system/` directory with subdirectories:
  - `character-options/` - Character creation, professions, epithets
  - `core-rules/` - Combat, skills, task resolution systems
  - `equipment/` - Gear catalogs and pricing
  - `rocketships/` - Spacecraft rules and catalogs
  - `setting/` - World details organized by planets/locations
- Collections configured for `rules` and `setting` content types
- Excludes `code/` directory from Jekyll build

### React Character Creator
- **Main App**: `AtomicTomorrowApp.jsx` - Multi-step character creation wizard
- **State Management**: Character data stored in component state with step-based progression
- **Data Layer**: Static data files in `src/data/` (professions, epithets, origins, backgrounds, skills)
- **Components**: Organized by functionality in `src/components/`
  - Character concept and attribute generation
  - Equipment and derived stats panels
  - Character sheet export/import
  - Retro-styled UI components (terminal, buttons, progress indicators)
- **Styling**: Custom CSS themes in `src/styles/` with retro-futuristic aesthetic
- **Utils**: Character I/O, attribute calculations, print utilities in TypeScript

### Data Flow
The React app uses a step-based wizard (4 steps) where each step populates character data that flows to subsequent steps. Character data can be exported/imported as JSON.

### Key Technologies
- Jekyll 4.4.1 with standard plugins
- React 19 with Vite build system
- Tailwind CSS + custom retro styling
- Lucide React icons
- TypeScript for utilities