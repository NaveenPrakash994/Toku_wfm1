import React, { useState } from 'react';
import { getForecast } from '../services/api';
import '../styles/ForecastChart.css';

const ForecastChart = ({ setForecastData }) => {
    const [startWeek, setStartWeek] = useState(1);
    const [endWeek, setEndWeek] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [localForecastData, setLocalForecastData] = useState([]);

    const handleGetForecast = async () => {
        if (endWeek < startWeek) {
            setError("End week must be greater than start week");
            return;
        }

        setIsLoading(true);
        setError(null);

        const data = { start_week: Number(startWeek), end_week: Number(endWeek) };

        try {
            const predictions = await getForecast(data);
            
            if (Array.isArray(predictions)) {
                const roundedPredictions = predictions.map(pred => Math.round(pred));
                setForecastData(roundedPredictions);
                setLocalForecastData(roundedPredictions);
            } else {
                throw new Error("Invalid prediction format");
            }
        } catch (error) {
            setError(error.message || "Forecast fetch failed");
            setForecastData([]);
            setLocalForecastData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forecast-chart">
            <h2>Workforce Forecast</h2>
            
            <div className="grid">
                <div>
                    <label>Start Week</label>
                    <input
                        type="number"
                        min="1"
                        value={startWeek}
                        onChange={(e) => setStartWeek(Math.max(1, Number(e.target.value)))}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label>End Week</label>
                    <input
                        type="number"
                        min="1"
                        value={endWeek}
                        onChange={(e) => setEndWeek(Math.max(1, Number(e.target.value)))}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <button 
                onClick={handleGetForecast} 
                disabled={isLoading}
                className="submit-button"
            >
                {isLoading ? "Loading..." : "Get Forecast"}
            </button>

            {error && <div className="error-message">{error}</div>}

            <div className="predictions">
                <h3>Predictions:</h3>
                {isLoading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : localForecastData.length > 0 ? (
                    <div className="predictions-grid">
                        {localForecastData.map((prediction, index) => (
                            <div key={index} className="grid-item">
                                <span>Week {index + 1}</span>
                                <p>{prediction}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No predictions available</p>
                )}
            </div>
        </div>
    );
};

export default ForecastChart;