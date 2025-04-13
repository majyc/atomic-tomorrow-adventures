import React from 'react';

/**
 * Enhanced GenderSelector component with red dome light indicators
 * and round silver buttons for a retro-futuristic aesthetic
 * 
 * @param {Object} props
 * @param {string} props.selectedGender - The currently selected gender ('male', 'female', or 'random')
 * @param {Function} props.onSelectGender - Function to call when a gender is selected
 */
const GenderSelector = ({ selectedGender, onSelectGender }) => {
  const genderOptions = [
    { id: 'male', label: 'Male', symbol: '♂' },
    { id: 'female', label: 'Female', symbol: '♀' },
    { id: 'random', label: 'Random', symbol: '?' }
  ];

  return (
    <div className="flex justify-center p-4 gap-6 bg-gray-900 rounded-b-lg mb-4 border-t border-blue-900">
      {genderOptions.map(option => {
        const isSelected = selectedGender === option.id;
        
        return (
          <div key={option.id} className="flex flex-col items-center relative">
            {/* Dome light indicator above the button - always red */}
            <div className="relative mb-1">
              <div 
                className="w-4 h-4 rounded-full mb-1 transition-all duration-300"
                style={{ 
                  backgroundColor: isSelected ? '#ef4444' : '#1f2937',
                  boxShadow: isSelected ? '0 0 10px rgba(239, 68, 68, 0.7)' : 'none'
                }}
              >
                {/* Inner light reflection */}
                {isSelected && (
                  <div 
                    className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-60"
                  ></div>
                )}
              </div>
            </div>
            
            {/* Round silver button with retro style */}
            <button
              onClick={() => onSelectGender(option.id)}
              className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ease-in-out"
              style={{
                background: isSelected 
                  ? 'linear-gradient(135deg, #4b5563, #1f2937)' 
                  : 'linear-gradient(135deg, #9ca3af, #4b5563)',
                border: isSelected
                  ? '2px solid #374151'
                  : '2px solid #6b7280',
                boxShadow: isSelected
                  ? 'inset 0 3px 6px rgba(0, 0, 0, 0.5), 0 0 5px rgba(255, 255, 255, 0.1)'
                  : 'inset 0 -2px 5px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.1)',
                transform: isSelected ? 'translateY(2px)' : 'translateY(0)'
              }}
            >
              {/* Metal rim */}
              <div className="absolute inset-0.5 rounded-full pointer-events-none" 
                style={{
                  borderTop: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.5)',
                  borderBottom: isSelected ? '1px solid rgba(0, 0, 0, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Symbol */}
              <span className="text-3xl font-bold" 
                style={{ 
                  color: isSelected ? '#d1d5db' : '#f3f4f6',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {option.symbol}
              </span>
            </button>
            
            {/* Label */}
            <span className={`mt-2 text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default GenderSelector;