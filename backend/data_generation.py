import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Generate dates for 52 weeks (1 year)
start_date = datetime(2023, 1, 1)
dates = [start_date + timedelta(weeks=i) for i in range(52)]

# Create base call volume with seasonal patterns
def generate_call_volume():
    # Base weekly call volume with some randomness
    base_volume = 1000  # Average weekly calls
    
    # Seasonal variations
    seasonal_pattern = [
        1.2,  # Jan - Higher volume after holidays
        1.1,  # Feb
        1.0,  # Mar
        0.9,  # Apr
        1.0,  # May
        1.1,  # Jun - Start of summer
        0.8,  # Jul - Summer slowdown
        0.7,  # Aug - Vacation season
        0.9,  # Sep - Back to work/school
        1.0,  # Oct
        1.1,  # Nov - Holiday shopping starts
        1.3   # Dec - Peak holiday season
    ]
    
    # Generate weekly call volumes
    volumes = []
    for i in range(52):
        # Base volume with seasonal adjustment
        seasonal_mult = seasonal_pattern[i % 12]
        
        # Add some random variation
        random_variation = np.random.normal(1, 0.1)
        
        # Weekly trend (slight growth over the year)
        trend_mult = 1 + (i * 0.001)
        
        # Calculate final volume
        volume = base_volume * seasonal_mult * random_variation * trend_mult
        volumes.append(max(0, volume))
    
    return volumes

# Create DataFrame
df = pd.DataFrame({
    'week': dates,
    'call_volume': generate_call_volume()
})

# Round call volumes to integers
df['call_volume'] = df['call_volume'].round().astype(int)

# Format date as YYYY-MM-DD
df['week'] = df['week'].dt.strftime('%Y-%m-%d')

# Save to CSV
df.to_csv('backend/app/data/historical_data.csv', index=False)

# Display first few rows to verify
print(df.head())
print("\nDataset Statistics:")
print(df['call_volume'].describe())