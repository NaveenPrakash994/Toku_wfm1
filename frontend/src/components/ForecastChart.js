import React, { useState } from 'react';
import { getForecast } from '../services/api';
import '../styles/ForecastChart.css';

const ForecastChart = ({ setForecastData }) => {
    const [startWeek, setStartWeek] = useState('');
    const [endWeek, setEndWeek] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [localForecastData, setLocalForecastData] = useState([]);
    
    const handleGetForecast = async () => {
        // Validate input
        if (!startWeek || !endWeek) {
            setError("Please select both start and end weeks");
            return;
        }
        
        const start = parseInt(startWeek);
        const end = parseInt(endWeek);
        
        if (isNaN(start) || isNaN(end)) {
            setError("Please enter valid week numbers");
            return;
        }
        
        if (end < start) {
            setError("End week must be greater than or equal to start week");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const payload = { start_week: start, end_week: end };
            const predictions = await getForecast(payload);
            
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
                        onChange={(e) => setStartWeek(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter start week"
                    />
                </div>
                <div>
                    <label>End Week</label>
                    <input
                        type="number"
                        min="1"
                        value={endWeek}
                        onChange={(e) => setEndWeek(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter end week"
                    />
                </div>
            </div>
            
            <button 
                onClick={handleGetForecast}
                disabled={isLoading || !startWeek || !endWeek}
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
                                <span>Week {Math.floor(index / 3) + 1} Shift {(index % 3) + 1}</span>
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