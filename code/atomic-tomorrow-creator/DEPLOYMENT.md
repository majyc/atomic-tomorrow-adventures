# Deployment Guide

This character creator app can be automatically synced to the sfxrpg.com website.

## Available Commands

### Development
```bash
npm run dev          # Local development server
npm run dev:sync     # Development with auto-sync to site (watches for changes)
```

### Production Deployment
```bash
npm run build        # Build to local dist/ directory
npm run sync         # Sync dist/ to sfxrpg.com/tools/character-creator/
npm run deploy       # Build + sync in one command (recommended)
```

### Alternative Build Targets
```bash
npm run build:site   # Build directly to site directory (skips local dist/)
```

## How It Works

1. **Vite Configuration**: Uses `base: './'` for relative paths, making the app deployable to any subdirectory
2. **Portrait Paths**: Uses `PORTRAITS_BASE_PATH = './portraits/'` for relative portrait references
3. **Sync Script**: Uses `rsync` to efficiently copy only changed files to the site
4. **Watch Mode**: Automatically rebuilds and syncs when source files change

## File Paths

- **Source**: `atomic-tomorrow-adventures/code/atomic-tomorrow-creator/`
- **Build Output**: `dist/`
- **Site Target**: `../../../sfxrpg.com/tools/character-creator/`

## Configuration

To change the sync target, edit the `SITE_PATH` variable in:
- `scripts/sync-to-site.js`
- `scripts/watch-and-sync.js`
- `vite.config.js` (for `build:site` command)

## Dependencies

- `cross-env`: For cross-platform environment variables
- `chokidar`: For file watching in development mode
- `rsync`: For efficient file synchronization (should be available on most Unix-like systems)