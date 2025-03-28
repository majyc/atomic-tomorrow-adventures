import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Download, Save, Zap, Atom, Upload } from 'lucide-react';

// Import components
import CharacterConcept from './components/CharacterConcept';
import AttributeGeneration from './components/AttributeGeneration';
import EquipmentDetails from './components/EquipmentDetails';
import CharacterSheet from './components/CharacterSheet';
import AtomicProgressIndicator from './components/AtomicProgressIndicator';
import AtomicStarfield from './components/AtomicStarfield';
import ImportDialog from './components/ImportDialog';

// Import utility functions
import { importCharacter } from './utils/characterIOUtils';

// Import CSS stylesheets
import './styles/raygun-buttons.css';
import './styles/vacuum-tube-cards.css';
import './styles/retro-terminal.css';
import './styles/atomic-styles.css';

const AtomicTomorrowApp = () => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // Effect to handle mounting state
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
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
    if (currentStep < 4) {
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
  
  // Handler for Import button
  const handleImport = () => {
    setShowImportDialog(true);
  };
  
  // Handler for when a character is imported
  const handleImportComplete = (importedCharacter, importedNotes) => {
    // Update the character data
    setCharacter(importedCharacter);
    
    // Set current step to the character sheet (final step)
    setCurrentStep(4);
    
    // Success message
    alert('Character imported successfully!');
  };
  
  // Validation checks
  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !character.epithet || !character.profession || !character.origin || !character.background;
    }
    return currentStep === 4;
  };
  
  const isPrevDisabled = () => {
    return currentStep === 1;
  };
  
  // Steps configuration for progress indicator
  const steps = [
    "Character Concept",
    "Attributes",
    "Equipment & Details",
    "Character Sheet"
  ];
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CharacterConcept character={character} updateCharacter={updateCharacter} />;
      case 2:
        return <AttributeGeneration character={character} updateCharacter={updateCharacter} />;
      case 3:
        return <EquipmentDetails character={character} updateCharacter={updateCharacter} />;
      case 4:
        return <CharacterSheet character={character} updateCharacter={updateCharacter} />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Generate random atomic particle orbit elements
  const generateAtomicOrbits = () => {
    const orbits = [];
    for (let i = 0; i < 3; i++) {
      const size = 100 + (i * 50);
      const top = Math.random() * 80;
      const right = Math.random() * 80;
      
      orbits.push(
        <div 
          key={i}
          className="atomic-orbit"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            right: `${right}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          <div 
            className="atomic-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        </div>
      );
    }
    return orbits;
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic starfield background */}
      <AtomicStarfield />
      
      {/* Space gradient overlay */}
      <div className="space-gradient"></div>
      
      {/* Decorative grid lines */}
      <div className="grid-lines"></div>
      
      {/* Atomic particle orbits */}
      {isMounted && generateAtomicOrbits()}
      
      {/* Import Character Dialog */}
      {showImportDialog && (
        <ImportDialog 
          onClose={() => setShowImportDialog(false)} 
          onImport={handleImportComplete} 
        />
      )}
      
      {/* Header with Starburst */}
      <header className="atomic-header text-white p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full opacity-20 pointer-events-none">
          <img src="/starburst.svg" alt="" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center">
            <Atom size={24} className="mr-2 text-blue-300 glow-animation" />
            <h1 className="text-2xl font-bold">ATOMIC TOMORROW ADVENTURES</h1>
          </div>
          <div className="flex space-x-4">
            <button className="raygun-button" onClick={handleImport}>
              <Upload size={18} className="mr-1" />
              Import Character
            </button>
            <button className="raygun-button">
              <Save size={18} className="mr-1" />
              Save
            </button>
            <button className="raygun-button">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="container mx-auto px-6 mt-6">
        <AtomicProgressIndicator 
          currentStep={currentStep} 
          totalSteps={4}
          steps={steps}
        />
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-6 relative z-10">
        <div className="raygun-card crt-screen">
          {renderStep()}
        </div>
      </main>

      {/* Footer navigation - hide on character sheet view */}
      {currentStep !== 4 && (
        <footer className="atomic-footer p-4 relative z-10">
          <div className="container mx-auto flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={isPrevDisabled()}
              className={`raygun-button ${isPrevDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </button>
            
            <div className="text-center">
              <div className="text-sm text-blue-300">Step {currentStep} of 4</div>
              <div className="font-medium text-white">
                {steps[currentStep - 1]}
              </div>
            </div>
            
            <button 
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={`raygun-button ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentStep === 3 ? 'Finish' : 'Next'}
              {currentStep !== 3 && <ChevronRight size={18} className="ml-1" />}
            </button>
          </div>
        </footer>
      )}
      
      {/* Decorative footer element */}
      <div className="h-4 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900"></div>
    </div>
  );
};

export default AtomicTomorrowApp;