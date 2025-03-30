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
 * @param skillsString String containing skill bonuses in the format "Skill +X%, Another +Y%"
 * @returns Array of parsed skill objects with core category, specialization and bonus
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

    // Parse the core skill and specialization
    let core, specialization;

    // Check if the skill name contains a specialization in parentheses
    const specMatch = skillName.match(/(.+?)\s+\((.+?)\)/);
    if (specMatch) {
      core = specMatch[1].toUpperCase(); // Core skill name in uppercase
      specialization = specMatch[2]; // Specialization name as-is
    } else {
      core = skillName.toUpperCase();
      specialization = skillName;
    }

    return {
      core,
      specialization,
      bonus
    };
  }).filter(item => item !== null); // Remove any null entries
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
      const professionBonus = getProfessionBonus(character, coreName, specName);
      const originBonus = getOriginBonus(character, coreName, specName);
      const backgroundBonus = getBackgroundBonus(character, coreName, specName);

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
 * Simplified skill calculator - returns a flattened list of key skills for character sheets
 * @param character The character data including attributes, profession, origin, background
 * @returns Object containing simplified skill data
 */
export function calculateSimplifiedSkills(character): SimplifiedSkills {
  if (!character.attributes || !character.profession || !character.origin || !character.background) {
    return {};
  }

  // Extract attributes for ease of use
  const { REFLEX = 10, SAVVY = 10, CHARM = 10, GRIT = 10 } = character.attributes;

  // Create a standard set of skills that should be on every character sheet
  const skills: SimplifiedSkills = {};
  
  // Calculate skill specializations with their bonuses
  const calculateSpecializationWithDetail = (coreName: string, specName: string, sourceName: string): SimplifiedSkill => {
    // Get skill attribute
    let attribute = getSkillAttribute(coreName);
    
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
    
    // Get bonuses - use our improved parser to get bonuses from profession, origin, and background
    const professionBonus = getProfessionBonus(character, coreName, specName);
    const originBonus = getOriginBonus(character, coreName, specName);
    const backgroundBonus = getBackgroundBonus(character, coreName, specName);
    
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
    
    return {
      value: totalValue,
      source: sourceName,
      name: specName,
      professionBonus,
      originBonus,
      backgroundBonus,
      derivation // Store the derivation formula
    };
  };
  
  // Add profession skills - the primary skills from the character's profession
  if (character.profession) {
    const profSkills = parseSkills(character.profession.skills);
    console.log("Parsed profession skills:", profSkills);
    
    // Add standard profession skills
    skills["Piloting (Spacecraft)"] = calculateSpecializationWithDetail(
      "PILOTING", "Spacecraft", character.profession?.name || "Profession"
    );
    
    skills["Technology (Ship Systems)"] = calculateSpecializationWithDetail(
      "TECHNOLOGY", "Ship Systems", character.profession?.name || "Profession"
    );
    
    skills["Navigation (Space)"] = calculateSpecializationWithDetail(
      "NAVIGATION", "Space", character.profession?.name || "Profession"
    );
    
    skills["Combat (Pistols)"] = calculateSpecializationWithDetail(
      "COMBAT", "Pistols", character.profession?.name || "Profession"
    );
  }
  
  // Add origin skills
  skills["Zero-G Operations"] = calculateSpecializationWithDetail(
    "ATHLETICS", "Zero-G Movement", character.origin?.name || "Origin"
  );
  
  skills["Resource Management"] = calculateSpecializationWithDetail(
    "TRADE", "Resource Management", character.origin?.name || "Origin"
  );
  
  skills["Asteroid Navigation"] = calculateSpecializationWithDetail(
    "NAVIGATION", "Asteroid Belt", character.origin?.name || "Origin"
  );
  
  // Add background skills
  skills["Negotiation"] = calculateSpecializationWithDetail(
    "PERSUASION", "Negotiation", character.background?.name || "Background"
  );
  
  skills["Market Analysis"] = calculateSpecializationWithDetail(
    "TRADE", "Market Analysis", character.background?.name || "Background"
  );
  
  skills["Appraisal"] = calculateSpecializationWithDetail(
    "TRADE", "Appraisal", character.background?.name || "Background"
  );
  
  // Add Solar Scouts Training - special case (just one skill, no specializations)
  skills["Solar Scouts Training"] = {
    value: 35,
    source: "Standard Training",
    name: "Solar Scouts Training",
    derivation: "35 (Standard Training)"
  };

  return skills;
}

/**
 * Calculate the value for a specific specialization
 */
function calculateSpecialization(character, coreName: string, specName: string): number {
  // Get skill attribute
  const skillAttr = getSkillAttribute(coreName);
  
  // Calculate base value and core bonus
  let baseValue: number;
  let coreBonus: number;
  
  if (skillAttr === 'FLEX') {
    baseValue = 25; // FLEX skills are fixed at 25%
    // FLEX skills don't get the +5% core bonus
    coreBonus = 0;
  } else {
    // Attribute-based skills
    baseValue = (character.attributes?.[skillAttr] || 10) * 2;
    // Attribute-based skills get the +5% core bonus
    coreBonus = 5;
  }
  
  // Get bonuses
  const professionBonus = getProfessionBonus(character, coreName, specName);
  const originBonus = getOriginBonus(character, coreName, specName);
  const backgroundBonus = getBackgroundBonus(character, coreName, specName);
  
  // Calculate total and clamp to maximum of 99%
  return Math.min(99, baseValue + coreBonus + professionBonus + originBonus + backgroundBonus);
}

/**
 * Helper function to determine profession skill bonuses
 */
export function getProfessionBonus(character, coreName: string, specName: string): number {
  if (!character.profession) return 0;

  // Parse the skills string if we haven't already
  if (!character.profession._parsedSkills) {
    character.profession._parsedSkills = parseSkills(character.profession.skills);
  }

  // Look through all parsed skill bonuses for this profession
  const matchingBonus = character.profession._parsedSkills.find(
    bonus => {
      // Check exact matches first
      if (bonus.core === coreName && bonus.specialization === specName) {
        return true;
      }
      
      // Check partial matches (e.g., "Marksmanship (Pistols)" matches "COMBAT" core and "Pistols" specialization)
      if (bonus.core === "MARKSMANSHIP" && specName === "Pistols" && coreName === "COMBAT") {
        return true;
      }
      
      // Handle cases where the specialization is in the bonus but not in the query
      // For example, if the skill is "Combat (Pistols)" but we're looking for "COMBAT"
      if (bonus.core === coreName && !specName) {
        return true;
      }
      
      // Match skills where the bonus covers the whole core skill
      if (bonus.core === coreName && !bonus.specialization.includes('(')) {
        return true;
      }
      
      return false;
    }
  );

  return matchingBonus ? matchingBonus.bonus : 0;
}

export function getOriginBonus(character, coreName: string, specName: string): number {
  if (!character.origin) return 0;

  // Parse the skills string if we haven't already
  if (!character.origin._parsedSkills) {
    character.origin._parsedSkills = parseSkills(character.origin.skills);
  }

  // Look through all parsed skill bonuses
  const matchingBonus = character.origin._parsedSkills.find(
    bonus => {
      // Check exact matches first
      if (bonus.core === coreName && bonus.specialization === specName) {
        return true;
      }
      
      // Handle cases where the specialization is in the bonus but not in the query
      if (bonus.core === coreName && !specName) {
        return true;
      }
      
      // Match skills where the bonus covers the whole core skill
      if (bonus.core === coreName && !bonus.specialization.includes('(')) {
        return true;
      }
      
      return false;
    }
  );

  return matchingBonus ? matchingBonus.bonus : 0;
}

export function getBackgroundBonus(character, coreName: string, specName: string): number {
  if (!character.background) return 0;

  // Parse the skills string if we haven't already
  if (!character.background._parsedSkills) {
    character.background._parsedSkills = parseSkills(character.background.skills);
  }

  // Look through all parsed skill bonuses
  const matchingBonus = character.background._parsedSkills.find(
    bonus => {
      // Check exact matches first
      if (bonus.core === coreName && bonus.specialization === specName) {
        return true;
      }
      
      // Handle cases where the specialization is in the bonus but not in the query
      if (bonus.core === coreName && !specName) {
        return true;
      }
      
      // Match skills where the bonus covers the whole core skill
      if (bonus.core === coreName && !bonus.specialization.includes('(')) {
        return true;
      }
      
      return false;
    }
  );

  return matchingBonus ? matchingBonus.bonus : 0;
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
  if (skillData.source === "Standard Training" && ["Unarmed Combat", "Pistols", "Rifles", "Survival"].includes(skillData.name)) {
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