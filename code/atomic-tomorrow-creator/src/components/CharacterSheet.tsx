import React, { useState, useRef } from 'react';
import { Download, Printer, Share2, Edit, AlertCircle, Shield, Zap, Crosshair, Brain, Eye, Database, Skull, Heart } from 'lucide-react';

// Character Sheet Component with print functionality
const CharacterSheet = ({ character, updateCharacter }) => {
  // State for calculated skills and print mode
  const [calculatedSkills, setCalculatedSkills] = useState({});
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const sheetRef = useRef(null);
  
  // Calculate skills based on character choices
  React.useEffect(() => {
    if (!character.attributes || !character.profession || !character.origin || !character.background) return;
    
    // Skill calculation logic
    const skills = calculateSkills(character);
    setCalculatedSkills(skills);
  }, [character]);
  
  // Function to calculate skills based on character attributes, profession, origin, and background
  const calculateSkills = (character) => {
    // Simplified skill calculator
    const skills = {
      "Piloting (Spacecraft)": {
        value: Math.min(99, ((character.attributes.REFLEX || 10) * 2) + 40),
        source: character.profession?.name || "Profession"
      },
      "Technology (Ship Systems)": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 20),
        source: character.profession?.name || "Profession"
      },
      "Navigation (Space)": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 10),
        source: character.profession?.name || "Profession"
      },
      "Combat (Pistols)": {
        value: Math.min(99, ((character.attributes.REFLEX || 10) * 2) + 10),
        source: character.profession?.name || "Profession"
      },
      "Zero-G Operations": {
        value: Math.min(99, ((character.attributes.REFLEX || 10) * 2) + 15),
        source: character.origin?.name || "Origin"
      },
      "Resource Management": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 10),
        source: character.origin?.name || "Origin"
      },
      "Asteroid Navigation": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 5),
        source: character.origin?.name || "Origin"
      },
      "Negotiation": {
        value: Math.min(99, ((character.attributes.CHARM || 10) * 2) + 10),
        source: character.background?.name || "Background"
      },
      "Market Analysis": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 10),
        source: character.background?.name || "Background"
      },
      "Appraisal": {
        value: Math.min(99, ((character.attributes.SAVVY || 10) * 2) + 5),
        source: character.background?.name || "Background"
      },
      "Solar Scouts Training (Combat)": {
        value: ((character.attributes.REFLEX || 10) * 2) + 15,
        source: "Standard Training"
      }
    };
    
    return skills;
  };
  
  // Format skills for display - sort by value in descending order
  const formattedSkills = () => {
    return Object.entries(calculatedSkills)
      .sort(([, a], [, b]) => b.value - a.value);
  };
  
  // Get the skill derivation formula as a readable string
  const getSkillDerivation = (skillData, attribute) => {
    // Handle FLEX attribute specially
    if (attribute === 'FLEX') {
      const baseValue = 20; // Standard for FLEX attributes
      const bonusValue = skillData.value - baseValue;
      return `(FLEX: 20) + ${bonusValue > 0 ? bonusValue : 0}`;
    }
    
    const baseValue = (character.attributes?.[attribute] || 10) * 2;
    const bonusValue = skillData.value - baseValue;
    
    return `(${attribute}: ${character.attributes?.[attribute] || 10} × 2) + ${bonusValue > 0 ? bonusValue : 0}`;
  };
  
  // Find the governing attribute for a skill
  const getSkillAttribute = (skillName) => {
    // This is a simplified mapping - in a real app you'd have a more complete data structure
    if (skillName.includes('Combat') || skillName.includes('Piloting') || skillName.includes('Reflex')) return 'REFLEX';
    if (skillName.includes('Technology') || skillName.includes('Navigation') || skillName.includes('Analysis')) return 'SAVVY';
    if (skillName.includes('Negotiation')) return 'CHARM';
    if (skillName.includes('Survival')) return 'GRIT';
    if (skillName.includes('Zero-G')) return 'REFLEX';
    if (skillName.includes('Appraisal') || skillName.includes('Market Analysis')) return 'SAVVY';
    if (skillName.includes('Trade')) return 'FLEX';
    if (skillName.includes('Academics')) return 'FLEX';
    
    return 'SAVVY'; // Default
  };
  
  // Get color for attribute value
  const getAttributeColor = (value) => {
    if (value >= 14) return isPrintMode ? "font-bold" : "text-green-500";
    if (value >= 12) return isPrintMode ? "font-bold" : "text-green-400";
    if (value >= 9) return isPrintMode ? "" : "text-gray-300";
    if (value >= 7) return isPrintMode ? "text-gray-700" : "text-yellow-400";
    return isPrintMode ? "text-gray-700" : "text-red-400";
  };
  
  // Get skill level name
  const getSkillLevelName = (value) => {
    if (value >= 96) return "Legendary";
    if (value >= 76) return "Master";
    if (value >= 51) return "Professional";
    if (value >= 26) return "Competent";
    if (value > 0) return "Novice";
    return "Untrained";
  };
  
  // Get skill level color
  const getSkillLevelColor = (value) => {
    if (!isPrintMode) {
      if (value >= 96) return "text-purple-400";
      if (value >= 76) return "text-blue-400";
      if (value >= 51) return "text-green-400";
      if (value >= 26) return "text-yellow-400";
      if (value > 0) return "text-orange-400";
      return "text-gray-500";
    } else {
      if (value >= 76) return "font-bold";
      return "";
    }
  };
  
  // Equipment list
  const equipmentList = character.equipment || [
    "Custom flight jacket with personal insignia",
    "Pilot's chronometer (precision timepiece)",
    "Personal navigation computer",
    "Light Ray Pistol",
    "Emergency survival kit",
    "Trade guild credentials"
  ];
  
  // Print function that uses a dedicated printable iframe
  const handlePrint = () => {
    // Create a new iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.id = 'printFrame';
    document.body.appendChild(printFrame);
    
    // Generate the printable content
    const printDoc = printFrame.contentDocument || printFrame.contentWindow.document;
    printDoc.open();
    
    // Create a simplified, print-friendly version of the character sheet
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${character.name || 'Character'} - Atomic Tomorrow</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: black;
            background: white;
            padding: 20px;
            margin: 0;
          }
          h1, h2, h3, h4 {
            margin-top: 0;
            color: black;
          }
          .character-header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .section {
            border: 1px solid #333;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .section-header {
            background: #eee;
            padding: 5px 10px;
            font-weight: bold;
            border-bottom: 1px solid #333;
          }
          .section-content {
            padding: 10px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .attr-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .skill-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .attribute {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .skill {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .skill-source {
            font-size: 0.8em;
            color: #666;
          }
          .special-ability {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #666;
          }
          .wound-track {
            display: flex;
            margin-top: 5px;
          }
          .wound-box {
            width: 20px;
            height: 20px;
            border: 2px solid #333;
            margin-right: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @media print {
            body { 
              padding: 0;
            }
            .section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="character-header">
          <h1>${character.name || 'Unnamed Character'}</h1>
          <h3>
            ${character.epithet?.name || 'Epithet'} 
            ${character.profession?.name || 'Profession'} from 
            ${character.origin?.name || 'Origin'} with a 
            ${character.background?.name || 'Background'} background
          </h3>
        </div>
        
        <div class="grid">
          <!-- Left Column -->
          <div>
            <!-- Attributes -->
            <div class="section">
              <div class="section-header">ATTRIBUTES</div>
              <div class="section-content">
                <div class="attr-grid">
                  ${['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE']
                    .map(attr => `
                      <div class="attribute">
                        <span>${attr}</span>
                        <span>${character.attributes?.[attr] || 10}</span>
                      </div>
                    `).join('')}
                </div>
              </div>
            </div>
            
            <!-- Derived Stats -->
            <div class="section">
              <div class="section-header">DERIVED STATISTICS</div>
              <div class="section-content">
                <div class="attr-grid">
                  <div class="attribute">
                    <span>Initiative</span>
                    <span>${(character.attributes?.REFLEX || 10) * 5}%</span>
                  </div>
                  <div class="attribute">
                    <span>Damage Soak</span>
                    <span>${(character.attributes?.GRIT || 10) * 5}%</span>
                  </div>
                  <div class="attribute">
                    <span>Solar Scouts Training</span>
                    <span>${((character.attributes?.REFLEX || 10) * 2) + 15}%</span>
                  </div>
                  <div class="attribute">
                    <span>Wound Track</span>
                    <div class="wound-track">
                      ${Array.from({ length: character.epithet?.id === 'grizzled' ? 5 : 4 }).map((_, i) => `
                        <div class="wound-box">
                          ${i === 0 ? '♥' : ''}
                          ${i === (character.epithet?.id === 'grizzled' ? 4 : 3) ? '☠' : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Special Abilities -->
            <div class="section">
              <div class="section-header">SPECIAL ABILITIES</div>
              <div class="section-content">
                <div class="special-ability">
                  <h4>${character.epithet?.name || "Epithet Ability"}</h4>
                  <p>${character.epithet?.benefit || "Select an epithet to see its special ability"}</p>
                </div>
                
                ${character.signatureGadget ? `
                <div class="special-ability">
                  <h4>Signature Gadget: ${character.signatureGadget.name}</h4>
                  <ul>
                    ${character.signatureGadget.effects.map(effect => `<li>${effect}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
              </div>
            </div>
            
            <!-- Equipment -->
            <div class="section">
              <div class="section-header">EQUIPMENT</div>
              <div class="section-content">
                <p><strong>Credits:</strong> ${character.credits || 0} Cr</p>
                <ul>
                  ${equipmentList.map(item => `
                    <li>${typeof item === 'string' ? item : item.name}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div>
            <!-- Skills -->
            <div class="section">
              <div class="section-header">SKILLS</div>
              <div class="section-content">
                <div class="skill-grid">
                  ${formattedSkills().map(([skillName, skillData]) => `
                                            <div class="skill">
                      <div>
                        <div>${skillName}</div>
                        <div class="skill-source">From: ${skillData.source}</div>
                        <div class="skill-source">Formula: ${getSkillDerivation(skillData, getSkillAttribute(skillName))}</div>
                      </div>
                      <div>
                        <div><strong>${skillData.value}%</strong></div>
                        <div>${getSkillLevelName(skillData.value)}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                
                <p style="margin-top: 10px; font-size: 0.9em;">
                  <strong>About Skills:</strong> Skills are calculated using: (Attribute × 2) + Bonus from Source.
                </p>
              </div>
            </div>
            
            <!-- Character Details -->
            <div class="section">
              <div class="section-header">CHARACTER DETAILS</div>
              <div class="section-content">
                <h4>Appearance</h4>
                <p>${character.appearance || "No appearance details provided."}</p>
                
                <h4>Personality</h4>
                <p>${character.personality || "No personality details provided."}</p>
                
                <h4>Origin: ${character.origin?.name || "None"}</h4>
                <p>${character.origin?.description || "No origin selected."}</p>
                
                <h4>Background: ${character.background?.name || "None"}</h4>
                <p>${character.background?.description || "No background selected."}</p>
              </div>
            </div>
            
            <!-- Notes -->
            <div class="section">
              <div class="section-header">NOTES & CONNECTIONS</div>
              <div class="section-content">
                <p>${notes || "No notes recorded."}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Generated with Atomic Tomorrow Character Creator</p>
          <p>The Atomic Tomorrow Adventures Role-Playing Game &copy; 2025</p>
        </div>
      </body>
      </html>
    `;
    
    printDoc.write(printContent);
    printDoc.close();
    
    // Wait for the iframe to load before printing
    printFrame.onload = function() {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (e) {
          console.error('Print error:', e);
        }
        
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 500);
    };
  };
  
  // Save as PDF function (using browser print to PDF)
  const handleSavePDF = () => {
    // Same functionality as print
    handlePrint();
  };
  
  // Character export/import functions
  const exportCharacter = () => {
    try {
      // Create a simplified object with just the essential data
      const exportData = {
        v: 1, // Version number for future compatibility
        n: character.name || '',
        e: character.epithet?.id || '',
        p: character.profession?.id || '',
        o: character.origin?.id || '',
        b: character.background?.id || '',
        a: { // Attributes
          br: character.attributes?.BRAWN || 10,
          re: character.attributes?.REFLEX || 10,
          ne: character.attributes?.NERVE || 10,
          sa: character.attributes?.SAVVY || 10,
          ch: character.attributes?.CHARM || 10,
          gr: character.attributes?.GRIT || 10,
          gu: character.attributes?.GUILE || 10
        },
        ap: character.appearance || '',
        ps: character.personality || '',
        ag: character.age || 30,
        po: character.portrait?.id || '',
        cr: character.credits || 0,
        eq: character.equipment?.map(item => ({
          n: item.name,
          c: item.category,
          q: item.quantity
        })) || [],
        sg: character.signatureGadget ? {
          n: character.signatureGadget.name,
          b: character.signatureGadget.baseItem,
          e: character.signatureGadget.effects
        } : null,
        nt: notes || ''
      };
      
      // Convert to JSON and then to base64
      const jsonString = JSON.stringify(exportData);
      
      // Simple run-length encoding for compression
      const compressed = compressString(jsonString);
      
      // Convert to base64 for safer transport
      const base64String = btoa(compressed);
      
      // Format with prefix for identification
      const exportString = `AT-CHAR-${base64String}`;
      
      // Create a text area with the export string
      const textArea = document.createElement('textarea');
      textArea.value = exportString;
      textArea.style.position = 'fixed';
      textArea.style.left = '0';
      textArea.style.top = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Copy to clipboard
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        alert('Character exported to clipboard! You can paste and save this code to import your character later.');
      } else {
        alert('Failed to copy to clipboard. Here\'s your character code:\n\n' + exportString);
      }
      
      return exportString;
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export character: ' + error.message);
      return null;
    }
  };
  
  // Simple compression function using run-length encoding
  const compressString = (input) => {
    let result = '';
    let count = 1;
    let char = input[0];
    
    for (let i = 1; i <= input.length; i++) {
      if (i < input.length && input[i] === char) {
        count++;
      } else {
        // If count is 3 or more, use run-length encoding
        if (count >= 3) {
          result += char + '*' + count;
        } else {
          // Otherwise just add the characters
          result += char.repeat(count);
        }
        char = input[i];
        count = 1;
      }
    }
    
    return result;
  };
  
  // Decompression function for potential import feature
  const decompressString = (input) => {
    let result = '';
    let i = 0;
    
    while (i < input.length) {
      if (i + 2 < input.length && input[i+1] === '*') {
        // This is a compressed sequence
        const char = input[i];
        let countStr = '';
        i += 2; // Skip the character and the '*'
        
        // Read the count
        while (i < input.length && /\d/.test(input[i])) {
          countStr += input[i];
          i++;
        }
        
        const count = parseInt(countStr, 10);
        result += char.repeat(count);
      } else {
        // Regular character
        result += input[i];
        i++;
      }
    }
    
    return result;
  };
  
  // Import character function (for future implementation)
  const importCharacter = (importString) => {
    try {
      // Extract the base64 string (remove the prefix)
      if (!importString.startsWith('AT-CHAR-')) {
        throw new Error('Invalid character code format');
      }
      
      const base64String = importString.substring(8);
      
      // Decode from base64
      const compressed = atob(base64String);
      
      // Decompress
      const jsonString = decompressString(compressed);
      
      // Parse the JSON
      const importData = JSON.parse(jsonString);
      
      // TODO: Implement full character import by mapping the data back to the character object
      // This would require access to the full datasets (EPITHETS, PROFESSIONS, etc.)
      
      alert('Character import is not yet implemented. Parsed data: ' + JSON.stringify(importData));
      
      return importData;
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import character: ' + error.message);
      return null;
    }
  };

  return (
    <div className={`${isPrintMode ? 'print-mode' : ''} transition-all duration-300`} ref={sheetRef}>
      {/* Print Styles - Simplified and more reliable */}
      <style jsx global>{`
        @media print {
          /* Hide everything except our character sheet */
          body > *:not(.print-mode) {
            display: none !important;
          }
          
          /* Main print styles */
          .print-mode {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            margin: 0;
            padding: 0;
          }
          
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
          
          /* Remove all decorative effects */
          .glow-effect {
            text-shadow: none !important;
            box-shadow: none !important;
            animation: none !important;
          }
          
          /* Reset all background colors to white */
          .bg-gray-900, .bg-gray-800, .bg-blue-900, .bg-blue-800,
          .bg-purple-900, .bg-purple-800, .bg-green-900, .bg-green-800,
          .bg-gray-300 {
            background-color: white !important;
          }
          
          /* Standardize all borders */
          .border, .border-blue-900, .border-purple-900, .border-green-900,
          .border-blue-800, .border-purple-800, .border-green-800,
          .border-gray-700, .border-gray-600 {
            border-color: #333 !important;
            border-width: 1px !important;
          }
          
          /* Change all text to black */
          .text-white, .text-blue-100, .text-blue-200, .text-blue-300, .text-blue-400, 
          .text-blue-800, .text-green-100, .text-green-200, .text-green-300, 
          .text-green-400, .text-green-800, .text-purple-100, .text-purple-200, 
          .text-purple-300, .text-purple-400, .text-purple-800, .text-yellow-400, 
          .text-orange-400, .text-red-400, .text-gray-400, .text-gray-300, .text-gray-200 {
            color: black !important;
          }
          
          /* Add page margin for printing */
          .character-sheet-content {
            padding: 0.5cm !important;
          }
        }
        
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
        
        .glow-effect {
          animation: glow 3s infinite;
        }
        
        .wound-track-box {
          width: 25px;
          height: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          border: 2px solid;
        }
        
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
        
        .glow-effect {
          animation: glow 3s infinite;
        }
        
        .wound-track-box {
          width: 25px;
          height: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          border: 2px solid;
        }
      `}</style>

      {/* Actions Toolbar */}
      <div className={`bg-blue-900 py-3 px-6 text-white flex justify-between items-center sticky top-0 z-10 no-print ${isPrintMode ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-bold flex items-center" style={{ textShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }}>
          <Database className="mr-2" />
          Character Sheet
        </h1>
        <div className="flex space-x-4">
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-1" />
            Print
          </button>
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={handleSavePDF}
          >
            <Download size={16} className="mr-1" />
            Save PDF
          </button>
          <button 
            className="raygun-button flex items-center px-3 py-1.5"
            onClick={exportCharacter}
          >
            <Share2 size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {/* Character Sheet Content */}
      <div className={`character-sheet-content max-w-5xl mx-auto px-6 py-6 ${isPrintMode ? 'bg-white text-black' : 'bg-gray-900 text-gray-100'}`}>
        {/* Header Section */}
        <div className={`mb-8 flex justify-between items-start border-b ${isPrintMode ? 'border-gray-400' : 'border-blue-800'} pb-4`}>
          <div className="flex-1">
            <h1 className={`text-4xl font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'}`} style={!isPrintMode ? { textShadow: '0 0 10px rgba(96, 165, 250, 0.6)' } : {}}>
              {character.name || "UNNAMED CHARACTER"}
            </h1>
            <h2 className="text-xl text-gray-300 mt-1">
              <span className={isPrintMode ? 'text-black' : 'text-blue-400'}>{character.epithet?.name || "Epithet"}</span>{" "}
              <span className={isPrintMode ? 'text-black' : 'text-green-400'}>{character.profession?.name || "Profession"}</span> from{" "}
              <span className={isPrintMode ? 'text-black' : 'text-yellow-400'}>{character.origin?.name || "Origin"}</span> with a{" "}
              <span className={isPrintMode ? 'text-black' : 'text-red-400'}>{character.background?.name || "Background"}</span>
            </h2>
          </div>
          
          <div className={`w-24 h-24 ${isPrintMode ? 'bg-gray-300' : 'bg-gray-700'} rounded-full overflow-hidden flex items-center justify-center border-2 ${isPrintMode ? 'border-gray-500' : 'border-blue-700 glow-effect'}`}>
            <div className={`w-full h-full ${character.portrait?.style || 'bg-blue-600'}`}></div>
          </div>
        </div>
        
        {/* CLASSIFIED Stamp - Decorative (hidden in print mode) */}
        {!isPrintMode && (
          <div className="absolute top-24 right-10 transform rotate-12 opacity-20 pointer-events-none no-print">
            <div className="border-8 border-red-600 text-red-600 px-6 py-2 rounded-md">
              <p className="text-5xl font-black tracking-widest">CLASSIFIED</p>
            </div>
          </div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Attributes and Core Stats */}
          <div className="col-span-4">
            {/* Attributes Panel */}
            <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                <Brain size={18} className="mr-2" />
                ATTRIBUTES
              </div>
              
              <div className="p-4 space-y-2">
                {['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => (
                  <div key={attr} className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                    <div className="font-medium">{attr}</div>
                    <div className={`flex items-center ${getAttributeColor(character.attributes?.[attr] || 10)}`}>
                      <div className={`text-xl font-bold`}>
                        {character.attributes?.[attr] || 10}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Derived Statistics */}
            <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                <Database size={18} className="mr-2" />
                DERIVED STATISTICS
              </div>
              
              <div className="p-4 space-y-2">
                <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                  <div className="font-medium">Initiative</div>
                  <div className="text-xl font-bold">{(character.attributes?.REFLEX || 10) * 5}%</div>
                </div>
                
                <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                  <div className="font-medium">Damage Soak</div>
                  <div className="text-xl font-bold">{(character.attributes?.GRIT || 10) * 5}%</div>
                </div>
                
                <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                  <div className="font-medium">Solar Scouts Training</div>
                  <div className="text-xl font-bold">{((character.attributes?.REFLEX || 10) * 2) + 15}%</div>
                </div>
                
                <div className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}>
                  <div className="font-medium">Wound Track</div>
                  <div className="text-xl flex items-center">
                    {/* Wound track boxes */}
                    {Array.from({ length: character.epithet?.id === 'grizzled' ? 5 : 4 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`wound-track-box ${isPrintMode ? 'border-gray-700' : 'border-red-500'} rounded`} 
                        style={!isPrintMode ? { boxShadow: i === 0 ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none' } : {}}
                      >
                        {i === 0 && <Heart size={14} className={isPrintMode ? 'text-gray-700' : 'text-red-500'} />}
                        {i === (character.epithet?.id === 'grizzled' ? 4 : 3) && (
                          <Skull size={14} className={isPrintMode ? 'text-gray-700' : 'text-red-500'} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Special Abilities */}
            <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-purple-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-purple-900'} text-white py-2 px-4 font-bold flex items-center`}>
                <Zap size={18} className="mr-2" />
                SPECIAL ABILITIES
              </div>
              
              <div className="p-4">
                <div className={`rounded p-3 border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-purple-800'}`}>
                  <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-purple-300'} mb-1`}>
                    {character.epithet?.name || "Epithet Ability"}
                  </h3>
                  <p className={`text-sm ${isPrintMode ? 'text-gray-700' : 'text-purple-200'}`}>
                    {character.epithet?.benefit || "Select an epithet to see its special ability"}
                  </p>
                </div>
                
                {character.signatureGadget && (
                  <div className={`rounded p-3 border mt-4 ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'}`}>
                    <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-300'} mb-1`}>
                      Signature Gadget: {character.signatureGadget.name}
                    </h3>
                    <div className={`text-sm ${isPrintMode ? 'text-gray-700' : 'text-blue-200'} space-y-1`}>
                      {character.signatureGadget.effects.map((effect, idx) => (
                        <p key={idx}>• {effect}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Equipment List */}
            <div className={`rounded-lg overflow-hidden border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-green-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-green-900'} text-white py-2 px-4 font-bold flex items-center`}>
                <Shield size={18} className="mr-2" />
                EQUIPMENT
              </div>
              
              <div className="p-4">
                <div className={`rounded-lg p-3 border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-green-800'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`font-medium ${isPrintMode ? 'text-black' : 'text-green-400'}`}>Credits</span>
                    <span className={`font-bold ${isPrintMode ? 'text-black' : 'text-green-300'}`}>{character.credits || 0} Cr</span>
                  </div>
                  
                  <ul className="space-y-1 text-sm">
                    {equipmentList.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={isPrintMode ? "text-black mr-2" : "text-green-500 mr-2"}>•</span>
                        <span>{typeof item === 'string' ? item : item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Skills and Character Details */}
          <div className="col-span-8">
            {/* Skills Panel */}
            <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center justify-between`}>
                <div className="flex items-center">
                  <Crosshair size={18} className="mr-2" />
                  SKILLS (AUTOMATICALLY CALCULATED)
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {formattedSkills().map(([skillName, skillData], idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center p-2 ${isPrintMode ? 'bg-gray-100' : 'bg-gray-900'} rounded`}
                    >
                      <div>
                        <div className="font-medium">{skillName}</div>
                        <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          From: {skillData.source}
                        </div>
                        <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-400'}`} title="Skill Derivation">
                          Formula: {getSkillDerivation(skillData, getSkillAttribute(skillName))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg">{skillData.value}%</div>
                        <div className={`text-xs ${getSkillLevelColor(skillData.value)}`}>
                          {getSkillLevelName(skillData.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`mt-4 pt-4 border-t ${isPrintMode ? 'border-gray-300' : 'border-gray-700'}`}>
                  <div className={`p-3 rounded text-sm ${isPrintMode ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 text-blue-300'}`}>
                    <strong>About Skills:</strong> Skills are automatically calculated based on your character's attributes, profession, origin, and background. They use the formula: (Attribute × 2) + Bonus from Source.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Character Details */}
            <div className={`rounded-lg overflow-hidden mb-6 border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center`}>
                <Eye size={18} className="mr-2" />
                CHARACTER DETAILS
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>Appearance</h3>
                      <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                        {character.appearance || "No appearance details provided."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>Personality</h3>
                      <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                        {character.personality || "No personality details provided."}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>
                        Origin: {character.origin?.name}
                      </h3>
                      <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                        {character.origin?.description || "No origin selected."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className={`font-bold ${isPrintMode ? 'text-black' : 'text-blue-400'} mb-1`}>
                        Background: {character.background?.name}
                      </h3>
                      <p className={`p-2 rounded border ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'} text-sm`}>
                        {character.background?.description || "No background selected."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes Section */}
            <div className={`rounded-lg overflow-hidden border ${isPrintMode ? 'bg-white border-gray-400' : 'bg-gray-800 border-blue-900'}`}>
              <div className={`${isPrintMode ? 'bg-gray-300' : 'bg-blue-900'} text-white py-2 px-4 font-bold flex items-center justify-between`}>
                <div className="flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  NOTES & CONNECTIONS
                </div>
                
                <button 
                  className={`text-sm ${isPrintMode ? 'hidden' : 'bg-blue-800 hover:bg-blue-700'} px-2 py-1 rounded flex items-center no-print`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit size={14} className="mr-1" />
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4">
                {isEditing ? (
                  <textarea 
                    className={`w-full border rounded p-3 h-32 focus:outline-none focus:ring-2 
                      ${isPrintMode ? 'bg-gray-100 border-gray-300 text-black' : 'bg-gray-900 border-blue-800 text-white focus:ring-blue-500'}`}
                    placeholder="Record important notes, connections, and campaign events here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                ) : (
                  <div className={`w-full border rounded p-3 h-32 
                    ${isPrintMode ? 'bg-gray-100 border-gray-300' : 'bg-gray-900 border-blue-800'}`}>
                    {notes || "No notes recorded. Click 'Edit' to add your notes here."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className={`text-sm ${isPrintMode ? 'text-gray-800' : 'text-gray-400'}`}>
            Generated with Atomic Tomorrow Character Creator
          </div>
          <div className={`text-xs ${isPrintMode ? 'text-gray-600' : 'text-gray-500'} mt-1`}>
            The Atomic Tomorrow Adventures Role-Playing Game &copy; 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;