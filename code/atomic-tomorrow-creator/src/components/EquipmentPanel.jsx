import React, { useState, useEffect } from 'react';
import { Shuffle, Trash, Plus } from 'lucide-react';
import { PROFESSION_EQUIPMENT } from '../data/descriptions';

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

// Equipment Panel Component
const EquipmentPanel = ({ character, updateCharacter }) => {
  // State for equipment
  const [equipment, setEquipment] = useState(character.equipment || []);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Miscellaneous');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  // State for credits
  const [credits, setCredits] = useState(character.credits || 0);

  // Update character in parent component when equipment or credits change
  useEffect(() => {
    updateCharacter({
      ...character,
      equipment,
      credits
    });
  }, [equipment, credits]);

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

  // Load profession equipment
  const loadProfessionEquipment = () => {
    if (!character.profession) return;
    
    // Get equipment based on profession ID, or use default if no match
    const profId = character.profession.id;
    const professionItems = PROFESSION_EQUIPMENT[profId] || PROFESSION_EQUIPMENT['default'];
    
    if (!professionItems || professionItems.length === 0) return;
    
    // Add IDs to the items
    const itemsWithIds = professionItems.map(item => ({
      ...item,
      id: `prof-${profId}-${item.name.replace(/\s+/g, '-').toLowerCase()}`
    }));

    // Add equipment without duplicating (check by name)
    const existingNames = equipment.map(item => item.name);
    const newEquipment = itemsWithIds.filter(item => !existingNames.includes(item.name));

    setEquipment([...equipment, ...newEquipment]);
  };

  // CRT effect styles
  const crtStyles = {
    scanline: {
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
      backgroundSize: '100% 4px',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      animation: 'scanlines 1s linear infinite'
    },
    terminal: {
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.4)',
      border: '2px solid #14532d',
      backgroundColor: '#0a0a0a',
      borderRadius: '0.375rem',
      position: 'relative',
      overflow: 'hidden'
    }
  };

  return (
    <div className="rounded-lg overflow-hidden mb-6 bg-gray-800 border border-green-900"
         style={{ boxShadow: '0 0 15px rgba(22, 163, 74, 0.4), inset 0 0 10px rgba(22, 163, 74, 0.2)' }}>
      <div className="panel-header text-white py-2 px-4 font-bold flex items-center justify-between"
           style={{ background: 'linear-gradient(to right, #0f172a, #166534, #0f172a)', textShadow: '0 0 10px rgba(74, 222, 128, 0.8)' }}>
        <div>EQUIPMENT</div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadProfessionEquipment}
            className="glowing-button px-3 py-1 rounded text-sm flex items-center"
            style={{
              backgroundColor: '#202020',
              color: '#4ade80',
              border: '1px solid #14532d',
              boxShadow: '0 0 10px rgba(22, 163, 74, 0.5)',
              textShadow: '0 0 5px rgba(74, 222, 128, 0.8)'
            }}
          >
            <Plus size={16} className="mr-1" />
            Load Profession Gear
          </button>

          <div className="flex items-center">
            <div className="relative bg-gray-900 px-3 py-1 rounded-l border border-yellow-600"
                 style={{ boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.6)' }}>
              <span className="text-yellow-400 font-medium">{credits}</span>
              <span className="ml-1 text-xs text-yellow-500">Cr</span>
            </div>
            <button
              onClick={rollCredits}
              className="px-2 py-1 bg-yellow-800 text-yellow-200 rounded-r flex items-center"
              style={{ boxShadow: '0 0 8px rgba(202, 138, 4, 0.5)' }}
              title="Roll credits"
            >
              <Shuffle size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-start space-x-2">
          <div className="flex-grow relative" style={{ ...crtStyles.terminal }}>
            <div style={crtStyles.scanline}></div>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="New equipment item..."
              className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none"
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)' }}
            />
          </div>

          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="terminal-input px-3 py-2 rounded bg-gray-900 border-green-800 text-green-400"
            style={{ 
              textShadow: '0 0 5px rgba(74, 222, 128, 0.7)', 
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.4), inset 0 0 8px rgba(0, 0, 0, 0.6)',
              border: '2px solid #14532d'
            }}
          >
            {EQUIPMENT_CATEGORIES.map(category => (
              <option key={category} value={category} className="bg-gray-900">{category}</option>
            ))}
          </select>

          <div className="relative w-20" style={{ ...crtStyles.terminal }}>
            <div style={crtStyles.scanline}></div>
            <input
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
              min="1"
              max="99"
              className="w-full px-3 py-2 bg-transparent text-green-400 relative z-10 focus:outline-none text-center"
              style={{ textShadow: '0 0 5px rgba(74, 222, 128, 0.7)' }}
            />
          </div>

          <button
            onClick={addEquipmentItem}
            className="glowing-button px-3 py-2 rounded"
            style={{
              backgroundColor: '#202020',
              color: '#4ade80',
              border: '1px solid #14532d',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.4)',
              textShadow: '0 0 5px rgba(0, 255, 0, 0.8)'
            }}
            title="Add item"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Equipment List */}
      <div className="bg-gray-800">
        <div className="p-3 grid grid-cols-12 font-medium text-green-500 border-b border-gray-700 bg-gray-900">
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
              <div key={item.id} className="equipment-item p-3 grid grid-cols-12 items-center">
                <div className="col-span-6 text-green-300">{item.name}</div>
                <div className="col-span-4 text-sm text-gray-400">{item.category}</div>
                <div className="col-span-1 text-center text-green-300">{item.quantity}</div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeEquipmentItem(item.id)}
                    className="text-red-600 hover:text-red-500 hover:glow-effect-red"
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

      <style>{`
        .glowing-button {
          transition: all 0.3s ease;
        }
        
        .glowing-button:hover {
          background-color: #303030;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
        }
        
        .equipment-item {
          border-bottom: 1px solid #1f2937;
          transition: all 0.2s ease;
        }
        
        .equipment-item:hover {
          background-color: rgba(75, 85, 99, 0.4);
        }
        
        .hover\\:glow-effect-red:hover {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
        }
        
        .terminal-input {
          font-family: monospace;
        }
        
        .terminal-input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
        }
        
        .panel-header {
          letter-spacing: 1px;
        }
        
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
      `}</style>
    </div>
  );
};

export default EquipmentPanel;