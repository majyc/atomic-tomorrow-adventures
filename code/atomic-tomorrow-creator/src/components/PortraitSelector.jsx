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
        /* Button styling */
        .atomic-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #b91c1c;
          border: 4px solid #9ca3af;
          position: relative;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .atomic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 45%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50% 50% 0 0;
          pointer-events: none;
        }
        
        .atomic-button.pressed {
          background-color: #7f1d1d;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.5);
          transform: translateY(2px);
        }
        
        /* Button label styling */
        .button-label {
          background-color: #1e293b;
          color: #e2e8f0;
          border: 2px solid #475569;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 12px;
          text-align: center;
          position: relative;
          margin-top: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
          min-width: 70px;
          width: 100%;
        }
        
        /* Rivets on button labels */
        .button-label::before,
        .button-label::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: #64748b;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .button-label::before {
          left: 3px;
        }
        
        .button-label::after {
          right: 3px;
        }
        
        /* Indicator light styling - dome lights */
        .dome-light {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #4b5563;
          border: 2px solid #6b7280;
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .dome-light::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50% 50% 0 0;
        }
        
        .dome-light.active {
          background-color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7), inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
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

      {/* Gender selection control panel */}
      <div className="bg-gray-800 p-6 rounded-lg border border-blue-900 flex items-center justify-center mb-4">
        <div className="relative flex items-center">
          <div className="flex items-end justify-center w-full space-x-12">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setGenderFilter('male')}
                className={`atomic-button ${genderFilter === 'male' ? 'pressed' : ''}`}
              >
                <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>♂</span>
              </button>
              <div className="button-label">Male</div>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={() => setGenderFilter('female')}
                className={`atomic-button ${genderFilter === 'female' ? 'pressed' : ''}`}
              >
                <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>♀</span>
              </button>
              <div className="button-label">Female</div>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={() => setGenderFilter('all')}
                className={`atomic-button ${genderFilter === 'all' ? 'pressed' : ''}`}
              >
                <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>?</span>
              </button>
              <div className="button-label">Random</div>
            </div>
          </div>
        </div>
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
      
      {/* Instructions panel */}
      <div className="bg-gray-800 p-3 rounded border border-blue-800 text-gray-400 text-xs">
        <p><strong className="text-blue-400">Image Setup:</strong> Place portrait images in your project's <code className="bg-gray-900 px-1 rounded">public/portraits/</code> folder using the naming convention m_1.jpg to m_20.jpg for male portraits and f_1.jpg to f_20.jpg for female portraits.</p>
      </div>
    </div>
  );
};

export default PortraitSelector;