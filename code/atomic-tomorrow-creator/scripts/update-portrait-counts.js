#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Paths
const PORTRAITS_DIR = './public/portraits';
const PORTRAITS_JS_PATH = './src/utils/portraits.js';

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

async function scanPortraits() {
  try {
    if (!existsSync(PORTRAITS_DIR)) {
      log(`⚠️  Portraits directory not found: ${PORTRAITS_DIR}`, 'yellow');
      return { male: 0, female: 0 };
    }

    const files = await readdir(PORTRAITS_DIR);
    
    // Filter and count portrait files
    const malePortraits = files.filter(file => 
      file.match(/^m_\d+\.(jpg|jpeg|png|webp)$/i)
    );
    
    const femalePortraits = files.filter(file => 
      file.match(/^f_\d+\.(jpg|jpeg|png|webp)$/i)
    );

    // Extract numbers to find the highest index
    const getMaleCount = () => {
      const numbers = malePortraits.map(file => {
        const match = file.match(/^m_(\d+)\./i);
        return match ? parseInt(match[1]) : 0;
      });
      return numbers.length > 0 ? Math.max(...numbers) : 0;
    };

    const getFemaleCount = () => {
      const numbers = femalePortraits.map(file => {
        const match = file.match(/^f_(\d+)\./i);
        return match ? parseInt(match[1]) : 0;
      });
      return numbers.length > 0 ? Math.max(...numbers) : 0;
    };

    const counts = {
      male: getMaleCount(),
      female: getFemaleCount()
    };

    log(`📊 Portrait scan results:`, 'blue');
    log(`   Male portraits: ${counts.male} (files: ${malePortraits.length})`, 'blue');
    log(`   Female portraits: ${counts.female} (files: ${femalePortraits.length})`, 'blue');

    // Show some example filenames for verification
    if (malePortraits.length > 0) {
      log(`   Male examples: ${malePortraits.slice(0, 3).join(', ')}${malePortraits.length > 3 ? '...' : ''}`, 'blue');
    }
    if (femalePortraits.length > 0) {
      log(`   Female examples: ${femalePortraits.slice(0, 3).join(', ')}${femalePortraits.length > 3 ? '...' : ''}`, 'blue');
    }

    return counts;
  } catch (error) {
    log(`❌ Error scanning portraits: ${error.message}`, 'red');
    return { male: 0, female: 0 };
  }
}

async function updatePortraitsFile(newCounts) {
  try {
    if (!existsSync(PORTRAITS_JS_PATH)) {
      log(`❌ Portraits file not found: ${PORTRAITS_JS_PATH}`, 'red');
      return false;
    }

    // Read the current file
    const currentContent = await readFile(PORTRAITS_JS_PATH, 'utf8');
    
    // Replace the PORTRAIT_COUNTS object
    const updatedContent = currentContent.replace(
      /export const PORTRAIT_COUNTS = \{[^}]*\};/,
      `export const PORTRAIT_COUNTS = {
  male: ${newCounts.male},   // Auto-updated from portraits directory
  female: ${newCounts.female}  // Auto-updated from portraits directory
};`
    );

    // Write the updated file
    await writeFile(PORTRAITS_JS_PATH, updatedContent, 'utf8');
    
    log(`✅ Updated portrait counts in ${PORTRAITS_JS_PATH}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error updating portraits file: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🔍 Scanning portraits directory...', 'blue');
  
  const counts = await scanPortraits();
  
  if (counts.male === 0 && counts.female === 0) {
    log('⚠️  No portraits found - keeping existing configuration', 'yellow');
    return;
  }
  
  log('🔄 Updating portraits configuration...', 'blue');
  const success = await updatePortraitsFile(counts);
  
  if (success) {
    log('🎨 Portrait configuration updated successfully!', 'green');
    log(`   Ready to use ${counts.male + counts.female} total portraits`, 'green');
  } else {
    log('❌ Failed to update portrait configuration', 'red');
    process.exit(1);
  }
}

// Only run if called directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(`❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

export { scanPortraits, updatePortraitsFile };