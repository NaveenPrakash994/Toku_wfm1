from typing import List, Dict
import math

def generate_schedule(
    forecasted_calls: List[float], 
    num_agents_per_period: int, 
    max_calls_per_agent: int = 40,
    peak_buffer_ratio: float = 0.1
) -> List[Dict[str, float]]:
    """
    Advanced workforce scheduling with precise agent allocation.
    
    Args:
        forecasted_calls (List[float]): Predicted call volumes
        num_agents_per_period (int): Total available agents
        max_calls_per_agent (int): Maximum calls an agent can handle per shift
        peak_buffer_ratio (float): Buffer for peak load handling
    
    Returns:
        List[Dict[str, float]]: Detailed scheduling information
    """
    schedule = []
    
    # Debug print for input validation
    print(f"Total Available Agents: {num_agents_per_period}")
    print(f"Max Calls per Agent: {max_calls_per_agent}")
    
    for i, forecast in enumerate(forecasted_calls):
        # Precise agent calculation
        # 1. Base agents needed for forecasted calls
        base_agents_needed = math.ceil(forecast / max_calls_per_agent)
        
        # 2. Add peak load buffer
        peak_buffer = math.ceil(forecast * peak_buffer_ratio / max_calls_per_agent)
        
        # 3. Intelligent agent allocation
        # Ensure we don't exceed available agents while maintaining minimum coverage
        agents_needed = max(
            min(base_agents_needed + peak_buffer, num_agents_per_period),
            1  # Always at least one agent
        )
        
        # Calculate actual workload metrics
        calls_per_agent_actual = forecast / agents_needed if agents_needed > 0 else 0
        load_percentage = (calls_per_agent_actual / max_calls_per_agent) * 100
        
        schedule_entry = {
            "week": (i // 3) + 1,
            "shift": (i % 3) + 1,
            "forecasted_calls": round(forecast, 2),
            "agents_needed": int(agents_needed),
            "calls_per_agent": round(calls_per_agent_actual, 2),
            "load_percentage": round(load_percentage, 2),
            "is_optimal": 20 <= load_percentage <= 80  # Utilization check
        }
        
        schedule.append(schedule_entry)
    
    # Scheduling summary
    total_calls = sum(entry['forecasted_calls'] for entry in schedule)
    total_agents = sum(entry['agents_needed'] for entry in schedule)
    
    print("\n--- Scheduling Insights ---")
    print(f"Total Forecasted Calls: {total_calls}")
    print(f"Total Agents Deployed: {total_agents}")
    print(f"Average Calls per Agent: {total_calls / total_agents:.2f}")
    
    return schedule

def validate_schedule(schedule: List[Dict[str, float]], verbose: bool = True) -> bool:
    """
    Validate the generated schedule for workload balance.
    """
    issues = [entry for entry in schedule if not entry['is_optimal']]
    
    if verbose and issues:
        print("\n--- Schedule Balance Issues ---")
        for issue in issues:
            print(f"Week {issue['week']}, Shift {issue['shift']}: {issue['load_percentage']}% load")
    
    return len(issues) == 0

# Example Usage
def main():
    # Demonstrate with different scenarios
    scenarios = [
        {
            "forecasted_calls": [120, 80, 200, 50, 180, 90, 220, 110, 150],
            "num_agents": 10,
            "max_calls_per_agent": 40
        },
        {
            "forecasted_calls": [120, 80, 200, 50, 180, 90, 220, 110, 150],
            "num_agents": 20,
            "max_calls_per_agent": 40
        }
    ]
    
    for scenario in scenarios:
        print(f"\n--- Scenario: {scenario['num_agents']} Agents ---")
        schedule = generate_schedule(
            forecasted_calls=scenario['forecasted_calls'],
            num_agents_per_period=scenario['num_agents'],
            max_calls_per_agent=scenario['max_calls_per_agent']
        )
        
        # Print detailed schedule
        for entry in schedule:
            print(f"Week {entry['week']}, Shift {entry['shift']}: {entry['agents_needed']} agents")
        
        # Validate schedule
        is_valid = validate_schedule(schedule)
        print(f"Schedule Validity: {'Valid' if is_valid else 'Needs Review'}")

if __name__ == "__main__":
    main()