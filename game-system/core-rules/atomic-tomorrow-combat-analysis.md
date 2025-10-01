---
layout: default
title: Atomic Tomorrow Combat Analysis
---

# Atomic Tomorrow Adventures: Combat System Analysis

## Core Combat Mechanics

### Attack System
- Roll percentile dice against attacker's skill
- Success quality determined by roll:
  - **Regular Success**: Roll under skill
  - **Special Success**: Roll ends in 0 or 5 and is under skill
  - **Critical Success**: doubles (11, 22, etc.) under skill

### Damage System
- Damage based on weapon type + success quality:
  - **Unarmed**: 1 damage
  - **Light Weapon**: 2 damage
  - **Medium Weapon**: 3 damage
  - **Heavy Weapon**: 4 damage
  - **Special Success**: +1 damage
  - **Critical Success**: +2 damage

### Defense Mechanics
- **Parry**: Roll percentile dice against defender's Combat (Unarmed or Melee) skill
  - Higher quality of success negates attack
  - Equal quality: higher raw roll wins
  - Subsequent parry attempts in same round take cumulative -20% penalty
- **Dodge**: Roll against base Combat skill: (REFLEX × 2) + 10%
  - Full value vs. ranged attacks, -20% vs. melee attacks
- **Block**: Roll against Parry skill +20% when using a shield
  - Can block melee once/turn, missiles unlimited
- **Armor**: Provides automatic damage reduction
  - Light Armor: 1 point reduction
  - Medium Armor: 2 point reduction 
  - Heavy Armor: 3 point reduction
  - Critical hits ignore armor
- **Armor Penalties**: Apply to Parry/Dodge skills
  - Light Armor: -10% penalty
  - Medium Armor: -20% penalty
  - Heavy Armor: -30% penalty
- **Soak**: Roll against Grit × 5
  - Regular Success: Reduce damage by 1
  - Special Success: Reduce damage by 2
  - Critical Success: Reduce damage by 3

### Incapacitation
- Characters can take 5 wounds before being incapacitated

## Combat Simulation Results

### Expected Damage Per Attack (75% Attacker vs 75% Defender/Grit 10)

| Weapon Type | No Armor | Light Armor | Medium Armor | Heavy Armor |
|-------------|----------|-------------|--------------|-------------|
| Unarmed (1) | 0.35 | 0.18 | 0.12 | 0.09 |
| Light (2) | 0.70 | 0.42 | 0.33 | 0.25 |
| Medium (3) | 1.05 | 0.65 | 0.54 | 0.42 |
| Heavy (4) | 1.40 | 0.87 | 0.76 | 0.59 |

### Median Rounds to Incapacitation (75% Attacker vs 75% Defender/Grit 10)

| Weapon Type | No Armor | Light Armor | Medium Armor | Heavy Armor |
|-------------|----------|-------------|--------------|-------------|
| Unarmed (1) | 15.0 | 29.0 | 41.0 | 61.0 |
| Light (2) | 7.0 | 12.0 | 16.0 | 21.0 |
| Medium (3) | 5.0 | 8.0 | 10.0 | 12.0 |
| Heavy (4) | 4.0 | 6.0 | 7.0 | 9.0 |

### Critical Hit Impact (Percentage of Attacks Resulting in 3+ Damage)

| Weapon Type | No Armor | Light Armor | Medium Armor | Heavy Armor |
|-------------|----------|-------------|--------------|-------------|
| Unarmed (1) | 1.5% | 1.2% | 1.0% | 0.9% |
| Light (2) | 6.3% | 5.2% | 4.8% | 4.3% |
| Medium (3) | 12.7% | 10.3% | 9.2% | 8.1% |
| Heavy (4) | 19.4% | 15.8% | 13.5% | 11.7% |

### Worst-Case Scenario (95% Attacker vs 50% Defender/Grit 10, Heavy Weapon)

| Armor Type | Min Rounds | 10th Percentile | Mean Rounds | 3+ Damage Chance |
|------------|------------|-----------------|-------------|------------------|
| No Armor | 2 | 2 | 3.5 | 28.3% |
| Light | 2 | 3 | 5.2 | 19.5% |
| Medium | 3 | 4 | 6.8 | 14.2% |
| Heavy | 3 | 5 | 9.3 | 9.8% |

## Key Balance Findings

1. **Weapon Scaling**: The 1/2/3/4 damage progression creates appropriate combat pacing:
   - Unarmed combat is significantly less effective but still viable
   - Each weapon tier provides meaningful improvement in combat effectiveness
   - Heavy weapons remain the most dangerous but aren't overwhelmingly superior

2. **Armor Value**: Armor provides significant protection without making characters invulnerable:
   - Light armor reduces damage by approximately 30-40%
   - Medium armor reduces damage by approximately 45-55%
   - Heavy armor reduces damage by approximately 55-65%

3. **Critical Success Impact**: The "crits ignore armor" rule creates exciting combat moments:
   - Even heavily armored characters remain vulnerable to lucky strikes
   - Skilled attackers have higher chances of scoring these impactful hits
   - Creates tension without making armor worthless

4. **Active vs. Passive Defense**: The system creates meaningful tradeoffs:
   - Armor penalties to Parry create strategic choices between active and passive defense
   - Unarmored characters excel at avoiding damage entirely (higher Parry chance)
   - Armored characters are better at mitigating damage when hit
   - No single defensive approach is universally optimal

5. **Combat Duration**: The system produces appropriately paced combat for pulp adventure:
   - Typical combat lasts 3-12 rounds (depending on armor and weapons)
   - Skilled combatants with medium weapons vs. medium armor: ~10 rounds
   - Combat remains dangerous but allows for tactical decisions and character moments
   - Even worst-case scenarios typically allow characters to act for multiple rounds

## Design Implications

1. **Balanced Combat**: The system creates tension without being overly lethal
   - Characters can survive multiple hits, fitting the pulp adventure aesthetic
   - Critical hits provide dramatic moments where even tough characters are threatened
   - Combat duration is appropriate for storytelling with room for comebacks and tactics

2. **Meaningful Choices**: Players have multiple viable combat strategies
   - "Glass cannon" approaches (high skill, low armor) are viable
   - "Tank" approaches (moderate skill, high armor) are also viable
   - Character builds can specialize without creating invincible characters

3. **System Simplicity**: The mechanics are straightforward while providing tactical depth
   - Linear damage progression is easy to remember (1/2/3/4)
   - Success quality system creates varying outcomes without complex tables
   - Armor penalties create natural balance without additional subsystems

4. **Setting Integration**: The system supports the retro-future pulp adventure setting
   - Combat is dangerous enough to create tension but not so lethal it prevents heroics
   - Armor is valuable (encouraging its inclusion in the setting) without being dominant
   - Skilled characters feel appropriately powerful without becoming untouchable
