import React, { useEffect, useRef } from 'react';

const AtomicStarfield = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Make canvas fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Star properties
    const stars = [];
    const starCount = 200; // Number of stars
    const starColors = [
      '#ffffff', // White
      '#ffffaa', // Yellow-white
      '#aaddff', // Blue-white
      '#ffcccc', // Red-white
      '#66ccff', // Bright blue
      '#ff9966'  // Orange
    ];
    
    // Create stars with random positions and properties
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3, // Smaller radius for pinpoint stars
        color: starColors[Math.floor(Math.random() * starColors.length)],
        velocity: Math.random() * 0.05 + 0.01,
        twinkle: {
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.05,
          min: 0.3 + Math.random() * 0.2,
          max: 0.7 + Math.random() * 0.3
        },
        pulse: Math.random() > 0.9 // 10% of stars will pulse
      });
    }
    
    // Add occasional "atomic orbital" effects
    const orbitalEffects = [];
    for (let i = 0; i < 3; i++) {
      orbitalEffects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50 + Math.random() * 30,
        particleCount: 5 + Math.floor(Math.random() * 3),
        particles: [],
        rotation: Math.random() * 0.01 - 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
    
    // Initialize orbital particles
    orbitalEffects.forEach(orbit => {
      for (let i = 0; i < orbit.particleCount; i++) {
        const angle = (i / orbit.particleCount) * Math.PI * 2;
        orbit.particles.push({
          angle,
          radius: orbit.radius * (0.9 + Math.random() * 0.2)
        });
      }
    });
    
    // Animation function
    const animate = () => {
      // Create subtle blue-black gradient for space
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#040714');
      gradient.addColorStop(0.5, '#061025');
      gradient.addColorStop(1, '#040714');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars with twinkling effect
      const time = Date.now() / 1000;
      
      stars.forEach(star => {
        // Calculate opacity for twinkling effect
        const twinkleAmount = star.twinkle.min + (Math.sin(time * star.twinkle.speed + star.twinkle.phase) + 1) / 2 * (star.twinkle.max - star.twinkle.min);
        
        // Draw simple star dots
        ctx.globalAlpha = twinkleAmount;
        ctx.beginPath();
        ctx.arc(
          star.x, 
          star.y, 
          star.radius * (star.pulse ? (0.7 + Math.sin(time * 2) * 0.3) : 1), 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = star.color;
        ctx.fill();
        
        ctx.globalAlpha = 1.0;
        
        // Move star slightly for subtle drift effect
        star.y += star.velocity;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      // Draw orbital effects
      orbitalEffects.forEach(orbit => {
        // Update particle positions
        orbit.particles.forEach(particle => {
          particle.angle += orbit.rotation;
        });
        
        // Draw faint orbital path
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(orbit.x, orbit.y, orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = orbit.color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Draw orbital particles
        orbit.particles.forEach(particle => {
          const x = orbit.x + Math.cos(particle.angle) * particle.radius;
          const y = orbit.y + Math.sin(particle.angle) * particle.radius;
          
          // Draw simple particle dot
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = orbit.color;
          ctx.fill();
          
          // Add trail effect
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - Math.cos(particle.angle) * 8, y - Math.sin(particle.angle) * 8);
          ctx.strokeStyle = orbit.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        
        ctx.globalAlpha = 1.0;
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    const animationId = animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: -10
      }}
    />
  );
};

export default AtomicStarfield;