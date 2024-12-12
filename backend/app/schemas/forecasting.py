from pydantic import BaseModel
from typing import List

class ForecastRequest(BaseModel):
    num_weeks: int

class ForecastResponse(BaseModel):
    predictions: List[float]