// Update the imports at the top of CharacterSheet.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, Share2, Edit, AlertCircle, Shield, Zap, Crosshair, Brain, Eye, Database, Skull, Heart } from 'lucide-react';

// Import utility functions - replace the individual functions with centralized ones
import { printCharacterSheet } from '../utils/printUtils';
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

// Import components
import ImportDialog from './ImportDialog';

/**
 * Character Sheet component that displays all character information
 */
const CharacterSheet = ({ character, updateCharacter }) => {
  // State for calculated skills and print mode
  const [calculatedSkills, setCalculatedSkills] = useState({});
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const sheetRef = useRef(null);
  
  // Calculate skills based on character choices
  useEffect(() => {
    if (!character.attributes || !character.profession || !character.origin || !character.background) return;
    
    // Use utility function to calculate skills
    const skills = calculateSimplifiedSkills(character);
    setCalculatedSkills(skills);
  }, [character]);
  
  // Equipment list - fallback to defaults if not provided
  const equipmentList = character.equipment || [
    "Custom flight jacket with personal insignia",
    "Pilot's chronometer (precision timepiece)",
    "Personal navigation computer",
    "Light Ray Pistol",
    "Emergency survival kit",
    "Trade guild credentials"
  ];
  
  // Handler for Print button
  const handlePrint = () => {
    printCharacterSheet(character, notes);
  };
  
  // Handler for Save PDF button (same as print)
  const handleSavePDF = () => {
    handlePrint();
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
      } else {
        alert('Failed to copy to clipboard. Here\'s your character code:\n\n' + exportString);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export character: ' + error.message);
    }
  };
  
  // Handler for Import button
  const handleImport = () => {
    setShowImportDialog(true);
  };
  
  // Handler for when a character is imported
  const handleImportComplete = (importedCharacter, importedNotes) => {
    // Update the character in the parent component
    updateCharacter(importedCharacter);
    
    // Set notes
    setNotes(importedNotes);
    
    // Success message
    alert('Character imported successfully!');
  };

  return (
    <div className={`${isPrintMode ? 'print-mode' : ''} transition-all duration-300`} ref={sheetRef}>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except our character sheet */
          body > *:not(.print-mode) {
            display: none !important;
          }
          
          /* Main print styles */
          .print-mode {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            margin: 0;
            padding: 0;
          }
          
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
          
          /* Remove all decorative effects */
          .glow-effect {
            text-shadow: none !important;
            box-shadow: none !important;
            animation: none !important;
          }
          
          /* Reset all background colors to white */
          .bg-gray-900, .bg-gray-800, .bg-blue-900, .bg-blue-800,
          .bg-purple-900, .bg-purple-800, .bg-green-900, .bg-green-800,
          .bg-gray-300 {
            background-color: white !important;
          }
          
          /* Standardize all borders */
          .border, .border-blue-900, .border-purple-900, .border-green-900,
          .border-blue-800, .border-purple-800, .border-green-800,
          .border-gray-700, .border-gray-600 {
            border-color: #333 !important;
            border-width: 1px !important;
          }
          
          /* Change all text to black */
          .text-white, .text-blue-100, .text-blue-200, .text-blue-300, .text-blue-400, 
          .text-blue-800, .text-green-100, .text-green-200, .text-green-300, 
          .text-green-400, .text-green-800, .text-purple-100, .text-purple-200, 
          .text-purple-300, .text-purple-400, .text-purple-800, .text-yellow-400, 
          .text-orange-400, .text-red-400, .text-gray-400, .text-gray-300, .text-gray-200 {
            color: black !important;
          }
          
          /* Add page margin for printing */
          .character-sheet-content {
            padding: 0.5cm !important;
          }
          
          /* Ensure the header stays with content by preventing page breaks */
          .header-and-content {
            page-break-inside: avoid;
            page-break-before: auto;
          }
          
          /* Scale down content if needed to prevent overflows */
          .character-sheet-content {
            zoom: 0.95;
          }
          
          /* Ensure grid columns don't get split across pages */
          .grid {
            display: block !important;
          }
          
          .col-span-4, .col-span-8 {
            width: 100% !important;
            display: block !important;
            margin-bottom: 1cm;
          }
          
          /* Minimize margins for printing */
          body, html {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.9); }
          100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .glow-effect {
          animation: glow 3s infinite;
        }
        
        .wound-track-box {
          width: 25px;
          height: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          border: 2px solid;
        }
      `}</style>

      {/* Actions Toolbar */}
      <div className={`bg-blue-900 py-3 px-6 text-white flex justify-between items-center sticky top-0 z-10 no-print ${isPrintMode ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold flex items-center" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }}>
          <Database className="mr-2" />
          Character Sheet
        </h1>
        <div className="flex space-x-4">
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-1" />
            Print
          </button>
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handleSavePDF}
          >
            <Download size={16} className="mr-1" />
            Save PDF
          </button>
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handleExport}
          >
            <Share2 size={16} className="mr-1" />
            Export
          </button>
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handleImport}
          >
            <Download size={16} className="mr-1" />
            Import
          </button>
        </div>
      </div>
      
      {/* Import Character Dialog */}
      {showImportDialog && (
        <ImportDialog 
          onClose={() => setShowImportDialog(false)} 
          onImport={handleImportComplete} 
        />
      )}
      
      {/* Character Sheet Content */}
      <div className={`character-sheet-content max-w-5xl mx-auto px-6 py-6 ${isPrintMode ? 'bg-white text-black' : 'bg-gray-900 text-gray-100'}`}>
        <div className="header-and-content">
          {/* Header Section */}
          <div className={`mb-8 flex justify-between items-start border-b ${isPrintMode ? 'border-gray-400' : 'border-blue-800'} pb-4`}>
            <div className="flex-1">
              <h1 className={`text-4xl font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'}`} style={!isPrintMode ? { textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' } : {}}>
                {character.name || "UNNAMED CHARACTER"}
              </h1>
              <h2 className="text-xl text-gray-300 mt-1">
                <span className={isPrintMode ? 'text-black' : 'text-blue-400'}>{character.epithet?.name || "Epithet"}</span>{" "}
                <span className={isPrintMode ? 'text-black' : 'text-green-400'}>{character.profession?.name || "Profession"}</span> from{" "}
                <span className={isPrintMode ? 'text-black' : 'text-yellow-400'}>{character.origin?.name || "Origin"}</span> with a{" "}
                <span className={isPrintMode ? 'text-black' : 'text-red-400'}>{character.background?.name || "Background"}</span>
              </h2>
            </div>
            
            <div className={`w-24 h-24 ${isPrintMode ? 'bg-gray-300' : 'bg-gray-700'} rounded-full overflow-hidden flex items-center justify-center border-2 ${isPrintMode ? 'border-gray-500' : 'border-blue-700 glow-effect'}`}>
              <div className={`w-full h-full ${character.portrait?.style || 'bg-blue-600'}`}></div>
            </div>
          </div>
          
          {/* CLASSIFIED Stamp - Decorative (hidden in print mode) */}
          {!isPrintMode && (
            <div className="absolute top-24 right-10 transform rotate-12 opacity-20 pointer-events-none no-print">
              <div className="border-8 border-red-600 text-red-600 px-6 py-2 rounded-md">
                <p className="text-5xl font-black tracking-widest">CLASSIFIED</p>
              </div>
            </div>
          )}
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Attributes and Core Stats */}
            <div className="col-span-4">
              {/* Attributes Panel */}
              <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                  <Brain size={18} className="mr-2" />
                  ATTRIBUTES
                </div>
                
                <div className="p-4 space-y-2">
                  {['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => (
                    <div key={attr} className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                      <div className="font-medium">{attr}</div>
                      <div className={`flex items-center ${getAttributeColor(character.attributes?.[attr] || 10, isPrintMode)}`}>
                        <div className={`text-xl font-bold`}>
                          {character.attributes?.[attr] || 10}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Derived Statistics */}
              <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                  <Database size={18} className="mr-2" />
                  DERIVED STATISTICS
                </div>
                
                <div className="p-4 space-y-2">
                  <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                    <div className="font-medium">Initiative</div>
                    <div className="text-xl font-bold">{(character.attributes?.REFLEX || 10) * 5}%</div>
                  </div>
                  
                  <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                    <div className="font-medium">Damage Soak</div>
                    <div className="text-xl font-bold">{(character.attributes?.GRIT || 10) * 5}%</div>
                  </div>
                  
                  <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                    <div className="font-medium">Solar Scouts Training</div>
                    <div className="text-xl font-bold">{((character.attributes?.REFLEX || 10) * 2) + 15}%</div>
                  </div>
                  
                  <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                    <div className="font-medium">Wound Track</div>
                    <div className="text-xl flex items-center">
                      {/* Wound track boxes */}
                      {Array.from({ length: character.epithet?.id === 'grizzled' ? 5 : 4 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`wound-track-box ${isPrintMode ? 'border-gray-700' : 'border-red-500'} rounded`} 
                          style={!isPrintMode ? { boxShadow: i === 0 ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none' } : {}}
                        >
                          {i === 0 && <Heart size={14} className={isPrintMode ? 'text-gray-700' : 'text-red-500'} />}
                          {i === (character.epithet?.id === 'grizzled' ? 4 : 3) && (
                            <Skull size={14} className={isPrintMode ? 'text-gray-700' : 'text-red-500'} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Abilities */}
              <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-purple-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-purple-900'} text-white py-2 px-4 font-bold flex items-center`}>
                  <Zap size={18} className="mr-2" />
                  SPECIAL ABILITIES
                </div>
                
                <div className="p-4">
                  <div className={`rounded p-3 border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-purple-800'}`}>
                    <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-purple-300'} mb-1`}>
                      {character.epithet?.name || "Epithet Ability"}
                    </h3>
                    <p className={`text-sm ${isPrintMode ? 'text-gray-700' : 'text-purple-200'}`}>
                      {character.epithet?.benefit || "Select an epithet to see its special ability"}
                    </p>
                  </div>
                  
                  {character.signatureGadget && (
                    <div className={`rounded p-3 border mt-4 ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'}`}>
                      <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-300'} mb-1`}>
                        Signature Gadget: {character.signatureGadget.name}
                      </h3>
                      <div className={`text-sm ${isPrintMode ? 'text-gray-700' : 'text-blue-200'} space-y-1`}>
                        {character.signatureGadget.effects.map((effect, idx) => (
                          <p key={idx}>• {effect}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Equipment List */}
              <div className={`rounded-lg overflow-hidden border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-green-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-green-900'} text-white py-2 px-4 font-bold flex items-center`}>
                  <Shield size={18} className="mr-2" />
                  EQUIPMENT
                </div>
                
                <div className="p-4">
                  <div className={`rounded-lg p-3 border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-green-800'}`}>
                    <div className="flex justify-between mb-2">
                      <span className={`font-medium ${isPrintMode ? 'text-black' : 'text-green-400'}`}>Credits</span>
                      <span className={`font-bold ${isPrintMode ? 'text-black' : 'text-green-300'}`}>{character.credits || 0} Cr</span>
                    </div>
                    
                    <ul className="space-y-1 text-sm">
                      {equipmentList.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className={isPrintMode ? "text-black mr-2" : "text-green-500 mr-2"}>•</span>
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
              <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center justify-between`}>
                  <div className="flex items-center">
                    <Crosshair size={18} className="mr-2" />
                    SKILLS (AUTOMATICALLY CALCULATED)
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {formatSkillsForDisplay(calculatedSkills).map(([skillName, skillData], idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}
                      >
                        <div>
                          <div className="font-medium">{skillName}</div>
                          <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            From: {skillData.source}
                          </div>
                          <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-400'}`} title="Skill Derivation">
                            Formula: {getSkillDerivation(skillData, getSkillAttribute(skillName), character)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-bold text-lg">{skillData.value}%</div>
                          <div className={`text-xs ${getSkillLevelColor(skillData.value, isPrintMode)}`}>
                            {getSkillLevelName(skillData.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${isPrintMode ? 'border-gray-300' : 'border-gray-700'}`}>
                    <div className={`p-3 rounded text-sm ${isPrintMode ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 text-blue-300'}`}>
                      <strong>About Skills:</strong> Skills are automatically calculated based on your character's attributes, profession, origin, and background. They use the formula: (Attribute × 2) + Bonus from Source.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Character Details */}
              <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                  <Eye size={18} className="mr-2" />
                  CHARACTER DETAILS
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Details */}
                    <div>
                      <div className="mb-4">
                        <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>Appearance</h3>
                        <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                          {character.appearance || "No appearance details provided."}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>Personality</h3>
                        <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                          {character.personality || "No personality details provided."}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right Details */}
                    <div>
                      <div className="mb-4">
                        <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>
                          Origin: {character.origin?.name}
                        </h3>
                        <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                          {character.origin?.description || "No origin selected."}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>
                          Background: {character.background?.name}
                        </h3>
                        <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                          {character.background?.description || "No background selected."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className={`rounded-lg overflow-hidden border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
                <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center justify-between`}>
                  <div className="flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    NOTES & CONNECTIONS
                  </div>
                  
                  <button 
                    className={`text-sm ${isPrintMode ? 'hidden' : 'bg-blue-800 hover:bg-blue-700'} px-2 py-1 rounded flex items-center no-print`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit size={14} className="mr-1" />
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                
                <div className="p-4">
                  {isEditing ? (
                    <textarea 
                      className={`w-full border rounded p-3 h-32 focus:outline-none focus:ring-2 
                        ${isPrintMode ? 'bg-gray-100 border-gray-300 text-black' : 'bg-gray-900 border-blue-800 text-white focus:ring-blue-500'}`}
                      placeholder="Record important notes, connections, and campaign events here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  ) : (
                    <div className={`w-full border rounded p-3 h-32 
                      ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'}`}>
                      {notes || "No notes recorded. Click 'Edit' to add your notes here."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <div className={`text-sm ${isPrintMode ? 'text-gray-800' : 'text-gray-400'}`}>
              Generated with Atomic Tomorrow Character Creator
            </div>
            <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-500'} mt-1`}>
              The Atomic Tomorrow Adventures Role-Playing Game &copy; 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;