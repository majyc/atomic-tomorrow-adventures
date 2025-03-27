import React, { useState, useEffect } from 'react';
import { Shuffle, Edit, Trash, Plus, Zap, AlertCircle, User, FileText, MessageSquare, Shield, CreditCard, Sparkles } from 'lucide-react';
import RetroTerminal from './RetroTerminalComponent';
import AccessPanel from './AccessPanel';

// Character portrait options - usually these would be images
const PORTRAIT_OPTIONS = [
  { id: 'portrait1', name: 'Space Explorer', style: 'bg-blue-600' },
  { id: 'portrait2', name: 'Martian Pioneer', style: 'bg-red-600' },
  { id: 'portrait3', name: 'Atomic Scientist', style: 'bg-green-600' },
  { id: 'portrait4', name: 'Venusian Diplomat', style: 'bg-yellow-600' },
  { id: 'portrait5', name: 'Belt Prospector', style: 'bg-purple-600' },
  { id: 'portrait6', name: 'Lunar Engineer', style: 'bg-gray-600' }
];

// Name generator data
const NAME_PREFIXES = [
  // Original Names - Male
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas",
  "George", "Donald", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason",
  "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen",
  "Andrew", "Raymond", "Gregory", "Joshua", "Jerry", "Dennis", "Walter", "Patrick", "Peter", "Harold",
  "Douglas", "Henry", "Carl", "Arthur", "Ryan", "Roger", "Joe", "Willie", "Ralph", "Lawrence",

  // International Names - Male
  "Alexander", "Daniel", "Matthew", "Ethan", "Hiroshi", "Viktor", "Lorenzo", "Jamal", "Rico", "Maxim",
  "Kazuo", "Andrei", "Omar", "Mateo", "Akira", "Dmitri", "Miguel", "Carlos", "Javier", "Antonio",
  "Hans", "Ivan", "Yusuf", "Sergei", "Klaus", "Rafael", "Ravi", "Tomas", "Felix", "Marco",
  "Werner", "Hideo", "Boris", "Ahmed", "Raul", "Kenji", "Pavel", "Jian", "Takeshi", "Emilio",
  "Henrik", "Ibrahim", "Nikita", "Sanjay", "Dieter", "Esteban", "Bruno", "Alexei", "Jin", "Fernando",

  // Retro Atomic Age Male Names
  "Buzz", "Ace", "Rex", "Clint", "Dash", "Flash", "Buck", "Jet", "Dirk", "Duke",
  "Orion", "Lance", "Flint", "Brock", "Rolland", "Quartz", "Rusty", "Cliff", "Ricky", "Troy",
  "Hank", "Chip", "Rad", "Rocky", "Vance", "Carson", "Zack", "Fletcher", "Rocket", "Atom",
  "Neil", "Buzz", "Edison", "Werner", "Angus", "Sterling", "Brutus", "Miles", "Gordon", "Conrad",

  // Original Names - Female
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
  "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Donna", "Emily", "Carol",
  "Michelle", "Amanda", "Dorothy", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
  "Kathleen", "Amy", "Angela", "Shirley", "Anna", "Ruth", "Brenda", "Pamela", "Nicole", "Katherine",
  "Virginia", "Catherine", "Christine", "Samantha", "Debra", "Janet", "Rachel", "Carolyn", "Emma", "Maria",
  // International Names - Female
  "Zoe", "Sofia", "Emma", "Olivia", "Isabella", "Fatima", "Aisha", "Ling", "Svetlana", "Priya",
  "Zara", "Kali", "Nia", "Mira", "Natasha", "Yuki", "Elena", "Carmen", "Mei", "Olga",
  "Gabriela", "Marina", "Anya", "Laila", "Valentina", "Nadia", "Leila", "Sakura", "Eva", "Ana",
  "Adele", "Ingrid", "Sonia", "Rina", "Bianca", "Irene", "Lucia", "Vera", "Renata", "Fiona",
  "Katarina", "Rosa", "Naomi", "Lena", "Amara", "Yasmin", "Freya", "Chiara", "Jun", "Daniela",
  // Retro Atomic Age Female Names
  "Astrid", "Nova", "Venus", "Stella", "Luna", "Aurora", "Celeste", "Vega", "Polaris", "Cassandra",
  "Dot", "Betty", "Peggy", "Judy", "Lana", "Roxanne", "Darlene", "Ginger", "Mabel", "Sally",
  "Penny", "Frances", "Dolores", "Atomic", "Juno", "Velma", "Kitty", "Pearl", "Ruby", "Opal",
  "Phoenix", "Lyra", "Selene", "Maxine", "Viva", "Trixie", "Lola", "Bonnie", "Gloria", "Vivian",
];
const NAME_SUFFIXES = [
  //Original Names
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
  "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
  "Tanaka", "Ivanov", "Singh", "Rodriguez", "Wang", "Patel", "Kowalski", "Kim", "O'Brien", "Rossi",
  "Vasquez", "Petrov", "Yamamoto", "Chen", "Müller", "Johansson", "Gomez", "Dubois", "Morozov", "Nguyen",
  // Western Last Names
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
  "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
  "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts",
  "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Flores",
  "Morris", "Nguyen", "Murphy", "Rivera", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed",
  "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox", "Diaz", "Richardson", "Wood",

  // International Last Names
  "Tanaka", "Ivanov", "Singh", "Wang", "Patel", "Kowalski", "Kim", "O'Brien", "Rossi", "Vasquez",
  "Petrov", "Yamamoto", "Chen", "Müller", "Johansson", "Dubois", "Morozov", "Kuznetsov", "Schmidt", "Fischer",
  "Schneider", "Weber", "Meyer", "Wagner", "Becker", "Hoffmann", "Nakamura", "Satō", "Suzuki", "Takahashi",
  "Watanabe", "Kobayashi", "Hashimoto", "Ito", "Saito", "Yamaguchi", "Honda", "Li", "Zhang", "Liu",
  "Yang", "Huang", "Zhou", "Wu", "Xu", "Sun", "Ma", "Zhao", "Lopez", "Gonzalez",
  "Hernandez", "Perez", "Sanchez", "Ramirez", "Ferrari", "Romano", "Esposito", "Ricci", "Marino", "Bruno",
  "Colombo", "Rizzo", "Greco", "Lombardi", "Moretti", "Hansen", "Andersen", "Pedersen", "Nilsen", "Jensen",

  // Pulp Sci-Fi Last Names
  "Rocketson", "Atomworth", "Stargazer", "Moonraker", "Cosmopoulos", "Galaxon", "Nebula", "Quasar", "Jetson", "Orbital",
  "Blaster", "Proton", "Neutron", "Steel", "Electron", "Fusion", "Thunder", "Voltage", "Quantum", "Pulsar",
  "Nova", "Astro", "Moonwalker", "Comet", "Laserbeam", "Radium", "Meteorite", "Isotope", "Vortex", "Stratosphere",
  "Moonshot", "Stardust", "Solaris", "Velocity", "Horizon", "Eclipse", "Neon", "Centauri", "Lightyear", "Cosmic",
];

// Equipment categories for organization
const EQUIPMENT_CATEGORIES = [
  'Weapons',
  'Armor',
  'Gadgets',
  'Tools',
  'Survival Gear',
  'Communications',
  'Medical',
  'Miscellaneous'
];

// Signature gadget generator
const ATOMIC_ADJECTIVES = ['Atomo-', 'Astro-', 'Cosmo-', 'Electro-', 'Nucleo-', 'Chrono-', 'Magneto-', 'Quantum-', 'Gyro-', 'Hyper-'];
const TECHNO_COMPONENTS = ['-Tron', '-Ray', '-Matic', '-Wave', '-Flux', '-Static', '-Field', '-Pulse', '-Scope', '-Beam'];
const SERIES_DESIGNATIONS = ['Mark Ω', 'Deluxe', 'Z-Series', 'Plus', 'Supreme', 'X-1000', 'Wonder', 'Paragon', 'Galaxy', 'Ultra'];

// Equipment & Details Screen Component
const EquipmentDetails = ({ character, updateCharacter }) => {
  // State for character details
  const [name, setName] = useState(character.name || '');
  const [selectedPortrait, setSelectedPortrait] = useState(character.portrait || null);
  const [appearance, setAppearance] = useState(character.appearance || '');
  const [personality, setPersonality] = useState(character.personality || '');
  const [age, setAge] = useState(character.age || 30);

  // State for equipment
  const [equipment, setEquipment] = useState(character.equipment || []);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Miscellaneous');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  // State for signature gadget
  const [signatureGadget, setSignatureGadget] = useState(character.signatureGadget || null);
  const [gadgetBaseItem, setGadgetBaseItem] = useState('Pistol');

  // State for credits
  const [credits, setCredits] = useState(character.credits || 0);

  // State for terminal logs
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'ATOMIC TOMORROW EQUIPMENT SYSTEM LOADED' },
    { type: 'info', text: 'Ready to configure character equipment and details' },
    { type: 'warning', text: 'No equipment loaded. Please add equipment or load defaults.' }
  ]);

  // Update character in parent component when fields change
  useEffect(() => {
    updateCharacter({
      ...character,
      name,
      portrait: selectedPortrait,
      appearance,
      personality,
      age,
      equipment,
      signatureGadget,
      credits
    });
  }, [name, selectedPortrait, appearance, personality, age, equipment, signatureGadget, credits]);

  // Add terminal log
  const addTerminalLog = (type, text) => {
    setTerminalLogs(prev => [...prev, { type, text }]);
  };

  // Generate a random name
  const generateRandomName = () => {
    const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    const generatedName = `${prefix} ${suffix}`;
    setName(generatedName);
    addTerminalLog('success', `Name generated: ${generatedName}`);
  };

  // Roll for starting credits
  const rollCredits = () => {
    const die1 = Math.floor(Math.random() * 10) + 1;
    const die2 = Math.floor(Math.random() * 10) + 1;

    // Standard credits formula: 2d10 × 10
    const baseCredits = (die1 + die2) * 10;

    // Bonus credits for Merchant Clan background
    const bonusCredits = character.background?.id === 'merchant-clan' ? 50 : 0;

    const total = baseCredits + bonusCredits;
    setCredits(total);

    addTerminalLog('system', `Credit roll: ${die1} + ${die2} = ${die1 + die2} × 10 = ${baseCredits}`);
    if (bonusCredits) {
      addTerminalLog('success', `Merchant Clan bonus: +${bonusCredits}`);
    }
    addTerminalLog('info', `Total credits: ${total}`);
  };

  // Add new equipment item
  const addEquipmentItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      quantity: newItemQuantity
    };

    setEquipment([...equipment, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);

    addTerminalLog('success', `Added: ${newItemQuantity}× ${newItemName} [${newItemCategory}]`);
  };

  // Remove equipment item
  const removeEquipmentItem = (itemId) => {
    const itemToRemove = equipment.find(item => item.id === itemId);
    setEquipment(equipment.filter(item => item.id !== itemId));

    if (itemToRemove) {
      addTerminalLog('warning', `Removed: ${itemToRemove.name}`);
    }
  };

  // Generate signature gadget
  const generateSignatureGadget = () => {
    const adjective = ATOMIC_ADJECTIVES[Math.floor(Math.random() * ATOMIC_ADJECTIVES.length)];
    const component = TECHNO_COMPONENTS[Math.floor(Math.random() * TECHNO_COMPONENTS.length)];
    const designation = SERIES_DESIGNATIONS[Math.floor(Math.random() * SERIES_DESIGNATIONS.length)];

    const gadgetName = `${adjective}${component} ${designation} ${gadgetBaseItem}`;

    // Generate effects based on the components
    const effects = generateGadgetEffects(adjective, component, designation);

    const newGadget = {
      name: gadgetName,
      baseItem: gadgetBaseItem,
      adjective,
      component,
      designation,
      effects
    };

    setSignatureGadget(newGadget);
    addTerminalLog('system', `Signature gadget generated: ${gadgetName}`);
  };

  // Generate effects for signature gadget
  const generateGadgetEffects = (adjective, component, designation) => {
    const effects = [];

    // Adjective effect
    switch (adjective) {
      case 'Atomo-':
        effects.push('Powered by miniature atomic pile that never needs recharging. On fumbles, emits harmless but alarming blue glow.');
        break;
      case 'Chrono-':
        effects.push('Strange temporal properties allow you to see 3 seconds into the future when using it.');
        break;
      case 'Quantum-':
        effects.push('Exists in multiple states simultaneously. After failed roll, you may declare "that didn\'t happen" and reroll once per day.');
        break;
      default:
        effects.push('Specialized atomic age technology with unique properties.');
    }

    // Component effect
    switch (component) {
      case '-Ray':
        effects.push('Projects focused energy beam with 50-meter range. Can be adjusted to heat, freeze, or illuminate.');
        break;
      case '-Field':
        effects.push('Projects dome-shaped energy barrier. Can create 3-meter radius protective field for a limited time.');
        break;
      case '-Beam':
        effects.push('Focused energy projection system. Double range compared to standard models, with distinctive color.');
        break;
      default:
        effects.push('Incorporates advanced atomic-age engineering principles.');
    }

    // Designation effect
    switch (designation) {
      case 'Deluxe':
        effects.push('Gleaming chrome with atomic-age styling. Impresses onlookers and grants +15% to relevant social checks.');
        break;
      case 'X-1000':
        effects.push('Thousand-times prototype with enhanced capabilities. Has exactly the specialized attachment you need once per day.');
        break;
      case 'Ultra':
        effects.push('Pushed far beyond normal parameters. Range, duration, and effectiveness increased by 50%, but requires maintenance.');
        break;
      default:
        effects.push('Represents the pinnacle of retro-futuristic engineering.');
    }

    return effects;
  };

  // Load profession equipment
  const loadProfessionEquipment = () => {
    if (!character.profession) {
      addTerminalLog('error', 'Error: No profession selected');
      return;
    }

    // This would be replaced with actual data from the profession
    const professionEquipment = [];

    if (character.profession.id === 'rocket-jockey') {
      professionEquipment.push(
        { id: 'rj-1', name: 'Custom flight jacket with personal insignia', category: 'Armor', quantity: 1 },
        { id: 'rj-2', name: 'Pilot\'s chronometer', category: 'Gadgets', quantity: 1 },
        { id: 'rj-3', name: 'Personal navigation computer', category: 'Tools', quantity: 1 },
        { id: 'rj-4', name: 'Formal pilot\'s license for 3+ planets', category: 'Miscellaneous', quantity: 1 },
        { id: 'rj-5', name: 'Light Ray Pistol', category: 'Weapons', quantity: 1 }
      );
    } else if (character.profession.id === 'scout') {
      professionEquipment.push(
        { id: 'sc-1', name: 'All-terrain boots', category: 'Armor', quantity: 1 },
        { id: 'sc-2', name: 'Professional mapping tools', category: 'Tools', quantity: 1 },
        { id: 'sc-3', name: 'Multi-planet compass', category: 'Tools', quantity: 1 },
        { id: 'sc-4', name: 'Long-range communicator', category: 'Communications', quantity: 1 },
        { id: 'sc-5', name: 'Survival pack', category: 'Survival Gear', quantity: 1 }
      );
    } else {
      // Default equipment for other professions
      professionEquipment.push(
        { id: 'default-1', name: 'Standard issue uniform', category: 'Armor', quantity: 1 },
        { id: 'default-2', name: 'Personal identification chip', category: 'Miscellaneous', quantity: 1 },
        { id: 'default-3', name: 'Basic toolkit', category: 'Tools', quantity: 1 }
      );
    }

    // Add equipment without duplicating
    const existingIds = equipment.map(item => item.id);
    const newEquipment = professionEquipment.filter(item => !existingIds.includes(item.id));

    setEquipment([...equipment, ...newEquipment]);

    addTerminalLog('system', `Loading standard equipment for ${character.profession.name}`);
    newEquipment.forEach(item => {
      addTerminalLog('info', `Added: ${item.name}`);
    });
  };

  // Render terminal logs
  const renderTerminalLog = () => {
    return terminalLogs.map((log, index) => {
      let prefix = '>';
      let className = 'text-green-400';

      switch (log.type) {
        case 'system':
          prefix = '[SYSTEM]';
          className = 'text-blue-400';
          break;
        case 'error':
          prefix = '[ERROR]';
          className = 'text-red-400';
          break;
        case 'warning':
          prefix = '[WARNING]';
          className = 'text-yellow-400';
          break;
        case 'success':
          prefix = '[SUCCESS]';
          className = 'text-green-400';
          break;
        case 'info':
          prefix = '[INFO]';
          className = 'text-cyan-400';
          break;
      }

      return (
        <div key={index} className={`mb-1 ${className}`}>
          <span className="opacity-70">{prefix}</span> {log.text}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-900 p-5 rounded-xl">
      <style jsx>{`
        @keyframes glow {
          0% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.9); }
          100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .gadget-effect {
          position: relative;
        }
        
        .gadget-effect::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          z-index: -1;
          border-radius: 0.375rem;
          animation: pulse 3s infinite;
        }
        
        .credits-counter {
          position: relative;
          overflow: hidden;
        }
        
        .credits-counter::after {
          content: 'Cr';
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(217, 119, 6, 0.7);
          font-weight: bold;
        }
        
        .portrait-option {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .portrait-option:hover {
          transform: scale(1.05);
        }
        
        .portrait-option.active {
          animation: glow 2s infinite;
        }
        
        .control-panel {
          position: relative;
          overflow: hidden;
        }
        
        .control-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(59, 130, 246, 0), 
            rgba(59, 130, 246, 0.8), 
            rgba(59, 130, 246, 0)
          );
        }
      `}</style>

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' }}>
        STEP 3: EQUIPMENT & DETAILS
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Details */}
        <div>
          <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-900 control-panel" style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.3)' }}>
            <div className="flex items-center mb-4">
              <User size={18} className="text-blue-400 mr-2" />
              <h3 className="text-xl font-bold text-blue-400" style={{ textShadow: '0 0 5px rgba(96, 165, 250, 0.6)' }}>
                Character Details
              </h3>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">Character Name</label>
                <div className="flex">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-grow px-3 py-2 bg-gray-900 border border-blue-800 rounded-l-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                  <button
                    onClick={generateRandomName}
                    className="bg-blue-800 text-blue-100 px-3 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                    style={{ boxShadow: '0 0 10px rgba(30, 64, 175, 0.5)' }}
                  >
                    <Shuffle size={18} />
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-900 border border-blue-800 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Appearance */}
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-blue-300">Physical Appearance</label>
                  <FileText size={14} className="ml-2 text-blue-400" />
                </div>
                <textarea
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-blue-800 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Describe appearance"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>

              {/* Personality */}
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-blue-300">Personality</label>
                  <MessageSquare size={14} className="ml-2 text-blue-400" />
                </div>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-blue-800 rounded-md text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Describe personality traits"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Character Portrait */}
          <div className="bg-gray-800 rounded-xl p-4 border border-blue-900 control-panel" style={{ boxShadow: '0 0 15px rgba(30, 64, 175, 0.3)' }}>
            <h3 className="text-xl font-bold mb-4 text-blue-400" style={{ textShadow: '0 0 5px rgba(96, 165, 250, 0.6)' }}>
              Character Portrait
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {PORTRAIT_OPTIONS.map(portrait => (
                <div
                  key={portrait.id}
                  onClick={() => setSelectedPortrait(portrait)}
                  className={`portrait-option cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedPortrait?.id === portrait.id ? 'border-blue-500 active' : 'border-gray-700'
                    }`}
                >
                  <div className={`w-full h-24 ${portrait.style}`}></div>
                  <div className="p-2 text-center text-sm text-blue-200">{portrait.name}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-blue-900">
              <div className="flex items-start">
                <AlertCircle size={18} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  Select a portrait style that fits your character's origin and profession.
                  This will be displayed on your character sheet.
                </p>
              </div>
            </div>
          </div>

          {/* System Terminal */}
          <div className="mt-6 bg-gray-900 rounded-lg border border-green-900 overflow-hidden" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
            <div className="bg-gray-800 py-2 px-4 border-b border-green-900 flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <div className="text-xs text-green-400 font-mono ml-2">TERMINAL SESSION</div>
            </div>
            <div className="p-4 font-mono text-xs h-44 overflow-y-auto" style={{ backgroundColor: '#0a0f0d' }}>
              {renderTerminalLog()}
            </div>
          </div>
        </div>

        {/* Equipment Panel */}
        <div>
          <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-green-900 control-panel" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Shield size={18} className="text-green-400 mr-2" />
                <h3 className="text-xl font-bold text-green-400" style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.6)' }}>
                  Equipment & Inventory
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={loadProfessionEquipment}
                  className="px-3 py-1 bg-green-800 text-green-100 rounded hover:bg-green-700 text-sm flex items-center transition-colors"
                  style={{ boxShadow: '0 0 10px rgba(22, 163, 74, 0.3)' }}
                >
                  <Plus size={16} className="mr-1" />
                  Load Default
                </button>

                <div className="flex items-center space-x-2">
                  <div className="credits-counter bg-yellow-900 px-4 py-1 rounded text-yellow-200 font-medium relative" style={{ minWidth: '75px' }}>
                    {credits}
                  </div>
                  <button
                    onClick={rollCredits}
                    className="p-1 bg-yellow-800 rounded hover:bg-yellow-700 transition-colors"
                    style={{ boxShadow: '0 0 5px rgba(217, 119, 6, 0.5)' }}
                  >
                    <Shuffle size={16} className="text-yellow-200" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-gray-900 p-3 rounded-lg mb-4">
              <div className="flex items-start space-x-2">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New equipment item..."
                    className="w-full px-3 py-2 bg-gray-800 border border-green-800 rounded-md text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-green-800 rounded-md text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {EQUIPMENT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max="99"
                  className="w-16 px-3 py-2 bg-gray-800 border border-green-800 rounded-md text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  onClick={addEquipmentItem}
                  className="px-3 py-2 bg-green-700 text-green-100 rounded hover:bg-green-600 transition-colors"
                  style={{ boxShadow: '0 0 10px rgba(22, 163, 74, 0.3)' }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Equipment List */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-green-800">
              <div className="bg-gray-800 p-3 border-b border-green-900 grid grid-cols-12 font-medium text-green-400">
                <div className="col-span-6">Item</div>
                <div className="col-span-4">Category</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-1"></div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {equipment.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 italic">
                    No equipment added yet
                  </div>
                ) : (
                  equipment.map(item => (
                    <div key={item.id} className="p-3 border-b border-gray-800 grid grid-cols-12 items-center hover:bg-gray-800 transition-colors">
                      <div className="col-span-6 text-green-100">{item.name}</div>
                      <div className="col-span-4 text-sm text-green-300">{item.category}</div>
                      <div className="col-span-1 text-center text-green-200">{item.quantity}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeEquipmentItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-green-900">
              <div className="flex items-start">
                <CreditCard size={18} className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-300">
                  Characters start with 2d10 × 10 credits. Merchant Clan background adds +50 credits.
                  Add starting equipment based on your profession.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Gadget */}
          <div className="bg-gray-800 rounded-xl p-4 border border-purple-900 control-panel" style={{ boxShadow: '0 0 15px rgba(126, 34, 206, 0.3)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Sparkles size={18} className="text-purple-400 mr-2" />
                <h3 className="text-xl font-bold text-purple-400" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.6)' }}>
                  Signature Gadget
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={gadgetBaseItem}
                  onChange={(e) => setGadgetBaseItem(e.target.value)}
                  placeholder="Base item..."
                  className="px-3 py-1 bg-gray-900 border border-purple-800 rounded-md text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  style={{ minWidth: '120px' }}
                />

                <button
                  onClick={generateSignatureGadget}
                  className="px-3 py-1 bg-purple-800 text-purple-100 rounded hover:bg-purple-700 text-sm flex items-center transition-colors"
                  style={{ boxShadow: '0 0 10px rgba(126, 34, 206, 0.3)' }}
                >
                  <Zap size={16} className="mr-1" />
                  Generate
                </button>
              </div>
            </div>

            {signatureGadget ? (
              <div className="gadget-effect bg-gray-900 rounded-lg p-4">
                <h4 className="text-lg font-bold text-purple-300 mb-2" style={{ textShadow: '0 0 5px rgba(192, 132, 252, 0.6)' }}>
                  {signatureGadget.name}
                </h4>

                <div className="space-y-3 mb-4">
                  {signatureGadget.effects.map((effect, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-900 flex-shrink-0 flex items-center justify-center text-purple-200 font-bold text-xs mt-0.5 mr-2">
                        {index + 1}
                      </div>
                      <p className="text-sm text-purple-200">{effect}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSignatureGadget(null)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <p className="text-purple-300">Generate a unique signature gadget for your character!</p>
                <p className="text-sm mt-1 text-purple-400">Enter a base item (like "Pistol" or "Scanner") and click Generate.</p>
              </div>
            )}

            <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-purple-900">
              <div className="flex items-start">
                <AlertCircle size={18} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-purple-300">
                  Your signature gadget is a distinctive piece of atomic-age technology that makes your character unique.
                  It provides special abilities and helps define your character's approach to solving problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Origin & Background Info */}
      <div className="mt-6">
        <AccessPanel title="CHARACTER BACKGROUND DOSSIER">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2" style={{ textShadow: '0 0 5px rgba(250, 204, 21, 0.6)' }}>
                Origin: {character.origin?.name || "None Selected"}
              </h3>
              <RetroTerminal
                text={character.origin?.description || "Select an origin in Step 1 to see details."}
                color="amber"
                typingEffect={false}
                height="150px"
              />

              <div className="mt-2 p-2 bg-yellow-900 bg-opacity-30 rounded text-sm text-yellow-300 border border-yellow-900">
                <strong>Origin Skills:</strong> {character.origin?.skills || "None"}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2" style={{ textShadow: '0 0 5px rgba(248, 113, 113, 0.6)' }}>
                Background: {character.background?.name || "None Selected"}
              </h3>
              <RetroTerminal
                text={character.background?.description || "Select a background in Step 1 to see details."}
                color="red"
                typingEffect={false}
                height="150px"
              />

              <div className="mt-2 p-2 bg-red-900 bg-opacity-30 rounded text-sm text-red-300 border border-red-900">
                <strong>Background Skills:</strong> {character.background?.skills || "None"}
              </div>
            </div>
          </div>
        </AccessPanel>
      </div>
    </div>
  );
};

export default EquipmentDetails;