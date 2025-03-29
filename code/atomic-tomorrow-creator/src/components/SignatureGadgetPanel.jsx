import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { GADGET_COMPONENTS, GADGET_EFFECTS } from '../data/descriptions';

// Signature Gadget Panel Component
const SignatureGadgetPanel = ({ character, updateCharacter }) => {
  // State for signature gadget
  const [signatureGadget, setSignatureGadget] = useState(character.signatureGadget || null);
  const [gadgetBaseItem, setGadgetBaseItem] = useState('Pistol');

  // Update character in parent component when signature gadget changes
  useEffect(() => {
    updateCharacter({
      ...character,
      signatureGadget
    });
  }, [signatureGadget]);

  // Generate signature gadget
  const generateSignatureGadget = () => {
    const adjective = GADGET_COMPONENTS.ATOMIC_ADJECTIVES[Math.floor(Math.random() * GADGET_COMPONENTS.ATOMIC_ADJECTIVES.length)];
    const component = GADGET_COMPONENTS.TECHNO_COMPONENTS[Math.floor(Math.random() * GADGET_COMPONENTS.TECHNO_COMPONENTS.length)];
    const designation = GADGET_COMPONENTS.SERIES_DESIGNATIONS[Math.floor(Math.random() * GADGET_COMPONENTS.SERIES_DESIGNATIONS.length)];

    const gadgetName = `${adjective}${component} ${designation} ${gadgetBaseItem}`;

    // Generate effects based on the components
    const effects = generateGadgetEffects(adjective, component, designation);

    setSignatureGadget({
      name: gadgetName,
      baseItem: gadgetBaseItem,
      adjective,
      component,
      designation,
      effects
    });
  };

  // Generate effects for signature gadget
  const generateGadgetEffects = (adjective, component, designation) => {
    const effects = [];

    // Get effects from the data file
    const adjectiveEffect = GADGET_EFFECTS.ADJECTIVE_EFFECTS[adjective] || 
      'Specialized atomic age technology with unique properties.';
    
    const componentEffect = GADGET_EFFECTS.COMPONENT_EFFECTS[component] || 
      'Incorporates advanced atomic-age engineering principles.';
    
    const designationEffect = GADGET_EFFECTS.DESIGNATION_EFFECTS[designation] || 
      'Represents the pinnacle of retro-futuristic engineering.';

    effects.push(adjectiveEffect);
    effects.push(componentEffect);
    effects.push(designationEffect);

    return effects;
  };

  // CRT effect styles
  const crtStyles = {
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
    terminal: {
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.4)',
      border: '2px solid #14532d',
      backgroundColor: '#0a0a0a',
      borderRadius: '0.375rem',
      position: 'relative',
      overflow: 'hidden'
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 border border-purple-900"
         style={{ boxShadow: '0 0 15px rgba(126, 34, 206, 0.4), inset 0 0 10px rgba(126, 34, 206, 0.2)' }}>
      <div className="panel-header text-white py-2 px-4 font-bold flex items-center justify-between"
           style={{ background: 'linear-gradient(to right, #0f172a, #4c1d95, #0f172a)', textShadow: '0 0 10px rgba(192, 132, 252, 0.8)' }}>
        <div>SIGNATURE GADGET</div>

        <div className="flex items-center space-x-2">
          <div className="relative" style={{ ...crtStyles.terminal, border: '2px solid #4c1d95' }}>
            <div style={crtStyles.scanline}></div>
            <input
              type="text"
              value={gadgetBaseItem}
              onChange={(e) => setGadgetBaseItem(e.target.value)}
              placeholder="Base item..."
              className="px-3 py-1 bg-transparent text-purple-400 relative z-10 focus:outline-none"
              style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.7)', fontFamily: 'monospace' }}
            />
          </div>

          <button
            onClick={generateSignatureGadget}
            className="glowing-button px-3 py-1 rounded flex items-center"
            style={{
              backgroundColor: '#3b0764',
              color: '#e9d5ff',
              border: '1px solid #7e22ce',
              boxShadow: '0 0 10px rgba(126, 34, 206, 0.5)',
              textShadow: '0 0 5px rgba(233, 213, 255, 0.8)'
            }}
          >
            <Zap size={16} className="mr-1" />
            Generate
          </button>
        </div>
      </div>

      <div className="p-4">
        {signatureGadget ? (
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-800"
               style={{ boxShadow: 'inset 0 0 15px rgba(126, 34, 206, 0.2)' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center mr-3"
                   style={{ boxShadow: '0 0 10px rgba(126, 34, 206, 0.5)' }}>
                <Zap size={20} className="text-purple-200" />
              </div>
              <h4 className="text-xl font-bold text-purple-400"
                  style={{ textShadow: '0 0 8px rgba(192, 132, 252, 0.7)' }}>
                {signatureGadget.name}
              </h4>
            </div>

            <div className="space-y-3 mt-4 mb-4">
              {signatureGadget.effects.map((effect, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-purple-900 flex-shrink-0 flex items-center justify-center text-purple-200 font-bold text-xs mt-0.5 mr-2"
                       style={{ boxShadow: '0 0 5px rgba(126, 34, 206, 0.5)' }}>
                    {index + 1}
                  </div>
                  <p className="text-sm text-purple-300"
                     style={{ textShadow: '0 0 3px rgba(192, 132, 252, 0.4)' }}>
                    {effect}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSignatureGadget(null)}
                className="text-sm text-purple-400 hover:text-purple-300 hover:underline"
              >
                Generate Another
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-4 rounded-lg text-center"
               style={{ boxShadow: 'inset 0 0 15px rgba(126, 34, 206, 0.2)' }}>
            <p className="text-purple-400" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.6)' }}>
              Generate a unique signature gadget for your character!
            </p>
            <p className="text-sm mt-1 text-purple-300">
              Enter a base item (like "Pistol" or "Scanner") and click Generate.
            </p>
          </div>
        )}

        <div className="mt-4 bg-gray-900 p-3 rounded-lg border border-purple-800">
          <div className="flex items-start">
            <AlertCircle size={18} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-purple-300">
              Your signature gadget is a distinctive piece of atomic-age technology that defines your character's approach to problem-solving. Each gadget has unique properties that provide special abilities during your adventures.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glowing-button {
          transition: all 0.3s ease;
        }
        
        .glowing-button:hover {
          background-color: #4c1d95;
          box-shadow: 0 0 15px rgba(126, 34, 206, 0.7);
        }
        
        .panel-header {
          letter-spacing: 1px;
        }
        
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
      `}</style>
    </div>
  );
};

export default SignatureGadgetPanel;