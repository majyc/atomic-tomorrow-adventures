import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';

// Custom AtomicKnob component
const AtomicKnob = ({ value, onChange, steps, color }) => {
  const knobRef = useRef(null);
  
  // Get color based on the category
  const getColors = () => {
    switch (color) {
      case 'bg-blue-700':
        return {
          primary: '#1e40af',
          secondary: '#3b82f6',
          highlight: '#60a5fa',
          text: '#dbeafe'
        };
      case 'bg-green-700':
        return {
          primary: '#166534',
          secondary: '#22c55e',
          highlight: '#4ade80',
          text: '#dcfce7'
        };
      case 'bg-yellow-600':
        return {
          primary: '#854d0e',
          secondary: '#eab308',
          highlight: '#facc15',
          text: '#fef9c3'
        };
      case 'bg-red-700':
        return {
          primary: '#991b1b',
          secondary: '#ef4444',
          highlight: '#f87171',
          text: '#fee2e2'
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
    
    // Calculate angle from center to initial click point
    const initialX = e.clientX - centerX;
    const initialY = e.clientY - centerY;
    const initialAngleDeg = Math.atan2(initialY, initialX) * 180 / Math.PI;
    
    // Get current value's angle (in degrees, 0-360 range)
    const currentValueAngle = ((value / (steps - 1)) * 270) - 225;
    
    // Calculate the offset between the click angle and the current value angle
    const angleOffset = initialAngleDeg - currentValueAngle;
    
    // Calculate value from raw angle
    const valueFromAngle = (angle) => {
      // Convert radians to degrees and normalize to 0-360
      let degrees = (angle * 180 / Math.PI) % 360;
      if (degrees < 0) degrees += 360;
      
      // For a 270-degree range where 0 is at the top (12 o'clock):
      // We want to map angles from 45° to 315° to our value range
      // with 45° = value 0 and 315° = value (steps-1)
      
      if (degrees >= 45 && degrees <= 315) {
        const normalizedDegrees = degrees - 45;
        const mappedPercentage = normalizedDegrees / 270;
        return Math.max(0, Math.min(steps - 1, Math.round(mappedPercentage * (steps - 1))));
      } else {
        // Outside the valid range, return current value
        return value;
      }
    };
    
    // Handle mouse move for dragging
    const handleMouseMove = (moveEvent) => {
      // Calculate new angle from center
      const newX = moveEvent.clientX - centerX;
      const newY = moveEvent.clientY - centerY;
      let newAngleDeg = Math.atan2(newY, newX) * 180 / Math.PI;
      
      // Adjust the angle using the offset to maintain relative position
      let targetAngle = newAngleDeg - angleOffset;
      
      // Normalize to 0-360 range
      if (targetAngle < 0) targetAngle += 360;
      if (targetAngle >= 360) targetAngle %= 360;
      
      // Use the valueFromAngle function to calculate the new value
      const newValue = valueFromAngle(targetAngle * Math.PI / 180);
      onChange(newValue);
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
      const tickAngle = (i / (numTicks - 1)) * 270 ;
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
      aria-label="Selection knob"
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

const CharacterConcept = ({ character, updateCharacter }) => {
  // State for currently focused item in each column
  const [focusedEpithet, setFocusedEpithet] = useState(0);
  const [focusedProfession, setFocusedProfession] = useState(0);
  const [focusedOrigin, setFocusedOrigin] = useState(0);
  const [focusedBackground, setFocusedBackground] = useState(0);

  // Update character when selections change
  useEffect(() => {
    updateCharacter({
      ...character,
      epithet: EPITHETS[focusedEpithet],
      profession: PROFESSIONS[focusedProfession],
      origin: ORIGINS[focusedOrigin],
      background: BACKGROUNDS[focusedBackground]
    });
  }, [focusedEpithet, focusedProfession, focusedOrigin, focusedBackground]);

  // Render a selection column
  const renderSelectionColumn = (title, data, focusedIndex, setFocusedIndex, color) => {
    return (
      <div className="flex flex-col h-full">
        {/* Column Header */}
        <h3 className={`text-lg font-semibold mb-3 text-center ${color} text-white py-2 rounded-t-lg`}>
          {title.toUpperCase()}
        </h3>

        {/* Retro Terminal Display */}
        <div className="bg-black border-2 border-gray-700 rounded-md mb-4 flex justify-center items-center p-4 h-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-900 to-green-700"></div>
          <p className="font-mono text-green-500 text-xl tracking-wider glow-text">
            {data[focusedIndex]?.name || "SELECT OPTION"}
          </p>
        </div>

        {/* Knob Control with buttons */}
        <div className="flex items-center justify-center mb-4 space-x-4">
          <button
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))}
          >
            <ChevronLeft size={20} />
          </button>

          <AtomicKnob
            value={focusedIndex}
            onChange={setFocusedIndex}
            steps={data.length}
            color={color}
          />

          <button
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => setFocusedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev))}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Selected Option Details Card */}
        <div className={`flex-grow p-4 border-2 rounded-lg transition-all overflow-y-auto h-52 ${data[focusedIndex] ? colorToBorder(color) : 'border-gray-300'
          }`}>
          {data[focusedIndex] ? (
            <>
              <h3 className="text-lg font-bold mb-2">{data[focusedIndex].name}</h3>
              <p className="text-sm mb-3">{data[focusedIndex].description}</p>

              <div className="pt-3 border-t border-gray-200 text-xs">
                {title === 'Epithet' && (
                  <>
                    <div className="flex items-start mb-1">
                      <Zap size={14} className="mr-1 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div><strong>Effect:</strong> {data[focusedIndex].attributeEffect}</div>
                    </div>
                    <div className="flex items-start">
                      <Zap size={14} className="mr-1 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div><strong>Benefit:</strong> {data[focusedIndex].benefit}</div>
                    </div>
                  </>
                )}

                {(title === 'Profession' || title === 'Origin' || title === 'Background') && (
                  <div className="flex items-start">
                    <Zap size={14} className="mr-1 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><strong>Skills:</strong> {data[focusedIndex].skills}</div>
                  </div>
                )}

                {title === 'Origin' && (
                  <div className="flex items-start mt-1">
                    <Zap size={14} className="mr-1 text-green-600 flex-shrink-0 mt-0.5" />
                    <div><strong>Attributes:</strong> {data[focusedIndex].attributeMods}</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 italic">Select an option to see details</p>
          )}
        </div>

        {/* Option Hint List - with fixed height */}
        <div className="mt-2 flex flex-wrap gap-1 h-24 overflow-y-auto">
          {data.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setFocusedIndex(idx)}
              className={`text-xs px-1.5 py-1 rounded cursor-pointer transition-all ${idx === focusedIndex
                  ? `${colorToOptionBg(color)} text-white font-bold`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper to convert color class to border class
  const colorToBorder = (color) => {
    if (color.includes('blue')) return 'border-blue-500 bg-blue-50';
    if (color.includes('green')) return 'border-green-500 bg-green-50';
    if (color.includes('yellow')) return 'border-yellow-500 bg-yellow-50';
    if (color.includes('red')) return 'border-red-500 bg-red-50';
    return 'border-gray-300';
  };

  // Helper to convert color class to option background
  const colorToOptionBg = (color) => {
    if (color.includes('blue')) return 'bg-blue-600';
    if (color.includes('green')) return 'bg-green-600';
    if (color.includes('yellow')) return 'bg-yellow-600';
    if (color.includes('red')) return 'bg-red-600';
    return 'bg-gray-600';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 1: Choose Your Character Concept</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Each column rendered with appropriate data and focused index */}
        {renderSelectionColumn('Epithet', EPITHETS, focusedEpithet, setFocusedEpithet, 'bg-blue-700')}
        {renderSelectionColumn('Profession', PROFESSIONS, focusedProfession, setFocusedProfession, 'bg-green-700')}
        {renderSelectionColumn('Origin', ORIGINS, focusedOrigin, setFocusedOrigin, 'bg-yellow-600')}
        {renderSelectionColumn('Background', BACKGROUNDS, focusedBackground, setFocusedBackground, 'bg-red-700')}
      </div>

      {/* Character summary */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="text-xl font-bold mb-2 text-center text-gray-800">Character Concept</h3>
        {character.epithet && character.profession && character.origin && character.background ? (
          <p className="text-center text-lg">
            <span className="font-medium text-blue-800">{character.epithet.name}</span> <span className="font-medium text-green-800">{character.profession.name}</span> from a <span className="font-medium text-yellow-700">{character.origin.name}</span> <span className="font-medium text-red-700">{character.background.name}</span> background
          </p>
        ) : (
          <p className="text-center text-gray-500 italic">Select one option from each column to complete your character concept</p>
        )}
      </div>
    </div>
  );
};

export default CharacterConcept;