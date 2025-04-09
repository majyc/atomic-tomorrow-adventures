import React from 'react';
import { Check, BookOpen, Dna, Briefcase, FileText } from 'lucide-react';

const AtomicProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  steps,
  onStepClick,
  isCompleted = false
}) => {
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
  
  // Handler for step click - only go to completed or current steps
  const handleStepClick = (stepNumber) => {
    // Allow clicking to previous steps or current step only
    if (stepNumber <= currentStep && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="py-4 px-2 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-lg border border-blue-900"
         style={{ boxShadow: '0 0 20px rgba(30, 64, 175, 0.4)', overflow: 'hidden' }}>
      <div className="flex items-center justify-between relative">
        {/* Step indicators */}
        <div className="flex items-center justify-between w-full relative z-10">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            // Determine if this step is completed
            const isStepCompleted = idx + 1 < currentStep;
            // For the last step, check if character is completed via props
            const isLastStepCompleted = idx + 1 === totalSteps && isCompleted;
            // Active class
            const isActive = idx + 1 === currentStep && !isLastStepCompleted;
            // Determine if this step can be clicked (current or previous steps)
            const isClickable = idx + 1 <= currentStep;
            
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center" 
                onClick={() => handleStepClick(idx + 1)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative 
                    ${isStepCompleted || isLastStepCompleted ? 'text-green-400 border-green-400' : 
                      isActive ? 'text-blue-400 border-blue-400' : 'text-gray-500 border-gray-500'}`}
                  style={{
                    boxShadow: isStepCompleted || isLastStepCompleted ? '0 0 10px rgba(74, 222, 128, 0.8)' : 
                              isActive ? '0 0 15px rgba(96, 165, 250, 0.8)' : 'none',
                    background: 'rgba(0, 0, 0, 1)'
                  }}
                >
                  {isStepCompleted || isLastStepCompleted ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    getStepIcon(idx + 1)
                  )}
                  
                  {/* Pulsing animation for current step only */}
                  {isActive && (
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
                </div>
                
                <div className="text-center mt-2">
                  <div className={`text-xs font-medium ${
                    isActive ? 'text-blue-400' : 
                    isStepCompleted || isLastStepCompleted ? 'text-green-400' : 
                    'text-gray-500'}`}
                  >
                    Step {idx + 1}
                  </div>
                  <div className={`text-sm ${
                    isActive ? 'text-white font-bold' : 
                    isStepCompleted || isLastStepCompleted ? 'text-green-300' : 
                    'text-gray-400'}`}
                  >
                    {steps[idx]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Container for all the track lines and pulses - with overflow hidden */}
        <div className="absolute top-0 bottom-0 left-0 right-0 z-0" style={{ overflow: 'hidden' }}>
          {/* Base track line - behind the indicators */}
          <div 
            className="absolute h-0.5 bg-gray-700" 
            style={{ 
              top: '20px',
              left: '45px',
              right: '45px'
            }}
          ></div>
          
          {/* Completed track line */}
          {currentStep > 1 && (
            <div 
              className="absolute h-0.5 bg-green-500 transition-all" 
              style={{ 
                top: '20px',
                left: '45px',
                width: `calc(${Math.min(100, ((currentStep - 1) / (totalSteps - 1) * 100))}% - ${currentStep > 2 ? 90 : 45}px)`,
                boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
              }}
            ></div>
          )}
          
          {/* Traveling pulses along the completed path - contained within parent div */}
          {currentStep > 1 && (
            <div className="absolute" style={{ top: '0', left: '0', right: '0', bottom: '0', overflow: 'hidden' }}>
              <div 
                className="traveling-pulse1"
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '4px',
                  top: '18px',
                  left: '45px',
                  borderRadius: '2px',
                  background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(74,222,128,0.3))',
                  boxShadow: '0 0 10px rgba(74,222,128,0.8)',
                  opacity: 0
                }}
              ></div>
              
              <div 
                className="traveling-pulse2"
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '4px',
                  top: '18px',
                  left: '45px',
                  borderRadius: '2px',
                  background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(74,222,128,0.3))',
                  boxShadow: '0 0 10px rgba(74,222,128,0.8)',
                  opacity: 0,
                  animationDelay: '1.5s'
                }}
              ></div>
            </div>
          )}
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
        
        .traveling-pulse1 {
          animation: travel 4s linear infinite;
        }
        
        .traveling-pulse2 {
          animation: travel 4s linear infinite 2s;
        }
        
        @keyframes travel {
          0% {
            left: 45px;
            opacity: 1;
            width: 20px;
          }
          80% {
            opacity: 1;
            width: 15px;
          }
          100% {
            left: calc(${currentStep === 2 ? '25%' : currentStep === 3 ? '50%' : '75%'} - 45px);
            opacity: 0;
            width: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AtomicProgressIndicator;