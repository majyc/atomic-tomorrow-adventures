import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Download, Save, Dice, Zap } from 'lucide-react';

// Main component
const AtomicTomorrowCharacterCreator = () => {
  // State for character creation
  const [currentStep, setCurrentStep] = useState(1);
  const [character, setCharacter] = useState({
    epithet: null,
    profession: null,
    origin: null,
    background: null,
    attributes: {
      BRAWN: 10,
      REFLEX: 10,
      NERVE: 10,
      SAVVY: 10,
      CHARM: 10,
      GRIT: 10,
      GUILE: 10
    },
    name: '',
    skills: {},
    equipment: [],
    credits: 0
  });

  // Step navigation
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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

  // Select option handler
  const selectOption = (item, type) => {
    setCharacter({
      ...character,
      [type]: item
    });
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
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
      
      case 2:
        return <div className="text-center p-12 text-lg">Attribute Generation Screen (Step 2)</div>;
      case 3:
        return <div className="text-center p-12 text-lg">Skills Screen (Step 3)</div>;
      case 4:
        return <div className="text-center p-12 text-lg">Equipment & Details Screen (Step 4)</div>;
      case 5:
        return <div className="text-center p-12 text-lg">Final Character Sheet (Step 5)</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Zap size={24} className="mr-2" />
          <h1 className="text-2xl font-bold">ATOMIC TOMORROW ADVENTURES</h1>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center p-2 bg-blue-700 rounded hover:bg-blue-600">
            <Save size={18} className="mr-1" />
            Save
          </button>
          <button className="flex items-center p-2 bg-blue-700 rounded hover:bg-blue-600">
            <Download size={18} className="mr-1" />
            Export
          </button>
          <button className="flex items-center p-2 bg-blue-700 rounded hover:bg-blue-600">
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-gray-200 h-2">
        <div 
          className="bg-blue-600 h-full transition-all duration-500"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-6">
        {renderStep()}
      </main>

      {/* Footer navigation */}
      <footer className="bg-gray-100 border-t border-gray-300 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center p-2 px-4 rounded ${
              currentStep === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">Step {currentStep} of 5</div>
            <div className="font-medium">
              {currentStep === 1 && "Character Concept"}
              {currentStep === 2 && "Attributes"}
              {currentStep === 3 && "Skills"}
              {currentStep === 4 && "Equipment & Details"}
              {currentStep === 5 && "Character Sheet"}
            </div>
          </div>
          
          <button 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!character.epithet || !character.profession || !character.origin || !character.background)) ||
              currentStep === 5
            }
            className={`flex items-center p-2 px-4 rounded ${
              (currentStep === 1 && (!character.epithet || !character.profession || !character.origin || !character.background)) ||
              currentStep === 5
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
          >
            {currentStep === 5 ? 'Finish' : 'Next'}
            {currentStep !== 5 && <ChevronRight size={18} className="ml-1" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AtomicTomorrowCharacterCreator;