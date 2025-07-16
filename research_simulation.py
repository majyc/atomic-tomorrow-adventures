#!/usr/bin/env python3
"""
Monte Carlo simulation for Research Card System v2.0
Analyzes different player strategies across various difficulty levels.
"""

import random
import statistics
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import json

class Suit(Enum):
    HEARTS = "♥"
    DIAMONDS = "♦"
    CLUBS = "♣"
    SPADES = "♠"

@dataclass
class Card:
    suit: Suit
    value: int  # 1=Ace, 11=Jack, 12=Queen, 13=King
    
    def is_ace(self) -> bool:
        return self.value == 1
    
    def is_face_card(self) -> bool:
        return self.value > 10
    
    def __str__(self):
        if self.value == 1:
            return f"A{self.suit.value}"
        elif self.value == 11:
            return f"J{self.suit.value}"
        elif self.value == 12:
            return f"Q{self.suit.value}"
        elif self.value == 13:
            return f"K{self.suit.value}"
        else:
            return f"{self.value}{self.suit.value}"

@dataclass
class ResearchState:
    current_suit: Suit
    threshold: int
    progress: int  # highest card value achieved so far
    resources: Dict[Suit, int] = field(default_factory=dict)
    turn_count: int = 0
    completed: bool = False
    failed: bool = False
    total_resources_spent: int = 0

@dataclass
class HiddenTrack:
    suit: Suit
    cards: List[Card] = field(default_factory=list)

class ResearchSimulation:
    def __init__(self, threshold: int = 6, starting_resources: Dict[Suit, int] = None):
        self.threshold = threshold
        self.deck = self._create_deck()
        self.hidden_tracks: Dict[Suit, HiddenTrack] = {
            suit: HiddenTrack(suit) for suit in Suit
        }
        self.starting_resources = starting_resources or {
            Suit.HEARTS: 3,
            Suit.DIAMONDS: 2, 
            Suit.CLUBS: 1,
            Suit.SPADES: 2
        }
        
    def _create_deck(self) -> List[Card]:
        """Create a standard 52-card deck"""
        deck = []
        for suit in Suit:
            for value in range(1, 14):
                deck.append(Card(suit, value))
        random.shuffle(deck)
        return deck
    
    def _draw_until_suit_match(self, target_suit: Suit) -> Tuple[Card, List[Card]]:
        """Draw cards until finding target suit, return matching card and non-matches"""
        non_matches = []
        
        while self.deck:
            card = self.deck.pop(0)
            if card.suit == target_suit:
                return card, non_matches
            else:
                non_matches.append(card)
        
        # Deck exhausted - this is a failure condition
        raise Exception("Deck exhausted without finding matching suit")
    
    def _place_non_matches_in_hidden_tracks(self, non_matches: List[Card]):
        """Place non-matching cards in appropriate hidden tracks"""
        for card in non_matches:
            self.hidden_tracks[card.suit].cards.append(card)
    
    def _cleanup_unused_tracks(self):
        """Move unused hidden track cards to bottom of deck"""
        for track in self.hidden_tracks.values():
            if track.cards:
                # Add to bottom of deck
                self.deck.extend(track.cards)
                track.cards.clear()

class PlayerStrategy:
    """Base class for player strategies"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        """
        Return action decision:
        - ("visible", None) to work on visible card
        - ("hidden", suit) to explore hidden track
        """
        raise NotImplementedError
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        """Decide whether to spend a resource to accelerate this card"""
        raise NotImplementedError

class ConservativeStrategy(PlayerStrategy):
    """Always take visible cards, spend resources liberally"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        return ("visible", None)
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        # Spend if we have the matching resource
        return state.resources.get(card.suit, 0) > 0

class AggressiveStrategy(PlayerStrategy):
    """Explore hidden tracks when visible card >6, minimal resources"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        if visible_card.value > 6:
            # Look for hidden tracks with cards
            available_tracks = [suit for suit, track in hidden_tracks.items() 
                              if track.cards]
            if available_tracks:
                return ("hidden", random.choice(available_tracks))
        return ("visible", None)
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        # Only spend resources if we're close to failure
        return (state.resources.get(card.suit, 0) > 2 and 
                card.value < state.threshold)

class BalancedStrategy(PlayerStrategy):
    """Mix of approaches based on situation"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        # If visible card meets threshold, take it
        if visible_card.value >= state.threshold:
            return ("visible", None)
        
        # If visible card is much higher than we need, explore alternatives
        if visible_card.value > state.threshold + 2:
            available_tracks = [suit for suit, track in hidden_tracks.items() 
                              if track.cards]
            if available_tracks and random.random() < 0.6:
                return ("hidden", random.choice(available_tracks))
        
        return ("visible", None)
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        # Spend strategically based on card value and resources available
        if state.resources.get(card.suit, 0) == 0:
            return False
        
        # More likely to spend on high-value cards or when we have many resources
        spend_probability = min(0.8, (card.value / 10) + (state.resources[card.suit] / 5))
        return random.random() < spend_probability

class ResourceHeavyStrategy(PlayerStrategy):
    """Always spend resources when available"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        return ("visible", None)  # Simple approach, focus on resource management
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        return state.resources.get(card.suit, 0) > 0

class ThresholdFocusedStrategy(PlayerStrategy):
    """Only work on cards that meet/exceed threshold"""
    
    def choose_action(self, visible_card: Card, hidden_tracks: Dict[Suit, HiddenTrack], 
                     state: ResearchState) -> Tuple[str, Optional[Suit]]:
        if visible_card.value >= state.threshold:
            return ("visible", None)
        
        # Always explore hidden tracks if visible doesn't meet threshold
        available_tracks = [suit for suit, track in hidden_tracks.items() 
                          if track.cards]
        if available_tracks:
            return ("hidden", random.choice(available_tracks))
        
        # Forced to take visible card
        return ("visible", None)
    
    def should_spend_resource(self, card: Card, state: ResearchState) -> bool:
        # Only spend on cards that meet threshold
        return (card.value >= state.threshold and 
                state.resources.get(card.suit, 0) > 0)

def simulate_research_session(strategy: PlayerStrategy, threshold: int, 
                            starting_resources: Dict[Suit, int], max_turns: int = 50) -> ResearchState:
    """Simulate a single research session"""
    
    sim = ResearchSimulation(threshold, starting_resources.copy())
    state = ResearchState(
        current_suit=random.choice(list(Suit)),
        threshold=threshold,
        progress=0,
        resources=starting_resources.copy()
    )
    
    try:
        while state.turn_count < max_turns and not state.completed and not state.failed:
            state.turn_count += 1
            
            # Draw until we find a matching card
            try:
                visible_card, non_matches = sim._draw_until_suit_match(state.current_suit)
            except Exception:
                state.failed = True
                break
            
            # Place non-matches in hidden tracks
            sim._place_non_matches_in_hidden_tracks(non_matches)
            
            # Player chooses action
            action, chosen_suit = strategy.choose_action(visible_card, sim.hidden_tracks, state)
            
            if action == "hidden" and chosen_suit:
                # Switch to hidden track
                if sim.hidden_tracks[chosen_suit].cards:
                    working_card = sim.hidden_tracks[chosen_suit].cards.pop(0)
                    state.current_suit = chosen_suit
                else:
                    # No cards in chosen track, fall back to visible
                    working_card = visible_card
            else:
                working_card = working_card = visible_card
            
            # Work on the chosen card
            if working_card.is_ace():
                if state.progress >= state.threshold:
                    state.completed = True
                    break
                # Ace drawn but threshold not met - continue
                continue
            
            if working_card.is_face_card():
                # Face cards are special events - for simulation, treat as progress
                state.progress = max(state.progress, 7)  # Moderate progress
            else:
                state.progress = max(state.progress, working_card.value)
            
            # Decide whether to spend resources
            if strategy.should_spend_resource(working_card, state):
                if state.resources.get(working_card.suit, 0) > 0:
                    state.resources[working_card.suit] -= 1
                    state.total_resources_spent += 1
                    # Resource spending gives chance to draw ace immediately
                    if random.random() < 0.3:  # 30% chance ace appears next
                        if state.progress >= state.threshold:
                            state.completed = True
                            break
        
        # Clean up unused tracks
        sim._cleanup_unused_tracks()
        
        if state.turn_count >= max_turns:
            state.failed = True
            
    except Exception as e:
        state.failed = True
    
    return state

def run_monte_carlo_analysis(num_simulations: int = 10000):
    """Run comprehensive Monte Carlo analysis"""
    
    strategies = {
        "Conservative": ConservativeStrategy(),
        "Aggressive": AggressiveStrategy(), 
        "Balanced": BalancedStrategy(),
        "Resource-Heavy": ResourceHeavyStrategy(),
        "Threshold-Focused": ThresholdFocusedStrategy()
    }
    
    thresholds = [4, 6, 8, 10]
    
    starting_resources = {
        Suit.HEARTS: 3,
        Suit.DIAMONDS: 2,
        Suit.CLUBS: 1, 
        Suit.SPADES: 2
    }
    
    results = {}
    
    for strategy_name, strategy in strategies.items():
        results[strategy_name] = {}
        
        for threshold in thresholds:
            print(f"Running {strategy_name} strategy with threshold {threshold}...")
            
            session_results = []
            for _ in range(num_simulations):
                result = simulate_research_session(strategy, threshold, starting_resources)
                session_results.append(result)
            
            # Analyze results
            completed_sessions = [r for r in session_results if r.completed]
            failed_sessions = [r for r in session_results if r.failed]
            
            completion_rate = len(completed_sessions) / len(session_results)
            avg_turns = statistics.mean([r.turn_count for r in completed_sessions]) if completed_sessions else 0
            avg_resources = statistics.mean([r.total_resources_spent for r in completed_sessions]) if completed_sessions else 0
            failure_rate = len(failed_sessions) / len(session_results)
            
            results[strategy_name][threshold] = {
                "completion_rate": completion_rate,
                "avg_turns": avg_turns,
                "avg_resources_spent": avg_resources,
                "failure_rate": failure_rate,
                "total_simulations": len(session_results)
            }
    
    return results

def print_analysis_report(results: Dict):
    """Print formatted analysis report"""
    
    print("\n" + "="*80)
    print("RESEARCH CARD SYSTEM v2.0 - MONTE CARLO ANALYSIS REPORT")
    print("="*80)
    
    for strategy_name, strategy_results in results.items():
        print(f"\n{strategy_name.upper()} STRATEGY")
        print("-" * 50)
        print(f"{'Threshold':<12} {'Complete%':<12} {'Avg Turns':<12} {'Avg Resources':<15} {'Failure%':<12}")
        print("-" * 50)
        
        for threshold, metrics in strategy_results.items():
            completion = f"{metrics['completion_rate']:.1%}"
            turns = f"{metrics['avg_turns']:.1f}"
            resources = f"{metrics['avg_resources_spent']:.1f}"
            failure = f"{metrics['failure_rate']:.1%}"
            
            print(f"{threshold:<12} {completion:<12} {turns:<12} {resources:<15} {failure:<12}")
    
    # Summary recommendations
    print("\n" + "="*80)
    print("STRATEGY RECOMMENDATIONS")
    print("="*80)
    
    best_overall = {}
    for threshold in [4, 6, 8, 10]:
        best_completion = max(results.keys(), 
                            key=lambda s: results[s][threshold]['completion_rate'])
        best_efficiency = min([s for s in results.keys() 
                             if results[s][threshold]['completion_rate'] > 0.8],
                            key=lambda s: results[s][threshold]['avg_turns'],
                            default=best_completion)
        
        print(f"\nThreshold {threshold}:")
        print(f"  Best completion rate: {best_completion} ({results[best_completion][threshold]['completion_rate']:.1%})")
        print(f"  Most efficient: {best_efficiency} ({results[best_efficiency][threshold]['avg_turns']:.1f} turns)")

if __name__ == "__main__":
    print("Starting Monte Carlo simulation for Research Card System v2.0...")
    print("This may take a few minutes...")
    
    results = run_monte_carlo_analysis(1000)  # Reduced for faster testing
    
    print_analysis_report(results)
    
    # Save detailed results to JSON
    with open('research_simulation_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nDetailed results saved to research_simulation_results.json")