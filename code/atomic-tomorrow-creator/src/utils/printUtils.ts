// Enhanced utility functions for printing character sheets

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

  // Create a print-friendly version matching the HTML character sheet layout
  let printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${character.name || 'Character'} - Atomic Tomorrow Adventures</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap');
        
        /* Reset and Base Setup */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #f5f5f5;
          font-family: 'Roboto Condensed', sans-serif;
          color: #333;
          line-height: 1.2;
        }
        
        /* Character Sheet Container */
        .character-sheet {
          width: 8.5in;
          height: 11in;
          margin: 0 auto;
          background: #fff;
          padding: 0.2in;
          position: relative;
          border: 1px solid #000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        /* Header Styling */
        .header {
          background: linear-gradient(to right, #1a2a38, #2c3e50, #1a2a38);
          color: #fff;
          padding: 0.1in 0;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
          margin-bottom: 0.1in;
          text-align: center;
        }
        
        .header::before, .header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
        }
        
        .header::before {
          top: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }
        
        .header::after {
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        
        .title {
          font-family: 'Orbitron', sans-serif;
          font-size: 22pt;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
        }
        
        /* Character Banner Section */
        .character-banner-section {
          padding: 0.1in;
          margin-bottom: 0.15in;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .character-banner-section .character-info {
          flex: 1;
        }
        
        .character-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 16pt;
          font-weight: 700;
          margin: 0 0 0.02in 0;
          color: #2c3e50;
        }
        
        .character-subtitle {
          font-size: 12pt;
          margin: 0;
          color: #34495e;
        }
        
        .portrait-container {
          position: relative;
          width: 1.5in;
          height: 1.5in;
        }
        
        .portrait-area {
          width: 1.2in;
          height: 1.2in;
          border: 4px solid #2980b9;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8em;
          color: #7f8c8d;
          overflow: hidden;
          position: absolute;
          top: 0.15in;
          left: 0.15in;
          z-index: 3;
          box-shadow: 0 0 15px rgba(41, 128, 185, 0.5);
        }
        
        .portrait-ring-1 {
          position: absolute;
          width: 1.35in;
          height: 1.35in;
          border: 2px solid #2980b9;
          border-radius: 50%;
          top: 0.075in;
          left: 0.075in;
          opacity: 0.7;
          z-index: 1;
        }
        
        .portrait-ring-2 {
          position: absolute;
          width: 1.45in;
          height: 1.45in;
          border: 1px solid #2980b9;
          border-radius: 50%;
          top: 0.025in;
          left: 0.025in;
          opacity: 0.4;
          z-index: 0;
        }
        
        /* Character Info Section */
        .character-info {
          width: 100%;
          padding: 0.1in;
          background-color: #e8f4fc;
          border: 1px solid #2980b9;
          border-radius: 5px;
          margin-bottom: 0.15in;
        }
        
        .character-info-row {
          display: flex;
          gap: 0.1in;
          margin-bottom: 0.05in;
        }
        
        .character-info-row:last-child {
          margin-bottom: 0;
        }
        
        .input-field {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .input-field label {
          font-weight: bold;
          min-width: 0.8in;
          font-size: 10pt;
        }
        
        .input-field .value {
          flex: 1;
          border-bottom: 1px solid #888;
          padding: 0.02in 0;
          font-size: 10pt;
        }
        
        /* Two Column Layout */
        .main-content {
          display: flex;
          gap: 0.15in;
          height: 8.6in;
        }
        
        /* Section Styling */
        .section {
          border-radius: 5px;
          padding: 0.1in;
          margin-bottom: 0.15in;
          border: 1px solid;
        }
        
        .section:last-child {
          margin-bottom: 0;
        }
        
        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 12pt;
          margin: 0 0 0.1in 0;
          text-transform: uppercase;
          border-bottom: 2px solid currentColor;
          padding-bottom: 3px;
        }
        
        /* Left Column */
        .left-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 100%;
          overflow: hidden;
        }
        
        /* Attributes Section */
        .attributes {
          background-color: #fff8e1;
          border-color: #f39c12;
          color: #7e5109;
        }
        
        .section-title.attributes-title {
          color: #e67e22;
        }
        
        .attribute-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11pt;
        }
        
        .attribute-table tr {
          border-bottom: 1px solid rgba(243, 156, 18, 0.2);
        }
        
        .attribute-table tr:last-child {
          border-bottom: none;
        }
        
        .attribute-table td {
          padding: 0.03in;
        }
        
        .attribute-name {
          font-weight: bold;
          width: 0.9in;
        }
        
        .attribute-value-header {
          width: 0.5in;
          text-align: center;
          font-weight: bold;
        }
        
        .attribute-value {
          width: 0.5in;
          text-align: center;
          font-weight: bold;
          border: 1px solid #888;
          background: #fff;
        }
        
        .attribute-check-header {
          width: 0.7in;
          text-align: center;
          border: 1px solid #888;
          background: #f8f8f8;
        }
        
        .attribute-check {
          width: 0.7in;
          text-align: center;
          border: 1px solid #888;
          background: #f8f8f8;
        }
        
        .attribute-check::before {
          content: "× 5: ";
          font-size: 0.8em;
          color: #888;
          float: left;
          margin-left: 0.05in;
        }
        
        .attribute-mod {
          font-size: 0.8em;
          color: #666;
          text-align: left;
          padding-left: 0.05in;
        }
        
        /* Wound Track Styling */
        .wound-track-container {
          margin-top: 0.05in;
          padding-top: 0.05in;
          border-top: 1px dashed rgba(243, 156, 18, 0.5);
        }
        
        .wound-label {
          font-weight: bold;
          margin-bottom: 0.02in;
          text-align: center;
        }
        
        .wound-track {
          display: flex;
          justify-content: center;
          gap: 0.1in;
        }
        
        .wound-box {
          width: 0.3in;
          height: 0.3in;
          border: 1px solid #888;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9em;
        }
        
        .wound-incap {
          background: #f8d7da;
          border-color: #e74c3c;
        }
        
        .wound-dying {
          background: #f5b7b1;
          border-color: #c0392b;
        }
        
        /* Special Abilities Section */
        .special-abilities {
          background-color: #f3e5f5;
          border-color: #9b59b6;
          color: #693786;
        }
        
        .section-title.abilities-title {
          color: #8e44ad;
        }
        
        /* Character Details Section */
        .character-details {
          background-color: #e8f4fc;
          border-color: #2980b9;
          color: #1a5490;
        }
        
        .section-title.details-title {
          color: #2980b9;
        }
        
        /* Equipment Section */
        .equipment {
          background-color: #e8f5e9;
          border-color: #27ae60;
          color: #196f3d;
        }
        
        .section-title.equipment-title {
          color: #27ae60;
        }
        
        .abilities-content {
          display: flex;
          flex-direction: column;
          gap: 0.1in;
        }
        
        .ability-text {
          font-size: 0.9em;
          line-height: 1.3;
          margin-bottom: 0.1in;
        }
        
        .ability-name {
          font-weight: bold;
          display: inline;
          margin-right: 0.1in;
        }
        
        .ability-description {
          display: inline;
        }
        
        /* Right Column - Skills */
        .right-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 100%;
          overflow: hidden;
        }
        
        .skills {
          background-color: #e8f5e9;
          border-color: #27ae60;
          color: #196f3d;
          flex: 1;
          display: flex;
          flex-direction: column;
          max-height: 8.6in;
          overflow: hidden;
        }
        
        .section-title.skills-title {
          color: #27ae60;
        }
        
        /* Core Values Table Styling */
        .core-values-container {
          margin-bottom: 0.1in;
          border: 1px solid #27ae60;
          border-radius: 3px;
          background-color: rgba(39, 174, 96, 0.1);
        }
        
        .core-values-title {
          text-align: center;
          font-weight: bold;
          font-size: 0.11in;
          padding: 0.03in;
          background-color: rgba(39, 174, 96, 0.2);
          border-bottom: 1px solid #27ae60;
        }
        
        .core-values-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.11in;
        }
        
        .core-values-table th {
          text-align: center;
          padding: 0.02in;
          background-color: rgba(39, 174, 96, 0.1);
          border-bottom: 1px solid rgba(39, 174, 96, 0.3);
        }
        
        .core-values-table td {
          text-align: center;
          padding: 0.02in;
          border-right: 1px dotted rgba(39, 174, 96, 0.3);
        }
        
        .core-values-table td:last-child {
          border-right: none;
        }
        
        .core-values-caption {
          text-align: center;
          font-size: 0.1in;
          padding: 0.02in;
          color: #196f3d;
          border-top: 1px dotted rgba(39, 174, 96, 0.3);
        }
        
        /* Skills Table */
        .skills-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9em;
        }
        
        .skills-table th {
          text-align: center;
          padding: 0.02in;
          background-color: rgba(39, 174, 96, 0.15);
          border-bottom: 1px solid rgba(39, 174, 96, 0.5);
          font-size: 0.8em;
        }
        
        .skills-table td {
          padding: 0.02in;
          border-bottom: 1px dotted rgba(39, 174, 96, 0.3);
          height: 0.25in;
        }
        
        .skills-table .value-cell {
          text-align: center;
          width: 0.4in;
          border: 1px solid #888;
          background: #fff;
        }
        
        .solar-scouts td {
          background-color: rgba(39, 174, 96, 0.1);
          font-weight: bold;
        }
        
        /* Footer Styling */
        .footer {
          text-align: center;
          font-size: 8pt;
          color: #888;
          padding: 0.05in 0;
          border-top: 1px solid #ddd;
          position: absolute;
          bottom: 0.2in;
          left: 0.2in;
          right: 0.2in;
          background: white;
        }
        
        /* Signature Gadget Details Styling */
        .signature-gadget-details {
          background-color: #f3e5f5;
          border-color: #9b59b6;
          color: #693786;
        }
        
        /* Print Optimization */
        @media print {
          body {
            background: none;
            margin: 0;
            padding: 0;
          }
          
          .character-sheet {
            box-shadow: none;
            border: none;
            width: 8.5in;
            height: 11in;
            margin: 0;
            page-break-after: always;
          }
          
          .character-sheet:last-child {
            page-break-after: avoid;
          }
          
          @page {
            size: letter portrait;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="character-sheet">
        <!-- Header -->
        <div class="header">
          <h1 class="title">Atomic Tomorrow Adventures</h1>
        </div>
        
        <!-- Character Banner -->
        <div class="character-banner-section">
          <div class="character-info">
            <div class="character-title">${character.name || 'Character Name'}</div>
            <div class="character-subtitle">${(() => {
              const parts = [];
              if (character.epithet?.name) parts.push(character.epithet.name);
              if (character.profession?.name) parts.push(character.profession.name);
              
              let result = parts.join(' ');
              
              if (character.origin?.name) {
                result += (result ? ', ' : '') + `from ${character.origin.name}`;
              }
              
              if (character.background?.name) {
                result += ' ' + character.background.name;
              }
              
              return result;
            })()}</div>
          </div>
          <div class="portrait-container">
            <div class="portrait-ring-2"></div>
            <div class="portrait-ring-1"></div>
            <div class="portrait-area">
              ${character.portrait && character.portrait.fullPath ? `<img src="${character.portrait.fullPath}" alt="Character Portrait" style="width: 100%; height: 100%; object-fit: cover;">` : 'Portrait'}
            </div>
          </div>
        </div>
        
        
        <!-- Main Content -->
        <div class="main-content">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Attributes -->
            <div class="attributes section">
              <h2 class="section-title attributes-title">Attributes</h2>
              <table class="attribute-table">
                <tr>
                  <td class="attribute-name"></td>
                  <td class="attribute-value-header"></td>
                  <td class="attribute-check-header">Check</td>
                  <td class="attribute-mod"></td>
                </tr>
                ${['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => {
                  const attrValue = character.attributes?.[attr] || 10;
                  const checkValue = attrValue * 5;
                  const modText = {
                    'BRAWN': 'Physical strength',
                    'REFLEX': 'Agility, speed',
                    'NERVE': 'Courage, composure',
                    'SAVVY': 'Intelligence',
                    'CHARM': 'Charisma',
                    'GRIT': 'Endurance',
                    'GUILE': 'Cunning'
                  }[attr];
                  
                  return `
                    <tr>
                      <td class="attribute-name">${attr}</td>
                      <td class="attribute-value">${attrValue}</td>
                      <td class="attribute-check">${checkValue}</td>
                      <td class="attribute-mod">${modText}</td>
                    </tr>
                  `;
                }).join('')}
              </table>
              
              <!-- Wound Track -->
              <div class="wound-track-container">
                <div class="wound-label">Wound Track</div>
                <div class="wound-track">
                  <div class="wound-box">1</div>
                  <div class="wound-box">2</div>
                  <div class="wound-box">3</div>
                  <div class="wound-box wound-incap">4</div>
                  ${character.epithet?.id === 'grizzled' ? '<div class="wound-box">5</div>' : ''}
                  <div class="wound-box wound-dying">${character.epithet?.id === 'grizzled' ? '6' : '5'}</div>
                </div>
              </div>
              
              <!-- Stress Track -->
              <div class="wound-track-container">
                <div class="wound-label">Stress Track</div>
                <div class="wound-track">
                  <div class="wound-box">1</div>
                  <div class="wound-box">2</div>
                  <div class="wound-box">3</div>
                  <div class="wound-box">4</div>
                  <div class="wound-box wound-incap">5</div>
                </div>
              </div>
            </div>
            
            <!-- Special Abilities -->
            <div class="special-abilities section">
              <h2 class="section-title abilities-title">Special Abilities</h2>
              <div class="abilities-content">
                <div class="ability-text">
                  <span class="ability-name">${character.epithet?.name || 'Epithet Ability'}:</span>
                  <span class="ability-description">${character.epithet?.benefit || 'Select an epithet to see its special ability'}</span>
                </div>
              </div>
            </div>
            
            <!-- Character Details -->
            <div class="character-details section">
              <h2 class="section-title details-title">Character Details</h2>
              <div class="abilities-content">
                <div class="ability-text">
                  <span class="ability-name">Appearance:</span>
                  <span class="ability-description">${character.appearance || 'No appearance details provided.'}</span>
                </div>
                
                <div class="ability-text">
                  <span class="ability-name">Personality:</span>
                  <span class="ability-description">${character.personality || 'No personality details provided.'}</span>
                </div>
              </div>
            </div>
            
          </div>
          
          <!-- Right Column - Skills -->
          <div class="right-column">
            <div class="skills section">
              <h2 class="section-title skills-title">Skills</h2>
              
              <!-- Core Values Table -->
              <div class="core-values-container">
                <div class="core-values-title">CORE SKILL VALUES</div>
                <table class="core-values-table">
                  <tr>
                    <th>BRAWN</th>
                    <th>REFLEX</th>
                    <th>NERVE</th>
                    <th>SAVVY</th>
                    <th>CHARM</th>
                    <th>GRIT</th>
                    <th>GUILE</th>
                    <th>FLEX</th>
                  </tr>
                  <tr>
                    ${['BRAWN', 'REFLEX', 'NERVE', 'SAVVY', 'CHARM', 'GRIT', 'GUILE'].map(attr => {
                      const coreValue = ((character.attributes?.[attr] || 10) * 2) + 5;
                      return `<td>${coreValue}%</td>`;
                    }).join('')}
                    <td>25%</td>
                  </tr>
                </table>
                <div class="core-values-caption">Core Skill Value = (Attribute × 2) + 5</div>
              </div>
              
              <!-- Skills Table -->
              <div class="skills-content">
                <table class="skills-table">
                  <tr>
                    <th style="width: 38%;">Skill (Specialization)</th>
                    <th style="width: 12%;">Core</th>
                    <th style="width: 12%;">Prof</th>
                    <th style="width: 12%;">Origin</th>
                    <th style="width: 12%;">Back</th>
                    <th style="width: 14%;">Total</th>
                  </tr>
                  <!-- Solar Scouts Row -->
                  <tr class="solar-scouts">
                    <td>Solar Scouts Training</td>
                    <td class="value-cell">—</td>
                    <td class="value-cell">—</td>
                    <td class="value-cell">—</td>
                    <td class="value-cell">—</td>
                    <td class="value-cell">35%</td>
                  </tr>
                  
                  ${renderSkillsForPrintTable(character)}
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          ATOMIC TOMORROW ADVENTURES © 2025 | Character Sheet v1.0
        </div>
      </div>
      
      <!-- Signature Gadget - Separate Page -->
      ${character.signatureGadget ? `
      <div class="character-sheet" style="page-break-before: always;">
        <!-- Header -->
        <div class="header">
          <h1 class="title">Signature Gadget Details</h1>
        </div>
        
        <!-- Character Banner -->
        <div class="character-banner-section">
          <div class="character-info">
            <div class="character-title">${character.name || 'Character Name'}</div>
            <div class="character-subtitle">Signature Gadget Specifications</div>
          </div>
        </div>
        
        <!-- Signature Gadget Details -->
        <div class="signature-gadget-details section" style="margin-top: 0.5in;">
          <h2 class="section-title" style="color: #8e44ad;">Signature Gadget: ${character.signatureGadget.name}</h2>
          <div class="abilities-content">
            ${character.signatureGadget.effects.map((effect, idx) => `
              <div class="ability-text" style="margin-bottom: 0.15in;">
                <span class="ability-name">Effect ${idx + 1}:</span>
                <span class="ability-description" style="font-size: 11pt;">${effect}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Equipment Section -->
        <div class="equipment section" style="margin-top: 0.3in; background-color: #e8f5e9; border-color: #27ae60; color: #196f3d;">
          <h2 class="section-title" style="color: #27ae60;">Equipment & Credits</h2>
          <div class="abilities-content">
            <div class="ability-text">
              <span class="ability-name">Credits:</span>
              <span class="ability-description">${character.credits || 0} Cr</span>
            </div>
            <div class="ability-text">
              <span class="ability-name">Equipment:</span>
              <span class="ability-description">${(character.equipment || []).map(item => typeof item === 'string' ? item : item.name).join(', ') || 'None'}</span>
            </div>
          </div>
        </div>
        
        <!-- Usage Notes Section -->
        <div class="usage-notes section" style="margin-top: 0.3in; background-color: #f8f9fa; border-color: #6c757d; color: #495057;">
          <h2 class="section-title" style="color: #6c757d;">Usage Notes</h2>
          <div class="abilities-content">
            <div style="height: 2in; border: 1px dashed #ccc; background: #fff; margin-top: 0.1in;"></div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          ATOMIC TOMORROW ADVENTURES © 2025 | Signature Gadget Details
        </div>
      </div>
      ` : ''}
    </body>
    </html>
  `;

  printDoc.write(printContent);
  printDoc.close();

  // Wait for the iframe to load before printing
  printFrame.onload = function () {
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
 * Helper function to render skills in table format for print
 * Uses the centralized skill calculation utilities
 */
const renderSkillsForPrintTable = (character) => {
  // Calculate skills using the centralized function
  const skills = calculateSimplifiedSkills(character);

  // Sort skills by value (highest first) and filter out Solar Scouts Training
  const sortedSkills = Object.entries(skills)
    .filter(([skillName]) => skillName !== 'Solar Scouts Training')
    .sort(([, a], [, b]) => b.value - a.value);

  // Take top 15 skills to fit on the page
  const topSkills = sortedSkills.slice(0, 15);

  return topSkills.map(([skillName, skillData]) => {
    const attribute = getSkillAttribute(skillName);
    
    // Calculate core value properly based on skill type
    let coreValue: number;
    if (attribute === 'FLEX') {
      coreValue = 25; // FLEX skills don't get the +5 bonus
    } else {
      coreValue = ((character.attributes?.[attribute] || 10) * 2) + 5;
    }
    
    // Use the already calculated bonuses from skillData
    const profBonus = skillData.professionBonus || 0;
    const originBonus = skillData.originBonus || 0;
    const backgroundBonus = skillData.backgroundBonus || 0;
    
    return `
      <tr>
        <td>${skillName}</td>
        <td class="value-cell">${coreValue}%</td>
        <td class="value-cell">${profBonus > 0 ? `+${profBonus}` : ''}</td>
        <td class="value-cell">${originBonus > 0 ? `+${originBonus}` : ''}</td>
        <td class="value-cell">${backgroundBonus > 0 ? `+${backgroundBonus}` : ''}</td>
        <td class="value-cell"><strong>${skillData.value}%</strong></td>
      </tr>
    `;
  }).join('');
};

/**
 * Helper function to render skills in print format (legacy - kept for compatibility)
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