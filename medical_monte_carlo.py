#!/usr/bin/env python3
"""
Monte Carlo Analysis of Atomic Tomorrow Medical Card System

Analyzes different healing strategies across skill levels to find:
1. Expected rounds until patient can contribute (wounds + strain < 3)
2. Expected rounds until completely healed (0 wounds, strain < 3)
3. Dominant strategies and meaningful trade-offs
"""

import random
import statistics
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from enum import Enum
import json

class Suit(Enum):
    HEARTS = "♥"    # Bleeding & Circulation
    CLUBS = "♣"     # Trauma & Impact  
    SPADES = "♠"    # Toxins & Disease
    DIAMONDS = "♦"  # Burns & Energy

@dataclass
class Card:
    suit: Suit
    value: int
    
    def __str__(self):
        return f"{self.value}{self.suit.value}"

class SuccessLevel(Enum):
    FAILURE = 0
    ORDINARY = 1
    SPECIAL = 2
    CRITICAL = 3

@dataclass
class Patient:
    wounds: int
    strain: int
    primary_suit: Suit
    cards_to_clear: List[Card]
    
    def can_contribute(self) -> bool:
        """Patient can contribute if wounds + strain < 3"""
        return (self.wounds + self.strain) < 3
    
    def is_healed(self) -> bool:
        """Patient is healed if 0 wounds and strain < 3"""
        return self.wounds == 0 and self.strain < 3

class Strategy(Enum):
    CONSERVATIVE = "conservative"      # Always use extra points on current card
    FORESIGHT = "foresight"           # Peek ahead when possible
    PREVENTION = "prevention"         # Discard bad cards when possible
    MIXED = "mixed"                   # Balance of foresight and prevention
    RESOURCE_HEAVY = "resource_heavy" # Use MSU liberally

@dataclass
class SkillLevel:
    name: str
    percentage: int
    
    def roll_success(self) -> SuccessLevel:
        """Roll d100 and determine success level"""
        roll = random.randint(1, 100)
        
        if roll > self.percentage:
            return SuccessLevel.FAILURE
        
        # Critical success: doubles (11,22,33...99) under skill percentage
        if roll in [11, 22, 33, 44, 55, 66, 77, 88, 99] and roll <= self.percentage:
            return SuccessLevel.CRITICAL
        
        # Special success: ends in 0 or 5 and under skill
        if (roll % 10 == 0 or roll % 10 == 5) and roll <= self.percentage:
            return SuccessLevel.SPECIAL
        
        return SuccessLevel.ORDINARY
    
    def get_treatment_points(self, success: SuccessLevel) -> int:
        """Convert success level to treatment points"""
        return {
            SuccessLevel.FAILURE: 0,
            SuccessLevel.ORDINARY: 1,
            SuccessLevel.SPECIAL: 2,
            SuccessLevel.CRITICAL: 3
        }[success]

class MedicalSimulator:
    def __init__(self):
        self.skill_levels = [
            SkillLevel("Untrained", 25),
            SkillLevel("Novice", 45),
            SkillLevel("Competent", 60),
            SkillLevel("Expert", 80),
            SkillLevel("Master", 95)
        ]
        
    def create_deck(self) -> List[Card]:
        """Create a standard deck minus jokers"""
        deck = []
        for suit in Suit:
            # Values 2-10, J=11, Q=12, K=13, A=14
            for value in range(2, 15):
                deck.append(Card(suit, value))
        return deck
    
    def generate_injury(self, wounds: int, primary_suit: Suit) -> Patient:
        """Generate a patient with random injury cards"""
        deck = self.create_deck()
        random.shuffle(deck)
        
        # Draw cards equal to wounds, ensuring primary suit representation
        cards = []
        primary_count = 0
        
        for i in range(wounds):
            if primary_count < wounds // 2 + 1:  # Ensure primary suit dominance
                # Draw from primary suit preferentially
                primary_cards = [c for c in deck if c.suit == primary_suit]
                if primary_cards:
                    card = random.choice(primary_cards)
                    deck.remove(card)
                    primary_count += 1
                else:
                    card = deck.pop()
            else:
                card = deck.pop()
            cards.append(card)
        
        return Patient(wounds, 0, primary_suit, cards)
    
    def handle_secondary_card(self, drawn_card: Card, current_card: Card, 
                            patient: Patient) -> Tuple[int, int]:
        """
        Handle secondary suit card effects
        Returns: (treatment_points_gained, strain_change)
        """
        treatment_points = 0
        strain_change = 0
        
        if drawn_card.value > current_card.value:
            # Higher value = positive response
            if drawn_card.suit == Suit.HEARTS:
                strain_change = -1  # Recover 1 strain
            elif drawn_card.suit == Suit.CLUBS:
                treatment_points = 1  # Gain +1 treatment point
            # Other suits have beneficial effects we'll abstract
            
        elif drawn_card.value == current_card.value:
            # Exact match = perfect response
            strain_change = -1
            treatment_points = 2
            
        else:
            # Lower value = complications
            if drawn_card.suit == Suit.HEARTS:
                # Patient instability - simplified as strain gain
                strain_change = 1
            elif drawn_card.suit == Suit.CLUBS:
                # Physical setback - simplified as strain gain
                strain_change = 1
            # Other complications abstracted
        
        return treatment_points, strain_change
    
    def simulate_treatment(self, patient: Patient, skill: SkillLevel, 
                          strategy: Strategy, max_rounds: int = 50, max_msu: int = 20) -> Dict:
        """Simulate treatment of a patient"""
        rounds = 0
        can_contribute_round = None
        healed_round = None
        msu_used = 0
        cards_cleared = 0
        
        # Create treatment deck
        deck = self.create_deck()
        random.shuffle(deck)
        
        current_patient = Patient(patient.wounds, patient.strain, 
                                patient.primary_suit, patient.cards_to_clear.copy())
        
        while rounds < max_rounds and current_patient.wounds > 0:
            rounds += 1
            
            if not current_patient.cards_to_clear:
                break
                
            current_card = current_patient.cards_to_clear[0]
            treatment_points_needed = current_card.value
            treatment_points_accumulated = 0
            
            # Clear current card
            attempts = 0
            max_attempts = 20  # Prevent infinite loops
            while treatment_points_accumulated < treatment_points_needed and attempts < max_attempts:
                attempts += 1
                success = skill.roll_success()
                base_points = skill.get_treatment_points(success)
                
                if base_points == 0:
                    # Failed roll, but can spend MSU as backup
                    if strategy in [Strategy.RESOURCE_HEAVY, Strategy.CONSERVATIVE]:
                        points_needed = min(3, treatment_points_needed - treatment_points_accumulated)
                        if msu_used + points_needed <= max_msu:
                            msu_used += points_needed
                            treatment_points_accumulated += points_needed
                        else:
                            # Out of resources, treatment stalls
                            break
                    else:
                        # Continue without MSU backup - treatment can fail
                        continue
                
                extra_points = max(0, base_points - (treatment_points_needed - treatment_points_accumulated))
                treatment_points_accumulated += base_points
                
                # Handle extra points based on strategy
                if extra_points > 0:
                    if strategy == Strategy.FORESIGHT:
                        # Peek ahead (simulate by drawing and replacing)
                        pass  # Abstracted for simplicity
                    elif strategy == Strategy.PREVENTION:
                        # Try to discard bad upcoming cards
                        pass  # Abstracted for simplicity
                    elif strategy == Strategy.RESOURCE_HEAVY:
                        # Convert to MSU usage for future
                        if msu_used < max_msu:
                            msu_used += 1
            
            # Check if card was successfully cleared
            if treatment_points_accumulated < treatment_points_needed:
                # Treatment failed - patient deteriorates or treatment stalls
                break
            
            # Card cleared - convert wound to strain
            current_patient.wounds -= 1
            current_patient.strain += 1
            current_patient.cards_to_clear.pop(0)
            cards_cleared += 1
            
            # Draw secondary cards for complications/benefits
            if deck:
                secondary_card = deck.pop()
                if secondary_card.suit != current_patient.primary_suit:
                    bonus_points, strain_delta = self.handle_secondary_card(
                        secondary_card, current_card, current_patient)
                    current_patient.strain = max(0, current_patient.strain + strain_delta)
            
            # Check milestones
            if can_contribute_round is None and current_patient.can_contribute():
                can_contribute_round = rounds
                
            if healed_round is None and current_patient.is_healed():
                healed_round = rounds
        
        return {
            'rounds': rounds,
            'can_contribute_round': can_contribute_round,
            'healed_round': healed_round,
            'msu_used': msu_used,
            'cards_cleared': cards_cleared,
            'final_wounds': current_patient.wounds,
            'final_strain': current_patient.strain,
            'success': current_patient.wounds == 0
        }
    
    def run_monte_carlo(self, iterations: int = 1000) -> Dict:
        """Run Monte Carlo analysis across all skill levels and strategies"""
        results = {}
        
        injury_scenarios = [
            (2, Suit.CLUBS),    # Light trauma
            (3, Suit.HEARTS),   # Moderate bleeding
            (4, Suit.DIAMONDS), # Severe burns
            (5, Suit.SPADES),   # Critical poisoning
        ]
        
        for skill in self.skill_levels:
            results[skill.name] = {}
            
            for strategy in Strategy:
                results[skill.name][strategy.value] = {}
                
                for wounds, primary_suit in injury_scenarios:
                    scenario_name = f"{wounds}_{primary_suit.name.lower()}"
                    scenario_results = []
                    
                    for _ in range(iterations):
                        patient = self.generate_injury(wounds, primary_suit)
                        result = self.simulate_treatment(patient, skill, strategy)
                        scenario_results.append(result)
                    
                    # Calculate statistics
                    contribute_rounds = [r['can_contribute_round'] for r in scenario_results 
                                       if r['can_contribute_round'] is not None]
                    healed_rounds = [r['healed_round'] for r in scenario_results 
                                   if r['healed_round'] is not None]
                    
                    results[skill.name][strategy.value][scenario_name] = {
                        'mean_contribute_rounds': statistics.mean(contribute_rounds) if contribute_rounds else None,
                        'mean_healed_rounds': statistics.mean(healed_rounds) if healed_rounds else None,
                        'success_rate': sum(1 for r in scenario_results if r['success']) / len(scenario_results),
                        'mean_msu_used': statistics.mean([r['msu_used'] for r in scenario_results]),
                        'contribute_rate': len(contribute_rounds) / len(scenario_results)
                    }
        
        return results
    
    def analyze_dominant_strategies(self, results: Dict) -> Dict:
        """Analyze results to find dominant strategies"""
        analysis = {}
        
        for skill_name, skill_results in results.items():
            analysis[skill_name] = {
                'best_for_contribution': {},
                'best_for_healing': {},
                'most_efficient': {},
                'strategy_differences': {}
            }
            
            # Compare strategies for each scenario
            for scenario in ['2_clubs', '3_hearts', '4_diamonds', '5_spades']:
                contribute_times = {}
                healing_times = {}
                efficiency_scores = {}
                
                for strategy, strategy_results in skill_results.items():
                    if scenario in strategy_results:
                        data = strategy_results[scenario]
                        contribute_times[strategy] = data['mean_contribute_rounds']
                        healing_times[strategy] = data['mean_healed_rounds']
                        
                        # Efficiency = success rate / MSU used
                        if data['mean_msu_used'] > 0:
                            efficiency_scores[strategy] = data['success_rate'] / data['mean_msu_used']
                        else:
                            efficiency_scores[strategy] = data['success_rate']
                
                # Find best strategies
                if contribute_times:
                    valid_contribute = {k: v for k, v in contribute_times.items() if v is not None}
                    if valid_contribute:
                        best_contribute = min(valid_contribute, key=valid_contribute.get)
                        analysis[skill_name]['best_for_contribution'][scenario] = best_contribute
                
                if healing_times:
                    valid_healing = {k: v for k, v in healing_times.items() if v is not None}
                    if valid_healing:
                        best_healing = min(valid_healing, key=valid_healing.get)
                        analysis[skill_name]['best_for_healing'][scenario] = best_healing
                
                if efficiency_scores:
                    best_efficiency = max(efficiency_scores, key=efficiency_scores.get)
                    analysis[skill_name]['most_efficient'][scenario] = best_efficiency
                
                # Calculate strategy differences
                if len(valid_contribute) > 1:
                    contribute_values = list(valid_contribute.values())
                    analysis[skill_name]['strategy_differences'][scenario] = {
                        'contribute_range': max(contribute_values) - min(contribute_values),
                        'contribute_coefficient_of_variation': statistics.stdev(contribute_values) / statistics.mean(contribute_values)
                    }
        
        return analysis

def main():
    """Run the Monte Carlo analysis"""
    print("Running Monte Carlo Analysis of Atomic Tomorrow Medical System...")
    print("=" * 60)
    
    simulator = MedicalSimulator()
    
    print("Running simulations... (this may take a few minutes)")
    results = simulator.run_monte_carlo(iterations=500)  # Reduced for faster execution
    
    print("\nAnalyzing dominant strategies...")
    analysis = simulator.analyze_dominant_strategies(results)
    
    # Print summary results
    print("\n" + "=" * 60)
    print("RESULTS SUMMARY")
    print("=" * 60)
    
    for skill_name in simulator.skill_levels:
        print(f"\n{skill_name.name.upper()} ({skill_name.percentage}% skill)")
        print("-" * 40)
        
        skill_analysis = analysis[skill_name.name]
        
        print("Best strategies by scenario:")
        for scenario in ['2_clubs', '3_hearts', '4_diamonds', '5_spades']:
            scenario_display = scenario.replace('_', ' ').title()
            
            contribute_strategy = skill_analysis['best_for_contribution'].get(scenario, 'N/A')
            healing_strategy = skill_analysis['best_for_healing'].get(scenario, 'N/A')
            efficient_strategy = skill_analysis['most_efficient'].get(scenario, 'N/A')
            
            print(f"  {scenario_display}:")
            print(f"    Fastest to contribute: {contribute_strategy}")
            print(f"    Fastest to heal: {healing_strategy}")
            print(f"    Most efficient: {efficient_strategy}")
            
            # Show strategy differences
            if scenario in skill_analysis['strategy_differences']:
                diff_data = skill_analysis['strategy_differences'][scenario]
                cv = diff_data['contribute_coefficient_of_variation']
                if cv < 0.1:
                    print(f"    Strategy choice impact: LOW (CV: {cv:.3f})")
                elif cv < 0.2:
                    print(f"    Strategy choice impact: MODERATE (CV: {cv:.3f})")
                else:
                    print(f"    Strategy choice impact: HIGH (CV: {cv:.3f})")
    
    # Save detailed results
    with open('medical_analysis_results.json', 'w') as f:
        json.dump({
            'raw_results': results,
            'analysis': analysis
        }, f, indent=2)
    
    print(f"\nDetailed results saved to 'medical_analysis_results.json'")
    
    # Key insights
    print("\n" + "=" * 60)
    print("KEY INSIGHTS")
    print("=" * 60)
    
    print("\n1. SKILL LEVEL IMPACT:")
    for skill in simulator.skill_levels:
        skill_data = results[skill.name]
        avg_success_rates = []
        for strategy_data in skill_data.values():
            for scenario_data in strategy_data.values():
                avg_success_rates.append(scenario_data['success_rate'])
        
        if avg_success_rates:
            avg_success = statistics.mean(avg_success_rates)
            print(f"   {skill.name}: {avg_success:.1%} average success rate")
    
    print("\n2. DOMINANT STRATEGIES:")
    strategy_wins = {}
    for skill_analysis in analysis.values():
        for category in ['best_for_contribution', 'best_for_healing', 'most_efficient']:
            for strategy in skill_analysis[category].values():
                if strategy != 'N/A':
                    strategy_wins[strategy] = strategy_wins.get(strategy, 0) + 1
    
    if strategy_wins:
        sorted_strategies = sorted(strategy_wins.items(), key=lambda x: x[1], reverse=True)
        print(f"   Most frequently optimal: {sorted_strategies[0][0]} ({sorted_strategies[0][1]} scenarios)")
        
        if len(sorted_strategies) > 1 and sorted_strategies[0][1] - sorted_strategies[1][1] <= 2:
            print("   -> No clearly dominant strategy across all scenarios")
        else:
            print("   -> Clear strategic advantage exists")
    
    print("\n3. MEANINGFUL TRADE-OFFS:")
    high_variance_skills = []
    for skill_name, skill_analysis in analysis.items():
        high_variance_scenarios = 0
        for scenario, diff_data in skill_analysis['strategy_differences'].items():
            if diff_data['contribute_coefficient_of_variation'] > 0.15:
                high_variance_scenarios += 1
        
        if high_variance_scenarios >= 2:
            high_variance_skills.append(skill_name)
    
    if high_variance_skills:
        print(f"   Strategy choice matters most for: {', '.join(high_variance_skills)}")
        print("   -> Players will need to consider trade-offs")
    else:
        print("   -> Strategy differences are relatively minor")
        print("   -> Risk of dominant strategy emergence")

if __name__ == "__main__":
    main()