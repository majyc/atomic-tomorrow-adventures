export const EPITHETS = [
  // GRITTY/TOUGH EPITHETS
  { id: 'grizzled', name: 'Grizzled', description: 'The years have hardened you into something tougher than ordinary folk', attributeEffect: '+2 GRIT', benefit: 'One extra wound before incapacitation' },
  { id: 'hard-bitten', name: 'Hard-Bitten', description: 'You\'ve endured the worst the Solar System can throw at you and kept going', attributeEffect: '+1 GRIT, +1 NERVE', benefit: '+20% resistance to environmental hazards and extreme conditions' },
  { id: 'battle-scarred', name: 'Battle-Scarred', description: 'The marks of combat across your body tell stories of survival against the odds', attributeEffect: '+2 NERVE', benefit: 'Wounds never affect your initiative rolls, regardless of penalty level' },
  { id: 'steely-eyed', name: 'Steely-Eyed', description: 'Your unflinching gaze makes even hardened criminals think twice', attributeEffect: '+2 NERVE', benefit: 'In standoffs and intimidation contests, opponents need a critical success to shake you' },
  { id: 'hardboiled', name: 'Hardboiled', description: 'Life\'s knocks have left you cynical but exceptionally tough-minded', attributeEffect: '+1 GRIT, +1 GUILE', benefit: 'Immune to emotional manipulation and can function without sleep for 48 hours with no penalty' },
  { id: 'iron-willed', name: 'Iron-Willed', description: 'Your determination allows you to push beyond normal human limits', attributeEffect: '+2 GRIT', benefit: 'When incapacitated by a wound, you can continue functioning by making a GRIT check each round' },
  { id: 'two-fisted', name: 'Two-Fisted', description: 'You fight with both hands, creating a whirlwind of attacks and defenses', attributeEffect: 'Dual weapon proficiency', benefit: 'Extra defense action without penalty' },
  
  // SKILLED/EXPERT EPITHETS
  { id: 'crack', name: 'Crack', description: 'You\'re the best there is at what you do, with a reputation to match', attributeEffect: 'Professional skill success on any doubles or ending in 0 or 5', benefit: '+10% to all other professional skills' },
  { id: 'hotshot', name: 'Hotshot', description: 'Natural talent and flair make difficult feats look easy when you perform them', attributeEffect: '+10% to three skills of your choice', benefit: '+20% when attempting flashy actions' },
  { id: 'virtuoso', name: 'Virtuoso', description: 'Your masterful abilities in your chosen field are unmatched across the Solar System', attributeEffect: 'One professional skill at +20% above normal', benefit: 'Critical successes on professional skill rolls create lasting positive reputation' },
  { id: 'legendary', name: 'Legendary', description: 'Your exploits are told in spaceport bars from Mercury to Neptune', attributeEffect: '+20% to social interactions where your reputation matters', benefit: 'Can perform one flawless execution after adequate preparation' },
  { id: 'peerless', name: 'Peerless', description: 'In your field, there is simply no one better—and everyone knows it', attributeEffect: '+10% to all professional skills in your field', benefit: 'Can attempt normally impossible solutions after studying a problem for at least an hour' },
  { id: 'uncanny', name: 'Uncanny', description: 'You possess an inexplicable sixth sense that others find unnerving', attributeEffect: '+20% to detect ambushes, traps, and betrayals', benefit: 'Animals and children instinctively trust you' },
  
  // ADVENTUROUS EPITHETS
  { id: 'intrepid', name: 'Intrepid', description: 'No unexplored region or dangerous frontier can deter your adventurous spirit', attributeEffect: '+1 NERVE, +1 REFLEX', benefit: '+20% to all exploration and pathfinding rolls' },
  { id: 'swashbuckling', name: 'Swashbuckling', description: 'You fight with dramatic flair, turning combat into a performance art', attributeEffect: '+20% to acrobatic combat maneuvers', benefit: 'Can goad opponents into making mistakes by targeting their pride' },
  { id: 'bold', name: 'Bold', description: 'Your confident approach to challenges often turns failure into future success', attributeEffect: '+20% to your next roll after any failure if attempting a different approach', benefit: 'Recover from setbacks twice as quickly as normal characters' },
  { id: 'daring', name: 'Daring', description: 'You take risks that make others blanch, and somehow make them pay off', attributeEffect: '+20% to genuinely dangerous actions', benefit: 'Never suffer special or critical failures when attempting risky actions' },
  { id: 'audacious', name: 'Audacious', description: 'The word "impossible" just makes you more determined to succeed', attributeEffect: 'Can attempt normally impossible stunts at -40% instead of being automatically impossible', benefit: 'Your daring inspires allies, granting them +10% to their next action' },
  { id: 'lucky', name: 'Lucky', description: 'Fortune smiles on you in ways that defy rational explanation', attributeEffect: 'Can reroll when you fail and get a 7 (reroll again if you get another 7)', benefit: '+20% to games of chance and randomized situations' },
  
  // CLEVER/SMART EPITHETS
  { id: 'brilliant', name: 'Brilliant', description: 'Your intellect runs rings around ordinary minds, making connections they miss', attributeEffect: '+2 SAVVY', benefit: '+20% to deduction and analysis when examining clues or evidence' },
  { id: 'ingenious', name: 'Ingenious', description: 'You can create solutions from the most unlikely components', attributeEffect: 'Can create impromptu tools from available materials on any successful SAVVY roll', benefit: 'Jury-rigged solutions ignore the first Special Failure' },
  { id: 'silver-tongued', name: 'Silver-Tongued', description: 'Your persuasive abilities can change minds and shape opinions with remarkable ease', attributeEffect: '+2 CHARM', benefit: 'Persuasion attempts that succeed create lasting belief changes rather than temporary compliance' },
  { id: 'enigmatic', name: 'Enigmatic', description: 'Something about you defies easy reading, making you a mystery to most', attributeEffect: '-20% to others\' attempts to analyze your intentions', benefit: 'Strangers often confide in you, sharing secrets they normally wouldn\'t' },
  { id: 'veteran', name: 'Veteran', description: 'Years of experience have honed your instincts and awareness to extraordinary levels', attributeEffect: '+1 GRIT, +1 SAVVY', benefit: 'You can detect ambushes on any successful roll, not just critical success' },
  
  // CHARMING EPITHETS
  { id: 'plucky', name: 'Plucky', description: 'You got moxie, kid', attributeEffect: '+1 CHARM, +1 NERVE', benefit: 'In any Social Contest trying to intimidate, frighten or overawe you, you reduce the degree of success score against you by 1' },
  { id: 'seductive', name: 'Seductive', description: 'Whatever Lola wants, Lola gets...', attributeEffect: '+1 CHARM, +1 GUILE', benefit: 'In Seduction Social Contests, Opposed wraps back around to Receptive (skipping Convinced)' },
  { id: 'stunning', name: 'Stunning', description: 'You stop traffic as you stroll down the boulevard', attributeEffect: '+2 CHARM', benefit: 'You command attention and are noticed wherever you go; villains prefer to capture or spare you' },
  { id: 'suave', name: 'Suave', description: 'It\'s impossible for you to put your foot that wrong in any social situation', attributeEffect: '+1 CHARM, +1 SAVVY', benefit: 'Special and Critical failures on Social skills become ordinary failures' },
];