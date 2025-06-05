const BACKGROUNDS = [
  { id: 'military-family', name: 'Military Family', description: 'Raised in the discipline of service', attributeEffect: 'GRIT +1, CHARM -1', skills: 'Tactics +10%, Athletics +10%, Firearms +5%' },
  { id: 'merchant-clan', name: 'Merchant Clan', description: 'Raised in the trading business', attributeEffect: 'CHARM +1, GRIT -1', skills: 'Negotiation +10%, Market Analysis +10%, Appraisal +5%' },
  { id: 'frontier-homestead', name: 'Frontier Homestead', description: 'Grew up on the edge of civilization', attributeEffect: 'GRIT +1, CHARM -1', skills: 'Survival +10%, Mechanics +10%, Animal Handling +5%' },
  { id: 'academic-training', name: 'Academy', description: 'Raised with focus on scholarly pursuits', attributeEffect: 'SAVVY +1, BRAWN -1', skills: 'Research +10%, Science +10%, Academic Knowledge +5%' },
  { id: 'street-urchin', name: 'Street Urchin', description: 'Raised in urban underbellies', attributeEffect: 'GUILE +1, CHARM -1', skills: 'Streetwise +10%, Theft +10%, Urban Navigation +5%' },
  { id: 'corporate-upbringing', name: 'Corporate Drone', description: 'Raised within corporate culture', attributeEffect: 'SAVVY +1, NERVE -1', skills: 'Business +10%, Technology +10%, Corporate Politics +5%' },
  { id: 'aristocratic-family', name: 'Aristocratic Family', description: 'Born to privilege and responsibility', attributeEffect: 'CHARM +1, NERVE -1', skills: 'Etiquette +10%, Politics +10%, Fine Arts +5%' },
  { id: 'spacer-family', name: 'Spacer Family', description: 'Raised aboard starships and stations', attributeEffect: 'REFLEX +1, BRAWN -1', skills: 'Zero-G Operations +10%, Ship Systems +10%, Navigation +5%' },
  { id: 'religious-order', name: 'Religious Order', description: 'Raised within a spiritual community', attributeEffect: 'NERVE +1, GUILE -1', skills: 'Theology +10%, Meditation +10%, Community Organization +5%' },
  { id: 'laboratory-subject', name: 'Laboratory Subject', description: 'Subject of scientific experimentation', attributeEffect: 'GRIT +1, CHARM -1', skills: 'Science +10%, Medical Knowledge +10%, Research Protocols +5%' },
  { id: 'megacity-native', name: 'Megacity Native', description: 'Raised in massive urban environments', attributeEffect: 'SAVVY +1, GRIT -1', skills: 'Urban Navigation +10%, Streetwise +10%, Public Transportation +5%' },
  { id: 'political-dynasty', name: 'Political Dynasty', description: 'Family involved in governance', attributeEffect: 'CHARM +1, GUILE -1', skills: 'Politics +10%, Public Speaking +10%, Law +5%' },
  { id: 'colonist-child', name: 'Colonist Family', description: 'Raised in a newly established colony', attributeEffect: 'GRIT +1, SAVVY -1', skills: 'Survival +10%, Community Building +10%, Resource Management +5%' },
  { id: 'underworld-family', name: 'Underworld Family', description: 'Raised among criminal elements', attributeEffect: 'GUILE +1, NERVE -1', skills: 'Streetwise +10%, Criminal Operations +10%, Security Systems +5%' },
  { id: 'entertainment-background', name:'Showbiz Family', description: 'Raised in the performing arts', attributeEffect: 'CHARM +1, GRIT -1', skills: 'Performance +10%, Public Relations +10%, Costume & Makeup +5%' },
  { id: 'regressed-barbarian', name: 'Regressed/Barbarian', description: 'From a society that rejected advanced technology', attributeEffect: 'BRAWN +1, SAVVY -1', skills: 'Primitive Survival +10%, Tribal Culture +10%, Hunting & Tracking +5%' },
  { id: 'drifter', name: 'Drifter', description: 'Your family had no settled home', attributeEffect: 'GRIT +1, CHARM -1', skills: 'Streetwise +10%, Zero-G Operations +5%, Environmental Adaptation +10%' },
  { id: 'refugee', name: 'Refugee', description: 'Displaced by disaster or conflict', attributeEffect: 'NERVE +1, CHARM -1', skills: 'Scavenging +10%, Group Survival +10%, Adaptation +5%' },
  { id: 'ship-born', name: 'Ship-Born', description: 'Born and raised on interplanetary vessels', attributeEffect: 'REFLEX +1, BRAWN -1', skills: 'Ship Operations +10%, Space Navigation +10%, Emergency Procedures +5%' },
  { id: 'noble-house', name: 'Noble House', description: 'Member of an influential dynastic family', attributeEffect: 'CHARM +1, BRAWN -1', skills: 'Etiquette +10%, Politics +10%, Family History +5%' },
  { id: 'atomicorp-employee', name: 'Atomicorp Employee', description: 'Raised in company-owned communities', attributeEffect: 'SAVVY +1, NERVE -1', skills: 'Corporate Knowledge +10%, Technical Operation +10%, Product Familiarity +5%' },
  { id: 'orbital-habitat', name: 'Orbital Habitat', description: 'Raised in artificial space communities', attributeEffect: 'REFLEX +1, BRAWN -1', skills: 'Zero-G Operations +10%, Life Support Systems +10%, Space Agriculture +5%' },
  { id: 'venusian-cloud-drifter', name: 'Venusian Cloud Drifter', description: 'Nomadic lifestyle among Venus\' floating cities', attributeEffect: 'NERVE +1, GRIT -1', skills: 'Atmospheric Navigation +10%, Wind Reading +10%, Survival: Venus +5%' },
  { id: 'belt-prospector-family', name: 'Belt Prospector Family', description: 'Raised searching for valuable asteroids', attributeEffect: 'SAVVY +1, CHARM -1', skills: 'Asteroid Identification +10%, Mining Operations +10%, Resource Valuation +5%' },
  { id: 'station-brat', name: 'Station Brat', description: 'Grew up on crowded space stations', attributeEffect: 'GUILE +1, GRIT -1', skills: 'Station Layout Knowledge +10%, Social Engineering +10%, Resource Conservation +5%' }
];

export { BACKGROUNDS };
export default BACKGROUNDS;