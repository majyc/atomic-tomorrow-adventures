import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NameGenerator from './NameGenerator';
import { PERSONALITY_TRAITS, APPEARANCE_TRAITS } from '../data/descriptions';

// Custom AtomicKnob component for trait selection
const AtomicKnob = ({ value, onChange, steps, color }) => {
  const knobRef = useRef(null);
  
  // Get color based on the category
  const getColors = () => {
    switch (color) {
      case 'bg-purple-700':
        return {
          primary: '#7e22ce',
          secondary: '#a855f7',
          highlight: '#c084fc',
          text: '#f3e8ff'
        };
      case 'bg-indigo-700':
        return {
          primary: '#4338ca',
          secondary: '#6366f1',
          highlight: '#a5b4fc',
          text: '#e0e7ff'
        };
      default:
        return {
          primary: '#4b5563',
          secondary: '#9ca3af',
          highlight: '#d1d5db',
          text: '#f3f4f6'
        };
    }
  };
  
  const colors = getColors();
  
  // Calculate rotation angle from value - for midnight position (12 o'clock)
  const angle = Math.round((value / (steps - 1)) * 270) - 90;
  
  // Click handler
  const handleMouseDown = (e) => {
    if (!knobRef.current) return;
    
    // Get knob center
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate initial angle in radians and convert to degrees
    const initialX = e.clientX - centerX;
    const initialY = e.clientY - centerY;
    const initialAngleRad = Math.atan2(initialY, initialX);
    let initialAngleDeg = initialAngleRad * (180 / Math.PI);
    
    // Track the cumulative angle change
    let cumulativeAngleChange = 0;
    
    // Store the last angle to calculate deltas
    let lastAngleDeg = initialAngleDeg;
    
    // Store initial value
    const startValue = value;
    
    // Handle mouse move for dragging
    const handleMouseMove = (moveEvent) => {
      // Calculate new angle in radians and convert to degrees
      const newX = moveEvent.clientX - centerX;
      const newY = moveEvent.clientY - centerY;
      const newAngleRad = Math.atan2(newY, newX);
      let newAngleDeg = newAngleRad * (180 / Math.PI);
      
      // Calculate the delta angle (how much it changed since last move)
      let deltaAngleDeg = newAngleDeg - lastAngleDeg;
      
      // Fix for angle wrapping
      if (deltaAngleDeg > 180) deltaAngleDeg -= 360;
      if (deltaAngleDeg < -180) deltaAngleDeg += 360;
      
      // Update cumulative angle change
      cumulativeAngleChange += deltaAngleDeg;
      
      // Map the angle change to a value change
      // 270 degrees = full range of steps
      const valuePerDegree = (steps - 1) / 270;
      const valueChange = Math.round(cumulativeAngleChange * valuePerDegree);
      
      // Calculate the new value
      let newValue = startValue + valueChange;
      
      // Clamp value to valid range
      newValue = Math.max(0, Math.min(steps - 1, newValue));
      
      // Update value if changed
      if (newValue !== value) {
        onChange(newValue);
      }
      
      // Store current angle for next move event
      lastAngleDeg = newAngleDeg;
    };
    
    // Set up cleanup
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };
  
  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    const numTicks = Math.min(steps, 10); // Max 10 ticks for visual clarity
    
    for (let i = 0; i < numTicks; i++) {
      const tickAngle = (i / (numTicks - 1)) * 270;
      const isActive = i <= (value / (steps - 1)) * (numTicks - 1);
      
      ticks.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '10px',
            backgroundColor: isActive ? colors.highlight : '#4b5563',
            transform: `rotate(${tickAngle}deg) translateY(-32px)`,
            transformOrigin: 'bottom center',
            transition: 'background-color 0.2s'
          }}
        />
      );
    }
    
    return ticks;
  };
  
  return (
    <div
      ref={knobRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#111827',
        border: '4px solid #1f2937',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={steps - 1}
      aria-valuenow={value}
      aria-label="Trait selector"
    >
      {/* Tick marks */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {renderTicks()}
      </div>
      
      {/* Inner knob */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          backgroundColor: colors.primary,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
      
      {/* Indicator line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40%',
          height: '4px',
          backgroundColor: colors.secondary,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'left center',
          borderRadius: '2px'
        }}
      />
      
      {/* Center cap with value */}
      <div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          backgroundColor: '#1f2937',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: colors.text,
          fontSize: '10px',
          fontFamily: 'monospace',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {value + 1}/{steps}
      </div>
    </div>
  );
};

// Character Details Panel Component
const CharacterDetailsPanel = ({ character, updateCharacter }) => {
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

      <div className="p-4 space-y-4">
        {/* Name */}
        <div className="relative">
          <div className="text-blue-400 mb-1 font-medium">Character Name</div>
          <NameGenerator name={name} setName={setName} />
        </div>
        
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
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)' }}
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
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)' }}
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
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)' }}
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