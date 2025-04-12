import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

// Import the updated portrait configuration
import { PORTRAIT_COUNTS, PORTRAIT_TYPES } from '../utils/portraits';

/**
 * Enhanced PortraitSelector with retro-atomic styling and dynamic portrait support
 * 
 * @param {Object} props
 * @param {Object} props.selectedPortrait - Currently selected portrait
 * @param {Function} props.onSelectPortrait - Function to call when portrait is selected
 * @param {string} props.genderPreference - Gender preference from parent component
 */
const PortraitSelector = ({ selectedPortrait, onSelectPortrait, genderPreference }) => {
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const PORTRAITS_PER_PAGE = 6;
  
  // Calculate the maximum number of pages based on gender preference
  const getMaxPages = () => {
    // If random gender, we have access to all portraits
    if (genderPreference === 'random') {
      return Math.ceil((PORTRAIT_COUNTS.male + PORTRAIT_COUNTS.female) / PORTRAITS_PER_PAGE);
    }
    // Otherwise just the portraits for the selected gender
    const count = genderPreference === 'male' ? PORTRAIT_COUNTS.male : PORTRAIT_COUNTS.female;
    return Math.ceil(count / PORTRAITS_PER_PAGE);
  };
  
  // Generate portraits on mount and when gender preference changes
  useEffect(() => {
    generatePortraits();
    setPage(0); // Reset to first page when gender changes
  }, [genderPreference]);

  // Generate random portrait selection based on gender preference
  const generatePortraits = () => {
    setLoading(true);

    // Slight delay to show loading effect
    setTimeout(() => {
      // Get gender to filter by (using the genderPreference prop)
      const gender = genderPreference !== 'random' ? genderPreference : null;
      
      // Create a array of portrait indices based on gender
      let availableIndices = [];
      
      if (gender === 'male') {
        // Only male portraits (1 to PORTRAIT_COUNTS.male)
        availableIndices = Array.from({ length: PORTRAIT_COUNTS.male }, (_, i) => ({ gender: 'male', index: i + 1 }));
      } else if (gender === 'female') {
        // Only female portraits (1 to PORTRAIT_COUNTS.female)
        availableIndices = Array.from({ length: PORTRAIT_COUNTS.female }, (_, i) => ({ gender: 'female', index: i + 1 }));
      } else {
        // Both genders
        const maleIndices = Array.from({ length: PORTRAIT_COUNTS.male }, (_, i) => ({ gender: 'male', index: i + 1 }));
        const femaleIndices = Array.from({ length: PORTRAIT_COUNTS.female }, (_, i) => ({ gender: 'female', index: i + 1 }));
        availableIndices = [...maleIndices, ...femaleIndices];
      }
      
      // Shuffle the array
      for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
      }
      
      // Take first PORTRAITS_PER_PAGE indices (or fewer if not enough)
      const selectedIndices = availableIndices.slice(0, PORTRAITS_PER_PAGE);
      
      // Generate portrait data for these indices
      const selectedPortraits = selectedIndices.map(({ gender, index }) => {
        const portraitTypes = gender === 'male' ? PORTRAIT_TYPES.male : PORTRAIT_TYPES.female;
        const portraitName = index <= portraitTypes.length 
          ? portraitTypes[index - 1] 
          : `${gender === 'male' ? 'Male' : 'Female'} Character ${index}`;
        
        return {
          id: `${gender}-${index}`,
          name: portraitName,
          path: `/portraits/${gender === 'male' ? 'm' : 'f'}_${index}.jpg`,
          gender
        };
      });
      
      setPortraits(selectedPortraits);
      setLoading(false);
    }, 300);
  };
  
  // Navigate to next page
  const nextPage = () => {
    if (page < getMaxPages() - 1) {
      setPage(page + 1);
      generatePortraits();
    }
  };
  
  // Navigate to previous page
  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      generatePortraits();
    }
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

        <div className="flex space-x-2">
          {/* Page Navigation (only show if we have multiple pages) */}
          {getMaxPages() > 1 && (
            <div className="flex items-center mr-2 bg-gray-800 rounded-lg border border-gray-600 px-1">
              <button 
                onClick={prevPage}
                disabled={page === 0 || loading}
                className={`p-1 ${page === 0 ? 'text-gray-600' : 'text-gray-300 hover:text-blue-300'}`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-400 mx-1">Page {page + 1}/{getMaxPages()}</span>
              <button 
                onClick={nextPage}
                disabled={page >= getMaxPages() - 1 || loading}
                className={`p-1 ${page >= getMaxPages() - 1 ? 'text-gray-600' : 'text-gray-300 hover:text-blue-300'}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          
          {/* Generate Button */}
          <button
            onClick={generatePortraits}
            disabled={loading}
            className="flex items-center px-3 py-1.5 bg-blue-800 text-blue-200 rounded hover:bg-blue-700 transition-colors"
            style={{
              boxShadow: '0 0 10px rgba(37, 99, 235, 0.5), inset 0 0 5px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Shuffle size={14} className="mr-1" />
            {loading ? 'Loading...' : 'New Faces'}
          </button>
        </div>
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
                style={{
                  filter: selectedPortrait && selectedPortrait.id !== portrait.id
                    ? 'brightness(0.6)' 
                    : 'brightness(1)',
                  transition: 'filter 0.3s ease'
                }}
              />
            </div>
            
            {/* Portrait label */}
            <div className="p-2 text-center">
              <span className="text-xs text-gray-300">{portrait.name}</span>
            </div>
            
            {/* Selection indicator */}
            <div className="flex justify-center mb-3 relative">
              <div 
                className={`relative top-auto right-auto ${selectedPortrait?.id === portrait.id ? 'active glowing' : ''}`}
                style={{ 
                  position: 'relative', 
                  display: 'block',
                  width: '14px',
                  height: '14px',
                  marginTop: '-6px',
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
      
      <style>
        {`
        .glowing {
          animation: glow 2s infinite;
        }
        
        @keyframes glow {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        `}
      </style>
    </div>
  );
};

export default PortraitSelector;