import React from 'react';

// CSS that should be included in your stylesheet
const starfieldStyles = `
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  opacity: 0.6;
  background-color: transparent;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  opacity: 0.8;
  animation-name: twinkle;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.star.blue {
  background-color: #60a5fa;
  box-shadow: 0 0 3px #60a5fa;
}

.star.large {
  width: 3px;
  height: 3px;
}

.star.falling {
  animation-name: fall;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

@keyframes fall {
  from { transform: translateY(-100px); }
  to { transform: translateY(100vh); }
}
`;

const AtomicStarfield = () => {
  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const isBlue = i % 30 === 0;
      const isLarge = i % 20 === 0;
      const isFalling = i % 50 === 0;
      
      stars.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`
        },
        className: `star ${isBlue ? 'blue' : ''} ${isLarge ? 'large' : ''} ${isFalling ? 'falling' : ''}`
      });
    }
    return stars;
  };

  const stars = generateStars(150);

  return (
    <>
      <style>{starfieldStyles}</style>
      <div className="starfield">
        {stars.map(star => (
          <div 
            key={star.id}
            className={star.className}
            style={star.style}
          />
        ))}
      </div>
    </>
  );
};

export default AtomicStarfield;