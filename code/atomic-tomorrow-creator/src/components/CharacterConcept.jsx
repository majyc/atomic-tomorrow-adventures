import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';
import AccessPanel from './AccessPanel';
import AtomicKnob from './AtomicKnob';

const CharacterConcept = ({ character, updateCharacter }) => {
  // State for currently focused item in each column
  const [focusedEpithet, setFocusedEpithet] = useState(0);
  const [focusedProfession, setFocusedProfession] = useState(0);
  const [focusedOrigin, setFocusedOrigin] = useState(0);
  const [focusedBackground, setFocusedBackground] = useState(0);
  
  // State to track if we've initialized from character data
  const [initialized, setInitialized] = useState(false);

  // Initialize component based on existing character data (on first mount only)
  useEffect(() => {
    if (!initialized) {
      // Find indices for existing selections if they exist
      let newIndices = {
        epithet: 0,
        profession: 0,
        origin: 0,
        background: 0
      };
      
      if (character.epithet) {
        const index = EPITHETS.findIndex(e => e.id === character.epithet.id);
        if (index !== -1) newIndices.epithet = index;
      }
      
      if (character.profession) {
        const index = PROFESSIONS.findIndex(p => p.id === character.profession.id);
        if (index !== -1) newIndices.profession = index;
      }
      
      if (character.origin) {
        const index = ORIGINS.findIndex(o => o.id === character.origin.id);
        if (index !== -1) newIndices.origin = index;
      }
      
      if (character.background) {
        const index = BACKGROUNDS.findIndex(b => b.id === character.background.id);
        if (index !== -1) newIndices.background = index;
      }
      
      // Update state without triggering character update
      setFocusedEpithet(newIndices.epithet);
      setFocusedProfession(newIndices.profession);
      setFocusedOrigin(newIndices.origin);
      setFocusedBackground(newIndices.background);
      setInitialized(true);
    }
  }, [character, initialized]);

  // Handle epithet selection change
  const handleEpithetChange = (newIndex) => {
    setFocusedEpithet(newIndex);
    updateCharacter({
      ...character,
      epithet: EPITHETS[newIndex]
    });
  };
  
  // Handle profession selection change
  const handleProfessionChange = (newIndex) => {
    setFocusedProfession(newIndex);
    updateCharacter({
      ...character,
      profession: PROFESSIONS[newIndex]
    });
  };
  
  // Handle origin selection change
  const handleOriginChange = (newIndex) => {
    setFocusedOrigin(newIndex);
    updateCharacter({
      ...character,
      origin: ORIGINS[newIndex]
    });
  };
  
  // Handle background selection change
  const handleBackgroundChange = (newIndex) => {
    setFocusedBackground(newIndex);
    updateCharacter({
      ...character,
      background: BACKGROUNDS[newIndex]
    });
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

  // Handle selection change
  const handleSelectionChange = (type, newIndex) => {
    switch(type) {
      case 'epithet':
        handleEpithetChange(newIndex);
        break;
      case 'profession':
        handleProfessionChange(newIndex);
        break;
      case 'origin':
        handleOriginChange(newIndex);
        break;
      case 'background':
        handleBackgroundChange(newIndex);
        break;
      default:
        break;
    }
  };

  // Render a selection column
  const renderSelectionColumn = (title, data, focusedIndex, type, color) => {
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
            onClick={() => handleSelectionChange(type, focusedIndex > 0 ? focusedIndex - 1 : focusedIndex)}
          >
            <ChevronLeft size={20} />
          </button>

          <AtomicKnob
            value={focusedIndex}
            onChange={(newIndex) => handleSelectionChange(type, newIndex)}
            steps={data.length}
            color={color}
          />

          <button
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => handleSelectionChange(type, focusedIndex < data.length - 1 ? focusedIndex + 1 : focusedIndex)}
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

        {/* Option Hint List - now in Access Panel */}
        <AccessPanel title={`ACCESS PANEL`}>
          <div className="flex flex-wrap gap-1">
            {data.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectionChange(type, idx)}
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
        </AccessPanel>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-5 rounded-xl">
      <style>
        {`
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
      `}
      </style>
      
      <div className="p-6 rounded-lg bg-gray-900">
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.6)' }}>STEP 1: CHOOSE YOUR CHARACTER CONCEPT</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Each column rendered with appropriate data and focused index */}
        {renderSelectionColumn('Epithet', EPITHETS, focusedEpithet, 'epithet', 'bg-blue-700')}
        {renderSelectionColumn('Profession', PROFESSIONS, focusedProfession, 'profession', 'bg-green-700')}
        {renderSelectionColumn('Origin', ORIGINS, focusedOrigin, 'origin', 'bg-yellow-600')}
        {renderSelectionColumn('Background', BACKGROUNDS, focusedBackground, 'background', 'bg-red-700')}
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