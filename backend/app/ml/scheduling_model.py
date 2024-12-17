from typing import List, Dict
import math

def generate_schedule(
    forecasted_calls: List[float], 
    num_agents: int, 
    max_calls_per_agent: int = 40,
    utilization_target: float = 0.7,  # Target utilization rate
    peak_buffer_ratio: float = 0.2  # Buffer for peak loads
) -> List[Dict[str, float]]:
    """
    Advanced workforce scheduling with intelligent agent allocation.
    
    Args:
        forecasted_calls (List[float]): Predicted call volumes for each period
        num_agents (int): Total available agents
        max_calls_per_agent (int): Maximum calls an agent can handle per shift
        utilization_target (float): Target agent utilization rate
        peak_buffer_ratio (float): Additional buffer for handling peak loads
    
    Returns:
        List[Dict[str, float]]: Detailed scheduling information
    """
    schedule = []
    
    # Global statistics for tracking
    total_forecasted_calls = sum(forecasted_calls)
    
    # Find peak and average call volumes
    max_forecast = max(forecasted_calls)
    avg_forecast = sum(forecasted_calls) / len(forecasted_calls)
    
    for i, forecast in enumerate(forecasted_calls):
        # Intelligent agent allocation algorithm
        # 1. Base calculation: minimum agents needed
        base_agents_needed = math.ceil(forecast / max_calls_per_agent)
        
        # 2. Dynamic buffer calculation
        # More buffer for periods with high variance from average
        variance_factor = forecast / avg_forecast
        peak_buffer = math.ceil(
            forecast * (peak_buffer_ratio * variance_factor) / max_calls_per_agent
        )
        
        # 3. Soft capacity constraint
        # Ensure we have enough coverage while respecting total agent pool
        soft_max_agents = math.ceil(num_agents * 1.2)  # Allow slight overage
        agents_needed = max(
            min(base_agents_needed + peak_buffer, soft_max_agents),
            1  # Always at least one agent
        )
        
        # 4. Utilization calculation
        calls_per_agent = forecast / agents_needed if agents_needed > 0 else 0
        load_percentage = (calls_per_agent / max_calls_per_agent) * 100
        
        # 5. Utilization optimization
        # If utilization is too low or too high, adjust agents
        if load_percentage < utilization_target * 50:  # Very underutilized
            agents_needed = max(1, math.ceil(forecast / (max_calls_per_agent * utilization_target)))
        elif load_percentage > 100 / utilization_target:  # Overloaded
            agents_needed = math.ceil(forecast / (max_calls_per_agent * utilization_target))
        
        # Finalize schedule entry
        schedule_entry = {
            "week": (i // 3) + 1,
            "shift": (i % 3) + 1,
            "forecasted_calls": round(forecast, 2),
            "agents_needed": int(agents_needed),
            "calls_per_agent": round(calls_per_agent, 2),
            "load_percentage": round(load_percentage, 2),
            "is_optimal": 50 <= load_percentage <= 90  # Refined optimal range
        }
        
        schedule.append(schedule_entry)
    
    # Post-processing: global optimization
    total_schedule_agents = sum(entry['agents_needed'] for entry in schedule)
    
    # If total scheduled agents exceed available, redistribute
    if total_schedule_agents > num_agents * len(forecasted_calls):
        # Proportional reduction
        reduction_factor = num_agents * len(forecasted_calls) / total_schedule_agents
        for entry in schedule:
            entry['agents_needed'] = max(1, math.floor(entry['agents_needed'] * reduction_factor))
    
    # Logging and insights
    print("\n--- Scheduling Insights ---")
    print(f"Total Available Agents: {num_agents}")
    print(f"Total Forecasted Calls: {total_forecasted_calls}")
    print(f"Peak Forecast: {max_forecast}")
    print(f"Average Forecast per Period: {avg_forecast:.2f}")
    print(f"Total Agents Scheduled: {sum(entry['agents_needed'] for entry in schedule)}")
    
    return schedule

def validate_schedule(schedule: List[Dict[str, float]], verbose: bool = True) -> bool:
    """
    Validate the generated schedule for workload balance and efficiency.
    
    Args:
        schedule (List[Dict[str, float]]): Generated schedule
        verbose (bool): Print detailed insights
    
    Returns:
        bool: Whether schedule meets efficiency criteria
    """
    # Analyze schedule for potential improvements
    underutilized = [entry for entry in schedule if entry['load_percentage'] < 50]
    overloaded = [entry for entry in schedule if entry['load_percentage'] > 90]
    
    if verbose:
        if underutilized:
            print("\n--- Underutilized Shifts ---")
            for entry in underutilized:
                print(f"Week {entry['week']}, Shift {entry['shift']}: {entry['load_percentage']}% load")
        
        if overloaded:
            print("\n--- Overloaded Shifts ---")
            for entry in overloaded:
                print(f"Week {entry['week']}, Shift {entry['shift']}: {entry['load_percentage']}% load")
    
    return len(underutilized) == 0 and len(overloaded) == 0

# Example usage and testing
def main():
    # Test scenarios with different forecast patterns
    scenarios = [
        {
            "forecasted_calls": [120, 80, 200, 50, 180, 90, 220, 110, 150],
            "num_agents": 10,
            "max_calls_per_agent": 40
        },
        {
            "forecasted_calls": [300, 50, 250, 100, 200, 75, 280, 60, 180],
            "num_agents": 15,
            "max_calls_per_agent": 40
        }
    ]
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n=== Scenario {i} ===")
        schedule = generate_schedule(
            forecasted_calls=scenario['forecasted_calls'],
            num_agents=scenario['num_agents'],
            max_calls_per_agent=scenario['max_calls_per_agent']
        )
        
        # Print detailed schedule
        print("\nDetailed Schedule:")
        for entry in schedule:
            print(f"Week {entry['week']}, Shift {entry['shift']}: {entry['agents_needed']} agents "
                  f"({entry['load_percentage']}% load)")
        
        # Validate schedule
        is_valid = validate_schedule(schedule)
        print(f"\nSchedule Validity: {'Valid' if is_valid else 'Needs Review'}")

if __name__ == "__main__":
    main()