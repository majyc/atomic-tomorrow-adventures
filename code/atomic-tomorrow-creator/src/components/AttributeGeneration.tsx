import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowRight, Info, AlertCircle, RotateCcw, Zap } from 'lucide-react';

// Value object interface for typed array values
interface ValueObject {
  value: number;
  position: number;
}

// Revised Attribute Generation Screen
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
  
  // Render attribute row with different UI based on origin
  const renderAttributeRow = (attribute) => {
    const originModifier = getOriginModifiers(character.origin?.id)[attribute] || 0;
    const description = getAttributeDescription(attribute);
    
    return (
      <div className="flex items-center p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
        <div className="w-1/4">
          <div className="font-bold text-blue-900">{attribute}</div>
          <div className="text-xs text-gray-600">{description}</div>
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
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    font-bold transition-colors`}
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
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    font-bold transition-colors`}
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
            <div className={`w-12 h-12 rounded-full ${assignedValues[attribute] ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100 border-2 border-gray-300'} flex items-center justify-center text-xl font-bold`}>
              {assignedValues[attribute] || '?'}
            </div>
            
            {originModifier !== 0 && (
              <>
                <ArrowRight size={20} className="text-gray-400" />
                <div className={`w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold relative ${rollingAttribute === attribute ? 'animate-pulse' : ''}`}>
                  {assignedValues[attribute] ? (Math.max(3, Math.min(18, assignedValues[attribute] + originModifier))) : '?'}
                  {originModifier > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-xs flex items-center justify-center font-bold">+{originModifier}</span>}
                  {originModifier < 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">{originModifier}</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 2: Assign Attributes</h2>
      
      {/* Origin-specific instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-800">Attribute Assignment for {character.origin?.name || 'Character'}</h3>
            {isTerran ? (
              <p className="text-sm">As a Terran, you must distribute the Standard Array values (15, 14, 12, 11, 10, 9, 8) among your attributes. Click on a value to assign it to an attribute.</p>
            ) : (
              <p className="text-sm">As a {character.origin?.name || 'non-Terran'}, you have the flexibility to assign the generated values to your attributes as you see fit. Click on a value to assign it to an attribute.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Roll controls for non-Terrans */}
      {!isTerran && (
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Generated Attribute Values:</h3>
          <div className="flex gap-2">
            <button
              onClick={resetAssignments}
              className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              disabled={isRolling}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset
            </button>
            <button
              onClick={generateAllValues}
              className="raygun-button flex items-center"
              disabled={isRolling}
            >
              <Shuffle size={16} className="mr-2" />
              {isRolling ? 'Rolling...' : 'Roll New Values'}
            </button>
          </div>
        </div>
      )}
      
      {/* Attribute rows */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200 font-semibold text-gray-700">
          Assign Values to Attributes
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
      <div className="mt-8 bg-gray-100 p-6 rounded-xl border border-gray-300">
        <h3 className="text-lg font-bold mb-4 text-blue-900">Derived Statistics</h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-600">Initiative</div>
            <div className="text-2xl font-bold text-blue-800">
              {modifiedAttributes.REFLEX ? modifiedAttributes.REFLEX * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">REFLEX × 5</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-600">Solar Scouts Training</div>
            <div className="text-2xl font-bold text-blue-800">
              {modifiedAttributes.REFLEX ? (modifiedAttributes.REFLEX * 2) + 15 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">(REFLEX × 2) + 15%</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div className="text-sm text-gray-600">Damage Soak</div>
            <div className="text-2xl font-bold text-blue-800">
              {modifiedAttributes.GRIT ? modifiedAttributes.GRIT * 5 : '??'}%
            </div>
            <div className="text-xs mt-1 text-gray-500">GRIT × 5</div>
          </div>
        </div>
      </div>
      
      {/* Origin Attributes Info */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex">
          <Info size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800">Origin Attribute Modifiers: {character.origin?.name}</h4>
            <p className="text-sm text-yellow-700">
              {character.origin?.attributeMods || "Select an origin to see attribute modifiers"}
            </p>
            <p className="text-xs mt-2 text-yellow-600">
              These modifiers are automatically applied after you assign your base attributes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeGeneration;