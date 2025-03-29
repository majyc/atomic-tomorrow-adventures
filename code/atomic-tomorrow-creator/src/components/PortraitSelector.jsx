import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { PORTRAITS, PORTRAIT_TYPES } from '../utils/portraits';

/**
 * PortraitSelector - Now using external gender preference
 * Keeps the same styling as the original but without the gender buttons
 */
const PortraitSelector = ({ selectedPortrait, onSelectPortrait, genderPreference }) => {
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Generate portraits on mount and when gender preference changes
  useEffect(() => {
    generatePortraits();
  }, [genderPreference]);

  // Generate random portrait selection based on gender preference
  const generatePortraits = () => {
    setLoading(true);

    // Slight delay to show loading effect
    setTimeout(() => {
      // Get gender to filter by (using the genderPreference prop)
      // Map 'random' to null for the filter
      const gender = genderPreference !== 'random' ? genderPreference : null;
      
      // Create a new random selection of portrait indices
      const maxIndex = gender === 'male' || gender === 'female' ? 20 : 40;
      const availableIndices = Array.from({ length: maxIndex }, (_, i) => i + 1);
      
      // Shuffle the array
      for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
      }
      
      // Take first 6 indices
      const selectedIndices = availableIndices.slice(0, 6);
      
      // Generate portrait data for these indices
      const selectedPortraits = [];
      
      selectedIndices.forEach(index => {
        // For mixed gender selection, first half of indices are male, second half female
        if (gender === 'female' || (gender === null && index > 20)) {
          const femaleIndex = gender === null ? index - 20 : index;
          if (femaleIndex <= PORTRAIT_TYPES.female.length) {
            selectedPortraits.push({
              id: `female-${femaleIndex}`,
              name: PORTRAIT_TYPES.female[femaleIndex - 1],
              path: `/portraits/f_${femaleIndex}.jpg`,
              gender: 'female'
            });
          }
        } else {
          // Male portraits
          if (index <= PORTRAIT_TYPES.male.length) {
            selectedPortraits.push({
              id: `male-${index}`,
              name: PORTRAIT_TYPES.male[index - 1],
              path: `/portraits/m_${index}.jpg`,
              gender: 'male'
            });
          }
        }
      });
      
      setPortraits(selectedPortraits);
      setLoading(false);
    }, 300);
  };
  
  // Handle image loading error
  const handleImageError = (e) => {
    // Instead of trying to load another image that might not exist,
    // just display a styled div as fallback
    const imgElement = e.target;
    if (!(imgElement instanceof HTMLImageElement)) return;
    imgElement.style.display = 'none';
    
    // Get the parent container to add a fallback element
    const container = imgElement.parentElement;
    
    // Only add fallback if it doesn't exist yet and parent exists
    if (container && !container.querySelector('.portrait-fallback')) {
      // Create fallback element
      const fallback = document.createElement('div');
      fallback.className = 'portrait-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-600';
      
      // Add a letter indicator (first letter of the portrait name)
      const letter = document.createElement('span');
      const portraitName = imgElement.alt || 'Portrait';
      letter.textContent = portraitName.charAt(0);
      letter.className = 'text-white text-3xl font-bold';
      
      // Append elements
      fallback.appendChild(letter);
      container.appendChild(fallback);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-blue-900 space-y-6">
      {/* Retro-atomic control panel styling */}
      <style jsx>{`
        /* Portrait indicator lights */
        .portrait-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #4b5563;
          border: 2px solid #6b7280;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .portrait-indicator::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50% 50% 0 0;
        }
        
        .portrait-indicator.active {
          background-color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7), inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes glow {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .glowing {
          animation: glow 2s infinite;
        }
      `}</style>
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-blue-400" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}>
          Character Portrait
        </h3>

        {/* Refresh button - with retro styling */}
        <button
          onClick={generatePortraits}
          className="px-4 py-2 bg-gray-800 text-blue-400 border border-blue-600 rounded hover:bg-gray-700 flex items-center"
          disabled={loading}
          style={{
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.4), inset 0 0 3px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Shuffle size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'New Options'}
        </button>
      </div>

      {/* Portraits grid */}
      <div className="grid grid-cols-3 gap-4">
        {portraits.map(portrait => (
          <div
            key={portrait.id}
            onClick={() => onSelectPortrait(portrait)}
            className="relative overflow-hidden bg-gray-800 border-2 border-gray-700 rounded-md transition-all cursor-pointer"
          >
            {/* Portrait image */}
            <div className="w-full h-44 overflow-hidden relative">
              <img
                src={portrait.path}
                alt={portrait.name}
                className="w-full h-full object-cover object-top"
                onError={handleImageError}
              />
            </div>
            
            {/* Cockpit indicator light below portrait */}
            <div className="flex justify-center mb-3 relative">
              <div 
                className={`portrait-indicator relative top-auto right-auto ${selectedPortrait?.id === portrait.id ? 'active glowing' : ''}`}
                style={{ 
                  position: 'relative', 
                  display: 'block',
                  width: '14px',
                  height: '14px',
                  marginTop: '12px' 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortraitSelector;