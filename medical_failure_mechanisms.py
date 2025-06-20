#!/usr/bin/env python3
"""
Enhanced Medical Simulation with Multiple Failure Mechanisms

Tests different ways treatment can permanently fail:
1. Attempt limits (20 tries per card)
2. Resource depletion (20 MSU total)
3. Treatment escalation (drawing higher same-suit cards)
4. Combined thresholds
5. Natural healing points (body takes over)
"""

import random
import statistics
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from enum import Enum
import json

class Suit(Enum):
    HEARTS = "♥"
    CLUBS = "♣"
    SPADES = "♠"
    DIAMONDS = "♦"

class FailureReason(Enum):
    SUCCESS = "success"
    ATTEMPT_LIMIT = "attempt_limit"
    RESOURCE_DEPLETION = "resource_depletion"
    TREATMENT_ESCALATION = "treatment_escalation"
    NATURAL_HEALING_POINT = "natural_healing_point"
    COMBINED_FACTORS = "combined_factors"

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
        return (self.wounds + self.strain) < 3
    
    def is_healed(self) -> bool:
        return self.wounds == 0 and self.strain < 3

class Strategy(Enum):
    CONSERVATIVE = "conservative"
    FORESIGHT = "foresight"
    PREVENTION = "prevention"
    MIXED = "mixed"
    RESOURCE_HEAVY = "resource_heavy"

@dataclass
class SkillLevel:
    name: str
    percentage: int
    
    def roll_success(self) -> SuccessLevel:
        roll = random.randint(1, 100)
        if roll > self.percentage:
            return SuccessLevel.FAILURE
        if roll in [11, 22, 33, 44, 55, 66, 77, 88, 99] and roll <= self.percentage:
            return SuccessLevel.CRITICAL
        if (roll % 10 == 0 or roll % 10 == 5) and roll <= self.percentage:
            return SuccessLevel.SPECIAL
        return SuccessLevel.ORDINARY
    
    def get_treatment_points(self, success: SuccessLevel) -> int:
        return {
            SuccessLevel.FAILURE: 0,
            SuccessLevel.ORDINARY: 1,
            SuccessLevel.SPECIAL: 2,
            SuccessLevel.CRITICAL: 3
        }[success]

@dataclass
class FailureMechanism:
    name: str
    max_attempts_per_card: Optional[int] = None
    max_total_msu: Optional[int] = None
    escalation_threshold: Optional[int] = None  # If next same-suit card is this much higher
    natural_healing_after_cards: Optional[int] = None  # Stop after clearing this many cards
    
class EnhancedMedicalSimulator:
    def __init__(self):
        self.skill_levels = [
            SkillLevel("Untrained", 25),
            SkillLevel("Novice", 45),
            SkillLevel("Competent", 60),
            SkillLevel("Expert", 80),
            SkillLevel("Master", 95)
        ]
        
        # Different failure mechanisms to test
        self.failure_mechanisms = {
            "original": FailureMechanism("Original 20/20", 20, 20),
            "strict_attempts": FailureMechanism("Strict Attempts", 15, None),
            "strict_resources": FailureMechanism("Strict Resources", None, 15),
            "escalation": FailureMechanism("Treatment Escalation", 20, 20, 3),
            "natural_healing": FailureMechanism("Natural Healing Cutoff", 20, 20, None, 3),
            "combined": FailureMechanism("Combined Strict", 10, 15, 2, 2)
        }
    
    def create_deck(self) -> List[Card]:
        deck = []
        for suit in Suit:
            for value in range(2, 15):
                deck.append(Card(suit, value))
        return deck
    
    def generate_injury_sequence(self, wounds: int, primary_suit: Suit) -> List[Card]:
        """Generate a realistic injury card sequence"""
        deck = self.create_deck()
        random.shuffle(deck)
        
        cards = []
        primary_cards = [c for c in deck if c.suit == primary_suit]
        secondary_cards = [c for c in deck if c.suit != primary_suit]
        
        # Ensure primary suit dominance but realistic distribution
        primary_needed = max(1, wounds // 2 + 1)
        
        for i in range(wounds):
            if i < primary_needed and primary_cards:
                card = primary_cards.pop(random.randint(0, len(primary_cards) - 1))
            else:
                card = deck.pop(0)
            cards.append(card)
        
        return cards
    
    def check_treatment_escalation(self, current_card: Card, upcoming_cards: List[Card], 
                                 escalation_threshold: int) -> bool:
        """Check if treatment escalation would cause failure"""
        for card in upcoming_cards[:2]:  # Look ahead 2 cards
            if (card.suit == current_card.suit and 
                card.value > current_card.value and 
                card.value - current_card.value >= escalation_threshold):
                return True
        return False
    
    def simulate_treatment_with_failure_mechanism(self, patient: Patient, skill: SkillLevel, 
                                                strategy: Strategy, mechanism: FailureMechanism,
                                                max_rounds: int = 50) -> Dict:
        """Simulate treatment with specific failure mechanism"""
        rounds = 0
        can_contribute_round = None
        healed_round = None
        msu_used = 0
        cards_cleared = 0
        total_attempts = 0
        failure_reason = FailureReason.SUCCESS
        
        deck = self.create_deck()
        random.shuffle(deck)
        
        current_patient = Patient(patient.wounds, patient.strain, 
                                patient.primary_suit, patient.cards_to_clear.copy())
        
        while rounds < max_rounds and current_patient.wounds > 0:
            rounds += 1
            
            if not current_patient.cards_to_clear:
                break
            
            # Check natural healing cutoff
            if (mechanism.natural_healing_after_cards and 
                cards_cleared >= mechanism.natural_healing_after_cards):
                failure_reason = FailureReason.NATURAL_HEALING_POINT
                break
            
            current_card = current_patient.cards_to_clear[0]
            
            # Check treatment escalation
            if mechanism.escalation_threshold:
                if self.check_treatment_escalation(current_card, current_patient.cards_to_clear[1:], 
                                                 mechanism.escalation_threshold):
                    failure_reason = FailureReason.TREATMENT_ESCALATION
                    break
            
            treatment_points_needed = current_card.value
            treatment_points_accumulated = 0
            card_attempts = 0
            
            # Clear current card
            while (treatment_points_accumulated < treatment_points_needed and 
                   (not mechanism.max_attempts_per_card or card_attempts < mechanism.max_attempts_per_card)):
                
                card_attempts += 1
                total_attempts += 1
                success = skill.roll_success()
                base_points = skill.get_treatment_points(success)
                
                if base_points == 0:
                    # Failed roll - try MSU backup
                    if strategy in [Strategy.RESOURCE_HEAVY, Strategy.CONSERVATIVE]:
                        points_needed = min(3, treatment_points_needed - treatment_points_accumulated)
                        if (not mechanism.max_total_msu or 
                            msu_used + points_needed <= mechanism.max_total_msu):
                            msu_used += points_needed
                            treatment_points_accumulated += points_needed
                        else:
                            # Hit resource limit
                            if mechanism.max_total_msu:
                                failure_reason = FailureReason.RESOURCE_DEPLETION
                                break
                    continue
                
                treatment_points_accumulated += base_points
                
                # Handle extra points based on strategy
                extra_points = max(0, base_points - (treatment_points_needed - treatment_points_accumulated))
                if extra_points > 0:
                    if strategy == Strategy.RESOURCE_HEAVY:
                        if (not mechanism.max_total_msu or msu_used < mechanism.max_total_msu):
                            msu_used += min(extra_points, 
                                          mechanism.max_total_msu - msu_used if mechanism.max_total_msu else extra_points)
            
            # Check why we exited the loop
            if treatment_points_accumulated < treatment_points_needed:
                if mechanism.max_attempts_per_card and card_attempts >= mechanism.max_attempts_per_card:
                    failure_reason = FailureReason.ATTEMPT_LIMIT
                elif failure_reason == FailureReason.RESOURCE_DEPLETION:
                    pass  # Already set
                else:
                    failure_reason = FailureReason.COMBINED_FACTORS
                break
            
            # Card successfully cleared
            current_patient.wounds -= 1
            current_patient.strain += 1
            current_patient.cards_to_clear.pop(0)
            cards_cleared += 1
            
            # Handle secondary card effects (simplified)
            if deck:
                secondary_card = deck.pop()
                if secondary_card.suit != current_patient.primary_suit:
                    # Simplified secondary effects
                    if secondary_card.value > current_card.value:
                        current_patient.strain = max(0, current_patient.strain - 1)
                    elif secondary_card.value < current_card.value:
                        current_patient.strain += 1
            
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
            'total_attempts': total_attempts,
            'final_wounds': current_patient.wounds,
            'final_strain': current_patient.strain,
            'success': current_patient.wounds == 0,
            'failure_reason': failure_reason.value
        }
    
    def run_failure_mechanism_comparison(self, iterations: int = 200) -> Dict:
        """Compare different failure mechanisms"""
        results = {}
        
        injury_scenarios = [
            (2, Suit.CLUBS, "Light Trauma"),
            (3, Suit.HEARTS, "Moderate Bleeding"),
            (4, Suit.DIAMONDS, "Severe Burns"),
            (5, Suit.SPADES, "Critical Poisoning")
        ]
        
        for mechanism_name, mechanism in self.failure_mechanisms.items():
            results[mechanism_name] = {}
            
            for skill in self.skill_levels:
                results[mechanism_name][skill.name] = {}
                
                for strategy in [Strategy.CONSERVATIVE, Strategy.FORESIGHT, Strategy.RESOURCE_HEAVY]:
                    results[mechanism_name][skill.name][strategy.value] = {}
                    
                    for wounds, primary_suit, scenario_name in injury_scenarios:
                        scenario_results = []
                        failure_reasons = {}
                        
                        for _ in range(iterations):
                            cards = self.generate_injury_sequence(wounds, primary_suit)
                            patient = Patient(wounds, 0, primary_suit, cards)
                            result = self.simulate_treatment_with_failure_mechanism(
                                patient, skill, strategy, mechanism)
                            scenario_results.append(result)
                            
                            reason = result['failure_reason']
                            failure_reasons[reason] = failure_reasons.get(reason, 0) + 1
                        
                        # Calculate statistics
                        contribute_rounds = [r['can_contribute_round'] for r in scenario_results 
                                           if r['can_contribute_round'] is not None]
                        healed_rounds = [r['healed_round'] for r in scenario_results 
                                       if r['healed_round'] is not None]
                        success_count = sum(1 for r in scenario_results if r['success'])
                        
                        results[mechanism_name][skill.name][strategy.value][scenario_name] = {
                            'success_rate': success_count / len(scenario_results),
                            'mean_contribute_rounds': statistics.mean(contribute_rounds) if contribute_rounds else None,
                            'mean_healed_rounds': statistics.mean(healed_rounds) if healed_rounds else None,
                            'mean_msu_used': statistics.mean([r['msu_used'] for r in scenario_results]),
                            'mean_total_attempts': statistics.mean([r['total_attempts'] for r in scenario_results]),
                            'failure_reasons': failure_reasons,
                            'contribute_rate': len(contribute_rounds) / len(scenario_results)
                        }
        
        return results
    
    def analyze_failure_mechanisms(self, results: Dict) -> Dict:
        """Analyze which failure mechanisms work best"""
        analysis = {}
        
        for mechanism_name, mechanism_results in results.items():
            analysis[mechanism_name] = {
                'overall_success_rate': 0,
                'gameplay_flow_score': 0,
                'strategic_diversity': 0,
                'failure_pattern_distribution': {},
                'skill_progression_clarity': 0
            }
            
            total_scenarios = 0
            total_success = 0
            total_attempts = 0
            strategy_variances = []
            
            for skill_name, skill_results in mechanism_results.items():
                for strategy_name, strategy_results in skill_results.items():
                    for scenario_name, scenario_data in strategy_results.items():
                        total_scenarios += 1
                        total_success += scenario_data['success_rate']
                        total_attempts += scenario_data['mean_total_attempts']
                        
                        # Collect failure reasons
                        for reason, count in scenario_data['failure_reasons'].items():
                            if reason not in analysis[mechanism_name]['failure_pattern_distribution']:
                                analysis[mechanism_name]['failure_pattern_distribution'][reason] = 0
                            analysis[mechanism_name]['failure_pattern_distribution'][reason] += count
            
            analysis[mechanism_name]['overall_success_rate'] = total_success / total_scenarios
            analysis[mechanism_name]['average_attempts'] = total_attempts / total_scenarios
            
            # Gameplay flow score (lower attempts = better flow)
            analysis[mechanism_name]['gameplay_flow_score'] = max(0, 100 - (total_attempts / total_scenarios))
            
        return analysis

def main():
    """Run failure mechanism comparison"""
    print("Analyzing Medical System Failure Mechanisms...")
    print("=" * 60)
    
    simulator = EnhancedMedicalSimulator()
    
    print("Testing different failure mechanisms:")
    for name, mechanism in simulator.failure_mechanisms.items():
        print(f"  {name}: {mechanism.name}")
        if mechanism.max_attempts_per_card:
            print(f"    - Max attempts per card: {mechanism.max_attempts_per_card}")
        if mechanism.max_total_msu:
            print(f"    - Max total MSU: {mechanism.max_total_msu}")
        if mechanism.escalation_threshold:
            print(f"    - Escalation threshold: {mechanism.escalation_threshold}")
        if mechanism.natural_healing_after_cards:
            print(f"    - Natural healing after: {mechanism.natural_healing_after_cards} cards")
    
    print("\nRunning simulations...")
    results = simulator.run_failure_mechanism_comparison(iterations=200)
    
    print("\nAnalyzing mechanisms...")
    analysis = simulator.analyze_failure_mechanisms(results)
    
    # Print comparison
    print("\n" + "=" * 60)
    print("FAILURE MECHANISM COMPARISON")
    print("=" * 60)
    
    print(f"{'Mechanism':<20} {'Success Rate':<12} {'Avg Attempts':<12} {'Flow Score':<10}")
    print("-" * 55)
    
    for mechanism_name, data in analysis.items():
        success_rate = f"{data['overall_success_rate']:.1%}"
        avg_attempts = f"{data['average_attempts']:.1f}"
        flow_score = f"{data['gameplay_flow_score']:.1f}"
        print(f"{mechanism_name:<20} {success_rate:<12} {avg_attempts:<12} {flow_score:<10}")
    
    print("\n" + "=" * 60)
    print("FAILURE REASON BREAKDOWN")
    print("=" * 60)
    
    for mechanism_name, data in analysis.items():
        print(f"\n{mechanism_name.upper()}:")
        total_failures = sum(data['failure_pattern_distribution'].values())
        if total_failures > 0:
            for reason, count in data['failure_pattern_distribution'].items():
                percentage = (count / total_failures) * 100
                print(f"  {reason.replace('_', ' ').title()}: {percentage:.1f}% ({count} cases)")
        else:
            print("  No failures recorded")
    
    # Detailed breakdown for interesting cases
    print("\n" + "=" * 60)
    print("DETAILED ANALYSIS: SEVERE BURNS (4 WOUNDS)")
    print("=" * 60)
    
    scenario_name = "Severe Burns"
    skill_level = "Novice"
    
    print(f"\n{skill_level} Medic treating {scenario_name}:")
    print(f"{'Mechanism':<20} {'Conservative':<12} {'Foresight':<12} {'Resource Heavy':<12}")
    print("-" * 60)
    
    for mechanism_name in results.keys():
        if skill_level in results[mechanism_name]:
            row = f"{mechanism_name:<20}"
            for strategy in ["conservative", "foresight", "resource_heavy"]:
                if (strategy in results[mechanism_name][skill_level] and 
                    scenario_name in results[mechanism_name][skill_level][strategy]):
                    success_rate = results[mechanism_name][skill_level][strategy][scenario_name]['success_rate']
                    rate_str = f"{success_rate:.1%}"
                    row += f" {rate_str:<12}"
                else:
                    row += f" {'N/A':<12}"
            print(row)
    
    # Save detailed results
    with open('failure_mechanism_analysis.json', 'w') as f:
        json.dump({
            'results': results,
            'analysis': analysis,
            'mechanisms': {name: {
                'max_attempts_per_card': mech.max_attempts_per_card,
                'max_total_msu': mech.max_total_msu,
                'escalation_threshold': mech.escalation_threshold,
                'natural_healing_after_cards': mech.natural_healing_after_cards
            } for name, mech in simulator.failure_mechanisms.items()}
        }, f, indent=2)
    
    print(f"\nDetailed results saved to 'failure_mechanism_analysis.json'")
    
    # Recommendations
    print("\n" + "=" * 60)
    print("RECOMMENDATIONS")
    print("=" * 60)
    
    # Find best mechanism
    best_mechanism = max(analysis.keys(), 
                        key=lambda x: analysis[x]['overall_success_rate'] + 
                                    analysis[x]['gameplay_flow_score']/100)
    
    print(f"\nBest Overall Mechanism: {best_mechanism}")
    print(f"  - Success Rate: {analysis[best_mechanism]['overall_success_rate']:.1%}")
    print(f"  - Gameplay Flow Score: {analysis[best_mechanism]['gameplay_flow_score']:.1f}")
    
    print("\nKey Insights:")
    escalation_failures = sum(1 for data in analysis.values() 
                            if 'treatment_escalation' in data['failure_pattern_distribution'])
    if escalation_failures > 0:
        print("  - Treatment escalation creates meaningful 'making it worse' scenarios")
    
    natural_healing_failures = sum(1 for data in analysis.values() 
                                 if 'natural_healing_point' in data['failure_pattern_distribution'])
    if natural_healing_failures > 0:
        print("  - Natural healing cutoffs provide realistic treatment limits")
    
    print("  - Different mechanisms create different risk profiles for players")
    print("  - Failure reasons should be narratively meaningful in gameplay")

if __name__ == "__main__":
    main()