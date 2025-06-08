/**
 * Character Storage Utilities
 * Handles saving and loading characters to/from browser localStorage
 */

const STORAGE_KEY = 'atomicTomorrowCharacters';

/**
 * Get all saved characters from localStorage
 * @returns {Array} Array of saved character objects
 */
export const getSavedCharacters = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved characters:', error);
    return [];
  }
};

/**
 * Save a character to localStorage
 * @param {Object} character - Character data
 * @param {string} characterName - Name for this save (defaults to character.name)
 * @returns {boolean} Success status
 */
export const saveCharacter = (character, characterName = null) => {
  try {
    const characters = getSavedCharacters();
    const saveName = characterName || character.name || 'Unnamed Character';
    
    const saveData = {
      id: generateSaveId(),
      name: saveName,
      character: { ...character },
      savedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    // Check if character with same name exists
    const existingIndex = characters.findIndex(save => save.name === saveName);
    
    if (existingIndex >= 0) {
      // Update existing save
      characters[existingIndex] = {
        ...characters[existingIndex],
        character: { ...character },
        lastModified: new Date().toISOString()
      };
    } else {
      // Add new save
      characters.push(saveData);
    }
    
    // Sort by last modified (most recent first)
    characters.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return true;
  } catch (error) {
    console.error('Error saving character:', error);
    return false;
  }
};

/**
 * Load a character from localStorage
 * @param {string} saveId - ID of the save to load
 * @returns {Object|null} Character data or null if not found
 */
export const loadCharacter = (saveId) => {
  try {
    const characters = getSavedCharacters();
    const save = characters.find(save => save.id === saveId);
    return save ? save.character : null;
  } catch (error) {
    console.error('Error loading character:', error);
    return null;
  }
};

/**
 * Delete a saved character
 * @param {string} saveId - ID of the save to delete
 * @returns {boolean} Success status
 */
export const deleteCharacter = (saveId) => {
  try {
    const characters = getSavedCharacters();
    const filteredCharacters = characters.filter(save => save.id !== saveId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCharacters));
    return true;
  } catch (error) {
    console.error('Error deleting character:', error);
    return false;
  }
};

/**
 * Generate a unique ID for saves
 * @returns {string} Unique identifier
 */
const generateSaveId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Get storage usage information
 * @returns {Object} Storage stats
 */
export const getStorageStats = () => {
  try {
    const characters = getSavedCharacters();
    const dataSize = JSON.stringify(characters).length;
    
    return {
      characterCount: characters.length,
      dataSize: dataSize,
      dataSizeFormatted: formatBytes(dataSize)
    };
  } catch (error) {
    return {
      characterCount: 0,
      dataSize: 0,
      dataSizeFormatted: '0 B'
    };
  }
};

/**
 * Format bytes for display
 * @param {number} bytes 
 * @returns {string} Formatted size string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};