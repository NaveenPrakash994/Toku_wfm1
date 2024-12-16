from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.ml.scheduling_model import generate_schedule

router = APIRouter()

class ScheduleRequest(BaseModel):
    forecasted_calls: List[float]
    num_agents: int
    max_calls_per_agent: int = 40
    peak_buffer_ratio: float = 0.2

class ScheduleResponse(BaseModel):
    schedule: List[dict]

@router.post("", response_model=ScheduleResponse)
async def create_schedule(request: ScheduleRequest):
    try:
        schedule = generate_schedule(
            forecasted_calls=request.forecasted_calls,
            num_agents_per_period=request.num_agents,
            max_calls_per_agent=request.max_calls_per_agent,
            peak_buffer_ratio=request.peak_buffer_ratio
        )
        
        return {"schedule": schedule}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))