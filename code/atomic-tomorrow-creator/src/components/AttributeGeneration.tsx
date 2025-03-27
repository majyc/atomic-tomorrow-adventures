import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowRight, Info, AlertCircle, RotateCcw, Zap } from 'lucide-react';

// Value object interface for typed array values
interface ValueObject {
  value: number;
  position: number;
}

// Revised Attribute Generation Screen with CRT/Terminal styling
const AttributeGeneration = ({ character, updateCharacter }) => {
  // State for attribute values
  const [attributes, setAttributes] = useState({
    BRAWN: character.attributes.BRAWN || 10,
    REFLEX: character.attributes.REFLEX || 10,
    NERVE: character.attributes.NERVE || 10,
    SAVVY: character.attributes.SAVVY || 10,
    CHARM: character.attributes.CHARM || 10,
    GRIT: character.attributes.GRIT || 10,
    GUILE: character.attributes.GUILE || 10
  });
  
  // For all origins: Generate attribute values with positions
  const [generatedValues, setGeneratedValues] = useState<ValueObject[]>([]);
  
  // For attribute assignments - track the value
  const [assignedValues, setAssignedValues] = useState<Record<string, number>>({});
  
  // For attribute assignments - track the position of the assigned value
  const [assignedPositions, setAssignedPositions] = useState<Record<string, number>>({});
  
  // Track animation effects
  const [isRolling, setIsRolling] = useState(false);
  const [rollingAttribute, setRollingAttribute] = useState(null);
  
  // Modified attributes after Origin modifiers
  const [modifiedAttributes, setModifiedAttributes] = useState({...attributes});
  
  // Determine if the character is Terran
  const isTerran = character.origin?.id === 'terran';
  
  // Standard Array for Terrans
  const standardArray = [15, 14, 12, 11, 10, 9, 8];
  
  // Create typed standardArrayWithPositions
  const standardArrayWithPositions: ValueObject[] = standardArray.map((value, index) => ({
    value,
    position: index
  }));

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
    },
    greenText: {
      color: '#4ade80',
      textShadow: '0 0 8px rgba(0, 255, 0, 0.9), 0 0 15px rgba(0, 255, 0, 0.7)',
      fontFamily: 'monospace'
    }
  };
  
  // Effect to apply origin modifiers to attributes
  useEffect(() => {
    if (character.origin) {
      // Get origin modifiers
      const modifiers = getOriginModifiers(character.origin.id);
      
      // Calculate the modified attributes
      const newModifiedAttributes = {...attributes};
      Object.keys(modifiers).forEach(attr => {
        newModifiedAttributes[attr] = Math.max(3, Math.min(18, attributes[attr] + modifiers[attr]));
      });
      
      setModifiedAttributes(newModifiedAttributes);
      
      // Update parent component
      updateCharacter({
        ...character,
        attributes: newModifiedAttributes
      });
    }
  }, [attributes, character.origin]);
  
  // Helper function to get origin modifiers
  const getOriginModifiers = (originId) => {
    // This would come from a data source in a real app
    const modifierMap = {
      'terran': { SAVVY: 1, GRIT: -1 },
      'loonie': { BRAWN: -1, REFLEX: 1, GUILE: 1 },
      'martian': { BRAWN: 1, GRIT: 1, CHARM: -1 },
      'belter': { BRAWN: -1, GUILE: 1, GRIT: 1 },
      // Add other origins here
    };
    
    return modifierMap[originId] || {};
  };
  
  // Generate all attribute values at once for non-Terrans
  const generateAllValues = () => {
    setIsRolling(true);
    
    // Simulate rolling animation
    let rollCount = 0;
    const interval = setInterval(() => {
      const newValues: ValueObject[] = [];
      for (let i = 0; i < 7; i++) {
        const die1 = Math.floor(Math.random() * 10) + 1;
        const die2 = Math.floor(Math.random() * 10) + 1;
        newValues.push({
          value: Math.max(3, Math.min(18, die1 + die2)),
          position: i
        });
      }
      // Sort by value in descending order but maintain position property
      setGeneratedValues([...newValues].sort((a, b) => b.value - a.value));
      
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };
  
  // Reset assignments
  const resetAssignments = () => {
    setAssignedValues({});
    setAssignedPositions({});
    setAttributes({
      BRAWN: 10,
      REFLEX: 10,
      NERVE: 10,
      SAVVY: 10,
      CHARM: 10,
      GRIT: 10,
      GUILE: 10
    });
  };
  
  // Assign a value to an attribute - updated to handle positions
  const assignValueToAttribute = (attribute: string, valueObj: ValueObject) => {
    // If clicking on a value that's already assigned to this attribute, unassign it
    if (assignedPositions[attribute] === valueObj.position) {
      setAssignedPositions(prev => {
        const newPositions = {...prev};
        delete newPositions[attribute];
        return newPositions;
      });
      
      setAssignedValues(prev => {
        const newValues = {...prev};
        delete newValues[attribute];
        return newValues;
      });
      
      // Reset the attribute value to default
      setAttributes(prev => ({
        ...prev,
        [attribute]: 10
      }));
      
      return;
    }
    
    // Otherwise, assign the value to this attribute
    setAssignedPositions(prev => ({
      ...prev,
      [attribute]: valueObj.position
    }));
    
    setAssignedValues(prev => ({
      ...prev,
      [attribute]: valueObj.value
    }));
    
    // Update the attributes state
    setAttributes(prev => ({
      ...prev,
      [attribute]: valueObj.value
    }));
  };
  
  // Revised isValueAvailable function that checks positions rather than values
  const isValueAvailable = (valueObj: ValueObject) => {
    // A position is available if it's not assigned to any attribute
    return !Object.values(assignedPositions).includes(valueObj.position);
  };
  
  // Format attribute name with description
  const getAttributeDescription = (attribute) => {
    const descriptions = {
      BRAWN: "Physical strength and toughness",
      REFLEX: "Agility and reaction speed",
      NERVE: "Mental composure and courage",
      SAVVY: "Intelligence and perception",
      CHARM: "Charisma and persuasiveness",
      GRIT: "Endurance and willpower",
      GUILE: "Cunning and deception"
    };
    
    return descriptions[attribute] || "";
  };
  
  // Initialize with empty array and generate values if non-Terran
  useEffect(() => {
    if (!isTerran && generatedValues.length === 0) {
      generateAllValues();
    }
  }, [character.origin]);
  
  // Get attribute color based on value
  const getAttributeColor = (value) => {
    if (value >= 14) return "text-green-500";
    if (value >= 12) return "text-green-400";
    if (value >= 9) return "text-blue-400";
    if (value >= 7) return "text-yellow-400";
    return "text-red-400";
  };

  // Get attribute glow based on value
  const getAttributeGlow = (value) => {
    if (value >= 14) return "0 0 10px rgba(34, 197, 94, 0.9)";
    if (value >= 12) return "0 0 10px rgba(74, 222, 128, 0.9)";
    if (value >= 9) return "0 0 10px rgba(96, 165, 250, 0.9)";
    if (value >= 7) return "0 0 10px rgba(250, 204, 21, 0.9)";
    return "0 0 10px rgba(248, 113, 113, 0.9)";
  };
  
  // Render attribute row with different UI based on origin
  const renderAttributeRow = (attribute) => {
    const originModifier = getOriginModifiers(character.origin?.id)[attribute] || 0;
    const description = getAttributeDescription(attribute);
    
    return (
      <div className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors">
        <div className="w-1/4">
          <div className="font-bold text-blue-400" style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.7)' }}>
            {attribute}
          </div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
        
        <div className="w-1/2">
          <div className="flex flex-wrap gap-2">
            {/* Value selectors - different for Terrans vs non-Terrans */}
            {isTerran ? (
              // Terran: Select from standard array
              standardArrayWithPositions.map(valueObj => (
                <button
                  key={valueObj.position}
                  onClick={() => assignValueToAttribute(attribute, valueObj)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${assignedPositions[attribute] === valueObj.position 
                      ? 'bg-blue-600 text-white' 
                      : isValueAvailable(valueObj)
                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 border border-blue-600' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600'}
                    font-bold transition-colors`}
                  style={{
                    boxShadow: assignedPositions[attribute] === valueObj.position ? '0 0 10px rgba(37, 99, 235, 0.8)' : 'none'
                  }}
                  disabled={!isValueAvailable(valueObj) && assignedPositions[attribute] !== valueObj.position}
                >
                  {valueObj.value}
                </button>
              ))
            ) : (
              // Non-Terran: Select from generated values
              generatedValues.map(valueObj => (
                <button
                  key={valueObj.position}
                  onClick={() => assignValueToAttribute(attribute, valueObj)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${assignedPositions[attribute] === valueObj.position 
                      ? 'bg-blue-600 text-white' 
                      : isValueAvailable(valueObj)
                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 border border-blue-600' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600'}
                    font-bold transition-colors`}
                  style={{
                    boxShadow: assignedPositions[attribute] === valueObj.position ? '0 0 10px rgba(37, 99, 235, 0.8)' : 'none'
                  }}
                  disabled={!isValueAvailable(valueObj) && assignedPositions[attribute] !== valueObj.position}
                >
                  {valueObj.value}
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className={`w-12 h-12 rounded-full ${assignedValues[attribute] ? 'bg-gray-800 border-2 border-blue-600' : 'bg-gray-800 border-2 border-gray-600'} flex items-center justify-center text-xl font-bold`}
                 style={{
                   boxShadow: assignedValues[attribute] ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
                   color: assignedValues[attribute] ? '#93c5fd' : '#6b7280',
                   textShadow: assignedValues[attribute] ? '0 0 5px rgba(147, 197, 253, 0.8)' : 'none'
                 }}>
              {assignedValues[attribute] || '?'}
            </div>
            
            {originModifier !== 0 && (
              <>
                <ArrowRight size={20} className="text-green-400" />
                <div className={`w-12 h-12 rounded-full bg-gray-800 border-2 border-green-600 flex items-center justify-center text-xl font-bold relative ${rollingAttribute === attribute ? 'animate-pulse' : ''}`}
                     style={{
                       boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)',
                       color: '#4ade80',
                       textShadow: '0 0 5px rgba(74, 222, 128, 0.8)'
                     }}>
                  {assignedValues[attribute] ? (Math.max(3, Math.min(18, assignedValues[attribute] + originModifier))) : '?'}
                  {originModifier > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full text-xs flex items-center justify-center font-bold"
                                               style={{ boxShadow: '0 0 8px rgba(22, 163, 74, 0.8)' }}>+{originModifier}</span>}
                  {originModifier < 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs flex items-center justify-center font-bold"
                                               style={{ boxShadow: '0 0 8px rgba(220, 38, 38, 0.8)' }}>{originModifier}</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 p-5 rounded-xl">
      <style>{`
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes textFlicker {
          0% { opacity: 0.94; }
          5% { opacity: 1; }
          10% { opacity: 0.98; }
          15% { opacity: 0.94; }
          20% { opacity: 0.99; }
          25% { opacity: 1; }
          30% { opacity: 0.98; }
          35% { opacity: 0.96; }
          40% { opacity: 1; }
          45% { opacity: 0.99; }
          50% { opacity: 0.98; }
          55% { opacity: 1; }
          60% { opacity: 0.97; }
          65% { opacity: 0.99; }
          70% { opacity: 1; }
          75% { opacity: 0.99; }
          80% { opacity: 0.99; }
          85% { opacity: 0.99; }
          90% { opacity: 1; }
          95% { opacity: 0.99; }
          100% { opacity: 1; }
        }
        .terminal-text {
          color: #4ade80;
          text-shadow: 0 0 10px rgba(51, 255, 51, 0.9), 0 0 15px rgba(51, 255, 51, 0.6);
          animation: textFlicker 0.01s infinite;
          font-family: monospace;
        }
        .attribute-glow {
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.8), inset 0 0 10px rgba(0, 255, 0, 0.4);
        }
      `}</style>

      <h2 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.6)' }}>
        STEP 2: ASSIGN ATTRIBUTES
      </h2>
      
      {/* Origin-specific instructions */}
      <div className="bg-gray-800 p-4 rounded-lg border border-green-900 mb-6 relative overflow-hidden"
           style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.2)' }}>
        {/* Scanline effect overlay */}
        <div style={crtStyles.scanline}></div>
        
        <div className="flex items-start relative z-10">
          <AlertCircle size={20} className="text-green-400 mr-2 mt-1 flex-shrink-0" 
                       style={{ filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.8))' }} />
          <div>
            <h3 className="font-bold text-green-400 terminal-text">
              ATTRIBUTE ASSIGNMENT FOR {character.origin?.name.toUpperCase() || 'CHARACTER'}
            </h3>
            {isTerran ? (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                As a Terran, you must distribute the Standard Array values (15, 14, 12, 11, 10, 9, 8) among your attributes. 
                Click on a value to assign it to an attribute.
              </p>
            ) : (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                As a {character.origin?.name || 'non-Terran'}, you have the flexibility to assign the generated values 
                to your attributes as you see fit. Click on a value to assign it to an attribute.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Roll controls for non-Terrans */}
      {!isTerran && (
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-400" 
              style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.7)' }}>
            GENERATED ATTRIBUTE VALUES:
          </h3>
          <div className="flex gap-2">
            <button
              onClick={resetAssignments}
              className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 hover:border-gray-500"
              disabled={isRolling}
              style={{ textShadow: '0 0 5px rgba(209, 213, 219, 0.5)' }}
            >
              <RotateCcw size={16} className="mr-2" />
              RESET
            </button>
            <button
              onClick={generateAllValues}
              className="flex items-center px-4 py-2 bg-blue-900 border border-blue-600 text-blue-300 rounded hover:bg-blue-800"
              disabled={isRolling}
              style={{ 
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5), inset 0 0 5px rgba(37, 99, 235, 0.3)',
                textShadow: '0 0 5px rgba(147, 197, 253, 0.8)'
              }}
            >
              <Shuffle size={16} className="mr-2" />
              {isRolling ? 'ROLLING...' : 'ROLL NEW VALUES'}
            </button>
          </div>
        </div>
      )}
      
      {/* Attribute rows */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-blue-900 mb-8"
           style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.4), inset 0 0 10px rgba(30, 64, 175, 0.2)' }}>
        <div className="bg-gray-900 p-4 border-b border-gray-700 font-semibold text-blue-400 terminal-text">
          ASSIGN VALUES TO ATTRIBUTES
        </div>
        
        {renderAttributeRow('BRAWN')}
        {renderAttributeRow('REFLEX')}
        {renderAttributeRow('NERVE')}
        {renderAttributeRow('SAVVY')}
        {renderAttributeRow('CHARM')}
        {renderAttributeRow('GRIT')}
        {renderAttributeRow('GUILE')}
      </div>
      
      {/* Derived Statistics */}
      <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-purple-900 relative overflow-hidden"
           style={{ boxShadow: '0 0 15px rgba(88, 28, 135, 0.5), inset 0 0 10px rgba(88, 28, 135, 0.3)' }}>
        <div style={crtStyles.scanline}></div>
        
        <h3 className="text-lg font-bold mb-4 text-purple-400 terminal-text relative z-10">
          DERIVED STATISTICS
        </h3>
        
        <div className="grid grid-cols-3 gap-6 relative z-10">
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(37, 99, 235, 0.6), inset 0 0 8px rgba(37, 99, 235, 0.3)',
                 border: '1px solid rgba(37, 99, 235, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(37, 99, 235, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Initiative</div>
            <div className="text-2xl font-bold text-blue-400"
                 style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.9)' }}>
              {modifiedAttributes.REFLEX ? modifiedAttributes.REFLEX * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">REFLEX × 5</div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(22, 163, 74, 0.6), inset 0 0 8px rgba(22, 163, 74, 0.3)',
                 border: '1px solid rgba(22, 163, 74, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(22, 163, 74, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Solar Scouts Training</div>
            <div className="text-2xl font-bold text-green-400"
                 style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.9)' }}>
              {modifiedAttributes.REFLEX ? (modifiedAttributes.REFLEX * 2) + 15 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">(REFLEX × 2) + 15%</div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg relative"
               style={{ 
                 boxShadow: '0 0 10px rgba(126, 34, 206, 0.6), inset 0 0 8px rgba(126, 34, 206, 0.3)',
                 border: '1px solid rgba(126, 34, 206, 0.5)'
               }}>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 8px rgba(126, 34, 206, 0.8)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-400">Damage Soak</div>
            <div className="text-2xl font-bold text-purple-400"
                 style={{ textShadow: '0 0 8px rgba(192, 132, 252, 0.9)' }}>
              {modifiedAttributes.GRIT ? modifiedAttributes.GRIT * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">GRIT × 5</div>
          </div>
        </div>
      </div>
      
      {/* Origin Attributes Info */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-yellow-900 relative overflow-hidden"
           style={{ boxShadow: '0 0 15px rgba(161, 98, 7, 0.4), inset 0 0 10px rgba(161, 98, 7, 0.2)' }}>
        <div style={crtStyles.scanline}></div>
        
        <div className="flex relative z-10">
          <Info size={20} className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5" 
                style={{ filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.8))' }} />
          <div>
            <h4 className="font-bold text-yellow-400 terminal-text">
              ORIGIN ATTRIBUTE MODIFIERS: {character.origin?.name.toUpperCase() || "UNKNOWN"}
            </h4>
            <p className="text-sm text-yellow-300" style={{ textShadow: '0 0 5px rgba(253, 224, 71, 0.7)' }}>
              {character.origin?.attributeMods || "Select an origin to see attribute modifiers"}
            </p>
            <p className="text-xs mt-2 text-yellow-200" style={{ textShadow: '0 0 5px rgba(254, 240, 138, 0.7)' }}>
              These modifiers are automatically applied after you assign your base attributes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeGeneration;