import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Download, Save, Zap } from 'lucide-react';

import CharacterConcept from './components/CharacterConcept';
import AttributeGeneration from './components/AttributeGeneration';
import SkillCalculation from './components/SkillCalculation';
import EquipmentDetails from './components/EquipmentDetails';
import CharacterSheet from './components/CharacterSheet';

const AtomicTomorrowApp = () => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for character data
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
    credits: 0,
    appearance: '',
    personality: '',
    age: 30,
    portrait: null,
    signatureGadget: null
  });
  
  // Update character data
  const updateCharacter = (newData) => {
    setCharacter({ ...character, ...newData });
  };
  
  // Navigation functions
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Validation checks
  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !character.epithet || !character.profession || !character.origin || !character.background;
    }
    return currentStep === 5;
  };
  
  const isPrevDisabled = () => {
    return currentStep === 1;
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CharacterConcept character={character} updateCharacter={updateCharacter} />;
      case 2:
        return <AttributeGeneration character={character} updateCharacter={updateCharacter} />;
      case 3:
        return <SkillCalculation character={character} updateCharacter={updateCharacter} />;
      case 4:
        return <EquipmentDetails character={character} updateCharacter={updateCharacter} />;
      case 5:
        return <CharacterSheet character={character} updateCharacter={updateCharacter} />;
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

      {/* Footer navigation - hide on character sheet view */}
      {currentStep !== 5 && (
        <footer className="bg-gray-100 border-t border-gray-300 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={isPrevDisabled()}
              className={`flex items-center p-2 px-4 rounded ${
                isPrevDisabled()
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
              disabled={isNextDisabled()}
              className={`flex items-center p-2 px-4 rounded ${
                isNextDisabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              {currentStep === 4 ? 'Finish' : 'Next'}
              {currentStep !== 4 && <ChevronRight size={18} className="ml-1" />}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AtomicTomorrowApp;