import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Info } from 'lucide-react';
interface SpecializationData {
  value: number;
  professionBonus: number;
  originBonus: number;
  backgroundBonus: number;
}
interface SkillData {
  baseValue: number;
  coreValue: number;
  attribute: string;
  specializations: {
    [key: string]: SpecializationData;
  };
}
interface CalculatedSkills {
  [key: string]: SkillData;
}

// Sample skill data structure
const SKILL_DATA = {
  // Core skill categories with their governing attributes
  coreSkills: {
    // Knowledge Skills
    'ACADEMICS': 'FLEX',
    'XENOLOGY': 'FLEX',
    'INVESTIGATION': 'SAVVY',
    'STREETWISE': 'GUILE',
    'TRADE': 'FLEX',

    // Physical Skills
    'ATHLETICS': 'BRAWN',
    'COMBAT': 'REFLEX',
    'STEALTH': 'REFLEX',
    'PILOTING': 'REFLEX',
    'SURVIVAL': 'GRIT',

    // Technical Skills
    'ENGINEERING': 'SAVVY',
    'MEDICINE': 'SAVVY',
    'SCIENCE': 'SAVVY',
    'TECHNOLOGY': 'SAVVY',
    'NAVIGATION': 'SAVVY',
    'REPAIR': 'SAVVY',
    'COMPUTER SYSTEMS': 'SAVVY',
    'DEMOLITIONS': 'SAVVY',

    // Social Skills
    'PERSUASION': 'CHARM',
    'DECEPTION': 'GUILE',
    'PERCEPTION': 'SAVVY',
    'PERFORMANCE': 'CHARM',
    'SOCIAL': 'CHARM',
    'ANIMAL HANDLING': 'CHARM',

    // Specialized Skills
    'SECURITY': 'SAVVY',
    'PSI': 'NERVE',
    'ARTISTRY': 'FLEX',
    'TACTICS': 'SAVVY'
  },

  // Complete specializations for each core skill
  specializations: {
    'ACADEMICS': [
      'Ancient History',
      'Ancient Languages',
      'Archaeology',
      'Contract Law',
      'Cultural History',
      'Documentation',
      'Linguistics',
      'Mathematics',
      'Politics',
      'Research',
      'Theology',
      'Writing'
    ],

    'XENOLOGY': [
      'Alien Artifacts',
      'Alien Cultures',
      'Alien Technology',
      'Forerunner Studies'
    ],

    'INVESTIGATION': [
      'Analysis',
      'Crime Scene Analysis',
      'Interviewing',
      'Research',
      'Surveying',
      'Tracking'
    ],

    'STREETWISE': [
      'Black Market',
      'Contraband',
      'Information Gathering',
      'Scrounging',
      'Underground Navigation'
    ],

    'TRADE': [
      'Appraisal',
      'Business Administration',
      'Market Analysis',
      'Negotiation',
      'Resource Management'
    ],

    'ATHLETICS': [
      'Climbing',
      'Fine Control',
      'Jumping',
      'Reflexes',
      'Running',
      'Strength',
      'Swimming',
      'Zero-G Movement',
      'Acrobatics'
    ],

    'COMBAT': [
      'Bladed Weapons',
      'Exotic Weapons',
      'Heavy Weapons',
      'Pistols',
      'Rifles',
      'Ship Weapons',
      'Unarmed Combat'
    ],

    'STEALTH': [
      'Camouflage',
      'Hiding',
      'Shadowing',
      'Silent Movement'
    ],

    'PILOTING': [
      'Aircraft',
      'Ground Vehicle',
      'Racing',
      'Spacecraft',
      'Watercraft'
    ],

    'SURVIVAL': [
      'Combat Zone',
      'Desert',
      'Jungle',
      'Mental Discipline',
      'Space',
      'Urban',
      'Wilderness',
      'Vacuum',
      'Cold Environment',
      'Mars'
    ],

    'ENGINEERING': [
      'Atomic',
      'Environmental',
      'Experimental',
      'Mechanical',
      'Ore Processing',
      'Power Systems',
      'Robotics',
      'Ship Systems',
      'Structural'
    ],

    'MEDICINE': [
      'Battlefield Medicine',
      'Diagnostics',
      'Emergency Medicine',
      'Field Medicine',
      'Medication',
      'Psychiatry',
      'Surgery',
      'Triage',
      'Xenomedicine',
      'Improvised Treatment'
    ],

    'SCIENCE': [
      'Astronomy',
      'Atmospheric',
      'Behavioral Science',
      'Biology',
      'Chemistry',
      'Comparative Physiology',
      'Geology',
      'Physics',
      'Probability',
      'Psychology',
      'Theoretical Physics',
      'Xenobiology',
      'Pattern Recognition',
      'Psionic Theory'
    ],

    'TECHNOLOGY': [
      'Communications',
      'Diagnostics',
      'Electronics',
      'Laboratory Equipment',
      'Mineral Analysis',
      'Positronic Systems',
      'Radiation Equipment',
      'Sampling Equipment',
      'Sensors',
      'Ship Systems',
      'Vacuum Equipment',
      'Weapons Systems',
      'Cartography'
    ],

    'NAVIGATION': [
      'Asteroid Navigation',
      'Cloud Navigation',
      'Deep Space',
      'Planetary',
      'Secret Routes',
      'Space',
      'Urban',
      'Wilderness',
      'Zero-G Navigation'
    ],

    'REPAIR': [
      'Electronics',
      'Improvised',
      'Mechanical',
      'Ship Repair',
      'Ship Systems',
      'Vehicle Repair'
    ],

    'COMPUTER SYSTEMS': [
      'Computer Operation',
      'Cryptography',
      'Data Analysis',
      'Programming',
      'System Administration'
    ],

    'DEMOLITIONS': [
      'Controlled Demolition',
      'Defusing',
      'Explosive Crafting',
      'Mining Charges',
      'Sabotage'
    ],

    'PERSUASION': [
      'Bargaining',
      'Bedside Manner',
      'Counseling',
      'Fast Talk',
      'Intimidation',
      'Negotiation',
      'Seduction'
    ],

    'DECEPTION': [
      'Bluffing',
      'Con Artistry',
      'Disguise',
      'Forgery',
      'Forgery Detection',
      'Misdirection'
    ],

    'PERCEPTION': [
      'Combat Awareness',
      'Cultural Sensitivity',
      'Environmental Awareness',
      'Intuition',
      'Observation',
      'Reading People',
      'Threat Assessment',
      'Situational Awareness',
      'Triage',
      'Trap Detection',
      'Technical Intuition',
      'Crowd Reading',
      'Risk Assessment',
      'Spatial Awareness'
    ],

    'PERFORMANCE': [
      'Acting',
      'Music',
      'Oratory',
      'Public Speaking',
      'Showmanship',
      'Storytelling'
    ],

    'SOCIAL': [
      'Carousing',
      'Diplomatic Protocol',
      'Diplomacy',
      'Discretion',
      'Etiquette',
      'Fashion Sense',
      'Leadership',
      'Mediation',
      'Networking',
      'Rumor Collection'
    ],

    'ANIMAL HANDLING': [
      'Alien Creatures',
      'Domestic Animals',
      'Robot Psychology',
      'Wild Beasts'
    ],

    'SECURITY': [
      'Alarm Systems',
      'Law Enforcement',
      'Lock Picking',
      'Surveillance',
      'VIP Protection'
    ],

    'PSI': [
      'Empathy',
      'Energy Channeling',
      'Energy Manipulation',
      'Mental Defense',
      'Precognition',
      'Psychokinesis',
      'Telepathy'
    ],

    'ARTISTRY': [
      'Art Appreciation',
      'Photography',
      'Sculpture',
      'Visual Arts',
      'Writing'
    ],

    'TACTICS': [
      'Combat',
      'Infiltration',
      'Military Operations',
      'Security Planning',
      'Skirmish'
    ],

    // Solar Scouts Training (special case)
    'Solar Scouts Training': [
      'Unarmed Combat',
      'Pistols',
      'Rifles',
      'First Aid',
      'Survival'
    ]
  }
};

// This mapping connects specialty skills to their core skills
const SKILL_SPECIALTY_TO_CORE = {
  // ACADEMICS specializations
  'Ancient History': 'ACADEMICS',
  'Ancient Languages': 'ACADEMICS',
  'Archaeology': 'ACADEMICS',
  'Contract Law': 'ACADEMICS',
  'Documentation': 'ACADEMICS',
  'History': 'ACADEMICS',
  'Linguistics': 'ACADEMICS',
  'Mathematics': 'ACADEMICS',
  'Politics': 'ACADEMICS',
  'Research': 'ACADEMICS',
  'Theology': 'ACADEMICS',
  'Writing': 'ACADEMICS',

  // ATHLETICS specializations
  'Climbing': 'ATHLETICS',
  'Jumping': 'ATHLETICS',
  'Reflexes': 'ATHLETICS',
  'Running': 'ATHLETICS',
  'Strength': 'ATHLETICS',
  'Swimming': 'ATHLETICS',
  'Zero-G Movement': 'ATHLETICS',

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

  // MEDICINE specializations
  'Battlefield Medicine': 'MEDICINE',
  'Emergency Medicine': 'MEDICINE',
  'Field Medicine': 'MEDICINE',
  'Surgery': 'MEDICINE',
  'Xenomedicine': 'MEDICINE',
  'First Aid': 'MEDICINE',
  'Medical Knowledge': 'MEDICINE',

  // NAVIGATION specializations
  'Asteroid Navigation': 'NAVIGATION',
  'Deep Space': 'NAVIGATION',
  'Space': 'NAVIGATION',
  'Urban Navigation': 'NAVIGATION',
  'Wilderness': 'NAVIGATION',
  'Station Layout Knowledge': 'NAVIGATION',
  'Cloud Navigation': 'NAVIGATION',

  // PERCEPTION specializations
  'Environmental Awareness': 'PERCEPTION',
  'Observation': 'PERCEPTION',
  'Reading People': 'PERCEPTION',
  'Threat Assessment': 'PERCEPTION',
  'Trap Detection': 'PERCEPTION',
  'Cultural Sensitivity': 'PERCEPTION',
  'Spatial Awareness': 'PERCEPTION',

  // PERSUASION specializations
  'Bargaining': 'PERSUASION',
  'Fast Talk': 'PERSUASION',
  'Intimidation': 'PERSUASION',
  'Negotiation': 'PERSUASION',
  'Seduction': 'PERSUASION',

  // PILOT specializations
  'Spacecraft': 'PILOTING',
  'Aircraft': 'PILOTING',
  'Ground Vehicle': 'PILOTING',
  'Racing': 'PILOTING',
  'Watercraft': 'PILOTING',

  // SCIENCE specializations
  'Astronomy': 'SCIENCE',
  'Biology': 'SCIENCE',
  'Chemistry': 'SCIENCE',
  'Geology': 'SCIENCE',
  'Physics': 'SCIENCE',
  'Psychology': 'SCIENCE',
  'Xenobiology': 'SCIENCE',
  'Genetics': 'SCIENCE',
  'Psionic Theory': 'SCIENCE',
  'Atmosphere Science': 'SCIENCE',
  'Hydrocarbon Chemistry': 'SCIENCE',
  'Probability': 'SCIENCE',
  'Comparative Physiology': 'SCIENCE',

  // SOCIAL specializations
  'Bureaucracy': 'SOCIAL',
  'Diplomacy': 'SOCIAL',
  'Etiquette': 'SOCIAL',
  'Leadership': 'SOCIAL',
  'Networking': 'SOCIAL',
  'Rumor Collection': 'SOCIAL',
  'Social Engineering': 'SOCIAL',
  'Public Relations': 'SOCIAL',
  'Diplomatic Protocol': 'SOCIAL',

  // STREETWISE specializations
  'Black Market': 'STREETWISE',
  'Contraband': 'STREETWISE',
  'Information Gathering': 'STREETWISE',
  'Scrounging': 'STREETWISE',

  // SURVIVAL specializations
  'Combat Zone': 'SURVIVAL',
  'Desert': 'SURVIVAL',
  'Jungle': 'SURVIVAL',
  'Mental Discipline': 'SURVIVAL',
  'Urban': 'SURVIVAL',
  'Deep Space Survival': 'SURVIVAL',
  'Isolation Psychology': 'SURVIVAL',
  'Extreme Heat Survival': 'SURVIVAL',
  'Cold Survival': 'SURVIVAL',
  'Void Survival': 'SURVIVAL',
  'Radiation Survival': 'SURVIVAL',
  'Environmental Adaptation': 'SURVIVAL',
  'Group Survival': 'SURVIVAL',
  'Survival: Mars': 'SURVIVAL',
  'Survival: Venus': 'SURVIVAL',
  'Vacuum': 'SURVIVAL',
  'Pioneer Skills': 'SURVIVAL',

  // TECHNOLOGY specializations
  'Communications': 'TECHNOLOGY',
  'Electronics': 'TECHNOLOGY',
  'Laboratory Equipment': 'TECHNOLOGY',
  'Sensors': 'TECHNOLOGY',
  'Vacuum Equipment': 'TECHNOLOGY',
  'Weapons Systems': 'TECHNOLOGY',
  'Technical Operation': 'TECHNOLOGY',
  'Solar Technology': 'TECHNOLOGY',
  'Cartography': 'TECHNOLOGY',
  'Diagnostics': 'TECHNOLOGY',
  'Long-Range Scanning': 'TECHNOLOGY',
  'Radiation Equipment': 'TECHNOLOGY',
  'Positronic Systems': 'TECHNOLOGY',
  'Sampling Equipment': 'TECHNOLOGY',
  'Mineral Analysis': 'TECHNOLOGY',

  // REPAIR specializations
  'Improvised': 'REPAIR',
  'Ship Repair': 'REPAIR',
  'Vehicle Repair': 'REPAIR',

  // COMPUTER SYSTEMS specializations
  'Computer Operation': 'COMPUTER SYSTEMS',
  'Cryptography': 'COMPUTER SYSTEMS',
  'Data Analysis': 'COMPUTER SYSTEMS',
  'Programming': 'COMPUTER SYSTEMS',
  'System Administration': 'COMPUTER SYSTEMS',

  // XENOLOGY specializations
  'Alien Artifacts': 'XENOLOGY',
  'Alien Cultures': 'XENOLOGY',
  'Alien Technology': 'XENOLOGY',
  'Forerunner Studies': 'XENOLOGY',

  // INVESTIGATION specializations
  'Analysis': 'INVESTIGATION',
  'Crime Scene Analysis': 'INVESTIGATION',
  'Interviewing': 'INVESTIGATION',
  'Surveying': 'INVESTIGATION',
  'Tracking': 'INVESTIGATION',
  'Authentication': 'INVESTIGATION',
  'Treasure Hunting': 'INVESTIGATION',

  // TRADE specializations
  'Appraisal': 'TRADE',
  'Business': 'TRADE',
  'Market Analysis': 'TRADE',
  'Resource Evaluation': 'TRADE',
  'Resource Management': 'TRADE',
  'Business Administration': 'TRADE',
  'Resource Valuation': 'TRADE',
  'Resource Conservation': 'TRADE',
  'Corporate Knowledge': 'TRADE',
  'Product Familiarity': 'TRADE',

  // SECURITY specializations
  'Alarm Systems': 'SECURITY',
  'Law Enforcement': 'SECURITY',
  'Lock Picking': 'SECURITY',
  'Surveillance': 'SECURITY',
  'VIP Protection': 'SECURITY',
  'Security Systems': 'SECURITY',

  // PSI specializations
  'Telepathy': 'PSI',
  'Empathy': 'PSI',
  'Energy Manipulation': 'PSI',
  'Mental Defense': 'PSI',
  'Precognition': 'PSI',
  'Psychokinesis': 'PSI',
  'Energy Channeling': 'PSI',

  // ARTISTRY specializations
  'Art Appreciation': 'ARTISTRY',
  'Photography': 'ARTISTRY',
  'Sculpture': 'ARTISTRY',
  'Visual Arts': 'ARTISTRY',
  'Costume & Makeup': 'ARTISTRY',

  // TACTICS specializations
  'Combat': 'TACTICS',
  'Infiltration': 'TACTICS',
  'Military Operations': 'TACTICS',
  'Security Planning': 'TACTICS',
  'Skirmish': 'TACTICS',

  // PERFORMANCE specializations
  'Acting': 'PERFORMANCE',
  'Music': 'PERFORMANCE',
  'Oratory': 'PERFORMANCE',
  'Public Speaking': 'PERFORMANCE',
  'Showmanship': 'PERFORMANCE',
  'Storytelling': 'PERFORMANCE',
  'Performance': 'PERFORMANCE',

  // ANIMAL HANDLING specializations
  'Alien Creatures': 'ANIMAL HANDLING',
  'Domestic Animals': 'ANIMAL HANDLING',
  'Robot Psychology': 'ANIMAL HANDLING',
  'Wild Beasts': 'ANIMAL HANDLING',
  'Animal Handling': 'ANIMAL HANDLING',

  // STEALTH specializations
  'Camouflage': 'STEALTH',
  'Hiding': 'STEALTH',
  'Shadowing': 'STEALTH',
  'Silent Movement': 'STEALTH',

  // DEMOLITIONS specializations
  'Controlled Demolition': 'DEMOLITIONS',
  'Defusing': 'DEMOLITIONS',
  'Explosive Crafting': 'DEMOLITIONS',
  'Mining Charges': 'DEMOLITIONS',
  'Sabotage': 'DEMOLITIONS',

  // DECEPTION specializations
  'Bluffing': 'DECEPTION',
  'Con Artistry': 'DECEPTION',
  'Disguise': 'DECEPTION',
  'Forgery': 'DECEPTION',
  'Forgery Detection': 'DECEPTION',
  'Misdirection': 'DECEPTION',

  // Other specializations
  'Life Support Systems': 'TECHNOLOGY',
  'Water Reclamation': 'ENGINEERING',
  'Mineral Processing': 'SCIENCE',
  'Gas Mining': 'ENGINEERING',
  'Spacecraft Operations': 'PILOTING',
  'Ring Mining': 'ENGINEERING',
  'Ship Operations': 'PILOTING',
  'Space Navigation': 'NAVIGATION',
  'Emergency Procedures': 'SURVIVAL',
  'Family History': 'ACADEMICS',
  'Space Agriculture': 'SCIENCE',
  'Wind Reading': 'PERCEPTION',
  'Mining Operations': 'ENGINEERING',
  'Asteroid Identification': 'SCIENCE',
  'Community Building': 'SOCIAL',
  'Criminal Operations': 'STREETWISE',
  'Primitive Survival': 'SURVIVAL',
  'Tribal Culture': 'ACADEMICS',
  'Hunting & Tracking': 'SURVIVAL',
  'Basic Construction': 'ENGINEERING',
  'Scavenging': 'STREETWISE',
  'Adaptation': 'SURVIVAL',
  'Theft': 'STEALTH',
  'Corporate Politics': 'SOCIAL',
  'Fine Arts': 'ARTISTRY',
  'Meditation': 'PSI',
  'Community Organization': 'SOCIAL',
  'Research Protocols': 'INVESTIGATION',
  'Public Transportation': 'NAVIGATION',
  'Law': 'ACADEMICS'
};

// Function to parse skills string and convert to structured data
function parseSkills(skillsString) {
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

// Skill rating visualization
const SkillRatingBadge = ({ rating }) => {
  let badgeColor = "bg-gray-200 text-gray-700";
  let label = "Untrained";

  if (rating >= 96) {
    badgeColor = "bg-purple-600 text-white";
    label = "Legendary";
  } else if (rating >= 76) {
    badgeColor = "bg-blue-600 text-white";
    label = "Master";
  } else if (rating >= 51) {
    badgeColor = "bg-green-600 text-white";
    label = "Professional";
  } else if (rating >= 26) {
    badgeColor = "bg-yellow-500 text-white";
    label = "Competent";
  } else if (rating > 0) {
    badgeColor = "bg-orange-500 text-white";
    label = "Novice";
  }

  return (
    <div className={`px-2 py-1 rounded text-xs font-bold ${badgeColor}`}>
      {label} ({rating}%)
    </div>
  );
};

// Skills Screen Component
const SkillCalculation = ({ character, updateCharacter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSkills, setExpandedSkills] = useState({});
  const [calculatedSkills, setCalculatedSkills] = useState<CalculatedSkills>({});
  const [activeTab, setActiveTab] = useState('all');

  // Calculate skills based on attributes, profession, origin, and background
  useEffect(() => {
    if (!character.attributes || !character.profession) return;

    const newCalculatedSkills = {};

    // Calculate for each core skill
    Object.entries(SKILL_DATA.coreSkills).forEach(([coreName, attribute]) => {
      // Base value from attribute
      var attributeBase = 0;
      if (attribute === 'FLEX') {
        // Flexibility skills are based on flat 20%
        attributeBase = 20;
      } else {
        attributeBase = character.attributes[attribute] * 2;
      }

      // Core skill value (attribute × 2 + 5%)
      const coreValue = attributeBase + 5;

      // Initialize the core skill
      newCalculatedSkills[coreName] = {
        baseValue: attributeBase,
        coreValue: coreValue,
        attribute: attribute,
        specializations: {}
      };

      // Calculate specialization values
      const specializations = SKILL_DATA.specializations[coreName] || [];
      specializations.forEach(specName => {
        // Determine bonuses from profession, origin, and background
        const professionBonus = getProfessionBonus(coreName, specName);
        const originBonus = getOriginBonus(coreName, specName);
        const backgroundBonus = getBackgroundBonus(coreName, specName);

        // Calculate total value
        const totalValue = coreValue + professionBonus + originBonus + backgroundBonus;

        // Add specialization to calculated skills
        newCalculatedSkills[coreName].specializations[specName] = {
          value: totalValue,
          professionBonus,
          originBonus,
          backgroundBonus
        };
      });
    });

    // Solar Scouts Training calculation
    newCalculatedSkills['Solar Scouts Training'] = {
      baseValue: 35,
      coreValue: 35,
      attribute: 'FLEX',
      specializations: {
        'Unarmed Combat': { value: (character.attributes.REFLEX * 2) + 15, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
        'Pistols': { value: (character.attributes.REFLEX * 2) + 15, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
        'Rifles': { value: (character.attributes.REFLEX * 2) + 15, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
        'Survival': { value: (character.attributes.REFLEX * 2) + 15, professionBonus: 0, originBonus: 0, backgroundBonus: 0 },
        'First Aid': { value: 35, professionBonus: 0, originBonus: 0, backgroundBonus: 0 }
      }
    };

    setCalculatedSkills(newCalculatedSkills);
  }, [character.attributes, character.profession, character.origin, character.background]);

  // Helper functions to determine skill bonuses
  // Helper functions to determine skill bonuses
  const getProfessionBonus = (coreName, specName) => {
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
  };

  const getOriginBonus = (coreName, specName) => {
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
  };

  const getBackgroundBonus = (coreName, specName) => {
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
  };

  // Toggle expanded state for a skill
  const toggleSkillExpansion = (skillName) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  // Filter skills based on search term and active tab
  // The filter callback returns a boolean
  const filteredSkills = (): [string, SkillData][] => {
    return Object.entries(calculatedSkills).filter(
      ([skillName, skillData]: [string, SkillData]): boolean => {
        // Filter by search term
        if (searchTerm && !skillName.toLowerCase().includes(searchTerm.toLowerCase())) {
          // Also check specializations
          const hasMatchingSpecialization = Object.keys(skillData.specializations).some(
            spec => spec.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (!hasMatchingSpecialization) return false;
        }

        // Filter by active tab
        if (activeTab === 'profession' && !Object.values(skillData.specializations).some(
          spec => spec.professionBonus > 0
        )) {
          return false;
        }

        if (activeTab === 'combat' &&
          skillName !== 'COMBAT' &&
          skillName !== 'Solar Scouts Training') {
          return false;
        }

        return true;
      }
    );
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 3: Skills</h2>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-800">Skill Calculation</h3>
            <p className="text-sm">Skills are calculated using this formula: (Attribute × 2) + Core Skill Bonus + Professional Bonus + Origin Bonus + Background Bonus</p>
            <p className="text-sm mt-1">Core skills are automatically 5% higher than the base attribute value.</p>
          </div>
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            All Skills
          </button>
          <button
            onClick={() => setActiveTab('profession')}
            className={`px-4 py-2 ${activeTab === 'profession' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Profession Skills
          </button>
          <button
            onClick={() => setActiveTab('combat')}
            className={`px-4 py-2 ${activeTab === 'combat' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Combat Skills
          </button>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {filteredSkills().map(([skillName, skillData]) => (
          <div key={skillName} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Skill Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleSkillExpansion(skillName)}
            >
              <div className="flex items-center">
                <div className="mr-3 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                  {skillName.substring(0, 1)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">{skillName}</h3>
                  <div className="text-xs text-gray-500">
                    Base: {skillData.attribute} × 2 = {skillData.baseValue}% | Core: {skillData.coreValue}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {Object.values(skillData.specializations).some(spec =>
                  spec.professionBonus > 0 || spec.originBonus > 0 || spec.backgroundBonus > 0
                ) && (
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Trained
                    </div>
                  )}
                <SkillRatingBadge rating={
                  Math.max(
                    skillData.coreValue,
                    ...Object.values(skillData.specializations).map(spec => spec.value)
                  )
                } />
              </div>
            </div>

            {/* Specializations List */}
            {expandedSkills[skillName] && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Specializations</h4>

                <div className="space-y-2">
                  {Object.entries(skillData.specializations).map(([specName, specData]) => (
                    <div key={specName} className="flex justify-between items-center p-2 rounded hover:bg-gray-100">
                      <div>
                        <div className="font-medium">{specName}</div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-1">
                          {specData.professionBonus > 0 && (
                            <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded">
                              +{specData.professionBonus}% (Profession)
                            </span>
                          )}
                          {specData.originBonus > 0 && (
                            <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                              +{specData.originBonus}% (Origin)
                            </span>
                          )}
                          {specData.backgroundBonus > 0 && (
                            <span className="px-1 py-0.5 bg-green-100 text-green-800 rounded">
                              +{specData.backgroundBonus}% (Background)
                            </span>
                          )}
                        </div>
                      </div>

                      <SkillRatingBadge rating={specData.value} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Skill Distribution Visualization */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-blue-900">Skill Distribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Distribution by Category */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">By Category</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Combat Skills</span>
                <span className="font-medium">
                  {Object.entries(calculatedSkills)
                    .filter(([name]) => name === 'COMBAT' || name === 'Solar Scouts Training')
                    .length} skills
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Technical Skills</span>
                <span className="font-medium">
                  {Object.entries(calculatedSkills)
                    .filter(([name]) => ['ENGINEERING', 'REPAIR', 'TECHNOLOGY', 'COMPUTER SYSTEMS'].includes(name))
                    .length} skills
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Social Skills</span>
                <span className="font-medium">
                  {Object.entries(calculatedSkills)
                    .filter(([name]) => ['SOCIAL', 'PERSUASION', 'DECEPTION', 'PERFORMANCE'].includes(name))
                    .length} skills
                </span>
              </div>
            </div>
          </div>

          {/* Skill Rating Distribution */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">By Rating</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Legendary (96%+)</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.value >= 96)
                    .length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Master (76-95%)</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.value >= 76 && spec.value < 96)
                    .length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Professional (51-75%)</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.value >= 51 && spec.value < 76)
                    .length}
                </span>
              </div>
            </div>
          </div>

          {/* Skills by Source */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">By Source</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Profession Skills</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.professionBonus > 0)
                    .length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Origin Skills</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.originBonus > 0)
                    .length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Background Skills</span>
                <span className="font-medium">
                  {Object.values(calculatedSkills)
                    .flatMap(skill => Object.values(skill.specializations))
                    .filter(spec => spec.backgroundBonus > 0)
                    .length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Explanation */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-md font-bold flex items-center text-gray-800 mb-2">
          <Info size={18} className="mr-2" />
          About Skill Advancement
        </h3>
        <p className="text-sm text-gray-700">
          During adventures, you can mark skills for advancement when you roll a critical success or succeed at high-stakes tasks.
          At the end of an adventure, you roll against your skill percentage - if you fail the roll, you've found room to improve and your skill increases.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Skills advance more slowly at higher levels: Skills at 50-69% improve by 1-5%, skills at 70-89% by 1-3%, and skills at 90%+ by just 1%.
        </p>
      </div>
    </div>
  );
};

export default SkillCalculation;