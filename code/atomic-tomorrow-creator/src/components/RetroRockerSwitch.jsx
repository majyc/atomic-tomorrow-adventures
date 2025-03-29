import React from 'react';

/**
 * RetroRockerSwitch - A retro-styled rocker switch with label plate
 * Designed to look like vintage airplane or control panel switches
 * 
 * @param {Object} props
 * @param {boolean} props.isOn - Whether the switch is on or off
 * @param {Function} props.onToggle - Function to call when the switch is toggled
 * @param {string} props.label - Text to display on the label plate
 * @param {string} props.color - Color theme (blue, green, red, purple, etc.)
 * @param {string} props.onLabel - Text to display for the ON position
 * @param {string} props.offLabel - Text to display for the OFF position
 */
const RetroRockerSwitch = ({ 
  isOn = false, 
  onToggle, 
  label = "Switch", 
  color = "blue",
  onLabel = "ON",
  offLabel = "OFF"
}) => {
  // Get color theme based on the color prop
  const getColorScheme = () => {
    switch (color) {
      case 'green':
        return {
          primary: '#166534',
          light: '#4ade80',
          glow: 'rgba(74, 222, 128, 0.8)',
          plate: '#0f332d',
          accent: '#14532d'
        };
      case 'red':
        return {
          primary: '#991b1b',
          light: '#f87171',
          glow: 'rgba(248, 113, 113, 0.8)',
          plate: '#331f1f',
          accent: '#7f1d1d'
        };
      case 'purple':
        return {
          primary: '#581c87',
          light: '#c084fc',
          glow: 'rgba(192, 132, 252, 0.8)',
          plate: '#2e1f33',
          accent: '#4c1d95'
        };
      case 'indigo':
        return {
          primary: '#3730a3',
          light: '#a5b4fc',
          glow: 'rgba(165, 180, 252, 0.8)',
          plate: '#1e1b4b',
          accent: '#312e81'
        };
      case 'yellow':
        return {
          primary: '#854d0e',
          light: '#facc15',
          glow: 'rgba(250, 204, 21, 0.8)',
          plate: '#332c1c',
          accent: '#713f12'
        };
      default: // blue
        return {
          primary: '#1e40af',
          light: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.8)',
          plate: '#1e273a',
          accent: '#1e3a8a'
        };
    }
  };
  
  const colors = getColorScheme();
  
  return (
    <div className="flex items-center space-x-4">
      {/* Label plate */}
      <div 
        className="px-3 py-1 rounded text-sm font-mono flex items-center justify-center"
        style={{
          backgroundColor: colors.plate,
          color: colors.light,
          border: `1px solid ${colors.accent}`,
          boxShadow: `0 0 5px ${colors.glow}, inset 0 2px 5px rgba(0, 0, 0, 0.5)`,
          minWidth: '100px',
          textShadow: `0 0 5px ${colors.glow}`
        }}
      >
        {label}
      </div>
      
      {/* Rocker switch */}
      <div 
        className="relative cursor-pointer"
        style={{
          width: '50px',
          height: '30px',
          backgroundColor: '#111827',
          borderRadius: '4px',
          border: `2px solid #374151`,
          boxShadow: `0 2px 4px rgba(0, 0, 0, 0.4), inset 0 2px 2px rgba(0, 0, 0, 0.5)`,
          overflow: 'hidden'
        }}
        onClick={onToggle}
      >
        {/* Switch housing */}
        <div 
          className="absolute inset-0"
          style={{
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          {/* Top position (OFF) */}
          <div 
            className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              backgroundColor: isOn ? '#1f2937' : colors.primary,
              color: isOn ? 'rgba(255, 255, 255, 0.5)' : colors.light,
              transform: isOn ? 'translateY(-30%)' : 'translateY(0)',
              boxShadow: isOn ? 'none' : `0 0 8px ${colors.glow}, inset 0 -1px 3px rgba(0, 0, 0, 0.3)`,
              textShadow: isOn ? 'none' : `0 0 3px ${colors.glow}`,
              zIndex: isOn ? 0 : 1
            }}
          >
            {offLabel}
          </div>
          
          {/* Bottom position (ON) */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              backgroundColor: isOn ? colors.primary : '#1f2937',
              color: isOn ? colors.light : 'rgba(255, 255, 255, 0.5)',
              transform: isOn ? 'translateY(0)' : 'translateY(30%)',
              boxShadow: isOn ? `0 0 8px ${colors.glow}, inset 0 1px 3px rgba(0, 0, 0, 0.3)` : 'none',
              textShadow: isOn ? `0 0 3px ${colors.glow}` : 'none',
              zIndex: isOn ? 1 : 0
            }}
          >
            {onLabel}
          </div>
        </div>
        
        {/* Switch shadow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.7)'
          }}
        />
        
        {/* Metal rivets */}
        <div 
          className="absolute top-2 left-2 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #d1d5db, #6b7280)'
          }}
        />
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #d1d5db, #6b7280)'
          }}
        />
        <div 
          className="absolute bottom-2 left-2 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #d1d5db, #6b7280)'
          }}
        />
        <div 
          className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #d1d5db, #6b7280)'
          }}
        />
      </div>
    </div>
  );
};

export default RetroRockerSwitch;