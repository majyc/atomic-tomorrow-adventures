import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [terranExileChoice, setTerranExileChoice] = useState<'standard' | 'random' | null>(
    character.terranExileChoice || null
  );
  const [attributeMethod, setAttributeMethod] = useState<'generate' | 'manual'>(
    character.attributeMethod || 'generate'
  );
  const [manualAttributes, setManualAttributes] = useState<Record<string, string>>({
    BRAWN: String(character.attributes?.BRAWN || ''),
    REFLEX: String(character.attributes?.REFLEX || ''),
    NERVE: String(character.attributes?.NERVE || ''),
    SAVVY: String(character.attributes?.SAVVY || ''),
    CHARM: String(character.attributes?.CHARM || ''),
    GRIT: String(character.attributes?.GRIT || ''),
    GUILE: String(character.attributes?.GUILE || '')
  });
  
  // References to prevent infinite loops
  const characterRef = useRef(character);
  const originIdRef = useRef(character.origin?.id);
  const attributesInitializedRef = useRef(character._attributesInitialized);
  const attributeUpdateTimeoutRef = useRef<number | null>(null);
  
  // Update refs when props change (without triggering effects)
  useEffect(() => {
    characterRef.current = character;
    originIdRef.current = character.origin?.id;
    attributesInitializedRef.current = character._attributesInitialized;
  });

  // Determine if the character uses standard array (Terran) or has choice (Terran Exile)
  const isTerran = character.origin?.id === 'terran';
  const isTerranExile = character.origin?.id === 'terran-exile';

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
    } else if (isTerranExile && terranExileChoice === 'standard') {
      // Terran Exile choosing standard array
      return [...standardArray];
    } else {
      // Non-Terrans or Terran Exile choosing random
      return generateDiceValues();
    }
  }, [isTerran, isTerranExile, terranExileChoice]);

  // Check if attributes have been saved previously - use the ref
  const attributesAreSaved = useCallback(() => {
    return attributesInitializedRef.current === true;
  }, []);

  // Initialize component on first render (only once)
  useEffect(() => {
    if (componentInitialized) return;
    
    // Use the refs for initialization to avoid infinite loop
    const char = characterRef.current;
    const attrInitialized = attributesInitializedRef.current;

    // Initialize method from character data
    if (char.attributeMethod) {
      setAttributeMethod(char.attributeMethod);
    }

    if (attrInitialized) {
      // Check if this was manual mode
      if (char.attributeMethod === 'manual') {
        // Initialize manual attributes from character data
        const currentAttrs = char.attributes || {};
        setManualAttributes({
          BRAWN: String(currentAttrs.BRAWN || ''),
          REFLEX: String(currentAttrs.REFLEX || ''),
          NERVE: String(currentAttrs.NERVE || ''),
          SAVVY: String(currentAttrs.SAVVY || ''),
          CHARM: String(currentAttrs.CHARM || ''),
          GRIT: String(currentAttrs.GRIT || ''),
          GUILE: String(currentAttrs.GUILE || '')
        });
        
        // Set base attributes (remove origin modifiers)
        const originModifiers = getOriginModifiers(char.origin?.id);
        const baseAttrs: Record<string, number> = {};
        Object.entries(currentAttrs).forEach(([attr, value]) => {
          const modifier = originModifiers[attr] || 0;
          baseAttrs[attr] = (typeof value === 'number' ? value : 0) - modifier;
        });
        setAttributes(baseAttrs);
        setModifiedAttributes(currentAttrs);
      } else if (char.initialRolls && char.attributesAndPositions) {
        setAvailableValues(char.initialRolls);
        setAssignedPositions(char.attributesAndPositions);
        
        // Recalculate base attributes from positions
        const newAttributes: Record<string, number> = {};
        Object.entries(char.attributesAndPositions).forEach(([attr, position]) => {
          if (typeof position === 'number' && char.initialRolls[position] !== undefined) {
            newAttributes[attr] = char.initialRolls[position];
          } else {
            newAttributes[attr] = 0;
          }
        });
        setAttributes(newAttributes);
        
        // Calculate modified attributes with origin modifiers
        const newModifiedAttributes = calculateModifiedAttributes(
          newAttributes,
          char.origin?.id
        );
        setModifiedAttributes(newModifiedAttributes);
      } else {
        // If we have attributes but no saved positions/rolls, try to reconstruct
        const originModifiers = getOriginModifiers(char.origin?.id);
        
        // Calculate base values by subtracting origin modifiers
        const baseValues: Record<string, number> = {};
        Object.entries(char.attributes).forEach(([attr, value]) => {
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
      // First time visiting this screen, handle based on origin
      if (isTerranExile && terranExileChoice === null) {
        // Terran Exile needs to make a choice first - don't generate values yet
        setAvailableValues([]);
        setAssignedPositions({});
      } else {
        // Generate new values based on origin and choice
        const freshValues = generateFreshValues();
        
        // Save these initial rolls to the character (using a separate update)
        const characterUpdate = {
          ...char,
          initialRolls: freshValues,
          terranExileChoice: terranExileChoice
        };
        updateCharacter(characterUpdate);
        
        setAvailableValues(freshValues);
        
        // If we don't have any prior attribute assignments, don't set any positions
        setAssignedPositions({});
      }
    }
    
    setComponentInitialized(true);
  }, [componentInitialized, generateFreshValues, updateCharacter, isTerran, isTerranExile, terranExileChoice]);

  // Check if all manual attributes are valid and filled
  const areManualAttributesValid = useCallback(() => {
    return Object.values(manualAttributes).every(value => {
      const num = parseInt(value);
      return value !== '' && !isNaN(num) && num >= 3 && num <= 18;
    });
  }, [manualAttributes]);

  // Update modified attributes whenever attributes or assignments change - not tied to character
  useEffect(() => {
    if (!componentInitialized) return;
    
    // Calculate attributes with origin modifiers using the ref to avoid dependency on character
    const newModifiedAttributes = calculateModifiedAttributes(
      attributes,
      originIdRef.current
    );
    
    setModifiedAttributes(newModifiedAttributes);
  }, [attributes, componentInitialized]);
  
  // Effect to handle manual attribute updates
  useEffect(() => {
    if (!componentInitialized || attributeMethod !== 'manual') return;
    
    // Cancel any existing timeout
    if (attributeUpdateTimeoutRef.current !== null) {
      window.clearTimeout(attributeUpdateTimeoutRef.current);
    }
    
    // Set up a new timeout to update character after a delay
    attributeUpdateTimeoutRef.current = window.setTimeout(() => {
      updateCharacter({
        ...characterRef.current,
        attributes: modifiedAttributes,
        attributeMethod: 'manual',
        _attributesInitialized: areManualAttributesValid()
      });
      attributeUpdateTimeoutRef.current = null;
    }, 300); // Throttle updates to prevent infinite loops
    
    // Clean up timeout on unmount
    return () => {
      if (attributeUpdateTimeoutRef.current !== null) {
        window.clearTimeout(attributeUpdateTimeoutRef.current);
      }
    };
  }, [modifiedAttributes, componentInitialized, attributeMethod, areManualAttributesValid, updateCharacter]);

  // Separate effect to update the character - throttled with a ref
  useEffect(() => {
    if (!componentInitialized || attributeMethod === 'manual' || Object.keys(assignedPositions).length < 7) return;
    
    // Cancel any existing timeout
    if (attributeUpdateTimeoutRef.current !== null) {
      window.clearTimeout(attributeUpdateTimeoutRef.current);
    }
    
    // Set up a new timeout to update character after a delay
    attributeUpdateTimeoutRef.current = window.setTimeout(() => {
      updateCharacter({
        ...characterRef.current,
        attributes: modifiedAttributes,
        attributesAndPositions: {...assignedPositions},
        _attributesInitialized: true
      });
      attributeUpdateTimeoutRef.current = null;
    }, 300); // Throttle updates to prevent infinite loops
    
    // Clean up timeout on unmount
    return () => {
      if (attributeUpdateTimeoutRef.current !== null) {
        window.clearTimeout(attributeUpdateTimeoutRef.current);
      }
    };
  }, [assignedPositions, modifiedAttributes, componentInitialized, updateCharacter]);

  // Roll new values
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
          ...characterRef.current,
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
    
    // Update character to remove saved positions - using the ref
    updateCharacter({
      ...characterRef.current,
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

  // Unassign a value from an attribute (new function)
  const unassignAttributeValue = (attribute: string) => {
    // Check if the attribute is assigned
    if (!assignedPositions.hasOwnProperty(attribute)) {
      return;
    }

    // Create a copy of assigned positions and remove this attribute
    const newAssignedPositions = { ...assignedPositions };
    delete newAssignedPositions[attribute];
    setAssignedPositions(newAssignedPositions);

    // Set the attribute value to zero
    setAttributes(prev => ({
      ...prev,
      [attribute]: 0
    }));
  };

  // Handle click on an attribute value button
  const handleAttributeValueClick = (attribute: string, position: number) => {
    // If the attribute already has this position assigned, unassign it
    if (assignedPositions[attribute] === position) {
      unassignAttributeValue(attribute);
    } else {
      // Otherwise, assign the value
      assignValueToAttribute(attribute, position);
    }
  };

  // Handle Terran Exile choice
  const handleTerranExileChoice = (choice: 'standard' | 'random') => {
    setTerranExileChoice(choice);
    
    // Generate values based on choice
    const freshValues = choice === 'standard' ? [...standardArray] : generateDiceValues();
    
    // Update character with choice and fresh values
    updateCharacter({
      ...characterRef.current,
      terranExileChoice: choice,
      initialRolls: freshValues
    });
    
    setAvailableValues(freshValues);
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
  };

  // Handle attribute method choice (generate vs manual)
  const handleAttributeMethodChoice = (method: 'generate' | 'manual') => {
    setAttributeMethod(method);
    
    // Update character with method choice
    updateCharacter({
      ...characterRef.current,
      attributeMethod: method
    });
    
    if (method === 'manual') {
      // Initialize manual attributes from current character attributes if they exist
      const currentAttrs = character.attributes || {};
      setManualAttributes({
        BRAWN: String(currentAttrs.BRAWN || ''),
        REFLEX: String(currentAttrs.REFLEX || ''),
        NERVE: String(currentAttrs.NERVE || ''),
        SAVVY: String(currentAttrs.SAVVY || ''),
        CHARM: String(currentAttrs.CHARM || ''),
        GRIT: String(currentAttrs.GRIT || ''),
        GUILE: String(currentAttrs.GUILE || '')
      });
    } else {
      // Switch back to generation mode - trigger fresh values
      if (isTerranExile && terranExileChoice === null) {
        // Need to make choice first
        setAvailableValues([]);
        setAssignedPositions({});
      } else {
        // Generate fresh values
        const freshValues = generateFreshValues();
        setAvailableValues(freshValues);
        setAssignedPositions({});
        
        // Update character
        updateCharacter({
          ...characterRef.current,
          initialRolls: freshValues,
          attributeMethod: method
        });
      }
      
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
  };

  // Handle manual attribute input change
  const handleManualAttributeChange = (attribute: string, value: string) => {
    // Allow empty string or valid numbers (including incomplete entries like "1")
    if (value === '' || /^\d+$/.test(value)) {
      setManualAttributes(prev => ({
        ...prev,
        [attribute]: value
      }));
      
      // Convert to number and update base attributes
      const numValue = value === '' ? 0 : Math.max(0, Math.min(30, parseInt(value) || 0));
      
      setAttributes(prev => ({
        ...prev,
        [attribute]: numValue
      }));
    }
  };

  // Check if all attributes have been assigned
  const allAttributesAssigned = useCallback(() => {
    if (attributeMethod === 'manual') {
      return areManualAttributesValid();
    }
    return Object.keys(assignedPositions).length === 7;
  }, [assignedPositions, attributeMethod, areManualAttributesValid]);

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

  // Render a manual attribute input row
  const renderManualAttributeRow = (attribute: string) => {
    const originModifier = getOriginModifiers(character.origin?.id)[attribute] || 0;
    const description = getAttributeDescription(attribute);
    const baseValue = parseInt(manualAttributes[attribute]) || 0;
    const modifiedValue = baseValue + originModifier;
    const isValid = manualAttributes[attribute] !== '' && baseValue >= 3 && baseValue <= 18;

    return (
      <div className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors">
        <div className="w-1/4">
          <div className="font-bold text-blue-400" style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.7)' }}>
            {attribute}
          </div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>

        <div className="w-1/2">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">Base Value (3-18):</label>
              <input
                type="text"
                value={manualAttributes[attribute]}
                onChange={(e) => handleManualAttributeChange(attribute, e.target.value)}
                className={`w-20 h-10 px-3 text-center text-lg font-bold bg-gray-800 border-2 rounded ${
                  isValid 
                    ? 'border-blue-600 text-blue-300' 
                    : manualAttributes[attribute] === ''
                      ? 'border-gray-600 text-gray-400'
                      : 'border-red-600 text-red-400'
                } focus:outline-none focus:border-blue-400`}
                style={{
                  boxShadow: isValid ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
                  textShadow: isValid ? '0 0 5px rgba(147, 197, 253, 0.8)' : 'none'
                }}
                placeholder="0"
                maxLength={2}
              />
              {manualAttributes[attribute] !== '' && !isValid && (
                <div className="text-xs text-red-400 mt-1">Must be 3-18</div>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-12 h-12 rounded-full ${isValid ? 'bg-gray-800 border-2 border-blue-600' : 'bg-gray-800 border-2 border-gray-600'} flex items-center justify-center text-xl font-bold`}
              style={{
                boxShadow: isValid ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
                color: isValid ? '#93c5fd' : '#6b7280',
                textShadow: isValid ? '0 0 5px rgba(147, 197, 253, 0.8)' : 'none'
              }}
            >
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
                  {isValid ? modifiedValue : "-"}
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
                onClick={() => handleAttributeValueClick(attribute, index)}
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
            <div 
              className={`w-12 h-12 rounded-full ${baseValue !== 0 ? 'bg-gray-800 border-2 border-blue-600' : 'bg-gray-800 border-2 border-gray-600'} flex items-center justify-center text-xl font-bold`}
              style={{
                boxShadow: baseValue !== 0 ? '0 0 10px rgba(37, 99, 235, 0.6)' : 'none',
                color: baseValue !== 0 ? '#93c5fd' : '#6b7280',
                textShadow: baseValue !== 0 ? '0 0 5px rgba(147, 197, 253, 0.8)' : 'none',
                cursor: baseValue !== 0 ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (baseValue !== 0) {
                  unassignAttributeValue(attribute);
                }
              }}
              title={baseValue !== 0 ? "Click to unassign" : ""}
            >
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
            {attributeMethod === 'manual' ? (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                Enter your attribute values directly (base values from 3-18). These will be modified by your origin's bonuses/penalties.
                Perfect for recreating characters you created offline or using custom values.
              </p>
            ) : isTerran ? (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                As a Terran, you must distribute the Standard Array values (15, 14, 12, 11, 10, 9, 8) among your attributes.
                Click on a value to assign it to an attribute. Click on an assigned value again to unassign it.
              </p>
            ) : isTerranExile ? (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                As a Terran Exile, you may choose between the Standard Array (15, 14, 12, 11, 10, 9, 8) or 
                randomly generated values. Make your choice below, then assign the values to your attributes.
              </p>
            ) : (
              <p className="text-sm text-green-300" style={{ textShadow: '0 0 5px rgba(134, 239, 172, 0.7)' }}>
                As a {character.origin?.name || 'non-Terran'}, you have the flexibility to assign the generated values
                to your attributes as you see fit. Click on a value to assign it to an attribute. Click on an assigned value again to unassign it.
              </p>
            )}
            <p className="text-sm text-yellow-300 mt-2" style={{ textShadow: '0 0 5px rgba(250, 204, 21, 0.7)' }}>
              You must {attributeMethod === 'manual' ? 'enter values for' : 'assign a value to'} every attribute before proceeding to the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Attribute Method Choice */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-purple-900"
        style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 10px rgba(147, 51, 234, 0.2)' }}>
        <h3 className="text-lg font-semibold text-purple-400 mb-4"
          style={{ textShadow: '0 0 8px rgba(196, 181, 253, 0.7)' }}>
          CHOOSE ATTRIBUTE METHOD:
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleAttributeMethodChoice('generate')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              attributeMethod === 'generate'
                ? 'bg-purple-900 border-purple-600 text-purple-300'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            style={{
              boxShadow: attributeMethod === 'generate' 
                ? '0 0 15px rgba(147, 51, 234, 0.6)' 
                : 'none'
            }}
          >
            <div className="font-bold mb-2">GENERATE VALUES</div>
            <div className="text-sm">
              {isTerran 
                ? 'Use Standard Array (15, 14, 12, 11, 10, 9, 8)'
                : isTerranExile 
                  ? 'Choose between Standard Array or random values'
                  : 'Generate random attribute values'}
            </div>
          </button>
          <button
            onClick={() => handleAttributeMethodChoice('manual')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              attributeMethod === 'manual'
                ? 'bg-purple-900 border-purple-600 text-purple-300'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            style={{
              boxShadow: attributeMethod === 'manual' 
                ? '0 0 15px rgba(147, 51, 234, 0.6)' 
                : 'none'
            }}
          >
            <div className="font-bold mb-2">MANUAL INPUT</div>
            <div className="text-sm">Enter attribute values directly (3-18)</div>
          </button>
        </div>
      </div>

      {/* Terran Exile Choice */}
      {isTerranExile && attributeMethod === 'generate' && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-blue-900"
          style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.4), inset 0 0 10px rgba(30, 64, 175, 0.2)' }}>
          <h3 className="text-lg font-semibold text-blue-400 mb-4"
            style={{ textShadow: '0 0 8px rgba(96, 165, 250, 0.7)' }}>
            CHOOSE YOUR ATTRIBUTE METHOD:
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleTerranExileChoice('standard')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                terranExileChoice === 'standard'
                  ? 'bg-blue-900 border-blue-600 text-blue-300'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{
                boxShadow: terranExileChoice === 'standard' 
                  ? '0 0 15px rgba(37, 99, 235, 0.6)' 
                  : 'none'
              }}
            >
              <div className="font-bold mb-2">STANDARD ARRAY</div>
              <div className="text-sm">Use the balanced values: 15, 14, 12, 11, 10, 9, 8</div>
            </button>
            <button
              onClick={() => handleTerranExileChoice('random')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                terranExileChoice === 'random'
                  ? 'bg-blue-900 border-blue-600 text-blue-300'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{
                boxShadow: terranExileChoice === 'random' 
                  ? '0 0 15px rgba(37, 99, 235, 0.6)' 
                  : 'none'
              }}
            >
              <div className="font-bold mb-2">RANDOM GENERATION</div>
              <div className="text-sm">Roll randomly for potentially higher or lower values</div>
            </button>
          </div>
        </div>
      )}

      {/* Controls for non-Terrans and Terran Exiles who chose random */}
      {attributeMethod === 'generate' && ((!isTerran && !isTerranExile) || (isTerranExile && terranExileChoice === 'random')) && (
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
      {(attributeMethod === 'manual' || (!isTerranExile || terranExileChoice !== null)) && (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-blue-900 mb-8"
          style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.4), inset 0 0 10px rgba(30, 64, 175, 0.2)' }}
        >
        <div className="bg-gray-900 p-4 border-b border-gray-700 font-semibold text-blue-400 terminal-text">
          {attributeMethod === 'manual' 
            ? 'MANUAL ATTRIBUTE INPUT'
            : isTerran 
              ? 'TERRAN ATTRIBUTE ASSIGNMENT' 
              : isTerranExile 
                ? `TERRAN EXILE ATTRIBUTE ASSIGNMENT (${terranExileChoice?.toUpperCase() || 'PENDING'})`
                : 'NON-TERRAN ATTRIBUTE ASSIGNMENT'}
        </div>

        {attributeMethod === 'manual' ? (
          <>
            {renderManualAttributeRow('BRAWN')}
            {renderManualAttributeRow('REFLEX')}
            {renderManualAttributeRow('NERVE')}
            {renderManualAttributeRow('SAVVY')}
            {renderManualAttributeRow('CHARM')}
            {renderManualAttributeRow('GRIT')}
            {renderManualAttributeRow('GUILE')}
          </>
        ) : (
          <>
            {renderAttributeRow('BRAWN')}
            {renderAttributeRow('REFLEX')}
            {renderAttributeRow('NERVE')}
            {renderAttributeRow('SAVVY')}
            {renderAttributeRow('CHARM')}
            {renderAttributeRow('GRIT')}
            {renderAttributeRow('GUILE')}
          </>
        )}
        </div>
      )}

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
            All attributes {attributeMethod === 'manual' ? 'entered' : 'assigned'}! You can proceed to the next step.
          </p>
        ) : (
          <p className="text-yellow-300 font-bold">
            You must {attributeMethod === 'manual' ? 'enter valid values (3-18) for' : 'assign values to'} all attributes before proceeding.
          </p>
        )}
      </div>
    </div>
  );
};

export default AttributeGeneration;