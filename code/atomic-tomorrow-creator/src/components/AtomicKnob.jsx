import React, { useRef } from 'react';

/**
 * AtomicKnob Component
 * A retro-styled rotary knob control for selecting from a range of values
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current value of the knob
 * @param {Function} props.onChange - Function to call when value changes
 * @param {number} props.steps - Total number of steps/positions for the knob
 * @param {string} props.color - Color theme for the knob (e.g., 'bg-purple-700')
 */
const AtomicKnob = ({ value, onChange, steps, color }) => {
  const knobRef = useRef(null);
  
  // Get color based on the category
  const getColors = () => {
    switch (color) {
      case 'bg-purple-700':
        return {
          primary: '#7e22ce',
          secondary: '#a855f7',
          highlight: '#c084fc',
          text: '#f3e8ff'
        };
      case 'bg-indigo-700':
        return {
          primary: '#4338ca',
          secondary: '#6366f1',
          highlight: '#a5b4fc',
          text: '#e0e7ff'
        };
      case 'bg-blue-700':
        return {
          primary: '#1e40af',
          secondary: '#3b82f6',
          highlight: '#60a5fa',
          text: '#dbeafe'
        };
      case 'bg-green-700':
        return {
          primary: '#166534',
          secondary: '#22c55e',
          highlight: '#4ade80',
          text: '#dcfce7'
        };
      case 'bg-yellow-600':
        return {
          primary: '#854d0e',
          secondary: '#eab308',
          highlight: '#facc15',
          text: '#fef9c3'
        };
      case 'bg-red-700':
        return {
          primary: '#991b1b',
          secondary: '#ef4444',
          highlight: '#f87171',
          text: '#fee2e2'
        };
      default:
        return {
          primary: '#4b5563',
          secondary: '#9ca3af',
          highlight: '#d1d5db',
          text: '#f3f4f6'
        };
    }
  };
  
  const colors = getColors();
  
  // Calculate rotation angle from value - for midnight position (12 o'clock)
  const angle = Math.round((value / (steps - 1)) * 270) - 90;
  
  // Click handler
  const handleMouseDown = (e) => {
    if (!knobRef.current) return;
    
    // Get knob center
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate initial angle in radians and convert to degrees
    const initialX = e.clientX - centerX;
    const initialY = e.clientY - centerY;
    const initialAngleRad = Math.atan2(initialY, initialX);
    let initialAngleDeg = initialAngleRad * (180 / Math.PI);
    
    // Track the cumulative angle change
    let cumulativeAngleChange = 0;
    
    // Store the last angle to calculate deltas
    let lastAngleDeg = initialAngleDeg;
    
    // Store initial value
    const startValue = value;
    
    // Handle mouse move for dragging
    const handleMouseMove = (moveEvent) => {
      // Calculate new angle in radians and convert to degrees
      const newX = moveEvent.clientX - centerX;
      const newY = moveEvent.clientY - centerY;
      const newAngleRad = Math.atan2(newY, newX);
      let newAngleDeg = newAngleRad * (180 / Math.PI);
      
      // Calculate the delta angle (how much it changed since last move)
      let deltaAngleDeg = newAngleDeg - lastAngleDeg;
      
      // Fix for angle wrapping
      if (deltaAngleDeg > 180) deltaAngleDeg -= 360;
      if (deltaAngleDeg < -180) deltaAngleDeg += 360;
      
      // Update cumulative angle change
      cumulativeAngleChange += deltaAngleDeg;
      
      // Map the angle change to a value change
      // 270 degrees = full range of steps
      const valuePerDegree = (steps - 1) / 270;
      const valueChange = Math.round(cumulativeAngleChange * valuePerDegree);
      
      // Calculate the new value
      let newValue = startValue + valueChange;
      
      // Clamp value to valid range
      newValue = Math.max(0, Math.min(steps - 1, newValue));
      
      // Update value if changed
      if (newValue !== value) {
        onChange(newValue);
      }
      
      // Store current angle for next move event
      lastAngleDeg = newAngleDeg;
    };
    
    // Set up cleanup
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };
  
  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    const numTicks = Math.min(steps, 10); // Max 10 ticks for visual clarity
    
    for (let i = 0; i < numTicks; i++) {
      const tickAngle = (i / (numTicks - 1)) * 270;
      const isActive = i <= (value / (steps - 1)) * (numTicks - 1);
      
      ticks.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '10px',
            backgroundColor: isActive ? colors.highlight : '#4b5563',
            transform: `rotate(${tickAngle}deg) translateY(-32px)`,
            transformOrigin: 'bottom center',
            transition: 'background-color 0.2s'
          }}
        />
      );
    }
    
    return ticks;
  };
  
  return (
    <div
      ref={knobRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#111827',
        border: '4px solid #1f2937',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={steps - 1}
      aria-valuenow={value}
      aria-label="Trait selector"
    >
      {/* Tick marks */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {renderTicks()}
      </div>
      
      {/* Inner knob */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          backgroundColor: colors.primary,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />
      
      {/* Indicator line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40%',
          height: '4px',
          backgroundColor: colors.secondary,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'left center',
          borderRadius: '2px'
        }}
      />
      
      {/* Center cap with value */}
      <div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          backgroundColor: '#1f2937',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: colors.text,
          fontSize: '10px',
          fontFamily: 'monospace',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {value + 1}/{steps}
      </div>
    </div>
  );
};

export default AtomicKnob;