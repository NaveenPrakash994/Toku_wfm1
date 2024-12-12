from fastapi import APIRouter, HTTPException
from app.schemas.scheduling import SchedulingRequest, SchedulingResponse
from app.ml.scheduling_model import generate_schedule

router = APIRouter()

@router.post("", response_model=SchedulingResponse)
async def schedule(data: SchedulingRequest):
    try:
        # Generate schedule
        schedule = generate_schedule(data.forecasted_calls, data.num_agents)
        
        return {"schedule": schedule}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))