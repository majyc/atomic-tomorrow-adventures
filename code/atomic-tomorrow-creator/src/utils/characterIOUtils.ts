// Utility functions for character import and export

import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';
import { PORTRAITS } from '../utils/portraits';

/**
 * Export a character to a serialized string format
 * @param character The character data to export
 * @param notes Additional notes to include
 * @returns The exported character code string
 */
export const exportCharacter = (character, notes = '') => {
  try {
    // Create a simplified object with just the essential data
    const exportData = {
      v: 1, // Version number for future compatibility
      n: character.name || '',
      e: character.epithet?.id || '',
      p: character.profession?.id || '',
      o: character.origin?.id || '',
      b: character.background?.id || '',
      a: { // Attributes
        br: character.attributes?.BRAWN || 10,
        re: character.attributes?.REFLEX || 10,
        ne: character.attributes?.NERVE || 10,
        sa: character.attributes?.SAVVY || 10,
        ch: character.attributes?.CHARM || 10,
        gr: character.attributes?.GRIT || 10,
        gu: character.attributes?.GUILE || 10
      },
      ap: character.appearance || '',
      ps: character.personality || '',
      ag: character.age || 30,
      po: character.portrait?.id || '',
      cr: character.credits || 0,
      eq: character.equipment?.map(item => ({
        n: typeof item === 'string' ? item : item.name,
        c: typeof item === 'string' ? 'Miscellaneous' : item.category,
        q: typeof item === 'string' ? 1 : item.quantity
      })) || [],
      sg: character.signatureGadget ? {
        n: character.signatureGadget.name,
        b: character.signatureGadget.baseItem,
        e: character.signatureGadget.effects
      } : null,
      nt: notes || ''
    };
    
    // Convert to JSON and then to base64
    const jsonString = JSON.stringify(exportData);
    
    // Simple run-length encoding for compression
    const compressed = compressString(jsonString);
    
    // Convert to base64 for safer transport - handle unicode characters
    const base64String = btoa(unescape(encodeURIComponent(compressed)));
    
    // Format with prefix for identification
    const exportString = `AT-CHAR-${base64String}`;
    
    return exportString;
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Failed to export character: ${error.message}`);
  }
};

/**
 * Copy a character code to the clipboard
 * @param exportString The character code to copy
 * @returns Boolean indicating success
 */
export const copyToClipboard = (exportString) => {
  try {
    // Create a text area with the export string
    const textArea = document.createElement('textarea');
    textArea.value = exportString;
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Copy to clipboard
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Clipboard copy error:', error);
    return false;
  }
};

/**
 * Import a character from a serialized string format
 * @param importString The character code to import
 * @returns Object with the imported character data and notes
 */
export const importCharacter = (importString) => {
  try {
    // Check if the import string is valid
    if (!importString.trim()) {
      throw new Error('Please enter a character code');
    }
    
    const trimmedString = importString.trim();
    
    // Extract the base64 string (remove the prefix)
    if (!trimmedString.startsWith('AT-CHAR-')) {
      throw new Error('Invalid character code format. Code should start with AT-CHAR-');
    }
    
    const base64String = trimmedString.substring(8);
    
    // Decode from base64 - handle unicode characters
    let compressed;
    try {
      compressed = decodeURIComponent(escape(atob(base64String)));
    } catch (e) {
      throw new Error('Invalid character code. Base64 decoding failed.');
    }
    
    // Decompress
    const jsonString = decompressString(compressed);
    
    // Parse the JSON
    let importData;
    try {
      importData = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid character code. JSON parsing failed.');
    }
    
    // Check if required fields exist
    if (!importData.v || importData.v !== 1) {
      throw new Error('Unsupported character code version.');
    }
    
    // Reconstruct the character
    const newCharacter = {
      name: importData.n || '',
      epithet: EPITHETS.find(e => e.id === importData.e) || null,
      profession: PROFESSIONS.find(p => p.id === importData.p) || null,
      origin: ORIGINS.find(o => o.id === importData.o) || null,
      background: BACKGROUNDS.find(b => b.id === importData.b) || null,
      attributes: {
        BRAWN: importData.a?.br || 10,
        REFLEX: importData.a?.re || 10,
        NERVE: importData.a?.ne || 10,
        SAVVY: importData.a?.sa || 10,
        CHARM: importData.a?.ch || 10,
        GRIT: importData.a?.gr || 10,
        GUILE: importData.a?.gu || 10
      },
      appearance: importData.ap || '',
      personality: importData.ps || '',
      age: importData.ag || 30,
      portrait: PORTRAITS.find(p => p.id === importData.po) || null,
      credits: importData.cr || 0,
      equipment: importData.eq?.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.n,
        category: item.c,
        quantity: item.q
      })) || [],
      signatureGadget: importData.sg ? {
        name: importData.sg.n,
        baseItem: importData.sg.b,
        effects: importData.sg.e
      } : null
    };
    
    // Return both the character data and notes
    return {
      character: newCharacter,
      notes: importData.nt || ''
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Simple compression function using run-length encoding
 */
const compressString = (input) => {
  let result = '';
  let count = 1;
  let char = input[0];
  
  for (let i = 1; i <= input.length; i++) {
    if (i < input.length && input[i] === char) {
      count++;
    } else {
      // If count is 3 or more, use run-length encoding
      if (count >= 3) {
        result += char + '*' + count;
      } else {
        // Otherwise just add the characters
        result += char.repeat(count);
      }
      char = input[i];
      count = 1;
    }
  }
  
  return result;
};

/**
 * Decompression function for run-length encoded strings
 */
const decompressString = (input) => {
  let result = '';
  let i = 0;
  
  while (i < input.length) {
    if (i + 2 < input.length && input[i+1] === '*') {
      // This is a compressed sequence
      const char = input[i];
      let countStr = '';
      i += 2; // Skip the character and the '*'
      
      // Read the count
      while (i < input.length && /\d/.test(input[i])) {
        countStr += input[i];
        i++;
      }
      
      const count = parseInt(countStr, 10);
      result += char.repeat(count);
    } else {
      // Regular character
      result += input[i];
      i++;
    }
  }
  
  return result;
};