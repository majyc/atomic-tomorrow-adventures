# Atomic Tomorrow Adventures: Medical Card System Analysis Report

## Executive Summary

This report presents a comprehensive Monte Carlo analysis of the Atomic Tomorrow Adventures medical card system, examining treatment strategies across different skill levels for various injury severities. The analysis reveals a well-balanced system with meaningful trade-offs between speed, reliability, and resource consumption, with no single dominant strategy across all scenarios.

## Methodology

### Simulation Framework
- **Iterations**: 500 simulations per scenario
- **Skill Levels**: 5 levels from Untrained (25%) to Master (95%)
- **Injury Scenarios**: 4 severity levels (2-5 wounds) across different suit types
- **Strategies**: 5 distinct approaches to extra success allocation

### Key Assumptions

#### Skill System
- **Skill Percentages**: 
  - Untrained: 25%
  - Novice: 45% 
  - Competent: 60%
  - Expert: 80%
  - Master: 95%

#### Success Mechanics
- **Ordinary Success**: Roll under skill percentage → 1 Treatment Point
- **Special Success**: Roll ending in 0 or 5 → 2 Treatment Points  
- **Critical Success**: Roll doubles (11,22,33...99) under skill → 3 Treatment Points
- **Failure**: Roll over skill percentage → 0 Treatment Points

#### Resource Constraints
- **Maximum MSU**: 20 units per treatment sequence
- **MSU Effectiveness**: 1 MSU = 1 Treatment Point (maximum 3 per card)
- **Treatment Stall**: Occurs when resources exhausted or too many failed attempts

#### Card Mechanics
- **Primary Cards**: Must accumulate Treatment Points equal to card value
- **Secondary Cards**: Provide complications/benefits based on value comparison
- **Card Clearance**: Converts 1 wound to 1 strain per cleared card

## Strategy Definitions

### 1. Conservative
- **Approach**: Always spend extra Treatment Points on current card
- **Philosophy**: Minimize treatment time per card, ensure completion
- **Resource Usage**: Heavy MSU consumption at low skill levels

### 2. Foresight  
- **Approach**: Use extra points to peek at upcoming cards
- **Philosophy**: Information gathering for strategic planning
- **Resource Usage**: No MSU expenditure, relies on skill alone

### 3. Prevention
- **Approach**: Use extra points to discard problematic future cards
- **Philosophy**: Proactive complication avoidance
- **Resource Usage**: No MSU expenditure, moderate risk tolerance

### 4. Mixed
- **Approach**: Balance between foresight and prevention
- **Philosophy**: Flexible response to circumstances
- **Resource Usage**: No MSU expenditure, balanced risk profile

### 5. Resource Heavy
- **Approach**: Liberal MSU usage combined with conservative completion
- **Philosophy**: Guarantee success through resource expenditure
- **Resource Usage**: Maximum MSU consumption for reliability

## Results by Skill Level

### Untrained (25% Skill)
**Success Rates**: 20.4% average across all scenarios

| Injury Type | Strategy | Time to Contribute | Time to Heal | Success Rate | MSU Used | Efficiency |
|-------------|----------|-------------------|--------------|--------------|----------|------------|
| **2 Wounds (Light)** |
| | Conservative | 1.01 rounds | 2.0 rounds | 90.6% | 13.4 MSU | 0.068 |
| | Foresight | 1.01 rounds | 2.0 rounds | 19.6% | 0 MSU | ∞ |
| | Prevention | 1.00 rounds | 2.0 rounds | 16.6% | 0 MSU | ∞ |
| | Mixed | 1.00 rounds | 2.0 rounds | 20.6% | 0 MSU | ∞ |
| | Resource Heavy | 1.02 rounds | 2.0 rounds | 88.0% | 13.7 MSU | 0.064 |
| **3 Wounds (Moderate)** |
| | Conservative | 1.77 rounds | 3.0 rounds | 52.0% | 17.4 MSU | 0.030 |
| | Foresight | 1.60 rounds | 3.0 rounds | 8.4% | 0 MSU | ∞ |
| | Prevention | 1.62 rounds | 3.0 rounds | 10.4% | 0 MSU | ∞ |
| | Mixed | 1.39 rounds | 3.0 rounds | 10.0% | 0 MSU | ∞ |
| | Resource Heavy | 1.72 rounds | 3.0 rounds | 48.2% | 17.6 MSU | 0.027 |
| **4 Wounds (Severe)** |
| | Conservative | 2.45 rounds | 4.0 rounds | 12.6% | 18.9 MSU | 0.007 |
| | Foresight | 2.60 rounds | 4.0 rounds | 2.2% | 0 MSU | ∞ |
| | Prevention | 2.40 rounds | 4.0 rounds | 4.4% | 0 MSU | ∞ |
| | Mixed | 2.36 rounds | 4.0 rounds | 3.4% | 0 MSU | ∞ |
| | Resource Heavy | 2.68 rounds | 4.0 rounds | 11.6% | 18.9 MSU | 0.006 |
| **5 Wounds (Critical)** |
| | Conservative | 3.75 rounds | 5.0 rounds | 2.2% | 19.1 MSU | 0.001 |
| | Foresight | — | — | 1.8% | 0 MSU | ∞ |
| | Prevention | — | — | 2.0% | 0 MSU | ∞ |
| | Mixed | 5.00 rounds | 5.0 rounds | 1.2% | 0 MSU | ∞ |
| | Resource Heavy | 3.00 rounds | — | 2.0% | 19.1 MSU | 0.001 |

### Novice (45% Skill)
**Success Rates**: 52.0% average across all scenarios

| Injury Type | Strategy | Time to Contribute | Time to Heal | Success Rate | MSU Used | Efficiency |
|-------------|----------|-------------------|--------------|--------------|----------|------------|
| **2 Wounds (Light)** |
| | Conservative | 1.02 rounds | 2.0 rounds | 97.2% | 11.3 MSU | 0.086 |
| | Foresight | 1.01 rounds | 2.0 rounds | 65.2% | 0 MSU | ∞ |
| | Prevention | 1.01 rounds | 2.0 rounds | 66.2% | 0 MSU | ∞ |
| | Mixed | 1.02 rounds | 2.0 rounds | 62.2% | 0 MSU | ∞ |
| | Resource Heavy | 1.03 rounds | 2.0 rounds | 98.4% | 11.5 MSU | 0.086 |
| **3 Wounds (Moderate)** |
| | Conservative | 1.85 rounds | 3.0 rounds | 70.0% | 15.6 MSU | 0.045 |
| | Foresight | 1.76 rounds | 3.0 rounds | 56.0% | 0 MSU | ∞ |
| | Prevention | 1.78 rounds | 3.0 rounds | 55.6% | 0 MSU | ∞ |
| | Mixed | 1.77 rounds | 3.0 rounds | 55.6% | 0 MSU | ∞ |
| | Resource Heavy | 1.80 rounds | 3.0 rounds | 73.2% | 15.7 MSU | 0.047 |
| **4 Wounds (Severe)** |
| | Conservative | 2.88 rounds | 4.0 rounds | 39.6% | 17.9 MSU | 0.022 |
| | Foresight | 2.76 rounds | 4.0 rounds | 45.8% | 0 MSU | ∞ |
| | Prevention | 2.94 rounds | 4.0 rounds | 43.0% | 0 MSU | ∞ |
| | Mixed | 3.18 rounds | 4.0 rounds | 42.6% | 0 MSU | ∞ |
| | Resource Heavy | 2.79 rounds | 4.0 rounds | 36.8% | 18.2 MSU | 0.020 |
| **5 Wounds (Critical)** |
| | Conservative | 3.33 rounds | — | 11.0% | 18.9 MSU | 0.006 |
| | Foresight | 4.25 rounds | 5.0 rounds | 34.0% | 0 MSU | ∞ |
| | Prevention | 4.73 rounds | 5.0 rounds | 35.4% | 0 MSU | ∞ |
| | Mixed | 4.00 rounds | 5.0 rounds | 37.0% | 0 MSU | ∞ |
| | Resource Heavy | 3.83 rounds | 5.0 rounds | 14.6% | 18.8 MSU | 0.008 |

### Competent (60% Skill)
**Success Rates**: 80.1% average across all scenarios

| Injury Type | Strategy | Time to Contribute | Time to Heal | Success Rate | MSU Used | Efficiency |
|-------------|----------|-------------------|--------------|--------------|----------|------------|
| **2 Wounds (Light)** |
| | Conservative | 1.01 rounds | 2.0 rounds | 99.8% | 9.2 MSU | 0.109 |
| | Foresight | 1.03 rounds | 2.0 rounds | 94.8% | 0 MSU | ∞ |
| | Prevention | 1.01 rounds | 2.0 rounds | 92.8% | 0 MSU | ∞ |
| | Mixed | 1.02 rounds | 2.0 rounds | 92.2% | 0 MSU | ∞ |
| | Resource Heavy | 1.02 rounds | 2.0 rounds | 99.6% | 9.4 MSU | 0.106 |
| **3 Wounds (Moderate)** |
| | Conservative | 1.75 rounds | 3.0 rounds | 89.4% | 13.4 MSU | 0.067 |
| | Foresight | 1.94 rounds | 3.0 rounds | 87.4% | 0 MSU | ∞ |
| | Prevention | 1.89 rounds | 3.0 rounds | 88.0% | 0 MSU | ∞ |
| | Mixed | 1.96 rounds | 3.0 rounds | 90.0% | 0 MSU | ∞ |
| | Resource Heavy | 1.88 rounds | 3.0 rounds | 92.0% | 13.3 MSU | 0.069 |
| **4 Wounds (Severe)** |
| | Conservative | 3.10 rounds | 4.0 rounds | 64.0% | 16.4 MSU | 0.039 |
| | Foresight | 2.98 rounds | 4.0 rounds | 82.8% | 0 MSU | ∞ |
| | Prevention | 2.83 rounds | 4.0 rounds | 82.0% | 0 MSU | ∞ |
| | Mixed | 3.11 rounds | 4.0 rounds | 83.0% | 0 MSU | ∞ |
| | Resource Heavy | 2.98 rounds | 4.0 rounds | 64.0% | 16.6 MSU | 0.039 |
| **5 Wounds (Critical)** |
| | Conservative | 3.73 rounds | 5.0 rounds | 36.2% | 18.1 MSU | 0.020 |
| | Foresight | 3.92 rounds | 5.0 rounds | 79.0% | 0 MSU | ∞ |
| | Prevention | 4.00 rounds | 5.0 rounds | 79.2% | 0 MSU | ∞ |
| | Mixed | 4.80 rounds | 5.0 rounds | 77.0% | 0 MSU | ∞ |
| | Resource Heavy | 4.54 rounds | 5.0 rounds | 29.2% | 18.5 MSU | 0.016 |

### Expert (80% Skill)  
**Success Rates**: 98.3% average across all scenarios

| Injury Type | Strategy | Time to Contribute | Time to Heal | Success Rate | MSU Used | Efficiency |
|-------------|----------|-------------------|--------------|--------------|----------|------------|
| **2 Wounds (Light)** |
| | Conservative | 1.02 rounds | 2.0 rounds | 100.0% | 5.2 MSU | 0.192 |
| | Foresight | 1.02 rounds | 2.0 rounds | 99.8% | 0 MSU | ∞ |
| | Prevention | 1.01 rounds | 2.0 rounds | 100.0% | 0 MSU | ∞ |
| | Mixed | 1.04 rounds | 2.0 rounds | 99.8% | 0 MSU | ∞ |
| | Resource Heavy | 1.04 rounds | 2.0 rounds | 100.0% | 5.6 MSU | 0.178 |
| **3 Wounds (Moderate)** |
| | Conservative | 1.84 rounds | 3.0 rounds | 99.6% | 8.4 MSU | 0.118 |
| | Foresight | 1.95 rounds | 3.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 1.95 rounds | 3.0 rounds | 99.4% | 0 MSU | ∞ |
| | Mixed | 1.90 rounds | 3.0 rounds | 99.6% | 0 MSU | ∞ |
| | Resource Heavy | 1.73 rounds | 3.0 rounds | 99.0% | 8.8 MSU | 0.113 |
| **4 Wounds (Severe)** |
| | Conservative | 3.09 rounds | 4.0 rounds | 97.0% | 10.5 MSU | 0.092 |
| | Foresight | 3.15 rounds | 4.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 2.92 rounds | 4.0 rounds | 99.6% | 0 MSU | ∞ |
| | Mixed | 3.20 rounds | 4.0 rounds | 99.8% | 0 MSU | ∞ |
| | Resource Heavy | 3.12 rounds | 4.0 rounds | 97.4% | 10.9 MSU | 0.089 |
| **5 Wounds (Critical)** |
| | Conservative | 4.20 rounds | 5.0 rounds | 90.2% | 12.6 MSU | 0.072 |
| | Foresight | 4.57 rounds | 5.0 rounds | 99.8% | 0 MSU | ∞ |
| | Prevention | 4.15 rounds | 5.0 rounds | 99.8% | 0 MSU | ∞ |
| | Mixed | 4.08 rounds | 5.0 rounds | 99.4% | 0 MSU | ∞ |
| | Resource Heavy | 4.18 rounds | 5.0 rounds | 85.4% | 13.9 MSU | 0.061 |

### Master (95% Skill)
**Success Rates**: 100.0% average across all scenarios

| Injury Type | Strategy | Time to Contribute | Time to Heal | Success Rate | MSU Used | Efficiency |
|-------------|----------|-------------------|--------------|--------------|----------|------------|
| **2 Wounds (Light)** |
| | Conservative | 1.02 rounds | 2.0 rounds | 100.0% | 1.5 MSU | 0.681 |
| | Foresight | 1.02 rounds | 2.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 1.03 rounds | 2.0 rounds | 100.0% | 0 MSU | ∞ |
| | Mixed | 1.02 rounds | 2.0 rounds | 100.0% | 0 MSU | ∞ |
| | Resource Heavy | 1.03 rounds | 2.0 rounds | 100.0% | 1.8 MSU | 0.570 |
| **3 Wounds (Moderate)** |
| | Conservative | 2.08 rounds | 3.0 rounds | 100.0% | 2.4 MSU | 0.415 |
| | Foresight | 1.80 rounds | 3.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 2.03 rounds | 3.0 rounds | 100.0% | 0 MSU | ∞ |
| | Mixed | 1.79 rounds | 3.0 rounds | 100.0% | 0 MSU | ∞ |
| | Resource Heavy | 1.97 rounds | 3.0 rounds | 100.0% | 3.0 MSU | 0.335 |
| **4 Wounds (Severe)** |
| | Conservative | 2.89 rounds | 4.0 rounds | 100.0% | 3.2 MSU | 0.316 |
| | Foresight | 3.15 rounds | 4.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 3.07 rounds | 4.0 rounds | 100.0% | 0 MSU | ∞ |
| | Mixed | 3.04 rounds | 4.0 rounds | 100.0% | 0 MSU | ∞ |
| | Resource Heavy | 3.05 rounds | 4.0 rounds | 100.0% | 4.1 MSU | 0.245 |
| **5 Wounds (Critical)** |
| | Conservative | 4.20 rounds | 5.0 rounds | 100.0% | 3.8 MSU | 0.261 |
| | Foresight | 4.50 rounds | 5.0 rounds | 100.0% | 0 MSU | ∞ |
| | Prevention | 4.13 rounds | 5.0 rounds | 100.0% | 0 MSU | ∞ |
| | Mixed | 4.00 rounds | 5.0 rounds | 100.0% | 0 MSU | ∞ |
| | Resource Heavy | 4.15 rounds | 5.0 rounds | 100.0% | 5.2 MSU | 0.192 |

## Strategic Analysis

### Optimal Strategies by Scenario

#### Light Injuries (2 Wounds)
- **All Skill Levels**: Minimal strategic differences, ~1 round to contribution
- **Best Overall**: Prevention/Foresight for resource efficiency
- **Most Reliable**: Conservative/Resource Heavy with MSU backup

#### Moderate Injuries (3 Wounds)
- **Low Skill**: Conservative with MSU investment essential
- **Medium Skill**: Foresight emerges as optimal balance
- **High Skill**: Mixed/Foresight for speed, any strategy viable

#### Severe Injuries (4 Wounds)
- **Low Skill**: High failure rate regardless of strategy
- **Medium Skill**: Foresight/Prevention excel without resource cost
- **High Skill**: All strategies viable, Prevention slightly faster

#### Critical Injuries (5 Wounds)
- **Low Skill**: Extremely high failure rate, Conservative only viable option
- **Medium Skill**: Foresight/Prevention significantly outperform resource strategies
- **High Skill**: Mixed/Prevention optimal, Conservative reliable fallback

### Strategy Coefficient of Variation (Choice Impact)

| Skill Level | Light (2w) | Moderate (3w) | Severe (4w) | Critical (5w) |
|-------------|------------|---------------|-------------|---------------|
| Untrained   | 0.006 (LOW) | 0.091 (LOW) | 0.054 (LOW) | 0.258 (HIGH) |
| Novice      | 0.006 (LOW) | 0.019 (LOW) | 0.056 (LOW) | 0.128 (MOD) |
| Competent   | 0.009 (LOW) | 0.043 (LOW) | 0.038 (LOW) | 0.108 (MOD) |
| Expert      | 0.012 (LOW) | 0.050 (LOW) | 0.034 (LOW) | 0.045 (LOW) |
| Master      | 0.003 (LOW) | 0.069 (LOW) | 0.031 (LOW) | 0.044 (LOW) |

## Key Findings

### 1. Skill Level Impact
- **Clear Progression**: Distinct performance tiers with meaningful skill investment rewards
- **Breakpoints**: Major improvements at Competent (60%) and Expert (80%) levels
- **Reliability**: Master level achieves near-perfect success across all scenarios

### 2. Strategy Diversity
- **No Universal Dominant**: Different strategies excel in different contexts
- **Resource Trade-offs**: MSU investment provides reliability at cost of efficiency
- **Skill-Dependent Optimization**: Optimal strategies shift with practitioner capability

### 3. Failure Patterns
- **Severity Scaling**: Success rates decrease predictably with wound count
- **Skill Floors**: Critical injuries require minimum Novice skill for reasonable success
- **Resource Limits**: MSU constraints prevent guaranteed success at low skill levels

### 4. Treatment Time Predictability
- **Consistent Patterns**: Time to heal equals wound count when successful
- **Contribution Threshold**: Generally achievable in 1-2 rounds for light-moderate injuries
- **Severe Case Challenges**: 4-5 wound cases create meaningful medical emergencies

## Recommendations for Game Design

### Balanced Complexity
The medical system successfully avoids dominant strategy problems while maintaining meaningful player choices. Strategy selection remains relevant across skill levels, with particular importance for moderate-skill practitioners treating severe injuries.

### Resource Management
MSU consumption creates genuine resource pressure, especially for lower-skilled medics. The 20 MSU limit prevents guaranteed success through pure resource expenditure, maintaining tension and skill relevance.

### Skill Investment Value
Clear progression incentives exist, with each skill tier offering significant capability improvements. The system rewards medical specialization without making it mandatory for basic treatment.

### Emergency Scenarios
Critical injuries (5 wounds) create genuine emergencies requiring expert intervention, supporting the game's medical specialist roles and creating meaningful triage decisions.

## Conclusion

The Atomic Tomorrow Adventures medical card system demonstrates excellent balance between strategic depth and playability. The absence of universally dominant strategies, combined with meaningful skill progression and resource trade-offs, creates a system that rewards both tactical thinking and character development investment. The predictable scaling of injury severity provides clear stakes for different encounter types while maintaining system coherence.

---

*Analysis conducted using Monte Carlo simulation with 500 iterations per scenario across 5 skill levels, 5 strategies, and 4 injury types (2,500 total simulations per complete run).*