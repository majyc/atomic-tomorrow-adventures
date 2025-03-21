export const PROFESSIONS = [
  // ACES & PILOTS
  { id: 'rocket-jockey', name: 'Rocket Jockey', description: 'Expert spacecraft pilot who thrives on the thrill of atmospheric entry', skills: 'Piloting (Spacecraft) +40%, Technology (Ship Systems) +20%, Navigation (Space) +10%, Marksmanship (Pistols) +10%' },
  { id: 'astrogator', name: 'Astrogator', description: 'Navigation specialist who charts courses through the stars', skills: 'Navigation (Space) +40%, Academics (Mathematics) +20%, Science (Astronomy) +10%, Computer Systems (Programming) +10%' },
  { id: 'astro-racer', name: 'Astro Racer', description: 'Speed demon who competes in dangerous space races', skills: 'Piloting (Racing) +40%, Repair (Vehicle Repair) +20%, Perception (Threat Assessment) +10%, Athletics (Reflexes) +10%' },
  { id: 'orbital-jumper', name: 'Orbital Jumper', description: 'Daredevil who specializes in zero-G maneuvers between spacecraft', skills: 'Athletics (Zero-G Movement) +40%, Athletics (Jumping) +20%, Technology (Vacuum Equipment) +10%, Perception (Spatial Awareness) +10%' },
  { id: 'stunt-pilot', name: 'Stunt Pilot', description: 'Performer who pushes aircraft to their absolute limits', skills: 'Piloting (Aircraft) +40%, Performance (Showmanship) +20%, Repair (Vehicle Repair) +10%, Perception (Threat Assessment) +10%' },

  // SCIENTISTS & INNOVATORS
  { id: 'brainiac', name: 'Brainiac', description: 'Intellectual powerhouse with mastery of theoretical concepts', skills: 'Science (Choose Specialty) +40%, Investigation (Research) +20%, Technology (Laboratory Equipment) +10%, Academics (Mathematics) +10%' },
  { id: 'atomicist', name: 'Atomicist', description: 'Specialist in nuclear physics and atomic energy applications', skills: 'Science (Physics) +40%, Engineering (Atomic) +20%, Engineering (Structural) +10%, Academics (Mathematics) +10%' },
  { id: 'xenobiologist', name: 'Xenobiologist', description: 'Studies alien life forms and their unique biology', skills: 'Science (Xenobiology) +40%, Medicine (Field Medicine) +20%, Perception (Observation) +10%, Technology (Sampling Equipment) +10%' },
  { id: 'mad-genius', name: 'Mad Genius', description: 'Brilliant but unconventional scientist pushing the boundaries', skills: 'Engineering (Experimental) +40%, Science (Theoretical Physics) +20%, Deception (Misdirection) +10%, Perception (Intuition) +10%' },
  { id: 'tech-wizard', name: 'Tech Wizard', description: 'Intuitive engineer who can make technology do the seemingly impossible', skills: 'Repair (Improvised Repair) +40%, Technology (Electronics) +20%, Engineering (Mechanical) +10%, Perception (Technical Intuition) +10%' },

  // EXPLORERS & SCOUTS
  { id: 'scout', name: 'Scout', description: 'First into unknown territory, survival expert', skills: 'Navigation (Wilderness) +40%, Survival +20%, Communications +10%, Environmental Awareness +10%' },
  { id: 'trailblazer', name: 'Trailblazer', description: 'Pioneer who charts paths through unmapped wilderness', skills: 'Navigation (Wilderness) +40%, Survival (Choose Environment) +20%, Technology (Cartography) +10%, Perception (Environmental Awareness) +10%' },
  { id: 'planetary-scout', name: 'Planetary Scout', description: 'Specialized in surveying new worlds for resources and dangers', skills: 'Investigation (Surveying) +40%, Science (Geology) +20%, Perception (Threat Assessment) +10%, Stealth (Camouflage) +10%' },
  { id: 'ruin-delver', name: 'Ruin Delver', description: 'Archaeologist specializing in ancient and alien ruins', skills: 'Academics (Archaeology) +40%, Academics (Ancient Languages) +20%, Perception (Trap Detection) +10%, Academics (History) +10%' },
  { id: 'xeno-tracker', name: 'Xeno-Tracker', description: 'Expert at finding and observing alien creatures', skills: 'Investigation (Tracking) +40%, Animal Handling (Alien Creatures) +20%, Stealth (Camouflage) +10%, Survival (Wilderness) +10%' },
  { id: 'deep-scout', name: 'Deep Scout', description: 'Explorer of the furthest reaches of known space', skills: 'Navigation (Deep Space) +40%, Science (Astronomy) +20%, Survival (Space) +10%, Technology (Communications) +10%' },

  // SOLDIERS & ENFORCERS
  { id: 'space-ranger', name: 'Space Ranger', description: 'Law enforcement officer with interplanetary jurisdiction', skills: 'Security (Law Enforcement) +40%, Investigation (Crime Scene Analysis) +20%, Marksmanship (Rifles) +10%, Academics (Regulations) +10%' },
  { id: 'solar-marine', name: 'Solar Marine', description: 'Elite military specialist trained for combat in space', skills: 'Marksmanship (Heavy Weapons) +40%, Melee Combat (Bladed Weapons) +20%, Athletics (Strength) +10%, Survival (Combat Zone) +10%' },
  { id: 'bounty-hunter', name: 'Bounty Hunter', description: 'Independent tracker who brings fugitives to justice', skills: 'Investigation (Tracking) +40%, Streetwise (Information Gathering) +20%, Marksmanship (Pistols) +10%, Persuasion (Intimidation) +10%' },
  { id: 'mercenary', name: 'Mercenary', description: 'Soldier for hire who goes where the money is', skills: 'Marksmanship (Rifles) +40%, Persuasion (Negotiation) +20%, Tactics (Combat) +10%, Survival (Combat Zone) +10%' },
  { id: 'bodyguard', name: 'Bodyguard', description: 'Personal security specialist trained to protect VIPs', skills: 'Perception (Threat Assessment) +40%, Melee Combat (Unarmed Combat) +20%, Perception (Situational Awareness) +10%, Security (VIP Protection) +10%' },

  // MECHANICS & ENGINEERS
  { id: 'wrench-monkey', name: 'Wrench Monkey', description: 'Practical engineer who keeps ships and equipment running', skills: 'Repair (Ship Repair) +40%, Technology (Diagnostics) +20%, Engineering (Mechanical) +10%, Streetwise (Scrounging) +10%' },
  { id: 'atomech', name: 'Atomech', description: 'Technician specializing in atomic power systems', skills: 'Engineering (Atomic) +40%, Technology (Radiation Equipment) +20%, Engineering (Power Systems) +10%, Repair (Ship Repair) +10%' },
  { id: 'gadgeteer', name: 'Gadgeteer', description: 'Inventor of ingenious and often unorthodox devices', skills: 'Engineering (Experimental) +40%, Technology (Electronics) +20%, Marksmanship (Exotic Weapons) +10%, Streetwise (Scrounging) +10%' },
  { id: 'salvager', name: 'Salvager', description: 'Expert at recovering and repurposing derelict technology', skills: 'Repair (Ship Repair) +40%, Technology (Ship Systems) +20%, Streetwise (Scrounging) +10%, Persuasion (Negotiation) +10%' },
  { id: 'roboticist', name: 'Roboticist', description: 'Specialist in creating and maintaining robotic systems', skills: 'Engineering (Robotics) +40%, Technology (Positronic Systems) +20%, Engineering (Mechanical) +10%, Animal Handling (Robot Psychology) +10%' },

  // SCOUNDRELS & OPPORTUNISTS
  { id: 'space-rat', name: 'Space Rat', description: 'Survivor who thrives in the margins of society', skills: 'Streetwise (Scrounging) +40%, Deception (Bluffing) +20%, Stealth (Hiding) +10%, Social (Rumor Collection) +10%' },
  { id: 'grifter', name: 'Grifter', description: 'Con artist who talks their way into and out of trouble', skills: 'Deception (Con Artistry) +40%, Perception (Reading People) +20%, Persuasion (Fast Talk) +10%, Deception (Disguise) +10%' },
  { id: 'smuggler', name: 'Smuggler', description: 'Transporter of goods that authorities would rather not see moving', skills: 'Deception (Misdirection) +40%, Piloting (Spacecraft) +20%, Navigation (Secret Routes) +10%, Streetwise (Contraband) +10%' },
  { id: 'cat-burglar', name: 'Cat Burglar', description: 'Stealthy thief who specializes in high-value targets', skills: 'Security (Lock Picking) +40%, Stealth (Silent Movement) +20%, Athletics (Climbing) +10%, Stealth (Hiding) +10%' },
  { id: 'gambler', name: 'Gambler', description: 'Risk-taker who makes a living on games of chance and skill', skills: 'Science (Probability) +40%, Deception (Bluffing) +20%, Perception (Reading People) +10%, Social (Carousing) +10%' },

  // PSYCHICS & ESPERS
  { id: 'mentalist', name: 'Mentalist', description: 'Telepath who can read and influence minds', skills: 'Psionic Powers (Telepathy) +40%, Psionic Powers (Mental Defense) +20%, Survival (Mental Discipline) +10%, Science (Psychology) +10%' },
  { id: 'telekinetic', name: 'Telekinetic', description: 'Psychic who can move objects with the power of their mind', skills: 'Psionic Powers (Telekinesis) +40%, Athletics (Fine Control) +20%, Survival (Mental Discipline) +10%, Science (Psionic Theory) +10%' },
  { id: 'precog', name: 'Precog', description: 'Esper who experiences flashes of possible futures', skills: 'Psionic Powers (Precognition) +40%, Perception (Intuition) +20%, Science (Probability) +10%, Academics (Dream Interpretation) +10%' },
  { id: 'empath', name: 'Empath', description: 'Sensitive who can feel and influence the emotions of others', skills: 'Psionic Powers (Empathy) +40%, Survival (Mental Discipline) +20%, Perception (Reading People) +10%, Persuasion (Counseling) +10%' },
  { id: 'wild-talent', name: 'Wild Talent', description: 'Untrained but powerful psychic with unpredictable abilities', skills: 'Psionic Powers (Choose Specialty) +40%, Survival (Mental Discipline) +20%, Psionic Powers (Energy Channeling) +10%, Science (Psionic Theory) +10%' },

  // DIPLOMATS & COMMUNICATORS
  { id: 'xeno-linguist', name: 'Xeno-Linguist', description: 'Expert in alien languages and communication methods', skills: 'Academics (Linguistics) +40%, Xenology (Alien Cultures) +20%, Science (Pattern Recognition) +10%, Social (Diplomatic Protocol) +10%' },
  { id: 'negotiator', name: 'Negotiator', description: 'Professional mediator who brokers deals between parties', skills: 'Persuasion (Negotiation) +40%, Perception (Reading People) +20%, Social (Mediation) +10%, Academics (Contract Law) +10%' },
  { id: 'ambassador', name: 'Ambassador', description: 'Official representative of a government or major organization', skills: 'Social (Diplomacy) +40%, Academics (Politics) +20%, Social (Etiquette) +10%, Perception (Cultural Sensitivity) +10%' },
  { id: 'newshound', name: 'Newshound', description: 'Journalist always looking for the next big story', skills: 'Investigation (Interviewing) +40%, Persuasion (Fast Talk) +20%, Academics (Writing) +10%, Artistry (Photography) +10%' },
  { id: 'socialite', name: 'Socialite', description: 'Well-connected figure who thrives in high society', skills: 'Social (Networking) +40%, Social (Etiquette) +20%, Streetwise (Rumor Collection) +10%, Social (Fashion Sense) +10%' },

  // MEDICAL EXPERTS
  { id: 'sawbones', name: 'Sawbones', description: 'Practical doctor who excels in emergency medicine', skills: 'Medicine (Emergency Medicine) +40%, Perception (Triage) +20%, Medicine (Improvised Treatment) +10%, Persuasion (Bedside Manner) +10%' },
  { id: 'xenodoc', name: 'Xenodoc', description: 'Physician specializing in treating alien physiology', skills: 'Medicine (Xenomedicine) +40%, Science (Comparative Physiology) +20%, Medicine (Diagnostics) +10%, Medicine (Surgery) +10%' },
  { id: 'psychiatrist', name: 'Psychiatrist', description: 'Mental health specialist treating the mind not just the body', skills: 'Medicine (Psychiatry) +40%, Science (Behavioral Science) +20%, Persuasion (Counseling) +10%, Medicine (Medication) +10%' },
  { id: 'combat-medic', name: 'Combat Medic', description: 'Battlefield doctor who saves lives under fire', skills: 'Medicine (Battlefield Medicine) +40%, Perception (Combat Awareness) +20%, Medicine (Triage) +10%, Medicine (Emergency Medicine) +10%' },
  { id: 'life-scientist', name: 'Life Scientist', description: 'Researcher specializing in biological systems', skills: 'Science (Biology) +40%, Science (Chemistry) +20%, Investigation (Research Methodology) +10%, Technology (Laboratory Equipment) +10%' },

  // COMMERCE & TRADE
  { id: 'space-trader', name: 'Space Trader', description: 'Merchant who buys low and sells high across the system', skills: 'Persuasion (Negotiation) +40%, Trade (Market Analysis) +20%, Trade (Appraisal) +10%, Social (Networking) +10%' },
  { id: 'cartel-broker', name: 'Cartel Broker', description: 'Intermediary for powerful syndicates and black market goods', skills: 'Streetwise (Black Market) +40%, Persuasion (Intimidation) +20%, Perception (Threat Assessment) +10%, Navigation (Secret Routes) +10%' },
  { id: 'insurance-adjuster', name: 'Insurance Adjuster', description: 'Risk assessor who investigates claims across the solar system', skills: 'Investigation (Crime Scene Analysis) +40%, Perception (Risk Assessment) +20%, Deception (Forgery Detection) +10%, Academics (Contract Law) +10%' },
  { id: 'adventure-capitalist', name: 'Adventure Capitalist', description: 'Investor who funds high-risk, high-reward ventures', skills: 'Trade (Business) +40%, Investigation (Treasure Hunting) +20%, Persuasion (Negotiation) +10%, Trade (Resource Evaluation) +10%' },
  { id: 'exotic-dealer', name: 'Exotic Dealer', description: 'Specialist in rare and unusual alien artifacts', skills: 'Xenology (Alien Artifacts) +40%, Xenology (Alien Cultures) +20%, Investigation (Authentication) +10%, Social (Discretion) +10%' },

  // SPECIALIZED ROLES
  { id: 'prospector', name: 'Prospector', description: 'Mineral hunter searching for valuable deposits', skills: 'Science (Geology) +40%, Investigation (Surveying) +20%, Technology (Mineral Analysis) +10%, Mining (Excavation) +10%' },
  { id: 'asteroid-miner', name: 'Asteroid Miner', description: 'Specialist in extracting resources from space rocks', skills: 'Mining (Zero-G Mining) +40%, Demolitions (Mining Charges) +20%, Engineering (Ore Processing) +10%, Survival (Vacuum) +10%' },
  { id: 'chronicler', name: 'Chronicler', description: 'Recorder of events and keeper of knowledge', skills: 'Academics (Documentation) +40%, Perception (Observation) +20%, Investigation (Analysis) +10%, Performance (Storytelling) +10%' },
  { id: 'terraform-tech', name: 'Terraform Tech', description: 'Engineer who transforms worlds to support human life', skills: 'Engineering (Environmental) +40%, Science (Atmospheric) +20%, Science (Biology) +10%, Science (Geology) +10%' },
  { id: 'entertainer', name: 'Entertainer', description: 'Performer who brings art and culture to the stars', skills: 'Performance (Choose Specialty) +40%, Perception (Crowd Reading) +20%, Artistry (Choose Specialty) +10%, Social (Showmanship) +10%' },
];