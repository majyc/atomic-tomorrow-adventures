import React, { useState, useRef, useEffect } from 'react';
import { Download, Printer, Share2, AlertCircle, Shield, Zap, Crosshair, Brain, Eye, Database, Skull, Heart } from 'lucide-react';

// Import utility functions
import { exportCharacter, copyToClipboard } from '../utils/characterIOUtils';
import { 
  calculateSimplifiedSkills, 
  formatSkillsForDisplay, 
  getSkillAttribute, 
  getSkillDerivation, 
  getSkillLevelName, 
  getSkillLevelColor, 
  getAttributeColor 
} from '../utils/skillUtils';
import { printCharacterSheet } from '../utils/printUtils';

// Import RetroTerminalInput component
import RetroTerminalInput from './RetroTerminalInput';

/**
 * Character Sheet component that displays all character information
 */
const CharacterSheet = ({ character, updateCharacter }) => {
  // State for calculated skills and UI controls
  const [calculatedSkills, setCalculatedSkills] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [hasExported, setHasExported] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const sheetRef = useRef(null);
  
  // Calculate skills based on character choices
  React.useEffect(() => {
    if (!character.attributes || !character.profession || !character.origin || !character.background) return;
    
    // Use utility function to calculate skills
    const skills = calculateSimplifiedSkills(character);
    setCalculatedSkills(skills);
  }, [character]);
  
  // Update character in parent component only when exported or printed
  useEffect(() => {
    if ((hasExported || hasPrinted) && updateCharacter) {
      // Update character with a flag indicating completion
      updateCharacter({
        ...character,
        _isCompleted: true
      });
    }
  }, [hasExported, hasPrinted]);
  
  // Ensure that completion state is not set automatically when reaching this step
  useEffect(() => {
    // If we're at this step but haven't exported or printed yet, ensure flag is false
    if (!hasExported && !hasPrinted && character._isCompleted) {
      updateCharacter({
        ...character,
        _isCompleted: false
      });
    }
  }, []);
  
  // Equipment list - fallback to defaults if not provided
  const equipmentList = character.equipment || [
    { id: "default-1", name: "Custom flight jacket with personal insignia", category: "Armor", quantity: 1 },
    { id: "default-2", name: "Pilot's chronometer (precision timepiece)", category: "Gadgets", quantity: 1 },
    { id: "default-3", name: "Personal navigation computer", category: "Tools", quantity: 1 },
    { id: "default-4", name: "Light Ray Pistol", category: "Weapons", quantity: 1 },
    { id: "default-5", name: "Emergency survival kit", category: "Survival Gear", quantity: 1 },
    { id: "default-6", name: "Trade guild credentials", category: "Miscellaneous", quantity: 1 }
  ];
  
  // Handler for Print/PDF button - uses the utility function from printUtils
  const handlePrint = () => {
    printCharacterSheet(character, notes);
    setHasPrinted(true); // Mark as printed for progress indicator
  };
  
  // Handler for Export button
  const handleExport = () => {
    try {
      // Use utility function to export character
      const exportString = exportCharacter(character, notes);
      
      // Copy to clipboard
      const successful = copyToClipboard(exportString);
      
      if (successful) {
        alert('Character exported to clipboard! You can paste and save this code to import your character later.');
        setHasExported(true); // Mark as exported for progress indicator
      } else {
        alert('Failed to copy to clipboard. Here\'s your character code:\n\n' + exportString);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export character: ' + error.message);
    }
  };

  return (
    <div id="character-sheet-container" ref={sheetRef}>
      {/* Actions Toolbar - marked as no-print */}
      <div className="bg-blue-900 py-3 px-6 text-white flex justify-between items-center sticky top-0 z-10 no-print">
        <h1 className="text-2xl font-bold flex items-center" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }}>
          <Database className="mr-2" />
          Character Sheet
        </h1>
        <div className="flex space-x-4">
          <button 
            className={`raygun-button flex items-center px-3 py-1.5 ${hasPrinted ? 'bg-green-700' : ''}`}
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-1" />
            {hasPrinted ? 'Print Again' : 'Print/PDF'}
          </button>
          <button 
            className={`raygun-button flex items-center px-3 py-1.5 ${hasExported ? 'bg-green-700' : ''}`}
            onClick={handleExport}
          >
            <Share2 size={16} className="mr-1" />
            {hasExported ? 'Export Again' : 'Export'}
          </button>
        </div>
      </div>

      {/* Character Sheet Content */}
      <div id="character-sheet-content" className="max-w-5xl mx-auto px-6 py-6 bg-gray-900 text-gray-100">
        {/* Header Section with simplified styling */}
        <div className="page-break-avoid relative">
          <div className="mb-10 relative">
            {/* Header content */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-blue-400" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}>
                  {character.name || "UNNAMED CHARACTER"}
                </h1>
                <h2 className="text-xl text-gray-300 mt-1 pb-4">
                  <span className="text-blue-400">{character.epithet?.name || "Epithet"}</span>{" "}
                  <span className="text-green-400">{character.profession?.name || "Profession"}</span> from{" "}
                  <span className="text-yellow-400">{character.origin?.name || "Origin"}</span> with a{" "}
                  <span className="text-red-400">{character.background?.name || "Background"}</span>
                </h2>
              </div>
              
              {/* Space reserved for portrait */}
              <div className="w-44"></div>
            </div>
            
            {/* Simple bottom border that spans only part of the header */}
            <div className="border-b border-blue-800 absolute bottom-0 left-0" style={{ width: 'calc(100% - 180px)' }}></div>
            
            {/* Concentric circles for portrait frame */}
            <div className="absolute" style={{ 
              width: '140px', 
              height: '140px', 
              border: '2px solid #1e40af',
              borderRadius: '50%',
              right: '20px',
              top: '-20px',
              opacity: 0.7
            }}></div>
            
            <div className="absolute" style={{ 
              width: '150px', 
              height: '150px', 
              border: '1px solid #1e40af',
              borderRadius: '50%',
              right: '15px',
              top: '-25px',
              opacity: 0.4
            }}></div>
            
            {/* Portrait */}
            <div 
              className="w-32 h-32 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center border-4 border-blue-700 glow-effect absolute z-10"
              style={{ 
                boxShadow: '0 0 25px rgba(37, 99, 235, 0.7)', 
                top: '-16px',
                right: '24px',
              }}
            >
              {character.portrait ? (
                <div className="w-full h-full relative">
                  <img
                    src={character.portrait.path}
                    alt={character.portrait.name || "Character portrait"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide the image and show the fallback
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.style.display = 'none';

                      // If there's already a fallback element, don't create another
                      const parent = imgElement.parentElement;
                      if (parent && !parent.querySelector('.portrait-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'portrait-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-600 to-blue-900';

                        const letter = document.createElement('span');
                        letter.textContent = (character.name || 'C').charAt(0);
                        letter.className = 'text-white text-4xl font-bold';

                        fallback.appendChild(letter);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-blue-900 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {character.name ? character.name.charAt(0) : 'C'}
                  </span>
                </div>
              )}

              {/* Retro glowing rim effect */}
              <div className="absolute inset-0 rounded-full pointer-events-none glow-rim"></div>
            </div>
          </div>

          {/* CLASSIFIED Stamp - Decorative */}
          <div className="absolute top-24 right-10 transform rotate-12 opacity-20 pointer-events-none no-print">
            <div className="border-8 border-red-600 text-red-600 px-6 py-2 rounded-md">
              <p className="text-5xl font-black tracking-widest">CLASSIFIED</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Attributes and Core Stats */}
          <div className="col-span-4">
            {/* Attributes Panel */}
            <div className="rounded-lg overflow-hidden mb-6 border bg-gray-800 border-blue-900 page-break-avoid">
              <div className="bg-blue-900 text-white py-2 px-4 font-bold flex items-center section-header">
                <Brain size={18} className="mr-2" />
                ATTRIBUTES
              </div>
              
              <div className="p-4 space-y-2">
                {['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => (
                  <div key={attr} className="flex justify-between items-center p-2 bg-gray-900 rounded">
                    <div className="font-medium">{attr}</div>
                    <div className={`flex items-center ${getAttributeColor(character.attributes?.[attr] || 10)}`}>
                      <div className="text-xl font-bold">
                        {character.attributes?.[attr] || 10}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Derived Statistics */}
            <div className="rounded-lg overflow-hidden mb-6 border bg-gray-800 border-blue-900 page-break-avoid">
              <div className="bg-blue-900 text-white py-2 px-4 font-bold flex items-center section-header">
                <Database size={18} className="mr-2" />
                DERIVED STATISTICS
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                  <div className="font-medium">Initiative</div>
                  <div className="text-xl font-bold">{(character.attributes?.REFLEX || 10) * 5}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                  <div className="font-medium">Damage Soak</div>
                  <div className="text-xl font-bold">{(character.attributes?.GRIT || 10) * 5}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                  <div className="font-medium">Solar Scouts Training</div>
                  <div className="text-xl font-bold">{((character.attributes?.REFLEX || 10) * 2) + 15}%</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900 rounded">
                  <div className="font-medium">Wound Track</div>
                  <div className="text-xl flex items-center">
                    {/* Wound track boxes */}
                    {Array.from({ length: character.epithet?.id === 'grizzled' ? 5 : 4 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="wound-track-box border-2 border-red-500 rounded w-6 h-6 mr-1 flex items-center justify-center"
                        style={{ boxShadow: i === 0 ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none' }}
                      >
                        {i === 0 && <Heart size={14} className="text-red-500" />}
                        {i === (character.epithet?.id === 'grizzled' ? 4 : 3) && (
                          <Skull size={14} className="text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Special Abilities */}
            <div className="rounded-lg overflow-hidden mb-6 border bg-gray-800 border-purple-900 page-break-avoid">
              <div className="bg-purple-900 text-white py-2 px-4 font-bold flex items-center section-header">
                <Zap size={18} className="mr-2" />
                SPECIAL ABILITIES
              </div>
              
              <div className="p-4">
                <div className="rounded p-3 border bg-gray-900 border-purple-800">
                  <h3 className="font-bold text-purple-300 mb-1">
                    {character.epithet?.name || "Epithet Ability"}
                  </h3>
                  <p className="text-sm text-purple-200">
                    {character.epithet?.benefit || "Select an epithet to see its special ability"}
                  </p>
                </div>
                
                {character.signatureGadget && (
                  <div className="rounded p-3 border mt-4 bg-gray-900 border-blue-800">
                    <h3 className="font-bold text-blue-300 mb-1">
                      Signature Gadget: {character.signatureGadget.name}
                    </h3>
                    <div className="text-sm text-blue-200 space-y-1">
                      {character.signatureGadget.effects.map((effect, idx) => (
                        <p key={idx}>• {effect}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Equipment List */}
            <div className="rounded-lg overflow-hidden border bg-gray-800 border-green-900 page-break-avoid">
              <div className="bg-green-900 text-white py-2 px-4 font-bold flex items-center section-header">
                <Shield size={18} className="mr-2" />
                EQUIPMENT
              </div>
              
              <div className="p-4">
                <div className="rounded-lg p-3 border bg-gray-900 border-green-800">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-green-400">Credits</span>
                    <span className="font-bold text-green-300">{character.credits || 0} Cr</span>
                  </div>
                  
                  <ul className="space-y-1 text-sm">
                    {equipmentList.map((item, idx) => (
                      <li key={item.id || idx} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
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
            <div className="rounded-lg overflow-hidden mb-6 border bg-gray-800 border-blue-900 page-break-avoid">
              <div className="bg-blue-900 text-white py-2 px-4 font-bold flex items-center justify-between section-header">
                <div className="flex items-center">
                  <Crosshair size={18} className="mr-2" />
                  SKILLS (AUTOMATICALLY CALCULATED)
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {formatSkillsForDisplay(calculatedSkills).map(([skillName, skillData], idx) => {
                    const typedSkillData = skillData as any; // Type assertion
                    return (
                      <div 
                        key={idx} 
                        className="flex justify-between items-start p-2 bg-gray-900 rounded"
                      >
                        <div>
                          <div className="font-medium text-gray-200">{skillName}</div>
                          <div className="text-xs text-gray-400">
                            From: {typedSkillData.source}
                          </div>
                          <div className="text-xs font-mono mt-1 text-gray-400" title="Skill Derivation">
                            {typedSkillData.derivation || "Skill derivation not available"}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-bold text-lg">{typedSkillData.value}%</div>
                          <div className={`text-xs ${getSkillLevelColor(typedSkillData.value)}`}>
                            {getSkillLevelName(typedSkillData.value)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="p-3 rounded text-sm bg-gray-900 text-blue-300">
                    <strong>About Skills:</strong> Skills are automatically calculated based on your character's attributes, profession, origin, and background. They use the formula: (Attribute × 2) + 5% + Profession Bonus + Origin Bonus + Background Bonus.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Character Details */}
            <div className="rounded-lg overflow-hidden mb-6 border bg-gray-800 border-blue-900 page-break-avoid">
              <div className="bg-blue-900 text-white py-2 px-4 font-bold flex items-center section-header">
                <Eye size={18} className="mr-2" />
                CHARACTER DETAILS
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-blue-400 mb-1">Appearance</h3>
                      <p className="p-2 rounded border bg-gray-900 border-blue-800 text-sm">
                        {character.appearance || "No appearance details provided."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-400 mb-1">Personality</h3>
                      <p className="p-2 rounded border bg-gray-900 border-blue-800 text-sm">
                        {character.personality || "No personality details provided."}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-blue-400 mb-1">
                        Origin: {character.origin?.name}
                      </h3>
                      <p className="p-2 rounded border bg-gray-900 border-blue-800 text-sm">
                        {character.origin?.description || "No origin selected."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-blue-400 mb-1">
                        Background: {character.background?.name}
                      </h3>
                      <p className="p-2 rounded border bg-gray-900 border-blue-800 text-sm">
                        {character.background?.description || "No background selected."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes Section - Now using RetroTerminalInput */}
            <div className="rounded-lg overflow-hidden border bg-gray-800 border-blue-900 page-break-avoid">
              <div className="bg-blue-900 text-white py-2 px-4 font-bold flex items-center justify-between section-header">
                <div className="flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  NOTES & CONNECTIONS
                </div>
                
                <button 
                  className="text-sm bg-blue-800 hover:bg-blue-700 px-2 py-1 rounded flex items-center no-print"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4">
                {isEditing ? (
                  <RetroTerminalInput
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record important notes, connections, and campaign events here..."
                    multiline={true}
                    rows={5}
                    type="text"
                  />
                ) : (
                  <div className="relative w-full p-5 rounded" style={{ 
                    backgroundColor: '#0c1a36',
                    border: '2px solid #1e40af',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.3)',
                    minHeight: '120px'
                  }}>
                    {/* Scanline effect overlay */}
                    <div className="absolute top-0 left-0 width-full height-full pointer-events-none" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
                      backgroundSize: '100% 4px',
                      animation: 'scanlines 1s linear infinite',
                      zIndex: 1
                    }}></div>
                    
                    {/* Terminal text with glow effect */}
                    <div style={{ 
                      position: 'relative',
                      zIndex: 2,
                      color: '#93c5fd',
                      textShadow: '0 0 5px rgba(59, 130, 246, 0.8)',
                      fontFamily: '"Courier New", monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {notes || "No notes recorded. Click 'Edit' to add your notes here."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-400">
            Generated with Atomic Tomorrow Character Creator
          </div>
          <div className="text-xs text-gray-500 mt-1">
            The Atomic Tomorrow Adventures Role-Playing Game &copy; 2025
          </div>
        </div>
      </div>

      {/* CSS for page break control and effects */}
      <style>
        {`
        .page-break-avoid {
          page-break-inside: avoid;
        }
        .glow-effect {
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.6), inset 0 0 5px rgba(37, 99, 235, 0.4);
        }
        .glow-rim {
            box-shadow: inset 0 0 5px rgba(59, 130, 246, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 50%;
        }
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes textFlicker {
          0% { opacity: 0.94; }
          5% { opacity: 1; }
          10% { opacity: 0.98; }
          15% { opacity: 0.94; }
          20% { opacity: 0.99; }
          25% { opacity: 1; }
          30% { opacity: 0.98; }
          35% { opacity: 0.96; }
          40% { opacity: 1; }
          45% { opacity: 0.99; }
          50% { opacity: 0.98; }
          55% { opacity: 1; }
          60% { opacity: 0.97; }
          65% { opacity: 0.99; }
          70% { opacity: 1; }
          75% { opacity: 0.99; }
          80% { opacity: 0.99; }
          85% { opacity: 0.99; }
          90% { opacity: 1; }
          95% { opacity: 0.99; }
          100% { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default CharacterSheet;