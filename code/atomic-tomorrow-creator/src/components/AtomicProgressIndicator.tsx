import React from 'react';
import { Check, BookOpen, Dna, Briefcase, FileText } from 'lucide-react';

const AtomicProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  // Get the appropriate icon for each step
  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <BookOpen size={18} />;
      case 2: return <Dna size={18} />;
      case 3: return <Briefcase size={18} />;
      case 4: return <FileText size={18} />;
      default: return null;
    }
  };
  
  // Get the color class for a step
  const getStepColorClass = (step) => {
    if (step < currentStep) return 'text-green-400 border-green-400';
    if (step === currentStep) return 'text-blue-400 border-blue-400';
    return 'text-gray-500 border-gray-500';
  };
  
  // Get the glow style for a step
  const getStepGlowStyle = (step) => {
    if (step < currentStep) {
      return { boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)' };
    }
    if (step === currentStep) {
      return { boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)' };
    }
    return {};
  };
  
  // Get the line color
  const getLineColor = (step) => {
    if (step < currentStep) return 'rgba(74, 222, 128, 1)'; 
    return 'rgba(107, 114, 128, 0.6)';
  };
  
  // Custom settings for each connection line
  const getLineSettings = (idx) => {
    // Define custom settings for each connection line
    // width: specific width in pixels or percentage
    // left/right: margin values in pixels
    const customLineSettings = [
      { width: '407px', left:12, right: 42 },   // First connection (between steps 1-2)
      { width: '412px', left: -3, right: 15 },   // Second connection (between steps 2-3)
      { width: '429px', left: 24, right: 0 },   // Third connection (between steps 3-4)
      // Add more as needed for additional steps
    ];
    
    return customLineSettings[idx] || { width: '150px', left: 0, right: 0 };
  };

  return (
    <div className="py-4 px-2 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-lg border border-blue-900"
         style={{ boxShadow: '0 0 20px rgba(30, 64, 175, 0.4)' }}>
      <div className="flex items-center justify-between relative">
        {/* Connecting lines with traveling spark effects */}
        <div className="absolute top-5 left-0 right-0 flex justify-center z-0">
          {Array.from({ length: totalSteps - 1 }).map((_, idx) => {
            const isCompleted = idx + 1 < currentStep;
            const lineSettings = getLineSettings(idx);
            
            return (
              <div 
                key={idx}
                className="line-container"
                style={{
                  width: lineSettings.width,
                  marginLeft: `${lineSettings.left}px`,
                  marginRight: `${lineSettings.right}px`,
                  height: '4px',
                  position: 'relative',
                  borderRadius: '2px',
                  backgroundColor: isCompleted ? 'rgba(74, 222, 128, 0.15)' : 'rgba(75, 85, 99, 0.1)',
                  boxShadow: isCompleted ? '0 0 8px rgba(74, 222, 128, 0.4)' : 'none'
                }}
              >
                {/* Base line */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: getLineColor(idx + 1),
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* Traveling spark effect */}
                {isCompleted && (
                  <>
                    <div 
                      className="traveling-spark"
                      style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        boxShadow: '0 0 10px rgba(74, 222, 128, 1), 0 0 20px rgba(74, 222, 128, 0.8)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        animationDelay: `${idx * 0.25}s`,
                        opacity: 0.9
                      }}
                    />
                    <div 
                      className="spark-trail"
                      style={{
                        position: 'absolute',
                        width: '15px',
                        height: '3px',
                        borderRadius: '4px',
                        background: 'linear-gradient(to right, rgba(74, 222, 128, 1), transparent)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        animationDelay: `${idx * 0.25}s`
                      }}
                    />
                    
                    {/* Additional subtle energy pulses */}
                    <div 
                      className="energy-pulse"
                      style={{
                        position: 'absolute',
                        height: '2px',
                        background: 'linear-gradient(to right, transparent, rgba(74, 222, 128, 0.8), transparent)',
                        top: '50%',
                        left: '20%',
                        width: '60%',
                        transform: 'translateY(-50%)',
                        animationDelay: `${idx * 0.25 + 0.5}s`,
                        opacity: 0.6
                      }}
                    />
                    <div 
                      className="energy-pulse"
                      style={{
                        position: 'absolute',
                        height: '2px',
                        background: 'linear-gradient(to right, transparent, rgba(74, 222, 128, 0.8), transparent)',
                        top: '50%',
                        left: '10%',
                        width: '50%',
                        transform: 'translateY(-50%)',
                        animationDelay: `${idx * 0.25 + 1.2}s`,
                        opacity: 0.5
                      }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center justify-between w-full relative z-10">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative ${getStepColorClass(idx + 1)}`}
                style={{
                  ...getStepGlowStyle(idx + 1),
                  background: idx + 1 < currentStep ? 'rgba(74, 222, 128, 0.2)' : 
                             idx + 1 === currentStep ? 'rgba(96, 165, 250, 0.2)' : 
                             'rgba(0, 0, 0, 0.3)'
                }}
              >
                {idx + 1 < currentStep ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  getStepIcon(idx + 1)
                )}
                
                {/* Pulsing animation for current step only */}
                {idx + 1 === currentStep && (
                  <div 
                    className="pulse-ring"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      right: '-4px',
                      bottom: '-4px',
                      borderRadius: '50%',
                      border: '2px solid rgba(96, 165, 250, 0.8)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                
                {/* Completed step inner glow */}
                {idx + 1 < currentStep && (
                  <div 
                    style={{ 
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, rgba(74, 222, 128, 0.1) 70%, transparent 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
              </div>
              
              <div className="text-center mt-2">
                <div className={`text-xs font-medium ${
                  idx + 1 === currentStep ? 'text-blue-400' : 
                  idx + 1 < currentStep ? 'text-green-400' : 
                  'text-gray-500'}`}
                >
                  Step {idx + 1}
                </div>
                <div className={`text-sm ${
                  idx + 1 === currentStep ? 'text-white font-bold' : 
                  idx + 1 < currentStep ? 'text-green-300' : 
                  'text-gray-400'}`}
                >
                  {steps[idx]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }
        
        .traveling-spark {
          animation: travelSpark 2s linear infinite;
        }
        
        .spark-trail {
          animation: travelSpark 2s linear infinite;
        }
        
        .energy-pulse {
          animation: pulseFade 3s ease-in-out infinite;
        }
        
        @keyframes travelSpark {
          0% {
            left: -10px;
          }
          100% {
            left: calc(100% + 10px);
          }
        }
        
        @keyframes pulseFade {
          0% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.7);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-50%) scaleX(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default AtomicProgressIndicator;