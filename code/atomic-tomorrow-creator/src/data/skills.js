// Atomic Tomorrow Skills System
// This file contains the structured data for all skills in the game

/**
 * Skill Type Enum
 * ATTRIBUTE: Skills directly tied to a specific attribute
 * FLEX: Skills representing knowledge that relies more on training than raw talent
 */
export const SKILL_TYPES = {
  ATTRIBUTE: 'ATTRIBUTE',
  FLEX: 'FLEX'
};

/**
 * Core Skills
 * Defines all core skill categories with their attributes and specializations
 */
export const CORE_SKILLS = {
  // PHYSICAL SKILLS
  'ATHLETICS': {
    attribute: 'BRAWN',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Physical feats of strength, endurance and coordination',
    specializations: [
      'Climbing', 'Swimming', 'Running', 'Jumping', 'Zero-G Movement', 'Acrobatics', 'Strength', 'Reflexes'
    ]
  },
  'COMBAT': {
    attribute: 'REFLEX',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'General fighting ability',
    specializations: [
      'Unarmed Combat', 'Bladed Weapons', 'Exotic Weapons', 'Heavy Weapons', 
      'Pistols', 'Rifles', 'Ship Weapons'
    ]
  },
  'STEALTH': {
    attribute: 'REFLEX',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Moving without being detected',
    specializations: [
      'Hiding', 'Camouflage', 'Silent Movement', 'Shadowing'
    ]
  },
  'PILOTING': {
    attribute: 'REFLEX',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Operating vehicles and vessels',
    specializations: [
      'Spacecraft', 'Aircraft', 'Ground Vehicles', 'Racing', 'Watercraft'
    ]
  },
  'SURVIVAL': {
    attribute: 'GRIT',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Enduring harsh conditions and finding necessities',
    specializations: [
      'Combat Zone', 'Desert', 'Jungle', 'Mental Discipline', 'Space', 'Urban', 'Wilderness'
    ]
  },

  // TECHNICAL SKILLS
  'ENGINEERING': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Designing and building technical systems',
    specializations: [
      'Atomic', 'Environmental', 'Experimental', 'Mechanical', 'Robotics', 
      'Ship Systems', 'Structural', 'Ore Processing', 'Power Systems'
    ]
  },
  'MEDICINE': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Treating injuries and illness',
    specializations: [
      'Battlefield Medicine', 'Diagnostics', 'Emergency Medicine', 'Field Medicine',
      'Medication', 'Psychiatry', 'Surgery', 'Triage', 'Xenomedicine', 'Improvised Treatment'
    ]
  },
  'SCIENCE': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Knowledge of scientific principles and methods',
    specializations: [
      'Astronomy', 'Biology', 'Chemistry', 'Geology', 'Physics', 'Psychology',
      'Xenobiology', 'Mathematics', 'Research', 'Atmospheric', 'Theoretical Physics',
      'Behavioral Science', 'Comparative Physiology', 'Probability', 'Pattern Recognition', 'Psi Theory'
    ]
  },
  'TECHNOLOGY': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Operation and maintenance of equipment',
    specializations: [
      'Communications', 'Diagnostics', 'Electronics', 'Laboratory Equipment', 'Sensors',
      'Ship Systems', 'Weapons Systems', 'Radiation Equipment', 'Vacuum Equipment',
      'Sampling Equipment', 'Cartography', 'Positronic Systems', 'Mineral Analysis'
    ]
  },
  'NAVIGATION': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Finding paths through various environments',
    specializations: [
      'Asteroid Belt', 'Planetary', 'Secret Routes', 'Space', 'Urban', 'Wilderness', 'Deep Space'
    ]
  },
  'REPAIR': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Fixing broken systems and equipment',
    specializations: [
      'Electronics', 'Improvised', 'Mechanical', 'Ship Systems', 'Vehicles', 'Vehicle Repair'
    ]
  },

  // KNOWLEDGE SKILLS
  'ACADEMICS': {
    attribute: 'FLEX',
    type: SKILL_TYPES.FLEX,
    description: 'Formal education and theoretical knowledge',
    specializations: [
      'Ancient History', 'Ancient Languages', 'Archaeology', 'Contract Law', 'Cultural History',
      'Documentation', 'Linguistics', 'Politics', 'Research', 'Theology', 'Writing', 'History',
      'Mining', 'Regulations', 'Dream Interpretation'
    ]
  },
  'XENOLOGY': {
    attribute: 'FLEX',
    type: SKILL_TYPES.FLEX,
    description: 'Knowledge of alien life and civilizations',
    specializations: [
      'Alien Artifacts', 'Alien Cultures', 'Alien Technology', 'Forerunner Studies'
    ]
  },
  'INVESTIGATION': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Finding information and solving mysteries',
    specializations: [
      'Analysis', 'Crime Scene Analysis', 'Interviewing', 'Research', 'Surveying', 'Tracking',
      'Research Methodology', 'Authentication', 'Treasure Hunting'
    ]
  },
  'STREETWISE': {
    attribute: 'GUILE',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Knowledge of the underbelly of society',
    specializations: [
      'Black Market', 'Contraband', 'Information Gathering', 'Scrounging', 'Underground Navigation',
      'Rumor Collection'
    ]
  },
  'TRADE': {
    attribute: 'FLEX',
    type: SKILL_TYPES.FLEX,
    description: 'Commercial knowledge and practices',
    specializations: [
      'Appraisal', 'Business Administration', 'Market Analysis', 'Negotiation', 'Resource Management',
      'Resource Evaluation', 'Business'
    ]
  },

  // SOCIAL SKILLS
  'PERSUASION': {
    attribute: 'CHARM',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Convincing others through social means',
    specializations: [
      'Bargaining', 'Counseling', 'Fast Talk', 'Intimidation', 'Negotiation', 'Seduction', 'Bedside Manner'
    ]
  },
  'DECEPTION': {
    attribute: 'GUILE',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Misleading or tricking others',
    specializations: [
      'Bluffing', 'Con Artistry', 'Disguise', 'Forgery', 'Misdirection', 'Forgery Detection'
    ]
  },
  'PERCEPTION': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Noticing details and reading situations',
    specializations: [
      'Combat Awareness', 'Cultural Sensitivity', 'Environmental Awareness', 'Intuition',
      'Observation', 'Reading People', 'Threat Assessment', 'Situational Awareness', 
      'Technical Intuition', 'Spatial Awareness', 'Triage', 'Trap Detection', 'Risk Assessment',
      'Crowd Reading'
    ]
  },
  'PERFORMANCE': {
    attribute: 'CHARM',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Entertaining or impressing others',
    specializations: [
      'Acting', 'Music', 'Oratory', 'Public Speaking', 'Showmanship', 'Storytelling'
    ]
  },
  'SOCIAL': {
    attribute: 'CHARM',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Navigating social situations and hierarchies',
    specializations: [
      'Diplomacy', 'Etiquette', 'Leadership', 'Mediation', 'Networking', 'Rumor Collection',
      'Diplomatic Protocol', 'Fashion Sense', 'Carousing', 'Discretion'
    ]
  },

  // SPECIALIZED SKILLS
  'SECURITY': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Bypassing or enforcing protective measures',
    specializations: [
      'Alarm Systems', 'Law Enforcement', 'Lock Picking', 'Surveillance', 'VIP Protection'
    ]
  },
  'PSI': {
    attribute: 'NERVE',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Mental abilities beyond normal human range',
    specializations: [
      'Empathy', 'Energy Manipulation', 'Mental Defense', 'Precognition', 'Psychokinesis',
      'Telepathy', 'Energy Channeling', 'Telekinesis', 'Telepathy'
    ]
  },
  'ARTISTRY': {
    attribute: 'FLEX',
    type: SKILL_TYPES.FLEX,
    description: 'Creating aesthetic works',
    specializations: [
      'Art Appreciation', 'Music', 'Photography', 'Sculpture', 'Visual Arts', 'Writing'
    ]
  },
  'ANIMAL HANDLING': {
    attribute: 'CHARM',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Working with and controlling non-sentient creatures',
    specializations: [
      'Alien Creatures', 'Domestic Animals', 'Robot Psychology', 'Wild Beasts'
    ]
  },
  'COMPUTER SYSTEMS': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Working with information technology',
    specializations: [
      'Computer Operation', 'Cryptography', 'Data Analysis', 'Programming', 'System Administration'
    ]
  },
  'DEMOLITIONS': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Working with explosives',
    specializations: [
      'Controlled Demolition', 'Defusing', 'Explosive Crafting', 'Mining Charges', 'Sabotage'
    ]
  },
  'TACTICS': {
    attribute: 'SAVVY',
    type: SKILL_TYPES.ATTRIBUTE,
    description: 'Strategic planning and coordination',
    specializations: [
      'Combat', 'Infiltration', 'Military Operations', 'Security Planning', 'Skirmish'
    ]
  }
};

/**
 * Specialized Training Skills
 * Special skills with unique rules
 */
export const SPECIAL_SKILLS = {
  'SOLAR SCOUTS TRAINING': {
    attribute: 'FLEX',
    type: SKILL_TYPES.FLEX,
    baseValue: 35,
    description: 'Basic training that every citizen receives',
    specializations: {
      'Unarmed Combat': { derivedFrom: 'REFLEX', bonus: 15 },
      'Pistols': { derivedFrom: 'REFLEX', bonus: 15 },
      'Rifles': { derivedFrom: 'REFLEX', bonus: 15 },
      'Survival': { derivedFrom: 'REFLEX', bonus: 15 },
      'First Aid': { baseValue: 35 }
    }
  }
};

/**
 * Map of specialized skills to their core skills
 * Helps with skill lookup and organization
 */
export const SPECIALIZATION_TO_CORE = {};

// Build the specialization to core skill mapping
Object.entries(CORE_SKILLS).forEach(([coreName, coreData]) => {
  coreData.specializations.forEach(spec => {
    SPECIALIZATION_TO_CORE[spec] = coreName;
  });
});

/**
 * Get the base value for a skill based on its type and the character's attributes
 * 
 * @param {string} skillName - The name of the skill
 * @param {object} attributes - Character's attributes
 * @returns {number} The base value for the skill
 */
export const getSkillBaseValue = (skillName, attributes) => {
  const coreSkill = CORE_SKILLS[skillName];
  
  if (!coreSkill) {
    // Check if it's a special skill
    if (SPECIAL_SKILLS[skillName]) {
      return SPECIAL_SKILLS[skillName].baseValue;
    }
    // Default to a moderate value if not found
    return 25;
  }
  
  // FLEX skills have a fixed base value of 25 (no attribute calculation)
  if (coreSkill.type === SKILL_TYPES.FLEX) {
    return 25;
  }
  
  // Attribute-based skills use the attribute value × 2
  const attributeValue = attributes[coreSkill.attribute] || 10;
  return attributeValue * 2;
};

/**
 * Get the core value for a skill (base value + core bonus)
 * 
 * @param {string} skillName - The name of the skill
 * @param {object} attributes - Character's attributes
 * @returns {number} The core value for the skill
 */
export const getSkillCoreValue = (skillName, attributes) => {
  const baseValue = getSkillBaseValue(skillName, attributes);
  const coreSkill = CORE_SKILLS[skillName];
  
  // Add +5% for core skills that are attribute-based (not applicable to FLEX skills)
  if (coreSkill && coreSkill.type === SKILL_TYPES.ATTRIBUTE) {
    return baseValue + 5;
  }
  
  // FLEX skills and special skills don't get the +5% core bonus
  return baseValue;
};

/**
 * Get all specializations for a given skill
 * 
 * @param {string} coreName - The name of the core skill
 * @returns {string[]} Array of specialization names
 */
export const getSpecializationsForSkill = (coreName) => {
  if (CORE_SKILLS[coreName]) {
    return CORE_SKILLS[coreName].specializations;
  }
  if (SPECIAL_SKILLS[coreName]) {
    return Object.keys(SPECIAL_SKILLS[coreName].specializations);
  }
  return [];
};

/**
 * Get the governing attribute for a skill
 * 
 * @param {string} skillName - The name of the skill or specialization
 * @returns {string} The governing attribute (or 'FLEX' for flexible skills)
 */
export const getSkillAttribute = (skillName) => {
  // Direct match for core skills
  if (CORE_SKILLS[skillName]) {
    return CORE_SKILLS[skillName].attribute;
  }
  
  // Match for special skills
  if (SPECIAL_SKILLS[skillName]) {
    return SPECIAL_SKILLS[skillName].attribute;
  }
  
  // Look up specialization to find its core skill
  const coreName = SPECIALIZATION_TO_CORE[skillName];
  if (coreName && CORE_SKILLS[coreName]) {
    return CORE_SKILLS[coreName].attribute;
  }
  
  // Default to SAVVY if not found
  return 'SAVVY';
};

/**
 * Get the description of a skill
 * 
 * @param {string} skillName - The name of the skill
 * @returns {string} The description of the skill
 */
export const getSkillDescription = (skillName) => {
  if (CORE_SKILLS[skillName]) {
    return CORE_SKILLS[skillName].description;
  }
  if (SPECIAL_SKILLS[skillName]) {
    return SPECIAL_SKILLS[skillName].description;
  }
  return 'No description available';
};

/**
 * Get the skill level name based on value
 * 
 * @param {number} value - The skill value percentage
 * @returns {string} The name of the skill level
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
 * Get the improvement value for a skill based on current skill level
 * 
 * @param {number} currentValue - The current skill value
 * @returns {number} The amount by which the skill can improve
 */
export const getSkillImprovementValue = (currentValue) => {
  if (currentValue < 50) return 5; // Beginner
  if (currentValue < 70) return 3; // Skilled
  if (currentValue < 90) return 2; // Expert
  return 1; // Master
};