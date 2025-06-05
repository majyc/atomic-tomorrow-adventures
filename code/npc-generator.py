import random
import textwrap
import os
import json

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

# Default data - will be used if files don't exist or can't be read
default_period_actors = {
    "male" : [
        "Robert Stack", "Lee Marvin", "Charlton Heston", "James Stewart", 
        "Humphrey Bogart", "Cary Grant", "Gregory Peck", "Burt Lancaster", 
        "James Dean", "Rock Hudson", "Kirk Douglas", "William Holden", 
        "Clark Gable", "Sidney Poitier", "John Wayne", "Gene Kelly",
        "Henry Fonda", "Spencer Tracy", "James Cagney", "Orson Welles", 
        "Fred Astaire", "Peter Lorre", "Vincent Price", "Edward G. Robinson", 
        "Gary Cooper", "Yul Brynner", "James Mason", "Errol Flynn", "Boris Karloff",
        "Steve McQueen", "Jack Palance", "Anthony Quinn", "Jimmy Durante", 
        "Basil Rathbone", "Dean Martin", "Rudolph Valentino", "George Sanders", 
        "Walter Pidgeon", "Victor Mature", "Lionel Barrymore", "Leslie Howard", 
        "Bela Lugosi", "Glenn Ford", "Ronald Reagan", "Alan Ladd", "Tyrone Power", 
        "Dana Andrews", "Jack Webb", "Peter Sellers", "Paul Newman", "Tony Curtis"
    ],
    "female" : [
        "Agnes Moorehead", "Grace Kelly", "Lauren Bacall", "Audrey Hepburn",
        "Katharine Hepburn", "Barbara Stanwyck", "Marilyn Monroe", 
        "Elizabeth Taylor", "Doris Day", "Judy Garland", "Rita Hayworth",
        "Debbie Reynolds", "Ingrid Bergman", "Vivien Leigh", "Joan Crawford", 
        "Bette Davis", "Ginger Rogers", "Lana Turner", "Sophia Loren", 
        "Veronica Lake", "Jane Russell", "Gloria Swanson", "Ava Gardner", 
        "Jayne Mansfield", "Greta Garbo", "Marlene Dietrich", "Lucille Ball", 
        "Kim Novak", "Rosalind Russell", "Jean Simmons", "Hedy Lamarr", 
        "Maureen O'Hara", "Shirley Temple", "Joan Fontaine", "Claudette Colbert", 
        "Donna Reed", "June Allyson", "Myrna Loy", "Olivia de Havilland", 
        "Loretta Young", "Tallulah Bankhead", "Ida Lupino", "Claire Trevor", 
        "Anne Baxter", "Carole Lombard", "Janet Leigh", "Shelley Winters", 
        "Natalie Wood", "Deborah Kerr"
    ]
}

default_physical_descriptions = [
    "weathered face, steely eyes", "slender, graceful movements", "towering, imposing presence",
    "compact build, alert posture", "elegant, aristocratic bearing", "rugged, scarred hands",
    "immaculate appearance, not a hair out of place", "wild hair, distracted eyes",
    "muscular, military posture", "delicate features, penetrating gaze", "cybernetic eye, nervous twitch"
]

default_personality_traits = [
    "cynical but reliable", "enthusiastic about dangerous ideas", "methodical to a fault",
    "recklessly brave", "constantly calculating odds", "painfully honest", "secretly romantic",
    "collects strange souvenirs", "trusts machines more than people", "hides empathy behind sarcasm"
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
    ]
}

origins = [
    "Terran", "Loonie", "Martian", "Venusian", "Belter", "Jovian", "Saturnian", 
    "Deep Spacer", "Genmodded", "Red Martian", "Mercurian", "Titanian", 
    "Neptunian", "Ceresian", "Plutonian"
]

backgrounds = [
    "Military Family", "Merchant Clan", "Frontier Family", "Academic Family", 
    "the Streets", "Corporate Drone Family", "Aristocratic Family", "Spacer Family", 
    "Religious Order", "Research Laboratory", "Megacity Family", "Political Dynasty", 
    "Colonist Family", "Underworld Family", "Showbiz Family"
]

# Skill descriptions by profession categories
skill_sets = {
    "SPACERS & PILOTS": [
        ["Piloting", "Navigation", "Technology (Ship Systems)", "Zero-G Operations (Space)"],
        ["Navigation (Space)", "Science (Astronomy)", "Computer Systems", "Piloting"],
        ["Piloting (Racing)", "Repair (Vehicles)", "Perception (Spatial Awareness)", "Performance"],
        ["Zero-G Operations (Space)", "Survival (Space)", "Technology", "Perception"]
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
    "SPECIALIZED ROLES": ["specialized tools", "environmental scanner", "protective gear", "technical manuals"]
}

def generate_name():
    """Generate a random name"""
    first_names_male = [
       # Original Names - Male
        "James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas",
        "George", "Donald", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason",
        "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen",
        "Andrew", "Raymond", "Gregory", "Joshua", "Jerry", "Dennis", "Walter", "Patrick", "Peter", "Harold",
        "Douglas", "Henry", "Carl", "Arthur", "Ryan", "Roger", "Joe", "Willie", "Ralph", "Lawrence",
    
        # International Names - Male
        "Alexander", "Daniel", "Matthew", "Ethan", "Hiroshi", "Viktor", "Lorenzo", "Jamal", "Rico", "Maxim",
        "Kazuo", "Andrei", "Omar", "Mateo", "Akira", "Dmitri", "Miguel", "Carlos", "Javier", "Antonio",
        "Hans", "Ivan", "Yusuf", "Sergei", "Klaus", "Rafael", "Ravi", "Tomas", "Felix", "Marco",
        "Werner", "Hideo", "Boris", "Ahmed", "Raul", "Kenji", "Pavel", "Jian", "Takeshi", "Emilio",
        "Henrik", "Ibrahim", "Nikita", "Sanjay", "Dieter", "Esteban", "Bruno", "Alexei", "Jin", "Fernando",
       
        # Retro Atomic Age Male Names
        "Buzz", "Ace", "Rex", "Clint", "Dash", "Flash", "Buck", "Jet", "Dirk", "Duke",
        "Orion", "Lance", "Flint", "Brock", "Rolland", "Quartz", "Rusty", "Cliff", "Ricky", "Troy",
        "Hank", "Chip", "Rad", "Rocky", "Vance", "Carson", "Zack", "Fletcher", "Rocket", "Atom",
        "Neil", "Buzz", "Edison", "Werner", "Angus", "Sterling", "Brutus", "Miles", "Gordon", "Conrad",
        
   ]

    first_names_female = [
       # Original Names - Female
       "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
       "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Donna", "Emily", "Carol",
       "Michelle", "Amanda", "Dorothy", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
       "Kathleen", "Amy", "Angela", "Shirley", "Anna", "Ruth", "Brenda", "Pamela", "Nicole", "Katherine",
       "Virginia", "Catherine", "Christine", "Samantha", "Debra", "Janet", "Rachel", "Carolyn", "Emma", "Maria",
       # International Names - Female
       "Zoe", "Sofia", "Emma", "Olivia", "Isabella", "Fatima", "Aisha", "Ling", "Svetlana", "Priya",
       "Zara", "Kali", "Nia", "Mira", "Natasha", "Yuki", "Elena", "Carmen", "Mei", "Olga",
       "Gabriela", "Marina", "Anya", "Laila", "Valentina", "Nadia", "Leila", "Sakura", "Eva", "Ana",
       "Adele", "Ingrid", "Sonia", "Rina", "Bianca", "Irene", "Lucia", "Vera", "Renata", "Fiona",
       "Katarina", "Rosa", "Naomi", "Lena", "Amara", "Yasmin", "Freya", "Chiara", "Jun", "Daniela"
       # Retro Atomic Age Female Names
       "Astrid", "Nova", "Venus", "Stella", "Luna", "Aurora", "Celeste", "Vega", "Polaris", "Cassandra",
       "Dot", "Betty", "Peggy", "Judy", "Lana", "Roxanne", "Darlene", "Ginger", "Mabel", "Sally",
       "Penny", "Frances", "Dolores", "Atomic", "Juno", "Velma", "Kitty", "Pearl", "Ruby", "Opal",
       "Phoenix", "Lyra", "Selene", "Maxine", "Viva", "Trixie", "Lola", "Bonnie", "Gloria", "Vivian",
    ]
 
    last_names = [
        # Original Names
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
        "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
        "Tanaka", "Ivanov", "Singh", "Rodriguez", "Wang", "Patel", "Kowalski", "Kim", "O'Brien", "Rossi",
        "Vasquez", "Petrov", "Yamamoto", "Chen", "Müller", "Johansson", "Gomez", "Dubois", "Morozov", "Nguyen",
        # Western Last Names
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
        "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
        "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
        "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts",
        "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Flores",
        "Morris", "Nguyen", "Murphy", "Rivera", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed",
        "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox", "Diaz", "Richardson", "Wood",
        
        # International Last Names
        "Tanaka", "Ivanov", "Singh", "Wang", "Patel", "Kowalski", "Kim", "O'Brien", "Rossi", "Vasquez",
        "Petrov", "Yamamoto", "Chen", "Müller", "Johansson", "Dubois", "Morozov", "Kuznetsov", "Schmidt", "Fischer",
        "Schneider", "Weber", "Meyer", "Wagner", "Becker", "Hoffmann", "Nakamura", "Satō", "Suzuki", "Takahashi",
        "Watanabe", "Kobayashi", "Hashimoto", "Ito", "Saito", "Yamaguchi", "Honda", "Li", "Zhang", "Liu",
        "Yang", "Huang", "Zhou", "Wu", "Xu", "Sun", "Ma", "Zhao", "Lopez", "Gonzalez",
        "Hernandez", "Perez", "Sanchez", "Ramirez", "Ferrari", "Romano", "Esposito", "Ricci", "Marino", "Bruno",
        "Colombo", "Rizzo", "Greco", "Lombardi", "Moretti", "Hansen", "Andersen", "Pedersen", "Nilsen", "Jensen"        
            
        # Pulp Sci-Fi Last Names
        "Rocketson", "Atomworth", "Stargazer", "Moonraker", "Cosmopoulos", "Galaxon", "Nebula", "Quasar", "Jetson", "Orbital",
        "Blaster", "Proton", "Neutron", "Steel", "Electron", "Fusion", "Thunder", "Voltage", "Quantum", "Pulsar",
        "Nova", "Astro", "Moonwalker", "Comet", "Laserbeam", "Radium", "Meteorite", "Isotope", "Vortex", "Stratosphere",
        "Moonshot", "Stardust", "Solaris", "Velocity", "Horizon", "Eclipse", "Neon", "Centauri", "Lightyear", "Cosmic",
    ]
   
    # Randomly choose gender
    is_male = random.choice([True, False])
    
    if is_male:
        first_name = random.choice(first_names_male)
        gender = "male"
    else:
        first_name = random.choice(first_names_female)
        gender = "female"
        
    last_name = random.choice(last_names)
    
    return f"{first_name} {last_name}", gender

def generate_callsign():
    """Generate a random callsign/nickname for appropriate professions"""
    adjectives = ["Lucky", "Maverick", "Ace", "Ghost", "Wild", "Smooth", "Crazy", "Hotshot", "Rocket", "Radar",
                 "Cool", "Atomic", "Comet", "Nova", "Stardust", "Sparks", "Bolt", "Ice", "Flash", "Shadow"]
    nouns = ["Dog", "Wolf", "Eagle", "Hawk", "Fox", "Cat", "Tiger", "Bull", "Bear", "Snake",
            "Falcon", "Shark", "Hunter", "Hammer", "Blade", "Jet", "Viper", "Kid", "Cowboy", "Phoenix"]
    
    # 10% chance of getting a callsign
    if random.choices([True, False], weights=[1, 9], k=1)[0]:
        return f"'{random.choice(adjectives)} {random.choice(nouns)}'"
    else:
        return ""

def generate_attributes():
    """Generate random attributes"""
    # Weighted distribution to create more competent NPCs
    attributes = {}
    for attr in ["BRAW", "REFL", "NERVE", "SAVVY", "CHARM", "GRIT", "GUILE"]:
        # Weighted toward competent professionals
        weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 15, 10, 8, 6, 4]
        value = random.choices(list(range(3, 19)), weights=weights)[0]
        attributes[attr] = value
    
    return attributes

def generate_skill_ratings(category, is_experienced=True):
    """Generate skill ratings based on profession category"""
    skills_for_category = random.choice(skill_sets[category])
    skill_ratings = []
    
    # Determine the character's experience level
    experience_weights = [1, 3, 5, 8, 3]  # Novice to Master, weighted toward Competent
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
    
    # Generate skill values
    skill_ratings.append(f"*{skills_for_category[0]}* {random.randint(*primary_range)}%")
    skill_ratings.append(f"*{skills_for_category[1]}* {random.randint(*secondary_range)}%")
    skill_ratings.append(f"*{skills_for_category[2]}* {random.randint(*tertiary_range)}%")
    skill_ratings.append(f"*{skills_for_category[3]}* {random.randint(*fourth_range)}%")
    
    return skill_ratings

def get_equipment(category):
    """Get appropriate equipment for the character based on category"""
    return random.choice(equipment[category])

def generate_npc():
    """Generate a complete NPC"""
    # Select a category
    category = random.choice(list(professions.keys()))
    profession = random.choice(professions[category])
    origin = random.choice(origins)
    
    # 50% chance to include a background
    if random.choice([True, False]):
        background = random.choice(backgrounds)
        origin_background = f"{origin}/{background}"
    else:
        origin_background = origin
    
    name, gender = generate_name()
    callsign = generate_callsign()
    
    # Insert callsign if available
    if callsign:
        full_name = f"{name} {callsign}"
    else:
        full_name = name
    
    # 30% chance to use a period actor instead of physical description
    if random.random() < 0.3:
        actor = random.choice(period_actors[gender])
        description = f"*(as played by {actor})*"
    else:
        description = f"*({random.choice(physical_descriptions)})*"
    
    attributes = generate_attributes()
    skill_ratings = generate_skill_ratings(category)
    
    # Decide if character carries equipment
    if random.random() < 0.4:
        carried_item = f"Carries {get_equipment(category)}."
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
    
    # Format final NPC
    npc = {
        "category": category,
        "name": full_name.upper(),
        "description": description,
        "profession_origin": f"{profession}/{origin_background}",
        "attributes": attributes_line + f" | Grit Check: {grit_check}%",
        "skills": ", ".join(skill_ratings),
        "personality": description_line
    }
    
    return npc

def generate_npc_table(num_npcs=10):
    """Generate a table of NPCs"""
    npcs = []
    
    # Generate requested NPCs
    for _ in range(num_npcs):
        npcs.append(generate_npc())
    
    # Organize NPCs by category
    npcs_by_category = {}
    for npc in npcs:
        category = npc["category"]
        if category not in npcs_by_category:
            npcs_by_category[category] = []
        npcs_by_category[category].append(npc)
    
    # Build the output table
    output = []
    
    for category, category_npcs in npcs_by_category.items():
        output.append(f"\n## {category}\n")
        
        for npc in category_npcs:
            # Format each NPC entry
            npc_entry = [
                f"**{npc['name']}** {npc['description']}",
                f"{npc['profession_origin']} | {npc['attributes']}",
                f"{npc['skills']}",
                f"{npc['personality']}\n"
            ]
            
            output.extend(npc_entry)
    
    return "\n".join(output)

def create_default_data_files():
    """Create default data files if they don't exist"""
    # Check and create period_actors.json
    if not os.path.exists('period_actors.json'):
        with open('period_actors.json', 'w', encoding='utf-8') as file:
            json.dump(default_period_actors, file, indent=4)
        print("Created period_actors.json with default data")
    
    # Check and create physical_descriptions.json
    if not os.path.exists('physical_descriptions.json'):
        with open('physical_descriptions.json', 'w', encoding='utf-8') as file:
            json.dump(default_physical_descriptions, file, indent=4)
        print("Created physical_descriptions.json with default data")
    
    # Check and create personality_traits.json
    if not os.path.exists('personality_traits.json'):
        with open('personality_traits.json', 'w', encoding='utf-8') as file:
            json.dump(default_personality_traits, file, indent=4)
        print("Created personality_traits.json with default data")

# Example usage
if __name__ == "__main__":
    import argparse
    
    # Create default data files if they don't exist
    create_default_data_files()
    
    parser = argparse.ArgumentParser(description="Generate NPCs for Atomic Tomorrow Adventures")
    parser.add_argument("--num", type=int, default=10, help="Number of NPCs to generate")
    parser.add_argument("--output", type=str, help="Output file (if not provided, prints to console)")
    parser.add_argument("--update_actors", action="store_true", help="Recreate the default actors file")
    parser.add_argument("--update_descriptions", action="store_true", help="Recreate the default descriptions file")
    parser.add_argument("--update_personalities", action="store_true", help="Recreate the default personality traits file")
    
    args = parser.parse_args()
    
    # Handle update requests
    if args.update_actors:
        with open('period_actors.json', 'w', encoding='utf-8') as file:
            json.dump(default_period_actors, file, indent=4)
        print("Updated period_actors.json with default data")
    
    if args.update_descriptions:
        with open('physical_descriptions.json', 'w', encoding='utf-8') as file:
            json.dump(default_physical_descriptions, file, indent=4)
        print("Updated physical_descriptions.json with default data")
    
    if args.update_personalities:
        with open('personality_traits.json', 'w', encoding='utf-8') as file:
            json.dump(default_personality_traits, file, indent=4)
        print("Updated personality_traits.json with default data")
    
    # Generate NPCs
    npc_table = generate_npc_table(args.num)
    
    if args.output:
        with open(args.output, "w", encoding='utf-8') as f:
            f.write("# ATOMIC TOMORROW NPCs\n")
            f.write(npc_table)
        print(f"Generated {args.num} NPCs and saved to {args.output}")
    else:
        print("# ATOMIC TOMORROW NPCs")
        print(npc_table)