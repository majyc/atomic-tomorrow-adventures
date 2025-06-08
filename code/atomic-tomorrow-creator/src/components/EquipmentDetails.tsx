import React, { useState, useEffect } from 'react';
import CharacterDetailsPanel from './CharacterDetailsPanel';
import EquipmentPanel from './EquipmentPanel';
import FinishingTouchPanel from './FinishingTouchPanel';
import PortraitSelector from './PortraitSelector';

/**
 * Equipment & Details Screen Component
 * Main container for character details, equipment and signature gadget
 * With shared gender selector for names and portraits
 */
const EquipmentDetails = ({ character, updateCharacter }) => {
  // State for character data
  const [characterData, setCharacterData] = useState(character);
  
  // State for portrait selection
  const [selectedPortrait, setSelectedPortrait] = useState(character.portrait || null);
  
  // State for gender preference - shared between name generator and portrait selector
  const [genderPreference, setGenderPreference] = useState('random');
  
  // Update character in parent component when data changes
  useEffect(() => {
    updateCharacter(characterData);
  }, [characterData]);
  
  // Update character data when portrait changes
  useEffect(() => {
    setCharacterData({
      ...characterData,
      portrait: selectedPortrait
    });
  }, [selectedPortrait]);
  
  // Update character data handler for child components
  const handleUpdateCharacterData = (updates) => {
    setCharacterData({
      ...characterData,
      ...updates
    });
  };

  return (
    <div className="bg-gray-900 p-5 rounded-xl">
      <style>{`
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
        .terminal-text {
          color: #4ade80;
          text-shadow: 0 0 10px rgba(51, 255, 51, 0.9), 0 0 15px rgba(51, 255, 51, 0.6);
          animation: textFlicker 0.01s infinite;
          font-family: monospace;
        }
        .glowing-button {
          background-color: #202020;
          color: #4ade80;
          border: 1px solid #14532d;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
          transition: all 0.3s ease;
        }
        .glowing-button:hover {
          background-color: #303030;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
        }
        .panel-header {
          background: linear-gradient(to right, #0f172a, #1e3a8a, #0f172a);
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
          letter-spacing: 1px;
        }
      `}</style>

      <h2 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.6)' }}>
        STEP 3: EQUIPMENT & DETAILS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Character Details and Portrait */}
        <div>
          {/* Character Details Panel */}
          <CharacterDetailsPanel 
            character={characterData} 
            updateCharacter={handleUpdateCharacterData}
            genderPreference={genderPreference}
            onGenderChange={setGenderPreference}
          />

          {/* Character Portrait Panel */}
          <div className="rounded-lg overflow-hidden bg-gray-800 border border-blue-900"
               style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(37, 99, 235, 0.2)' }}>
            <PortraitSelector 
              selectedPortrait={selectedPortrait} 
              onSelectPortrait={setSelectedPortrait}
              genderPreference={genderPreference}
            />
          </div>
        </div>

        {/* Right Column - Equipment and Signature Gadget */}
        <div>
          {/* Equipment Panel */}
          <EquipmentPanel 
            character={characterData} 
            updateCharacter={handleUpdateCharacterData} 
          />

          {/* Finishing Touch Panel */}
          <FinishingTouchPanel 
            character={characterData} 
            updateCharacter={handleUpdateCharacterData} 
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;