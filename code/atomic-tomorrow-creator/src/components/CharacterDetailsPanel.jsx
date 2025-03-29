import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GenderSelector from './GenderSelector';
import NameInput from './NameInput';
import AtomicKnob from './AtomicKnob';
import { PERSONALITY_TRAITS, APPEARANCE_TRAITS } from '../data/descriptions';

/**
 * Character Details Panel Component
 * Manages character name, age, appearance, and personality
 * Uses a shared gender selector for name generation
 */
const CharacterDetailsPanel = ({ character, updateCharacter, genderPreference, onGenderChange }) => {
  // State for character details
  const [name, setName] = useState(character.name || '');
  const [appearance, setAppearance] = useState(character.appearance || '');
  const [personality, setPersonality] = useState(character.personality || '');
  const [age, setAge] = useState(character.age || 30);
  
  // State for trait selectors
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [showAppearanceSelector, setShowAppearanceSelector] = useState(false);
  const [focusedPersonalityIndex, setFocusedPersonalityIndex] = useState(0);
  const [focusedAppearanceIndex, setFocusedAppearanceIndex] = useState(0);

  // Update character in parent component when fields change
  useEffect(() => {
    updateCharacter({
      ...character,
      name,
      appearance,
      personality,
      age
    });
  }, [name, appearance, personality, age]);
  
  // Add personality trait suggestion to personality text
  const addTraitToPersonality = () => {
    const trait = PERSONALITY_TRAITS[focusedPersonalityIndex];
    if (!trait) return;
    
    // Add the trait to the existing personality, with proper spacing
    const newPersonality = personality ? 
      `${personality}${personality.endsWith('.') ? ' ' : '. '}${trait}.` : 
      `${trait}.`;
    
    setPersonality(newPersonality);
  };
  
  // Add appearance trait suggestion to appearance text
  const addTraitToAppearance = () => {
    const trait = APPEARANCE_TRAITS[focusedAppearanceIndex];
    if (!trait) return;
    
    // Add the trait to the existing appearance, with proper spacing
    const newAppearance = appearance ? 
      `${appearance}${appearance.endsWith('.') ? ' ' : '. '}${trait}.` : 
      `${trait}.`;
    
    setAppearance(newAppearance);
  };

  // CRT effect styles
  const crtStyles = {
    scanline: {
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
      backgroundSize: '100% 4px',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      animation: 'scanlines 1s linear infinite'
    },
    terminal: {
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.4)',
      border: '2px solid #14532d',
      backgroundColor: '#0a0a0a',
      borderRadius: '0.375rem',
      position: 'relative',
      overflow: 'hidden'
    }
  };

  return (
    <div className="rounded-lg overflow-hidden mb-6 bg-gray-800 border border-blue-900"
         style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(37, 99, 235, 0.2)' }}>
      <div className="panel-header text-white py-2 px-4 font-bold flex items-center"
           style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', textShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }}>
        CHARACTER DETAILS
      </div>
      
      {/* Gender Selector - Now a standalone component */}
      <GenderSelector 
        selectedGender={genderPreference}
        onSelectGender={onGenderChange}
      />

      <div className="p-4 space-y-4">
        {/* Name with Generator Button - using NameInput component */}
        <NameInput
          name={name}
          setName={setName}
          genderPreference={genderPreference}
        />
        
        {/* Age */}
        <div className="relative">
          <div className="text-blue-400 mb-1 font-medium">Age</div>
          <div className="relative" style={{ ...crtStyles.terminal }}>
            <div style={crtStyles.scanline}></div>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 30)}
              min="18"
              max="100"
              className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none"
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="relative">
          <div className="flex justify-between items-center">
            <div className="text-blue-400 mb-1 font-medium">Appearance</div>
            <button
              onClick={() => setShowAppearanceSelector(!showAppearanceSelector)}
              className="text-xs glowing-button px-2 py-1 rounded flex items-center"
              style={{
                backgroundColor: '#202020',
                color: '#4ade80',
                border: '1px solid #14532d',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.4)',
                textShadow: '0 0 5px rgba(0, 255, 0, 0.8)'
              }}
            >
              {showAppearanceSelector ? 'Hide Suggestions' : 'Show Trait Suggestions'}
            </button>
          </div>
          
          <div className="relative" style={{ ...crtStyles.terminal }}>
            <div style={crtStyles.scanline}></div>
            <textarea
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none"
              rows={3}
              placeholder="Describe your character's appearance..."
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)', fontFamily: 'monospace' }}
            ></textarea>
          </div>
          
          {/* Appearance Trait Knob Selector */}
          {showAppearanceSelector && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-indigo-900 trait-suggestion">
              <div className="mb-2 text-indigo-400 font-medium text-center">Appearance Trait Suggestions</div>
              
              <div className="flex justify-center items-center mb-3">
                <button
                  className="p-2 bg-gray-800 text-indigo-400 rounded-md hover:bg-gray-700"
                  onClick={() => setFocusedAppearanceIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                >
                  <ChevronLeft size={20} />
                </button>

                <AtomicKnob
                  value={focusedAppearanceIndex}
                  onChange={setFocusedAppearanceIndex}
                  steps={APPEARANCE_TRAITS.length}
                  color="bg-indigo-700"
                />

                <button
                  className="p-2 bg-gray-800 text-indigo-400 rounded-md hover:bg-gray-700"
                  onClick={() => setFocusedAppearanceIndex((prev) => (prev < APPEARANCE_TRAITS.length - 1 ? prev + 1 : prev))}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="mb-3 text-center">
                <div className="px-4 py-2 bg-gray-800 inline-block rounded terminal-text" style={{ color: '#a5b4fc', textShadow: '0 0 8px rgba(99, 102, 241, 0.9)' }}>
                  {APPEARANCE_TRAITS[focusedAppearanceIndex]}
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={addTraitToAppearance}
                  className="px-4 py-2 bg-indigo-900 text-indigo-200 rounded hover:bg-indigo-800 transition-colors"
                  style={{ boxShadow: '0 0 10px rgba(67, 56, 202, 0.5)' }}
                >
                  Add Trait to Description
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Personality */}
        <div className="relative">
          <div className="flex justify-between items-center">
            <div className="text-blue-400 mb-1 font-medium">Personality</div>
            <button
              onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
              className="text-xs glowing-button px-2 py-1 rounded flex items-center"
              style={{
                backgroundColor: '#202020',
                color: '#4ade80',
                border: '1px solid #14532d',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.4)',
                textShadow: '0 0 5px rgba(0, 255, 0, 0.8)'
              }}
            >
              {showPersonalitySelector ? 'Hide Suggestions' : 'Show Trait Suggestions'}
            </button>
          </div>
          
          <div className="relative" style={{ ...crtStyles.terminal }}>
            <div style={crtStyles.scanline}></div>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none"
              rows={3}
              placeholder="Describe your character's personality traits..."
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)', fontFamily: 'monospace' }}
            ></textarea>
          </div>
          
          {/* Personality Trait Knob Selector */}
          {showPersonalitySelector && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-purple-900 trait-suggestion">
              <div className="mb-2 text-purple-400 font-medium text-center">Personality Trait Suggestions</div>
              
              <div className="flex justify-center items-center mb-3">
                <button
                  className="p-2 bg-gray-800 text-purple-400 rounded-md hover:bg-gray-700"
                  onClick={() => setFocusedPersonalityIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                >
                  <ChevronLeft size={20} />
                </button>

                <AtomicKnob
                  value={focusedPersonalityIndex}
                  onChange={setFocusedPersonalityIndex}
                  steps={PERSONALITY_TRAITS.length}
                  color="bg-purple-700"
                />

                <button
                  className="p-2 bg-gray-800 text-purple-400 rounded-md hover:bg-gray-700"
                  onClick={() => setFocusedPersonalityIndex((prev) => (prev < PERSONALITY_TRAITS.length - 1 ? prev + 1 : prev))}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="mb-3 text-center">
                <div className="px-4 py-2 bg-gray-800 inline-block rounded terminal-text" style={{ color: '#c084fc', textShadow: '0 0 8px rgba(192, 132, 252, 0.9)' }}>
                  {PERSONALITY_TRAITS[focusedPersonalityIndex]}
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={addTraitToPersonality}
                  className="px-4 py-2 bg-purple-900 text-purple-200 rounded hover:bg-purple-800 transition-colors"
                  style={{ boxShadow: '0 0 10px rgba(126, 34, 206, 0.5)' }}
                >
                  Add Trait to Description
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .glowing-button {
          transition: all 0.3s ease;
        }
        
        .glowing-button:hover {
          background-color: #303030;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
        }
        
        .trait-suggestion {
          transition: all 0.3s ease;
        }
        
        .terminal-text {
          font-family: monospace;
          animation: textFlicker 0.01s infinite;
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
      `}</style>
    </div>
  );
};

export default CharacterDetailsPanel;