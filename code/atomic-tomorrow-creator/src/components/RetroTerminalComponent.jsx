import React, { useState, useEffect } from 'react';

const RetroTerminal = ({ 
  text = '',
  typingEffect = true,
  color = 'green',
  blinkCursor = true,
  height = 'auto',
  className = '',
  glitchEffect = false,
  terminalType = 'basic' // 'basic', 'monitor', or 'holographic'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Determine terminal colors based on color prop
  const getTerminalColors = () => {
    switch (color) {
      case 'blue':
        return {
          textColor: '#93c5fd',
          glowColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#1e40af',
          bgColor: '#0c1a36'
        };
      case 'green':
        return {
          textColor: '#4ade80',
          glowColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#14532d',
          bgColor: '#0c2a1c'
        };
      case 'purple':
        return {
          textColor: '#c084fc',
          glowColor: 'rgba(126, 34, 206, 0.8)',
          borderColor: '#581c87',
          bgColor: '#1e1036'
        };
      case 'amber':
        return {
          textColor: '#fbbf24',
          glowColor: 'rgba(217, 119, 6, 0.8)',
          borderColor: '#78350f',
          bgColor: '#261d0f'
        };
      case 'red':
        return {
          textColor: '#f87171',
          glowColor: 'rgba(220, 38, 38, 0.8)',
          borderColor: '#991b1b',
          bgColor: '#2a1414'
        };
      default:
        return {
          textColor: '#4ade80',
          glowColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#14532d',
          bgColor: '#0c2a1c'
        };
    }
  };
  
  const colors = getTerminalColors();
  
  // Get terminal container style based on terminal type
  const getTerminalStyle = () => {
    // Base styles
    let style = {
      position: 'relative',
      overflow: 'hidden',
      height: height,
      backgroundColor: colors.bgColor,
      border: `2px solid ${colors.borderColor}`,
      boxShadow: `0 0 15px ${colors.glowColor}, inset 0 0 10px ${colors.glowColor}`,
      padding: '1rem',
      fontFamily: '"Courier New", monospace',
      color: colors.textColor,
      textShadow: `0 0 5px ${colors.glowColor}`,
      borderRadius: '0.375rem',
    };
    
    // Add specific styles based on terminal type
    switch (terminalType) {
      case 'monitor':
        style = {
          ...style,
          borderRadius: '0.375rem',
          boxShadow: `0 0 20px ${colors.glowColor}, inset 0 0 15px ${colors.glowColor}`,
          border: `4px solid ${colors.borderColor}`,
          padding: '1.5rem 1rem 1rem',
        };
        break;
      case 'holographic':
        style = {
          ...style,
          backgroundColor: `${colors.bgColor}90`, // Add transparency
          backdropFilter: 'blur(4px)',
          boxShadow: `0 0 30px ${colors.glowColor}, inset 0 0 20px ${colors.glowColor}`,
          border: `1px solid ${colors.borderColor}`,
        };
        break;
      default:
        // Use base style
        break;
    }
    
    return style;
  };
  
  // Typing effect
  useEffect(() => {
    if (!typingEffect) {
      setDisplayText(text);
      return;
    }
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Typing speed
    
    return () => clearInterval(interval);
  }, [text, typingEffect]);
  
  // Blinking cursor effect
  useEffect(() => {
    if (!blinkCursor) return;
    
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 700); // Blink rate
    
    return () => clearInterval(interval);
  }, [blinkCursor]);
  
  // Glitch effect animation for text
  const getGlitchAnimation = () => {
    if (!glitchEffect) return {};
    
    return {
      animation: 'textGlitch 3s infinite'
    };
  };
  
  return (
    <div style={getTerminalStyle()} className={className}>
      {/* Scanline effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'scanlines 1s linear infinite'
        }}
      />
      
      {/* Terminal header bar for monitor type */}
      {terminalType === 'monitor' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '0.75rem',
            background: `linear-gradient(to right, ${colors.borderColor}, ${colors.textColor}, ${colors.borderColor})`,
            opacity: 0.7
          }}
        />
      )}
      
      {/* Terminal text content */}
      <pre
        style={{
          margin: 0,
          position: 'relative',
          zIndex: 2,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          ...getGlitchAnimation()
        }}
      >
        {displayText}
        {typingEffect && (
          <span
            style={{
              opacity: cursorVisible ? 1 : 0,
              transition: 'opacity 0.1s',
              color: colors.textColor
            }}
          >
            ▂
          </span>
        )}
      </pre>
      
      <style >{`
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        
        @keyframes textGlitch {
          0% { opacity: 1; transform: translate(0); }
          1% { opacity: 0.8; transform: translate(-2px, 2px); }
          2% { opacity: 1; transform: translate(0); }
          40% { opacity: 1; transform: translate(0); }
          41% { opacity: 0.8; transform: translate(2px, -2px); }
          42% { opacity: 1; transform: translate(0); }
          80% { opacity: 1; transform: translate(0); }
          81% { opacity: 0.8; transform: translate(-1px, 1px); }
          82% { opacity: 1; transform: translate(0); }
          100% { opacity: 1; transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default RetroTerminal;