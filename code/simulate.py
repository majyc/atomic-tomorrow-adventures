import random
from collections import defaultdict

def success_quality(roll, skill):
    """Determine the quality of a successful roll"""
    if roll > skill:
        return 0  # Failure
    
    tens = roll // 10
    ones = roll % 10
    
    if tens == ones:  # Double digits (11, 22, 33, etc.)
        return 3  # Critical
    elif roll % 5 == 0:  # Ends in 0 or 5
        return 2  # Special
    else:  # Regular success
        return 1  # Regular

def simulate_combat_with_parry(attacker_skill, defender_parry_skill, defender_grit, weapon_damage=1, trials=100000):
    """Simulate combat with attack, parry, and soak mechanics"""
    total_damage = 0
    successful_attacks = 0
    successful_parries = 0
    successful_soaks = 0
    damage_counts = defaultdict(int)
    
    for _ in range(trials):
        # Attack roll
        attack_roll = random.randint(1, 100)
        attack_quality = success_quality(attack_roll, attacker_skill)
        
        damage = 0
        
        # If attack hits, try to parry
        if attack_quality > 0:
            successful_attacks += 1
            parry_roll = random.randint(1, 100)
            parry_quality = success_quality(parry_roll, defender_parry_skill)
            
            # Determine if parry succeeds
            parry_succeeds = False
            if parry_quality > attack_quality:
                parry_succeeds = True
            elif parry_quality == attack_quality and parry_quality > 0:
                # Same quality, higher raw roll wins
                if parry_roll > attack_roll:
                    parry_succeeds = True
            
            if parry_succeeds:
                successful_parries += 1
                damage = 0  # Parry negates attack
            else:
                # Calculate base damage plus quality bonus
                damage = weapon_damage
                if attack_quality == 2:  # Special
                    damage += 1
                elif attack_quality == 3:  # Critical
                    damage += 2
                
                # Try to soak damage
                soak_target = defender_grit * 5
                soak_roll = random.randint(1, 100)
                soak_quality = success_quality(soak_roll, soak_target)
                
                if soak_quality > 0:
                    successful_soaks += 1
                    soak_amount = soak_quality  # 1 for regular, 2 for special, 3 for critical
                    damage = max(0, damage - soak_amount)
        
        # Record damage
        damage_counts[damage] += 1
        total_damage += damage
    
    return {
        "expected_damage": total_damage / trials,
        "attack_success_rate": successful_attacks / trials,
        "parry_success_rate": successful_parries / successful_attacks if successful_attacks > 0 else 0,
        "soak_success_rate": successful_soaks / (successful_attacks - successful_parries) if (successful_attacks - successful_parries) > 0 else 0,
        "damage_distribution": {k: v/trials for k, v in sorted(damage_counts.items())}
    }

# Test various combinations
def run_simulation():
    weapon_types = {
        "Light": 1,
        "Medium": 2,
        "Heavy": 3
    }
    
    print("WEAPON TYPE COMPARISON (50% ATTACKER vs 50% DEFENDER, GRIT 10)", flush=True)
    print("=" * 60)
    for weapon_name, weapon_damage in weapon_types.items():
        result = simulate_combat_with_parry(50, 50, 10, weapon_damage=weapon_damage)
        print(f"\n{weapon_name} Weapon (Base Damage {weapon_damage}):")
        print(f"  Expected damage: {result['expected_damage']:.3f}")
        print(f"  Attack success: {result['attack_success_rate']*100:.1f}%")
        print(f"  Parry success: {result['parry_success_rate']*100:.1f}%")
        print(f"  Soak success: {result['soak_success_rate']*100:.1f}%")
        print(f"  Damage distribution: {result['damage_distribution']}")
    
    print("\nSKILL DIFFERENTIAL ANALYSIS (LIGHT WEAPON)")
    print("=" * 60)
    skill_pairs = [
        (50, 50), (75, 50), (50, 75), (75, 75), (95, 75)
    ]
    for atk_skill, def_skill in skill_pairs:
        result = simulate_combat_with_parry(atk_skill, def_skill, 10, weapon_damage=1)
        print(f"\nAttacker {atk_skill}% vs Defender {def_skill}% (Grit 10):")
        print(f"  Expected damage: {result['expected_damage']:.3f}")
        print(f"  Attack success: {result['attack_success_rate']*100:.1f}%")
        print(f"  Parry success: {result['parry_success_rate']*100:.1f}%")
        print(f"  Soak success: {result['soak_success_rate']*100:.1f}%")
    
    print("\nGRIT IMPACT ANALYSIS (75% ATTACKER vs 50% DEFENDER)")
    print("=" * 60)
    for grit in [10, 14, 18]:
        result = simulate_combat_with_parry(75, 50, grit, weapon_damage=1)
        print(f"\nGrit {grit} (Soak {grit*5}%):")
        print(f"  Expected damage: {result['expected_damage']:.3f}")
        print(f"  Attack success: {result['attack_success_rate']*100:.1f}%")
        print(f"  Parry success: {result['parry_success_rate']*100:.1f}%")
        print(f"  Soak success: {result['soak_success_rate']*100:.1f}%")

    # Generate a comprehensive table for weapon damage 2 (Medium)
    print("\nCOMPREHENSIVE TABLE FOR MEDIUM WEAPONS (DAMAGE 2)")
    print("=" * 60)
    print("{:<10} {:<10} {:<10} {:<10} {:<10}".format("Atk\\Def", "Def 25%", "Def 50%", "Def 75%", "Def 95%"))
    skills = [25, 50, 75, 95]
    
    for atk_skill in skills:
        line = f"{atk_skill}%"
        for def_skill in skills:
            result = simulate_combat_with_parry(atk_skill, def_skill, 10, weapon_damage=2)
            line += f"     {result['expected_damage']:.2f}"
        print(line)

if __name__ == "__main__":
    run_simulation()