import React, { useState, useEffect } from 'react';
import { Shuffle, User } from 'lucide-react';
import { PORTRAITS, PORTRAIT_TYPES } from '../utils/portraits';

const PortraitSelector = ({ selectedPortrait, onSelectPortrait }) => {
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');
  
  // Generate portraits on mount and when filter changes
  useEffect(() => {
    generatePortraits();
  }, [genderFilter]);

  // Generate random portrait selection
  const generatePortraits = () => {
    setLoading(true);

    // Slight delay to show loading effect
    setTimeout(() => {
      // Get gender to filter by
      const gender = genderFilter !== 'all' ? genderFilter : null;
      
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
    e.target.style.display = 'none';
    
    // Get the parent container to add a fallback element
    const container = e.target.parentNode;
    
    // Only add fallback if it doesn't exist yet
    if (!container.querySelector('.portrait-fallback')) {
      // Create fallback element
      const fallback = document.createElement('div');
      fallback.className = 'portrait-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-600';
      
      // Add a letter indicator (first letter of the portrait name)
      const letter = document.createElement('span');
      const portraitName = e.target.alt || 'Portrait';
      letter.textContent = portraitName.charAt(0);
      letter.className = 'text-white text-3xl font-bold';
      
      // Append elements
      fallback.appendChild(letter);
      container.appendChild(fallback);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold mb-4 text-blue-800">Character Portrait</h3>

        <div className="flex space-x-2">
          {/* Gender filter buttons */}
          <div className="flex items-center space-x-1 mr-2">
            <User size={14} className="text-gray-500" />
            <div className="flex space-x-1">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-2 py-0.5 text-xs rounded ${
                  genderFilter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setGenderFilter('male')}
                className={`px-2 py-0.5 text-xs rounded ${
                  genderFilter === 'male' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGenderFilter('female')}
                className={`px-2 py-0.5 text-xs rounded ${
                  genderFilter === 'female' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={generatePortraits}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
            disabled={loading}
          >
            <Shuffle size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'New Options'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {portraits.map(portrait => (
          <div
            key={portrait.id}
            onClick={() => onSelectPortrait(portrait)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedPortrait?.id === portrait.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
            }`}
            style={
              selectedPortrait?.id === portrait.id
                ? { boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)' }
                : {}
            }
          >
            <div className="w-full h-32 overflow-hidden bg-gray-100 relative">
              <img
                src={portrait.path}
                alt={portrait.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              
              {/* Gender indicator - optional */}
              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                portrait.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
              }`}>
                <span className="text-white text-xs">{portrait.gender === 'male' ? 'M' : 'F'}</span>
              </div>
            </div>

            <div className="p-2 text-center text-sm bg-white">{portrait.name}</div>
          </div>
        ))}
      </div>
      
      {/* Instructions for missing images */}
      <div className="text-xs text-gray-500 italic mt-1 p-2 bg-gray-100 rounded border border-gray-200">
        <strong>Image Setup:</strong> Place portrait images in your project's <code>public/portraits/</code> folder using the naming convention m_1.jpg to m_20.jpg for male portraits and f_1.jpg to f_20.jpg for female portraits. If images are missing, placeholder blocks will be shown.
      </div>
    </div>
  );
};

export default PortraitSelector;