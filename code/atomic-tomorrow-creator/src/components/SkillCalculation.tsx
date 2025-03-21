import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Info } from 'lucide-react';

// Sample skill data structure
const SKILL_DATA = {
  // Core skill categories with their governing attributes
  coreSkills: {
    'ACADEMICS': 'FLEX',
    'ANIMAL HANDLING': 'CHARM',
    'ARTISTRY': 'FLEX',
    'ATHLETICS': 'BRAWN',
    'COMBAT': 'REFLEX',
    'COMPUTER SYSTEMS': 'SAVVY',
    'DECEPTION': 'GUILE',
    'DEMOLITIONS': 'SAVVY',
    'ENGINEERING': 'SAVVY',
    'INVESTIGATION': 'SAVVY',
    'MEDICINE': 'FLEX',
    'NAVIGATION': 'SAVVY',
    'PERCEPTION': 'SAVVY',
    'PERFORMANCE': 'CHARM',
    'PERSUASION': 'CHARM',
    'PILOTING': 'REFLEX',
    'PSI': 'NERVE',
    'REPAIR': 'SAVVY',
    'SCIENCE': 'SAVVY',
    'SECURITY': 'SAVVY',
    'SOCIAL': 'CHARM',
    'STEALTH': 'REFLEX',
    'STREETWISE': 'GUILE',
    'SURVIVAL': 'GRIT',
    'TACTICS': 'SAVVY',
    'TECHNOLOGY': 'SAVVY',
    'TRADE': 'FLEX',
    'XENOLOGY': 'FLEX'
  },
  
  // Sample specializations for each core skill
  specializations: {
    'ACADEMICS': ['Archaeology', 'Ancient History', 'Ancient Languages', 'Contract Law', 'Linguistics', 'Mathematics', 'Politics', 'Research', 'Theology'],
    'ANIMAL HANDLING': ['Alien Creatures', 'Domestic Animals', 'Wild Beasts', 'Robot Psychology'],
    'COMBAT': ['Bladed Weapons', 'Exotic Weapons', 'Heavy Weapons', 'Pistols', 'Rifles', 'Ship Weapons', 'Unarmed Combat'],
    'ENGINEERING': ['Atomic', 'Environmental', 'Experimental', 'Mechanical', 'Robotics', 'Ship Systems', 'Structural'],
    'MEDICINE': ['Battlefield Medicine', 'Emergency Medicine', 'Field Medicine', 'Surgery', 'Xenomedicine'],
    'PILOTING': ['Aircraft', 'Ground Vehicle', 'Racing', 'Spacecraft', 'Watercraft'],
    // Other specializations would be listed here
  }
};

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
  const [calculatedSkills, setCalculatedSkills] = useState({});
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
      baseValue: character.attributes.REFLEX * 2,
      coreValue: (character.attributes.REFLEX * 2) + 15,
      attribute: 'REFLEX',
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
  const getProfessionBonus = (coreName, specName) => {
    // This would be replaced with actual data from the character's profession
    // For now, return a mock value for demonstration
    if (character.profession?.id === 'rocket-jockey' && coreName === 'PILOTING' && specName === 'Spacecraft') {
      return 40; // Primary specialization
    } else if (character.profession?.id === 'rocket-jockey' && coreName === 'TECHNOLOGY' && specName === 'Ship Systems') {
      return 20; // Secondary specialization
    } else if (character.profession?.id === 'rocket-jockey' && coreName === 'NAVIGATION' && specName === 'Space') {
      return 10; // Tertiary specialization
    } else if (character.profession?.id === 'rocket-jockey' && coreName === 'COMBAT' && specName === 'Pistols') {
      return 10; // Tertiary specialization
    }
    
    return 0;
  };
  
  const getOriginBonus = (coreName, specName) => {
    // This would be replaced with actual data from the character's origin
    // For now, return a mock value for demonstration
    if (character.origin?.id === 'belter' && coreName === 'ATHLETICS' && specName === 'Zero-G Movement') {
      return 15; // Origin primary skill
    } else if (character.origin?.id === 'belter' && coreName === 'TRADE' && specName === 'Resource Management') {
      return 10; // Origin secondary skill
    } else if (character.origin?.id === 'belter' && coreName === 'NAVIGATION' && specName === 'Asteroid Navigation') {
      return 5; // Origin tertiary skill
    }
    
    return 0;
  };
  
  const getBackgroundBonus = (coreName, specName) => {
    // This would be replaced with actual data from the character's background
    // For now, return a mock value for demonstration
    if (character.background?.id === 'merchant-clan' && coreName === 'PERSUASION' && specName === 'Negotiation') {
      return 10; // Background primary skill
    } else if (character.background?.id === 'merchant-clan' && coreName === 'TRADE' && specName === 'Market Analysis') {
      return 10; // Background secondary skill
    } else if (character.background?.id === 'merchant-clan' && coreName === 'TRADE' && specName === 'Appraisal') {
      return 5; // Background tertiary skill
    }
    
    return 0;
  };
  
  // Toggle expanded state for a skill
  const toggleSkillExpansion = (skillName) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };
  
  // Filter skills based on search term and active tab
  const filteredSkills = () => {
    return Object.entries(calculatedSkills).filter(([skillName, skillData]) => {
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
    });
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