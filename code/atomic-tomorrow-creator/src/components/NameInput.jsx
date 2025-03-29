import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

/**
 * Component for character name input with generator button
 * Uses gender preference to generate appropriate names
 */
const NameInput = ({ name, setName, genderPreference }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to generate name based on gender preference
  const generateName = () => {
    setIsGenerating(true);
    
    // Male first names
    const maleNames = [
      "James", "John", "Michael", "Robert", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
      "Buzz", "Ace", "Rex", "Clint", "Dash", "Flash", "Buck", "Jet", "Dirk", "Duke"
    ];
    
    // Female first names
    const femaleNames = [
      "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
      "Nova", "Venus", "Stella", "Luna", "Aurora", "Celeste", "Betty", "Peggy", "Judy", "Lana"
    ];
    
    // Last names
    const lastNames = [
      "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
      "Rocketson", "Atomworth", "Stargazer", "Moonraker", "Galaxon", "Nebula", "Quasar", "Jetson", "Comet", "Orion"
    ];
    
    // Select appropriate list based on gender preference
    let firstName;
    if (genderPreference === 'male') {
      firstName = maleNames[Math.floor(Math.random() * maleNames.length)];
    } else if (genderPreference === 'female') {
      firstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    } else {
      // Random selection from both lists
      const allNames = [...maleNames, ...femaleNames];
      firstName = allNames[Math.floor(Math.random() * allNames.length)];
    }
    
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Set the new name
    setName(`${firstName} ${lastName}`);
    
    // Reset generating state after a short delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
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
      position: 'relative',
      overflow: 'hidden'
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-blue-400 mb-1">Character Name</label>
      <div className="flex">
        <div className="flex-grow relative" style={{ ...crtStyles.terminal }}>
          <div style={crtStyles.scanline}></div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter character name..."
            className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none"
            style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)', fontFamily: 'monospace' }}
          />
        </div>
        <button
          onClick={generateName}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
          style={{ boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)' }}
        >
          <Shuffle size={18} className={isGenerating ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
};

export default NameInput;