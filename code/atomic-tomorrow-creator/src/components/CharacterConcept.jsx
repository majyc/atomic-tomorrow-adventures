// components/CharacterConcept.jsx
import React from 'react';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';
import { BACKGROUNDS } from '../data/backgrounds';
import { Info, Zap, Rocket, Globe, Users } from 'lucide-react';

const CharacterConcept = ({ character, updateCharacter }) => {
  // Select option handler
  const selectOption = (item, type) => {
    updateCharacter({
      ...character,
      [type]: item
    });
  };

  // Template for option cards
  const OptionCard = ({ item, type, selected, onClick }) => {
    // Determine icon based on type
    const getIcon = () => {
      switch(type) {
        case 'epithet': return <Zap size={20} className="text-blue-500" />;
        case 'profession': return <Rocket size={20} className="text-green-500" />;
        case 'origin': return <Globe size={20} className="text-yellow-500" />;
        case 'background': return <Users size={20} className="text-red-500" />;
        default: return null;
      }
    };

    return (
      <div 
        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
          ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onClick={() => onClick(item, type)}
      >
        {/* Tube-like connector on the left */}
        <div className="absolute left-0 top-1/2 w-2 h-8 bg-gray-200 transform -translate-y-1/2 -translate-x-2 rounded-r"></div>
        
        {/* Header with icon */}
        <div className="flex items-center">
          <div className="mr-2">{getIcon()}</div>
          <h3 className="text-lg font-bold text-blue-800">{item.name}</h3>
        </div>
        
        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
        )}
        
        <p className="text-sm mt-2">{item.description}</p>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
          {type === 'epithet' && (
            <>
              <div className="flex">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-1 text-blue-700 text-xs font-bold">A</div>
                <div className="text-gray-700"><strong>Attribute Effect:</strong> {item.attributeEffect}</div>
              </div>
              <div className="flex mt-1">
                <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-1 text-purple-700 text-xs font-bold">B</div>
                <div className="text-gray-700"><strong>Benefit:</strong> {item.benefit}</div>
              </div>
            </>
          )}
          {(type === 'profession' || type === 'origin' || type === 'background') && (
            <div className="flex">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-1 text-green-700 text-xs font-bold">S</div>
              <div className="text-gray-700"><strong>Skills:</strong> {item.skills}</div>
            </div>
          )}
          {type === 'origin' && (
            <div className="flex mt-1">
              <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center mr-1 text-yellow-700 text-xs font-bold">A</div>
              <div className="text-gray-700"><strong>Attributes:</strong> {item.attributeMods}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 relative">
        <span className="relative z-10">Step 1: Choose Your Character Concept</span>
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></span>
      </h2>
      
      <div className="relative grid grid-cols-4 gap-6">
        {/* Background circuit patterns - purely decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#e5e7eb" strokeWidth="1" fill="none">
              <path d="M100,0 L100,1000" />
              <path d="M300,0 L300,1000" />
              <path d="M500,0 L500,1000" />
              <path d="M700,0 L700,1000" />
              <path d="M0,100 L1000,100" opacity="0.5" />
              <path d="M0,300 L1000,300" opacity="0.5" />
              <path d="M0,500 L1000,500" opacity="0.5" />
              <path d="M0,700 L1000,700" opacity="0.5" />
            </g>
          </svg>
        </div>
        
        {/* Column A: Epithet */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-3 text-center bg-blue-700 text-white py-2 rounded-t-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 opacity-50"></div>
            <span className="relative z-10">COLUMN A: EPITHET</span>
          </h3>
          <div className="space-y-4 relative">
            {/* Circuit board node */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded-full z-10"></div>
            
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
        <div className="relative">
          <h3 className="text-lg font-semibold mb-3 text-center bg-green-700 text-white py-2 rounded-t-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-green-700 via-green-600 to-green-700 opacity-50"></div>
            <span className="relative z-10">COLUMN B: PROFESSION</span>
          </h3>
          <div className="space-y-4 relative">
            {/* Circuit board node */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-100 border-2 border-green-300 rounded-full z-10"></div>
            
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
        <div className="relative">
          <h3 className="text-lg font-semibold mb-3 text-center bg-yellow-600 text-white py-2 rounded-t-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-50"></div>
            <span className="relative z-10">COLUMN C: ORIGIN</span>
          </h3>
          <div className="space-y-4 relative">
            {/* Circuit board node */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded-full z-10"></div>
            
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
        <div className="relative">
          <h3 className="text-lg font-semibold mb-3 text-center bg-red-700 text-white py-2 rounded-t-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-50"></div>
            <span className="relative z-10">COLUMN D: BACKGROUND</span>
          </h3>
          <div className="space-y-4 relative">
            {/* Circuit board node */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-100 border-2 border-red-300 rounded-full z-10"></div>
            
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
      
      {/* Character summary - styled as retro terminal */}
      <div className="mt-8 retro-terminal">
        <div className="retro-terminal-title">CHARACTER CONCEPT</div>
        <div className="retro-terminal-controls">
          <div className="terminal-control control-red"></div>
          <div className="terminal-control control-yellow"></div>
          <div className="terminal-control control-green"></div>
        </div>
        
        <div className="retro-terminal-content pt-4">
          {character.epithet && character.profession && character.origin && character.background ? (
            <p className="text-center text-lg">
              <span className="font-medium text-blue-300">{character.epithet.name}</span> <span className="font-medium text-green-300">{character.profession.name}</span> from <span className="font-medium text-yellow-300">{character.origin.name}</span> with a <span className="font-medium text-red-300">{character.background.name}</span> background
            </p>
          ) : (
            <p className="text-center italic">
              SELECT ONE OPTION FROM EACH COLUMN TO COMPLETE YOUR CHARACTER CONCEPT
              <span className="terminal-cursor"></span>
            </p>
          )}
        </div>
      </div>
      
      {/* Informational note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <Info size={20} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Character Creation Guide</h4>
            <p className="text-sm text-blue-700">
              Your selections from each column will form the foundation of your character. Choose options that you find interesting and that work well together. Your Epithet provides special abilities, your Profession determines your main skills, your Origin affects your attributes, and your Background adds additional skills and connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterConcept;