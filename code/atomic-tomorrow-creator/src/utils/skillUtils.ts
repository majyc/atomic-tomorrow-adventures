// Enhanced skillUtils.ts - Single source of truth for skill calculations

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
}

export interface SimplifiedSkills {
  [key: string]: SimplifiedSkill;
}

// Core skill categories with their governing attributes
export const CORE_SKILLS = {
  'ACADEMICS': 'FLEX',
  'XENOLOGY': 'FLEX',
  'INVESTIGATION': 'SAVVY',
  'STREETWISE': 'GUILE',
  'TRADE': 'FLEX',
  'ATHLETICS': 'BRAWN',
  'COMBAT': 'REFLEX',
  'STEALTH': 'REFLEX',
  'PILOTING': 'REFLEX',
  'SURVIVAL': 'GRIT',
  'ENGINEERING': 'SAVVY',
  'MEDICINE': 'SAVVY',
  'SCIENCE': 'SAVVY',
  'TECHNOLOGY': 'SAVVY',
  'NAVIGATION': 'SAVVY',
  'REPAIR': 'SAVVY',
  'COMPUTER SYSTEMS': 'SAVVY',
  'DEMOLITIONS': 'SAVVY',
  'PERSUASION': 'CHARM',
  'DECEPTION': 'GUILE',
  'PERCEPTION': 'SAVVY',
  'PERFORMANCE': 'CHARM',
  'SOCIAL': 'CHARM',
  'ANIMAL HANDLING': 'CHARM',
  'SECURITY': 'SAVVY',
  'PSI': 'NERVE',
  'ARTISTRY': 'FLEX',
  'TACTICS': 'SAVVY'
};

// This mapping connects specialty skills to their core skills
export const SKILL_SPECIALTY_TO_CORE = {
  // ACADEMICS specializations
  'Ancient History': 'ACADEMICS',
  'Ancient Languages': 'ACADEMICS',
  'Archaeology': 'ACADEMICS',
  'Contract Law': 'ACADEMICS',
  'Cultural History': 'ACADEMICS',
  'Documentation': 'ACADEMICS',
  'Linguistics': 'ACADEMICS',
  'Mathematics': 'ACADEMICS',
  'Politics': 'ACADEMICS',
  'Research': 'ACADEMICS',
  'Theology': 'ACADEMICS',
  'Writing': 'ACADEMICS',
  'History': 'ACADEMICS',
  'Law': 'ACADEMICS',
  'Family History': 'ACADEMICS',

  // ATHLETICS specializations
  'Climbing': 'ATHLETICS',
  'Fine Control': 'ATHLETICS',
  'Jumping': 'ATHLETICS',
  'Reflexes': 'ATHLETICS',
  'Running': 'ATHLETICS',
  'Strength': 'ATHLETICS',
  'Swimming': 'ATHLETICS',
  'Zero-G Movement': 'ATHLETICS',
  'Acrobatics': 'ATHLETICS',

  // COMBAT specializations
  'Bladed Weapons': 'COMBAT',
  'Exotic Weapons': 'COMBAT',
  'Heavy Weapons': 'COMBAT',
  'Pistols': 'COMBAT',
  'Rifles': 'COMBAT',
  'Ship Weapons': 'COMBAT',
  'Unarmed Combat': 'COMBAT',
  'Firearms': 'COMBAT',

  // ENGINEERING specializations
  'Atomic': 'ENGINEERING',
  'Environmental': 'ENGINEERING',
  'Experimental': 'ENGINEERING',
  'Mechanical': 'ENGINEERING',
  'Power Systems': 'ENGINEERING',
  'Robotics': 'ENGINEERING',
  'Ship Systems': 'ENGINEERING',
  'Structural': 'ENGINEERING',
  'Asteroid Engineering': 'ENGINEERING',
  'Ice Engineering': 'ENGINEERING',
  'Atomic Engineering': 'ENGINEERING',
  'Mineral Processing': 'ENGINEERING',
  'Gas Mining': 'ENGINEERING',
  'Ring Mining': 'ENGINEERING',
  'Water Reclamation': 'ENGINEERING',
  'Basic Construction': 'ENGINEERING',
  'Ore Processing': 'ENGINEERING',

  // MEDICINE specializations
  'Battlefield Medicine': 'MEDICINE',
  'Emergency Medicine': 'MEDICINE',
  'Field Medicine': 'MEDICINE',
  'Surgery': 'MEDICINE',
  'Xenomedicine': 'MEDICINE',
  'First Aid': 'MEDICINE',
  'Medical Knowledge': 'MEDICINE',
  'Medication': 'MEDICINE',
  'Psychiatry': 'MEDICINE',
  'Diagnostics': 'MEDICINE',
  'Triage': 'MEDICINE',
  'Improvised Treatment': 'MEDICINE',

  // Many more skill specializations...
  // (Abbreviated for brevity; would include all specializations from SkillCalculation.tsx)

  // Some common skills to provide functionality for the Character Sheet
  'Navigation (Space)': 'NAVIGATION',
  'Technology (Ship Systems)': 'TECHNOLOGY',
  'Piloting (Spacecraft)': 'PILOTING',
  'Combat (Pistols)': 'COMBAT',
  'Resource Management': 'TRADE',
  'Asteroid Navigation': 'NAVIGATION',
  'Negotiation': 'PERSUASION',
  'Market Analysis': 'TRADE',
  'Appraisal': 'TRADE',
  'Zero-G Operations': 'ATHLETICS'
};

// Specialized skills with their own calculations
const SPECIALIZED_SKILLS = {
  'Solar Scouts Training': 'FLEX'
};

/**
 * Function to parse skills string and convert to structured data
 * @param skillsString String containing skill bonuses in the format "Skill +X%, Another +Y%"
 * @returns Array of parsed skill objects with core category, specialization and bonus
 */
export function parseSkills(skillsString) {
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

    // Look up the core skill
    const core = SKILL_SPECIALTY_TO_CORE[skillName] || 'UNKNOWN';

    return {
      core,
      specialization: skillName,
      bonus
    };
  }).filter(item => item !== null); // Remove any null entries
}

/**
 * Comprehensive skill calculator - calculates all skills based on character attributes and choices
 * @param character The character data including attributes, profession, origin, background
 * @returns Object containing detailed skill data with specializations
 */
export function calculateDetailedSkills(character) {
  if (!character.attributes || !character.profession || !character.origin || !character.background) {
    return {};
  }

  const calculatedSkills: CalculatedSkills = {};

  // Calculate for each core skill
  Object.entries(CORE_SKILLS).forEach(([coreName, attribute]) => {
    // Base value from attribute
    let attributeBase = 0;
    if (attribute === 'FLEX') {
      // Flexibility skills are based on flat 20%
      attributeBase = 20;
    } else {
      attributeBase = character.attributes[attribute] * 2;
    }

    // Core skill value (attribute × 2 + 5%)
    const coreValue = attributeBase + 5;

    // Initialize the core skill
    calculatedSkills[coreName] = {
      baseValue: attributeBase,
      coreValue: coreValue,
      attribute: attribute,
      specializations: {}
    };

    // Calculate specialization values
    // In a real application, you'd get these from a data source
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

  // Special Skills like Solar Scouts Training
  calculatedSkills['Solar Scouts Training'] = {
    baseValue: 35,
    coreValue: 35,
    attribute: 'FLEX',
    specializations: {
      'Unarmed Combat': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
      'Pistols': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
      'Rifles': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
      'Survival': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
      'First Aid': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 }
    }
  };

  return calculatedSkills;
}

/**
 * Helper function to get specializations for a skill
 * In a real app, this would pull from a data source
 */
function getSpecializationsForSkill(skillName) {
  // This is a simplified version - in a real app, you'd have a complete data structure
  const commonSpecializations = {
    'COMBAT': ['Pistols', 'Rifles', 'Bladed Weapons', 'Unarmed Combat', 'Heavy Weapons'],
    'PILOTING': ['Spacecraft', 'Aircraft', 'Ground Vehicle'],
    'NAVIGATION': ['Space', 'Deep Space', 'Asteroid Navigation', 'Urban Navigation'],
    'TECHNOLOGY': ['Ship Systems', 'Electronics', 'Communications'],
    'TRADE': ['Appraisal', 'Market Analysis', 'Resource Management'],
    'PERSUASION': ['Negotiation', 'Fast Talk', 'Intimidation'],
    'ATHLETICS': ['Zero-G Movement', 'Climbing', 'Jumping', 'Strength'],
    'SURVIVAL': ['Space', 'Desert', 'Urban', 'Wilderness']
  };

  return commonSpecializations[skillName] || [];
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
  const skills: SimplifiedSkills = {
    "Piloting (Spacecraft)": {
      value: Math.min(99, (REFLEX * 2) + 40),
      source: character.profession?.name || "Profession"
    },
    "Technology (Ship Systems)": {
      value: Math.min(99, (SAVVY * 2) + 20),
      source: character.profession?.name || "Profession"
    },
    "Navigation (Space)": {
      value: Math.min(99, (SAVVY * 2) + 10),
      source: character.profession?.name || "Profession"
    },
    "Combat (Pistols)": {
      value: Math.min(99, (REFLEX * 2) + 10),
      source: character.profession?.name || "Profession"
    },
    "Zero-G Operations": {
      value: Math.min(99, (REFLEX * 2) + 15),
      source: character.origin?.name || "Origin"
    },
    "Resource Management": {
      value: Math.min(99, (SAVVY * 2) + 10),
      source: character.origin?.name || "Origin"
    },
    "Asteroid Navigation": {
      value: Math.min(99, (SAVVY * 2) + 5),
      source: character.origin?.name || "Origin"
    },
    "Negotiation": {
      value: Math.min(99, (CHARM * 2) + 10),
      source: character.background?.name || "Background"
    },
    "Market Analysis": {
      value: Math.min(99, (SAVVY * 2) + 10),
      source: character.background?.name || "Background"
    },
    "Appraisal": {
      value: Math.min(99, (SAVVY * 2) + 5),
      source: character.background?.name || "Background"
    },
    "Solar Scouts Training": {
      value: 35,
      source: "Standard Training"
    }
  };

  return skills;
}

/**
 * Helper functions to determine skill bonuses from profession, origin, and background
 */
export function getProfessionBonus(character, coreName, specName) {
  if (!character.profession) return 0;

  // Parse the skills string if we haven't already
  if (!character.profession._parsedSkills) {
    character.profession._parsedSkills = parseSkills(character.profession.skills);
  }

  // Look through all parsed skill bonuses for this profession
  const matchingBonus = character.profession._parsedSkills.find(
    bonus => bonus.core === coreName && bonus.specialization === specName
  );

  return matchingBonus ? matchingBonus.bonus : 0;
}

export function getOriginBonus(character, coreName, specName) {
  if (!character.origin) return 0;

  // Parse the skills string if we haven't already
  if (!character.origin._parsedSkills) {
    character.origin._parsedSkills = parseSkills(character.origin.skills);
  }

  // Look through all parsed skill bonuses for this origin
  const matchingBonus = character.origin._parsedSkills.find(
    bonus => bonus.core === coreName && bonus.specialization === specName
  );

  return matchingBonus ? matchingBonus.bonus : 0;
}

export function getBackgroundBonus(character, coreName, specName) {
  if (!character.background) return 0;

  // Parse the skills string if we haven't already
  if (!character.background._parsedSkills) {
    character.background._parsedSkills = parseSkills(character.background.skills);
  }

  // Look through all parsed skill bonuses for this background
  const matchingBonus = character.background._parsedSkills.find(
    bonus => bonus.core === coreName && bonus.specialization === specName
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
    .sort(([, a], [, b]) => b.value - a.value);
};

/**
 * Get the skill derivation formula as a readable string
 * @param skillData The skill data object
 * @param attribute The governing attribute
 * @param character The character data
 * @returns String description of skill derivation
 */
export const getSkillDerivation = (skillData, attribute, character) => {
  // Handle FLEX attribute specially
  if (attribute === 'FLEX') {
    const baseValue = 20; // Standard for FLEX attributes
    const bonusValue = skillData.value - baseValue;
    return `(FLEX: 20) + ${bonusValue > 0 ? bonusValue : 0}`;
  }
  
  const baseValue = (character.attributes?.[attribute] || 10) * 2;
  const bonusValue = skillData.value - baseValue;
  
  return `(${attribute}: ${character.attributes?.[attribute] || 10} × 2) + ${bonusValue > 0 ? bonusValue : 0}`;
};

/**
 * Find the governing attribute for a skill
 * @param skillName The name of the skill
 * @returns The attribute that governs the skill
 */
export const getSkillAttribute = (skillName) => {
  // Check for direct skill name matches
  for (const [skill, attribute] of Object.entries(CORE_SKILLS)) {
    if (skillName.includes(skill)) {
      return attribute;
    }
  }

  // Check for skill specializations
  for (const [specialization, coreName] of Object.entries(SKILL_SPECIALTY_TO_CORE)) {
    if (skillName.includes(specialization)) {
      return CORE_SKILLS[coreName] || 'SAVVY';
    }
  }

  // Check specialized skills
  for (const [skill, attribute] of Object.entries(SPECIALIZED_SKILLS)) {
    if (skillName.includes(skill)) {
      return attribute;
    }
  }
  
  // Specific skill overrides
  if (skillName.includes('Combat') || skillName.includes('Piloting') || skillName.includes('Reflex')) return 'REFLEX';
  if (skillName.includes('Technology') || skillName.includes('Navigation') || skillName.includes('Analysis')) return 'SAVVY';
  if (skillName.includes('Negotiation')) return 'CHARM';
  if (skillName.includes('Survival')) return 'GRIT';
  if (skillName.includes('Zero-G')) return 'REFLEX';
  if (skillName.includes('Appraisal') || skillName.includes('Market Analysis')) return 'SAVVY';
  if (skillName.includes('Trade')) return 'FLEX';
  if (skillName.includes('Academics')) return 'FLEX';
  
  return 'SAVVY'; // Default
};

/**
 * Get skill level name based on skill value
 * @param value The skill value percentage
 * @returns String name of the skill level
 */
export const getSkillLevelName = (value) => {
  if (value >= 96) return "Legendary";
  if (value >= 76) return "Master";
  if (value >= 51) return "Professional";
  if (value >= 26) return "Competent";
  if (value > 0) return "Novice";
  return "Untrained";
};

/**
 * Get color class for skill level based on value
 * @param value The skill value percentage
 * @param isPrintMode Whether the display is in print mode
 * @returns CSS class name for the skill level color
 */
export const getSkillLevelColor = (value, isPrintMode = false) => {
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
export const getAttributeColor = (value, isPrintMode = false) => {
  if (value >= 14) return isPrintMode ? "font-bold" : "text-green-500";
  if (value >= 12) return isPrintMode ? "font-bold" : "text-green-400";
  if (value >= 9) return isPrintMode ? "" : "text-gray-300";
  if (value >= 7) return isPrintMode ? "text-gray-700" : "text-yellow-400";
  return isPrintMode ? "text-gray-700" : "text-red-400";
};