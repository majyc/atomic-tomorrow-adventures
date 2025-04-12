import random
import textwrap
import os
import json
import argparse
import datetime
from collections import defaultdict

def load_data_file(filename, default_data):
    """Load data from a JSON file or return default data if file doesn't exist"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        # Create the file with default data
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(default_data, file, indent=4)
        return default_data

# Define expanded default lists (abbreviated here - use the full lists from previous message)
default_period_actors = [
    "Robert Stack", "Agnes Moorehead", "Lee Marvin", "Grace Kelly", "Charlton Heston",
    "James Stewart", "Humphrey Bogart", "Lauren Bacall", "Cary Grant", "Audrey Hepburn"
    # Include the full list from above here
]

default_physical_descriptions = [
    "weathered face, steely eyes, thousand-yard stare",
    "slender, graceful movements, perfect posture",
    "towering, imposing presence, booming voice"
    # Include the full list from above here
]

default_personality_traits = [
    "cynical but reliable in a crisis",
    "enthusiastically creates dangerous ideas",
    "methodical to a fault, triple-checks everything"
    # Include the full list from above here
]

# Load data from files or use defaults
period_actors = load_data_file('period_actors.json', default_period_actors)
physical_descriptions = load_data_file('physical_descriptions.json', default_physical_descriptions)
personality_traits = load_data_file('personality_traits.json', default_personality_traits)

# Define lists for random selection - kept in the main file as they're core to the system
professions = {
    "SPACERS & PILOTS": [
        "Rocket Jockey", "Astrogator", "Astro Racer", "Orbital Jumper", "Stunt Pilot"
    ],
    "SCIENTISTS & INTELLECTUALS": [
        "Xenobiologist", "Atomicist", "Computer Systems", "Mad Genius", "Tech Wizard"
    ],
    "EXPLORERS & SCOUTS": [
        "Scout", "Ruin Delver", "Xeno-Tracker", "Planetary Scout", "Deep Scout"
    ],
    "SOLDIERS & ENFORCERS": [
        "Solar Marine", "Space Ranger", "Bounty Hunter", "Mercenary", "Bodyguard"
    ],
    "MECHANICS & ENGINEERS": [
        "Wrench Monkey", "Atomech", "Gadgeteer", "Salvager", "Roboticist"
    ],
    "SCOUNDRELS & OPPORTUNISTS": [
        "Cat Burglar", "Gambler", "Smuggler", "Space Rat", "Grifter"
    ],
    "PSYCHICS & ESPERS": [
        "Mentalist", "Telekinetic", "Precog", "Empath", "Wild Talent"
    ],
    "MERCHANTS & TRADERS": [
        "Space Trader", "Cartel Broker", "Insurance Adjuster", "Adventure Capitalist", "Exotic Dealer"
    ],
    "MEDICAL SPECIALISTS": [
        "Sawbones", "Xenodoc", "Psychiatrist", "Combat Medic", "Life Scientist"
    ],
    "COMMUNICATIONS & DIPLOMATS": [
        "Xeno-Linguist", "Negotiator", "Ambassador", "Newshound", "Socialite"
    ],
    "SPECIALIZED ROLES": [
        "Prospector", "Asteroid Miner", "Chronicler", "Terraform Tech", "Entertainer"
    ],
    "MYSTERIAN AGENTS": [
        "Infiltrator", "Collaborator", "Abductee", "Researcher", "Observer"
    ]
}

origins = [
    "Terra", "Luna", "Mars", "Venus", "the Belt", "Jupiter", "Saturn", 
    "Deep Space", "a Genmodded", "a Red Martian", "Mercury", "Titan", 
    "Neptune", "Ceres", "Pluto"
]

backgrounds = [
    "Military Family", "Merchant Clan", "Frontier Homestead", "Academic Training", 
    "Street Urchin", "Corporate Upbringing", "Aristocratic Family", "Spacer Family", 
    "Religious Order", "Laboratory Subject", "Megacity Native", "Political Dynasty", 
    "Colonist Child", "Underworld Family", "Entertainment Background"
]

# Skill descriptions by profession categories - can be moved to a separate file if desired
skill_sets = {
    "SPACERS & PILOTS": [
        ["Piloting", "Navigation", "Technology (Ship Systems)", "Athletics (Zero-G)"],
        ["Navigation (Space)", "Science (Astronomy)", "Computer Systems", "Piloting"],
        ["Piloting (Racing)", "Repair (Vehicles)", "Perception (Spatial Awareness)", "Performance"],
        ["Athletics (Zero-G)", "Survival (Space)", "Technology", "Perception"]
    ],
    "SCIENTISTS & INTELLECTUALS": [
        ["Science", "Investigation (Research)", "Medicine", "Academics"],
        ["Science (Physics)", "Engineering (Atomic)", "Technology", "Academics (Mathematics)"],
        ["Computer Systems", "Engineering", "Perception", "Social (Academia)"],
        ["Science", "Engineering (Experimental)", "Deception", "Perception (Intuition)"]
    ],
    "EXPLORERS & SCOUTS": [
        ["Navigation (Wilderness)", "Survival", "Perception (Tracking)", "Marksmanship"],
        ["Academics (Archaeology)", "Athletics", "Security (Traps)", "Investigation"],
        ["Investigation (Tracking)", "Animal Handling", "Stealth", "Survival"],
        ["Navigation", "Perception", "Survival", "Technology (Sensors)"]
    ],
    "SOLDIERS & ENFORCERS": [
        ["Marksmanship", "Tactics (Combat)", "Athletics", "Survival (Combat Zone)"],
        ["Security (Law Enforcement)", "Investigation", "Marksmanship", "Perception"],
        ["Investigation (Tracking)", "Stealth", "Marksmanship", "Streetwise"],
        ["Marksmanship", "Melee Combat", "Perception (Threat Assessment)", "Intimidation"]
    ],
    "MECHANICS & ENGINEERS": [
        ["Repair", "Technology (Diagnostics)", "Engineering", "Streetwise (Scrounging)"],
        ["Engineering (Atomic)", "Technology", "Repair", "Science (Physics)"],
        ["Engineering (Experimental)", "Technology", "Repair (Improvisation)", "Science"],
        ["Repair", "Engineering", "Technology", "Streetwise (Scrounging)"]
    ],
    "SCOUNDRELS & OPPORTUNISTS": [
        ["Security (Lock Picking)", "Stealth", "Athletics", "Perception (Traps)"],
        ["Science (Probability)", "Deception (Bluffing)", "Perception (Reading People)", "Social"],
        ["Deception", "Piloting", "Navigation (Secret Routes)", "Streetwise"],
        ["Streetwise", "Deception", "Stealth", "Persuasion"]
    ],
    "PSYCHICS & ESPERS": [
        ["Psionic Powers (Telepathy)", "Psionic Powers (Mental Defense)", "Perception", "Social"],
        ["Psionic Powers (Telekinesis)", "Athletics (Fine Control)", "Survival (Mental Discipline)", "Perception"],
        ["Psionic Powers (Precognition)", "Perception (Intuition)", "Science (Probability)", "Academics"],
        ["Psionic Powers (Empathy)", "Social", "Medicine (Psychiatry)", "Perception"]
    ],
    "MERCHANTS & TRADERS": [
        ["Persuasion (Negotiation)", "Trade (Market Analysis)", "Trade (Appraisal)", "Social (Networking)"],
        ["Streetwise (Black Market)", "Persuasion (Intimidation)", "Perception (Threat Assessment)", "Navigation"],
        ["Investigation", "Risk Assessment", "Deception (Forgery Detection)", "Academics (Contract Law)"],
        ["Xenology (Alien Artifacts)", "Xenology (Alien Cultures)", "Investigation (Authentication)", "Social"]
    ],
    "MEDICAL SPECIALISTS": [
        ["Medicine (Emergency)", "Medicine (Surgery)", "Perception (Diagnostics)", "Science (Pharmacology)"],
        ["Medicine (Xenomedicine)", "Science (Comparative Physiology)", "Medicine (Diagnostics)", "Academics"],
        ["Medicine (Psychiatry)", "Science (Behavioral Science)", "Persuasion (Counseling)", "Medicine"],
        ["Medicine (Battlefield)", "Perception (Triage)", "Marksmanship", "Athletics (Endurance)"]
    ],
    "COMMUNICATIONS & DIPLOMATS": [
        ["Academics (Linguistics)", "Xenology (Alien Cultures)", "Science (Pattern Recognition)", "Social"],
        ["Persuasion (Negotiation)", "Perception (Reading People)", "Social (Mediation)", "Academics"],
        ["Social (Diplomacy)", "Academics (Politics)", "Social (Etiquette)", "Perception"],
        ["Investigation (Interviewing)", "Persuasion (Fast Talk)", "Academics (Writing)", "Perception"]
    ],
    "SPECIALIZED ROLES": [
        ["Science (Geology)", "Investigation (Surveying)", "Technology (Mineral Analysis)", "Navigation"],
        ["Mining", "Technology", "Engineering", "Survival (Vacuum)"],
        ["Academics (Documentation)", "Perception", "Investigation", "Performance (Storytelling)"],
        ["Engineering (Environmental)", "Science", "Technology", "Medicine"]
    ],
    "MYSTERIAN AGENTS": [
        ["Deception (Identity)", "Technology (Mysterian)", "Perception (Weaknesses)", "Science (Human Physiology)"],
        ["Science (Xenobiology)", "Engineering (Mysterian Tech)", "Deception (Cover Identity)", "Streetwise"],
        ["Perception (Mysterian Detection)", "Survival (Mental Resistance)", "Psionic Powers (Latent)", "Investigation"],
        ["Deception", "Technology (Alien)", "Xenology", "Stealth"]
    ]
}

# Equipment by profession
equipment = {
    "SPACERS & PILOTS": ["standard vacuum suit", "personal navigation computer", "pilot's chronometer", "spare parts kit"],
    "SCIENTISTS & INTELLECTUALS": ["portable laboratory", "data recorder", "reference library", "specialized scanner"],
    "EXPLORERS & SCOUTS": ["multi-scanner", "survival kit", "light ray pistol", "mapping equipment"],
    "SOLDIERS & ENFORCERS": ["combat armor", "medium ray gun", "neural stunner", "tactical communications"],
    "MECHANICS & ENGINEERS": ["tool kit", "diagnostic scanner", "spare parts", "technical manuals"],
    "SCOUNDRELS & OPPORTUNISTS": ["lockpicks", "concealed weapon", "forgery kit", "false identification"],
    "PSYCHICS & ESPERS": ["Rhine Institute credentials", "psi dampener", "focus crystal", "neural interface"],
    "MERCHANTS & TRADERS": ["market analyzer", "secure comm device", "portable safe", "sample case"],
    "MEDICAL SPECIALISTS": ["medical kit", "diagnostic scanner", "surgical tools", "emergency stimulants"],
    "COMMUNICATIONS & DIPLOMATS": ["universal translator", "cultural database", "diplomatic credentials", "recording equipment"],
    "SPECIALIZED ROLES": ["specialized tools", "environmental scanner", "protective gear", "technical manuals"],
    "MYSTERIAN AGENTS": ["concealed Mysterian technology", "human disguise kit", "signal jammer", "specimen collection device"]
}

# NEW: Character hooks - brief plot hooks for each NPC
character_hooks = [
    "knows the location of a forgotten Forerunner outpost",
    "carries the last sample of a valuable vaccine",
    "is being hunted by Mysterian agents",
    "has information about a coming invasion",
    "unwittingly carries an alien parasite",
    "owns a map to an untapped uranium deposit",
    "is secretly a high-ranking official's child",
    "witnessed something they shouldn't have",
    "discovered a flaw in Chemical X propulsion",
    "has a price on their head in three systems",
    "can identify a Mysterian infiltrator",
    "knows the override codes to a defense grid",
    "stole classified research from Atomcorp",
    "escaped from a secret military experiment",
    "is developing revolutionary technology",
    "has an identical twin working for the enemy",
    "survived an encounter with Venusian predators",
    "inherited a ship with a mysterious past",
    "carries an ancient artifact of unknown power",
    "has unique immunity to Martian fever",
    "remembers events that haven't happened yet",
    "recognized by everyone though they've never met",
    "last survivor of a deep space expedition",
    "unknowingly holds key to deciphering alien language",
    "carries a message from the future",
    "targeted by a cult that worships atom power",
    "possesses unique genetic markers sought by scientists",
    "unwittingly smuggled contraband across system lines",
    "the only witness to a high-profile assassination",
    "cursed by a Venusian jungle shaman"
]

# NEW: Secrets - things the NPC keeps hidden
character_secrets = [
    "is actually a deep-cover Space Patrol agent",
    "has been replaced by a Mysterian duplicate",
    "is addicted to experimental performance enhancers",
    "has an illegal psionic implant",
    "works for a rival corporation",
    "is gathering intelligence for military command",
    "faked their credentials and qualifications",
    "is related to a famous historical figure",
    "has an unregistered psionic ability",
    "deliberately sabotaged their last assignment",
    "is being blackmailed by a powerful figure",
    "smuggles banned Venusian biotech",
    "sold information that got colleagues killed",
    "communicates with an unknown alien intelligence",
    "survived a secret military experiment",
    "has a second identity and family elsewhere",
    "actually from a different planet than claimed",
    "maintains illegal modifications to their gear",
    "is centuries old due to time anomaly",
    "possesses forbidden Martian Mastermind technology",
    "has made a deal with Mysterian agents",
    "embezzled from previous employer",
    "killed someone in self-defense and covered it up",
    "carries dormant alien DNA that's slowly activating",
    "is the heir to a corporate empire in disguise",
    "gathering data for an AI rebellion",
    "suffers from progressive radiation poisoning",
    "has memorized classified government codes",
    "accidentally caused a colony disaster",
    "their body is a clone with implanted memories"
]

def generate_name():
    """Generate a random name"""
    # First names expanded with more diverse options
    first_names = [
        "James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas",
        "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
        "Alexander", "Zoe", "Ethan", "Sofia", "Daniel", "Emma", "Matthew", "Olivia", "Ryan", "Isabella",
        "Hiroshi", "Fatima", "Viktor", "Aisha", "Lorenzo", "Ling", "Jamal", "Svetlana", "Rico", "Priya",
        "Maxim", "Zara", "Kazuo", "Kali", "Andrei", "Nia", "Omar", "Chen", "Mateo", "Mira",
        # Retro-futuristic names
        "Jet", "Nova", "Rocket", "Atom", "Galaxy", "Cosmo", "Luna", "Orion", "Venus", "Comet",
        "Flash", "Silver", "Ace", "Star", "Rex", "Buck", "Astro", "Zero", "Ray", "Buzz"
    ]
    
    # Last names expanded with more diverse and sci-fi options
    last_names = [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
        "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
        "Tanaka", "Ivanov", "Singh", "Rodriguez", "Wang", "Patel", "Kowalski", "Kim", "O'Brien", "Rossi",
        "Vasquez", "Petrov", "Yamamoto", "Chen", "Müller", "Johansson", "Gomez", "Dubois", "Morozov", "Nguyen",
        # Sci-fi inspired names
        "Stardust", "Nebula", "Comet", "Nova", "Quasar", "Atomic", "Rocket", "Orbital", "Steel", "Cosmic",
        "Phoenix", "Sterling", "Quantum", "Jupiter", "Vega", "Atlas", "Orion", "Swift", "Vector", "Tesla"
    ]
    
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_callsign():
    """Generate a random callsign/nickname for appropriate professions"""
    adjectives = ["Lucky", "Maverick", "Ace", "Ghost", "Wild", "Smooth", "Crazy", "Hotshot", "Rocket", "Radar",
                 "Cool", "Atomic", "Comet", "Nova", "Stardust", "Sparks", "Bolt", "Ice", "Flash", "Shadow",
                 # Expanded adjectives
                 "Slick", "Swift", "Dusty", "Rusty", "Doc", "Chief", "Buzz", "Jammer", "Falcon", "Silver",
                 "Grim", "Sunny", "Whisper", "Thunder", "Zero", "Ace", "Solo", "Vapor", "Comet", "Flare"]
    
    nouns = ["Dog", "Wolf", "Eagle", "Hawk", "Fox", "Cat", "Tiger", "Bull", "Bear", "Snake",
            "Falcon", "Shark", "Hunter", "Hammer", "Blade", "Jet", "Viper", "Kid", "Cowboy", "Phoenix",
            # Expanded nouns
            "Rocket", "Meteor", "Star", "Laser", "Atom", "Thunder", "Lightning", "Steel", "Bullet", "Arrow",
            "Ghost", "Jumper", "Runner", "Sabre", "Racer", "Comet", "Orbit", "Ray", "Flash", "Vector"]
    
    # 50% chance of getting a callsign, biased toward certain categories
    category_weights = {
        "SPACERS & PILOTS": 0.8,
        "SOLDIERS & ENFORCERS": 0.7,
        "SCOUNDRELS & OPPORTUNISTS": 0.6
    }
    
    # Get NPC's category
    category = getattr(generate_callsign, "current_category", None)
    
    if category in category_weights:
        chance = category_weights[category]
    else:
        chance = 0.3
    
    if random.random() < chance:
        callsign_type = random.choice(["adjective_noun", "the_noun", "just_noun", "just_adjective"])
        
        if callsign_type == "adjective_noun":
            return f"'{random.choice(adjectives)} {random.choice(nouns)}'"
        elif callsign_type == "the_noun":
            return f"'The {random.choice(nouns)}'"
        elif callsign_type == "just_noun":
            return f"'{random.choice(nouns)}'"
        else:  # just_adjective
            return f"'{random.choice(adjectives)}'"
    else:
        return ""

def generate_attributes(category=None):
    """Generate random attributes, optionally weighted by profession category"""
    # Category-based attribute tendencies
    category_biases = {
        "SPACERS & PILOTS": {"REFL": 3, "NERVE": 2},
        "SCIENTISTS & INTELLECTUALS": {"SAVVY": 4, "GUILE": 1},
        "EXPLORERS & SCOUTS": {"NERVE": 2, "SAVVY": 2},
        "SOLDIERS & ENFORCERS": {"BRAW": 3, "GRIT": 3},
        "MECHANICS & ENGINEERS": {"SAVVY": 3, "BRAW": 1},
        "SCOUNDRELS & OPPORTUNISTS": {"GUILE": 3, "REFL": 2},
        "PSYCHICS & ESPERS": {"NERVE": 3, "SAVVY": 2},
        "MERCHANTS & TRADERS": {"CHARM": 3, "SAVVY": 2},
        "MEDICAL SPECIALISTS": {"SAVVY": 3, "GRIT": 2},
        "COMMUNICATIONS & DIPLOMATS": {"CHARM": 4, "GUILE": 1},
        "SPECIALIZED ROLES": {"SAVVY": 2, "GRIT": 2},
        "MYSTERIAN AGENTS": {"GUILE": 3, "SAVVY": 2}
    }
    
    # Base attributes - weighted toward competent professionals
    attributes = {}
    for attr in ["BRAW", "REFL", "NERVE", "SAVVY", "CHARM", "GRIT", "GUILE"]:
        # Weights biased toward average to above-average (8-14)
        weights = [1, 1, 2, 2, 3, 4, 5, 7, 12, 15, 15, 12, 7, 5, 3, 2]
        value = random.choices(list(range(3, 19)), weights=weights)[0]
        attributes[attr] = value
    
    # Apply category biases if applicable
    if category in category_biases:
        for attr, bonus in category_biases[category].items():
            # Add bonus but cap at 18
            attributes[attr] = min(attributes[attr] + bonus, 18)
    
    return attributes

def generate_skill_ratings(category, attributes=None, experience_level=None):
    """Generate skill ratings based on profession category, attributes, and experience level"""
    skills_for_category = random.choice(skill_sets[category])
    skill_ratings = []
    
    # Determine the character's experience level if not provided
    if not experience_level:
        experience_weights = [1, 3, 6, 8, 3]  # Novice to Master, weighted toward Competent/Expert
        experience_level = random.choices(["Novice", "Beginner", "Competent", "Expert", "Master"], weights=experience_weights)[0]
    
    # Base skill range depends on experience
    if experience_level == "Novice":
        primary_range = (30, 45)
        secondary_range = (25, 35)
        tertiary_range = (20, 30)
        fourth_range = (15, 25)
    elif experience_level == "Beginner":
        primary_range = (45, 60)
        secondary_range = (35, 50)
        tertiary_range = (30, 40)
        fourth_range = (25, 35)
    elif experience_level == "Competent":
        primary_range = (60, 75)
        secondary_range = (50, 65)
        tertiary_range = (40, 55)
        fourth_range = (35, 45)
    elif experience_level == "Expert":
        primary_range = (75, 85)
        secondary_range = (65, 75)
        tertiary_range = (55, 65)
        fourth_range = (45, 55)
    else:  # Master
        primary_range = (85, 95)
        secondary_range = (75, 85)
        tertiary_range = (65, 75)
        fourth_range = (55, 65)
    
    # Attribute-to-skill mapping (simplified)
    skill_attributes = {
        "Piloting": "REFL",
        "Navigation": "SAVVY",
        "Technology": "SAVVY",
        "Athletics": "BRAW",
        "Science": "SAVVY",
        "Computer Systems": "SAVVY",
        "Engineering": "SAVVY",
        "Investigation": "SAVVY",
        "Marksmanship": "REFL",
        "Tactics": "SAVVY",
        "Survival": "NERVE",
        "Stealth": "REFL",
        "Repair": "SAVVY",
        "Deception": "GUILE",
        "Security": "SAVVY",
        "Persuasion": "CHARM",
        "Social": "CHARM",
        "Trade": "SAVVY",
        "Academics": "SAVVY",
        "Perception": "SAVVY",
        "Medicine": "SAVVY",
        "Psionic Powers": "NERVE",
        "Animal Handling": "CHARM",
        "Melee Combat": "REFL",
        "Performance": "CHARM",
        "Streetwise": "GUILE",
        "Xenology": "SAVVY",
        "Mining": "BRAW"
    }
    
    # Generate skill values with attribute influence if attributes provided
    for i, skill_name in enumerate(skills_for_category):
        base_skill = skill_name.split(" ")[0]  # Get the base skill name before any parentheses
        
        if i == 0:  # Primary skill
            value = random.randint(*primary_range)
        elif i == 1:  # Secondary skill
            value = random.randint(*secondary_range)
        elif i == 2:  # Tertiary skill
            value = random.randint(*tertiary_range)
        else:  # Fourth skill
            value = random.randint(*fourth_range)
        
        # Apply attribute bonus if attributes provided
        if attributes and base_skill in skill_attributes:
            attr = skill_attributes[base_skill]
            attr_value = attributes.get(attr, 10)
            
            # Adjust skill based on attribute (above or below average)
            attr_bonus = (attr_value - 10) * 2
            value = min(95, max(5, value + attr_bonus))
        
        skill_ratings.append(f"*{skill_name}* {int(value)}%")
    
    return skill_ratings, experience_level

def get_equipment(category, has_psionics=False):
    """Get appropriate equipment for the character based on category and attributes"""
    category_equipment = equipment.get(category, ["basic equipment"])
    
    # 15% chance for an additional unusual item
    if random.random() < 0.15:
        unusual_items = [
            "experimental ray gun prototype", 
            "illegal neutron knife", 
            "antique Earth coin collection", 
            "holographic disguise emitter", 
            "Mysterian artifact fragment", 
            "Venusian jungle seed pod",
            "ancestor's good luck charm",
            "ancient Mars expedition map",
            "experimental atomic battery",
            "custom-built robot assistant"
        ]
        return f"{random.choice(category_equipment)} and {random.choice(unusual_items)}"
    
    # Special case for psionic characters
    if has_psionics and random.random() < 0.7:
        psi_items = [
            "Rhine Institute credentials", 
            "psi dampener", 
            "focus crystal", 
            "mental shield generator", 
            "psionic amplifier (illegal)",
            "memory imprinting device"
        ]
        return f"{random.choice(category_equipment)} and {random.choice(psi_items)}"
        
    return random.choice(category_equipment)

def generate_npc(allowed_categories=None, experience_level=None, forced_origin=None, include_secrets=False):
    """Generate a complete NPC with optional constraints"""
    # Select a category (or use specified one)
    if allowed_categories:
        categories = [cat for cat in professions.keys() if cat in allowed_categories]
        if not categories:  # Fallback if no valid categories
            categories = list(professions.keys())
    else:
        categories = list(professions.keys())
    
    category = random.choice(categories)
    profession = random.choice(professions[category])
    
    # Use specified origin or randomly select one
    if forced_origin:
        origin = forced_origin
    else:
        origin = random.choice(origins)
    
    # Make this category available to the callsign generator
    generate_callsign.current_category = category
    
    # Special case for Red Martians - higher chance of psionic abilities
    has_psionics = False
    if origin == "Red Martian" or category == "PSYCHICS & ESPERS":
        has_psionics = True
    
    # 50% chance to include a background
    if random.choice([True, False]):
        background = random.choice(backgrounds)
        origin_background = f"{origin}/{background}"
    else:
        origin_background = origin
    
    name = generate_name()
    callsign = generate_callsign()
    
    # Insert callsign if available
    if callsign:
        full_name = f"{name} {callsign}"
    else:
        full_name = name
    
    # 30% chance to use a period actor instead of physical description
    if random.random() < 0.3:
        actor = random.choice(period_actors)
        description = f"*(as played by {actor})*"
    else:
        description = f"*({random.choice(physical_descriptions)})*"
    
    attributes = generate_attributes(category)
    skill_ratings, actual_experience = generate_skill_ratings(category, attributes, experience_level)
    
    # Decide if character carries equipment
    if random.random() < 0.4:
        carried_item = f"Carries {get_equipment(category, has_psionics)}."
    else:
        carried_item = ""
    
    # Character personality
    personality = random.choice(personality_traits)
    
    # Format description line
    if carried_item:
        description_line = f"{carried_item} {personality.capitalize()}."
    else:
        description_line = f"{personality.capitalize()}."
    
    # Calculate Grit Check
    grit_check = attributes["GRIT"] * 5
    
    # Format attributes line
    attributes_line = " ".join([f"{attr} {val}" for attr, val in attributes.items()])
    
    # Add hooks or secrets if requested
    hook_line = ""
    if include_secrets and random.random() < 0.7:
        hook_line = f"*Secret: {random.choice(character_secrets)}.*"
    elif random.random() < 0.4:
        hook_line = f"*Hook: {random.choice(character_hooks)}.*"
    
    # Format final NPC
    npc = {
        "category": category,
        "name": full_name.upper(),
        "description": description,
        "profession_origin": f"{profession}/{origin_background}",
        "attributes": attributes_line + f" | Grit Check: {grit_check}%",
        "skills": ", ".join(skill_ratings),
        "personality": description_line,
        "hook": hook_line,
        "experience": actual_experience
    }
    
    return npc

def generate_npc_table(num_npcs=10, include_secrets=False, category_filter=None, 
                      experience_level=None, origin_filter=None, output_format='markdown'):
    """Generate a table of NPCs with filtering options"""
    npcs = []
    
    # Generate requested NPCs
    for _ in range(num_npcs):
        npcs.append(generate_npc(
            allowed_categories=category_filter, 
            experience_level=experience_level,
            forced_origin=origin_filter,
            include_secrets=include_secrets))
    
    if output_format == 'markdown':
        # Create markdown table
        table = "# ATOMIC TOMORROW NPCs\n\n"
        
        for npc in npcs:
            table += f"## {npc['name']}\n"
            table += f"{npc['description']}\n\n"
            table += f"**Profession/Origin:** {npc['profession_origin']}\n\n"
            table += f"**Attributes:** {npc['attributes']}\n\n"
            table += f"**Skills:** {npc['skills']}\n\n"
            table += f"{npc['personality']}\n\n"
            
            if npc['hook']:
                table += f"{npc['hook']}\n\n"
            
            table += "---\n\n"
        
        return table
    
    elif output_format == 'text':
        # Create plain text output
        table = "ATOMIC TOMORROW NPCs\n\n"
        
        for npc in npcs:
            table += f"{npc['name']}\n"
            table += f"{npc['description']}\n"
            table += f"Profession/Origin: {npc['profession_origin']}\n"
            table += f"Attributes: {npc['attributes']}\n"
            table += f"Skills: {npc['skills']}\n"
            table += f"{npc['personality']}\n"
            
            if npc['hook']:
                table += f"{npc['hook']}\n"
            
            table += "-" * 50 + "\n\n"
        
        return table
    
    elif output_format == 'json':
        # Return raw JSON data
        return json.dumps(npcs, indent=2)
    
    else:
        return "Unsupported output format"

def generate_encounter(num_npcs=3, encounter_type=None, difficulty=None, include_secrets=False):
    """Generate a complete encounter with multiple NPCs and situation"""
    # Define possible encounter types
    encounter_types = [
        "Combat Ambush", "Diplomatic Negotiation", "Mysterious Discovery", 
        "Rescue Mission", "Intelligence Gathering", "Trade Dispute",
        "Alien Contact", "Mysterian Infiltration", "Technical Emergency",
        "Criminal Activity", "Exploration Hazard", "Rival Confrontation"
    ]
    
    # Define encounter difficulties
    difficulties = ["Easy", "Standard", "Challenging", "Difficult", "Extreme"]
    
    # Select encounter type and difficulty if not specified
    if not encounter_type:
        encounter_type = random.choice(encounter_types)
    
    if not difficulty:
        difficulty = random.choice(difficulties)
    
    # Determine appropriate NPC types based on encounter type
    category_mapping = {
        "Combat Ambush": ["SOLDIERS & ENFORCERS", "SCOUNDRELS & OPPORTUNISTS"],
        "Diplomatic Negotiation": ["COMMUNICATIONS & DIPLOMATS", "MERCHANTS & TRADERS"],
        "Mysterious Discovery": ["SCIENTISTS & INTELLECTUALS", "EXPLORERS & SCOUTS"],
        "Rescue Mission": ["SPACERS & PILOTS", "MEDICAL SPECIALISTS"],
        "Intelligence Gathering": ["COMMUNICATIONS & DIPLOMATS", "PSYCHICS & ESPERS"],
        "Trade Dispute": ["MERCHANTS & TRADERS", "SCOUNDRELS & OPPORTUNISTS"],
        "Alien Contact": ["COMMUNICATIONS & DIPLOMATS", "SCIENTISTS & INTELLECTUALS"],
        "Mysterian Infiltration": ["MYSTERIAN AGENTS", "PSYCHICS & ESPERS"],
        "Technical Emergency": ["MECHANICS & ENGINEERS", "SPACERS & PILOTS"],
        "Criminal Activity": ["SCOUNDRELS & OPPORTUNISTS", "SOLDIERS & ENFORCERS"],
        "Exploration Hazard": ["EXPLORERS & SCOUTS", "SPECIALIZED ROLES"],
        "Rival Confrontation": ["SPECIALIZED ROLES", "MERCHANTS & TRADERS"]
    }
    
    # Set skill levels based on difficulty
    experience_mapping = {
        "Easy": ["Novice", "Beginner"],
        "Standard": ["Beginner", "Competent"],
        "Challenging": ["Competent", "Expert"],
        "Difficult": ["Expert", "Expert"],
        "Extreme": ["Expert", "Master"]
    }
    
    # Get appropriate categories and experience levels
    categories = category_mapping.get(encounter_type, None)
    experience_levels = experience_mapping.get(difficulty, ["Competent"])
    
    # Generate NPCs for the encounter
    npcs = []
    for i in range(num_npcs):
        # Alternate between categories for diverse NPCs
        if categories:
            category = [categories[i % len(categories)]]
        else:
            category = None
        
        # Alternate between experience levels
        experience = experience_levels[i % len(experience_levels)]
        
        npcs.append(generate_npc(allowed_categories=category, 
                                experience_level=experience,
                                include_secrets=include_secrets))
    
    # Generate encounter description
    encounter_descriptions = {
        "Combat Ambush": [
            "Characters are attacked while traveling through a narrow canyon",
            "A group of pirates attempts to board the characters' ship",
            "Locals mistake the characters for rivals and open fire",
            "A routine stop at a spaceport turns into a shootout",
            "Characters walk into a trap set by a rival faction"
        ],
        "Diplomatic Negotiation": [
            "Mediating a dispute between rival mining companies",
            "Negotiating safe passage through contested territory",
            "Establishing first contact protocols with newly discovered faction",
            "Resolving a cultural misunderstanding before it escalates",
            "Negotiating the release of prisoners/hostages"
        ],
        "Mysterious Discovery": [
            "Ancient Forerunner technology activates unexpectedly",
            "Strange readings lead to an undocumented phenomenon",
            "A derelict ship with signs of unusual damage is found",
            "Excavation uncovers an alien artifact of unknown purpose",
            "Scientific expedition encounters inexplicable readings"
        ],
        "Rescue Mission": [
            "Ship in distress with failing life support systems",
            "Explorers trapped by geological activity on Venus",
            "Station personnel caught in a radiation leak",
            "Crashed transport on Mars with survivors in danger",
            "Medical emergency in an isolated research facility"
        ],
        "Intelligence Gathering": [
            "Infiltrate corporate facility to obtain research data",
            "Identify Mysterian agent operating in a colony",
            "Monitor suspicious activity at a spaceport",
            "Extract informant with valuable information",
            "Verify the authenticity of a leaked document"
        ],
        "Trade Dispute": [
            "Competing claims over asteroid mining rights",
            "Argument over delivery of faulty equipment",
            "Accusations of smuggling contraband goods",
            "Trade route blockaded by protesting workers",
            "Valuable cargo contested by multiple parties"
        ],
        "Alien Contact": [
            "Unscheduled meeting with Red Martian delegation",
            "Strange signals lead to an unknown species",
            "Diplomatic incident involving cultural misunderstanding",
            "First contact protocols activated for newly discovered life",
            "Mysterious beings seek to communicate through unusual means"
        ],
        "Mysterian Infiltration": [
            "Strange behavior suggests replaced personnel",
            "Mysterious technology discovered in colony systems",
            "Security breach traced to Mysterian influence",
            "Communications relay reprogrammed for unknown purpose",
            "Key personnel showing signs of mind control"
        ],
        "Technical Emergency": [
            "Critical system failure on a spacecraft or station",
            "Experimental technology creates dangerous situation",
            "Sabotaged equipment threatens catastrophic failure",
            "Atomic power system approaching meltdown",
            "Life support systems failing in isolated habitat"
        ],
        "Criminal Activity": [
            "High-value heist in progress at secure facility",
            "Smuggling operation discovered in routine inspection",
            "Black market auction of illegal technology",
            "Criminal gang exploiting local population",
            "Corporate espionage operation uncovered"
        ],
        "Exploration Hazard": [
            "Expedition faces unexpected environmental threat",
            "Previously unmapped spatial anomaly discovered",
            "Dangerous local wildlife threatening outpost",
            "Strange atmospheric phenomenon interferes with equipment",
            "Unstable planetary geology creates immediate danger"
        ],
        "Rival Confrontation": [
            "Competing expedition teams claim the same discovery",
            "Corporate rivals seeking to dominate local resources",
            "Professional competition escalates to sabotage",
            "Old enemies cross paths in neutral territory",
            "Rival factions compete for influential contract"
        ]
    }
    
    description = random.choice(encounter_descriptions.get(encounter_type, ["Unexpected encounter"]))
    
    # Format encounter data
    encounter = {
        "type": encounter_type,
        "difficulty": difficulty,
        "description": description,
        "npcs": npcs
    }
    
    encounter_text = f"# {encounter_type} ({difficulty})\n\n"
    encounter_text += f"{description}\n\n"
    encounter_text += "## NPCs\n\n"
    
    for npc in npcs:
        encounter_text += f"### {npc['name']}\n"
        encounter_text += f"{npc['description']}\n\n"
        encounter_text += f"**Profession/Origin:** {npc['profession_origin']}\n\n"
        encounter_text += f"**Attributes:** {npc['attributes']}\n\n"
        encounter_text += f"**Skills:** {npc['skills']}\n\n"
        encounter_text += f"{npc['personality']}\n\n"
        
        if npc['hook']:
            encounter_text += f"{npc['hook']}\n\n"
        
        encounter_text += "---\n\n"
    
    return encounter_text

def generate_location(location_type=None, scale=None, details_level="standard"):
    """Generate a location description for Atomic Tomorrow Adventures"""
    # Define location types
    location_types = [
        "Spaceport", "Colony", "Research Station", "Mining Facility", 
        "Entertainment Venue", "Military Base", "Trading Post", 
        "Derelict Structure", "Secret Installation", "Natural Wonder",
        "Corporate Headquarters", "Mysterian Site", "Forerunner Ruins"
    ]
    
    # Define scales
    scales = ["Small", "Medium", "Large", "Massive"]
    
    # Select type and scale if not provided
    if not location_type:
        location_type = random.choice(location_types)
    
    if not scale:
        scale = random.choice(scales)
    
    # Generate name based on type
    location_prefixes = {
        "Spaceport": ["Port", "Dock", "Terminal", "Landing Zone", "Starport", "Gateway"],
        "Colony": ["Settlement", "Outpost", "Colony", "Habitat", "Dome", "Station"],
        "Research Station": ["Laboratory", "Research Post", "Science Station", "Observatory", "Institute"],
        "Mining Facility": ["Extraction Site", "Refinery", "Dig", "Mine", "Quarry", "Excavation"],
        "Entertainment Venue": ["Pleasure Dome", "Oasis", "Garden", "Casino", "Theater", "Club"],
        "Military Base": ["Garrison", "Outpost", "Fort", "Base", "Depot", "Bunker"],
        "Trading Post": ["Market", "Exchange", "Trading Hub", "Bazaar", "Commerce Center"],
        "Derelict Structure": ["Wreck", "Ruin", "Abandoned", "Derelict", "Ghost Station"],
        "Secret Installation": ["Hidden Base", "Black Site", "Shadow Facility", "Classified Location"],
        "Natural Wonder": ["Formation", "Anomaly", "Wonder", "Phenomenon", "Marvel"],
        "Corporate Headquarters": ["Tower", "Complex", "Headquarters", "Center", "Campus"],
        "Mysterian Site": ["Artifact", "Incursion", "Anomaly", "Disturbance", "Phenomenon"],
        "Forerunner Ruins": ["Temple", "Structure", "Monument", "Complex", "Artifact"]
    }
    
    location_elements = {
        "Descriptor": ["Alpha", "Beta", "Gamma", "Nova", "Prime", "Central", "Frontier", 
                      "Deep", "New", "Old", "Upper", "Lower", "Eastern", "Western",
                      "Atomic", "Stellar", "Cosmic", "Orbital", "Ancient", "Modern"],
        "Location": ["Mars", "Venus", "Luna", "Mercury", "Jupiter", "Saturn", "Ceres", 
                    "Ganymede", "Europa", "Titan", "Deimos", "Phobos", "Callisto", "Io",
                    "Belt", "Terra", "Earth", "Sol", "Pluto", "Neptune"],
        "Numerals": ["One", "Two", "Three", "Seven", "Nine", "Twelve", "Thirteen", 
                    "Seventeen", "Twenty-One", "Forty-Two", "Zero", "X", "V", "I", "II"],
        "Names": ["Armstrong", "Gagarin", "Tereshkova", "Einstein", "Goddard", "Tsiolkovsky",
                 "Wells", "Asimov", "Von Braun", "Ride", "Aldrin", "Oppenheimer", "Fermi"]
    }
    
    # Generate name parts
    prefix = random.choice(location_prefixes.get(location_type, ["Site"]))
    
    # Different name patterns
    name_pattern = random.choice([
        "prefix_descriptor_location",
        "prefix_location",
        "prefix_numeral",
        "prefix_name",
        "descriptor_prefix_location",
        "location_prefix_numeral"
    ])
    
    if name_pattern == "prefix_descriptor_location":
        name = f"{prefix} {random.choice(location_elements['Descriptor'])} {random.choice(location_elements['Location'])}"
    elif name_pattern == "prefix_location":
        name = f"{prefix} {random.choice(location_elements['Location'])}"
    elif name_pattern == "prefix_numeral":
        name = f"{prefix} {random.choice(location_elements['Numerals'])}"
    elif name_pattern == "prefix_name":
        name = f"{prefix} {random.choice(location_elements['Names'])}"
    elif name_pattern == "descriptor_prefix_location":
        name = f"{random.choice(location_elements['Descriptor'])} {prefix} {random.choice(location_elements['Location'])}"
    else:  # location_prefix_numeral
        name = f"{random.choice(location_elements['Location'])} {prefix} {random.choice(location_elements['Numerals'])}"
    
    # Location characteristics based on type
    characteristics = {
        "Spaceport": ["bustling with activity", "carefully regulated", "known for smugglers", 
                      "with impressive docking arrays", "featuring atomic refueling stations",
                      "with customs officials examining all cargo", "hosting ships from across the system"],
        "Colony": ["struggling with air recyclers", "thriving under a magnetic dome", 
                  "carved into the local landscape", "with distinct architectural style",
                  "built from prefabricated modules", "featuring hybrid Earth-local plants"],
        "Research Station": ["filled with experimental equipment", "with specialized containment units", 
                            "featuring extensive sensor arrays", "with transparent observation domes",
                            "containing unusual specimens", "humming with computational power"],
        "Mining Facility": ["with massive excavation equipment", "processing valuable ores", 
                           "employing local indigenous labor", "carved deep into the terrain",
                           "with automated extraction systems", "surrounded by tailings and waste"],
        "Entertainment Venue": ["featuring simulated environments", "catering to exotic tastes", 
                               "with stunning holographic displays", "offering mood-altering experiences",
                               "promising discretion to clients", "with themes from across history"],
        "Military Base": ["bristling with defensive systems", "maintaining constant vigilance", 
                         "housing prototype weapons", "with underground bunker networks",
                         "training specialized combat teams", "monitoring regional space"],
        "Trading Post": ["offering goods from across the system", "with crowded market stalls", 
                        "negotiating in dozen languages", "handling suspicious cargo",
                        "specializing in technological components", "featuring local artisan goods"],
        "Derelict Structure": ["showing signs of violent combat", "slowly being reclaimed by environment", 
                              "with systems still partially functional", "preserving mysteries of the past",
                              "with dangerous structural damage", "containing valuables left behind"],
        "Secret Installation": ["hidden from conventional sensors", "with multiple security checkpoints", 
                               "conducting classified operations", "employing specialized personnel",
                               "maintaining complete communication silence", "denying its own existence"],
        "Natural Wonder": ["defying scientific explanation", "drawing researchers from across space", 
                          "with unique environmental properties", "inspiring religious pilgrimage",
                          "appearing in indigenous legends", "showing signs of artificial influence"],
        "Corporate Headquarters": ["projecting power and wealth", "with extensive security measures", 
                                 "featuring cutting-edge technology", "housing proprietary research",
                                 "maintaining careful corporate image", "with specialized landing pads"],
        "Mysterian Site": ["emitting unusual energy signatures", "with evidence of alien technology", 
                          "cordoned off by military forces", "defying conventional analysis",
                          "slowly changing the surrounding environment", "with temporal anomalies"],
        "Forerunner Ruins": ["covered in indecipherable symbols", "periodically activating systems", 
                            "showing architectural impossibilities", "with perfectly preserved artifacts",
                            "predating human civilization", "built with unknown materials"]
    }
    
    # Scale descriptions
    scale_descriptions = {
        "Small": ["intimate", "compact", "efficient", "cramped", "modest", "limited"],
        "Medium": ["comfortable", "well-proportioned", "adequate", "mid-sized", "standard", "conventional"],
        "Large": ["sprawling", "expansive", "extensive", "impressive", "substantial", "considerable"],
        "Massive": ["enormous", "colossal", "vast", "gigantic", "immense", "overwhelming"]
    }
    
    # Generate basic description
    scale_adj = random.choice(scale_descriptions[scale])
    characteristic = random.choice(characteristics.get(location_type, ["noteworthy"]))
    
    basic_description = f"A {scale_adj} {location_type.lower()} {characteristic}."
    
    # Generate population/occupants based on scale
    population_by_scale = {
        "Small": ["A handful of", "About a dozen", "Fewer than twenty", "A skeleton crew of"],
        "Medium": ["Several dozen", "Approximately fifty", "About a hundred", "A modest complement of"],
        "Large": ["Several hundred", "Nearly a thousand", "Multiple teams of", "A significant population of"],
        "Massive": ["Thousands of", "A teeming population of", "Multiple divisions of", "A huge concentration of"]
    }
    
    population_by_type = {
        "Spaceport": ["customs officials", "dockworkers", "travelers", "merchants", "ship mechanics"],
        "Colony": ["settlers", "colonists", "workers", "families", "administrators", "specialists"],
        "Research Station": ["scientists", "research assistants", "security personnel", "specialists", "test subjects"],
        "Mining Facility": ["miners", "engineers", "technicians", "operators", "overseers", "geologists"],
        "Entertainment Venue": ["performers", "patrons", "staff", "security", "artists", "tourists"],
        "Military Base": ["soldiers", "officers", "technicians", "strategists", "support personnel"],
        "Trading Post": ["merchants", "customers", "traders", "brokers", "security guards", "travelers"],
        "Derelict Structure": ["scavengers", "researchers", "wildlife", "automated systems", "ghosts of the past"],
        "Secret Installation": ["operatives", "specialists", "security forces", "researchers", "test subjects"],
        "Natural Wonder": ["researchers", "tourists", "local fauna", "indigenous people", "pilgrims"],
        "Corporate Headquarters": ["executives", "employees", "security personnel", "specialists", "clients"],
        "Mysterian Site": ["investigation teams", "military personnel", "scientists", "security forces"],
        "Forerunner Ruins": ["archaeologists", "security details", "researchers", "looters", "cultists"]
    }
    
    population_prefix = random.choice(population_by_scale[scale])
    population_type = random.choice(population_by_type.get(location_type, ["individuals"]))
    
    population_description = f"{population_prefix} {population_type} occupy the site."
    
    # Generate notable features based on details level
    if details_level in ["standard", "detailed"]:
        # Create notable features
        features_by_type = {
            "Spaceport": ["an unusually efficient customs process", "a black market operating in the maintenance levels", 
                        "ships from unregistered origins", "frequent security patrols", "a popular pilot's lounge"],
            "Colony": ["hydroponics gardens producing exotic fruits", "a unique local government system", 
                     "integration with indigenous structures", "a memorial to failed colonization attempts", 
                     "modified environmental suits for local conditions"],
            "Research Station": ["containment facilities for dangerous specimens", "a massive computer core", 
                              "experimental technology being tested", "unusually tight security", 
                              "a special communications array"],
            "Mining Facility": ["a recently discovered rich vein", "disputes with local inhabitants", 
                             "dangerous excavation accidents", "prototype extraction technology", 
                             "evidence of ancient mining operations"],
            "Entertainment Venue": ["exclusive VIP areas", "performers with subtle alien features", 
                                 "questionably legal experiences for sale", "stunning holographic displays", 
                                 "a famous house specialty"],
            "Military Base": ["a restricted high-security area", "advanced weapon testing range", 
                           "specialized training facilities", "tensions between officers and enlisted", 
                           "prototype vehicles undergoing trials"],
            "Trading Post": ["an unusually diverse clientele", "suspected counterfeit goods", 
                          "information brokers operating openly", "distinctive local currency", 
                          "items from beyond the Solar System"],
            "Derelict Structure": ["still-functioning ancient technology", "evidence of what caused abandonment", 
                                "dangerous structural instabilities", "signs of recent visitors", 
                                "valuable salvage overlooked by others"],
            "Secret Installation": ["disguised entrance mechanisms", "unusual energy signatures", 
                                 "compartmentalized information system", "specialized containment units", 
                                 "advanced security measures"],
            "Natural Wonder": ["unexplainable physical properties", "research teams taking measurements", 
                            "local legends about the site", "unusual effects on technology", 
                            "valuable resource deposits"],
            "Corporate Headquarters": ["prototype technology on display", "extreme security measures", 
                                    "luxurious executive facilities", "evidence of corporate espionage", 
                                    "proprietary technology"],
            "Mysterian Site": ["technology resisting analysis", "subtle environmental changes", 
                            "unexplained phenomena", "military containment perimeter", 
                            "researchers with unusual behavior"],
            "Forerunner Ruins": ["partially active ancient technology", "inscriptions defying translation", 
                               "architectural elements impossible with human technology", 
                               "artifacts with unusual properties", "areas that were recently excavated"]
        }
        
        # Select features based on location type
        possible_features = features_by_type.get(location_type, ["something unusual", "a notable feature", "a distinctive element"])
        num_features = 2 if details_level == "standard" else 3
        selected_features = random.sample(possible_features, min(num_features, len(possible_features)))
        
        features_text = "Notable features include " + ", ".join(selected_features) + "."
    else:
        features_text = ""
    
    # Generate rumors/secrets for detailed descriptions
    secrets_text = ""
    if details_level == "detailed":
        secrets_by_type = {
            "Spaceport": ["smugglers have a secret arrangement with port officials", "a spy network operates through the maintenance crews", 
                        "the docking computers have an exploitable flaw", "an unregistered ship makes regular landings", 
                        "customs officials are blackmailing certain captains"],
            "Colony": ["the environmental systems are slowly failing", "there's a secret vault of Earth treasures", 
                     "some colonists show signs of mutation", "communications with Earth are being censored", 
                     "native microorganisms are affecting colonist behavior"],
            "Research Station": ["experiments have escaped containment", "some research subjects were unwilling", 
                              "an artificial intelligence is developing in the computer system", "staff are being affected by their research", 
                              "military applications are being developed for civilian discoveries"],
            "Mining Facility": ["miners have discovered something they're hiding from management", "ore shipments contain smuggled contraband", 
                             "dangerous working conditions are being covered up", "an ancient artifact was uncovered", 
                             "the facility is a front for a different operation"],
            "Entertainment Venue": ["mind-affecting technology is used on patrons", "clientele include non-human visitors", 
                                 "blackmail material is collected on important guests", "some performers are not there willingly", 
                                 "illegal substances are manufactured on-site"],
            "Military Base": ["testing illegal weapons technology", "preparing for an unannounced operation", 
                           "housing prisoners without documentation", "officers are plotting a coup", 
                           "evidence of Mysterian contact is hidden in secure storage"],
            "Trading Post": ["it's a front for intelligence gathering", "some merchants are Mysterian disguised as humans", 
                          "stolen goods are fenced through legitimate businesses", "information is the most valuable commodity traded", 
                          "secret auctions offer illegal technology"],
            "Derelict Structure": ["something still lives inside", "the abandonment was staged", 
                                "a fortune in valuable materials remains hidden", "time behaves strangely within certain sections", 
                                "automated systems are still carrying out their final commands"],
            "Secret Installation": ["conducting illegal human experimentation", "developing weapons of mass destruction", 
                                 "communicating with non-human intelligence", "using forbidden Mysterian technology", 
                                 "operated by an organization that officially doesn't exist"],
            "Natural Wonder": ["subtly influencing the minds of researchers", "growing or changing at an imperceptible rate", 
                            "periodically emitting dangerous radiation", "artifacts of artificial origin have been found nearby", 
                            "local wildlife exhibits unusual mutations"],
            "Corporate Headquarters": ["conducting industrial espionage against competitors", "concealing financial collapse", 
                                    "executives have been replaced by duplicates", "developing illegal technology", 
                                    "involved in assassinations of rivals"],
            "Mysterian Site": ["active experiments on captured humans", "sending signals to deep space", 
                            "causing physical changes to investigators", "evidence suggests similar sites exist in major cities", 
                            "contains technology that manipulates time"],
            "Forerunner Ruins": ["portions still contain functional technology", "affected visitors report the same dreams", 
                               "certain chambers show signs of recent Mysterian activity", "some sections appear to be self-repairing", 
                               "Earth artifacts found alongside ancient technology"]
        }
        
        secret = random.choice(secrets_by_type.get(location_type, ["something unusual is happening here"]))
        secrets_text = f"Rumor suggests that {secret}."
    
    # Assemble the complete location description
    location_text = f"# {name}\n\n"
    location_text += f"## {scale} {location_type}\n\n"
    location_text += f"{basic_description}\n\n"
    location_text += f"{population_description}\n\n"
    
    if features_text:
        location_text += f"{features_text}\n\n"
    
    if secrets_text:
        location_text += f"{secrets_text}\n\n"
    
    return location_text

def main():
    parser = argparse.ArgumentParser(description='Generate NPCs for Atomic Tomorrow Adventures')
    parser.add_argument('--count', type=int, default=3, help='Number of NPCs to generate')
    parser.add_argument('--format', choices=['markdown', 'text', 'json'], default='markdown', 
                        help='Output format')
    parser.add_argument('--secrets', action='store_true', help='Include character secrets')
    parser.add_argument('--category', help='Filter NPCs by category')
    parser.add_argument('--experience', choices=['Novice', 'Beginner', 'Competent', 'Expert', 'Master'], 
                        help='Set experience level')
    parser.add_argument('--origin', help='Filter NPCs by origin')
    parser.add_argument('--encounter', action='store_true', help='Generate a complete encounter')
    parser.add_argument('--encounter-type', help='Specify encounter type')
    parser.add_argument('--difficulty', choices=['Easy', 'Standard', 'Challenging', 'Difficult', 'Extreme'],
                        help='Set encounter difficulty')
    parser.add_argument('--location', action='store_true', help='Generate a location')
    parser.add_argument('--location-type', help='Specify location type')
    parser.add_argument('--scale', choices=['Small', 'Medium', 'Large', 'Massive'],
                        help='Set location scale')
    parser.add_argument('--details', choices=['basic', 'standard', 'detailed'], default='standard',
                        help='Level of location details')
    
    args = parser.parse_args()
    
    if args.encounter:
        print(generate_encounter(
            num_npcs=args.count,
            encounter_type=args.encounter_type,
            difficulty=args.difficulty,
            include_secrets=args.secrets
        ))
    elif args.location:
        print(generate_location(
            location_type=args.location_type,
            scale=args.scale,
            details_level=args.details
        ))
    else:
        print(generate_npc_table(
            num_npcs=args.count,
            include_secrets=args.secrets,
            category_filter=args.category,
            experience_level=args.experience,
            origin_filter=args.origin,
            output_format=args.format
        ))

if __name__ == "__main__":
    main()