#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// Configuration - adjust these paths as needed
const SITE_PATH = '../../../sfxrpg.com/tools/character-creator';
const DIST_PATH = './dist';
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
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  try {
    // Check if dist directory exists
    if (!existsSync(DIST_PATH)) {
      log('❌ Dist directory not found. Run "npm run build" first.', 'red');
      process.exit(1);
    }

    // Check if site directory exists
    if (!existsSync(SITE_PATH)) {
      log('❌ Site directory not found. Please check the SITE_PATH in this script.', 'red');
      log(`   Looking for: ${path.resolve(SITE_PATH)}`, 'yellow');
      process.exit(1);
    }

    log('🔄 Syncing character creator to site...', 'blue');

    // Create the target directories if they don't exist
    execSync(`mkdir -p "${SITE_PATH}"`, { stdio: 'inherit' });
    execSync(`mkdir -p "${PORTRAITS_TARGET}"`, { stdio: 'inherit' });

    // Sync main files (preserving directory structure)
    execSync(`rsync -av --delete "${DIST_PATH}/" "${SITE_PATH}/"`, { stdio: 'inherit' });

    // Sync portraits if they exist
    if (existsSync(PORTRAITS_SOURCE)) {
      log('🖼️  Syncing portraits...', 'blue');
      execSync(`rsync -av --delete "${PORTRAITS_SOURCE}/" "${PORTRAITS_TARGET}/"`, { stdio: 'inherit' });
      log('✅ Portraits synced!', 'green');
    } else {
      log('⚠️  No portraits directory found to sync', 'yellow');
    }

    log('✅ Successfully synced to site!', 'green');
    log(`   Files copied to: ${path.resolve(SITE_PATH)}`, 'blue');
    log(`   Portraits copied to: ${path.resolve(PORTRAITS_TARGET)}`, 'blue');

  } catch (error) {
    log(`❌ Sync failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();