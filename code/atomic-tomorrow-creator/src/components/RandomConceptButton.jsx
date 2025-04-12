import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';

/**
 * RandomConceptButton Component
 * A retro-styled button that allows quick randomization of all character concept selections
 * 
 * @param {Object} props
 * @param {Function} props.onRandomize - Function to call with randomized concept selections
 */
const RandomConceptButton = ({ onRandomize }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Function to get a random element from an array
  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Handle click with animation and randomization
  const handleRandomize = () => {
    setIsAnimating(true);
    
    // Simulate multiple rolls with a short delay
    let rolls = 0;
    const maxRolls = 8;
    
    const rollInterval = setInterval(() => {
      // Generate random selections on each roll
      const randomEpithet = getRandomElement(EPITHETS);
      const randomProfession = getRandomElement(PROFESSIONS);
      const randomOrigin = getRandomElement(ORIGINS);
      const randomBackground = getRandomElement(BACKGROUNDS);
      
      // Call the onRandomize handler with current random selections
      onRandomize({
        epithet: randomEpithet,
        profession: randomProfession,
        origin: randomOrigin,
        background: randomBackground
      });
      
      rolls++;
      
      // Stop after maxRolls
      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        setIsAnimating(false);
      }
    }, 100);
  };
  
  return (
    <button
      onClick={handleRandomize}
      disabled={isAnimating}
      className="retro-button"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: '#202020',
        color: '#4ade80',
        border: '2px solid #14532d',
        borderRadius: '0.375rem',
        boxShadow: isAnimating 
          ? 'inset 0 2px 5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.8)' 
          : '0 2px 5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(74, 222, 128, 0.6)',
        textShadow: '0 0 5px rgba(74, 222, 128, 0.8)',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        transform: isAnimating ? 'translateY(2px)' : 'translateY(0)',
        overflow: 'hidden'
      }}
    >
      {/* Button content */}
      <Dices size={20} className="mr-2" />
      <span>{isAnimating ? 'RANDOMIZING...' : 'RANDOM CONCEPT'}</span>
      
      {/* Animated glow effect when rolling */}
      {isAnimating && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
            animation: 'pulse 1s infinite'
          }}
        />
      )}
      
      {/* Global styles for animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.8; }
            100% { opacity: 0.2; }
          }
          
          .retro-button:hover:not(:disabled) {
            background-color: #303030;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.8);
          }
          
          .retro-button:active:not(:disabled) {
            transform: translateY(2px);
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(74, 222, 128, 0.6);
          }
          
          .retro-button:disabled {
            opacity: 0.8;
            cursor: not-allowed;
          }
        `}
      </style>
    </button>
  );
};

export default RandomConceptButton;