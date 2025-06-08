---
layout: default
title: Atomic Tomorrow Combat
---

# ATOMIC TOMORROW ADVENTURES

## CORE COMBAT SYSTEM

### INITIATIVE AND TURN SEQUENCE

1. **Roll Initiative**: Roll percentile dice against INIT
2. **Turn Order**: Highest successful roll acts first, next highest, and so on
3. **Failed Rolls**: Act after all successful rolls, ordered highest to lowest
4. **Ties**: Resolved by higher REFLEX score

### ACTION ECONOMY

Each round, a character can:

- Take one significant action (attack, use device, etc.)
- Move within their zone or to an adjacent zone
- Perform one quick action (draw weapon, flip switch, etc.)

### POSITIONING

Combat uses abstract positioning with four ranges:

- **Engaged**: Hand-to-hand combat distance
- **Near**: Within same general area (pistol range)
- **Far**: Separate area but still within sight (rifle range)
- **Distant**: Requires significant movement to reach (difficult shot)

## ATTACK & DEFENSE

### ATTACK SEQUENCE

1. Attacker rolls against appropriate Combat skill (Unarmed, Melee, Ranged)
2. If attack fails, no effect occurs
3. If attack succeeds, defender may choose to defend or take the hit

### DEFENSE OPTION

There are two Defense skills, Parry (vs melee attacks) and Dodge (vs ranged attacks). Each successive Defense in a turn incurs a -20% penalty.

- **Parry**: requires a weapon or Unarmed Combat skill, only vs. melee or unarmed attacks.
- **Block**: Requires a shield, +20%. Can only block melee attacks once/turn, can block missiles as many times as needed
- **Dodge**: -20% vs. melee attacks.

### DEFENSE LIMITATIONS

- The first defensive action per turn is at full, each defensive action after is at a cumulative -20% penalty
- Two-Fisted epithet allows one additional Parry/Block per turn without penalty

### OPPOSED RESOLUTION

When defense is attempted:

1. Compare quality of success (Critical > Special > Ordinary)
2. If same quality, highest roll wins
3. Ties favor the defender

### SUCCESS AND FAILURE TYPES

- **Critical Success**: Doubles under your skill percentage
- **Special Success**: Roll ending in 0 or 5 under your skill percentage
- **Ordinary Success**: Any other roll under your skill percentage
- **Special Failure**: Roll ending in 0 or 5 over your skill percentage
- **Critical Failure**: Doubles over your skill percentage
- **Automatic Success**: Rolls of 01-05 regardless of skill
- **Automatic Failure**: Rolls of 96-00 regardless of skill

## DAMAGE & WOUNDS

### WEAPON DAMAGE

- Each weapon has a fixed Wound Rating (1-4)
- Attack quality can modify this rating
- No additional roll required to determine damage

### WOUND DETERMINATION

Based on weapon type and attack quality:

- Base Wounds: Weapon's Wound Rating
- Special Success attack (+1): Adds 1 additional wound
- Critical Success attack: Adds wounds equal to half the tens digit (round down)
  - Example: Rolling 22 adds 1 wound, rolling 55 adds 2 wounds, rolling 88 adds 4 wounds
- These bonuses stack (a critical special success adds both bonuses)

### DAMAGE SOAKING

- Defender rolls against GRIT × 5
- Critical Success: Reduce wounds by 3
- Special Success: Reduce wounds by 2
- Ordinary Success: Reduce wounds by 1
- Failure: No reduction

### WOUND EFFECTS

- Characters can sustain up to 5 wounds
- 0-3 Wounds: Fully functional in combat
- 4 Wounds: Incapacitated but conscious
- 5 Wounds: Dying

### INCAPACITATION

At 4 Wounds, a character is incapacitated but not out of the fight:

- Can attempt a GRIT × 1 roll to perform a single action
- Success allows one normal action despite wounds
- Critical success allows the action with no penalties
- Requires a new roll for each action attempted

### LAST STAND

A character at 5 Wounds is dying but may attempt one final heroic act:

- Roll NERVE check
- Success allows one final action before collapsing
- Critical success allows the action at no penalty and stabilizes at 4 Wounds
- Special success allows the action and character remains conscious for tens die more rounds

## PROTECTIVE EQUIPMENT

### COVER PROTECTION

Cover directly reduces the weapon's Wound Rating:

- Partial Cover: -1 Wound
- Good Cover: -2 Wounds
- Excellent Cover: -3 Wounds

### ARMOR PROTECTION

Armor directly reduces incoming wounds:

- Light Armor: -1 Wound
- Medium Armor: -2 Wounds
- Heavy Armor: -3 Wounds
- Critical S
- Some weapons may have armor-piercing properties that ignore some or all armor protection

---

## CHARACTER SHEET REFERENCE

For ease of play, the character sheet includes pre-calculated values:

### GRIT SOAK VALUES

GRIT × 5 = ____% Soak Value

### REFLEX INITIATIVE

```
REFLEX × 5 = ____% Initiative Value
```

### NERVE LAST STAND

```
NERVE × 5 = ____% Last Stand Value
```
