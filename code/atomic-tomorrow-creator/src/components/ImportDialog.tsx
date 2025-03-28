import React, { useState } from 'react';
import { importCharacter } from '../utils/characterIOUtils';

interface ImportDialogProps {
  onClose: () => void;
  onImport: (character: any, notes: string) => void;
}

/**
 * Component that handles character import functionality
 */
const ImportDialog: React.FC<ImportDialogProps> = ({ onClose, onImport }) => {
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  
  const handleImport = () => {
    setImportError('');
    
    try {
      // Use the utility function to import the character
      const { character, notes } = importCharacter(importCode);
      
      // Pass the imported character and notes back to the parent
      onImport(character, notes);
      
      // Close the dialog
      onClose();
      
    } catch (error) {
      setImportError(error.message);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-blue-700" 
           style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}>
        <h3 className="text-xl font-bold text-blue-400 mb-4">Import Character</h3>
        
        <p className="text-gray-300 mb-4">Paste your character code below:</p>
        
        <textarea
          className="w-full px-3 py-2 bg-gray-900 border border-blue-700 rounded-md text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          placeholder="Paste AT-CHAR-... code here"
        ></textarea>
        
        {importError && (
          <div className="text-red-400 mt-2 mb-4 p-2 bg-red-900 bg-opacity-30 rounded border border-red-700">
            {importError}
          </div>
        )}
        
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleImport}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDialog;