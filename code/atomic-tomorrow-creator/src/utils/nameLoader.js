/**
 * Name generation utility
 * This module handles generating random character names
 */

// Import the name data directly, following the pattern used elsewhere in the app
import { NAMES } from '../data/names';

/**
 * Generate a random name based on gender preference
 * @param {string} gender - "male", "female", or "random"
 * @returns {Promise<string>} A randomly generated name
 */
export const generateRandomName = async (gender = "random") => {
  try {
    // Determine which gender to use
    let selectedGender = gender;
    if (gender === "random") {
      selectedGender = Math.random() > 0.5 ? "male" : "female";
    }
    
    // Get name lists
    const prefixes = NAMES.prefixes[selectedGender] || [];
    const suffixes = NAMES.suffixes || [];
    
    // Check if we have valid data
    if (prefixes.length === 0 || suffixes.length === 0) {
      console.warn("Name lists are empty");
      return "Alex Cosmos"; // Fallback name
    }
    
    // Generate random name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${suffix}`;
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