// Utility functions for printing character sheets

// Import centralized skill calculation functions
import { 
  calculateSimplifiedSkills, 
  getSkillAttribute, 
  getSkillDerivation, 
  getSkillLevelName 
} from './skillUtils';

/**
 * Creates a print-friendly version of the character sheet and prints it
 * @param character The character data
 * @param notes Additional notes to include in the print
 */
export const printCharacterSheet = (character, notes = '') => {
    // Create a new iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.id = 'printFrame';
    document.body.appendChild(printFrame);
    
    // Generate the printable content
    const printDoc = printFrame.contentDocument || (printFrame.contentWindow ? printFrame.contentWindow.document : null);
    if (!printDoc) {
        console.error('Unable to access the print document.');
        return;
    }
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
          <div class="left-column">
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
                    <span>35%</span>
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
                  ${(character.equipment || []).map(item => `
                    <li>${typeof item === 'string' ? item : item.name}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="right-column">
            <!-- Skills -->
            <div class="section">
              <div class="section-header">SKILLS</div>
              <div class="section-content">
                <div class="skill-grid">
                  ${renderSkillsForPrint(character)}
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
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          } else {
            console.error('Print frame content window is null.');
          }
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
  
  /**
   * Helper function to render skills in print format
   * Uses the centralized skill calculation utilities
   */
  const renderSkillsForPrint = (character) => {
    // Calculate skills using the centralized function
    const skills = calculateSimplifiedSkills(character);
    
    // Sort skills by value
    const sortedSkills = Object.entries(skills)
      .sort(([, a], [, b]) => b.value - a.value);
    
    return sortedSkills.map(([skillName, skillData]) => `
      <div class="skill">
        <div>
          <div>${skillName}</div>
          <div class="skill-source">From: ${skillData.source}</div>
          <div class="skill-source">Formula: ${getSkillDerivation(skillData, getSkillAttribute(skillName), character)}</div>
        </div>
        <div>
          <div><strong>${skillData.value}%</strong></div>
          <div>${getSkillLevelName(skillData.value)}</div>
        </div>
      </div>
    `).join('');
  };