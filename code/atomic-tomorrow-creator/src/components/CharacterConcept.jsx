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
  // This maps value 0 to -90 degrees (12 o'clock) and max value to 180 degrees (9 o'clock)
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
      position: 'relative'
    },
    greenText: {
      color: '#4ade80',
      textShadow: '0 0 8px rgba(0, 255, 0, 0.9), 0 0 15px rgba(0, 255, 0, 0.7)',
      fontFamily: 'monospace'
    }
  };

  // Helper to convert color class to border class with glow
  const colorToBorder = (color) => {
    if (color.includes('blue')) return 'border-blue-500';
    if (color.includes('green')) return 'border-green-500';
    if (color.includes('yellow')) return 'border-yellow-500';
    if (color.includes('red')) return 'border-red-500';
    return 'border-gray-300';
  };
  
  // Helper to get glowing border style
  const getBorderGlowStyle = (color) => {
    if (color.includes('blue')) return { boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)' };
    if (color.includes('green')) return { boxShadow: '0 0 10px rgba(34, 197, 94, 0.7)' };
    if (color.includes('yellow')) return { boxShadow: '0 0 10px rgba(234, 179, 8, 0.7)' };
    if (color.includes('red')) return { boxShadow: '0 0 10px rgba(239, 68, 68, 0.7)' };
    return {};
  };

  // Helper to convert color class to option background
  const colorToOptionBg = (color) => {
    if (color.includes('blue')) return 'bg-blue-600';
    if (color.includes('green')) return 'bg-green-600';
    if (color.includes('yellow')) return 'bg-yellow-600';
    if (color.includes('red')) return 'bg-red-600';
    return 'bg-gray-600';
  };
  
  // Helper to get glow style based on color
  const getGlowStyle = (color) => {
    if (color.includes('blue')) return { boxShadow: '0 0 15px rgba(59, 130, 246, 0.9)' };
    if (color.includes('green')) return { boxShadow: '0 0 15px rgba(34, 197, 94, 0.9)' };
    if (color.includes('yellow')) return { boxShadow: '0 0 15px rgba(234, 179, 8, 0.9)' };
    if (color.includes('red')) return { boxShadow: '0 0 15px rgba(239, 68, 68, 0.9)' };
    return { boxShadow: '0 0 15px rgba(107, 114, 128, 0.9)' };
  };

  // Render a selection column
  const renderSelectionColumn = (title, data, focusedIndex, setFocusedIndex, color) => {
    return (
      <div className="flex flex-col h-full">
        {/* Column Header */}
        <h3 className={`text-lg font-semibold mb-3 text-center ${color} text-white py-2 rounded-t-lg`} 
            style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.7)' }}>
          {title.toUpperCase()}
        </h3>

        {/* Retro Terminal Display */}
        <div className="mb-4 flex justify-center items-center p-4 h-16 relative overflow-hidden" style={crtStyles.terminal}>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-900 to-green-700"></div>
          {/* Scanline effect overlay */}
          <div style={crtStyles.scanline}></div>
          <p className="text-xl tracking-wider relative z-10 terminal-text" style={crtStyles.greenText}>
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
          }`} style={{ 
            backgroundColor: '#1a1a1a', 
            color: '#e0e0e0', 
            ...(data[focusedIndex] ? getBorderGlowStyle(color) : {}) 
          }}>
          {data[focusedIndex] ? (
            <>
              <h3 className="text-lg font-bold mb-2 text-white">{data[focusedIndex].name}</h3>
              <p className="text-sm mb-3 text-gray-300">{data[focusedIndex].description}</p>

              <div className="pt-3 border-t border-gray-600 text-xs">
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
        <div className="mt-2 flex flex-wrap gap-1 h-24 overflow-y-auto p-2 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          {data.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setFocusedIndex(idx)}
              className={`text-xs px-1.5 py-1 rounded cursor-pointer transition-all ${idx === focusedIndex
                  ? `${colorToOptionBg(color)} text-white font-bold`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              style={idx === focusedIndex ? getGlowStyle(color) : {}}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
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
        body {
          background-color: #111827;
        }
      `}</style>
      <div className="p-6 rounded-lg bg-gray-900">
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.6)' }}>STEP 1: CHOOSE YOUR CHARACTER CONCEPT</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Each column rendered with appropriate data and focused index */}
        {renderSelectionColumn('Epithet', EPITHETS, focusedEpithet, setFocusedEpithet, 'bg-blue-700')}
        {renderSelectionColumn('Profession', PROFESSIONS, focusedProfession, setFocusedProfession, 'bg-green-700')}
        {renderSelectionColumn('Origin', ORIGINS, focusedOrigin, setFocusedOrigin, 'bg-yellow-600')}
        {renderSelectionColumn('Background', BACKGROUNDS, focusedBackground, setFocusedBackground, 'bg-red-700')}
      </div>

      {/* Character summary - with enhanced terminal styling */}
      <div className="mt-8 p-5 rounded-lg relative" style={{
        ...crtStyles.terminal,
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(0, 255, 0, 0.5)',
        border: '3px solid #14532d'
      }}>
        {/* Terminal header bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-green-900 to-green-700"></div>
        {/* Scanline effect overlay */}
        <div style={crtStyles.scanline}></div>
        
        <h3 className="text-2xl font-bold mb-4 text-center terminal-text" style={{
          textShadow: '0 0 15px rgba(51, 255, 51, 1), 0 0 20px rgba(51, 255, 51, 0.8)'
        }}>
          FINAL CHARACTER CONCEPT
        </h3>
        
        {character.epithet && character.profession && character.origin && character.background ? (
          <p className="text-center text-lg terminal-text" style={{ lineHeight: 1.8, letterSpacing: '0.05em' }}>
            <span className="font-medium" style={{ color: '#93c5fd', textShadow: '0 0 10px rgba(59, 130, 246, 1), 0 0 15px rgba(59, 130, 246, 0.8)' }}>
              {character.epithet.name}
            </span> <span className="font-medium" style={{ color: '#86efac', textShadow: '0 0 10px rgba(34, 197, 94, 1), 0 0 15px rgba(34, 197, 94, 0.8)' }}>
              {character.profession.name}
            </span> from a <span className="font-medium" style={{ color: '#fde047', textShadow: '0 0 10px rgba(234, 179, 8, 1), 0 0 15px rgba(234, 179, 8, 0.8)' }}>
              {character.origin.name}
            </span> <span className="font-medium" style={{ color: '#fca5a5', textShadow: '0 0 10px rgba(239, 68, 68, 1), 0 0 15px rgba(239, 68, 68, 0.8)' }}>
              {character.background.name}
            </span> background
          </p>
        ) : (
          <p className="text-center italic terminal-text">
            AWAITING INPUT: Select one option from each column to complete your character concept
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterConcept;