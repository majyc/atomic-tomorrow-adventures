#!/usr/bin/env node

import { spawn } from 'child_process';
import chokidar from 'chokidar';
import { execSync } from 'child_process';
import { updatePortraitsFile, scanPortraits } from './update-portrait-counts.js';

// Configuration
const DIST_PATH = './dist';
const SITE_PATH = '../../../sfxrpg.com/tools/character-creator';
const PORTRAITS_SOURCE = './public/portraits';
const PORTRAITS_TARGET = '../../../sfxrpg.com/tools/character-creator/portraits';

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

function syncPortraits() {
  try {
    execSync(`mkdir -p "${PORTRAITS_TARGET}"`, { stdio: 'pipe' });
    execSync(`rsync -av --delete "${PORTRAITS_SOURCE}/" "${PORTRAITS_TARGET}/"`, { stdio: 'pipe' });
    log('🖼️  Portraits synced to site', 'green');
  } catch (error) {
    log(`❌ Portrait sync failed: ${error.message}`, 'red');
  }
}

async function updatePortraitCounts() {
  try {
    const counts = await scanPortraits();
    await updatePortraitsFile(counts);
    log(`📊 Portrait counts updated: ${counts.male}M, ${counts.female}F`, 'green');
  } catch (error) {
    log(`❌ Portrait count update failed: ${error.message}`, 'red');
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
  const distWatcher = chokidar.watch(DIST_PATH, {
    ignored: /node_modules/,
    persistent: true
  });

  distWatcher.on('change', () => {
    log('📁 Dist files changed, syncing...', 'yellow');
    setTimeout(syncFiles, 100); // Small delay to ensure file write is complete
  });

  distWatcher.on('add', () => {
    log('📁 New file added, syncing...', 'yellow');
    setTimeout(syncFiles, 100);
  });

  distWatcher.on('unlink', () => {
    log('📁 File removed, syncing...', 'yellow');
    setTimeout(syncFiles, 100);
  });

  // Watch portraits directory for changes
  const portraitWatcher = chokidar.watch(PORTRAITS_SOURCE, {
    ignored: /node_modules/,
    persistent: true
  });

  portraitWatcher.on('change', () => {
    log('🖼️  Portraits changed, syncing...', 'yellow');
    setTimeout(syncPortraits, 100);
  });

  portraitWatcher.on('add', (filePath) => {
    log('🖼️  New portrait added, updating counts and syncing...', 'yellow');
    setTimeout(async () => {
      await updatePortraitCounts();
      syncPortraits();
    }, 100);
  });

  portraitWatcher.on('unlink', (filePath) => {
    log('🖼️  Portrait removed, updating counts and syncing...', 'yellow');
    setTimeout(async () => {
      await updatePortraitCounts();
      syncPortraits();
    }, 100);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    log('🛑 Stopping watch mode...', 'yellow');
    viteProcess.kill();
    distWatcher.close();
    portraitWatcher.close();
    process.exit(0);
  });

  log('👀 Watching for changes... Press Ctrl+C to stop', 'green');
}

main();