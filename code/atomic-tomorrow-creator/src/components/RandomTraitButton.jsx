import React, { useState } from 'react';
import { Dices } from 'lucide-react';

/**
 * RandomTraitButton Component
 * A retro-styled button that randomly selects a trait by "spinning" the knob
 * 
 * @param {Object} props
 * @param {Function} props.onRandomize - Function to call with a random index
 * @param {number} props.maxIndex - Maximum index value (trait count - 1)
 * @param {string} props.color - Color theme (e.g., 'purple', 'indigo')
 */
const RandomTraitButton = ({ onRandomize, maxIndex, color = 'blue' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get color scheme based on the color prop
  const getColorScheme = () => {
    switch (color) {
      case 'purple':
        return {
          primary: '#7e22ce',
          secondary: '#a855f7',
          highlight: '#c084fc',
          text: '#f3e8ff',
          glow: 'rgba(192, 132, 252, 0.8)'
        };
      case 'indigo':
        return {
          primary: '#4338ca',
          secondary: '#6366f1',
          highlight: '#a5b4fc',
          text: '#e0e7ff',
          glow: 'rgba(165, 180, 252, 0.8)'
        };
      case 'green':
        return {
          primary: '#166534',
          secondary: '#22c55e',
          highlight: '#4ade80',
          text: '#dcfce7',
          glow: 'rgba(74, 222, 128, 0.8)'
        };
      default: // blue
        return {
          primary: '#1e40af',
          secondary: '#3b82f6',
          highlight: '#60a5fa',
          text: '#dbeafe',
          glow: 'rgba(96, 165, 250, 0.8)'
        };
    }
  };
  
  const colors = getColorScheme();
  
  // Handle randomization with animation
  const handleRandomize = () => {
    if (isAnimating || maxIndex <= 0) return;
    
    setIsAnimating(true);
    
    // Randomize with animation effect
    let rolls = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
      
      // Call the onRandomize handler with the current random index
      onRandomize(randomIndex);
      
      rolls++;
      
      // Stop after maxRolls
      if (rolls >= maxRolls) {
        clearInterval(interval);
        
        // Final random roll
        const finalRandomIndex = Math.floor(Math.random() * (maxIndex + 1));
        onRandomize(finalRandomIndex);
        
        setIsAnimating(false);
      }
    }, 80); // Slightly faster than the concept randomizer for a different feel
  };
  
  return (
    <button
      onClick={handleRandomize}
      disabled={isAnimating || maxIndex <= 0}
      className="retro-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: '#202020',
        color: colors.highlight,
        border: `2px solid ${colors.primary}`,
        borderRadius: '0.375rem',
        boxShadow: isAnimating 
          ? `inset 0 2px 5px rgba(0, 0, 0, 0.5), 0 0 15px ${colors.glow}` 
          : `0 2px 5px rgba(0, 0, 0, 0.3), 0 0 10px ${colors.glow}`,
        textShadow: `0 0 5px ${colors.glow}`,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        transform: isAnimating ? 'translateY(2px)' : 'translateY(0)'
      }}
      title="Randomly select a trait suggestion"
    >
      <Dices size={16} className="mr-2" />
      <span>{isAnimating ? 'SPINNING...' : 'RANDOM'}</span>
      
      <style>{`
        .retro-button:hover:not(:disabled) {
          background-color: #303030;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 15px ${colors.glow};
        }
        
        .retro-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5), 0 0 10px ${colors.glow};
        }
        
        .retro-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
};

export default RandomTraitButton;