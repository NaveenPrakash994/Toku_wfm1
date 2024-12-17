from typing import List, Dict
from pydantic import BaseModel

class SchedulingRequest(BaseModel):
    forecasted_calls: List[float]
    num_agents: int  # Number of agents available for each shift

class SchedulingResponse(BaseModel):
    schedule: List[Dict[str, int]]