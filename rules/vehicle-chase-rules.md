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

## VEHICLE INTERFERENCE AND COMBAT

Passengers can attempt to interfere with other vehicles during a chase. These quick actions create narrative consequences without dominating the chase mechanics.

### INTERFERENCE ACTIONS

When vehicles are at Distance 7 or closer, passengers can attempt to influence the chase:

**TAKE AIM (Distance 4-7)**
- **Action**: Character spends a round aiming
- **Roll**: No roll required
- **Effect**: +20% to next attack roll

**SUPPRESSIVE FIRE (Distance 4-7)**
- **Action**: Lay down covering fire to force evasive maneuvers
- **Roll**: Combat (Firearms) - Success forces target vehicle to make choice:
- **Effect**: Target must either lose 1 distance (pull back) OR target driver suffers -20% on next driving roll

**PRECISION SHOT (Distance 1-7)**
- **Action**: Target specific vehicle system
- **Roll**: Combat (Firearms) at -20%
- **Effect on Success**: 1 damage to specified system (Propulsion, Steering, or Structure)
- **Effect on Special Success**: Target driver must make a Vehicle Operation check or lose control

**DEPLOY COUNTERMEASURE (Any Distance)**
- **Action**: Drop objects, oil, smoke, or other hazards
- **Roll**: Technology or REFLEX×5
- **Effect on Success**: Following vehicles must make Vehicle Operation check at -20% or gain +2 distance
- **Effect on Failure**: Countermeasure deploys incorrectly, no effect

**BOARDING ATTEMPT (Distance 1-2 only)**
- **Action**: Jump between vehicles
- **Roll**: Athletics at -40% plus Vehicle Speed Rating penalties
- **Effect on Success**: Character transfers to target vehicle
- **Effect on Failure**: Character falls, requiring immediate REFLEX×5 to avoid injury

### COMBAT CONSEQUENCES

Combat interference creates narrative consequences rather than simply adding or subtracting percentages:

**PROPULSION HIT**
- Driver must choose: Lose 1 SR (permanent until repaired) OR gain +2 distance (immediate but one-time)
- Critical Hit: Both effects occur

**STEERING HIT**
- Driver must choose: Accept -20% to Vehicle Operation (permanent until repaired) OR make immediate Hazardous Maneuver without distance gain
- Critical Hit: Both effects occur

**STRUCTURE HIT**
- Driver must choose: Accept passenger penalties (permanent until repaired) OR lose 1 distance from slowing to assess damage
- Critical Hit: Vehicle develops leak/breach requiring eventual attention

**DRIVER HIT**
- Driver must make GRIT×5 check or lose control, requiring immediate Vehicle Operation roll at -20%
- Critical Hit: Driver incapacitated - another character must take over driving

### WEAPON DAMAGE VALUES

- **Small Arms**: 1 damage to structure, rarely affects systems
- **Heavy Weapons**: 1 damage to any system
- **Specialized Weapons**: 1 damage with special effects (EMP affects controls, acids damage structure, etc.)
- **Vehicle-Mounted Weapons**: 2 damage to targeted system

## VEHICLE DAMAGE SYSTEM

When a vehicle takes damage to a system:

**PROPULSION SYSTEM**
- **Stressed (1)**: -20% to acceleration maneuvers
- **Damaged (2)**: Maximum speed reduced by one SR level
- **Critical (3)**: Maximum speed reduced by two SR levels
- **Disabled (4)**: Vehicle immobilized

**STEERING SYSTEM**
- **Stressed (1)**: -20% to handling-related maneuvers
- **Damaged (2)**: -40% to handling-related maneuvers
- **Critical (3)**: Vehicle can only make wide, gradual turns
- **Disabled (4)**: Vehicle cannot turn

**STRUCTURE**
- **Stressed (1)**: Cosmetic damage only
- **Damaged (2)**: Vehicle leaking, passengers at -20% to actions
- **Critical (3)**: Vehicle severely compromised, passengers at -40%
- **Disabled (4)**: Vehicle breaking apart, immediate evacuation required

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

**QUANTUM COUPE MK III**
- Speed Rating: 4 (Ultra)
- Handling: +40% (Precision)
- Durability: 3 (Standard)
- Terrain: Standard
- Special Systems: Atomic Power Core, Experimental Rocket Boosters
- Description: Sleek bubble-top sports car with prominent tailfins and atomic power indicators. Chrome trim glows faintly blue at night from radiation shielding.

**MARTIAN ROVER EXPEDITION VEHICLE**
- Speed Rating: 2 (Standard)
- Handling: 0% (Standard)
- Durability: 5 (Reinforced)
- Terrain: Extreme
- Special Systems: Anti-Gravity Modules, Matter Reconfiguration
- Description: Six-wheeled exploration vehicle with expandable laboratory section. Transparent bubble canopy provides 360° viewing. Can transform into boat or limited flight configuration.

**QUANTUM CYCLONE HYPERBIKE**
- Speed Rating: 5 (Experimental)
- Handling: +40% (Precision)
- Durability: 2 (Fragile)
- Terrain: Standard
- Special Systems: Dimensional Phase Shifter
- Description: Single-track motorcycle with enclosed cockpit and prominent atomic cooling fins. Leaves faint blue afterimages when phase shifter is engaged.

### AIR VEHICLES

**STRATOJUMPER PERSONAL AIRCRAFT**
- Speed Rating: 4 (Ultra)
- Handling: +20% (Responsive)
- Durability: 3 (Standard)
- Terrain: Limited (air only)
- Special Systems: Quantum Positioning System
- Description: Vertical take-off craft with rotating atomic turbines and transparent bubble cockpit. Wings expand and contract automatically based on atmospheric conditions.

**CLOUDMASTER LUXURY AIRSHIP**
- Speed Rating: 2 (Standard)
- Handling: -20% (Clumsy)
- Durability: 6 (Reinforced)
- Terrain: Limited (air only)
- Special Systems: Anti-Gravity Modules
- Description: Massive art deco inspired airship with observation decks and luxurious accommodations. No visible means of propulsion—just a soft blue glow from its antigravity field.

**SKYDART INTERCEPTOR**
- Speed Rating: 5 (Experimental)
- Handling: +40% (Precision)
- Durability: 4 (Standard)
- Terrain: Limited (air/space)
- Special Systems: Experimental Rocket Boosters, Dimensional Phase Shifter
- Description: Needle-shaped atmospheric/exoatmospheric craft with minimal wings and prominent atomic exhaust. Cockpit filled with glowing instrumentation and holographic displays.

## EXAMPLE CHASE SEQUENCE

**Referee**: "The silver Mysterian saucer rises from behind the Luna City dome, pursuing your Quantum Cyclone Hyperbike. You're at distance 8 as you tear across the lunar surface. Your partner Rico is riding in the sidecar with his atomic ray rifle. The chase begins!"

*Initiative rolls determine the player goes first*

**Player (Driver)**: "I'll take a Dangerous Maneuver through the mining complex ahead!"

**Referee**: *Rolls d10, gets 3* "You see a narrow gap between two massive ore processors. It's just wide enough for your bike if you time it right!"

**Player**: *Rolls 25 on Vehicle Operation (75%) - a special success* "I gun the engine and thread perfectly through the gap!"

**Referee**: "Your bike rockets through the narrow passage with incredible precision! Base distance +4, plus +2 for special success. The Mysterian saucer is now at distance 14, almost out of sight!"

**Player (Rico)**: "While they're far behind, I'll take aim with my ray rifle."

**Referee**: "You get a solid bead on the saucer as it tries to follow. That's a +20% to your next attack roll."

**Referee (for Mysterian)**: "The saucer takes a Suicidal Maneuver to close the gap!"

*Rolls d10, gets 8*

"The Mysterian craft plunges directly through an experimental transport hub where prototype vehicles are being tested! Robotic test machines and experimental craft zoom in unpredictable patterns!"

*Rolls for the Mysterian - success*

"The saucer weaves between experimental vehicles with impossible precision. Base distance -7 from you, bringing it to distance 7!"

**Player (Rico)**: "They're in range! I'll take a Precision Shot at their propulsion system!"

*Rolls 35 on Combat (Firearms) (60% + 20% for aiming - 20% for precision shot = 60%) - success*

**Referee**: "Your atomic ray strikes the underside of the saucer! Its eerie blue glow flickers momentarily. The Mysterian pilot must choose: lose 1 Speed Rating permanently until repairs or immediately gain +2 distance."

**Referee (for Mysterian)**: "The Mysterian chooses to gain distance, pushing their damaged systems. The saucer lurches forward, gaining +2 distance to 9, but you can see blue energy leaking from its underside."

**Player (Driver)**: "I'll use my Dimensional Phase Shifter to pass through the crashed solar harvester blocking the path ahead!"

**Referee**: "Your bike shimmers with blue energy as you pass ghostlike through the wreckage! What's your next move?"

**Player (Driver)**: "Now I'll take a Reckless Maneuver to extend my lead!"

**Referee**: *Rolls d10, gets 5* "You're approaching the atomic testing zone that powers Luna City. Warning sirens blare as radiation sensors detect your approach. Radiation fields shimmer visibly in the air!"

**Player**: *Rolls 94 on Vehicle Operation (75% - 40% = 35%) - failure* "My bike's radiation shielding fails as I navigate through!"

**Referee**: "Your controls flicker and your engine sputters! You lose 3 distance due to your failed Reckless Maneuver. The saucer closes to distance 6!"

*Rolls on Consequences Table, gets 73*

"Your bike suffers a major collision with a radiation sensor array! Your structure takes 2 damage, making it Damaged. Your cockpit integrity is compromised and the air begins to thin - you're at -20% to all actions until repairs can be made!"

**Player (Rico)**: "I'll deploy a countermeasure! I'm triggering the smoke canister to cover our retreat!"

*Rolls 43 on Technology (65%) - success*

**Referee**: "A thick cloud of irradiated smoke billows out behind your bike, obscuring everything in a glowing blue haze. The Mysterian ship must make a Vehicle Operation check at -20% or lose ground."

*Rolls for Mysterian - failure*

"The Mysterian craft lurches wildly as it hits the smoke cloud, losing visibility. It gains +2 distance, putting it at distance 8 again!"

**Player (Driver)**: "I'm going to risk using my Dimensional Phase Shifter again to escape through that collapsed tunnel ahead!"

**Referee**: "A risky move with an already damaged bike! Roll your Vehicle Operation."

**Player**: *Rolls 88 - critical failure with doubles*

**Referee**: "Your damaged bike's systems can't handle the strain! The Phase Shifter goes into catastrophic failure!"

*Rolls d10 on Catastrophic Results Table, gets 7 - Special Catastrophe I for Dimensional Phase Shifter*

"The Phase Shifter malfunctions spectacularly! Your bike becomes intangible but you and Rico don't - you're suddenly ejected through the handlebars at high speed while your bike continues forward as a ghostly outline! Roll REFLEX×5 to see if you can activate your emergency vacuum suit before you hit the lunar surface!"

*The chase takes an unexpected turn as the players must now deal with the consequences of technology gone haywire...*

## DESIGN NOTES

This system creates cinematic chases with:

1. **Streamlined Dice** - Using d10 for hazard selection and percentile dice only when both digits are meaningful
2. **Dual-Purpose Hazards** - Each hazard works for ground, air, or water with thematic adaptation
3. **Escalating Difficulty** - Risk levels increase consequences without requiring separate tables
4. **Variable Outcomes** - Success quality and mechanical certainty create dramatic turning points
5. **Atomic Age Flavor** - Vehicles and hazards reflect retro-futuristic technology and dangers

The system generates vivid chase sequences that capture the spirit of atomic age pulp adventures while offering meaningful tactical choices to players without excessive complexity.