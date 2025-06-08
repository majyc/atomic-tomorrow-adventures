import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Calendar, User, Share2 } from 'lucide-react';
import { getSavedCharacters, loadCharacter, deleteCharacter, getStorageStats } from '../utils/characterStorage';
import { exportCharacter, copyToClipboard } from '../utils/characterIOUtils';

const CharacterLibrary = ({ onClose, onLoad }) => {
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [storageStats, setStorageStats] = useState({ characterCount: 0, dataSizeFormatted: '0 B' });

  useEffect(() => {
    loadSavedCharacters();
  }, []);

  const loadSavedCharacters = () => {
    const characters = getSavedCharacters();
    setSavedCharacters(characters);
    setStorageStats(getStorageStats());
  };

  const handleLoadCharacter = (saveId) => {
    const character = loadCharacter(saveId);
    if (character) {
      onLoad(character);
      onClose();
    } else {
      alert('Failed to load character.');
    }
  };

  const handleDeleteCharacter = (saveId, characterName) => {
    if (window.confirm(`Are you sure you want to delete "${characterName}"? This cannot be undone.`)) {
      if (deleteCharacter(saveId)) {
        loadSavedCharacters();
      } else {
        alert('Failed to delete character.');
      }
    }
  };

  const handleExportCharacter = (character, characterName) => {
    try {
      const exportString = exportCharacter(character);
      
      if (copyToClipboard(exportString)) {
        alert(`"${characterName}" exported to clipboard! You can paste and save this code to import the character later.`);
      } else {
        alert('Failed to copy to clipboard. Here\'s your character code:\n\n' + exportString);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export character: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getCharacterSummary = (character) => {
    const epithet = character.epithet?.name || 'Unknown';
    const profession = character.profession?.name || 'Unknown';
    const origin = character.origin?.name || 'Unknown';
    return `${epithet} ${profession} from ${origin}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-blue-600"
        style={{ boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)' }}>
        
        {/* Header */}
        <div className="bg-blue-900 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <User size={24} className="mr-3 text-blue-300" />
            <div>
              <h2 className="text-xl font-bold text-white">Character Library</h2>
              <p className="text-sm text-blue-300">
                {storageStats.characterCount} saved characters • {storageStats.dataSizeFormatted} used
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {savedCharacters.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Saved Characters</h3>
              <p className="text-gray-500">
                Create a character and use the Save button to store it here for quick access later.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedCharacters.map((save) => (
                <div
                  key={save.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-600 transition-colors p-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Character Portrait */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-700"
                        style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)' }}
                      >
                        {save.character.portrait ? (
                          <img
                            src={save.character.portrait.path}
                            alt={`${save.name} portrait`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-gray-600 to-blue-900 flex items-center justify-center ${save.character.portrait ? 'hidden' : 'flex'}`}
                        >
                          <span className="text-white text-lg font-bold">
                            {save.name ? save.name.charAt(0).toUpperCase() : 'C'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Character Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-blue-400 text-lg mb-1 truncate">
                        {save.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {getCharacterSummary(save.character)}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>Last modified: {formatDate(save.lastModified)}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleLoadCharacter(save.id)}
                        className="flex items-center px-3 py-2 bg-blue-800 text-blue-300 rounded hover:bg-blue-700 transition-colors text-sm"
                        style={{ boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }}
                      >
                        <Upload size={14} className="mr-1" />
                        Load
                      </button>
                      <button
                        onClick={() => handleExportCharacter(save.character, save.name)}
                        className="flex items-center px-3 py-2 bg-green-800 text-green-300 rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        <Share2 size={14} className="mr-1" />
                        Export
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(save.id, save.name)}
                        className="flex items-center px-3 py-2 bg-red-800 text-red-300 rounded hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Characters are saved to your browser's local storage and persist between sessions.
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterLibrary;