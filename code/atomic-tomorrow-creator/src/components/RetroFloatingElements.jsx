import React, { useEffect, useState } from 'react';
import { Atom, Rocket, Zap, Star, RotateCcw } from 'lucide-react';

const RetroFloatingElements = () => {
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
    // Generate random floating elements
    const newElements = [];
    const elementCount = 8; // Number of floating elements
    
    const icons = [
      <Atom size={24} />,
      <Rocket size={24} />,
      <Zap size={24} />,
      <Star size={24} />,
      <RotateCcw size={24} />
    ];
    
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-purple-400',
      'text-yellow-400',
      'text-red-400',
      'text-cyan-400'
    ];
    
    const glows = [
      '0 0 10px rgba(96, 165, 250, 0.8)',
      '0 0 10px rgba(74, 222, 128, 0.8)',
      '0 0 10px rgba(192, 132, 252, 0.8)',
      '0 0 10px rgba(250, 204, 21, 0.8)',
      '0 0 10px rgba(248, 113, 113, 0.8)',
      '0 0 10px rgba(34, 211, 238, 0.8)'
    ];
    
    for (let i = 0; i < elementCount; i++) {
      // Generate random positions
      const top = Math.random() * 90; // 0-90% from top
      const leftOrRight = Math.random() > 0.5;
      const side = leftOrRight ? 'left' : 'right';
      const position = Math.random() * 5; // 0-5% from side
      
      // Random icon and color
      const iconIndex = Math.floor(Math.random() * icons.length);
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      // Animation duration and delay
      const duration = 80 + Math.random() * 60; // 80-140s
      const delay = Math.random() * -40; // -40-0s
      
      // Rotation and size
      const rotation = Math.random() * 360;
      const size = 30 + Math.random() * 20; // 30-50px
      
      newElements.push({
        id: i,
        top,
        side,
        position,
        icon: icons[iconIndex],
        color: colors[colorIndex],
        glow: glows[colorIndex],
        duration,
        delay,
        rotation,
        size
      });
    }
    
    setElements(newElements);
  }, []);
  
  return (
    <>
      {elements.map(element => (
        <div
          key={element.id}
          className={`fixed ${element.color} floating-element`}
          style={{
            top: `${element.top}%`,
            [element.side]: `${element.position}%`,
            transform: `rotate(${element.rotation}deg)`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            filter: `drop-shadow(${element.glow})`,
            animation: `float-horizontal 
              ${element.duration}s 
              ${element.delay}s 
              infinite alternate ease-in-out,
              pulse 3s infinite alternate ease-in-out
            `,
            opacity: 0.6,
            zIndex: -5
          }}
        >
          {element.icon}
        </div>
      ))}
      
      <style>{`
        @keyframes float-horizontal {
          0% {
            transform: translateX(0) rotate(${Math.random() * 360}deg);
          }
          100% {
            transform: translateX(${Math.random() > 0.5 ? '' : '-'}150px) rotate(${Math.random() * 360}deg);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.8;
          }
        }
        
        .floating-element {
          transition: all 0.3s ease;
        }
        
        .floating-element:hover {
          transform: scale(1.5);
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default RetroFloatingElements;