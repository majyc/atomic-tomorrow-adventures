import React, { useState } from 'react';
import { Shuffle, User } from 'lucide-react';
import { generateRandomName } from '../utils/nameLoader';

/**
 * Simplified character name generator component with gender options
 */
const NameGenerator = ({ name, setName }) => {
  const [genderPreference, setGenderPreference] = useState('random');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate a character name with specified gender
  const handleGenerateName = async () => {
    setIsGenerating(true);
    try {
      const newName = await generateRandomName(genderPreference);
      setName(newName);
    } catch (error) {
      console.error("Error generating name:", error);
      setName("Alex Cosmos"); // Fallback name
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Character Name</label>
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Enter character name"
          />
          <button
            onClick={handleGenerateName}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
            title="Generate random name"
          >
            <Shuffle size={18} className={isGenerating ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <User size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">Name Generator:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setGenderPreference('male')}
              className={`px-2 py-0.5 text-xs rounded ${
                genderPreference === 'male' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGenderPreference('female')}
              className={`px-2 py-0.5 text-xs rounded ${
                genderPreference === 'female' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Female
            </button>
            <button
              onClick={() => setGenderPreference('random')}
              className={`px-2 py-0.5 text-xs rounded ${
                genderPreference === 'random' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Random
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;