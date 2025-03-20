// components/CharacterConcept.jsx
import React from 'react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';

const CharacterConcept = ({ character, updateCharacter }) => {
  // Select option handler
  const selectOption = (item, type) => {
    updateCharacter({
      ...character,
      [type]: item
    });
  };

  // Template for option cards
  const OptionCard = ({ item, type, selected, onClick }) => (
    <div 
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
        selected ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:border-gray-400'
      }`}
      onClick={() => onClick(item, type)}
    >
      <h3 className="text-lg font-bold text-blue-800">{item.name}</h3>
      <p className="text-sm mt-2">{item.description}</p>
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
        {type === 'epithet' && (
          <>
            <div><strong>Attribute Effect:</strong> {item.attributeEffect}</div>
            <div><strong>Benefit:</strong> {item.benefit}</div>
          </>
        )}
        {(type === 'profession' || type === 'origin' || type === 'background') && (
          <div><strong>Skills:</strong> {item.skills}</div>
        )}
        {type === 'origin' && (
          <div><strong>Attributes:</strong> {item.attributeMods}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 1: Choose Your Character Concept</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {/* Column A: Epithet */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center bg-blue-700 text-white py-2 rounded-t-lg">COLUMN A: EPITHET</h3>
          <div className="space-y-4">
            {EPITHETS.map(epithet => (
              <OptionCard 
                key={epithet.id}
                item={epithet}
                type="epithet"
                selected={character.epithet?.id === epithet.id}
                onClick={selectOption}
              />
            ))}
          </div>
        </div>
        
        {/* Column B: Profession */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center bg-green-700 text-white py-2 rounded-t-lg">COLUMN B: PROFESSION</h3>
          <div className="space-y-4">
            {PROFESSIONS.map(profession => (
              <OptionCard 
                key={profession.id}
                item={profession}
                type="profession"
                selected={character.profession?.id === profession.id}
                onClick={selectOption}
              />
            ))}
          </div>
        </div>
        
        {/* Column C: Origin */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center bg-yellow-600 text-white py-2 rounded-t-lg">COLUMN C: ORIGIN</h3>
          <div className="space-y-4">
            {ORIGINS.map(origin => (
              <OptionCard 
                key={origin.id}
                item={origin}
                type="origin"
                selected={character.origin?.id === origin.id}
                onClick={selectOption}
              />
            ))}
          </div>
        </div>
        
        {/* Column D: Background */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center bg-red-700 text-white py-2 rounded-t-lg">COLUMN D: BACKGROUND</h3>
          <div className="space-y-4">
            {BACKGROUNDS.map(background => (
              <OptionCard 
                key={background.id}
                item={background}
                type="background"
                selected={character.background?.id === background.id}
                onClick={selectOption}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Character summary */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="text-xl font-bold mb-2 text-center text-gray-800">Character Concept</h3>
        {character.epithet && character.profession && character.origin && character.background ? (
          <p className="text-center text-lg">
            <span className="font-medium text-blue-800">{character.epithet.name}</span> <span className="font-medium text-green-800">{character.profession.name}</span> from <span className="font-medium text-yellow-700">{character.origin.name}</span> with a <span className="font-medium text-red-700">{character.background.name}</span> background
          </p>
        ) : (
          <p className="text-center text-gray-500 italic">Select one option from each column to complete your character concept</p>
        )}
      </div>
    </div>
  );
};

export default CharacterConcept;