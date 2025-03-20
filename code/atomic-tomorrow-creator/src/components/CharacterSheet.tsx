import React from 'react';
import { Download, Printer, Share2, Edit, AlertCircle, Shield, Zap, Crosshair, Brain, Eye, Database } from 'lucide-react';

// Final Character Sheet Component
const CharacterSheet = ({ character, updateCharacter }) => {
  // Format skill list for display
  const formatSkillList = () => {
    // This would process the skills from the character object
    // For demonstration, we'll return a mock-up
    return [
      { name: 'Piloting (Spacecraft)', value: 70, source: 'Rocket Jockey' },
      { name: 'Technology (Ship Systems)', value: 50, source: 'Rocket Jockey' },
      { name: 'Navigation (Space)', value: 40, source: 'Rocket Jockey' },
      { name: 'Combat (Pistols)', value: 40, source: 'Rocket Jockey' },
      { name: 'Zero-G Operations', value: 45, source: 'Belter' },
      { name: 'Asteroid Navigation', value: 30, source: 'Belter' },
      { name: 'Resource Management', value: 40, source: 'Belter/Merchant Clan' },
      { name: 'Negotiation', value: 44, source: 'Merchant Clan' },
      { name: 'Market Analysis', value: 40, source: 'Merchant Clan' },
      { name: 'Appraisal', value: 35, source: 'Merchant Clan' }
    ];
  };
  
  const getAttributeModifier = (value) => {
    if (value >= 16) return "+3";
    if (value >= 14) return "+2";
    if (value >= 12) return "+1";
    if (value >= 9) return "±0";
    if (value >= 7) return "-1";
    if (value >= 5) return "-2";
    return "-3";
  };
  
  const getAttributeColor = (value) => {
    if (value >= 14) return "text-green-700";
    if (value >= 12) return "text-green-600";
    if (value >= 9) return "text-gray-700";
    if (value >= 7) return "text-orange-600";
    return "text-red-600";
  };
  
  // Get skill level name
  const getSkillLevelName = (value) => {
    if (value >= 96) return "Legendary";
    if (value >= 76) return "Master";
    if (value >= 51) return "Professional";
    if (value >= 26) return "Competent";
    if (value > 0) return "Novice";
    return "Untrained";
  };
  
  // Get skill level color
  const getSkillLevelColor = (value) => {
    if (value >= 96) return "text-purple-700";
    if (value >= 76) return "text-blue-700";
    if (value >= 51) return "text-green-700";
    if (value >= 26) return "text-yellow-700";
    if (value > 0) return "text-orange-700";
    return "text-gray-500";
  };
  
  // Sample equipment list
  const equipmentList = [
    "Custom flight jacket with personal insignia",
    "Pilot's chronometer (precision timepiece)",
    "Personal navigation computer",
    "Light Ray Pistol",
    "Encrypted communicator",
    "Emergency survival kit",
    "Trade guild credentials"
  ];

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* Actions Toolbar */}
      <div className="bg-blue-900 py-3 px-6 text-white flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Character Sheet</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-3 py-1.5 bg-blue-700 rounded hover:bg-blue-600">
            <Printer size={16} className="mr-1" />
            Print
          </button>
          <button className="flex items-center px-3 py-1.5 bg-blue-700 rounded hover:bg-blue-600">
            <Download size={16} className="mr-1" />
            Save PDF
          </button>
          <button className="flex items-center px-3 py-1.5 bg-blue-700 rounded hover:bg-blue-600">
            <Share2 size={16} className="mr-1" />
            Share
          </button>
        </div>
      </div>
      
      {/* Character Sheet Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start border-b border-gray-300 pb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-blue-900">{character.name || "UNNAMED CHARACTER"}</h1>
            <h2 className="text-xl text-gray-600 mt-1">
              <span className="text-blue-800">{character.epithet?.name || "Epithet"}</span>{" "}
              <span className="text-green-800">{character.profession?.name || "Profession"}</span> from{" "}
              <span className="text-yellow-700">{character.origin?.name || "Origin"}</span> with a{" "}
              <span className="text-red-700">{character.background?.name || "Background"}</span>
            </h2>
          </div>
          
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            <div className={`w-full h-full ${character.portrait?.style || 'bg-blue-600'}`}></div>
          </div>
        </div>
        
        {/* CLASSIFIED Stamp - Decorative */}
        <div className="absolute top-24 right-10 transform rotate-12 opacity-20 pointer-events-none">
          <div className="border-8 border-red-600 text-red-600 px-6 py-2 rounded-md">
            <p className="text-5xl font-black tracking-widest">CLASSIFIED</p>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Attributes and Core Stats */}
          <div className="col-span-4">
            {/* Attributes Panel */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-300">
              <div className="bg-blue-800 text-white py-2 px-4 font-bold flex items-center">
                <Brain size={18} className="mr-2" />
                ATTRIBUTES
              </div>
              
              <div className="p-4 space-y-2">
                {['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => (
                  <div key={attr} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                    <div className="font-medium">{attr}</div>
                    <div className="flex items-center">
                      <div className={`text-xl font-bold mr-2 ${getAttributeColor(character.attributes?.[attr] || 10)}`}>
                        {character.attributes?.[attr] || 10}
                      </div>
                      <div className={`text-sm ${getAttributeColor(character.attributes?.[attr] || 10)}`}>
                        {getAttributeModifier(character.attributes?.[attr] || 10)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Derived Statistics */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-300">
              <div className="bg-blue-800 text-white py-2 px-4 font-bold flex items-center">
                <Database size={18} className="mr-2" />
                DERIVED STATISTICS
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <div className="font-medium">Initiative</div>
                  <div className="text-xl font-bold">{(character.attributes?.REFLEX || 10) * 5}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <div className="font-medium">Damage Soak</div>
                  <div className="text-xl font-bold">{(character.attributes?.GRIT || 10) * 5}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <div className="font-medium">Basic Training</div>
                  <div className="text-xl font-bold">{((character.attributes?.REFLEX || 10) * 2) + 15}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <div className="font-medium">Wound Track</div>
                  <div className="text-xl font-bold">
                    {character.epithet?.id === 'grizzled' ? '0/5' : '0/4'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Special Abilities */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-300">
              <div className="bg-purple-800 text-white py-2 px-4 font-bold flex items-center">
                <Zap size={18} className="mr-2" />
                SPECIAL ABILITIES
              </div>
              
              <div className="p-4">
                <div className="bg-purple-50 rounded p-3 border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-1">{character.epithet?.name || "Epithet Ability"}</h3>
                  <p className="text-sm text-purple-800">{character.epithet?.benefit || "Select an epithet to see its special ability"}</p>
                </div>
                
                {character.signatureGadget && (
                  <div className="bg-blue-50 rounded p-3 border border-blue-200 mt-4">
                    <h3 className="font-bold text-blue-900 mb-1">Signature Gadget: {character.signatureGadget.name}</h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      {character.signatureGadget.effects.map((effect, idx) => (
                        <p key={idx}>• {effect}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Equipment List */}
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <div className="bg-green-800 text-white py-2 px-4 font-bold flex items-center">
                <Shield size={18} className="mr-2" />
                EQUIPMENT
              </div>
              
              <div className="p-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-green-800">Credits</span>
                    <span className="font-bold">{character.credits || 0} Cr</span>
                  </div>
                  
                  <ul className="space-y-1 text-sm">
                    {(character.equipment || equipmentList).map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-800 mr-2">•</span>
                        <span>{typeof item === 'string' ? item : item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Skills and Character Details */}
          <div className="col-span-8">
            {/* Skills Panel */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-300">
              <div className="bg-blue-800 text-white py-2 px-4 font-bold flex items-center">
                <Crosshair size={18} className="mr-2" />
                SKILLS
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {formatSkillList().map((skill, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center p-2 bg-white rounded shadow-sm hover:bg-blue-50"
                    >
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-xs text-gray-500">{skill.source}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg">{skill.value}%</div>
                        <div className={`text-xs ${getSkillLevelColor(skill.value)}`}>
                          {getSkillLevelName(skill.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                    <strong>Special Note:</strong> When making advancement checks, skills at 50-69% improve on a roll with 
                    a ones digit of 1-5, skills at 70-89% improve on a roll with a ones digit of 1-3, and skills at 90%+ 
                    improve on a roll with a ones digit of 1.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Character Details */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-300">
              <div className="bg-blue-800 text-white py-2 px-4 font-bold flex items-center">
                <Eye size={18} className="mr-2" />
                CHARACTER DETAILS
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-blue-900 mb-1">Appearance</h3>
                      <p className="bg-white p-2 rounded border border-gray-200 text-sm">
                        {character.appearance || "No appearance details provided."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Personality</h3>
                      <p className="bg-white p-2 rounded border border-gray-200 text-sm">
                        {character.personality || "No personality details provided."}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-blue-900 mb-1">Origin: {character.origin?.name}</h3>
                      <p className="bg-white p-2 rounded border border-gray-200 text-sm">
                        {character.origin?.description || "No origin selected."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Background: {character.background?.name}</h3>
                      <p className="bg-white p-2 rounded border border-gray-200 text-sm">
                        {character.background?.description || "No background selected."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes Section */}
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <div className="bg-blue-800 text-white py-2 px-4 font-bold flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  NOTES & CONNECTIONS
                </div>
                
                <button className="text-sm bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded flex items-center">
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="p-4">
                <textarea 
                  className="w-full border border-gray-300 rounded p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Record important notes, connections, and campaign events here..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">Generated with Atomic Tomorrow Character Creator</div>
          <div className="text-xs text-gray-400 mt-1">
            The Atomic Tomorrow Adventures Role-Playing Game &copy; 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;