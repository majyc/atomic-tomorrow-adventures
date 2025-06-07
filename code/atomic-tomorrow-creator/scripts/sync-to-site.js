#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// Configuration - adjust these paths as needed
const SITE_PATH = '../../../sfxrpg.com/tools/character-creator';
const DIST_PATH = './dist';

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

    // Create the target directory if it doesn't exist
    execSync(`mkdir -p "${SITE_PATH}"`, { stdio: 'inherit' });

    // Sync files (preserving directory structure)
    execSync(`rsync -av --delete "${DIST_PATH}/" "${SITE_PATH}/"`, { stdio: 'inherit' });

    log('✅ Successfully synced to site!', 'green');
    log(`   Files copied to: ${path.resolve(SITE_PATH)}`, 'blue');

  } catch (error) {
    log(`❌ Sync failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();