// Character portrait data for Atomic Tomorrow
// Defines the available portraits using a consistent file naming convention

// Portrait naming scheme:
// - Male portraits: m_1.jpg through m_20.jpg 
// - Female portraits: f_1.jpg through f_20.jpg
// Located in: public/portraits/ folder

// Portrait types and descriptions
const PORTRAIT_TYPES = {
  male: [
    "Space Explorer", "Martian Pioneer", "Atomic Scientist", "Naval Captain",
    "Belt Prospector", "Lunar Engineer", "Galactic Trader", "Quantum Mechanic",
    "Rocket Pilot", "Void Scout", "Martian Ranger", "Astro-Diplomat",
    "Atomic Racer", "Solar Marine", "Orbital Engineer", "Security Agent",
    "Xenobiologist", "Corporate Executive", "Interplanetary Spy", "Astro-Physician"
  ],
  female: [
    "Space Explorer", "Martian Pioneer", "Atomic Scientist", "Fleet Commander",
    "Belt Prospector", "Lunar Engineer", "Galactic Trader", "Quantum Physicist",
    "Rocket Pilot", "Void Scout", "Martian Ranger", "Astro-Diplomat",
    "Atomic Racer", "Solar Marine", "Orbital Engineer", "Security Agent",
    "Xenobiologist", "Corporate Executive", "Interplanetary Spy", "Astro-Physician"
  ]
};

// Generate portrait data with paths
export const generatePortraitData = () => {
  const portraits = [];
  
  // In a React app, static assets in the 'public' folder are accessible at the root URL
  // So we'll use the following pattern for portrait paths
  const basePath = '/portraits/';
  
  // Generate male portraits
  for (let i = 1; i <= 20; i++) {
    if (i <= PORTRAIT_TYPES.male.length) {
      portraits.push({
        id: `male-${i}`,
        name: PORTRAIT_TYPES.male[i-1],
        path: `${basePath}m_${i}.jpg`,
        gender: 'male'
      });
    }
  }
  
  // Generate female portraits
  for (let i = 1; i <= 20; i++) {
    if (i <= PORTRAIT_TYPES.female.length) {
      portraits.push({
        id: `female-${i}`,
        name: PORTRAIT_TYPES.female[i-1],
        path: `${basePath}f_${i}.jpg`,
        gender: 'female'
      });
    }
  }
  
  return portraits;
};

// Export both PORTRAIT_TYPES (for dynamic generation) and PORTRAITS (for reference)
export { PORTRAIT_TYPES };
export const PORTRAITS = generatePortraitData();