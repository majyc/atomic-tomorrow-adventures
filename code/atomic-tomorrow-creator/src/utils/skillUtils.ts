// skillUtils.ts - Single source of truth for skill calculations
import { 
  CORE_SKILLS, 
  SPECIAL_SKILLS, 
  SPECIALIZATION_TO_CORE,
  getSkillBaseValue,
  getSkillCoreValue,
  getSpecializationsForSkill,
  getSkillAttribute as getSkillAttributeFromData,
  getSkillLevelName as getSkillLevelNameFromData
} from '../data/skills';

/**
 * Skill data interfaces
 */
export interface SpecializationData {
  value: number;
  professionBonus: number;
  originBonus: number;
  backgroundBonus: number;
}

export interface SkillData {
  baseValue: number;
  coreValue: number;
  attribute: string;
  specializations: {
    [key: string]: SpecializationData;
  };
}

export interface CalculatedSkills {
  [key: string]: SkillData;
}

export interface SimplifiedSkill {
  value: number;
  source: string;
  name?: string;
  professionBonus?: number;
  originBonus?: number;
  backgroundBonus?: number;
  derivation?: string; // Store the full derivation string
}

export interface SimplifiedSkills {
  [key: string]: SimplifiedSkill;
}

/**
 * Parse skills string and convert to structured data
 * Now simplified since skill names are standardized across all data files
 * @param skillsString String containing skill bonuses in the format "Skill +X%, Another +Y%"
 * @returns Array of parsed skill objects with skill name and bonus
 */
export function parseSkills(skillsString: string) {
  if (!skillsString) return [];

  // Split the skills string by commas
  const skillsArray = skillsString.split(',');

  // Process each skill
  return skillsArray.map(skillItem => {
    // Trim whitespace
    const trimmed = skillItem.trim();

    // Extract the skill name and bonus
    const match = trimmed.match(/(.+?)\s+\+(\d+)%/);
    if (!match) return null;

    const [, skillName, bonusStr] = match;
    const bonus = parseInt(bonusStr, 10);

    return {
      skillName: skillName.trim(),
      bonus
    };
  }).filter(item => item !== null); // Remove any null entries
}

/**
 * Simple skill matching function - exact name matching since data is now standardized
 */
function findSkillBonus(parsedSkills: any[], targetSkillName: string): number {
  if (!parsedSkills || parsedSkills.length === 0) return 0;

  const matchingSkill = parsedSkills.find(skill => 
    skill.skillName === targetSkillName
  );

  return matchingSkill ? matchingSkill.bonus : 0;
}

/**
 * Comprehensive skill calculator - calculates all skills based on character attributes and choices
 * @param character The character data including attributes, profession, origin, background
 * @returns Object containing detailed skill data with specializations
 */
export function calculateDetailedSkills(character): CalculatedSkills {
  if (!character.attributes || !character.profession || !character.origin || !character.background) {
    return {};
  }

  const calculatedSkills: CalculatedSkills = {};

  // Calculate for each core skill
  Object.entries(CORE_SKILLS).forEach(([coreName, coreData]) => {
    // Get base value and core value from the skill data
    const baseValue = getSkillBaseValue(coreName, character.attributes);
    const coreValue = getSkillCoreValue(coreName, character.attributes);

    // Initialize the core skill
    calculatedSkills[coreName] = {
      baseValue,
      coreValue,
      attribute: coreData.attribute,
      specializations: {}
    };

    // Calculate specialization values
    const specializations = getSpecializationsForSkill(coreName);
    specializations.forEach(specName => {
      // Determine bonuses from profession, origin, and background
      const professionBonus = getProfessionBonus(character, specName);
      const originBonus = getOriginBonus(character, specName);
      const backgroundBonus = getBackgroundBonus(character, specName);

      // Calculate total value
      const totalValue = coreValue + professionBonus + originBonus + backgroundBonus;

      // Add specialization to calculated skills
      calculatedSkills[coreName].specializations[specName] = {
        value: totalValue,
        professionBonus,
        originBonus,
        backgroundBonus
      };
    });
  });

  // Add special skills like Solar Scouts Training
  if (SPECIAL_SKILLS['SOLAR SCOUTS TRAINING']) {
    const solarScoutsData = SPECIAL_SKILLS['SOLAR SCOUTS TRAINING'];
    
    calculatedSkills['SOLAR SCOUTS TRAINING'] = {
      baseValue: solarScoutsData.baseValue,
      coreValue: solarScoutsData.baseValue,
      attribute: solarScoutsData.attribute,
      specializations: {}
    };
    
    // Process each specialization in Solar Scouts Training
    Object.entries(solarScoutsData.specializations).forEach(([specName, specData]) => {
      if ('derivedFrom' in specData) {
        // Calculate from an attribute
        const attrValue = character.attributes[specData.derivedFrom] || 10;
        const value = (attrValue * 2) + specData.bonus;
        
        calculatedSkills['SOLAR SCOUTS TRAINING'].specializations[specName] = {
          value,
          professionBonus: 0,
          originBonus: 0,
          backgroundBonus: 0
        };
      } else {
        // Use fixed value
        calculatedSkills['SOLAR SCOUTS TRAINING'].specializations[specName] = {
          value: specData.baseValue,
          professionBonus: 0,
          originBonus: 0,
          backgroundBonus: 0
        };
      }
    });
  }

  return calculatedSkills;
}

/**
 * Helper function to get base skill name without specialization
 */
function getBaseSkillName(skillName: string): string {
  const specMatch = skillName.match(/(.+?)\s+\(/);
  return specMatch ? specMatch[1].trim() : skillName;
}

/**
 * Helper function to get bonus for a skill, checking both exact match and base skill match
 */
function getSkillBonusFlexible(parsedSkills: any[], targetSkillName: string): number {
  if (!parsedSkills || parsedSkills.length === 0) return 0;

  // First try exact match
  const exactMatch = parsedSkills.find(skill => skill.skillName === targetSkillName);
  if (exactMatch) return exactMatch.bonus;

  // Then try base skill match (for cases where background gives "Zero-G Operations +5%" 
  // and we want it to apply to "Zero-G Operations (Mining)")
  const baseSkillName = getBaseSkillName(targetSkillName);
  const baseMatch = parsedSkills.find(skill => skill.skillName === baseSkillName);
  if (baseMatch) return baseMatch.bonus;

  return 0;
}

/**
 * Simplified skill calculator - returns a flattened list of key skills for character sheets
 * @param character The character data including attributes, profession, origin, background
 * @returns Object containing simplified skill data
 */
export function calculateSimplifiedSkills(character): SimplifiedSkills {
  if (!character.attributes || !character.profession || !character.origin || !character.background) {
    return {};
  }

  const skills: SimplifiedSkills = {};
  
  // Parse all skills from profession, origin, and background
  const professionSkills = parseSkills(character.profession.skills || '');
  const originSkills = parseSkills(character.origin.skills || '');
  const backgroundSkills = parseSkills(character.background.skills || '');
  
  // Collect all unique skill names
  const allSkillNames = new Set<string>();
  [...professionSkills, ...originSkills, ...backgroundSkills].forEach(skill => {
    allSkillNames.add(skill.skillName);
  });
  
  // Calculate skill specializations with their bonuses
  const calculateSkillWithDetail = (skillName: string): SimplifiedSkill => {
    // Parse skill name to determine if it has a specialization
    let coreName: string;
    let attribute: string;
    
    // Check if skill has parentheses (indicating specialization)
    const specMatch = skillName.match(/(.+?)\s+\(/);
    if (specMatch) {
      coreName = specMatch[1].trim().toUpperCase();
      attribute = getSkillAttribute(coreName);
    } else {
      // Direct skill name - try to map to a core skill
      coreName = skillName.toUpperCase();
      attribute = getSkillAttribute(coreName);
    }
    
    // Calculate base value
    let baseValue: number;
    let coreBonus: number;
    
    if (attribute === 'FLEX') {
      baseValue = 25; // FLEX skills are fixed at 25%
      coreBonus = 0; // FLEX skills don't get the +5% core bonus
    } else {
      // Attribute-based skills
      const attrValue = character.attributes?.[attribute] || 10;
      baseValue = attrValue * 2;
      coreBonus = 5; // Attribute-based skills get the +5% core bonus
    }
    
    // Get bonuses using flexible matching
    const professionBonus = getSkillBonusFlexible(professionSkills, skillName);
    const originBonus = getSkillBonusFlexible(originSkills, skillName);
    const backgroundBonus = getSkillBonusFlexible(backgroundSkills, skillName);
    
    // Calculate total value
    const totalValue = Math.min(99, baseValue + coreBonus + professionBonus + originBonus + backgroundBonus);
    
    // Create the derivation string at calculation time
    let derivation: string;
    
    if (attribute === 'FLEX') {
      derivation = `(FLEX: 25) + ${professionBonus > 0 ? `${professionBonus} (Profession)` : '0'} + ${originBonus > 0 ? `${originBonus} (Origin)` : '0'} + ${backgroundBonus > 0 ? `${backgroundBonus} (Background)` : '0'}`;
    } else {
      const attrValue = character.attributes?.[attribute] || 10;
      derivation = `(${attribute}: ${attrValue} × 2) + 5 + ${professionBonus > 0 ? `${professionBonus} (Profession)` : '0'} + ${originBonus > 0 ? `${originBonus} (Origin)` : '0'} + ${backgroundBonus > 0 ? `${backgroundBonus} (Background)` : '0'}`;
    }
    
    // Determine source priority
    let source = "Core";
    if (professionBonus > 0) source = "Profession";
    else if (originBonus > 0) source = "Origin";
    else if (backgroundBonus > 0) source = "Background";
    
    return {
      value: totalValue,
      source,
      name: skillName,
      professionBonus,
      originBonus,
      backgroundBonus,
      derivation // Store the derivation formula
    };
  };
  
  // Calculate each skill that appears in the character's profession, origin, or background
  Array.from(allSkillNames).forEach(skillName => {
    skills[skillName] = calculateSkillWithDetail(skillName);
  });
  
  // Add Solar Scouts Training - special case
  skills["Solar Scouts Training"] = {
    value: 35,
    source: "Standard Training",
    name: "Solar Scouts Training",
    derivation: "35 (Standard Training)"
  };

  return skills;
}

/**
 * Helper function to determine profession skill bonuses
 */
export function getProfessionBonus(character, skillName: string): number {
  if (!character.profession) return 0;

  // Parse the skills string if we haven't already
  if (!character.profession._parsedSkills) {
    character.profession._parsedSkills = parseSkills(character.profession.skills);
  }

  return getSkillBonusFlexible(character.profession._parsedSkills, skillName);
}

export function getOriginBonus(character, skillName: string): number {
  if (!character.origin) return 0;

  // Parse the skills string if we haven't already
  if (!character.origin._parsedSkills) {
    character.origin._parsedSkills = parseSkills(character.origin.skills);
  }

  return getSkillBonusFlexible(character.origin._parsedSkills, skillName);
}

export function getBackgroundBonus(character, skillName: string): number {
  if (!character.background) return 0;

  // Parse the skills string if we haven't already
  if (!character.background._parsedSkills) {
    character.background._parsedSkills = parseSkills(character.background.skills);
  }

  return getSkillBonusFlexible(character.background._parsedSkills, skillName);
}

/**
 * Format skills for display - sort by value in descending order
 * @param skills Object containing calculated skills
 * @returns Array of sorted skill entries
 */
export const formatSkillsForDisplay = (skills) => {
  return Object.entries(skills)
    .sort(([, a], [, b]) => (b as SimplifiedSkill).value - (a as SimplifiedSkill).value);
};

/**
 * Get the skill derivation formula as a readable string
 * @param skillData The skill data object
 * @param attribute The governing attribute
 * @param character The character data
 * @returns String description of skill derivation
 */
export const getSkillDerivation = (skillData: any, attribute: string, character: any): string => {
  // If the derivation is already stored, just use that
  if (skillData.derivation) {
    return skillData.derivation;
  }
  
  // Otherwise, calculate it on the fly (this is a fallback)
  // For SOLAR SCOUTS TRAINING specializations that are derived from REFLEX
  if (skillData.source === "Standard Training" && ["Unarmed Combat", "Guns", "Survival"].includes(skillData.name)) {
    const attrValue = character.attributes?.REFLEX || 10;
    return `(REFLEX: ${attrValue} × 2) + 15 (Solar Scouts Training)`;
  }
  
  // For SOLAR SCOUTS TRAINING First Aid which is fixed
  if (skillData.source === "Standard Training" && skillData.name === "First Aid") {
    return `35 (Solar Scouts Training Base)`;
  }
  
  // Handle FLEX attribute specially - FLEX skills don't get the +5% core bonus
  if (attribute === 'FLEX') {
    const baseValue = 25; // Standard for FLEX attributes
    const professionBonus = skillData.professionBonus || 0;
    const originBonus = skillData.originBonus || 0;
    const backgroundBonus = skillData.backgroundBonus || 0;
    
    return `(FLEX: 25) + ${professionBonus > 0 ? `${professionBonus} (Profession)` : '0'} + ${originBonus > 0 ? `${originBonus} (Origin)` : '0'} + ${backgroundBonus > 0 ? `${backgroundBonus} (Background)` : '0'}`;
  }
  
  // Handle attribute-based skills - these get the +5% core bonus
  const attrValue = character.attributes?.[attribute] || 10;
  const professionBonus = skillData.professionBonus || 0;
  const originBonus = skillData.originBonus || 0;
  const backgroundBonus = skillData.backgroundBonus || 0;
  
  return `(${attribute}: ${attrValue} × 2) + 5 + ${professionBonus > 0 ? `${professionBonus} (Profession)` : '0'} + ${originBonus > 0 ? `${originBonus} (Origin)` : '0'} + ${backgroundBonus > 0 ? `${backgroundBonus} (Background)` : '0'}`;
};

/**
 * Find the governing attribute for a skill
 * @param skillName The name of the skill
 * @returns The attribute that governs the skill
 */
export const getSkillAttribute = (skillName) => {
  return getSkillAttributeFromData(skillName);
};

/**
 * Get skill level name based on skill value
 * @param value The skill value percentage
 * @returns String name of the skill level
 */
export const getSkillLevelName = (value) => {
  return getSkillLevelNameFromData(value);
};

/**
 * Get color class for skill level based on value
 * @param value The skill value percentage
 * @param isPrintMode Whether the display is in print mode
 * @returns CSS class name for the skill level color
 */
export const getSkillLevelColor = (value: number, isPrintMode = false): string => {
  if (!isPrintMode) {
    if (value >= 96) return "text-purple-400";
    if (value >= 76) return "text-blue-400";
    if (value >= 51) return "text-green-400";
    if (value >= 26) return "text-yellow-400";
    if (value > 0) return "text-orange-400";
    return "text-gray-500";
  } else {
    if (value >= 76) return "font-bold";
    return "";
  }
};

/**
 * Get color class for attribute value
 * @param value The attribute value
 * @param isPrintMode Whether the display is in print mode 
 * @returns CSS class name for the attribute color
 */
export const getAttributeColor = (value: number, isPrintMode = false): string => {
  if (value >= 14) return isPrintMode ? "font-bold" : "text-green-500";
  if (value >= 12) return isPrintMode ? "font-bold" : "text-green-400";
  if (value >= 9) return isPrintMode ? "" : "text-gray-300";
  if (value >= 7) return isPrintMode ? "text-gray-700" : "text-yellow-400";
  return isPrintMode ? "text-gray-700" : "text-red-400";
};