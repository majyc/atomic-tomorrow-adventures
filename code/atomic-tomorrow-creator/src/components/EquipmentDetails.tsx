import React, { useState, useEffect } from 'react';
import { Shuffle, Trash, Plus, Zap, AlertCircle } from 'lucide-react';
import NameGenerator from './NameGenerator'; // Importing the name generator component
import PortraitSelector from './PortraitSelector'; // Import the portrait selector component that uses actual JPG files

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

  // Roll for starting credits
  const rollCredits = () => {
    const die1 = Math.floor(Math.random() * 10) + 1;
    const die2 = Math.floor(Math.random() * 10) + 1;

    // Standard credits formula: 2d10 × 10
    const baseCredits = (die1 + die2) * 10;

    // Bonus credits for Merchant Clan background
    const bonusCredits = character.background?.id === 'merchant-clan' ? 50 : 0;

    setCredits(baseCredits + bonusCredits);
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
  };

  // Remove equipment item
  const removeEquipmentItem = (itemId) => {
    setEquipment(equipment.filter(item => item.id !== itemId));
  };

  // Generate signature gadget
  const generateSignatureGadget = () => {
    const adjective = ATOMIC_ADJECTIVES[Math.floor(Math.random() * ATOMIC_ADJECTIVES.length)];
    const component = TECHNO_COMPONENTS[Math.floor(Math.random() * TECHNO_COMPONENTS.length)];
    const designation = SERIES_DESIGNATIONS[Math.floor(Math.random() * SERIES_DESIGNATIONS.length)];

    const gadgetName = `${adjective}${component} ${designation} ${gadgetBaseItem}`;

    // Generate effects based on the components
    const effects = generateGadgetEffects(adjective, component, designation);

    setSignatureGadget({
      name: gadgetName,
      baseItem: gadgetBaseItem,
      adjective,
      component,
      designation,
      effects
    });
  };

  // Generate effects for signature gadget
  const generateGadgetEffects = (adjective: string, component: string, designation: string): string[] => {
      const effects: string[] = [];

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
    if (!character.profession) return;

    // This would be replaced with actual data from the profession
    const professionEquipment: { id: string; name: string; category: string; quantity: number }[] = [];

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
    }

    // Add equipment without duplicating
    const existingIds = equipment.map(item => item.id);
    const newEquipment = professionEquipment.filter(item => !existingIds.includes(item.id));

    setEquipment([...equipment, ...newEquipment]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Step 3: Equipment & Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Character Details */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Character Details</h3>

            <div className="space-y-4">
              {/* Name */}
              <NameGenerator name={name} setName={setName} />
              
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* Appearance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appearance</label>
                <textarea
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Describe your character's appearance"
                ></textarea>
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Describe your character's personality traits"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Character Portrait */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <PortraitSelector 
              selectedPortrait={selectedPortrait} 
              onSelectPortrait={setSelectedPortrait} 
            />
          </div>
        </div>

        {/* Equipment Panel */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800">Equipment</h3>

              <div className="flex items-center space-x-3">
                <button
                  onClick={loadProfessionEquipment}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Load Profession Equipment
                </button>

                <div className="bg-yellow-100 px-3 py-1 rounded text-yellow-800 font-medium flex items-center">
                  <span className="mr-1">Cr:</span> {credits}
                  <button
                    onClick={rollCredits}
                    className="ml-2 p-1 bg-yellow-200 rounded hover:bg-yellow-300"
                    title="Roll credits"
                  >
                    <Shuffle size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="mb-4 flex items-start space-x-2">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="New equipment item..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />

              <button
                onClick={addEquipmentItem}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Add item"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Equipment List */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b grid grid-cols-12 font-medium text-gray-700">
                <div className="col-span-6">Item</div>
                <div className="col-span-4">Category</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-1"></div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {equipment.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 italic">
                    No equipment added yet
                  </div>
                ) : (
                  equipment.map(item => (
                    <div key={item.id} className="p-3 border-b grid grid-cols-12 items-center hover:bg-gray-50">
                      <div className="col-span-6">{item.name}</div>
                      <div className="col-span-4 text-sm">{item.category}</div>
                      <div className="col-span-1 text-center">{item.quantity}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeEquipmentItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Signature Gadget */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800">Signature Gadget</h3>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={gadgetBaseItem}
                  onChange={(e) => setGadgetBaseItem(e.target.value)}
                  placeholder="Base item..."
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                />

                <button
                  onClick={generateSignatureGadget}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center"
                >
                  <Zap size={16} className="mr-1" />
                  Generate
                </button>
              </div>
            </div>

            {signatureGadget ? (
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 border border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-2">{signatureGadget.name}</h4>

                <div className="space-y-2 mb-4">
                  {signatureGadget.effects.map((effect, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-200 flex-shrink-0 flex items-center justify-center text-purple-800 font-bold text-xs mt-0.5 mr-2">
                        {index + 1}
                      </div>
                      <p className="text-sm text-purple-800">{effect}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSignatureGadget(null)}
                    className="text-sm text-purple-700 hover:text-purple-900"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                <p>Generate a unique signature gadget for your character!</p>
                <p className="text-sm mt-1">Enter a base item (like "Pistol" or "Scanner") and click Generate.</p>
              </div>
            )}

            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <AlertCircle size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Your signature gadget is a distinctive piece of technology that makes your character unique.
                  Its atomic-age styling and special capabilities will help define your character's approach to problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;