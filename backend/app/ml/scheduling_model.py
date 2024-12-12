from typing import List, Dict

def generate_schedule(forecasted_calls: List[float], num_agents_per_period: int) -> List[Dict[str, int]]:
    calls_per_agent = 100  # Each agent can handle 100 calls per week
    schedule = []

    for week, forecast in enumerate(forecasted_calls):
        agents_needed = max(1, min(
            num_agents_per_period,  # Cap at available agents
            int(forecast / calls_per_agent) + (1 if forecast % calls_per_agent > 0 else 0)
        ))
        
        schedule.append({
            "week": week + 1,
            "forecasted_calls": round(forecast),
            "agents_needed": agents_needed
        })
    
    return schedule