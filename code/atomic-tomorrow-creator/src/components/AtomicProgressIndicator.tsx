import React from 'react';

const AtomicProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="relative py-6">
      {/* Main track */}
      <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 transform -translate-y-1/2 z-0"></div>
      
      {/* Progress fill */}
      <div 
        className="absolute top-1/2 left-0 h-2 bg-blue-600 transform -translate-y-1/2 z-0 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
      
      {/* Step markers */}
      <div className="relative flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = index < currentStep;
          const isCurrent = index === currentStep - 1;
          
          return (
            <div key={index} className="flex flex-col items-center">
              {/* Step circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative
                  ${isCurrent 
                    ? 'bg-blue-600 text-white border-4 border-blue-200' 
                    : isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }
                `}
              >
                {/* Step number */}
                <span className="font-bold">{index + 1}</span>
                
                {/* Atomic decoration for current step */}
                {isCurrent && (
                  <>
                    <div className="absolute w-16 h-16 rounded-full border-4 border-blue-400 opacity-30 animate-ping"></div>
                    <div className="absolute w-4 h-4 rounded-full bg-blue-200 shadow-sm" style={{ top: '-5px', right: '-5px' }}></div>
                    <div className="absolute w-3 h-3 rounded-full bg-blue-200 shadow-sm" style={{ bottom: '-3px', left: '-3px' }}></div>
                  </>
                )}
              </div>
              
              {/* Step label */}
              <div className={`mt-2 text-sm font-medium ${isCurrent ? 'text-blue-700' : isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AtomicProgressIndicator;
