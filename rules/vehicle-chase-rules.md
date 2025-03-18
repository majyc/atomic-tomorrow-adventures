# ATOMIC TOMORROW ADVENTURES: VEHICLE CHASE SYSTEM

## CORE MECHANICS: THE HAZARD GAUNTLET

### DISTANCE TRACKING
- **Distance 1-3**: Contact range (ramming, boarding possible)
- **Distance 4-7**: Close pursuit (ranged weapons effective)
- **Distance 8-12**: Extended pursuit (visual contact maintained)
- **Distance 13-15**: Breaking point (pursuit nearly lost)
- **Distance 16+**: Escape achieved

### SUCCESS QUALITY EFFECTS
- **Critical Success** (matching doubles under skill): +3 distance advantage
- **Special Success** (roll ending in 0 or 5 under skill): +2 distance advantage
- **Ordinary Success** (roll under skill): +1 distance advantage
- **Failure** (roll over skill): No additional modifier
- **Special Failure** (roll ending in 0 or 5 over skill): Additional complications
- **Critical Failure** (matching doubles over skill): Automatic control loss

## CHASE ACTIONS

### LEAD VEHICLE ACTIONS

**STANDARD MANEUVER** (No Risk)
- Base Distance: +2
- Success Quality Modifiers Apply
- No Hazard Table roll required

**HAZARDOUS MANEUVER** (Risk Level 1)
- Base Distance: +3
- Roll d10 on Hazard Table
- Failure: Distance −1 and roll on Consequences Table

**DANGEROUS MANEUVER** (Risk Level 2)
- Base Distance: +4
- Roll d10 on Hazard Table
- Failure: Distance −2 and roll on Consequences Table with +20%

**RECKLESS MANEUVER** (Risk Level 3)
- Base Distance: +5
- Roll d10 on Hazard Table
- Failure: Distance −3 and roll on Consequences Table with +40%

**SUICIDAL MANEUVER** (Risk Level 4)
- Base Distance: +7
- Roll d10 on Hazard Table
- Failure: Automatic crash and roll on Catastrophic Results Table

**ATOMIC BURN** (Once per chase)
- Activate experimental propulsion system
- Roll percentile dice
- Gain +3 distance, plus additional distance equal to ones digit
- If roll ends in 0: damage to Propulsion system

### FOLLOWING VEHICLE ACTIONS

**FOLLOW THROUGH**
- Attempt the exact same hazard
- Success: No distance change
- Failure: Lead vehicle gains +2 distance and roll on Consequences Table

**ALTERNATE ROUTE**
- Roll d10
- 1-2: Perfect Bypass - No distance change
- 3-5: Viable Detour - Distance +2
- 6-8: Poor Choice - Distance +4
- 9-0: Dead End - Distance +6 and requires U-turn

**SHORTCUT GAMBIT** (Risk Level +1)
- Roll on Hazard Table at Risk Level +1
- Success: Distance −3
- Failure: Distance +2 and roll on Consequences Table with +20%

**MAXIMUM PURSUIT**
- Push vehicle beyond safety tolerances
- Roll Vehicle Operation at -20%
- Success: Distance −2
- Failure: 1 damage to Propulsion and no distance change

**SLINGSHOT MANEUVER** (Aerial/Space chases only)
- Use environmental object for gravity assist
- Roll Navigation or Vehicle Operation at -20%
- Success: Distance −3
- Failure: Distance +2 and 1 damage to Structure

## HAZARD TABLES

### DUAL-PURPOSE HAZARD TABLE
Roll d10:

1. **Tight Turn / Wind Shear**: Execute precise directional change
2. **Traffic Weave / Cloud Formation**: Navigate through obstacles
3. **Narrow Gap / Canyon Run**: Fit through restricted space
4. **Surface Change / Altitude Shift**: Transition between environments
5. **Atomic Testing Zone / Radiation Grid**: Navigate through active sensors
6. **Robot Traffic Control / Defense Drones**: Avoid automated systems
7. **Pneumatic Tube / Antigrav Lane**: Enter transport system
8. **Weather Control Station / Artificial Storm**: Navigate weather anomalies
9. **Experimental Transport / Prototype Testing**: Through active testing grounds
0. **Rocket Test Track / Missile Range**: Avoid weapons/vehicle tests

Each Risk Level uses the same table but with increasing danger:
- **Risk Level 1**: Basic version of hazard (skill roll at 0%)
- **Risk Level 2**: Enhanced difficulty (skill roll at -20%)
- **Risk Level 3**: Extreme version with active dangers (skill roll at -40%)
- **Risk Level 4**: Catastrophic/unstable version (skill roll at -60%)

## CONSEQUENCES TABLE
Roll percentile dice - the full number matters:

01-20: **Close Call**: Vehicle undamaged but thrown off optimal line (-10% to next maneuver)
21-40: **Minor Impact**: 1 damage to random system (ones digit determines: 1-3 Propulsion, 4-6 Steering, 7-0 Structure)
41-60: **System Stress**: -20% to actions for rounds equal to ones digit (1-3 Propulsion, 4-6 Steering, 7-0 All Systems)
61-80: **Major Collision**: 2 damage to random system (determined as above)
81-90: **Control Loss**: Vehicle spins/tumbles, requires Recovery roll to continue
91-00: **Critical Failure**: Vehicle disabled (91-95) or destroyed (96-00)

## CATASTROPHIC RESULTS TABLE
Roll d10:

1. **Total Breakdown**: Vehicle disabled but intact, occupants unharmed
2. **Spectacular Crash**: Vehicle wrecked, occupants take light damage
3. **Power Core Breach**: Radiation leak, vehicle disabled, area contaminated
4. **Chain Reaction**: Multiple systems fail simultaneously, vehicle crippled
5. **Rollover/Tailspin**: Vehicle severely damaged, occupants trapped
6. **System Cascade Failure**: Critical systems overload, creating chain reaction
7. **Special Catastrophe I**: Primary enhancement system fails catastrophically (see enhancement table)
8. **Special Catastrophe II**: Secondary enhancement system fails catastrophically (see enhancement table)
9. **Special Catastrophe III**: All enhancement systems fail catastrophically (see enhancement table)
0. **Collision Chain Reaction**: Vehicle crashes into nearest other vehicle, which must make its own Catastrophic Results roll

## SPEED RATING AND MANEUVERABILITY EFFECTS

### SPEED RATING (SR)

**Core Function**: Determines how quickly a vehicle can accelerate and its maximum speed
- **SR 1**: Slow (Cargo vehicles, construction equipment)
- **SR 2**: Standard (Family cruisers, jeeps, light aircraft)
- **SR 3**: Fast (Sports cars, military aircraft, racing boats)
- **SR 4**: Ultra (Racing vehicles, interceptor aircraft)
- **SR 5**: Experimental (Prototype vehicles, rocket cars)

**Distance Effect**: Each round, the vehicle with superior SR gains distance equal to the difference in SR ratings.
- Example: SR 4 vehicle vs. SR 2 vehicle = +2 distance per round for the SR 4 vehicle

**Terrain Speed Caps**:
- **Open Terrain**: No cap (full SR applies)
- **Highway/Straightaway**: No cap (full SR applies)
- **Suburban/Light Urban**: Maximum effective SR 3
- **Dense Urban**: Maximum effective SR 2
- **Extreme/Hazardous**: Maximum effective SR 1

Note: Speed caps don't reduce a vehicle's actual SR - they just limit how much SR difference affects distance changes in that environment.

### MANEUVERABILITY (MR)

**Core Function**: Determines how well a vehicle handles tight turns and complex maneuvers
- **MR 1**: Clumsy (-20% to maneuver rolls)
- **MR 2**: Standard (No modifier)
- **MR 3**: Responsive (+20% to maneuver rolls)
- **MR 4**: Precision (+40% to maneuver rolls)
- **MR 5**: Supernatural (+60% to maneuver rolls)

**Effect**: MR directly modifies all Hazardous, Dangerous, Reckless, and Suicidal Maneuver rolls.

### SIMPLE INTERACTION

- **Fast Straightaways**: SR dominates distance changes
- **Complex Environments**: Terrain speed caps naturally limit SR advantage
- **Lots of Maneuvers**: MR becomes more important as drivers attempt hazardous shortcuts
- **Strategic Route Choice**: Faster vehicles prefer open routes; nimble vehicles prefer complex routes

## VEHICLE DAMAGE SYSTEM

When a vehicle takes damage to a system:

**PROPULSION SYSTEM**
- **Stressed (1)**: Temporary -1 SR for 1d10 rounds
- **Damaged (2)**: -1 SR until repaired
- **Critical (3)**: -2 SR until repaired
- **Disabled (4)**: Vehicle immobilized

**STEERING SYSTEM**
- **Stressed (1)**: Temporary -1 MR for 1d10 rounds
- **Damaged (2)**: -1 MR until repaired
- **Critical (3)**: -2 MR until repaired
- **Disabled (4)**: Vehicle cannot turn

**STRUCTURE**
- **Stressed (1)**: Cosmetic damage only
- **Damaged (2)**: Vehicle leaking, passengers at -20% to actions
- **Critical (3)**: Vehicle severely compromised, passengers at -40%
- **Disabled (4)**: Vehicle breaking apart, immediate evacuation required

***Important:*** Even a vehicle with SR 1 can still participate effectively in a chase! Low SR means the vehicle accelerates more slowly and has a lower top speed, but with skillful driving and the right maneuvers, it can still pull off incredible stunts and keep pace through clever shortcuts and superior handling. Similarly, a vehicle with low MR can still attempt daring maneuvers - the driver just needs more skill to compensate for the vehicle's limitations.

## ATOMIC AGE VEHICLE ENHANCEMENTS

### ATOMIC POWER CORE
- **Normal Function**: Unlimited range (never runs out of fuel), +1 SR when activated
- **Standard Malfunction**: Critical damage causes radiation leak
- **Special Catastrophe I**: Core meltdown - vehicle disabled and surrounding area becomes radioactive hazard zone
- **Special Catastrophe II**: Atomic flash - everyone within sight radius must succeed at REFLEX×5 roll or be blinded for 1d10 rounds
- **Special Catastrophe III**: Atomic displacement - vehicle and everything within 10-meter radius is teleported to random location within 1d10 kilometers

### ANTI-GRAVITY MODULES
- **Normal Function**: Vehicle can hover 1-3 meters above surface, immune to ground-based obstacles
- **Standard Malfunction**: Limited duration: d10 rounds maximum operation
- **Special Catastrophe I**: Gravity inversion - vehicle and occupants experience inverted gravity for 1d10 rounds
- **Special Catastrophe II**: Zero-G field - vehicle and surrounding area experiences zero gravity, requiring Zero-G skill checks for control
- **Special Catastrophe III**: Crushing gravity - occupants must succeed at BRAWN×5 check or take 1d10 damage from extreme gravity

### DIMENSIONAL PHASE SHIFTER
- **Normal Function**: Once per chase, briefly phase through solid matter
- **Standard Malfunction**: Roll d10: On a 1, system goes haywire with unexpected effects
- **Special Catastrophe I**: Partial phase - vehicle becomes intangible but occupants don't, ejecting them through the vehicle at high speed
- **Special Catastrophe II**: Dimensional slip - vehicle and occupants phase into alternate reality for 1d10 hours
- **Special Catastrophe III**: Quantum superposition - vehicle exists in multiple states simultaneously, requiring SAVVY×5 check to resolve into single state

### EXPERIMENTAL ROCKET BOOSTERS
- **Normal Function**: Massive speed boost for d10 rounds, +2 SR while active
- **Standard Malfunction**: Roll d10: On a 0, boosters burn out and cannot be used again
- **Special Catastrophe I**: Uncontrolled acceleration - vehicle accelerates continuously for 1d10 rounds, requiring difficult maneuver checks each round
- **Special Catastrophe II**: Atmospheric ignition - surrounding atmosphere ignites, creating a trail of fire damaging anything in vehicle's wake
- **Special Catastrophe III**: Explosive decompression - boosters explode, causing 3 damage to structure and launching vehicle in random direction

### QUANTUM POSITIONING SYSTEM
- **Normal Function**: Predicts optimal routes, automatically succeed on one Alternate Route per chase
- **Standard Malfunction**: System requires 10 minutes to recalculate between uses
- **Special Catastrophe I**: Temporal displacement - vehicle and occupants experience time at different rates than surroundings for 1d10 rounds
- **Special Catastrophe II**: Probability wave collapse - vehicle appears at the mathematically least optimal location in its path
- **Special Catastrophe III**: Quantum uncertainty - vehicle's position becomes uncertain, phasing in and out of reality until a NERVE×5 check succeeds

### TEMPORAL DAMPENERS
- **Normal Function**: Once per chase, gain automatic special success on any maneuver
- **Standard Malfunction**: Ages driver/pilot 1d10 hours each use
- **Special Catastrophe I**: Time loop - vehicle repeats the same maneuver 1d10 times, unable to change course
- **Special Catastrophe II**: Temporal reversion - vehicle reverts to position it occupied 1d10 rounds ago, but damage remains
- **Special Catastrophe III**: Time bubble - vehicle and occupants frozen in time for 1d10 hours, appearing later in same location

### ROBOTIC CO-PILOT
- **Normal Function**: Provides +20% to one Vehicle Operation roll per chase
- **Standard Malfunction**: May crash when passing electronic interference
- **Special Catastrophe I**: AI rebellion - robotic system takes control of vehicle for 1d10 rounds with own agenda
- **Special Catastrophe II**: Logic loop - system crashes, locking controls for 1d10 rounds
- **Special Catastrophe III**: Personality emergence - co-pilot develops sentience with unpredictable personality

## SAMPLE ATOMIC AGE VEHICLES

### GROUND VEHICLES

**QUANTUM COUPE MK III** (Luxury Sports Car)
- Speed Rating: 4 (Ultra)
- Maneuverability: 4 (Precision)
- Durability: 3 (Standard)
- Terrain: Standard
- Special Systems: Atomic Power Core, Experimental Rocket Boosters
- Description: Sleek bubble-top sports car with prominent tailfins and atomic power indicators. Chrome trim glows faintly blue at night from radiation shielding.

**MARTIAN ROVER EXPEDITION VEHICLE** (All-Terrain Explorer)
- Speed Rating: 2 (Standard)
- Maneuverability: 2 (Standard)
- Durability: 5 (Reinforced)
- Terrain: Extreme
- Special Systems: Anti-Gravity Modules, Matter Reconfiguration
- Description: Six-wheeled exploration vehicle with expandable laboratory section. Transparent bubble canopy provides 360° viewing. Can transform into boat or limited flight configuration.

**QUANTUM CYCLONE HYPERBIKE** (Racing Motorcycle)
- Speed Rating: 5 (Experimental)
- Maneuverability: 5 (Supernatural)
- Durability: 2 (Fragile)
- Terrain: Standard
- Special Systems: Dimensional Phase Shifter
- Description: Single-track motorcycle with enclosed cockpit and prominent atomic cooling fins. Leaves faint blue afterimages when phase shifter is engaged.

**URBAN MINICAR** (Compact City Vehicle)
- Speed Rating: 2 (Standard)
- Maneuverability: 5 (Supernatural)
- Durability: 2 (Fragile)
- Terrain: Limited
- Special Systems: Reconfigurable Chassis
- Description: Tiny bubble car with revolutionary steering system allowing it to turn within its own length and navigate spaces barely wider than the vehicle itself. Perfect for city escapes and impossible shortcuts.

**ATOMIC FREIGHT HAULER** (Heavy Transport)
- Speed Rating: 1 (Slow)
- Maneuverability: 1 (Clumsy)
- Durability: 7 (Armored)
- Terrain: Standard
- Special Systems: Reinforced Ramming Plate
- Description: Massive nuclear-powered transport with glowing cooling fins and reinforced structure. Slow but virtually unstoppable once it builds momentum.

### AIR VEHICLES

**STRATOJUMPER PERSONAL AIRCRAFT** (VTOL Flyer)
- Speed Rating: 4 (Ultra)
- Maneuverability: 3 (Responsive)
- Durability: 3 (Standard)
- Terrain: Limited (air only)
- Special Systems: Quantum Positioning System
- Description: Vertical take-off craft with rotating atomic turbines and transparent bubble cockpit. Wings expand and contract automatically based on atmospheric conditions.

**CLOUDMASTER LUXURY AIRSHIP** (Aerial Cruiser)
- Speed Rating: 2 (Standard)
- Maneuverability: 1 (Clumsy)
- Durability: 6 (Reinforced)
- Terrain: Limited (air only)
- Special Systems: Anti-Gravity Modules
- Description: Massive art deco inspired airship with observation decks and luxurious accommodations. No visible means of propulsion—just a soft blue glow from its antigravity field.

**SKYDART INTERCEPTOR** (Military Aircraft)
- Speed Rating: 5 (Experimental)
- Maneuverability: 4 (Precision)
- Durability: 4 (Standard)
- Terrain: Limited (air/space)
- Special Systems: Experimental Rocket Boosters, Dimensional Phase Shifter
- Description: Needle-shaped atmospheric/exoatmospheric craft with minimal wings and prominent atomic exhaust. Cockpit filled with glowing instrumentation and holographic displays.

**ATOMOCHOPPER** (Aerial Utility Vehicle)
- Speed Rating: 3 (Fast)
- Maneuverability: 4 (Precision)
- Durability: 4 (Standard)
- Terrain: Limited (air only)
- Special Systems: Hover Capability
- Description: Atomic-powered helicopter with contra-rotating blades and impressive hover stability. Can maintain position with pinpoint accuracy even in storm conditions.

## EXAMPLE CHASE SEQUENCE

**Referee**: "The silver Mysterian saucer (SR 4, MR 3) rises from behind the Luna City dome, pursuing your Quantum Cyclone Hyperbike (SR 5, MR 5). You're at distance 8 as you tear across the lunar surface. Your partner Rico is riding in the sidecar with his atomic ray rifle. The chase begins!"

*Initiative rolls determine the player goes first*

**Referee**: "The open lunar terrain has no speed cap, so your superior SR gives you +1 distance automatically."

*Distance increases to 9*

**Player (Driver)**: "I'll take a Dangerous Maneuver through the mining complex ahead!"

**Referee**: *Rolls d10, gets 3* "You see a narrow gap between two massive ore processors. It's just wide enough for your bike if you time it right!"

**Player**: *Rolls 25 on Vehicle Operation (75% + 60% MR = 135%) - a special success* "I gun the engine and thread perfectly through the gap!"

**Referee**: "Your bike rockets through the narrow passage with supernatural precision! Base distance +4, plus +2 for special success. The Mysterian saucer is now at distance 15, almost out of sight!"

**Player (Rico)**: "While they're far behind, I'll take aim with my ray rifle."

**Referee**: "You get a solid bead on the saucer as it tries to follow. That's a +20% to your next attack roll."

**Referee (for Mysterian)**: "The saucer takes a Suicidal Maneuver to close the gap!"

*Rolls d10, gets 8*

"The Mysterian craft plunges directly through an experimental transport hub where prototype vehicles are being tested! Robotic test machines and experimental craft zoom in unpredictable patterns!"

*Rolls for the Mysterian with MR +20% - success*

"The saucer weaves between experimental vehicles with impressive precision. Base distance -7 from you, bringing it to distance 8!"

**Player (Rico)**: "They're in range! I'll target their propulsion system with my ray rifle. I want to slow them down!"

**Referee**: "Roll your Combat skill with the aim bonus."

*Rolls 25 on Combat (Firearms) (60% + 20% for aiming = 80%) - a special success*

**Referee**: "Your atomic ray strikes the underside of the saucer with perfect accuracy! The Mysterian pilot must choose: take 1 damage to their Propulsion system OR suffer a -2 penalty to all distance gains until they spend an action clearing the problem."

**Referee (for Mysterian)**: "The Mysterian chooses to take the system damage rather than slow down. Their SR is reduced to 3. Blue energy sparks across the saucer's underside as steam vents from a damaged thruster!"

**Referee**: "You're now approaching Luna City's outskirts. The terrain is becoming more urban with a speed cap of SR 2."

**Player (Driver)**: "Perfect! I'll use my Dimensional Phase Shifter to pass through the crashed solar harvester blocking the path ahead!"

**Referee**: "Your bike shimmers with blue energy as you pass ghostlike through the wreckage! What's your next move?"

**Player (Driver)**: "Now I'll take a Reckless Maneuver to extend my lead!"

**Referee**: *Rolls d10, gets 5* "You're approaching the atomic testing zone that powers Luna City. Warning sirens blare as radiation sensors detect your approach. Radiation fields shimmer visibly in the air!"

**Player**: *Rolls 94 on Vehicle Operation (75% + 60% MR = 135%) - still a failure with such a high roll* "My bike's radiation shielding fails as I navigate through!"

**Referee**: "Your controls flicker and your engine sputters! You lose 3 distance due to your failed Reckless Maneuver. The saucer closes to distance 5!"

*Rolls on Consequences Table, gets 73*

"Your bike suffers a major collision with a radiation sensor array! Your structure takes 2 damage, making it Damaged. Your cockpit integrity is compromised and the air begins to thin - you're at -20% to all actions until repairs can be made!"

**Referee**: "With the urban environment speed cap at SR 2, the Mysterian's damaged propulsion system (SR 3) is less of a disadvantage - both vehicles are effectively operating at SR 2 in these tight streets."

**Player (Rico)**: "I'll deploy a smoke canister to force them to swerve away!"

**Referee**: "Roll your Technology skill."

*Rolls 43 on Technology (65%) - success*

**Referee**: "A thick cloud of irradiated smoke billows out behind your bike. The Mysterian must choose: take 1 damage to a random system OR swerve away, increasing distance by 1."

**Referee (for Mysterian)**: "The Mysterian pilot chooses to swerve, pulling back to avoid the potentially dangerous smoke. Distance increases to 6."

**Player (Driver)**: "I'm going to risk using my Dimensional Phase Shifter again to escape through that collapsed tunnel ahead!"

**Referee**: "A risky move with an already damaged bike! Roll your Vehicle Operation."

**Player**: *Rolls 88 - critical failure with doubles*

**Referee**: "Your damaged bike's systems can't handle the strain! The Phase Shifter goes into catastrophic failure!"

*Rolls d10 on Catastrophic Results Table, gets 7 - Special Catastrophe I for Dimensional Phase Shifter*

"The Phase Shifter malfunctions spectacularly! Your bike becomes intangible but you and Rico don't - you're suddenly ejected through the handlebars at high speed while your bike continues forward as a ghostly outline! Roll REFLEX×5 to see if you can activate your emergency vacuum suits before you hit the lunar surface!"

*The chase takes an unexpected turn as the players must now deal with the consequences of technology gone haywire...*

## DESIGN NOTES

This system creates cinematic chases with:

1. **Streamlined Dice** - Using d10 for hazard selection and percentile dice only when both digits are meaningful
2. **Dual-Purpose Hazards** - Each hazard works for ground, air, or water with thematic adaptation
3. **Escalating Difficulty** - Risk levels increase consequences without requiring separate tables
4. **Variable Outcomes** - Success quality and mechanical certainty create dramatic turning points
5. **Atomic Age Flavor** - Vehicles and hazards reflect retro-futuristic technology and dangers

The system generates vivid chase sequences that capture the spirit of atomic age pulp adventures while offering meaningful tactical choices to players without excessive complexity.