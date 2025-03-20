import React, { useState, useEffect } from 'react';
import { Shuffle, Calculator, AlertCircle } from 'lucide-react';

// Attribute Generation Screen
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
  
  // For Terrans: Standard Array assignment
  const [standardArray, setStandardArray] = useState([15, 14, 12, 11, 10, 9, 8]);
  const [assignedValues, setAssignedValues] = useState({});
  
  // For non-Terrans: Digital dice rolls
  const [diceResults, setDiceResults] = useState({});
  const [isRolling, setIsRolling] = useState({});
  
  // Modified attributes after Origin modifiers
  const [modifiedAttributes, setModifiedAttributes] = useState({...attributes});
  
  // Effect to apply origin modifiers to attributes
  useEffect(() => {
    if (character.origin) {
      // This would be replaced with actual origin modifiers from data
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
  
  // Roll dice for an attribute (non-Terrans)
  const rollDice = (attribute) => {
    if (character.origin?.id === 'terran') return;
    
    setIsRolling(prev => ({...prev, [attribute]: true}));
    
    // Simulate dice rolling animation
    let rollCount = 0;
    const interval = setInterval(() => {
      const die1 = Math.floor(Math.random() * 10) + 1;
      const die2 = Math.floor(Math.random() * 10) + 1;
      setDiceResults(prev => ({
        ...prev, 
        [attribute]: { die1, die2, total: die1 + die2 }
      }));
      
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        setIsRolling(prev => ({...prev, [attribute]: false}));
        
        // Final roll - ensure value is between 3-18
        const finalDie1 = Math.floor(Math.random() * 10) + 1;
        const finalDie2 = Math.floor(Math.random() * 10) + 1;
        const total = Math.max(3, Math.min(18, finalDie1 + finalDie2));
        
        setDiceResults(prev => ({
          ...prev, 
          [attribute]: { die1: finalDie1, die2: finalDie2, total }
        }));
        
        // Update attribute value
        setAttributes(prev => ({
          ...prev,
          [attribute]: total
        }));
      }
    }, 100);
  };
  
  // For Terrans: Assign standard array value to attribute
  const assignStandardValue = (attribute, value) => {
    if (character.origin?.id !== 'terran') return;
    
    // Check if value is already assigned
    const isValueAssigned = Object.values(assignedValues).includes(value);
    
    // If attribute already has a value, make that value available again
    if (assignedValues[attribute]) {
      setStandardArray(prev => [...prev, assignedValues[attribute]].sort((a, b) => b - a));
    }
    
    // If value is already assigned to another attribute, don't allow assignment
    if (isValueAssigned && assignedValues[attribute] !== value) return;
    
    // Assign value to attribute
    setAssignedValues(prev => ({...prev, [attribute]: value}));
    setAttributes(prev => ({...prev, [attribute]: value}));
    
    // Remove value from available array
    if (!isValueAssigned) {
      setStandardArray(prev => prev.filter(v => v !== value));
    }
  };
  
  // Roll all dice at once
  const rollAllDice = () => {
    if (character.origin?.id === 'terran') return;
    
    const attributes = ['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'];
    attributes.forEach(attr => rollDice(attr));
  };
  
  // Render attribute row with different UI based on origin
  const renderAttributeRow = (attribute, label, description) => {
    const isTerran = character.origin?.id === 'terran';
    const originModifier = getOriginModifiers(character.origin?.id)[attribute] || 0;
    
    return (
      <div className="flex items-center p-3 border-b border-gray-200">
        <div className="w-1/4">
          <div className="font-bold text-blue-900">{label}</div>
          <div className="text-xs text-gray-600">{description}</div>
        </div>
        
        {isTerran ? (
          <div className="w-2/4">
            <div className="flex flex-wrap gap-2">
              {standardArray.map(value => (
                <button
                  key={value}
                  onClick={() => assignStandardValue(attribute, value)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-2/4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => rollDice(attribute)}
                disabled={isRolling[attribute]}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
              >
                <Shuffle size={16} className="mr-1" />
                Roll
              </button>
              
              {diceResults[attribute] && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded flex items-center justify-center text-lg font-bold">
                    {diceResults[attribute].die1}
                  </div>
                  <span>+</span>
                  <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded flex items-center justify-center text-lg font-bold">
                    {diceResults[attribute].die2}
                  </div>
                  <span>=</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-blue-400 flex items-center justify-center text-xl font-bold">
              {attributes[attribute] || '?'}
            </div>
            
            {originModifier !== 0 && (
              <>
                <span>{originModifier > 0 ? '+' : ''}{originModifier}</span>
                <span>=</span>
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {modifiedAttributes[attribute]}
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
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 2: Generate Attributes</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-800">
            Attribute Generation for {character.origin?.name || 'Character'}
          </h3>
          
          {character.origin?.id !== 'terran' && (
            <button
              onClick={rollAllDice}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Shuffle size={18} className="mr-2" />
              Roll All Attributes
            </button>
          )}
        </div>
        
        {character.origin?.id === 'terran' ? (
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <h4 className="font-bold text-yellow-700 flex items-center">
              <AlertCircle size={18} className="mr-2" /> 
              Terran Standard Array
            </h4>
            <p>As a Terran, you must distribute the Standard Array values: 15, 14, 12, 11, 10, 9, 8</p>
            <p className="text-sm mt-2">Click on the values to assign them to your attributes</p>
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <h4 className="font-bold text-blue-700 flex items-center">
              <AlertCircle size={18} className="mr-2" /> 
              {character.origin?.name || 'Non-Terran'} Attribute Rolling
            </h4>
            <p>Roll 2d10 for each attribute. Results below 3 become 3, and results above 18 become 18.</p>
            <p className="text-sm mt-2">You can roll each attribute individually or all at once.</p>
          </div>
        )}
        
        <div className="space-y-1 border rounded-lg overflow-hidden">
          {renderAttributeRow('BRAWN', 'BRAWN', 'Physical strength and toughness')}
          {renderAttributeRow('REFLEX', 'REFLEX', 'Agility and reaction speed')}
          {renderAttributeRow('NERVE', 'NERVE', 'Mental composure and courage')}
          {renderAttributeRow('SAVVY', 'SAVVY', 'Intelligence and perception')}
          {renderAttributeRow('CHARM', 'CHARM', 'Charisma and persuasiveness')}
          {renderAttributeRow('GRIT', 'GRIT', 'Endurance and willpower')}
          {renderAttributeRow('GUILE', 'GUILE', 'Cunning and deception')}
        </div>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
        <h3 className="text-lg font-bold mb-4 text-blue-900">Derived Statistics</h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Initiative</div>
            <div className="text-2xl font-bold text-blue-800">
              {modifiedAttributes.REFLEX * 5}%
            </div>
            <div className="text-xs mt-1 text-gray-500">REFLEX × 5</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Basic Training</div>
            <div className="text-2xl font-bold text-blue-800">
              {(modifiedAttributes.REFLEX * 2) + 15}%
            </div>
            <div className="text-xs mt-1 text-gray-500">(REFLEX × 2) + 15%</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Damage Soak</div>
            <div className="text-2xl font-bold text-blue-800">
              {modifiedAttributes.GRIT * 5}%
            </div>
            <div className="text-xs mt-1 text-gray-500">GRIT × 5</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeGeneration;