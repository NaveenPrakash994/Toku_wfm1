from typing import List, Dict
import random

def generate_schedule(forecasted_calls: List[float], num_agents_per_period: int) -> List[Dict[str, int]]:
    calls_per_agent = 40  # Each agent can handle 40 calls per 8-hour shift
    schedule = []

    for i, forecast in enumerate(forecasted_calls):
        # Base agents needed
        base_agents = max(1, int(forecast / calls_per_agent))

        # Buffer agents for high forecast
        buffer_agents = max(0, int((forecast - (calls_per_agent * 1.5)) / calls_per_agent))

        # Variability for real-world conditions
        variability_factor = random.uniform(0.8, 1.2)

        # Total agents calculation
        agents_needed = max(1, min(
            num_agents_per_period, 
            int((base_agents + buffer_agents) * variability_factor)
        ))

        # Assign week and shift
        week = (i // 3) + 1
        shift = (i % 3) + 1

        schedule.append({
            "week": week,
            "shift": shift,
            "forecasted_calls": round(forecast),
            "agents_needed": agents_needed
        })

    print("Generated Schedule:", schedule)
    return schedule
