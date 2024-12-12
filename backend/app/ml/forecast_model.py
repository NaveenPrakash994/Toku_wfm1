import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import numpy as np
import os
from typing import List

def load_data() -> pd.DataFrame:
    # Use a relative path from the project root
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'historical_data.csv')
    df = pd.read_csv(file_path)
    df['week'] = pd.to_datetime(df['week'])
    df.set_index('week', inplace=True)
    return df

def forecast_calls(historical_data: pd.DataFrame, periods: int) -> List[float]:
    try:
        model = ARIMA(historical_data['call_volume'], order=(5, 1, 0))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=periods)
        return [max(0, value) for value in forecast.tolist()]  # Ensure non-negative values
    except Exception as e:
        print(f"Forecast error: {e}")
        # Return a default forecast if model fails
        return [100] * periods