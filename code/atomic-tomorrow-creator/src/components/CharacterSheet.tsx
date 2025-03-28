import React, { useState, useRef } from 'react';
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

// Import components
import ImportDialog from './ImportDialog';

/**
 * Character Sheet component that displays all character information
 */
const CharacterSheet = ({ character, updateCharacter }) => {
  // State for calculated skills and UI controls
  const [calculatedSkills, setCalculatedSkills] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const sheetRef = useRef(null);
  
  // Calculate skills based on character choices
  React.useEffect(() => {
    if (!character.attributes || !character.profession || !character.origin || !character.background) return;
    
    // Use utility function to calculate skills
    const skills = calculateSimplifiedSkills(character);
    setCalculatedSkills(skills);
  }, [character]);
  
  // Equipment list - fallback to defaults if not provided
  const equipmentList = character.equipment || [
    { id: "default-1", name: "Custom flight jacket with personal insignia", category: "Armor", quantity: 1 },
    { id: "default-2", name: "Pilot's chronometer (precision timepiece)", category: "Gadgets", quantity: 1 },
    { id: "default-3", name: "Personal navigation computer", category: "Tools", quantity: 1 },
    { id: "default-4", name: "Light Ray Pistol", category: "Weapons", quantity: 1 },
    { id: "default-5", name: "Emergency survival kit", category: "Survival Gear", quantity: 1 },
    { id: "default-6", name: "Trade guild credentials", category: "Miscellaneous", quantity: 1 }
  ];
  
  // Handler for Print button - uses the utility function from printUtils
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
    <div id="character-sheet-container" ref={sheetRef}>
      {/* Actions Toolbar - marked as no-print */}
      <div className="bg-blue-900 py-3 px-6 text-white flex justify-between items-center sticky top-0 z-10 no-print">
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
      <div id="character-sheet-content" className="max-w-5xl mx-auto px-6 py-6 bg-gray-900 text-gray-100">
        {/* Header Section - ensure it stays with content */}
        <div className="page-break-avoid">
          <div className="mb-8 flex justify-between items-start border-b border-blue-800 pb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-blue-400" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}>
                {character.name || "UNNAMED CHARACTER"}
              </h1>
              <h2 className="text-xl text-gray-300 mt-1">
                <span className="text-blue-400">{character.epithet?.name || "Epithet"}</span>{" "}
                <span className="text-green-400">{character.profession?.name || "Profession"}</span> from{" "}
                <span className="text-yellow-400">{character.origin?.name || "Origin"}</span> with a{" "}
                <span className="text-red-400">{character.background?.name || "Background"}</span>
              </h2>
            </div>
            
            <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-700 glow-effect">
              <div className={`w-full h-full ${character.portrait?.style || 'bg-blue-600'}`}></div>
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
                  <div className="text-xl font-bold">35%</div>
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
                  {formatSkillsForDisplay(calculatedSkills).map(([skillName, skillData], idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center p-2 bg-gray-900 rounded"
                    >
                      <div>
                        <div className="font-medium">{skillName}</div>
                        <div className="text-xs text-gray-400">
                          From: {skillData.source}
                        </div>
                        <div className="text-xs text-gray-400" title="Skill Derivation">
                          Formula: {getSkillDerivation(skillData, getSkillAttribute(skillName), character)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg">{skillData.value}%</div>
                        <div className={`text-xs ${getSkillLevelColor(skillData.value)}`}>
                          {getSkillLevelName(skillData.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="p-3 rounded text-sm bg-gray-900 text-blue-300">
                    <strong>About Skills:</strong> Skills are automatically calculated based on your character's attributes, profession, origin, and background. They use the formula: (Attribute × 2) + Bonus from Source.
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
            
            {/* Notes Section */}
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
                  <textarea 
                    className="w-full border rounded p-3 h-32 focus:outline-none focus:ring-2 
                      bg-gray-900 border-blue-800 text-white focus:ring-blue-500"
                    placeholder="Record important notes, connections, and campaign events here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                ) : (
                  <div className="w-full border rounded p-3 h-32 
                    bg-gray-900 border-blue-800">
                    {notes || "No notes recorded. Click 'Edit' to add your notes here."}
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

      {/* CSS for page break control */}
      <style jsx>{`
        .page-break-avoid {
          page-break-inside: avoid;
        }
      `}</style>
    </div>
  );
};

export default CharacterSheet;