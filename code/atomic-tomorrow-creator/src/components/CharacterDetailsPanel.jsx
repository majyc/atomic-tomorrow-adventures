import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GenderSelector from './GenderSelector';
import NameInput from './NameInput'; // Proper import of our NameInput component
import AtomicKnob from './AtomicKnob';
import RetroToggleSwitch from './RetroToggleSwitch';
import RetroTerminalInput from './RetroTerminalInput';
import { PERSONALITY_TRAITS, APPEARANCE_TRAITS } from '../data/descriptions';

/**
 * Character Details Panel Component
 * Manages character name, age, appearance, and personality
 * Now properly using the NameInput component
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

  return (
    <div className="rounded-lg overflow-hidden mb-6 bg-gray-800 border border-blue-900"
         style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(37, 99, 235, 0.2)' }}>
      <div className="panel-header text-white py-2 px-4 font-bold flex items-center"
           style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', textShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }}>
        CHARACTER DETAILS
      </div>
      
      {/* Gender Selector */}
      <GenderSelector 
        selectedGender={genderPreference}
        onSelectGender={onGenderChange}
      />

      <div className="p-4 space-y-4">
        {/* Name Input with proper component */}
        <NameInput 
          name={name}
          setName={setName}
          genderPreference={genderPreference}
        />
        
        {/* Age */}
        <div className="relative">
          <div className="text-blue-400 mb-1 font-medium">Age</div>
          <RetroTerminalInput
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value) || 30)}
            type="number"
            multiline={false}
          />
        </div>

        {/* Appearance with Trait Suggestions Toggle */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 mb-1">
            <div className="text-blue-400 font-medium">Appearance</div>
            <div className="flex justify-end">
              <RetroToggleSwitch 
                isOn={showAppearanceSelector}
                onToggle={() => setShowAppearanceSelector(!showAppearanceSelector)}
                label="Trait Suggestions"
                color="green"
              />
            </div>
          </div>
          
          <RetroTerminalInput
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            placeholder="Describe your character's appearance..."
            multiline={true}
            rows={3}
          />
          
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

        {/* Personality with Trait Suggestions Toggle */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 mb-1">
            <div className="text-blue-400 font-medium">Personality</div>
            <div className="flex justify-end">
              <RetroToggleSwitch 
                isOn={showPersonalitySelector}
                onToggle={() => setShowPersonalitySelector(!showPersonalitySelector)}
                label="Trait Suggestions"
                color="green"
              />
            </div>
          </div>
          
          <RetroTerminalInput
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="Describe your character's personality traits..."
            multiline={true}
            rows={3}
          />
          
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
        .terminal-text {
          font-family: "VT323", monospace;
          color: #4ade80;
          text-shadow: 0 0 8px rgba(74, 222, 128, 0.9);
          letter-spacing: 0.05em;
        }
        
        .panel-header {
          background: linear-gradient(to right, #0f172a, #1e3a8a, #0f172a);
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
        }
      `}</style>
    </div>
  );
};

export default CharacterDetailsPanel;