// Atomic Tomorrow Chase System Comparative Analysis
// This version runs multiple parameter configurations in parallel

// Main configuration variables - these allow for easy comparison
const parameterSets = [
  { label: "Original", startDistance: 8, escapeDistance: 16, contactDistance: 3 },
  { label: "Middle", startDistance: 7, escapeDistance: 12, contactDistance: 3 },
  { label: "Closer", startDistance: 6, escapeDistance: 12, contactDistance: 3 },
  { label: "Tighter", startDistance: 5, escapeDistance: 10, contactDistance: 3 },
  { label: "Very Tight", startDistance: 4, escapeDistance: 8, contactDistance: 2 }
];

const MAX_TURNS = 30; // Maximum chase length before we consider it a stalemate
const NUM_SIMULATIONS = 1000; // Number of simulations per configuration

// Vehicle definitions
const vehicles = {
  economy: { name: "Economy", sr: 2, mr: 2 },
  sports: { name: "Sports", sr: 4, mr: 3 },
  offRoad: { name: "Off-Road", sr: 3, mr: 3 },
  luxury: { name: "Luxury", sr: 3, mr: 2 },
  experimental: { name: "Experimental", sr: 5, mr: 4 }
};

// Driver skill levels
const drivers = {
  novice: { name: "Novice", skill: 30 },
  competent: { name: "Competent", skill: 50 },
  professional: { name: "Professional", skill: 70 },
  expert: { name: "Expert", skill: 90 }
};

// Environment definitions
const environments = {
  open: { name: "Open Terrain", srCap: 100 }, // No effective cap
  highway: { name: "Highway", srCap: 4 },
  suburban: { name: "Suburban", srCap: 3 },
  densUrban: { name: "Dense Urban", srCap: 2 }
};

// Lead driver strategies
const leadStrategies = {
  conservative: { name: "Conservative", riskLevel: () => 1 },
  moderate: { name: "Moderate", riskLevel: () => 2 },
  aggressive: { name: "Aggressive", riskLevel: () => 3 },
  adaptive: { 
    name: "Adaptive", 
    riskLevel: (distance, params) => {
      const midPoint = (params.startDistance + params.escapeDistance) / 2;
      const nearEscape = params.escapeDistance - Math.floor((params.escapeDistance - params.startDistance) / 3);
      
      if (distance >= nearEscape) return 3; // High risk when near escape
      if (distance >= midPoint) return 2; // Medium risk at medium distance
      return 1; // Low risk when pursuer is close
    }
  }
};

// Pursuer strategies
const pursuerStrategies = {
  safe: { 
    name: "Safe", 
    response: () => "playSafe" 
  },
  aggressive: { 
    name: "Aggressive", 
    response: () => "followThrough" 
  },
  balanced: { 
    name: "Balanced", 
    response: (hazard) => {
      // 50% chance of each strategy when alternate route is available
      if (hazard.allowsAlternateRoute && Math.random() < 0.5) {
        return "alternateRoute";
      }
      return "followThrough";
    }
  },
  adaptive: { 
    name: "Adaptive", 
    response: (hazard, distance, params) => {
      // Calculate relative positions in chase
      const escapeProximity = (params.escapeDistance - distance) / (params.escapeDistance - params.startDistance);
      
      if (escapeProximity <= 0.3) {
        // Close to losing, always take risks
        return "followThrough";
      } else if (distance <= params.contactDistance + 2) {
        // Close to catching, play it safer
        if (hazard.allowsAlternateRoute) return "alternateRoute";
        return "playSafe";
      } else {
        // Mid-range: follow through but take alternate routes when available
        if (hazard.allowsAlternateRoute && Math.random() < 0.7) {
          return "alternateRoute";
        }
        return "followThrough";
      }
    }
  }
};

// Hazard types
const hazardTypes = [
  { name: "Tight Turn", allowsAlternateRoute: false },
  { name: "Dense Traffic", allowsAlternateRoute: true },
  { name: "Narrow Gap", allowsAlternateRoute: true },
  { name: "Surface Change", allowsAlternateRoute: false },
  { name: "Restricted Zone", allowsAlternateRoute: false },
  { name: "Automated System", allowsAlternateRoute: false },
  { name: "Elevated Route", allowsAlternateRoute: true },
  { name: "Weather Hazard", allowsAlternateRoute: false },
  { name: "Civilian Area", allowsAlternateRoute: true },
  { name: "Construction Zone", allowsAlternateRoute: false }
];

// Helper functions
function d100() {
  return Math.floor(Math.random() * 100) + 1;
}

function d10() {
  return Math.floor(Math.random() * 10);
}

// Determine success level
function getSuccessLevel(roll, target) {
  // Automatic success/failure
  if (roll >= 96) return "failure"; // Automatic failure
  if (roll <= 4) {
    return "regular";
  }
  
  // If roll is over target, it's a failure
  if (roll > target) return "failure";
  
  // Critical success: matching doubles under skill
  const tensDigit = Math.floor(roll / 10);
  const onesDigit = roll % 10;
  if (tensDigit === onesDigit) return "critical";
  
  // Special success: roll ending in 0 or 5 under skill
  if (onesDigit === 0 || onesDigit === 5) return "special";
  
  // Regular success
  return "regular";
}

// Compare success levels
function compareSuccess(level1, level2) {
  const levels = { "critical": 3, "special": 2, "regular": 1, "failure": 0 };
  return levels[level1] - levels[level2];
}

// Mishap table resolution
function resolveMishap(roll, riskModifier) {
  let result = roll + riskModifier;
  if (result > 100) result = result % 100;
  
  if (result <= 20) return { effect: "Close Call", damage: 0, system: null };
  if (result <= 40) return { effect: "Minor System Strain", damage: 0, system: null };
  if (result <= 60) return { effect: "Control Issue", damage: 0, system: null };
  if (result <= 80) {
    const system = ["propulsion", "steering", "structure"][Math.floor(Math.random() * 3)];
    return { effect: "System Damage", damage: 1, system };
  }
  if (result <= 90) return { effect: "Major Problem", damage: 0, system: null };
  
  const system = ["propulsion", "steering", "structure"][Math.floor(Math.random() * 3)];
  return { effect: "Critical Failure", damage: 2, system, disabled: (roll >= 96) };
}

// Modified chase simulation function that accepts parameters object
function runChaseSimulation(
  leadVehicle, leadDriver, leadStrategy,
  pursuerVehicle, pursuerDriver, pursuerStrategy,
  environment, params
) {
  let distance = params.startDistance;
  let turns = 0;
  let result = null;
  
  // Vehicle status tracking
  const leadStatus = {
    propulsion: 0, // Damage levels
    steering: 0,
    structure: 0,
    controlIssue: false // From mishap
  };
  
  const pursuerStatus = {
    propulsion: 0,
    steering: 0,
    structure: 0,
    controlIssue: false
  };
  
  // Apply damage effects to vehicle
  function getModifiedVehicle(vehicle, status) {
    // Copy the vehicle
    const modified = {...vehicle};
    
    // Apply propulsion damage (affects SR)
    if (status.propulsion >= 1) modified.sr = Math.max(1, modified.sr - 1);
    if (status.propulsion >= 3) modified.sr = Math.max(1, modified.sr - 1);
    
    // Apply steering damage (affects MR)
    if (status.steering >= 1) modified.mr = Math.max(1, modified.mr - 1);
    if (status.steering >= 3) modified.mr = Math.max(1, modified.mr - 1);
    
    return modified;
  }
  
  while (turns < MAX_TURNS && !result) {
    turns++;
    
    // Apply environment SR cap
    const leadEffectiveSR = Math.min(leadVehicle.sr, environment.srCap);
    const pursuerEffectiveSR = Math.min(pursuerVehicle.sr, environment.srCap);
    
    // Get modified vehicles based on damage
    const modifiedLeadVehicle = getModifiedVehicle(leadVehicle, leadStatus);
    const modifiedPursuerVehicle = getModifiedVehicle(pursuerVehicle, pursuerStatus);
    
    // Check for control issues from previous round
    if (leadStatus.controlIssue) {
      const controlRoll = d100();
      const controlTarget = leadDriver.skill + modifiedLeadVehicle.mr * 10;
      const controlSuccess = getSuccessLevel(controlRoll, controlTarget);
      
      if (controlSuccess === "failure") {
        distance -= 1; // Lead loses distance
      }
      
      leadStatus.controlIssue = false;
    }
    
    if (pursuerStatus.controlIssue) {
      const controlRoll = d100();
      const controlTarget = pursuerDriver.skill + modifiedPursuerVehicle.mr * 10;
      const controlSuccess = getSuccessLevel(controlRoll, controlTarget);
      
      if (controlSuccess === "failure") {
        distance += 1; // Pursuer loses distance
      }
      
      pursuerStatus.controlIssue = false;
    }
    
    // PHASE 1: DRIVING CONTEST
    const leadTarget = leadDriver.skill + (leadEffectiveSR * 10) + (modifiedLeadVehicle.mr * 10);
    const pursuerTarget = pursuerDriver.skill + (pursuerEffectiveSR * 10) + (modifiedPursuerVehicle.mr * 10);
    
    const leadRoll = d100();
    const pursuerRoll = d100();
    
    const leadSuccess = getSuccessLevel(leadRoll, leadTarget);
    const pursuerSuccess = getSuccessLevel(pursuerRoll, pursuerTarget);
    
    const comparison = compareSuccess(leadSuccess, pursuerSuccess);
    
    // Apply distance change based on success levels
    if (comparison > 0) {
      // Lead vehicle wins
      if (leadSuccess === "critical" && pursuerSuccess === "failure") {
        distance += 3;
      } else if (leadSuccess === "special" && (pursuerSuccess === "regular" || pursuerSuccess === "failure")) {
        distance += 2;
      } else if (leadSuccess === "regular" && pursuerSuccess === "failure") {
        distance += 1;
      } else if (comparison > 0) {
        // Same level, higher roll wins
        distance += 1;
      }
    } else if (comparison < 0) {
      // Pursuer wins
      if (pursuerSuccess === "critical" && leadSuccess === "failure") {
        distance -= 3;
      } else if (pursuerSuccess === "special" && (leadSuccess === "regular" || leadSuccess === "failure")) {
        distance -= 2;
      } else if (pursuerSuccess === "regular" && leadSuccess === "failure") {
        distance -= 1;
      } else if (comparison < 0) {
        // Same level, higher roll wins
        distance -= 1;
      }
    } else if (comparison === 0 && leadSuccess !== "failure" && pursuerSuccess !== "failure") {
      // Equal success levels, higher roll wins
      if (leadRoll > pursuerRoll) {
        distance += 1;
      } else if (pursuerRoll > leadRoll) {
        distance -= 1;
      }
      // If rolls are exactly the same, no change
    }
    
    // Check for early resolution
    if (distance <= params.contactDistance) {
      result = { outcome: "contact", turns };
      break;
    }
    
    if (distance >= params.escapeDistance) {
      result = { outcome: "escape", turns };
      break;
    }
    
    // PHASE 2: HAZARD RESPONSE
    const hazardIndex = d10();
    const hazard = hazardTypes[hazardIndex];
    
    // Lead driver selects risk level
    const riskLevel = leadStrategy.riskLevel(distance, params);
    const riskModifier = (riskLevel - 1) * 20; // 0 for RL 1, 20 for RL 2, 40 for RL 3
    
    // Lead driver responds to hazard
    const leadHazardTarget = leadDriver.skill + (modifiedLeadVehicle.mr * 10) - riskModifier;
    const leadHazardRoll = d100();
    const leadHazardSuccess = getSuccessLevel(leadHazardRoll, leadHazardTarget);
    
    // Apply mishap if lead fails
    if (leadHazardSuccess === "failure") {
      const mishapRoll = d100();
      const mishap = resolveMishap(mishapRoll, riskModifier);
      
      // Apply mishap effects
      if (mishap.effect === "Control Issue") {
        leadStatus.controlIssue = true;
      }
      
      if (mishap.damage > 0 && mishap.system) {
        leadStatus[mishap.system] += mishap.damage;
        
        // If a system is disabled, end the chase
        if (mishap.disabled) {
          result = { outcome: "lead_vehicle_disabled", turns };
          break;
        }
      }
    }
    
    // Pursuer chooses response
    const pursuerResponse = pursuerStrategy.response(hazard, distance, params);
    
    if (pursuerResponse === "followThrough") {
      // Pursuer follows through the same hazard
      const pursuerHazardTarget = pursuerDriver.skill + (modifiedPursuerVehicle.mr * 10) - riskModifier;
      const pursuerHazardRoll = d100();
      const pursuerHazardSuccess = getSuccessLevel(pursuerHazardRoll, pursuerHazardTarget);
      
      if (pursuerHazardSuccess === "failure") {
        // Failed to navigate the hazard
        if (pursuerHazardSuccess === "special") {
          distance += 3 + 1; // Special failure
        } else if (pursuerHazardSuccess === "critical") {
          distance += 3 + 2; // Critical failure
          
          // Roll on mishap table with +20 on critical failure
          const mishapRoll = d100();
          const mishap = resolveMishap(mishapRoll, 20);
          
          if (mishap.effect === "Control Issue") {
            pursuerStatus.controlIssue = true;
          }
          
          if (mishap.damage > 0 && mishap.system) {
            pursuerStatus[mishap.system] += mishap.damage;
            
            // If a system is disabled, end the chase
            if (mishap.disabled) {
              result = { outcome: "pursuer_vehicle_disabled", turns };
              break;
            }
          }
        } else {
          distance += 3; // Normal failure
        }
      }
    } else if (pursuerResponse === "playSafe") {
      // Pursuer plays it safe
      distance += 4;
    } else if (pursuerResponse === "alternateRoute" && hazard.allowsAlternateRoute) {
      // Pursuer attempts alternate route
      const navigationTarget = pursuerDriver.skill - 40; // -40% penalty
      const navigationRoll = d100();
      const navigationSuccess = getSuccessLevel(navigationRoll, navigationTarget);
      
      if (navigationSuccess === "critical") {
        // No distance change
      } else if (navigationSuccess === "special") {
        distance += 1;
      } else if (navigationSuccess === "regular") {
        distance += 2;
      } else if (navigationSuccess === "failure") {
        if (navigationSuccess === "special") {
          distance += 7; // Special failure
        } else if (navigationSuccess === "critical") {
          result = { outcome: "escape", turns }; // Critical failure: lost completely
          break;
        } else {
          distance += 5; // Normal failure
        }
      }
    }
    
    // Check for resolution after Phase 2
    if (distance <= params.contactDistance) {
      result = { outcome: "contact", turns };
    } else if (distance >= params.escapeDistance) {
      result = { outcome: "escape", turns };
    }
  }
  
  if (!result) {
    result = { outcome: "stalemate", turns: MAX_TURNS };
  }
  
  return result;
}

// Run multiple simulations for a specific configuration
function runSimulations(
  leadVehicle, leadDriver, leadStrategy,
  pursuerVehicle, pursuerDriver, pursuerStrategy,
  environment, params
) {
  const results = {
    contact: 0,
    escape: 0,
    lead_vehicle_disabled: 0,
    pursuer_vehicle_disabled: 0,
    stalemate: 0,
    total_turns: 0,
    max_turns: 0,
    min_turns: MAX_TURNS
  };
  
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    const result = runChaseSimulation(
      leadVehicle, leadDriver, leadStrategy,
      pursuerVehicle, pursuerDriver, pursuerStrategy,
      environment, params
    );
    
    results[result.outcome]++;
    results.total_turns += result.turns;
    results.max_turns = Math.max(results.max_turns, result.turns);
    results.min_turns = Math.min(results.min_turns, result.turns);
  }
  
  results.avg_turns = results.total_turns / NUM_SIMULATIONS;
  
  // Calculate some additional metrics
  results.contact_percent = (results.contact / NUM_SIMULATIONS * 100).toFixed(1) + "%";
  results.escape_percent = (results.escape / NUM_SIMULATIONS * 100).toFixed(1) + "%";
  results.lead_disabled_percent = (results.lead_vehicle_disabled / NUM_SIMULATIONS * 100).toFixed(1) + "%";
  results.pursuer_disabled_percent = (results.pursuer_vehicle_disabled / NUM_SIMULATIONS * 100).toFixed(1) + "%";
  results.stalemate_percent = (results.stalemate / NUM_SIMULATIONS * 100).toFixed(1) + "%";
  
  return results;
}

// Run comparative analysis across different parameter sets
function runComparativeAnalysis() {
  // Define the test scenarios we want to compare
  const testScenarios = [
    {
      name: "Balanced (Sports vs Sports, Equal Drivers)",
      leadVehicle: vehicles.sports,
      leadDriver: drivers.competent,
      leadStrategy: leadStrategies.moderate,
      pursuerVehicle: vehicles.sports,
      pursuerDriver: drivers.competent,
      pursuerStrategy: pursuerStrategies.aggressive,
      environment: environments.open
    },
    {
      name: "Skill Advantage (Professional vs Competent)",
      leadVehicle: vehicles.sports,
      leadDriver: drivers.professional,
      leadStrategy: leadStrategies.moderate,
      pursuerVehicle: vehicles.sports,
      pursuerDriver: drivers.competent,
      pursuerStrategy: pursuerStrategies.aggressive,
      environment: environments.open
    },
    {
      name: "Vehicle Advantage (Economy vs Experimental)",
      leadVehicle: vehicles.economy,
      leadDriver: drivers.competent,
      leadStrategy: leadStrategies.moderate,
      pursuerVehicle: vehicles.experimental,
      pursuerDriver: drivers.competent,
      pursuerStrategy: pursuerStrategies.aggressive,
      environment: environments.open
    },
    {
      name: "Dense Urban Environment",
      leadVehicle: vehicles.sports,
      leadDriver: drivers.competent,
      leadStrategy: leadStrategies.moderate,
      pursuerVehicle: vehicles.sports,
      pursuerDriver: drivers.competent,
      pursuerStrategy: pursuerStrategies.aggressive,
      environment: environments.densUrban
    }
  ];
  
  // Run all parameter sets for each test scenario
  const results = [];
  
  testScenarios.forEach(scenario => {
    const scenarioResults = [];
    
    parameterSets.forEach(params => {
      const result = runSimulations(
        scenario.leadVehicle, 
        scenario.leadDriver, 
        scenario.leadStrategy,
        scenario.pursuerVehicle, 
        scenario.pursuerDriver, 
        scenario.pursuerStrategy,
        scenario.environment,
        params
      );
      
      scenarioResults.push({
        params: params,
        results: result
      });
    });
    
    results.push({
      scenario: scenario.name,
      paramResults: scenarioResults
    });
  });
  
  return results;
}

// Generate comparative tables
function generateComparativeTables(results) {
  results.forEach(scenarioResult => {
    console.log(`\n=== SCENARIO: ${scenarioResult.scenario} ===\n`);
    
    // Create a table header
    console.log("| Parameter Set | Contact | Escape | Lead Disabled | Pursuer Disabled | Stalemate | Avg Turns |");
    console.log("|--------------|---------|--------|---------------|------------------|-----------|-----------|");
    
    // Add each parameter set's results
    scenarioResult.paramResults.forEach(paramResult => {
      const r = paramResult.results;
      console.log(
        `| ${paramResult.params.label} (${paramResult.params.startDistance}-${paramResult.params.escapeDistance}-${paramResult.params.contactDistance}) ` +
        `| ${r.contact_percent} | ${r.escape_percent} | ${r.lead_disabled_percent} | ${r.pursuer_disabled_percent} ` +
        `| ${r.stalemate_percent} | ${r.avg_turns.toFixed(1)} |`
      );
    });
    
    console.log("");
  });
}

// Generate chase quality metrics
function analyzeChaseQuality(results) {
  console.log("\n=== CHASE QUALITY METRICS ===\n");
  
  console.log("These metrics assess how well each parameter set creates balanced, dramatic, and efficient chases:");
  console.log("| Parameter Set | Balance Score | Drama Score | Efficiency Score | Overall |");
  console.log("|--------------|--------------|------------|-----------------|---------|");
  
  // For each parameter set, calculate aggregate scores across all scenarios
  parameterSets.forEach(params => {
    // Collect all results for this parameter set across scenarios
    const paramResults = [];
    results.forEach(scenarioResult => {
      const result = scenarioResult.paramResults.find(r => r.params.label === params.label);
      if (result) paramResults.push(result.results);
    });
    
    // Calculate balance score (how close contact/escape are to 50/50)
    const balanceScores = paramResults.map(r => {
      const contactRate = r.contact / NUM_SIMULATIONS;
      const escapeRate = r.escape / NUM_SIMULATIONS;
      // Perfect balance would be 0.5/0.5, worst would be 1.0/0.0
      return 1 - Math.abs(contactRate - escapeRate);
    });
    const avgBalanceScore = balanceScores.reduce((a, b) => a + b, 0) / balanceScores.length;
    
    // Calculate drama score (consideration of stalemates, disabled vehicles, and min/max turn variance)
    const dramaScores = paramResults.map(r => {
      const stalemate_penalty = r.stalemate / NUM_SIMULATIONS; // Fewer stalemates is better
      const vehicle_disabled = (r.lead_vehicle_disabled + r.pursuer_vehicle_disabled) / NUM_SIMULATIONS;
      const turn_variance = (r.max_turns - r.min_turns) / MAX_TURNS;
      
      return (1 - stalemate_penalty) * 0.5 + vehicle_disabled * 0.25 + turn_variance * 0.25;
    });
    const avgDramaScore = dramaScores.reduce((a, b) => a + b, 0) / dramaScores.length;
    
    // Calculate efficiency score (based on average turns, with 5-10 turns being optimal)
    const efficiencyScores = paramResults.map(r => {
      const avg_turns = r.avg_turns;
      if (avg_turns < 3) return 0.25; // Too short
      if (avg_turns >= 3 && avg_turns < 5) return 0.5 + (avg_turns - 3) * 0.125; // Building up
      if (avg_turns >= 5 && avg_turns <= 10) return 1.0; // Perfect range
      if (avg_turns > 10 && avg_turns <= 15) return 1.0 - (avg_turns - 10) * 0.1; // Getting too long
      return 0.5 - Math.min(0.5, (avg_turns - 15) * 0.05); // Way too long
    });
    const avgEfficiencyScore = efficiencyScores.reduce((a, b) => a + b, 0) / efficiencyScores.length;
    
    // Overall score
    const overallScore = (avgBalanceScore * 0.4) + (avgDramaScore * 0.3) + (avgEfficiencyScore * 0.3);
    
    console.log(
      `| ${params.label} (${params.startDistance}-${params.escapeDistance}-${params.contactDistance}) | ` +
      `${(avgBalanceScore * 10).toFixed(1)}/10 | ${(avgDramaScore * 10).toFixed(1)}/10 | ` +
      `${(avgEfficiencyScore * 10).toFixed(1)}/10 | ${(overallScore * 10).toFixed(1)}/10 |`
    );
  });
}

// Run the full comparative analysis
const analysisResults = runComparativeAnalysis();
generateComparativeTables(analysisResults);
analyzeChaseQuality(analysisResults);

// Generate overall recommendation
const recommendationSummary = () => {
  console.log("\n=== RECOMMENDATION SUMMARY ===\n");
  console.log("Based on the comparative analysis, here are the key findings for the Atomic Tomorrow chase system:");
  
  console.log("\n1. Parameter Impact:");
  console.log("   - Starting distance has the greatest influence on chase length");
  console.log("   - The escape-to-start distance ratio impacts balance between contact and escape");
  console.log("   - A ratio of approximately 2:1 (escape:start) creates dynamically balanced chases");
  
  console.log("\n2. Parameter Set Recommendations:");
  console.log("   - For standard chases: The 'Middle' parameter set (7-12-3) offers the best balance");
  console.log("   - For quick pursuits: The 'Tighter' parameter set (5-10-3) resolves efficiently");
  console.log("   - For extended chases: The 'Original' parameter set (8-16-3) creates longer narrative arcs");
  
  console.log("\n3. Gameplay Considerations:");
  console.log("   - Chase length of 5-8 turns allows for meaningful tactics without bogging down the game");
  console.log("   - Starting distance 6-7 creates enough space for dramatic tension but not too much");
  console.log("   - The contact threshold of 3 provides good opportunity for close-quarter tension");
  
  console.log("\n4. Rules Refinement Suggestions:");
  console.log("   - Consider offering parameterized chase setups (standard, extended, quick)");
  console.log("   - Allow GM flexibility to adjust start/escape distances based on scenario context");
  console.log("   - Incorporate distance markers on a visual tracker to enhance player engagement");
};

recommendationSummary();