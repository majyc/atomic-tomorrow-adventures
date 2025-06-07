// Constants for portrait counts
export const PORTRAIT_COUNTS = {
  male: 30,   // Now 30 male portraits (previously 20)
  female: 30  // Now 30 female portraits (previously 20)
};

// Portrait types and descriptions
// Extended to support additional portraits with meaningful descriptions
export const PORTRAIT_TYPES = {
  male: [
    "Space Explorer", "Martian Pioneer", "Atomic Scientist", "Naval Captain",
    "Belt Prospector", "Lunar Engineer", "Galactic Trader", "Quantum Mechanic",
    "Rocket Pilot", "Void Scout", "Martian Ranger", "Astro-Diplomat",
    "Atomic Racer", "Solar Marine", "Orbital Engineer", "Security Agent",
    "Xenobiologist", "Corporate Executive", "Interplanetary Spy", "Astro-Physician",
    // New descriptions for the additional 10 male portraits
    "Void Jumper", "Cosmic Archaeologist", "Stellar Cartographer", "Asteroid Miner", 
    "Cybernetic Engineer", "AI Specialist", "Space Marshal", "Atmospheric Scientist",
    "Gravity Technician", "Radiation Expert"
  ],
  female: [
    "Space Explorer", "Martian Pioneer", "Atomic Scientist", "Fleet Commander",
    "Belt Prospector", "Lunar Engineer", "Galactic Trader", "Quantum Physicist",
    "Rocket Pilot", "Void Scout", "Martian Ranger", "Astro-Diplomat",
    "Atomic Racer", "Solar Marine", "Orbital Engineer", "Security Agent",
    "Xenobiologist", "Corporate Executive", "Interplanetary Spy", "Astro-Physician",
    // New descriptions for the additional 10 female portraits
    "Zero-G Specialist", "Alien Linguist", "Planetary Geologist", "Orbital Architect",
    "Void Doctor", "Deep Space Pilot", "Quantum Navigator", "Terraform Engineer",
    "Solar System Ambassador", "Galactic Strategist"
  ]
};

// Configurable base path for portraits (can be changed for different deployments)
export const PORTRAITS_BASE_PATH = './portraits/';

// Generate portrait data with paths
export const generatePortraitData = () => {
  const portraits = [];
  
  // Base path for portrait assets
  const basePath = PORTRAITS_BASE_PATH;
  
  // Generate male portraits
  for (let i = 1; i <= PORTRAIT_COUNTS.male; i++) {
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
  for (let i = 1; i <= PORTRAIT_COUNTS.female; i++) {
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

// Export the constants and portrait data
export const PORTRAITS = generatePortraitData();