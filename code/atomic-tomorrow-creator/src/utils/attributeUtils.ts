// attributeUtils.ts - Utilities for attribute generation and calculation

// Standard array for Terran characters
export const standardArray = [15, 14, 12, 11, 10, 9, 8];

// Origins with their attribute modifiers
export const originModifiers: Record<string, Record<string, number>> = {
  'terran': { 'SAVVY': 1, 'GRIT': -1 },
  'loonie': { 'BRAWN': -1, 'REFLEX': 1, 'GUILE': 1 },
  'martian': { 'BRAWN': 1, 'GRIT': 1, 'CHARM': -1 },
  'venusian': { 'CHARM': 1, 'SAVVY': 1, 'GRIT': -1 },
  'belter': { 'BRAWN': -1, 'GUILE': 1, 'GRIT': 1 },
  'jovian': { 'BRAWN': 1, 'NERVE': 1, 'CHARM': -1 },
  'saturnian': { 'REFLEX': 1, 'SAVVY': 1, 'BRAWN': -1 },
  'deep-spacer': { 'NERVE': 1, 'GRIT': 1, 'CHARM': -1 },
  'genmodded': {}, // Variable - player chooses
  'red-martian': { 'NERVE': 2, 'BRAWN': -1 },
  'mercury-native': { 'GRIT': 2, 'REFLEX': -1 },
  'titan-colonist': { 'SAVVY': 1, 'GRIT': 1, 'CHARM': -1 },
  'neptunian': { 'NERVE': 1, 'SAVVY': 1, 'BRAWN': -1 },
  'ceres-engineer': { 'SAVVY': 2, 'CHARM': -1 },
  'pluto-outpost': { 'NERVE': 1, 'GRIT': 1, 'CHARM': -1 }
};

// Attribute descriptions
export const attributeDescriptions: Record<string, string> = {
  'BRAWN': 'Physical strength, toughness, and stamina',
  'REFLEX': 'Speed, dexterity, and reaction time',
  'NERVE': 'Willpower, courage, and psychic potential',
  'SAVVY': 'Intelligence, education, and technical aptitude',
  'CHARM': 'Charisma, appearance, and social intuition',
  'GRIT': 'Determination, endurance, and pain tolerance',
  'GUILE': 'Cunning, manipulation, and deception'
};

/**
 * Get the modifiers for a specific origin
 * @param originId The ID of the character's origin
 */
export const getOriginModifiers = (originId?: string): Record<string, number> => {
  if (!originId || !originModifiers[originId]) {
    return {};
  }
  return originModifiers[originId];
};

/**
 * Get description for a specific attribute
 * @param attribute The attribute name
 */
export const getAttributeDescription = (attribute: string): string => {
  return attributeDescriptions[attribute] || 'No description available';
};

/**
 * Calculate modified attributes by applying origin modifiers
 * @param baseAttributes The base attribute values
 * @param originId The ID of the character's origin
 */
export const calculateModifiedAttributes = (
  baseAttributes: Record<string, number>,
  originId?: string
): Record<string, number> => {
  const modifiers = getOriginModifiers(originId);
  const result: Record<string, number> = { ...baseAttributes };

  // Apply modifiers
  Object.entries(modifiers).forEach(([attr, mod]) => {
    if (typeof result[attr] === 'number') {
      result[attr] = Math.max(3, Math.min(18, result[attr] + mod));
    }
  });

  return result;
};

/**
 * Get a color class based on attribute value
 * @param value The attribute value
 */
export const getAttributeColorClass = (value: number): string => {
  if (value >= 14) return 'text-green-500';
  if (value >= 12) return 'text-green-400';
  if (value >= 9) return 'text-gray-300';
  if (value >= 7) return 'text-yellow-400';
  return 'text-red-400';
};

/**
 * Get glow style based on attribute value
 * @param value The attribute value
 */
export const getAttributeGlowStyle = (value: number) => {
  if (value >= 14) return { textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' };
  if (value >= 12) return { textShadow: '0 0 10px rgba(74, 222, 128, 0.7)' };
  if (value >= 9) return { textShadow: '0 0 5px rgba(156, 163, 175, 0.6)' };
  if (value >= 7) return { textShadow: '0 0 10px rgba(250, 204, 21, 0.7)' };
  return { textShadow: '0 0 10px rgba(239, 68, 68, 0.7)' };
};