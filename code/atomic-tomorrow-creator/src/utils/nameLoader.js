/**
 * Name generation utility
 * This module handles generating random character names
 */

// Import the name data directly
import { NAMES } from '../data/names';

/**
 * Generate a random name based on gender preference
 * @param {string} gender - "male", "female", or "random"
 * @returns {string} A randomly generated name
 */
export const generateRandomName = (gender = "random") => {
  // For debugging
  console.log("NAMES data:", NAMES);
  console.log("Generating name with gender:", gender);
  
  try {
    // Determine which gender to use
    let selectedGender = gender;
    if (gender === "random") {
      selectedGender = Math.random() > 0.5 ? "male" : "female";
    }
    
    console.log("Selected gender:", selectedGender);
    
    // Get name lists
    const prefixes = NAMES.prefixes[selectedGender] || [];
    const suffixes = NAMES.suffixes || [];
    
    console.log("Available prefixes:", prefixes);
    console.log("Available suffixes:", suffixes);
    
    // Check if we have valid data
    if (prefixes.length === 0 || suffixes.length === 0) {
      console.warn("Name lists are empty");
      return "Alex Cosmos"; // Fallback name
    }
    
    // Generate random name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const fullName = `${prefix} ${suffix}`;
    console.log("Generated name:", fullName);
    
    return fullName;
  } catch (error) {
    console.error("Error generating name:", error);
    return "Alex Cosmos"; // Fallback name
  }
};

/**
 * Get the available gender options
 * @returns {Array<Object>} Array of gender option objects
 */
export const getGenderOptions = () => [
  { id: 'male', label: 'Male', color: 'blue' },
  { id: 'female', label: 'Female', color: 'pink' },
  { id: 'random', label: 'Random', color: 'purple' }
];