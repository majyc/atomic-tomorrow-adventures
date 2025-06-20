#!/usr/bin/env python3
"""
Monte Carlo Analysis of Improved Robotic Repair Circuit System

Analyzes the proposed improved repair system with:
- Failure-driven approach switching
- Circuit analysis and problem prevention
- Secondary card interactions
- Failure conditions and resource limits

Tests different strategies across skill levels for various repair complexities.
"""

import random
import statistics
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional, Set
from enum import Enum
import json

class Suit(Enum):
    HEARTS = "♥"      # Intuitive/Personal
    DIAMONDS = "♦"    # Technical/Engineering  
    CLUBS = "♣"       # Mechanical/Physical
    SPADES = "♠"      # Theoretical/Programming

class CardType(Enum):
    NUMBER = "number"
    JACK = "jack"
    QUEEN = "queen"
    KING = "king"
    ACE = "ace"
    JOKER = "joker"

@dataclass
class Card:
    suit: Suit
    value: int  # 2-10 for numbers, 11=J, 12=Q, 13=K, 14=A, 15/16=Jokers
    card_type: CardType
    
    def __str__(self):
        if self.card_type == CardType.JOKER:
            return "Red Joker" if self.value == 15 else "Black Joker"
        face_names = {11: "J", 12: "Q", 13: "K", 14: "A"}
        display = face_names.get(self.value, str(self.value))
        return f"{display}{self.suit.value}"

class SuccessLevel(Enum):
    FAILURE = 0
    ORDINARY = 1
    SPECIAL = 2
    CRITICAL = 3

class FailureReason(Enum):
    SUCCESS = "success"
    ATTEMPT_LIMIT = "attempt_limit"
    RESOURCE_DEPLETION = "resource_depletion"
    SYSTEM_DEGRADATION = "system_degradation"
    CASCADE_FAILURE = "cascade_failure"

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
    
    def get_circuit_points(self, success: SuccessLevel) -> int:
        return {
            SuccessLevel.FAILURE: 0,
            SuccessLevel.ORDINARY: 1,
            SuccessLevel.SPECIAL: 2,
            SuccessLevel.CRITICAL: 3
        }[success]

class Strategy(Enum):
    CONSERVATIVE = "conservative"        # Always spend extra on current node
    ANALYTICAL = "analytical"           # Prioritize foresight
    PREVENTIVE = "preventive"           # Aggressively discard bad cards
    ADAPTIVE = "adaptive"               # Balance based on situation
    RESOURCE_HEAVY = "resource_heavy"   # Use spare parts liberally

@dataclass
class RepairState:
    complexity: int                     # Overall successes needed (1-3)
    current_approach: Suit
    previous_approach: Optional[Suit]
    current_node_value: int
    circuit_points_accumulated: int
    stored_points: int
    revealed_cards: List[Card]          # Cards seen via foresight
    overall_successes: int
    spare_parts_used: int
    total_attempts: int
    jack_sequence: int                  # Count of consecutive Jacks for cascade failure
    
    def is_complete(self) -> bool:
        return self.overall_successes >= self.complexity
    
    def can_switch_approach(self) -> bool:
        return self.previous_approach is not None

@dataclass
class Robot:
    complexity: int  # 1=Minor, 2=Moderate, 3=Major problem
    
class RoboticRepairSimulator:
    def __init__(self):
        self.skill_levels = [
            SkillLevel("Untrained", 25),
            SkillLevel("Novice", 45),
            SkillLevel("Competent", 60),
            SkillLevel("Expert", 80),
            SkillLevel("Master", 95)
        ]
        
        # Failure limits
        self.max_attempts_per_node = 12
        self.max_spare_parts = 15
        self.degradation_threshold = 4  # Same-suit value jump that causes failure
        self.cascade_jack_limit = 3
        
    def create_deck(self) -> List[Card]:
        """Create full deck including face cards and jokers"""
        deck = []
        
        for suit in Suit:
            # Number cards 2-10
            for value in range(2, 11):
                deck.append(Card(suit, value, CardType.NUMBER))
            # Face cards
            deck.append(Card(suit, 11, CardType.JACK))
            deck.append(Card(suit, 12, CardType.QUEEN))
            deck.append(Card(suit, 13, CardType.KING))
            deck.append(Card(suit, 14, CardType.ACE))
        
        # Jokers
        deck.append(Card(Suit.HEARTS, 15, CardType.JOKER))  # Red Joker
        deck.append(Card(Suit.SPADES, 16, CardType.JOKER))  # Black Joker
        
        return deck
    
    def handle_face_card(self, card: Card, state: RepairState) -> Tuple[bool, int]:
        """
        Handle face card effects
        Returns: (node_completed, circuit_points_bonus)
        """
        if card.card_type == CardType.JACK:
            state.jack_sequence += 1
            # Jack = complication, requires resolution but gives progress
            return True, 0
            
        elif card.card_type == CardType.QUEEN:
            # Queen = opportunity, gives bonus for next action
            return True, 2
            
        elif card.card_type == CardType.KING:
            # King = major discovery, auto-completes node
            return True, card.value
            
        elif card.card_type == CardType.ACE:
            # Ace = immediate repair completion
            state.overall_successes = state.complexity
            return True, 0
            
        elif card.card_type == CardType.JOKER:
            if card.value == 15:  # Red Joker
                state.overall_successes = state.complexity
                return True, 0
            else:  # Black Joker
                # Catastrophic failure - restart
                state.overall_successes = 0
                state.stored_points = 0
                return True, 0
        
        return False, 0
    
    def handle_secondary_card(self, drawn_card: Card, current_node_value: int) -> Tuple[int, int]:
        """
        Handle secondary approach card (different suit)
        Returns: (circuit_points_bonus, node_value_reduction)
        """
        if drawn_card.value > current_node_value:
            # Higher value = cross-system synergy
            return 1, 0
        elif drawn_card.value == current_node_value:
            # Exact match = perfect integration
            return 2, 1
        else:
            # Lower value = interference (simplified - just slower progress)
            return 0, 0
    
    def should_discard_card(self, card: Card, strategy: Strategy, state: RepairState) -> bool:
        """Determine if strategy would discard a revealed card"""
        if card.card_type == CardType.JACK:
            # Always consider discarding complications
            return strategy in [Strategy.PREVENTIVE, Strategy.ADAPTIVE]
        elif card.card_type in [CardType.QUEEN, CardType.KING, CardType.ACE]:
            # Never discard opportunities
            return False
        elif card.card_type == CardType.NUMBER:
            if strategy == Strategy.PREVENTIVE:
                return card.value > 7  # Discard high-value challenges
            elif strategy == Strategy.ADAPTIVE:
                return card.value > 8 and state.stored_points > 1
        return False
    
    def get_skill_for_approach(self, approach: Suit, base_skill: SkillLevel) -> SkillLevel:
        """
        Different approaches might use different skills
        For simplicity, assume slight variations in effectiveness
        """
        # Simulate that different characters might be better at different approaches
        variation = random.randint(-5, 5)
        adjusted_percentage = max(10, min(95, base_skill.percentage + variation))
        return SkillLevel(f"{base_skill.name}_{approach.value}", adjusted_percentage)
    
    def simulate_repair(self, robot: Robot, skill: SkillLevel, strategy: Strategy, 
                       max_rounds: int = 100) -> Dict:
        """Simulate a complete repair sequence"""
        
        deck = self.create_deck()
        random.shuffle(deck)
        
        # Initialize repair state
        state = RepairState(
            complexity=robot.complexity,
            current_approach=random.choice(list(Suit)),  # Random starting approach
            previous_approach=None,
            current_node_value=0,
            circuit_points_accumulated=0,
            stored_points=0,
            revealed_cards=[],
            overall_successes=0,
            spare_parts_used=0,
            total_attempts=0,
            jack_sequence=0
        )
        
        rounds = 0
        failure_reason = FailureReason.SUCCESS
        node_attempts = 0
        
        while rounds < max_rounds and not state.is_complete():
            rounds += 1
            
            # Draw new node if needed
            if state.current_node_value == 0:
                if not deck:
                    deck = self.create_deck()
                    random.shuffle(deck)
                
                card = deck.pop()
                
                # Check for system degradation (same suit, high value jump)
                if (card.suit == state.current_approach and 
                    state.circuit_points_accumulated > 0 and
                    card.card_type == CardType.NUMBER and
                    card.value - state.current_node_value >= self.degradation_threshold):
                    failure_reason = FailureReason.SYSTEM_DEGRADATION
                    break
                
                # Handle face cards immediately
                if card.card_type != CardType.NUMBER:
                    completed, bonus = self.handle_face_card(card, state)
                    if completed:
                        state.overall_successes += 1
                        state.jack_sequence = 0 if card.card_type != CardType.JACK else state.jack_sequence
                        if state.jack_sequence >= self.cascade_jack_limit:
                            failure_reason = FailureReason.CASCADE_FAILURE
                            break
                        continue
                
                # Handle secondary cards (different suit)
                if card.suit != state.current_approach:
                    bonus_points, value_reduction = self.handle_secondary_card(card, state.current_node_value)
                    state.circuit_points_accumulated += bonus_points
                    if state.current_node_value > 0:
                        state.current_node_value = max(1, state.current_node_value - value_reduction)
                    continue
                
                # New primary approach node
                state.current_node_value = card.value
                state.circuit_points_accumulated = 0
                node_attempts = 0
            
            # Work on current node
            node_attempts += 1
            state.total_attempts += 1
            
            # Check attempt limit
            if node_attempts > self.max_attempts_per_node:
                failure_reason = FailureReason.ATTEMPT_LIMIT
                break
            
            # Make skill roll
            approach_skill = self.get_skill_for_approach(state.current_approach, skill)
            success = approach_skill.roll_success()
            base_points = approach_skill.get_circuit_points(success)
            
            if base_points == 0:
                # Failed roll - try spare parts backup
                if strategy == Strategy.RESOURCE_HEAVY and state.spare_parts_used < self.max_spare_parts:
                    points_needed = min(2, state.current_node_value - state.circuit_points_accumulated)
                    state.spare_parts_used += points_needed
                    state.circuit_points_accumulated += points_needed
                else:
                    # Check for special/critical failure forcing approach switch
                    if random.randint(1, 100) <= 15:  # 15% chance of forced switch
                        if deck:
                            switch_card = deck.pop()
                            state.previous_approach = state.current_approach
                            state.current_approach = switch_card.suit
                            state.current_node_value = switch_card.value if switch_card.card_type == CardType.NUMBER else 5
                            state.circuit_points_accumulated = 0
                            state.revealed_cards.clear()  # Lose foresight on critical failure
                            node_attempts = 0
                continue
            
            # Successful roll
            state.circuit_points_accumulated += base_points
            
            # Handle extra points based on strategy
            extra_points = max(0, state.circuit_points_accumulated - state.current_node_value)
            if extra_points > 0:
                state.circuit_points_accumulated = state.current_node_value  # Cap at requirement
                
                # Spend extra points according to strategy
                while extra_points > 0:
                    if strategy == Strategy.ANALYTICAL and extra_points >= 1:
                        # Use foresight
                        if deck and len(state.revealed_cards) < 3:
                            peek_card = deck.pop()
                            state.revealed_cards.append(peek_card)
                            extra_points -= 1
                        else:
                            break
                            
                    elif strategy == Strategy.PREVENTIVE and extra_points >= 1 and state.revealed_cards:
                        # Try to discard bad cards
                        for i, card in enumerate(state.revealed_cards):
                            if self.should_discard_card(card, strategy, state):
                                state.revealed_cards.pop(i)
                                if deck:
                                    replacement = deck.pop()
                                    state.revealed_cards.append(replacement)
                                extra_points -= 1
                                break
                        else:
                            break
                            
                    elif strategy == Strategy.ADAPTIVE and extra_points >= 1:
                        # Balance between foresight and storage
                        if len(state.revealed_cards) < 2 and deck:
                            peek_card = deck.pop()
                            state.revealed_cards.append(peek_card)
                            extra_points -= 1
                        elif state.stored_points < 3:
                            state.stored_points += 1
                            extra_points -= 1
                        else:
                            break
                            
                    elif strategy == Strategy.CONSERVATIVE:
                        # Store for later use
                        if state.stored_points < 5:
                            state.stored_points += min(extra_points, 5 - state.stored_points)
                        break
                    else:
                        break
            
            # Use stored points if needed
            if state.circuit_points_accumulated < state.current_node_value:
                needed = state.current_node_value - state.circuit_points_accumulated
                used = min(needed, state.stored_points)
                state.circuit_points_accumulated += used
                state.stored_points -= used
            
            # Check if node is complete
            if state.circuit_points_accumulated >= state.current_node_value:
                state.overall_successes += 1
                state.current_node_value = 0
                node_attempts = 0
                
                # Option to switch approaches after completing a node
                if state.can_switch_approach() and strategy == Strategy.ADAPTIVE:
                    if random.randint(1, 100) <= 30:  # 30% chance to switch
                        state.current_approach, state.previous_approach = state.previous_approach, state.current_approach
        
        # Check resource depletion
        if state.spare_parts_used >= self.max_spare_parts and not state.is_complete():
            failure_reason = FailureReason.RESOURCE_DEPLETION
        
        return {
            'rounds': rounds,
            'success': state.is_complete(),
            'overall_successes_achieved': state.overall_successes,
            'spare_parts_used': state.spare_parts_used,
            'total_attempts': state.total_attempts,
            'failure_reason': failure_reason.value,
            'final_complexity_remaining': state.complexity - state.overall_successes
        }
    
    def run_monte_carlo(self, iterations: int = 500) -> Dict:
        """Run Monte Carlo analysis across skill levels, strategies, and complexities"""
        results = {}
        
        complexities = [
            (1, "Minor Problem"),
            (2, "Moderate Problem"), 
            (3, "Major Problem")
        ]
        
        for skill in self.skill_levels:
            results[skill.name] = {}
            
            for strategy in Strategy:
                results[skill.name][strategy.value] = {}
                
                for complexity, problem_name in complexities:
                    scenario_results = []
                    
                    for _ in range(iterations):
                        robot = Robot(complexity)
                        result = self.simulate_repair(robot, skill, strategy)
                        scenario_results.append(result)
                    
                    # Calculate statistics
                    successful_repairs = [r for r in scenario_results if r['success']]
                    
                    results[skill.name][strategy.value][problem_name] = {
                        'success_rate': len(successful_repairs) / len(scenario_results),
                        'mean_rounds': statistics.mean([r['rounds'] for r in successful_repairs]) if successful_repairs else None,
                        'mean_spare_parts': statistics.mean([r['spare_parts_used'] for r in scenario_results]),
                        'mean_attempts': statistics.mean([r['total_attempts'] for r in scenario_results]),
                        'failure_breakdown': {}
                    }
                    
                    # Failure reason breakdown
                    for result in scenario_results:
                        reason = result['failure_reason']
                        if reason not in results[skill.name][strategy.value][problem_name]['failure_breakdown']:
                            results[skill.name][strategy.value][problem_name]['failure_breakdown'][reason] = 0
                        results[skill.name][strategy.value][problem_name]['failure_breakdown'][reason] += 1
        
        return results
    
    def analyze_strategies(self, results: Dict) -> Dict:
        """Analyze which strategies work best for different scenarios"""
        analysis = {}
        
        for skill_name, skill_results in results.items():
            analysis[skill_name] = {
                'best_overall': {},
                'most_efficient': {},
                'strategy_variance': {}
            }
            
            for problem in ["Minor Problem", "Moderate Problem", "Major Problem"]:
                success_rates = {}
                efficiency_scores = {}
                round_counts = {}
                
                for strategy, strategy_results in skill_results.items():
                    if problem in strategy_results:
                        data = strategy_results[problem]
                        success_rates[strategy] = data['success_rate']
                        
                        # Efficiency = success rate / resource usage
                        if data['mean_spare_parts'] > 0:
                            efficiency_scores[strategy] = data['success_rate'] / data['mean_spare_parts']
                        else:
                            efficiency_scores[strategy] = data['success_rate']
                        
                        if data['mean_rounds']:
                            round_counts[strategy] = data['mean_rounds']
                
                # Find best strategies
                if success_rates:
                    best_success = max(success_rates, key=success_rates.get)
                    analysis[skill_name]['best_overall'][problem] = best_success
                
                if efficiency_scores:
                    most_efficient = max(efficiency_scores, key=efficiency_scores.get)
                    analysis[skill_name]['most_efficient'][problem] = most_efficient
                
                # Calculate strategy variance
                if len(success_rates) > 1:
                    variance = statistics.stdev(success_rates.values()) / statistics.mean(success_rates.values())
                    analysis[skill_name]['strategy_variance'][problem] = variance
        
        return analysis

def main():
    """Run the robotic repair Monte Carlo analysis"""
    print("Robotic Repair Circuit System Monte Carlo Analysis")
    print("=" * 60)
    
    simulator = RoboticRepairSimulator()
    
    print("Testing improved repair system with:")
    print("- Failure-driven approach switching")
    print("- Circuit analysis and problem prevention")
    print("- Secondary card interactions")
    print("- Resource limits and failure conditions")
    
    print("\nRunning simulations...")
    results = simulator.run_monte_carlo(iterations=300)
    
    print("\nAnalyzing strategies...")
    analysis = simulator.analyze_strategies(results)
    
    # Print results summary
    print("\n" + "=" * 60)
    print("RESULTS SUMMARY")
    print("=" * 60)
    
    print(f"{'Skill Level':<12} {'Problem':<15} {'Best Strategy':<15} {'Success Rate':<12}")
    print("-" * 65)
    
    for skill_name in simulator.skill_levels:
        skill_analysis = analysis[skill_name.name]
        for problem in ["Minor Problem", "Moderate Problem", "Major Problem"]:
            if problem in skill_analysis['best_overall']:
                best_strategy = skill_analysis['best_overall'][problem]
                success_rate = results[skill_name.name][best_strategy][problem]['success_rate']
                print(f"{skill_name.name:<12} {problem:<15} {best_strategy:<15} {success_rate:.1%}")
    
    print("\n" + "=" * 60)
    print("STRATEGY EFFECTIVENESS BY COMPLEXITY")
    print("=" * 60)
    
    for problem in ["Minor Problem", "Moderate Problem", "Major Problem"]:
        print(f"\n{problem.upper()}:")
        print(f"{'Strategy':<15} {'Success Rate Range':<20} {'Best For Skills'}")
        print("-" * 55)
        
        strategy_performance = {}
        for strategy in Strategy:
            success_rates = []
            best_skills = []
            
            for skill_name in ["Untrained", "Novice", "Competent", "Expert", "Master"]:
                if (skill_name in results and 
                    strategy.value in results[skill_name] and 
                    problem in results[skill_name][strategy.value]):
                    
                    rate = results[skill_name][strategy.value][problem]['success_rate']
                    success_rates.append(rate)
                    
                    # Check if this is best strategy for this skill/problem
                    if problem in analysis[skill_name]['best_overall']:
                        if analysis[skill_name]['best_overall'][problem] == strategy.value:
                            best_skills.append(skill_name)
            
            if success_rates:
                min_rate = min(success_rates)
                max_rate = max(success_rates)
                rate_range = f"{min_rate:.1%} - {max_rate:.1%}"
                best_for = ", ".join(best_skills) if best_skills else "None"
                print(f"{strategy.value:<15} {rate_range:<20} {best_for}")
    
    print("\n" + "=" * 60)
    print("KEY INSIGHTS")
    print("=" * 60)
    
    # Resource usage analysis
    print("\nResource Usage Patterns:")
    for skill_name in ["Untrained", "Expert"]:
        if skill_name in results:
            print(f"\n{skill_name} Technician:")
            for problem in ["Minor Problem", "Major Problem"]:
                for strategy in ["conservative", "resource_heavy"]:
                    if (strategy in results[skill_name] and 
                        problem in results[skill_name][strategy]):
                        data = results[skill_name][strategy][problem]
                        print(f"  {problem} + {strategy}: {data['mean_spare_parts']:.1f} parts, {data['success_rate']:.1%} success")
    
    # Strategy variance analysis
    print("\nStrategy Choice Impact:")
    for skill_name in ["Novice", "Competent"]:
        if skill_name in analysis:
            for problem in ["Moderate Problem", "Major Problem"]:
                if problem in analysis[skill_name]['strategy_variance']:
                    variance = analysis[skill_name]['strategy_variance'][problem]
                    impact = "HIGH" if variance > 0.2 else "MODERATE" if variance > 0.1 else "LOW"
                    print(f"  {skill_name} + {problem}: {impact} impact (CV: {variance:.3f})")
    
    # Save detailed results
    with open('robotic_repair_analysis.json', 'w') as f:
        json.dump({
            'results': results,
            'analysis': analysis,
            'parameters': {
                'max_attempts_per_node': simulator.max_attempts_per_node,
                'max_spare_parts': simulator.max_spare_parts,
                'degradation_threshold': simulator.degradation_threshold,
                'cascade_jack_limit': simulator.cascade_jack_limit
            }
        }, f, indent=2)
    
    print(f"\nDetailed results saved to 'robotic_repair_analysis.json'")

if __name__ == "__main__":
    main()