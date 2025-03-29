import React, { useState, useEffect } from 'react';
import RetroPushButton from './RetroPushButton';
import { PORTRAITS, PORTRAIT_TYPES } from '../utils/portraits';

/**
 * Enhanced PortraitSelector with retro-atomic styling and generation button
 * 
 * @param {Object} props
 * @param {Object} props.selectedPortrait - Currently selected portrait
 * @param {Function} props.onSelectPortrait - Function to call when portrait is selected
 * @param {string} props.genderPreference - Gender preference from parent component
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
    // Replace with fallback
    const imgElement = e.target;
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
    <div className="p-6 rounded-xl border border-blue-900 space-y-6" style={{ 
      backgroundColor: '#111827',
      boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(37, 99, 235, 0.2)'
    }}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-blue-400" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}>
          Character Portrait
        </h3>

        {/* Retro Push Button for generating new options */}
        <RetroPushButton
          onClick={generatePortraits}
          label="New Faces"
          icon="refresh"
          color="blue"
        />
      </div>

      {/* Portraits grid */}
      <div className="grid grid-cols-3 gap-4">
        {portraits.map(portrait => (
          <div
            key={portrait.id}
            onClick={() => onSelectPortrait(portrait)}
            className={`relative overflow-hidden bg-gray-800 border-2 ${
              selectedPortrait?.id === portrait.id 
                ? 'border-blue-500' 
                : 'border-gray-700'
            } rounded-md transition-all cursor-pointer`}
            style={{
              boxShadow: selectedPortrait?.id === portrait.id 
                ? '0 0 15px rgba(59, 130, 246, 0.7)' 
                : 'none'
            }}
          >
            {/* Portrait image */}
            <div className="w-full h-44 overflow-hidden relative">
              <img
                src={portrait.path}
                alt={portrait.name}
                className="w-full h-full object-cover object-top"
                onError={handleImageError}
              />
              
              {/* Holographic overlay for selected portrait */}
              {selectedPortrait?.id === portrait.id && (
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{
                    background: 'linear-gradient(45deg, rgba(96, 165, 250, 0) 0%, rgba(96, 165, 250, 0.2) 50%, rgba(96, 165, 250, 0) 100%)',
                    animation: 'holographic-scan 2s linear infinite'
                  }}
                />
              )}
            </div>
            
            {/* Cockpit indicator light below portrait */}
            <div className="flex justify-center mb-3 relative">
              <div 
                className={`relative top-auto right-auto ${selectedPortrait?.id === portrait.id ? 'active glowing' : ''}`}
                style={{ 
                  position: 'relative', 
                  display: 'block',
                  width: '14px',
                  height: '14px',
                  marginTop: '12px',
                  borderRadius: '50%',
                  backgroundColor: selectedPortrait?.id === portrait.id ? '#ef4444' : '#4b5563',
                  border: '2px solid #6b7280',
                  boxShadow: selectedPortrait?.id === portrait.id ? '0 0 10px rgba(239, 68, 68, 0.7)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes holographic-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .glowing {
          animation: glow 2s infinite;
        }
        
        @keyframes glow {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default PortraitSelector;