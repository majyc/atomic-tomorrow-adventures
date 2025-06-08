// Constants for portrait counts
export const PORTRAIT_COUNTS = {
  male: 45,   // Auto-updated from portraits directory
  female: 30  // Auto-updated from portraits directory
};

// No descriptions needed - users pick based on visual appearance

// Configurable base path for portraits (can be changed for different deployments)
export const PORTRAITS_BASE_PATH = './portraits/';

// Generate portrait data with paths
export const generatePortraitData = () => {
  const portraits = [];
  
  // Base path for portrait assets
  const basePath = PORTRAITS_BASE_PATH;
  
  // Generate male portraits
  for (let i = 1; i <= PORTRAIT_COUNTS.male; i++) {
    portraits.push({
      id: `male-${i}`,
      name: `Portrait ${i}`,
      path: `${basePath}m_${i}.jpg`,
      gender: 'male'
    });
  }
  
  // Generate female portraits
  for (let i = 1; i <= PORTRAIT_COUNTS.female; i++) {
    portraits.push({
      id: `female-${i}`,
      name: `Portrait ${i}`,
      path: `${basePath}f_${i}.jpg`,
      gender: 'female'
    });
  }
  
  return portraits;
};

// Export the constants and portrait data
export const PORTRAITS = generatePortraitData();