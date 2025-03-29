import React from 'react';

/**
 * RetroToggleSwitch - A fixed version with proper ON/OFF background
 * @param {Object} props
 * @param {boolean} props.isOn - Whether the switch is on or off
 * @param {Function} props.onToggle - Function to call when the switch is toggled
 * @param {string} props.label - Text to display on the label plate
 * @param {string} props.color - Color theme (green is default for ON)
 */
const RetroToggleSwitch = ({ isOn = false, onToggle, label = "Suggestions", color = "green" }) => {
  // Get ON color theme based on the color prop
  const getOnColorScheme = () => {
    switch (color) {
      case 'blue':
        return {
          primary: '#1e40af',
          light: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.8)'
        };
      case 'purple':
        return {
          primary: '#581c87',
          light: '#c084fc',
          glow: 'rgba(192, 132, 252, 0.8)'
        };
      default: // green
        return {
          primary: '#166534',
          light: '#4ade80',
          glow: 'rgba(74, 222, 128, 0.8)'
        };
    }
  };
  
  // OFF color is always red
  const offColor = {
    primary: '#991b1b',
    light: '#f87171',
    glow: 'rgba(248, 113, 113, 0.8)'
  };
  
  const onColor = getOnColorScheme();
  
  // Switch dimensions
  const width = 70;
  const height = 30;
  
  return (
    <div className="flex flex-col items-center">
      {/* Label plate above switch */}
      <div 
        className="px-3 py-1 rounded mb-2 text-xs font-mono flex items-center justify-center w-full"
        style={{
          backgroundColor: '#1a1a1a',
          color: '#d1d5db',
          border: '1px solid #333',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
          textShadow: '0 0 2px rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        <div className="flex items-center">
          {/* Rivets on label plate */}
          <div className="w-1 h-1 bg-gray-500 rounded-full mr-2"></div>
          {label}
          <div className="w-1 h-1 bg-gray-500 rounded-full ml-2"></div>
        </div>
      </div>
      
      {/* Toggle switch */}
      <div
        className="relative cursor-pointer"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          borderRadius: '999px',
          padding: '3px',
          backgroundColor: '#111827',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5), inset 0 1px 3px rgba(0, 0, 0, 0.5)'
        }}
        onClick={onToggle}
      >
        {/* ON/OFF Background - fixed position */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            borderRadius: '999px'
          }}
        >
          {/* Left half - ON state */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center"
            style={{
              backgroundColor: onColor.primary,
              boxShadow: isOn ? `0 0 8px ${onColor.glow}` : 'none'
            }}
          >
            <span 
              className="text-[10px] font-bold text-white"
              style={{
                textShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              ON
            </span>
          </div>
          
          {/* Right half - OFF state */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center"
            style={{
              backgroundColor: offColor.primary,
              boxShadow: !isOn ? `0 0 8px ${offColor.glow}` : 'none'
            }}
          >
            <span 
              className="text-[10px] font-bold text-white"
              style={{
                textShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              OFF
            </span>
          </div>
        </div>
        
        {/* Knob/Handle */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{
            width: `${height - 6}px`,
            height: `${height - 6}px`,
            left: isOn ? `${width - height + 3}px` : '3px',
            backgroundColor: '#e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
            zIndex: 10,
            background: 'radial-gradient(circle at 40% 40%, #f9fafb, #9ca3af)'
          }}
        >
          {/* Shine reflection */}
          <div 
            className="absolute top-1/4 left-1/4 w-1/4 h-1/4 rounded-full"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RetroToggleSwitch;