/**
 * Sprite Sheet Portrait System
 * Allows loading portraits from larger tiled images instead of individual files
 */

// Sprite sheet configurations
export const SPRITE_SHEETS = {
  // Example configuration - adjust based on your actual sprite sheets
  'male_sheet_1': {
    path: '/portraits/sprites/male_sheet_1.png',
    cols: 4,
    rows: 3,
    startIndex: 31, // What number to start counting from
    gender: 'm'
  },
  'female_sheet_1': {
    path: '/portraits/sprites/female_sheet_1.png', 
    cols: 4,
    rows: 3,
    startIndex: 31,
    gender: 'f'
  }
  // Add more sprite sheets as needed
};

/**
 * Generate sprite-based portrait data
 * @returns {Array} Array of portrait objects with sprite information
 */
export const generateSpritePortraits = () => {
  const portraits = [];
  
  Object.entries(SPRITE_SHEETS).forEach(([sheetId, config]) => {
    const totalPortraits = config.cols * config.rows;
    
    for (let i = 0; i < totalPortraits; i++) {
      const row = Math.floor(i / config.cols);
      const col = i % config.cols;
      const portraitNumber = config.startIndex + i;
      
      portraits.push({
        id: `${config.gender}_${portraitNumber}`,
        name: `${config.gender}_${portraitNumber}.jpg`,
        path: config.path, // Path to the sprite sheet
        isSprite: true,
        spriteData: {
          sheetId,
          col,
          row,
          cols: config.cols,
          rows: config.rows,
          index: i
        },
        gender: config.gender
      });
    }
  });
  
  return portraits;
};

/**
 * Create CSS background-position for sprite
 * @param {Object} spriteData - Sprite positioning data
 * @returns {Object} CSS styles for background positioning
 */
export const getSpriteStyles = (spriteData) => {
  if (!spriteData) return {};
  
  const { col, row, cols, rows } = spriteData;
  
  // Calculate percentage positions
  const backgroundPositionX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
  const backgroundPositionY = rows > 1 ? (row / (rows - 1)) * 100 : 0;
  
  return {
    backgroundImage: `url(${spriteData.path})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
    backgroundRepeat: 'no-repeat'
  };
};

/**
 * React component for displaying sprite-based portraits
 */
import React from 'react';

export const SpritePortrait = ({ portrait, className = '', style = {}, ...props }) => {
  if (!portrait.isSprite) {
    // Fallback to regular image
    return (
      <img 
        src={portrait.path} 
        alt={portrait.name}
        className={className}
        style={style}
        {...props}
      />
    );
  }
  
  const spriteStyles = getSpriteStyles(portrait.spriteData);
  
  return (
    <div
      className={className}
      style={{
        ...spriteStyles,
        ...style
      }}
      {...props}
    />
  );
};

/**
 * Preload sprite sheets for better performance
 * @param {Array} sheetIds - Array of sprite sheet IDs to preload
 */
export const preloadSpriteSheets = (sheetIds = null) => {
  const sheetsToLoad = sheetIds || Object.keys(SPRITE_SHEETS);
  
  sheetsToLoad.forEach(sheetId => {
    const config = SPRITE_SHEETS[sheetId];
    if (config) {
      const img = new Image();
      img.src = config.path;
      // Optional: add onload/onerror handlers
    }
  });
};