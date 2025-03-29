import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

/**
 * RetroPushButton - A retro-futuristic button that appears to physically depress when clicked
 * Perfect for randomization/generation actions in the atomic control panel
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {string} props.label - Text label for the button
 * @param {string} props.icon - Icon to use (shuffle or refresh)
 * @param {string} props.color - Color theme (blue, green, red, etc.)
 */
const RetroPushButton = ({ 
  onClick, 
  label = "Generate", 
  icon = "shuffle",
  color = "blue" 
}) => {
  // State for button animation
  const [isPressed, setIsPressed] = useState(false);
  
  // Get color theme based on the color prop
  const getColorScheme = () => {
    switch (color) {
      case 'green':
        return {
          primary: '#166534',
          secondary: '#22c55e',
          light: '#4ade80',
          glow: 'rgba(74, 222, 128, 0.8)',
          dark: '#064e3b'
        };
      case 'red':
        return {
          primary: '#991b1b',
          secondary: '#ef4444',
          light: '#f87171',
          glow: 'rgba(248, 113, 113, 0.8)',
          dark: '#7f1d1d'
        };
      case 'purple':
        return {
          primary: '#581c87',
          secondary: '#a855f7',
          light: '#c084fc',
          glow: 'rgba(192, 132, 252, 0.8)',
          dark: '#4c1d95'
        };
      default: // blue
        return {
          primary: '#1e40af',
          secondary: '#3b82f6',
          light: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.8)',
          dark: '#1e3a8a'
        };
    }
  };
  
  const colors = getColorScheme();
  
  // Handle button click with animation
  const handleClick = () => {
    setIsPressed(true);
    
    // Call the onClick handler
    if (onClick) {
      onClick();
    }
    
    // Reset after animation completes
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
  };
  
  // Get the appropriate icon
  const IconComponent = icon === 'refresh' ? RotateCcw : Shuffle;
  
  return (
    <div className="flex flex-col items-center">
      {/* Button housing with metallic frame */}
      <div 
        className="relative"
        style={{
          width: '90px',
          height: '90px',
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          borderRadius: '8px',
          border: '2px solid #333',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          padding: '5px'
        }}
      >
        {/* Button itself */}
        <button
          onClick={handleClick}
          className="relative w-full h-full rounded-md focus:outline-none transition-all duration-75"
          style={{
            background: isPressed
              ? `linear-gradient(to bottom, ${colors.dark}, ${colors.primary})`
              : `linear-gradient(to bottom, ${colors.secondary}, ${colors.primary})`,
            boxShadow: isPressed
              ? 'inset 0 3px 8px rgba(0, 0, 0, 0.5)'
              : `0 3px 8px rgba(0, 0, 0, 0.3), 0 0 15px ${colors.glow}`,
            transform: isPressed ? 'translateY(3px)' : 'translateY(0)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          <IconComponent 
            size={25} 
            className={`transition-transform ${isPressed ? 'scale-95' : 'scale-100'}`}
            style={{
              filter: `drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))`
            }}
          />
          <span 
            className="mt-1 text-sm font-bold"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {label}
          </span>
          
          {/* Light reflection overlay */}
          <div 
            className="absolute top-0 left-0 right-0 h-1/3 rounded-t-md pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent)',
              opacity: isPressed ? 0.1 : 0.3
            }}
          />
        </button>
        
        {/* Mounting screws */}
        <div 
          className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #9ca3af, #4b5563)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        />
        <div 
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #9ca3af, #4b5563)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        />
        <div 
          className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #9ca3af, #4b5563)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        />
        <div 
          className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #9ca3af, #4b5563)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        />
      </div>
      
      {/* Label plate below button */}
      <div 
        className="mt-2 px-3 py-1 rounded text-xs text-center"
        style={{
          backgroundColor: '#1a1a1a',
          color: '#d1d5db',
          border: '1px solid #333',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
          textShadow: '0 0 2px rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          width: '90px'
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default RetroPushButton;