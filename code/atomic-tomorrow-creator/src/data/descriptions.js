// Character description data for Atomic Tomorrow

// Personality traits for suggestions
export const PERSONALITY_TRAITS = [
    // Core personality descriptors
    "Adventurous", "Analytical", "Bold", "Calm", "Cautious", "Charming", "Clever", "Curious", 
    "Daring", "Determined", "Eccentric", "Enigmatic", "Fearless", "Honorable", "Impulsive", 
    "Inventive", "Logical", "Loyal", "Meticulous", "Mysterious", "Optimistic", "Paranoid", 
    "Patient", "Pragmatic", "Reckless", "Reserved", "Resourceful", "Sarcastic", "Scholarly", 
    "Strategic", "Stubborn", "Suspicious", "Thoughtful", "Wise", "Witty",
    
    // Complex trait phrases
    "Has a mysterious past", "Obsessed with ancient aliens", "Collects strange artifacts", 
    "Always carries a lucky charm", "Never backs down from a challenge", "Trust issues with authority",
    "Fascinated by pre-atomic technology", "Uncomfortable around robots", "Has an encyclopedic memory", 
    "Claims to have seen things 'out there'", "Prefers machines to people", "Constantly tinkers with equipment",
    "Prone to quoting obscure regulations", "Can't resist a good conspiracy theory", "Has inexplicable hunches",
    "Believes in cosmic destiny", "Values reputation above all else", "Leaves no debt unpaid",
    "Chronically homesick for the stars", "Addicted to rocket fuel coffee", "Follows an outdated code of honor",
    "Keeps detailed logs of everything", "Superstitious about artificial gravity", "Collects souvenirs from every planet",
    "Has recurring nightmares about the void", "Never travels without backup plans", "Obsessively organized",
    "Terrible at remembering names", "Speaks in technical jargon", "Fascinated by Earth history"
  ];
  
  // Appearance traits for suggestions
  export const APPEARANCE_TRAITS = [
    // Physical characteristics
    "Tall and lanky", "Short but commanding", "Athletic build", "Weathered complexion", "Cybernetic eye implant",
    "Scarred face", "Crew cut hair", "Wild, untamed hair", "Military posture", "Casual, relaxed stance",
    "Piercing gaze", "Always squinting", "Perpetual smile", "Serious expression", "Distinctive birthmark",
    "Prosthetic limb", "Decorated with tattoos", "Always wears gloves", "Neatly groomed", "Perpetually disheveled",
    
    // Clothing and accessories
    "Wears a vintage space helmet", "Never without a pilot's jacket", "Utility belt with countless gadgets",
    "Mismatched atomic-age clothing", "Classic navigator's cap", "Custom-designed space boots",
    "Collection of mission patches", "Worn leather holster", "Tinted radiation goggles", "Reflective jumpsuit",
    "Antique pocket watch", "Retro-futuristic wrist computer", "Brightly colored uniform", "Practical coveralls",
    "Distinctive insignia", "Medal of honor", "Unusual alien accessory", "Custom-fitted space suit",
    "Wears a lucky scarf", "Belt of technical tools", "Jacket with squadron emblem",
    "Retrofitted combat armor", "Formal military uniform", "Distinctive hat or helmet"
  ];
  
  // Equipment packages by profession
  export const PROFESSION_EQUIPMENT = {
    // ACES & PILOTS
    'rocket-jockey': [
      { name: 'Custom flight jacket with personal insignia', category: 'Armor', quantity: 1 },
      { name: 'Pilot\'s chronometer (precision timepiece)', category: 'Gadgets', quantity: 1 },
      { name: 'Personal navigation computer', category: 'Tools', quantity: 1 },
      { name: 'Light Ray Pistol', category: 'Weapons', quantity: 1 },
      { name: 'Emergency survival kit', category: 'Survival Gear', quantity: 1 },
      { name: 'Formal pilot\'s license for 3+ planets', category: 'Miscellaneous', quantity: 1 }
    ],
    'astrogator': [
      { name: 'Star charts (digital and physical backups)', category: 'Tools', quantity: 1 },
      { name: 'Advanced positional calculator', category: 'Gadgets', quantity: 1 },
      { name: 'Space-resistant uniform', category: 'Armor', quantity: 1 },
      { name: 'Navigator\'s sextant (modernized)', category: 'Tools', quantity: 1 },
      { name: 'Interplanetary protocols manual', category: 'Miscellaneous', quantity: 1 }
    ],
    'astro-racer': [
      { name: 'Racing helmet with heads-up display', category: 'Armor', quantity: 1 },
      { name: 'Lightweight racing suit', category: 'Armor', quantity: 1 },
      { name: 'Performance-enhancing stimulants', category: 'Medical', quantity: 3 },
      { name: 'Custom racing gloves', category: 'Armor', quantity: 1 },
      { name: 'Trophy from previous race', category: 'Miscellaneous', quantity: 1 }
    ],
    
    // SCIENTISTS & INNOVATORS
    'brainiac': [
      { name: 'Portable laboratory kit', category: 'Tools', quantity: 1 },
      { name: 'Data tablet with scientific references', category: 'Gadgets', quantity: 1 },
      { name: 'Protective lab coat', category: 'Armor', quantity: 1 },
      { name: 'Sample collection containers', category: 'Tools', quantity: 5 },
      { name: 'Research journal', category: 'Miscellaneous', quantity: 1 }
    ],
    'atomicist': [
      { name: 'Radiation suit', category: 'Armor', quantity: 1 },
      { name: 'Geiger counter', category: 'Gadgets', quantity: 1 },
      { name: 'Miniature nuclear test kit', category: 'Tools', quantity: 1 },
      { name: 'Radiation pills', category: 'Medical', quantity: 10 },
      { name: 'Atomic energy manual', category: 'Miscellaneous', quantity: 1 }
    ],
    'xenobiologist': [
      { name: 'Specimen collection kit', category: 'Tools', quantity: 1 },
      { name: 'Portable analysis scanner', category: 'Gadgets', quantity: 1 },
      { name: 'Contamination protection suit', category: 'Armor', quantity: 1 },
      { name: 'Xenobiology reference guide', category: 'Miscellaneous', quantity: 1 },
      { name: 'Universal translator', category: 'Communications', quantity: 1 }
    ],
    
    // EXPLORERS & SCOUTS
    'scout': [
      { name: 'All-terrain boots', category: 'Armor', quantity: 1 },
      { name: 'Environmental scanner', category: 'Gadgets', quantity: 1 },
      { name: 'Multi-planet compass', category: 'Tools', quantity: 1 },
      { name: 'Long-range communicator', category: 'Communications', quantity: 1 },
      { name: 'Survival pack', category: 'Survival Gear', quantity: 1 },
      { name: 'Scout\'s utility knife', category: 'Weapons', quantity: 1 }
    ],
    'trailblazer': [
      { name: 'Pathfinding kit', category: 'Tools', quantity: 1 },
      { name: 'Reinforced explorer\'s outfit', category: 'Armor', quantity: 1 },
      { name: 'Portable shelter', category: 'Survival Gear', quantity: 1 },
      { name: 'Distress beacon', category: 'Communications', quantity: 1 },
      { name: 'Field rations (two weeks)', category: 'Survival Gear', quantity: 1 }
    ],
    'planetary-scout': [
      { name: 'Planetary survey kit', category: 'Tools', quantity: 1 },
      { name: 'Adaptive environment suit', category: 'Armor', quantity: 1 },
      { name: 'Geological sampling tools', category: 'Tools', quantity: 1 },
      { name: 'Atmospheric analyzer', category: 'Gadgets', quantity: 1 },
      { name: 'Scout\'s medallion', category: 'Miscellaneous', quantity: 1 }
    ],
    
    // SOLDIERS & ENFORCERS
    'space-ranger': [
      { name: 'Ranger\'s badge and credentials', category: 'Miscellaneous', quantity: 1 },
      { name: 'Regulation Ray Rifle', category: 'Weapons', quantity: 1 },
      { name: 'Standard-issue sidearm', category: 'Weapons', quantity: 1 },
      { name: 'Light combat armor', category: 'Armor', quantity: 1 },
      { name: 'Restraint devices', category: 'Tools', quantity: 3 },
      { name: 'Ranger\'s code of conduct', category: 'Miscellaneous', quantity: 1 }
    ],
    'solar-marine': [
      { name: 'Marine combat armor', category: 'Armor', quantity: 1 },
      { name: 'Heavy Ray Rifle', category: 'Weapons', quantity: 1 },
      { name: 'Combat knife', category: 'Weapons', quantity: 1 },
      { name: 'Unit insignia and dog tags', category: 'Miscellaneous', quantity: 1 },
      { name: 'Trauma kit', category: 'Medical', quantity: 1 },
      { name: 'Rations pack', category: 'Survival Gear', quantity: 1 }
    ],
    'bounty-hunter': [
      { name: 'Targeting scanner', category: 'Gadgets', quantity: 1 },
      { name: 'Customized Ray Pistol', category: 'Weapons', quantity: 1 },
      { name: 'Restraint kit', category: 'Tools', quantity: 1 },
      { name: 'Bounty license', category: 'Miscellaneous', quantity: 1 },
      { name: 'Light-weight armor', category: 'Armor', quantity: 1 },
      { name: 'Wanted database', category: 'Gadgets', quantity: 1 }
    ],
    
    // MECHANICS & ENGINEERS
    'wrench-monkey': [
      { name: 'Advanced tool kit', category: 'Tools', quantity: 1 },
      { name: 'Mechanic\'s coveralls', category: 'Armor', quantity: 1 },
      { name: 'Diagnostic scanner', category: 'Gadgets', quantity: 1 },
      { name: 'Repair manual collection', category: 'Miscellaneous', quantity: 1 },
      { name: 'Spare parts kit', category: 'Tools', quantity: 1 },
      { name: 'Utility welding torch', category: 'Tools', quantity: 1 }
    ],
    'atomech': [
      { name: 'Radiation protection suit', category: 'Armor', quantity: 1 },
      { name: 'Atomic systems toolkit', category: 'Tools', quantity: 1 },
      { name: 'Radiation monitor', category: 'Gadgets', quantity: 1 },
      { name: 'Portable atomic power cell', category: 'Gadgets', quantity: 1 },
      { name: 'Containment case', category: 'Tools', quantity: 1 }
    ],
    
    // Generic package for other professions
    'default': [
      { name: 'Personal communicator', category: 'Communications', quantity: 1 },
      { name: 'Standard-issue utility kit', category: 'Tools', quantity: 1 },
      { name: 'Basic protective clothing', category: 'Armor', quantity: 1 },
      { name: 'Emergency medical kit', category: 'Medical', quantity: 1 },
      { name: 'Identification documents', category: 'Miscellaneous', quantity: 1 }
    ]
  };
  
  // Signature gadget generators
  export const GADGET_COMPONENTS = {
    ATOMIC_ADJECTIVES: ['Atomo-', 'Astro-', 'Cosmo-', 'Electro-', 'Nucleo-', 'Chrono-', 'Magneto-', 'Quantum-', 'Gyro-', 'Hyper-'],
    TECHNO_COMPONENTS: ['-Tron', '-Ray', '-Matic', '-Wave', '-Flux', '-Static', '-Field', '-Pulse', '-Scope', '-Beam'],
    SERIES_DESIGNATIONS: ['Mark Ω', 'Deluxe', 'Z-Series', 'Plus', 'Supreme', 'X-1000', 'Wonder', 'Paragon', 'Galaxy', 'Ultra']
  };
  
  // Effects for signature gadgets based on components
  export const GADGET_EFFECTS = {
    ADJECTIVE_EFFECTS: {
      'Atomo-': 'Powered by miniature atomic pile that never needs recharging. On fumbles, emits harmless but alarming blue glow.',
      'Chrono-': 'Strange temporal properties allow you to see 3 seconds into the future when using it.',
      'Cosmo-': 'Draws energy from cosmic rays. Works even in the vacuum of space and deep underground.',
      'Electro-': 'Generates its own electrical field. Cannot be disabled by EMP weapons and can jump-start other devices.',
      'Nucleo-': 'Powered by stable nuclear isomer. Emits faint blue glow in darkness and is slightly warm to the touch.',
      'Magneto-': 'Manipulates magnetic fields. Can attract/repel metal objects within 5 meters.',
      'Quantum-': 'Exists in multiple states simultaneously. After failed roll, you may declare "that didn\'t happen" and reroll once per day.',
      'Gyro-': 'Contains advanced stabilization technology. Grants +15% to balance-related checks and steadies your aim.',
      'Hyper-': 'Operates at frequencies beyond normal perception. Occasionally you hear it whisper hints about nearby dangers.'
    },
    COMPONENT_EFFECTS: {
      '-Tron': 'Houses advanced microcomputing system. Can perform complex calculations and store vast amounts of data.',
      '-Ray': 'Projects focused energy beam with 50-meter range. Can be adjusted to heat, freeze, or illuminate.',
      '-Matic': 'Features automated functionality. Performs routine tasks without user input and has basic voice recognition.',
      '-Wave': 'Manipulates energy waves. Can detect and analyze radiation, sound, and electronic signals nearby.',
      '-Flux': 'Contains unstable energy core. Occasionally glitches in unexpected but useful ways in high-stress situations.',
      '-Static': 'Generates controlled energy field. Provides minor protection against energy-based attacks.',
      '-Field': 'Projects dome-shaped energy barrier. Can create 3-meter radius protective field for a limited time.',
      '-Pulse': 'Emits regular energy pulses. Can disrupt electronic devices or recalibrate malfunctioning equipment.',
      '-Scope': 'Features advanced optical system. Grants thermal and night vision, plus 10x magnification.',
      '-Beam': 'Focused energy projection system. Double range compared to standard models, with distinctive color.'
    },
    DESIGNATION_EFFECTS: {
      'Mark Ω': 'The ultimate iteration. Features all the refinements from previous models and unmatched reliability.',
      'Deluxe': 'Gleaming chrome with atomic-age styling. Impresses onlookers and grants +15% to relevant social checks.',
      'Z-Series': 'Experimental model with classified features. Contains hidden functionality that activates in certain situations.',
      'Plus': 'Enhanced model with improved efficiency. Uses 50% less power and operates twice as long as standard models.',
      'Supreme': 'Premium model with exclusive features. Made from superior materials that resist damage and wear.',
      'X-1000': 'Thousand-times prototype with enhanced capabilities. Has exactly the specialized attachment you need once per day.',
      'Wonder': 'One-of-a-kind curiosity with unpredictable quirks. Occasionally performs impossible functions with no explanation.',
      'Paragon': 'Exemplary showcase model. Performs with exceptional reliability and effectiveness in any environment.',
      'Galaxy': 'Designed for deep space use. Functions in extreme conditions and interfaces with alien technology.',
      'Ultra': 'Pushed far beyond normal parameters. Range, duration, and effectiveness increased by 50%, but requires maintenance.'
    }
  };