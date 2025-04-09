import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, ArrowRight, Shuffle, RotateCcw } from 'lucide-react';
import DerivedStatsPanel from './DerivedStatsPanel';
import {
  standardArray,
  calculateModifiedAttributes,
  getAttributeDescription,
  getOriginModifiers
} from '../utils/attributeUtils';

interface AttributeGenerationProps {
  character: any;
  updateCharacter: (characterData: any) => void;
  isInitialized?: boolean;
}

const AttributeGeneration: React.FC<AttributeGenerationProps> = ({
  character,
  updateCharacter,
  isInitialized = false
}) => {
  // State for base attributes and UI
  const [attributes, setAttributes] = useState<Record<string, number>>({...character.attributes});
  const [availableValues, setAvailableValues] = useState<number[]>([]);
  const [assignedPositions, setAssignedPositions] = useState<Record<string, number>>({});
  const [modifiedAttributes, setModifiedAttributes] = useState<Record<string, number>>({...character.attributes});
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [componentInitialized, setComponentInitialized] = useState<boolean>(false);

  // Determine if the character is Terran
  const isTerran = character.origin?.id === 'terran';

  // Generate dice values (for non-Terran characters)
  const generateDiceValues = () => {
    const diceValues = Array.from({ length: 7 }, () => {
      const die1 = Math.floor(Math.random() * 10) + 1;
      const die2 = Math.floor(Math.random() * 10) + 1;
      return Math.max(3, Math.min(18, die1 + die2));
    });
    return diceValues.sort((a, b) => b - a);
  };

  // Generate fresh attribute values based on character origin
  const generateFreshValues = useCallback(() => {
    if (isTerran) {
      // Use standard array for Terran characters
      return [...standardArray];
    } else {
      return generateDiceValues();
    }
  }, [isTerran]);

  // Check if attributes have been saved previously
  const attributesAreSaved = useCallback(() => {
    return character._attributesInitialized === true;
  }, [character._attributesInitialized]);

  // Initialize component on first render
  useEffect(() => {
    if (componentInitialized) return;

    if (attributesAreSaved()) {
      // If we have saved values and positions, restore them
      if (character.initialRolls && character.attributesAndPositions) {
        setAvailableValues(character.initialRolls);
        setAssignedPositions(character.attributesAndPositions);
        
        // Recalculate base attributes from positions
        const newAttributes: Record<string, number> = {};
        Object.entries(character.attributesAndPositions).forEach(([attr, position]) => {
          if (typeof position === 'number' && character.initialRolls[position] !== undefined) {
            newAttributes[attr] = character.initialRolls[position];
          } else {
            newAttributes[attr] = 0;
          }
        });
        setAttributes(newAttributes);
        
        // Calculate modified attributes with origin modifiers
        const newModifiedAttributes = calculateModifiedAttributes(
          newAttributes,
          character.origin?.id
        );
        setModifiedAttributes(newModifiedAttributes);
      } else {
        // If we have attributes but no saved positions/rolls, try to reconstruct
        const originModifiers = getOriginModifiers(character.origin?.id);
        
        // Calculate base values by subtracting origin modifiers
        const baseValues: Record<string, number> = {};
        Object.entries(character.attributes).forEach(([attr, value]) => {
          const modifier = originModifiers[attr] || 0;
          if (typeof value === 'number') {
            baseValues[attr] = value - modifier;
          } else {
            baseValues[attr] = 0;
          }
        });
        
        // Get unique base values in order
        const sortedUniqueValues = Array.from(new Set(Object.values(baseValues))).sort((a, b) => b - a);
        
        // If some values are missing, fill with new ones
        if (sortedUniqueValues.length < 7) {
          const freshValues = generateFreshValues();
          for (let i = sortedUniqueValues.length; i < 7; i++) {
            sortedUniqueValues.push(freshValues[i]);
          }
        }
        
        // Reconstruct positions
        const reconstructedPositions: Record<string, number> = {};
        const baseAttributes = ['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'];
        
        baseAttributes.forEach(attr => {
          // Find position of this attribute's value in sortedUniqueValues
          const value = baseValues[attr];
          const index = sortedUniqueValues.indexOf(value);
          
          if (index !== -1) {
            reconstructedPositions[attr] = index;
            // Replace this index with something unique to avoid duplicates
            sortedUniqueValues[index] = -999 - index;
          }
        });
        
        setAvailableValues([...sortedUniqueValues.filter(v => v > -999)]);
        setAttributes(baseValues);
        setAssignedPositions(reconstructedPositions);
      }
    } else {
      // First time visiting this screen, generate new values
      const freshValues = generateFreshValues();
      
      // Save these initial rolls to the character
      updateCharacter({
        ...character,
        initialRolls: freshValues
      });
      
      setAvailableValues(freshValues);
      
      // If we don't have any prior attribute assignments, don't set any positions
      setAssignedPositions({});
    }
    
    setComponentInitialized(true);
  }, [character, generateFreshValues, updateCharacter, attributesAreSaved, componentInitialized]);

  // Update modified attributes whenever base attributes change
  useEffect(() => {
    if (!componentInitialized) return;
    
    // Calculate attributes with origin modifiers
    const newModifiedAttributes = calculateModifiedAttributes(
      attributes,
      character.origin?.id
    );
    
    setModifiedAttributes(newModifiedAttributes);
    
    // Only update parent if all attributes are assigned
    if (Object.keys(assignedPositions).length === 7) {
      updateCharacter({
        ...character,
        attributes: newModifiedAttributes,
        attributesAndPositions: {...assignedPositions},
        _attributesInitialized: true
      });
    }
  }, [attributes, character.origin?.id, assignedPositions, updateCharacter, componentInitialized]);

  // Roll new attribute values
  const rollNewValues = () => {
    setIsRolling(true);

    // Animation: show multiple rolls
    let rollCount = 0;
    const interval = setInterval(() => {
      const newValues = generateFreshValues();
      setAvailableValues(newValues);

      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        setIsRolling(false);

        // Save the final rolls
        updateCharacter({
          ...character,
          initialRolls: newValues
        });

        // Reset assignments
        setAssignedPositions({});

        // Reset attributes to default
        const defaultAttributes: Record<string, number> = {
          BRAWN: 0,
          REFLEX: 0,
          NERVE: 0,
          SAVVY: 0,
          CHARM: 0,
          GRIT: 0,
          GUILE: 0
        };
        
        setAttributes(defaultAttributes);
      }
    }, 100);
  };

  // Reset assignments
  const resetAssignments = () => {
    setAssignedPositions({});

    // Reset attributes to default
    const defaultAttributes: Record<string, number> = {
      BRAWN: 0,
      REFLEX: 0,
      NERVE: 0,
      SAVVY: 0,
      CHARM: 0,
      GRIT: 0,
      GUILE: 0
    };
    
    setAttributes(defaultAttributes);
    
    // Update character to remove saved positions
    updateCharacter({
      ...character,
      attributesAndPositions: {}
    });
  };

  // Check if a value position is available for assignment
  const isValueAvailable = (position: number) => {
    return !Object.values(assignedPositions).includes(position);
  };

  // Assign a value to an attribute
  const assignValueToAttribute = (attribute: string, position: number) => {
    // Get the base value from the available values array
    const baseValue = availableValues[position];

    // Update assigned positions
    setAssignedPositions(prev => ({
      ...prev,
      [attribute]: position
    }));

    // Update base attributes
    setAttributes(prev => ({
      ...prev,
      [attribute]: baseValue // Store the BASE value in attributes
    }));
  };

  // Check if all attributes have been assigned
  const allAttributesAssigned = useCallback(() => {
    return Object.keys(assignedPositions).length === 7;
  }, [assignedPositions]);

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
    } as React.CSSProperties
  };

  // Render an attribute row
  const renderAttributeRow = (attribute: string) => {
    const originModifier = getOriginModifiers(character.origin?.id)[attribute] || 0;
    const description = getAttributeDescription(attribute);
    const baseValue = attributes[attribute] || 0;
    const modifiedValue = modifiedAttributes[attribute] || 0;

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
            {/* Available values */}
            {availableValues.map((value, index) => (
              <button
                key={index}
                onClick={() => assignValueToAttribute(attribute, index)}
                className={`w-10 h-10 flex items-center justify-center rounded-full 
                  ${assignedPositions[attribute] === index
                    ? 'bg-blue-600 text-white'
                    : isValueAvailable(index)
                      ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 border border-blue-600'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600'}
                  font-bold transition-colors`}
                style={{
                  boxShadow: assignedPositions[attribute] === index ? '0 0 10px rgba(37, 99, 235, 0.8)' : 'none'
                }}
                disabled={!isValueAvailable(index) && assignedPositions[attribute] !== index}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className={`w-12 h-12 rounded-full ${baseValue !== 0 ? 'bg-gray-800 border-2 border-blue-600' : 'bg-gray-800 border-2 border-gray-600'} flex items-center justify-center text-xl font-bold`}
              style={{
                boxShadow: baseValue !== 0 ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
                color: baseValue !== 0 ? '#93c5fd' : '#6b7280',
                textShadow: baseValue !== 0 ? '0 0 5px rgba(147, 197, 253, 0.8)' : 'none'
              }}>
              {baseValue || "-"}
            </div>

            {originModifier !== 0 && (
              <>
                <ArrowRight size={20} className="text-green-400" />
                <div className={`w-12 h-12 rounded-full bg-gray-800 border-2 border-green-600 flex items-center justify-center text-xl font-bold relative`}
                  style={{
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)',
                    color: '#4ade80',
                    textShadow: '0 0 5px rgba(74, 222, 128, 0.8)'
                  }}>
                  {modifiedValue || "-"}
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
      <style>
        {`
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
        `}
      </style>

      <h2 className="text-2xl font-bold mb-6 text-center text-green-400" style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.6)' }}>
        STEP 2: ASSIGN ATTRIBUTES
      </h2>

      {/* Instructions */}
      <div className="bg-gray-800 p-4 rounded-lg border border-green-900 mb-6 relative overflow-hidden"
        style={{ boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.2)' }}>
        {/* Scanline effect overlay */}
        <div style={crtStyles.scanline}></div>

        <div className="flex items-start relative z-10">
          <AlertCircle size={20} className="text-green-400 mr-2 mt-1 flex-shrink-0"
            style={{ filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.8))' }} />
          <div>
            <h3 className="font-bold text-green-400 terminal-text">
              ATTRIBUTE ASSIGNMENT FOR {character.origin?.name?.toUpperCase() || 'CHARACTER'}
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
            <p className="text-sm text-yellow-300 mt-2" style={{ textShadow: '0 0 5px rgba(250, 204, 21, 0.7)' }}>
              You must assign a value to every attribute before proceeding to the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Controls for non-Terrans */}
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
              onClick={rollNewValues}
              className="flex items-center px-4 py-2 bg-blue-900 border border-blue-600 text-blue-300 rounded hover:bg-blue-800"
              disabled={isRolling}
              style={{
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5), inset 0 0 5px rgba(37, 99, 235, 0.3)',
                textShadow: '0 0 5px rgba(147, 197, 253, 0.8)'
              }}
            >
              <Shuffle size={16} className="mr-2" />
              {isRolling ? 'ROLLING...' : 'ROLL VALUES'}
            </button>
          </div>
        </div>
      )}

      {/* Attributes Panel */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-blue-900 mb-8"
        style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.4), inset 0 0 10px rgba(30, 64, 175, 0.2)' }}
      >
        <div className="bg-gray-900 p-4 border-b border-gray-700 font-semibold text-blue-400 terminal-text">
          {isTerran ? 'TERRAN ATTRIBUTE ASSIGNMENT' : 'NON-TERRAN ATTRIBUTE ASSIGNMENT'}
        </div>

        {renderAttributeRow('BRAWN')}
        {renderAttributeRow('REFLEX')}
        {renderAttributeRow('NERVE')}
        {renderAttributeRow('SAVVY')}
        {renderAttributeRow('CHARM')}
        {renderAttributeRow('GRIT')}
        {renderAttributeRow('GUILE')}
      </div>

      {/* Derived Stats Panel */}
      <DerivedStatsPanel
        character={character}
        modifiedAttributes={modifiedAttributes}
      />

      {/* Status message about completion */}
      <div className={`mt-6 p-4 rounded-lg text-center transition-all duration-300 ${allAttributesAssigned()
        ? 'bg-green-900 border border-green-600'
        : 'bg-yellow-900 border border-yellow-600'
        }`}>
        {allAttributesAssigned() ? (
          <p className="text-green-300 font-bold">
            All attributes assigned! You can proceed to the next step.
          </p>
        ) : (
          <p className="text-yellow-300 font-bold">
            You must assign values to all attributes before proceeding.
          </p>
        )}
      </div>
    </div>
  );
};

export default AttributeGeneration;