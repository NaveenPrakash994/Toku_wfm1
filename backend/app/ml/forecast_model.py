import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import os
from typing import List

# Function to load historical data
def load_data() -> pd.DataFrame:
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'historical_data.csv')
    df = pd.read_csv(file_path)
    df['datetime'] = pd.to_datetime(df['datetime'])
    df.set_index('datetime', inplace=True)
    return df

# Function to forecast calls based on historical data
def forecast_calls(historical_data: pd.DataFrame, periods: int) -> List[float]:
    calls_per_shift = 40  # Each agent can handle 40 calls per 8-hour shift
    forecasted_calls_per_shift = []

    try:
        # Fit ARIMA model to the historical data
        model = ARIMA(historical_data['call_volume'], order=(5, 1, 0))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=periods)  # Forecast daily calls for multiple periods

        # Split daily calls into 3 shifts with variability
        for daily_forecast in forecast:
            daily_calls = max(0, daily_forecast)  # Ensure no negative calls
            calls_per_shift_day = [
                int(daily_calls * 0.5),  # Morning shift
                int(daily_calls * 0.3),  # Afternoon shift
                int(daily_calls * 0.2)   # Night shift
            ]
            forecasted_calls_per_shift.extend(calls_per_shift_day)

        return forecasted_calls_per_shift

    except Exception as e:
        print(f"Forecast error: {e}")
        return [100] * (periods * 3)  # Default forecast in case of failure