import React, { useState } from 'react';
import RetroTerminalInput from './RetroTerminalInput';
import RetroPushButton from './RetroPushButton';
import { NAMES } from '../data/names';
import { Shuffle } from 'lucide-react';

/**
 * Final working NameInput component with direct data access
 * 
 * @param {Object} props
 * @param {string} props.name - Current name value
 * @param {Function} props.setName - Function to update the name
 * @param {string} props.genderPreference - Selected gender for name generation
 */
const NameInput = ({ name, setName, genderPreference }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate name directly without async complications
  const handleGenerateName = () => {
    setIsGenerating(true);
    
    try {
      // Determine which gender to use
      let selectedGender = genderPreference;
      if (genderPreference === "random") {
        selectedGender = Math.random() > 0.5 ? "male" : "female";
      }
      
      // Get name lists
      const prefixes = NAMES.prefixes[selectedGender] || [];
      const suffixes = NAMES.suffixes || [];
      
      // Check if we have valid data
      if (prefixes.length === 0 || suffixes.length === 0) {
        console.warn("Name lists are empty");
        setName("Alex Cosmos"); // Fallback name
        return;
      }
      
      // Generate random name
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const fullName = `${prefix} ${suffix}`;
      console.log("Generated name:", fullName);
      
      // Update the name in the parent component
      setName(fullName);
    } catch (error) {
      console.error("Error generating name:", error);
      setName("Alex Cosmos"); // Fallback name
    } finally {
      // Short delay for button animation
      setTimeout(() => {
        setIsGenerating(false);
      }, 300);
    }
  };
  
  return (
    <div className="relative">
      <div className="text-blue-400 mb-1 font-medium">Character Name</div>
      <div className="flex items-start gap-4">
        <div className="flex-grow">
          <RetroTerminalInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter character name..."
            multiline={false}
          />
        </div>
        <div className="mt-1">
        <div>
          <RetroPushButton
            onClick={handleGenerateName}
            label="Random"
            icon={<Shuffle size={16} />}
            color="blue"
            size="lg"
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default NameInput;