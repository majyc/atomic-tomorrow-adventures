import React, { useEffect } from 'react';

/**
 * RetroTerminalInput - A component for text inputs with authentic VT323 CRT styling
 * Fixed version with no blinking text, only cursor blinks when focused
 * 
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of rows for textarea (if multiline)
 * @param {boolean} props.multiline - Whether to render a textarea instead of input
 * @param {string} props.type - Input type (text, number, etc.)
 */
const RetroTerminalInput = ({ 
  value, 
  onChange, 
  placeholder = '', 
  rows = 3, 
  multiline = false,
  type = 'text'
}) => {
  // Ensure VT323 font is loaded
  useEffect(() => {
    // Create a link element for the Google Fonts stylesheet
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
    link.rel = 'stylesheet';
    
    // Add it to the document head
    document.head.appendChild(link);
    
    // Clean up on unmount
    return () => {
      // Only remove if it's the one we added (to avoid conflicts)
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // CRT effect styles
  const crtStyles = {
    container: {
      position: 'relative',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.4)',
      border: '2px solid #14532d',
      backgroundColor: '#0a0a0a',
      borderRadius: '0.375rem',
      overflow: 'hidden'
    },
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
    input: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: 'transparent',
      color: '#4ade80',
      position: 'relative',
      zIndex: 10,
      outline: 'none',
      resize: 'none',
      fontFamily: '"VT323", monospace',
      fontSize: '1.125rem',
      letterSpacing: '0.05em',
      textShadow: '0 0 5px rgba(74, 222, 128, 0.7)'
    }
  };

  // Common input props
  const inputProps = {
    value,
    onChange: (e) => {
      // Make sure we're properly passing the event through
      onChange(e);
    },
    placeholder,
    style: crtStyles.input,
    className: "retro-terminal-input"
  };

  return (
    <div style={crtStyles.container}>
      <style>{`
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        
        /* Only cursor blinks, not text */
        .retro-terminal-input {
          caret-color: #4ade80;
        }
        
        .retro-terminal-input::placeholder {
          color: rgba(74, 222, 128, 0.4);
          font-family: "VT323", monospace;
        }
        
        .retro-terminal-input:focus {
          outline: none;
        }
      `}</style>
      <div style={crtStyles.scanline}></div>
      {multiline ? (
        <textarea 
          rows={rows}
          {...inputProps}
        />
      ) : (
        <input 
          type={type} 
          {...inputProps}
        />
      )}
    </div>
  );
};

export default RetroTerminalInput;