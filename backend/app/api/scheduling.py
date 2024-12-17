from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.ml.scheduling_model import generate_schedule

router = APIRouter()

class ScheduleRequest(BaseModel):
    forecasted_calls: List[float]
    num_agents: int  # Changed from num_agents_per_period
    max_calls_per_agent: int = 40

class ScheduleResponse(BaseModel):
    schedule: List[dict]

@router.post("", response_model=ScheduleResponse)
async def create_schedule(request: ScheduleRequest):
    try:
        schedule = generate_schedule(
            forecasted_calls=request.forecasted_calls,
            num_agents=request.num_agents,  # Matches the function parameter
            max_calls_per_agent=request.max_calls_per_agent
        )
        
        return {"schedule": schedule}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))