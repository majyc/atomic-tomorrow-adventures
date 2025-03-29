import React from 'react';

/**
 * Gender Selector Component
 * Uses the same atomic-button styling as the original PortraitSelector
 */
const GenderSelector = ({ selectedGender, onSelectGender }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-blue-900 flex items-center justify-center mb-4">
      {/* Retro-atomic control panel styling */}
      <style>{`
        /* Button styling */
        .atomic-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #b91c1c;
          border: 4px solid #9ca3af;
          position: relative;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .atomic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 45%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50% 50% 0 0;
          pointer-events: none;
        }
        
        .atomic-button.pressed {
          background-color: #7f1d1d;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.5);
          transform: translateY(2px);
        }
        
        /* Button label styling */
        .button-label {
          background-color: #1e293b;
          color: #e2e8f0;
          border: 2px solid #475569;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 12px;
          text-align: center;
          position: relative;
          margin-top: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
          min-width: 70px;
          width: 100%;
        }
        
        /* Rivets on button labels */
        .button-label::before,
        .button-label::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: #64748b;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .button-label::before {
          left: 3px;
        }
        
        .button-label::after {
          right: 3px;
        }
      `}</style>
      
      <div className="relative flex items-center">
        <div className="flex items-end justify-center w-full space-x-12">
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSelectGender('male')}
              className={`atomic-button ${selectedGender === 'male' ? 'pressed' : ''}`}
            >
              <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>♂</span>
            </button>
            <div className="button-label">Male</div>
          </div>
          
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSelectGender('female')}
              className={`atomic-button ${selectedGender === 'female' ? 'pressed' : ''}`}
            >
              <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>♀</span>
            </button>
            <div className="button-label">Female</div>
          </div>
          
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSelectGender('random')}
              className={`atomic-button ${selectedGender === 'random' ? 'pressed' : ''}`}
            >
              <span className="text-2xl font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.5)', color: '#f1f1f1' }}>?</span>
            </button>
            <div className="button-label">Random</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderSelector;