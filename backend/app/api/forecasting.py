from fastapi import APIRouter, HTTPException
from app.schemas.forecasting import ForecastRequest, ForecastResponse
from app.ml.forecast_model import load_data, forecast_calls
import os

router = APIRouter()

@router.post("", response_model=ForecastResponse)
async def forecast(data: ForecastRequest):
    try:
        # Load historical data
        historical_data = load_data()

        # Perform forecasting
        forecasted_calls = forecast_calls(historical_data, data.num_weeks)

        return {"predictions": forecasted_calls}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
