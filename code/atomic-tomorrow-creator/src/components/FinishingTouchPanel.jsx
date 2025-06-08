import React, { useState, useEffect } from 'react';
import { Zap, Users, Target, AlertTriangle } from 'lucide-react';
import { GADGET_COMPONENTS, GADGET_EFFECTS, SIGNATURE_EQUIPMENT } from '../data/descriptions';
import { NAMES } from '../data/names';
import { EPITHETS } from '../data/epithets';
import { PROFESSIONS } from '../data/professions';
import { ORIGINS } from '../data/origins';

// Finishing Touch Panel Component - Choose between signature equipment, relationship, motivation, or complication
const FinishingTouchPanel = ({ character, updateCharacter }) => {
  // State for finishing touch
  const [finishingTouch, setFinishingTouch] = useState(character.finishingTouch || null);
  const [selectedType, setSelectedType] = useState('signature-equipment');

  // Update character in parent component when finishing touch changes
  useEffect(() => {
    updateCharacter({
      ...character,
      finishingTouch
    });
  }, [finishingTouch]);

  // Clear current finishing touch when type changes
  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    setFinishingTouch(null);
  };

  // Helper functions for character generation
  const generateRandomName = () => {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const firstName = NAMES.prefixes[gender][Math.floor(Math.random() * NAMES.prefixes[gender].length)];
    const lastName = NAMES.suffixes[Math.floor(Math.random() * NAMES.suffixes.length)];
    return `${firstName} ${lastName}`;
  };

  const generateRandomEpithet = () => {
    return EPITHETS[Math.floor(Math.random() * EPITHETS.length)];
  };

  const generateRandomProfession = () => {
    return PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
  };

  const generateRandomOrigin = () => {
    return ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
  };

  const generateCharacterForRelationship = (relationshipType) => {
    const name = generateRandomName();
    const epithet = generateRandomEpithet();
    const origin = generateRandomOrigin();
    
    // Special logic for rivalries - use same profession as player character
    let profession;
    if (relationshipType === 'Rivalry' && character.profession) {
      // Find the player's profession in the PROFESSIONS array
      profession = PROFESSIONS.find(p => p.id === character.profession.id) || generateRandomProfession();
    } else {
      profession = generateRandomProfession();
    }

    return {
      name,
      epithet,
      profession,
      origin
    };
  };

  // Generate content based on selected type
  const generateFinishingTouch = () => {
    switch (selectedType) {
      case 'signature-equipment':
        generateSignatureEquipment();
        break;
      case 'key-relationship':
        generateKeyRelationship();
        break;
      case 'driving-motivation':
        generateDrivingMotivation();
        break;
      case 'pulp-complication':
        generatePulpComplication();
        break;
    }
  };

  // Generate signature equipment
  const generateSignatureEquipment = () => {
    const adjective = GADGET_COMPONENTS.ATOMIC_ADJECTIVES[Math.floor(Math.random() * GADGET_COMPONENTS.ATOMIC_ADJECTIVES.length)];
    const component = GADGET_COMPONENTS.TECHNO_COMPONENTS[Math.floor(Math.random() * GADGET_COMPONENTS.TECHNO_COMPONENTS.length)];
    const designation = GADGET_COMPONENTS.SERIES_DESIGNATIONS[Math.floor(Math.random() * GADGET_COMPONENTS.SERIES_DESIGNATIONS.length)];

    const equipmentName = `${adjective} ${component} ${designation}`;
    const effects = [
      GADGET_EFFECTS.ADJECTIVE_EFFECTS[adjective] || 'Specialized atomic age technology with unique properties.',
      GADGET_EFFECTS.COMPONENT_EFFECTS[component] || 'Incorporates advanced atomic-age engineering principles.',
      GADGET_EFFECTS.DESIGNATION_EFFECTS[designation] || 'Represents the pinnacle of retro-futuristic engineering.'
    ];

    setFinishingTouch({
      type: 'signature-equipment',
      name: equipmentName,
      description: `Your distinctive piece of atomic-age technology: ${equipmentName}`,
      effects,
      adjective,
      component,
      designation
    });
  };

  // Generate key relationship
  const generateKeyRelationship = () => {
    const relationshipTypes = [
      {
        type: 'Rivalry',
        description: 'You compete in the same field or for the same recognition',
        context: 'A professional competitor who pushes you to be better—or worse. They operate in your same field, making every achievement a comparison, every failure a potential embarrassment.'
      },
      {
        type: 'Debt',
        description: 'Either you owe them a significant favor or they owe you one',
        context: 'An unresolved obligation hangs between you. Whether you\'re the creditor or debtor, this relationship carries weight that money can\'t settle.'
      },
      {
        type: 'Shared History',
        description: 'You\'ve been through something significant together',
        context: 'You survived something together—a disaster, a war, a great discovery. The experience forged a bond that time and distance haven\'t broken.'
      },
      {
        type: 'Professional Connection',
        description: 'You worked together or have complementary expertise',
        context: 'Your skills complement theirs in useful ways. You\'ve collaborated before and might again, though your relationship extends beyond mere business.'
      },
      {
        type: 'Personal Tie',
        description: 'Friend, relative, or more complicated personal history',
        context: 'This relationship runs deep—family bonds, old friendships, or romantic entanglements that shaped who you are today.'
      },
      {
        type: 'Mystery Connection',
        description: 'Something connects you, but neither knows exactly what',
        context: 'Strange coincidences, shared dreams, or inexplicable resonance suggests a deeper connection. You keep running into each other across the galaxy.'
      }
    ];

    const selectedRelationship = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
    const relatedCharacter = generateCharacterForRelationship(selectedRelationship.type);

    // Create character description
    const characterDescription = `${relatedCharacter.epithet.name} ${relatedCharacter.name}, ${relatedCharacter.origin.name} ${relatedCharacter.profession.name}`;

    setFinishingTouch({
      type: 'key-relationship',
      name: 'Key Relationship',
      description: `${selectedRelationship.type}: ${selectedRelationship.description}`,
      character: characterDescription,
      context: selectedRelationship.context,
      details: {
        relationshipType: selectedRelationship.type,
        relationshipDescription: selectedRelationship.description,
        characterName: relatedCharacter.name,
        characterEpithet: relatedCharacter.epithet,
        characterProfession: relatedCharacter.profession,
        characterOrigin: relatedCharacter.origin,
        contextDescription: selectedRelationship.context
      }
    });
  };

  // Generate driving motivation
  const generateDrivingMotivation = () => {
    const motivationData = {
      'Redemption': {
        mistakes: [
          'caused a colony ship to crash', 'led to innocent deaths through negligence', 'betrayed a trusted friend',
          'allowed a dangerous experiment to go wrong', 'failed to warn others of impending disaster',
          'broke a sacred oath', 'abandoned comrades in battle', 'let greed override judgment',
          'trusted the wrong person with vital information', 'chose personal gain over duty'
        ],
        consequences: [
          'costing hundreds of lives', 'destroying years of research', 'ruining a family\'s reputation',
          'causing massive environmental damage', 'enabling enemy victory', 'breaking ancient treaties',
          'triggering a diplomatic crisis', 'unleashing something dangerous', 'betraying public trust'
        ]
      },
      'Recognition': {
        achievements: [
          'prove your revolutionary scientific theory', 'break the galactic speed record',
          'discover a new form of life', 'solve an ancient mystery', 'become the greatest in your profession',
          'write your name in the history books', 'surpass your famous mentor', 'achieve legendary status',
          'make a discovery that changes everything', 'become the hero of epic tales'
        ]
      },
      'Revenge': {
        wrongs: [
          'killed your mentor', 'destroyed your home world', 'stole your life\'s work',
          'framed you for their crimes', 'murdered your family', 'betrayed your trust',
          'left you to die', 'ruined your career', 'took everything you loved',
          'broke their promise to you', 'sold you out to enemies', 'humiliated you publicly'
        ]
      },
      'Discovery': {
        targets: [
          'ancient Martian ruins', 'a lost colony ship', 'your missing sibling',
          'the source of strange signals', 'a legendary treasure', 'alien technology',
          'the truth about your origins', 'a cure for a deadly plague', 'the location of a hidden world',
          'artifacts from a dead civilization', 'the secret behind psychic powers'
        ]
      },
      'Legacy': {
        reputations: [
          'famous war hero', 'notorious space pirate', 'brilliant scientist',
          'disgraced politician', 'legendary explorer', 'fallen noble house',
          'celebrated artist', 'failed revolutionary', 'martyred activist',
          'renowned inventor', 'infamous criminal mastermind'
        ]
      },
      'Fortune': {
        purposes: [
          'buy terraforming equipment for your dying colony', 'fund treatment for a rare genetic disease',
          'pay off debts to dangerous criminals', 'finance a revolution against tyranny',
          'purchase your way into high society', 'build a monument to fallen comrades',
          'establish a school for orphaned children', 'buy advanced medical equipment',
          'fund an expedition to unknown worlds', 'acquire illegal but necessary technology'
        ]
      },
      'Protection': {
        targets: [
          'your younger sibling', 'an ancient alien artifact', 'the last of an endangered species',
          'a colony of peaceful settlers', 'vital research data', 'a sacred site',
          'the sole witness to a crime', 'your mentor\'s secret', 'a powerful but dangerous weapon',
          'refugees from a war zone', 'the location of a safe haven'
        ],
        threats: [
          'assassins sent by corporations', 'a deadly alien plague', 'their own reckless nature',
          'hostile government forces', 'greedy treasure hunters', 'zealous cultists',
          'corrupt officials', 'rival criminal organizations', 'alien invaders',
          'environmental disasters', 'their dark past catching up'
        ]
      },
      'Mystery': {
        phenomena: [
          'strange dreams of places you\'ve never been', 'psychic abilities you shouldn\'t possess',
          'memories that aren\'t your own', 'cryptic messages following you across the galaxy',
          'technology that responds only to you', 'visions of possible futures',
          'an alien artifact bonded to your DNA', 'recurring encounters with the same stranger',
          'animals that seem to understand you', 'prophetic nightmares that come true'
        ]
      }
    };

    const types = Object.keys(motivationData);
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const data = motivationData[selectedType];

    let description, context;

    // Get background context
    const backgroundRef = character.background ? ` during your time as ${character.background.name}` : '';
    const originRef = character.origin ? ` back on ${character.origin.name}` : '';
    const timeRef = backgroundRef || originRef || ' in your past';

    switch (selectedType) {
      case 'Redemption':
        const mistake = data.mistakes[Math.floor(Math.random() * data.mistakes.length)];
        const consequence = data.consequences[Math.floor(Math.random() * data.consequences.length)];
        description = `You need to make amends for ${mistake}`;
        context = `Your decision ${consequence}${timeRef}. The weight of this failure drives every heroic action you take—only by saving more lives than you cost can you balance the scales.`;
        break;

      case 'Recognition':
        const achievement = data.achievements[Math.floor(Math.random() * data.achievements.length)];
        description = `You\'re determined to ${achievement}`;
        context = `You refuse to die unknown. The galaxy will remember your name, whether through fame or infamy—as long as it\'s earned through greatness. Every challenge is another step toward legend.`;
        break;

      case 'Revenge':
        const revengeCharacter = generateCharacterForRelationship('Revenge');
        const wrong = data.wrongs[Math.floor(Math.random() * data.wrongs.length)];
        description = `You seek revenge on ${revengeCharacter.epithet.name} ${revengeCharacter.name} who ${wrong}`;
        context = `This ${revengeCharacter.origin.name} ${revengeCharacter.profession.name} wronged you${timeRef}. You know their name, their face, their habits. Every skill you\'ve learned serves this single purpose.`;
        break;

      case 'Discovery':
        const target = data.targets[Math.floor(Math.random() * data.targets.length)];
        description = `You\'re searching for ${target}`;
        context = `The truth is out there, and you\'ll cross the galaxy to find it. This obsession began${timeRef}, and it\'s driven you to the edge of known space.`;
        break;

      case 'Legacy':
        const reputation = data.reputations[Math.floor(Math.random() * data.reputations.length)];
        description = `You must live up to (or overcome) your family\'s reputation as a ${reputation}`;
        context = `Every introduction comes with expectations. You either honor that legacy or forge your own path despite it, but you can never escape the shadow it casts over your life.`;
        break;

      case 'Fortune':
        const purpose = data.purposes[Math.floor(Math.random() * data.purposes.length)];
        description = `You need massive credits to ${purpose}`;
        context = `Time is running out, and only a fortune can solve this problem. Every dangerous job, every risky venture, every credit earned brings you closer to your goal.`;
        break;

      case 'Protection':
        const protectionTarget = data.targets[Math.floor(Math.random() * data.targets.length)];
        const threat = data.threats[Math.floor(Math.random() * data.threats.length)];
        description = `You must protect ${protectionTarget} from ${threat}`;
        context = `Their safety depends on your strength. This responsibility fell to you${timeRef}, and failure means losing something irreplaceable.`;
        break;

      case 'Mystery':
        const phenomenon = data.phenomena[Math.floor(Math.random() * data.phenomena.length)];
        description = `You\'re driven to understand ${phenomenon}`;
        context = `This mystery began${timeRef}, and it\'s consuming your life. The answers lie somewhere in the vast galaxy, and you won\'t rest until you find them.`;
        break;
    }

    setFinishingTouch({
      type: 'driving-motivation',
      name: 'Driving Motivation',
      description: `${selectedType}: ${description}`,
      context: context,
      details: {
        motivationType: selectedType,
        motivationDescription: description,
        contextDescription: context
      }
    });
  };

  // Generate pulp complication
  const generatePulpComplication = () => {
    const complicationData = {
      'Distinctive Trait': {
        traits: [
          'a distinctive scar from alien claws', 'a cybernetic eye that glows in the dark',
          'an accent from a world that no longer exists', 'unusual height for your origin',
          'hair that changes color with your mood', 'a rare genetic mutation that\'s visible',
          'cybernetic limbs that hum audibly', 'eyes that are two different colors',
          'skin that glows faintly in the dark', 'a birthmark shaped like a constellation',
          'a voice that echoes strangely', 'scars that form ancient symbols'
        ]
      },
      'Nemesis': {
        enemies: [
          'a powerful corporate executive', 'a military commander with resources',
          'a crime boss with a long memory', 'a government official with connections',
          'a religious leader with fanatic followers', 'a rival scientist with influence',
          'a disgraced noble seeking revenge', 'a corrupt space marshal',
          'an alien dignitary you offended', 'a former ally turned bitter enemy'
        ],
        reasons: [
          'you cost them a fortune', 'you embarrassed them publicly',
          'you know their dark secret', 'you foiled their master plan',
          'you stole their greatest love', 'you exposed their corruption',
          'you survived when you shouldn\'t have', 'you witnessed their crime',
          'you refused their generous offer', 'you represent everything they hate'
        ]
      },
      'Dependency': {
        needs: [
          'rare medication that keeps your enhanced reflexes working',
          'specific music that helps focus your psychic abilities',
          'daily exposure to particular radiation',
          'elaborate rituals performed at exact times',
          'exotic foods from your home world',
          'contact with a specific type of crystal',
          'meditation in zero gravity for an hour daily',
          'synthetic pheromones that regulate your mood',
          'regular communion with your AI implant',
          'dream-enhancing drugs to prevent nightmares'
        ]
      },
      'Phobia': {
        fears: [
          'zero gravity', 'confined spaces', 'alien technology', 'telepaths',
          'synthetic atmospheres', 'deep space', 'crowds of people',
          'artificial intelligence', 'certain colors or lights',
          'specific sounds or frequencies', 'water or liquid environments',
          'heights despite being a pilot'
        ],
        causes: [
          'a traumatic accident', 'a childhood incident', 'alien experimentation',
          'a near-death experience', 'psychological conditioning',
          'a memory implant gone wrong', 'witnessing something horrible',
          'being trapped for days', 'a psychic attack',
          'genetic conditioning', 'medical side effects'
        ]
      },
      'Notorious Past': {
        fame: [
          'a child star in the vid-dramas', 'a disgraced military officer',
          'the sole survivor of a well-publicized disaster', 'a former celebrity athlete',
          'a once-famous scientist whose theories were disproven',
          'a political figure who fell from grace', 'a reformed criminal who went straight',
          'a war hero with a dark secret', 'an artist whose work was controversial',
          'a religious figure who lost faith publicly'
        ]
      },
      'Recurring Phenomenon': {
        phenomena: [
          'technology malfunctions in your presence', 'animals are inexplicably drawn to you',
          'you keep encountering the same stranger on different planets',
          'clocks stop when you\'re stressed', 'plants wither when you touch them',
          'plants flourish unnaturally when you\'re near', 'prophetic dreams come true in twisted ways',
          'electronic devices activate when you\'re emotional',
          'small objects move slightly when you\'re not looking',
          'people forget conversations they\'ve had with you',
          'mirrors sometimes show different reflections'
        ]
      },
      'Double Life': {
        secrets: [
          'nobility slumming among commoners', 'a former criminal trying to go straight',
          'someone who\'s supposed to be dead', 'a deep-cover agent whose mission ended',
          'the child of famous parents hiding your identity',
          'a reformed cult member with a new identity',
          'an alien disguised as human', 'a time traveler stuck in this era',
          'someone with a massive bounty on their head',
          'the heir to a fortune you\'re hiding from'
        ]
      },
      'Cosmic Debt': {
        creditors: [
          'an alien entity that saved your life', 'time travelers you barely remember meeting',
          'a dying psionics master who transferred obligations to you',
          'an ancient AI that granted you knowledge',
          'interdimensional beings who answered your call',
          'the ghost of someone you failed to save',
          'a cosmic force that chose you as champion',
          'aliens who uplifted your consciousness',
          'an entity from outside space-time',
          'the collective unconscious of a dead species'
        ]
      }
    };

    const types = Object.keys(complicationData);
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const data = complicationData[selectedType];

    let description, context;

    // Get background context
    const backgroundRef = character.background ? ` during your time as ${character.background.name}` : '';
    const originRef = character.origin ? ` back on ${character.origin.name}` : '';
    const timeRef = backgroundRef || originRef || ' in your past';

    switch (selectedType) {
      case 'Distinctive Trait':
        const trait = data.traits[Math.floor(Math.random() * data.traits.length)];
        description = `You have ${trait} that draws attention wherever you go`;
        context = `This distinctive feature acquired${timeRef} makes it impossible to blend into a crowd. People remember you, for better or worse.`;
        break;

      case 'Nemesis':
        const enemy = data.enemies[Math.floor(Math.random() * data.enemies.length)];
        const reason = data.reasons[Math.floor(Math.random() * data.reasons.length)];
        description = `${enemy} has made you their personal enemy because ${reason}`;
        context = `They have resources, connections, and a long memory. They\'ll send agents, set traps, and turn your allies against you.`;
        break;

      case 'Dependency':
        const need = data.needs[Math.floor(Math.random() * data.needs.length)];
        description = `You require ${need} to function at your best`;
        context = `This dependency developed${timeRef}. Without it, you\'re just not yourself—weaker, unfocused, or barely functional.`;
        break;

      case 'Phobia':
        const fear = data.fears[Math.floor(Math.random() * data.fears.length)];
        const cause = data.causes[Math.floor(Math.random() * data.causes.length)];
        description = `You have an irrational fear of ${fear}, caused by ${cause}`;
        context = `This phobia developed${timeRef} and makes space adventures... interesting. It\'s not just discomfort—it\'s paralyzing terror.`;
        break;

      case 'Notorious Past':
        const pastFame = data.fame[Math.floor(Math.random() * data.fame.length)];
        description = `You were once ${pastFame}`;
        context = `People remember you${timeRef}, but not necessarily for things you want to be remembered for. Some want autographs; others want you dead.`;
        break;

      case 'Recurring Phenomenon':
        const phenomenon = data.phenomena[Math.floor(Math.random() * data.phenomena.length)];
        description = `Strange coincidences follow you: ${phenomenon}`;
        context = `This started${timeRef} and it\'s definitely not normal. It\'s not quite supernatural, but it\'s far from mundane.`;
        break;

      case 'Double Life':
        const secret = data.secrets[Math.floor(Math.random() * data.secrets.length)];
        description = `You\'re secretly ${secret}`;
        context = `Your two lives are on a collision course. When they meet, everything you\'ve built will come crashing down.`;
        break;

      case 'Cosmic Debt':
        const creditor = data.creditors[Math.floor(Math.random() * data.creditors.length)];
        description = `You owe a debt to ${creditor}`;
        context = `This obligation was incurred${timeRef}. The debt isn\'t monetary—it\'s spiritual, temporal, or dimensional. They don\'t accept "I forgot" as an excuse.`;
        break;
    }

    setFinishingTouch({
      type: 'pulp-complication',
      name: 'Pulp Complication',
      description: `${selectedType}: ${description}`,
      context: context,
      details: {
        complicationType: selectedType,
        complicationDescription: description,
        contextDescription: context
      }
    });
  };

  // Get icon for finishing touch type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'signature-equipment': return <Zap size={18} />;
      case 'key-relationship': return <Users size={18} />;
      case 'driving-motivation': return <Target size={18} />;
      case 'pulp-complication': return <AlertTriangle size={18} />;
      default: return <Zap size={18} />;
    }
  };

  // Get color scheme for finishing touch type
  const getTypeColors = (type) => {
    switch (type) {
      case 'signature-equipment': 
        return {
          primary: '#7e22ce',
          secondary: '#a855f7',
          light: '#e9d5ff',
          border: '#4c1d95'
        };
      case 'key-relationship': 
        return {
          primary: '#059669',
          secondary: '#10b981',
          light: '#dcfce7',
          border: '#047857'
        };
      case 'driving-motivation': 
        return {
          primary: '#dc2626',
          secondary: '#ef4444',
          light: '#fee2e2',
          border: '#b91c1c'
        };
      case 'pulp-complication': 
        return {
          primary: '#d97706',
          secondary: '#f59e0b',
          light: '#fef3c7',
          border: '#b45309'
        };
      default: 
        return {
          primary: '#7e22ce',
          secondary: '#a855f7',
          light: '#e9d5ff',
          border: '#4c1d95'
        };
    }
  };

  const colors = getTypeColors(selectedType);

  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 border"
         style={{ 
           borderColor: colors.border,
           boxShadow: `0 0 15px ${colors.primary}40, inset 0 0 10px ${colors.primary}20` 
         }}>
      <div className="panel-header text-white py-2 px-4 font-bold"
           style={{ 
             background: `linear-gradient(to right, #0f172a, ${colors.primary}, #0f172a)`, 
             textShadow: `0 0 10px ${colors.secondary}cc` 
           }}>
        <div>CHARACTER FINISHING TOUCH</div>
      </div>

      {/* Type Selection */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'signature-equipment', label: 'Signature Equipment', icon: <Zap size={16} /> },
            { id: 'key-relationship', label: 'Key Relationship', icon: <Users size={16} /> },
            { id: 'driving-motivation', label: 'Driving Motivation', icon: <Target size={16} /> },
            { id: 'pulp-complication', label: 'Pulp Complication', icon: <AlertTriangle size={16} /> }
          ].map((type) => {
            const typeColors = getTypeColors(type.id);
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`p-3 rounded text-sm font-medium transition-all border-2 ${
                  isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{
                  backgroundColor: isSelected ? typeColors.primary : '#374151',
                  borderColor: isSelected ? typeColors.secondary : '#6b7280',
                  boxShadow: isSelected ? `0 0 10px ${typeColors.primary}60` : 'none'
                }}
              >
                <div className="flex items-center justify-center mb-1">
                  {type.icon}
                </div>
                <div className="text-xs">{type.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: colors.light }}>
            Choose your character's distinctive element
          </div>
          <button
            onClick={generateFinishingTouch}
            className="px-4 py-2 rounded flex items-center font-medium transition-all"
            style={{
              backgroundColor: colors.primary,
              color: colors.light,
              border: `1px solid ${colors.secondary}`,
              boxShadow: `0 0 10px ${colors.primary}80`,
              textShadow: `0 0 5px ${colors.light}cc`
            }}
          >
            {getTypeIcon(selectedType)}
            <span className="ml-2">Generate</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      <div className="p-4">
        {finishingTouch ? (
          <div className="bg-gray-900 rounded-lg p-4 border"
               style={{ 
                 borderColor: colors.border,
                 boxShadow: `inset 0 0 15px ${colors.primary}20` 
               }}>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                   style={{ 
                     background: `linear-gradient(to br, ${colors.primary}, ${colors.secondary})`,
                     boxShadow: `0 0 10px ${colors.primary}80` 
                   }}>
                {getTypeIcon(selectedType)}
              </div>
              <h4 className="text-xl font-bold"
                  style={{ 
                    color: colors.secondary,
                    textShadow: `0 0 8px ${colors.secondary}cc` 
                  }}>
                {finishingTouch.name}
              </h4>
            </div>

            <p className="text-sm mb-3" style={{ color: colors.light }}>
              {finishingTouch.description}
            </p>

            {finishingTouch.effects && (
              <div className="space-y-2">
                {finishingTouch.effects.map((effect, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 mr-2"
                         style={{ 
                           backgroundColor: colors.primary,
                           color: colors.light,
                           boxShadow: `0 0 5px ${colors.primary}80` 
                         }}>
                      {index + 1}
                    </div>
                    <p className="text-sm" style={{ color: colors.light }}>
                      {effect}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {finishingTouch.details && !finishingTouch.character && (
              <div className="text-sm font-medium" style={{ color: colors.light }}>
                {finishingTouch.details}
              </div>
            )}
            
            {finishingTouch.character && (
              <div className="space-y-3">
                <div className="bg-gray-800 rounded p-3 border" style={{ borderColor: colors.border }}>
                  <div className="text-lg font-bold mb-2" style={{ color: colors.secondary }}>
                    {finishingTouch.character}
                  </div>
                  <div className="text-sm" style={{ color: colors.light }}>
                    {finishingTouch.context}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFinishingTouch(null)}
                className="text-sm hover:underline"
                style={{ color: colors.secondary }}
              >
                Generate Another
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-lg text-center"
               style={{ boxShadow: `inset 0 0 15px ${colors.primary}20` }}>
            <div className="mb-3" style={{ color: colors.secondary }}>
              {getTypeIcon(selectedType)}
            </div>
            <p style={{ color: colors.light }}>
              Click Generate to create your character's finishing touch!
            </p>
            <p className="text-sm mt-2" style={{ color: colors.secondary }}>
              This adds a unique element that makes your character memorable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishingTouchPanel;