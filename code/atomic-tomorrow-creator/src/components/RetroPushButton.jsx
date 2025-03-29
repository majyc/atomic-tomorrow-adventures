import React, { useState } from 'react';

/**
 * RetroPushButton - A retro-futuristic rectangular button with guards that visually depresses
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {string} props.label - Text label for the button
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.color - Color theme (blue, green, red, purple, amber)
 * @param {string} props.size - Size of the button ('sm', 'md', or 'lg')
 */
const RetroPushButton = ({ 
  onClick, 
  label = "Generate",
  icon = null,
  color = "blue",
  size = "md"
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
          glow: 'rgba(74, 222, 128, 0.8)',
          text: '#4ade80'
        };
      case 'red':
        return {
          primary: '#991b1b',
          secondary: '#ef4444',
          glow: 'rgba(248, 113, 113, 0.8)',
          text: '#f87171'
        };
      case 'purple':
        return {
          primary: '#581c87',
          secondary: '#a855f7',
          glow: 'rgba(192, 132, 252, 0.8)',
          text: '#c084fc'
        };
      case 'amber':
        return {
          primary: '#92400e',
          secondary: '#f59e0b',
          glow: 'rgba(251, 191, 36, 0.8)',
          text: '#fbbf24'
        };
      default: // blue
        return {
          primary: '#1e40af',
          secondary: '#3b82f6',
          glow: 'rgba(96, 165, 250, 0.8)',
          text: '#60a5fa'
        };
    }
  };
  
  const colors = getColorScheme();
  
  // Get dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          width: 70,
          height: 28,
          guardWidth: 6,
          fontSize: 10,
          iconSize: 12,
          padding: '4px 8px'
        };
      case 'lg':
        return {
          width: 120,
          height: 48,
          guardWidth: 12,
          fontSize: 16,
          iconSize: 22,
          padding: '10px 16px'
        };
      default: // md
        return {
          width: 90,
          height: 36,
          guardWidth: 8,
          fontSize: 13,
          iconSize: 16,
          padding: '6px 12px'
        };
    }
  };
  
  const dimensions = getDimensions();
  
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
  
  return (
    <div 
      className="relative"
      style={{
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
      }}
    >
      {/* Left guard */}
      <div 
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: dimensions.guardWidth + 'px',
          background: 'linear-gradient(90deg, #1a1a1a, #333)',
          borderRadius: '3px 0 0 3px',
          boxShadow: 'inset -1px 0 1px rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid #444',
          borderLeft: '1px solid #444',
          borderBottom: '1px solid #222',
          zIndex: 1
        }}
      />
      
      {/* Right guard */}
      <div 
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: dimensions.guardWidth + 'px',
          background: 'linear-gradient(90deg, #333, #1a1a1a)',
          borderRadius: '0 3px 3px 0',
          boxShadow: 'inset 1px 0 1px rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid #444',
          borderRight: '1px solid #444',
          borderBottom: '1px solid #222',
          zIndex: 1
        }}
      />
      
      {/* Button housing (background/inset) */}
      <div 
        className="absolute"
        style={{
          left: dimensions.guardWidth + 'px',
          top: '0',
          width: (dimensions.width - (dimensions.guardWidth * 2)) + 'px',
          height: dimensions.height + 'px',
          background: '#131313',
          boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.9)',
          borderTop: '1px solid #0a0a0a',
          borderBottom: '1px solid #333'
        }}
      />
      
      {/* Button itself */}
      <button
        onClick={handleClick}
        className="absolute flex items-center justify-center focus:outline-none transition-all duration-75"
        style={{
          left: dimensions.guardWidth + 'px',
          top: '0',
          width: (dimensions.width - (dimensions.guardWidth * 2)) + 'px',
          height: dimensions.height + 'px',
          padding: dimensions.padding,
          background: isPressed
            ? `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`
            : `linear-gradient(to bottom, ${colors.secondary}, ${colors.primary})`,
          boxShadow: isPressed
            ? 'inset 0 2px 5px rgba(0, 0, 0, 0.5)'
            : `0 0 10px ${colors.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.5)`,
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          color: 'white',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          zIndex: 0,
          fontSize: dimensions.fontSize + 'px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          overflow: 'hidden'
        }}
      >
        {/* Icon and Label */}
        <div 
          className="flex items-center justify-center space-x-1 relative z-10"
          style={{
            transform: isPressed ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 0.1s'
          }}
        >
          {icon && (
            <span 
              className="mr-1"
              style={{
                fontSize: dimensions.iconSize + 'px'
              }}
            >
              {icon}
            </span>
          )}
          <span>{label}</span>
        </div>
        
        {/* Light reflection overlay */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent)',
            opacity: isPressed ? 0.1 : 0.3
          }}
        />
      </button>
    </div>
  );
};

export default RetroPushButton;