#!/usr/bin/env node

import { spawn } from 'child_process';
import chokidar from 'chokidar';
import { execSync } from 'child_process';

// Configuration
const DIST_PATH = './dist';
const SITE_PATH = '../../../sfxrpg.com/tools/character-creator';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function syncFiles() {
  try {
    execSync(`rsync -av --delete "${DIST_PATH}/" "${SITE_PATH}/"`, { stdio: 'pipe' });
    log('✅ Files synced to site', 'green');
  } catch (error) {
    log(`❌ Sync failed: ${error.message}`, 'red');
  }
}

function main() {
  log('🚀 Starting watch mode with auto-sync...', 'blue');
  
  // Start Vite in build watch mode
  const viteProcess = spawn('npx', ['vite', 'build', '--watch'], {
    stdio: 'inherit',
    shell: true
  });

  // Watch dist directory for changes
  const watcher = chokidar.watch(DIST_PATH, {
    ignored: /node_modules/,
    persistent: true
  });

  watcher.on('change', () => {
    log('📁 Dist files changed, syncing...', 'yellow');
    setTimeout(syncFiles, 100); // Small delay to ensure file write is complete
  });

  watcher.on('add', () => {
    log('📁 New file added, syncing...', 'yellow');
    setTimeout(syncFiles, 100);
  });

  watcher.on('unlink', () => {
    log('📁 File removed, syncing...', 'yellow');
    setTimeout(syncFiles, 100);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    log('🛑 Stopping watch mode...', 'yellow');
    viteProcess.kill();
    watcher.close();
    process.exit(0);
  });

  log('👀 Watching for changes... Press Ctrl+C to stop', 'green');
}

main();