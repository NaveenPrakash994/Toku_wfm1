from pydantic import BaseModel
from typing import List, Dict

class SchedulingRequest(BaseModel):
    forecasted_calls: List[float]
    num_agents: int

class SchedulingResponse(BaseModel):
    schedule: List[Dict[str, int]]