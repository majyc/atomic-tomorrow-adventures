import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';

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
    // Calculate the slider position as a percentage
    const handleSliderChange = (e) => {
      // Convert the slider value (0-100) to an index in the data array
      const newIndex = Math.round((e.target.value / 100) * (data.length - 1));
      setFocusedIndex(newIndex);
    };

    return (
      <div className="flex flex-col h-full">
        {/* Column Header */}
        <h3 className={`text-lg font-semibold mb-3 text-center ${color} text-white py-2 rounded-t-lg`}>
          COLUMN {title.charAt(0)}: {title.toUpperCase()}
        </h3>
        
        {/* Retro Terminal Display */}
        <div className="bg-black border-2 border-gray-700 rounded-md mb-4 flex justify-center items-center p-4 h-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-900 to-green-700"></div>
          <p className="font-mono text-green-500 text-xl tracking-wider glow-text">
            {data[focusedIndex]?.name || "SELECT OPTION"}
          </p>
        </div>
        
        {/* Slider Control with Current Index/Total */}
        <div className="flex items-center mb-4 space-x-2">
          <button 
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex-grow relative">
            {/* Actual slider control */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={(focusedIndex / (data.length - 1)) * 100}
              onChange={handleSliderChange}
              className={`w-full h-2 appearance-none rounded-lg ${colorToSliderTrack(color)} outline-none`}
              style={{
                // Custom slider styling for better aesthetics
                background: `linear-gradient(to right, ${colorToSliderFill(color)} 0%, ${colorToSliderFill(color)} ${(focusedIndex / (data.length - 1)) * 100}%, #d1d5db ${(focusedIndex / (data.length - 1)) * 100}%, #d1d5db 100%)`,
              }}
            />
            
            {/* Custom thumb styling */}
            <style jsx>{`
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #fff;
                border: 2px solid ${colorToSliderFill(color)};
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: all 0.15s ease;
              }
              
              input[type=range]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
              }
              
              input[type=range]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #fff;
                border: 2px solid ${colorToSliderFill(color)};
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: all 0.15s ease;
              }
              
              input[type=range]::-moz-range-thumb:hover {
                transform: scale(1.2);
              }
            `}</style>
          </div>
          
          <button 
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            onClick={() => setFocusedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev))}
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300">
            {focusedIndex + 1}/{data.length}
          </div>
        </div>
        
        {/* Selected Option Details Card */}
        <div className={`flex-grow p-4 border-2 rounded-lg transition-all ${
          data[focusedIndex] ? colorToBorder(color) : 'border-gray-300'
        }`}>
          {data[focusedIndex] ? (
            <>
              <h3 className="text-lg font-bold mb-2">{data[focusedIndex].name}</h3>
              <p className="text-sm mb-3">{data[focusedIndex].description}</p>
              
              <div className="pt-3 border-t border-gray-200 text-xs">
                {title === 'Epithet' && (
                  <>
                    <div className="flex items-center mb-1">
                      <Zap size={14} className="mr-1 text-yellow-600" />
                      <strong>Effect:</strong> {data[focusedIndex].attributeEffect}
                    </div>
                    <div className="flex items-center">
                      <Zap size={14} className="mr-1 text-purple-600" />
                      <strong>Benefit:</strong> {data[focusedIndex].benefit}
                    </div>
                  </>
                )}
                
                {(title === 'Profession' || title === 'Origin' || title === 'Background') && (
                  <div className="flex items-center">
                    <Zap size={14} className="mr-1 text-blue-600" />
                    <strong>Skills:</strong> {data[focusedIndex].skills}
                  </div>
                )}
                
                {title === 'Origin' && (
                  <div className="flex items-center mt-1">
                    <Zap size={14} className="mr-1 text-green-600" />
                    <strong>Attributes:</strong> {data[focusedIndex].attributeMods}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 italic">Select an option to see details</p>
          )}
        </div>
        
        {/* Option Hint List - small name previews */}
        <div className="mt-2 flex flex-wrap gap-1">
          {data.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setFocusedIndex(idx)}
              className={`text-xs px-1.5 py-1 rounded cursor-pointer transition-all ${
                idx === focusedIndex
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
  
  // Helper to convert color class to slider track color
  const colorToSliderTrack = (color) => {
    if (color.includes('blue')) return 'bg-blue-200';
    if (color.includes('green')) return 'bg-green-200';
    if (color.includes('yellow')) return 'bg-yellow-200';
    if (color.includes('red')) return 'bg-red-200';
    return 'bg-gray-200';
  };
  
  // Helper to convert color class to slider fill color
  const colorToSliderFill = (color) => {
    if (color.includes('blue')) return '#2563eb'; // blue-600
    if (color.includes('green')) return '#16a34a'; // green-600
    if (color.includes('yellow')) return '#ca8a04'; // yellow-600
    if (color.includes('red')) return '#dc2626'; // red-600
    return '#4b5563'; // gray-600
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
            <span className="font-medium text-blue-800">{character.epithet.name}</span> <span className="font-medium text-green-800">{character.profession.name}</span> from <span className="font-medium text-yellow-700">{character.origin.name}</span> with a <span className="font-medium text-red-700">{character.background.name}</span> background
          </p>
        ) : (
          <p className="text-center text-gray-500 italic">Select one option from each column to complete your character concept</p>
        )}
      </div>
    </div>
  );
};

export default CharacterConcept;